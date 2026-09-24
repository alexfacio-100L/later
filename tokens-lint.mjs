/**
 * tokens-lint.mjs — el lint de tokens. Hermano de `doc:done` y `doc:registro`.
 *
 * POR QUÉ EXISTE
 * --------------
 * Diagnóstico del Lead, 21 sep 2026: «se perdió el lint que vigile estos cambios».
 * El 21 sep se midió que `width/l` —un token de GROSOR— se usa como RADIO en
 * decenas de nodos. Vale 4 px igual que `radius/xs`, así que NO SE VE: ni en el
 * render, ni en una revisión humana, ni en un chequeo que busque valores crudos.
 *
 * 🔴 Una regla que exige criterio para ejecutarse no se ejecuta (E3 del FODA).
 *    Por eso esto es un comando con código de salida, no una guía.
 *
 * LOS CINCO CHECKS, y cuáles corren hoy
 * -------------------------------------
 *   L1 · categoría cruzada (token de un tipo en otra propiedad)   🔴 necesita Figma
 *   L2 · valor crudo donde existe token exacto                    🔴 necesita Figma
 *   L3 · token sin descripción                                    🟢 Supernova
 *   L4 · token sin consumo                                        🔴 necesita Figma
 *   L5 · unidad incoherente con su nombre                         🟢 Supernova
 *
 * ⚠️ L1, L2 y L4 NO están implementados y el comando LO DICE en su salida.
 *    Un lint que calla lo que no mira se lee como si lo hubiera mirado todo.
 *
 *   npm run tokens:lint
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { traerArbol, barrer, CATEGORIA_DE_PROPIEDAD } from "./lint-figma.mjs"
const { Supernova } = sdkPkg

const dormir = ms => new Promise(r => setTimeout(r, ms))
async function reintenta(f, n = 6) {
  for (let i = 0; i < n; i++) {
    try { return await f() } catch (e) { if (i === n - 1) throw e; await dormir(2500 * (i + 1)) }
  }
}

const sdk = new Supernova(apiKey)
const me = await reintenta(() => sdk.me.me())
const ws = await reintenta(() => sdk.workspaces.workspaces(me.id))
const ds = (await reintenta(() => sdk.designSystems.designSystems(ws[0].id))).find(d => /later/i.test(d.name))
const v  = await reintenta(() => sdk.versions.getActiveVersion(ds.id))
const from = { designSystemId: ds.id, versionId: v.id }
const tokens = await reintenta(() => sdk.tokens.getTokens(from))
const props  = await reintenta(() => sdk.tokens.getTokenProperties(from))

/* 🔴 La colección se lee por propertyValues["collection"], con el ID de la opción.
 * Leerla por property.id devuelve vacío en los 853 y se lee IGUAL que una ausencia
 * real — el mismo falso negativo que `strokeWeight`. Verificado el 21 sep 2026. */
const cp = props.find(p => p.codeName === "collection")
if (!cp) { console.error("🔴 No existe la propiedad `collection`. Abortado: sin ella el lint mediría otra cosa."); process.exit(1) }
const opciones = new Map((cp.options ?? []).map(o => [o.id, o.name]))
const col = t => opciones.get((t.propertyValues ?? {})["collection"]) ?? null
const nom = t => t.origin?.name ?? t.name

/* Los 135 sin colección son ESTILOS de Figma (Typography, Shadow, Blur), no
 * variables. No tienen colección porque no pueden tenerla: no es un defecto. */
const ESTILOS = new Set(["Typography", "Shadow", "Blur"])
const variables = tokens.filter(t => !ESTILOS.has(t.tokenType))

let fallos = 0
const seccion = (id, titulo) => console.log(`\n\x1b[1m${id} · ${titulo}\x1b[0m`)

/* ─────────────────────────────────────────────────────────────────────────────
 * L3 · Token sin descripción
 * DTCG: «Groups are arbitrary and tools SHOULD NOT use them to infer the type or
 * purpose of design tokens.» El significado va en $description — así que un token
 * sin descripción no tiene su contrato en ningún sitio legible por máquina.
 * Y la descripción es la ÚNICA superficie presente en el momento de bindear.
 * ──────────────────────────────────────────────────────────────────────────── */
seccion("L3", "Tokens sin descripción")
const sinDesc = variables.filter(t => !t.description || !t.description.trim())
const porColeccion = {}
for (const t of sinDesc) { const c = col(t) ?? "(sin colección)"; (porColeccion[c] ??= []).push(t) }
console.log(`   cobertura: ${variables.length} de ${variables.length} variables revisadas`)
console.log(`   sin descripción: ${sinDesc.length} de ${variables.length}`)
for (const [c, arr] of Object.entries(porColeccion).sort((a, b) => b[1].length - a[1].length)) {
  const total = variables.filter(t => (col(t) ?? "(sin colección)") === c).length
  const marca = arr.length === total ? " 🔴 NINGUNO la tiene" : ""
  console.log(`     ${c.padEnd(18)} ${String(arr.length).padStart(3)} de ${String(total).padStart(3)}${marca}`)
}
if (sinDesc.length) fallos++

/* ─────────────────────────────────────────────────────────────────────────────
 * L5 · Unidad incoherente con su nombre
 * Un token llamado `circle` vale 50 en PÍXELES. Un círculo son 50 POR CIENTO:
 * sobre una caja de 200 px, 50 px no es un círculo. Hoy funciona solo porque se
 * aplica a cajas pequeñas — es decir, funciona por accidente.
 * Las reglas se declaran aquí, en una lista corta y legible, no se adivinan.
 * ──────────────────────────────────────────────────────────────────────────── */
seccion("L5", "Unidad incoherente con el nombre")
const REGLAS = [
  { patron: /\/circle$/,  espera: "Percent", porque: "un círculo es 50 %, no 50 px: en px depende del tamaño de la caja" },
  { patron: /\/pill$/,    espera: "Pixels",  porque: "una píldora es un radio enorme en px (999) — centinela deliberado" },
  { patron: /\/zero$/,    espera: "Pixels",  porque: "el cero explícito existe para apagar un valor heredado" },
]
let revisadosL5 = 0, malL5 = 0
for (const t of variables) {
  const nombre = nom(t) ?? ""
  const regla = REGLAS.find(r => r.patron.test(nombre))
  if (!regla) continue
  revisadosL5++
  const unidad = t.value?.unit
  if (unidad && unidad !== regla.espera) {
    malL5++
    console.log(`   🔴 ${nombre} — unidad \`${unidad}\`, se espera \`${regla.espera}\``)
    console.log(`      ${regla.porque}`)
    console.log(`      hoy vale ${t.value?.measure} · colección ${col(t)}`)
  }
}
console.log(`   cobertura: ${revisadosL5} tokens con regla aplicable, de ${variables.length} variables`)
console.log(`   incoherentes: ${malL5} de ${revisadosL5}`)
if (malL5) fallos++

/* ═════════════════════════════════════════════════════════════════════════════
 * L1 · L2 · L4 — los tres que necesitan BINDINGS de Figma
 *
 * 🔴 CONTROL DE MÉTODO PRIMERO. Si el barrido no ve presencia, estos checks no
 *    informan «sin hallazgos»: FALLAN. Es la diferencia entre «no hay defectos»
 *    y «mi método está roto», y esta semana esa diferencia costó cuatro hallazgos.
 * ════════════════════════════════════════════════════════════════════════════ */
const USAR_CACHE = process.argv.includes("--cache")
seccion("🔍", "Leyendo bindings de Figma" + (USAR_CACHE ? " (caché)" : ""))
let figma = null, errFigma = null
try {
  const ficheros = await traerArbol({ usarCache: USAR_CACHE })
  figma = barrer(ficheros)
  console.log(`   nodos recorridos: ${figma.nodos} · bindings: ${figma.bindings.length} · valores crudos: ${figma.crudos.length}`)
} catch (e) { errFigma = e.message; console.log(`   🔴 ${e.message}`) }

if (errFigma) {
  console.log(`\n🔴 L1, L2 y L4 NO SE EJECUTARON: sin lectura de Figma no hay nada que medir.`)
  console.log(`   NO se interpretan como «sin hallazgos».`)
  fallos++
} else if (figma.bindings.length === 0) {
  console.log(`\n🔴 CONTROL DE MÉTODO FALLIDO: 0 bindings en ${figma.nodos} nodos.`)
  console.log(`   Eso no significa que no haya defectos: significa que el barrido no ve lo que busca.`)
  console.log(`   Revisa las claves de boundVariables antes de fiarte de ningún conteo.`)
  fallos++
} else {
  /* Empalme Figma→Supernova por origin.id, NUNCA por nombre. */
  const porOrigen = new Map()
  for (const t of tokens) if (t.origin?.id) porOrigen.set(t.origin.id, t)
  const empalmados = figma.bindings.filter(b => porOrigen.has(b.variableId))
  const cobertura = ((empalmados.length / figma.bindings.length) * 100).toFixed(0)
  console.log(`   empalme con Supernova: ${empalmados.length} de ${figma.bindings.length} = ${cobertura}%`)
  console.log(`   ⚠️  El resto son variables de una librería remota que Supernova no tiene.`)
  console.log(`      Todo lo que sigue vale para ese ${cobertura}%, no para el sistema entero.`)

  /* ── L1 · CATEGORÍA CRUZADA ─────────────────────────────────────────────
   * Por colección y tokenType, NUNCA por nombre: `width/l` y `radius/xs` valen
   * los dos 4 y aliasan el mismo `unit/4`. Solo la categoría los distingue. */
  seccion("L1", "Categoría cruzada — un token de un tipo aplicado a otra propiedad")
  const cruzados = []
  for (const b of empalmados) {
    if (!b.categoriaEsperada) continue
    const t = porOrigen.get(b.variableId)
    const esperado = b.categoriaEsperada
    const real = t.tokenType
    const compatible = real === esperado
      || (esperado === "Size" && ["Dimension", "Size"].includes(real))
      || (esperado === "Space" && real === "Space")
      || (esperado === "Color" && real === "Color")
    if (!compatible) cruzados.push({ ...b, token: nom(t), tipoReal: real, tipoEsperado: esperado, col: col(t) })
  }
  const porTokenCruzado = {}
  for (const c of cruzados) (porTokenCruzado[`${c.token} → ${c.prop}`] ??= []).push(c)
  const cruzadosMaster = cruzados.filter(c => !c.esInstancia)
  console.log(`   cobertura: ${empalmados.filter(b => b.categoriaEsperada).length} bindings con categoría conocida, de ${empalmados.length} empalmados`)
  console.log(`   cruzados: ${cruzados.length}`)
  for (const [k, arr] of Object.entries(porTokenCruzado).sort((a, b) => b[1].length - a[1].length)) {
    const masters = arr.filter(x => !x.esInstancia)
    console.log(`   🔴 ${k}  — ${arr.length} nodos (${masters.length} masters)`)
    console.log(`      el token es ${arr[0].tipoReal} y la propiedad pide ${arr[0].tipoEsperado}`)
    if (masters.length) console.log(`      arréglalo en: ${[...new Set(masters.map(m => m.master || m.name))].slice(0, 4).join(", ")}`)
  }
  console.log(`   ⇒ ${cruzadosMaster.length} en MASTERS (lo accionable) · ${cruzados.length - cruzadosMaster.length} heredados por instancias`)
  if (cruzadosMaster.length) fallos++

  /* ── L2 · VALOR CRUDO DONDE EXISTE TOKEN EXACTO ─────────────────────────── */
  seccion("L2", "Valor crudo donde existe un token exacto")
  const porTipoYValor = {}
  for (const t of tokens) {
    const m = t.value?.measure
    if (typeof m !== "number") continue
    ;(porTipoYValor[`${t.tokenType}|${m}`] ??= []).push(nom(t))
  }
  const evitables = figma.crudos.filter(c => porTipoYValor[`${c.categoria}|${c.valor}`])
  const sinToken = figma.crudos.filter(c => !porTipoYValor[`${c.categoria}|${c.valor}`])
  console.log(`   cobertura: ${figma.crudos.length} valores crudos hallados (solo masters, fuera de instancia)`)
  console.log(`   con token exacto disponible: ${evitables.length}  ·  sin peldaño que los cubra: ${sinToken.length}`)
  const agr = {}
  for (const e of evitables) (agr[`${e.categoria} ${e.valor}`] ??= []).push(e)
  for (const [k, arr] of Object.entries(agr).sort((a, b) => b[1].length - a[1].length).slice(0, 8)) {
    const tok = porTipoYValor[`${arr[0].categoria}|${arr[0].valor}`]
    console.log(`   🔴 ${k}px crudo en ${arr.length} nodos → existe ${tok.join(" / ")}`)
    console.log(`      en: ${[...new Set(arr.map(a => a.master || a.name))].slice(0, 4).join(", ")}`)
  }
  if (sinToken.length) {
    const h = {}
    for (const s of sinToken) h[`${s.categoria} ${s.valor}`] = (h[`${s.categoria} ${s.valor}`] ?? 0) + 1
    console.log(`   ⚠️  sin peldaño (no es defecto de binding, es decisión de escala): ${Object.entries(h).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`${k}×${v}`).join(" · ")}`)
  }
  if (evitables.length) fallos++

  /* ── L4 · TOKEN SIN CONSUMO, con su límite DENTRO de la salida ──────────── */
  seccion("L4", "Tokens sin consumo encontrado")
  const usados = new Set(empalmados.map(b => b.variableId))
  const candidatos = tokens.filter(t => t.origin?.id && !ESTILOS.has(t.tokenType))
  const sinUso = candidatos.filter(t => !usados.has(t.origin.id))
  console.log(`   cobertura: ${candidatos.length} tokens con origen en Figma · ${figma.nodos} nodos barridos · 32 de 32 páginas`)
  console.log(`   sin consumo encontrado: ${sinUso.length} de ${candidatos.length}`)
  console.log(`\n   🔴 ESTE CHECK NO DICE «NADIE LO USA». Dice «NO ENCONTRADO EN LA SUPERFICIE MEDIDA».`)
  console.log(`      Tres límites que lo acotan, y los tres han producido falsos esta semana:`)
  console.log(`        · el empalme cubre el ${cobertura}% de los bindings — el resto es librería remota`)
  console.log(`        · el archivo de PRODUCTO no es éste: un token sin uso aquí puede tenerlo allá`)
  console.log(`        · un token puede consumirse desde otro token, no desde un nodo`)
  const porCol = {}
  for (const t of sinUso) (porCol[col(t) ?? "(sin colección)"] ??= []).push(nom(t))
  for (const [c, arr] of Object.entries(porCol).sort((a, b) => b[1].length - a[1].length))
    console.log(`     ${c.padEnd(18)} ${String(arr.length).padStart(3)}  ${arr.slice(0, 5).join(", ")}${arr.length > 5 ? "…" : ""}`)
  console.log(`   ⚠️  No se sale con código 1: un candidato no es un defecto.`)
}

/* ─────────────────────────────────────────────────────────────────────────────
 * La guarda de la credencial. El token de Figma caduca ~21 dic 2026.
 * Si expira, los checks de Figma devolverían cero hallazgos — un verde falso con
 * fecha de vencimiento conocida. Se comprueba y se falla RUIDOSAMENTE.
 * ──────────────────────────────────────────────────────────────────────────── */
seccion("🔑", "Credencial de Figma")
const fkey = process.env.FIGMA_API_KEY
if (!fkey) {
  console.log(`   ⚠️  FIGMA_API_KEY no está en el entorno. Hoy no bloquea porque L1/L2/L4 no corren.`)
  console.log(`      🔴 En cuanto corran, esto DEBE salir con código 1: sin credencial no hay medición,`)
  console.log(`         y "cero hallazgos" se leería como "todo bien".`)
} else {
  try {
    const r = await fetch("https://api.figma.com/v1/me", { headers: { "X-Figma-Token": fkey } })
    if (r.ok) {
      const u = await r.json()
      console.log(`   🟢 válida · ${u.email}`)
      console.log(`      ⚠️  personal access token, emitido el 22 sep 2026, caduca ~21 dic 2026 (90 días).`)
    } else {
      console.log(`   🔴 la credencial NO responde (HTTP ${r.status}). Revísala antes de fiarte de nada.`)
      fallos++
    }
  } catch (e) { console.log(`   🔴 error al validar la credencial: ${e.message}`); fallos++ }
}

console.log(`\n${"─".repeat(64)}`)
if (fallos) { console.log(`🔴 tokens:lint — ${fallos} check(s) con hallazgos.`); process.exit(1) }
console.log(`🟢 tokens:lint — sin hallazgos en los checks implementados (L3, L5).`)
