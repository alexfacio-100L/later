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

/* ─────────────────────────────────────────────────────────────────────────────
 * Lo que este lint NO comprueba. Se imprime SIEMPRE.
 * Un verificador que no puede juzgar completitud no debe imprimir una frase que
 * se lea como si pudiera — la lección de `uspec:contexto`, 7 sep 2026.
 * ──────────────────────────────────────────────────────────────────────────── */
seccion("⚠️", "Lo que este lint NO comprueba todavía")
console.log(`   L1 · categoría cruzada (grosor usado como radio)  — NO IMPLEMENTADO`)
console.log(`   L2 · valor crudo donde existe token exacto        — NO IMPLEMENTADO`)
console.log(`   L4 · token sin consumo                            — NO IMPLEMENTADO`)
console.log(``)
console.log(`   Los tres necesitan leer BINDINGS de Figma, y hay un bloqueo medido el 22 sep 2026:`)
console.log(`   · \`/v1/files/:key/nodes\` SÍ devuelve \`boundVariables\` con el token actual.`)
console.log(`   · Pero los VariableID que devuelve NO empalman con ningún token de Supernova`)
console.log(`     ni por \`origin.key\` ni por \`origin.id\` — 0 de 2 en la prueba. El Playground`)
console.log(`     consume una librería REMOTA que Supernova no tiene.`)
console.log(`   · \`/v1/files/:key/variables/local\` responde 403: falta el scope \`file_variables:read\`.`)
console.log(``)
console.log(`   🔴 Sin resolver el nombre de la variable, L1/L2/L4 darían VERDE sin haber mirado.`)
console.log(`      Por eso no se implementan a medias: un verde falso es peor que un hueco declarado.`)

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
