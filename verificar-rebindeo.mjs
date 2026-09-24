/**
 * verificar-rebindeo.mjs — ¿quedó cada nodo bindeado al token que decía el plan?
 *
 * POR QUÉ EXISTE
 * --------------
 * El 24 sep 2026 se rebindearon 22 nodos con dos scripts de Scripter. Cada uno
 * emitió su cobertura `n de N` al correr… y esas salidas NO SE CONSERVARON.
 * La comprobación se rehizo a mano, y **el denominador salió mal a la primera**:
 * se pidió verificar 20 nodos y eran 22 — los 20 del alcance más dos que no
 * pertenecían a esos componentes.
 *
 * 🔴 Ésa es la lección, y es la E3 del FODA: *una regla que exige que alguien se
 * acuerde no se ejecuta*. Un mecanismo emite la cobertura solo, y su denominador
 * sale del plan, no de la memoria de nadie.
 *
 * QUÉ PRUEBA, Y QUÉ NO — se imprime también en la salida, no solo aquí
 *   ✅ Prueba el ESTADO FINAL de los nodos que el plan declara.
 *   🔴 NO prueba que un script no escribiera FUERA de su plan. Un nodo que nadie
 *      listó no se mira, y esa ausencia no se puede distinguir de la corrección.
 *
 * LAS TRES TRAMPAS QUE CUBRE
 *   1. EL CACHÉ MIDE EL PASADO. Tras aplicar un rebindeo, el árbol en disco es
 *      el de ANTES: verificar contra él devuelve «sin cambios» y se lee como
 *      fallo del rebindeo. Por eso lee FRESCO por defecto, y `--cache` grita.
 *   2. EL EMPALME VA POR `origin.id`, NUNCA POR NOMBRE. Buscar por nombre ya
 *      costó una discusión entera con `radius/circle`: el nombre es lo que
 *      cambia. El plan nombra el token; el script resuelve su id y compara ids.
 *   3. LAS CLAVES POR LADO. `rectangleCornerRadii` e `individualStrokeWeights`
 *      se expanden a una clave por lado y la clave agregada NO EXISTE. El plan
 *      las declara una a una, así que un lado sin bindear se ve.
 *
 * USO
 *   npm run rebindeo:verificar                       # plan por defecto, Figma fresco
 *   npm run rebindeo:verificar -- --plan otro.json   # otro plan
 *   npm run rebindeo:verificar -- --cache            # rápido, y AVISA de lo que arriesga
 *
 * EL PLAN, que es la entrada
 *   JSON con `grupos[]`. Cada grupo: `destino` + `coleccion` (para resolver el
 *   token), `nodos[]`, y o bien `prop` + `claves[]` (radios, grosores) o bien
 *   `prop` + `eje` (`size.y` = alto, `size.x` = ancho).
 *   Ejemplo vivo: `planes-rebindeo/2026-09-24-cruces-L1.json`.
 *
 * Sale con código 1 si la cobertura no es total.
 */
import sdkPkg from "@supernovaio/sdk"
import { readFileSync } from "node:fs"
import path from "node:path"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { traerArbol } from "./lint-figma.mjs"
const { Supernova } = sdkPkg

const argv = process.argv.slice(2)
const USAR_CACHE = argv.includes("--cache")
const iPlan = argv.indexOf("--plan")
const RUTA = iPlan >= 0 && argv[iPlan + 1] ? argv[iPlan + 1] : "planes-rebindeo/2026-09-24-cruces-L1.json"

const b = s => `\x1b[1m${s}\x1b[0m`
const plan = JSON.parse(readFileSync(path.resolve(RUTA), "utf8"))

console.log(`\n${b(`Plan: ${plan.nombre}`)}  (${plan.fecha})`)
console.log(`   ${RUTA}`)
if (plan.nota) console.log(`   ${plan.nota}`)
if (plan.fuera) console.log(`   FUERA DEL PLAN A PROPÓSITO: ${plan.fuera}`)

if (USAR_CACHE) {
  console.log(`\n\x1b[1m🔴 --cache: PUEDES ESTAR MIDIENDO UN ESTADO ANTERIOR.\x1b[0m`)
  console.log(`   El árbol en disco es de la última descarga. Si el rebindeo se aplicó DESPUÉS,`)
  console.log(`   esto informará "sin cambios" y se leerá como que el rebindeo falló.`)
  console.log(`   Un resultado con --cache no cierra nada. Vuelve a correr sin él antes de dar fe.`)
}

/* ── 1 · Resolver los tokens destino a su origin.id ───────────────────────── */
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const tokens = await sdk.tokens.getTokens(from)
const props = await sdk.tokens.getTokenProperties(from)
const cp = props.find(p => p.codeName === "collection")
if (!cp) { console.error("🔴 No existe la propiedad `collection`. Abortado: sin ella no se distinguen tokens homónimos."); process.exit(1) }
const op = new Map((cp.options ?? []).map(o => [o.id, o.name]))
const col = t => op.get((t.propertyValues ?? {})["collection"]) ?? null
const nom = t => t.origin?.name ?? t.name

console.log(`\n${b("🔑 · Destinos, resueltos a origin.id")}`)
const DEST = new Map()
let sinResolver = 0
for (const g of plan.grupos) {
  const clave = `${g.destino}|${g.coleccion}`
  if (DEST.has(clave)) continue
  const t = tokens.find(x => nom(x) === g.destino && col(x) === g.coleccion)
  if (!t?.origin?.id) { console.log(`   🔴 ${g.destino} [${g.coleccion}] NO RESUELVE`); sinResolver++; continue }
  DEST.set(clave, { id: t.origin.id, valor: t.value?.measure })
  console.log(`   ${g.destino} [${g.coleccion}] = ${t.value?.measure} · ${t.origin.id}`)
}
if (sinResolver) {
  console.log(`\n🔴 ABORTADO: ${sinResolver} destino(s) del plan no existen en Supernova.`)
  console.log(`   Verificar contra un token que no existe daría "discrepa" en todos sus nodos,`)
  console.log(`   y eso se leería como un rebindeo fallido en vez de como un plan desactualizado.`)
  process.exit(1)
}

/* ── 2 · Figma ────────────────────────────────────────────────────────────── */
console.log(`\n${b("🔍 · Leyendo Figma")}${USAR_CACHE ? " (caché)" : " (fresco)"}`)
const ficheros = await traerArbol({ usarCache: USAR_CACHE })
const nodos = new Map()
for (const f of ficheros) {
  const j = JSON.parse(readFileSync(f, "utf8"))
  const walk = n => { nodos.set(n.id, n); for (const c of n.children ?? []) walk(c) }
  for (const d of Object.values(j.nodes ?? {})) walk(d.document)
}
console.log(`   nodos indexados: ${nodos.size}`)
if (nodos.size === 0) {
  console.log(`\n🔴 CONTROL DE MÉTODO FALLIDO: 0 nodos indexados. No es "todo mal": es que no se leyó nada.`)
  process.exit(1)
}

/* ── 3 · Comparar, nodo a nodo y clave a clave ────────────────────────────── */
console.log(`\n${b("📐 · Cobertura por grupo")}`)
const discrepa = [], noVerificable = []
let nodosOk = 0, nodosTot = 0, bOk = 0, bTot = 0

for (const g of plan.grupos) {
  const esperado = DEST.get(`${g.destino}|${g.coleccion}`).id
  let gNodosOk = 0, gB = 0, gBOk = 0
  for (const id of g.nodos) {
    nodosTot++
    const n = nodos.get(id)
    if (!n) { noVerificable.push(`${g.grupo} · ${id} — la REST no lo expone en las páginas barridas`); continue }
    const bv = n.boundVariables || {}
    const claves = g.eje ? [g.eje] : g.claves
    let bien = 0, detalle = []
    for (const k of claves) {
      bTot++; gB++
      const got = (g.eje ? bv[g.prop]?.[k]?.id : bv[g.prop]?.[k]?.id) ?? null
      if (got === esperado) { bien++; bOk++; gBOk++ }
      else detalle.push(`${g.prop}${g.eje ? "." : "·"}${k} = ${got ?? "(sin binding)"}`)
    }
    if (bien === claves.length) { nodosOk++; gNodosOk++ }
    else discrepa.push(`${g.grupo} · ${id} (${n.name}) → esperaba ${g.destino} [${esperado}] · real: ${detalle.join(" · ")}`)
  }
  const marca = gNodosOk === g.nodos.length ? "🟢" : "🔴"
  console.log(`   ${marca} ${g.grupo} → ${g.destino}: ${gNodosOk} de ${g.nodos.length} nodos · ${gBOk} de ${gB} bindings`)
}

/* ── 4 · Veredicto, con las TRES categorías separadas ─────────────────────── */
console.log(`\n${b("── COBERTURA ──")}`)
console.log(`   coincide:          ${nodosOk} de ${nodosTot} nodos · ${bOk} de ${bTot} bindings`)
console.log(`   discrepa:          ${discrepa.length}`)
for (const x of discrepa) console.log(`      🔴 ${x}`)
console.log(`   no verificable:    ${noVerificable.length}   (con este método, no "correcto")`)
for (const x of noVerificable) console.log(`      ⚠️  ${x}`)

console.log(`\n${b("Lo que esto prueba, y lo que no")}`)
console.log(`   ✅ Prueba el ESTADO FINAL de los ${nodosTot} nodos que el plan declara.`)
console.log(`   🔴 NO prueba que un script no escribiera FUERA de su plan: un nodo que nadie`)
console.log(`      listó no se mira, y esa ausencia no se distingue de la corrección.`)
console.log(`   ⚠️  "No verificable" NO es "correcto". Si esa cifra no es 0, la cobertura`)
console.log(`      real es menor que la que dice la primera línea.`)

const total = nodosOk === nodosTot && discrepa.length === 0 && noVerificable.length === 0
console.log("")
if (total) { console.log(`🟢 verificar-rebindeo — ${nodosOk} de ${nodosTot} nodos, cobertura TOTAL.`); process.exit(0) }
console.log(`🔴 verificar-rebindeo — COBERTURA NO TOTAL: ${nodosOk} de ${nodosTot} nodos · ${discrepa.length} discrepan · ${noVerificable.length} no verificables.`)
process.exit(1)
