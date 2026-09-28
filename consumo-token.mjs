/**
 * consumo-token.mjs — ¿DÓNDE se consume este token? Con cobertura declarada.
 *
 * POR QUÉ EXISTE
 * --------------
 * El 21 sep 2026 se declararon cuatro tokens «sin uso» —`radius/xl`, `borderColor`,
 * `width/l`, `width/xl`— y los CUATRO estaban consumidos. No fue descuido: fue que
 * cada medición se hizo a mano, sobre el universo que se tenía delante, y el
 * resultado salió con la forma correcta y sin hueco visible. Falso completo.
 *
 * 🔴 Y volvió a pasar: el 28 sep el bloque F se relanzó sobre esa misma lista,
 *    ya corregida cinco días antes. Una medición a mano no deja mecanismo detrás.
 *
 * LO QUE ESTE COMANDO GARANTIZA, y es lo que fallaba:
 *   1. CONTROL DE MÉTODO — mide dos tokens que SABEMOS consumidos antes de
 *      afirmar nada. Si los controles salen 0, ABORTA con código 1 en vez de
 *      informar «sin consumo».
 *   2. UNIVERSO COMPLETO — las 32 páginas de `[Auditoria]`, no el Playground.
 *   3. TODAS LAS PROPIEDADES — `individualStrokeWeights` incluida: el grosor se
 *      expande por lado y la clave agregada NO EXISTE. Barrer buscando `radius`
 *      fue lo que escondió `width/l` en `Alerts` y `Select`.
 *   4. LOS NATIVOS DE SUPERNOVA — `origin: null`. No están en Figma y este
 *      barrido NO PUEDE verlos: se declaran aparte, nunca como «sin consumo».
 *   5. LOS LÍMITES SE IMPRIMEN SIEMPRE, no solo cuando el resultado es cero.
 *
 *   npm run tokens:consumo -- width/l radius/xl
 *   npm run tokens:consumo -- --cache width/l
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { traerArbol, barrer } from "./lint-figma.mjs"
const { Supernova } = sdkPkg

const args = process.argv.slice(2)
const USAR_CACHE = args.includes("--cache")
const patrones = args.filter(a => !a.startsWith("--"))
if (!patrones.length) {
  console.error("Uso: npm run tokens:consumo -- <patrón> [<patrón>…]  (nombre o fragmento, p. ej. width/l)")
  process.exit(1)
}

/* Dos tokens que SABEMOS consumidos. Si estos salen 0, el método está roto. */
const CONTROLES = [
  { id: "VariableID:3481:3696", nombre: "radius/xs" },
  { id: "VariableID:9146:96",   nombre: "radius/xl" },
]

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const tokens = await sdk.tokens.getTokens(from)
const grupos = await sdk.tokens.getTokenGroups(from)
const gById = new Map(grupos.map(g => [g.id, g]))
const ruta = g => { const p = []; let x = g; while (x) { p.unshift(x.name); x = x.parentGroupId ? gById.get(x.parentGroupId) : null } return p.join("/") }
/* 🔴 En un token NATIVO de Supernova `origin` es null y el nombre cae al pelado,
 * SIN la ruta del grupo. Por eso se compone con `parentGroupId`: leer solo `name`
 * fue lo que hizo pasar `borderColor` por huérfano estando en `graphs/basicConfig`. */
const nom = t => t.origin?.name ?? (t.parentGroupId && gById.has(t.parentGroupId) ? `${ruta(gById.get(t.parentGroupId))}/${t.name}` : t.name)

const ficheros = await traerArbol({ usarCache: USAR_CACHE })
const { bindings, nodos } = barrer(ficheros)
const porOrigen = new Map()
for (const t of tokens) if (t.origin?.id) porOrigen.set(t.origin.id, t)
const empalmados = bindings.filter(b => porOrigen.has(b.variableId))
const cobertura = ((empalmados.length / bindings.length) * 100).toFixed(0)

console.log(`\n\x1b[1m🔍 Barrido\x1b[0m`)
console.log(`   nodos: ${nodos} · bindings: ${bindings.length} · 32 de 32 páginas de [Auditoria]`)
console.log(`   empalme con Supernova: ${empalmados.length} de ${bindings.length} = ${cobertura}%`)

/* ── 1 · CONTROL DE MÉTODO. Antes de afirmar nada. ───────────────────────── */
console.log(`\n\x1b[1m🧪 Control de método\x1b[0m`)
let controlOk = true
for (const c of CONTROLES) {
  const n = bindings.filter(b => b.variableId === c.id).length
  console.log(`   ${n > 0 ? "🟢" : "🔴"} ${c.nombre.padEnd(12)} ${n} bindings`)
  if (n === 0) controlOk = false
}
if (!controlOk) {
  console.log(`\n🔴 ABORTADO: un token que SABEMOS consumido sale con 0 bindings.`)
  console.log(`   Eso no dice «no se usa»: dice que este barrido no ve lo que busca.`)
  process.exit(1)
}

/* ── 2 · Los candidatos ───────────────────────────────────────────────────── */
let conConsumo = 0, sinConsumo = 0, nativos = 0
for (const p of patrones) {
  const encontrados = tokens.filter(t => nom(t) === p || nom(t).includes(p))
  console.log(`\n\x1b[1m═══ ${p}\x1b[0m — ${encontrados.length} token(s) coinciden`)
  if (!encontrados.length) { console.log(`   ⚠️  ningún token con ese nombre. Revisa el patrón antes de concluir.`); continue }
  for (const t of encontrados) {
    console.log(`\n   ${nom(t)}  ·  ${t.tokenType}  ·  idInVersion ${t.idInVersion}`)
    if (!t.origin?.id) {
      nativos++
      console.log(`      ⚪ NATIVO de Supernova (origin: null). NO viene de Figma.`)
      console.log(`         🔴 Este barrido NO PUEDE ver su consumo. No es «sin uso»: es fuera de alcance.`)
      const g = t.parentGroupId ? gById.get(t.parentGroupId) : null
      if (g) {
        const herms = tokens.filter(x => x.parentGroupId === g.id)
        console.log(`         grupo \`${ruta(g)}\` con ${herms.length - 1} hermanos — retirarlo rompe el juego.`)
      }
      continue
    }
    const hits = bindings.filter(b => b.variableId === t.origin.id)
    const masters = hits.filter(h => !h.esInstancia)
    if (hits.length) conConsumo++; else sinConsumo++
    console.log(`      bindings: ${hits.length}  (masters ${masters.length} · instancias ${hits.length - masters.length})`)
    const porCat = {}
    for (const h of hits) (porCat[`${h.categoriaEsperada ?? "?"} / ${h.prop}`] ??= []).push(h)
    for (const [k, arr] of Object.entries(porCat).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`      · ${k.padEnd(36)} ${String(arr.length).padStart(5)} (${arr.filter(x => !x.esInstancia).length} masters)`)
      const sitios = [...new Set(arr.map(a => `${a.pagina} › ${a.master || a.name}`))]
      for (const s of sitios.slice(0, 6)) console.log(`           ${s}`)
      if (sitios.length > 6) console.log(`           … y ${sitios.length - 6} sitios más`)
    }
    if (!hits.length) console.log(`      🟡 SIN CONSUMO ENCONTRADO — lee los límites de abajo antes de retirarlo.`)
  }
}

/* ── 3 · Los límites. SIEMPRE, no solo cuando sale cero. ──────────────────── */
console.log(`\n\x1b[1m⚠️  Lo que este comando NO puede afirmar\x1b[0m`)
console.log(`   · el empalme cubre el ${cobertura}% de los bindings — el resto es librería remota,`)
console.log(`     y ningún check puede afirmar nada sobre ella`)
console.log(`   · el archivo de PRODUCTO no es éste: un token sin uso aquí puede tenerlo allá`)
console.log(`   · un token puede consumirse DESDE OTRO TOKEN, no desde un nodo`)
console.log(`   · los nativos de Supernova (origin: null) quedan fuera del barrido por construcción`)
console.log(`\n   cobertura del encargo: ${conConsumo} con consumo · ${sinConsumo} sin consumo encontrado · ${nativos} fuera de alcance (nativos)`)
console.log(`   🔴 «sin consumo encontrado» NO ES «nadie lo usa».`)
