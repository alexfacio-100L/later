/**
 * medir-espacios.mjs — la medición de `Grillas y espacios`, con cobertura declarada.
 *
 * POR QUÉ EXISTE
 * --------------
 * El 30 sep 2026 esta medición se hizo con SEIS scripts de usar y tirar. Salió
 * bien, y aun así dejó el defecto de siempre: **una medición a mano no deja
 * mecanismo detrás**. Las otras tres páginas nuestras —`Dimensiones`,
 * `Elevaciones`, `Design Tokens`— van a pedir lo mismo, y el 23 sep ya se había
 * medido el consumo de `space` sin que quedara forma de repetirlo: por eso las
 * descripciones de los tokens y esta medición DISCREPAN y nadie sabe por qué.
 *
 * LO QUE GARANTIZA, y es lo que fallaba
 *   1. CONTROL DE MÉTODO antes de afirmar nada. Dos tokens que SABEMOS
 *      consumidos (`space/s`, `space/xs`) y un binding de `layoutGrids` que
 *      SABEMOS que existe. Si alguno sale 0, ABORTA con código 1.
 *   2. COBERTURA `n de N` en cada bloque, SIEMPRE, no solo cuando sale cero.
 *   3. DISTINGUE EL ESTILO DEL NODO. Un gutter bindeado DENTRO del estilo de
 *      grid y uno bindeado en cada nodo que lo aplica se leen igual en el árbol
 *      y significan cosas opuestas: el primero se propaga solo, el segundo lo
 *      hizo alguien a mano y la rejilla siguiente nacerá sin token.
 *   4. SEPARA ESPACIADO DE GRILLA. `layoutGrids` consume tokens de `space`, así
 *      que contarlo como espaciado infla la cifra con lo que es rejilla.
 *   5. DECLARA LAS VARIABLES AJENAS. Un binding a una variable de librería NO
 *      empalma con ningún `origin.id` del DS y se lee exactamente igual que un
 *      token nuestro. 22.127 bindings del archivo son de esa clase.
 *
 * USO
 *   npm run docs:espacios              # Figma fresco
 *   npm run docs:espacios -- --cache   # rápido; AVISA de lo que arriesga
 */
import sdkPkg from "@supernovaio/sdk"
import { readFileSync } from "node:fs"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { traerArbol, FILE_KEY } from "./lint-figma.mjs"
const { Supernova } = sdkPkg

const USAR_CACHE = process.argv.includes("--cache")
if (USAR_CACHE) console.log("⚠️  --cache: el árbol en disco es el de la última descarga. Si algo se tocó en Figma hoy, esto mide el PASADO.\n")
const figKey = process.env.FIGMA_API_KEY
if (!figKey) { console.error("🔴 FIGMA_API_KEY no está en el entorno. Sin credencial, «cero hallazgos» se leería como «todo bien»."); process.exit(1) }

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
const nom = t => { const g = t.parentGroupId ? gById.get(t.parentGroupId) : null; return (g ? ruta(g) + "/" : "") + t.name }
const px = t => { const m = JSON.stringify(t.value ?? {}).match(/"measure":\s*(-?[\d.]+)/); return m ? Number(m[1]) : null }
const porOrigen = new Map(tokens.filter(t => t.origin?.id).map(t => [t.origin.id, t]))

console.log(`FUENTE: DS ${ds.id} versión ${v.id} — ${tokens.length} tokens · archivo Figma ${FILE_KEY}`)
console.log(`FECHA: ${new Date().toISOString().slice(0, 10)}`)

/* ── 1 · LA ESCALA ─────────────────────────────────────────────────── */
const space = tokens.filter(t => t.tokenType === "Space").sort((a, b) => px(a) - px(b))
console.log(`\n=== 1 · LA ESCALA — ${space.length} de ${space.length} peldaños ===`)

/* ── 2 · EL ÁRBOL, UNA SOLA VEZ ────────────────────────────────────── */
const ficheros = await traerArbol({ usarCache: USAR_CACHE })
let nodos = 0
const porToken = new Map()       // origin.id -> { prop: n }
let ajenos = 0, localesN = 0
const rejillas = []
const walk = n => {
  nodos++
  if (Array.isArray(n.layoutGrids) && n.layoutGrids.length)
    rejillas.push({ name: n.name, w: n.absoluteBoundingBox?.width, estilo: n.styles?.grid || null, grids: n.layoutGrids, bv: n.boundVariables?.layoutGrids || null })
  const rec = (x, prop) => {
    if (Array.isArray(x)) return x.forEach(y => rec(y, prop))
    if (x && typeof x === "object") {
      if (x.type === "VARIABLE_ALIAS" && x.id) {
        if (porOrigen.has(x.id)) { localesN++; const m = porToken.get(x.id) || {}; m[prop] = (m[prop] || 0) + 1; porToken.set(x.id, m) }
        else ajenos++
      } else Object.values(x).forEach(y => rec(y, prop))
    }
  }
  for (const [prop, val] of Object.entries(n.boundVariables || {})) rec(val, prop)
  for (const c of n.children || []) walk(c)
}
for (const f of ficheros) { const d = JSON.parse(readFileSync(f, "utf8")); for (const w of Object.values(d.nodes || {})) walk(w.document || {}) }

/* ── CONTROL DE MÉTODO ─────────────────────────────────────────────── */
const usoDe = t => { const m = t.origin?.id ? porToken.get(t.origin.id) : null; return m ? Object.values(m).reduce((a, b) => a + b, 0) : 0 }
const ctrl = ["s", "xs"].map(n => space.find(t => t.name === n)).filter(Boolean)
const ctrlOk = ctrl.length === 2 && ctrl.every(t => usoDe(t) > 0)
const ctrlGrid = rejillas.some(r => r.bv && r.bv.length)
console.log(`\n=== CONTROL DE MÉTODO ===`)
console.log(`  space/s = ${ctrl[0] ? usoDe(ctrl[0]) : "?"} · space/xs = ${ctrl[1] ? usoDe(ctrl[1]) : "?"}  → ${ctrlOk ? "✅ el método ve consumo" : "🔴 ROTO"}`)
console.log(`  bindings de layoutGrids vistos: ${ctrlGrid ? "✅ sí" : "🔴 ninguno"}`)
if (!ctrlOk || !ctrlGrid) { console.error("\n🔴 ABORTA: con el control roto, una ausencia no se distingue de un fallo del método."); process.exit(1) }

/* ── 3 · CONSUMO, SEPARANDO ESPACIADO DE GRILLA ────────────────────── */
console.log(`\n=== 2 · CONSUMO — ${space.length} de ${space.length} peldaños, sobre ${nodos} nodos ===`)
console.log(`  (universo: las 32 páginas de \`[Auditoria]\`. El archivo de PRODUCTO no es éste: un 0 aquí no es un 0 en producto.)\n`)
let espTot = 0, gridTot = 0, cruce = 0
const PROPS_ESPACIO = new Set(["itemSpacing", "counterAxisSpacing", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight"])
for (const t of space) {
  const m = (t.origin?.id ? porToken.get(t.origin.id) : null) || {}
  const esp = Object.entries(m).filter(([p]) => PROPS_ESPACIO.has(p)).reduce((a, [, n]) => a + n, 0)
  const gri = m.layoutGrids || 0
  const otr = Object.entries(m).filter(([p]) => !PROPS_ESPACIO.has(p) && p !== "layoutGrids").reduce((a, [, n]) => a + n, 0)
  espTot += esp; gridTot += gri; cruce += otr
  const detalle = Object.entries(m).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p}:${n}`).join(" ") || "—"
  console.log(`  ${String(px(t)).padStart(4)}px  ${nom(t).padEnd(17)} espaciado=${String(esp).padStart(5)} grilla=${String(gri).padStart(3)} OTRA-CATEGORÍA=${String(otr).padStart(3)}   ${detalle}`)
  if (otr > 0) console.log(`         🔴 CRUCE DE CATEGORÍA: ${otr} usos que NO son separación.`)
}
const vivos = space.filter(t => { const m = (t.origin?.id ? porToken.get(t.origin.id) : null) || {}; return Object.entries(m).some(([p, n]) => PROPS_ESPACIO.has(p) && n > 0) }).length
console.log(`\n  COBERTURA: ${vivos} de ${space.length} peldaños con uso REAL de espaciado.`)
console.log(`  espaciado=${espTot} · gutters de grilla=${gridTot} · cruces de categoría=${cruce}`)
const noMult8 = space.filter(t => px(t) % 8 !== 0).reduce((a, t) => { const m = (t.origin?.id ? porToken.get(t.origin.id) : null) || {}; return a + Object.entries(m).filter(([p]) => PROPS_ESPACIO.has(p)).reduce((x, [, n]) => x + n, 0) }, 0)
console.log(`  separaciones que NO son múltiplo de 8: ${noMult8} de ${espTot} (${(100 * noMult8 / espTot).toFixed(1)}%) → la base NO es 8`)

/* ── 4 · LA GRILLA: ¿EL BINDING VIVE EN EL ESTILO O EN EL NODO? ────── */
const estilos = (await (await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/styles`, { headers: { "X-Figma-Token": figKey } })).json()).meta.styles.filter(s => s.style_type === "GRID")
const detalle = (await (await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${estilos.map(s => s.node_id).join(",")}`, { headers: { "X-Figma-Token": figKey } })).json()).nodes
console.log(`\n=== 3 · LA GRILLA — ${estilos.length} de ${estilos.length} estilos publicados ===`)
let enEstilo = 0, sinNodo = 0, aSpace = 0, aUnit = 0, aOtro = 0
for (const s of estilos) {
  const w = detalle[s.node_id]
  if (!w?.document) { sinNodo++; console.log(`  ✖ ${s.name} — la REST no devolvió nodo: NO VERIFICABLE por esta vía`); continue }
  const d = w.document, g = d.layoutGrids?.[0] || {}
  const bvs = d.boundVariables?.layoutGrids || []
  if (bvs.length) enEstilo++
  const destinos = bvs.map(a => { const t = porOrigen.get(a.id); if (!t) return "❓ajena"; const n = nom(t); if (/\/space\//.test(n)) aSpace++; else if (/\/unit\//.test(n)) aUnit++; else aOtro++; return n })
  console.log(`  ${bvs.length ? "✅" : "🔴"} ${s.name.padEnd(46)} cols=${g.count} gutter=${g.gutterSize} margen=${g.offset}  → ${destinos.join(", ") || "SIN BINDING (números crudos)"}`)
}
console.log(`\n  COBERTURA: ${estilos.length - sinNodo} de ${estilos.length} estilos inspeccionados.`)
console.log(`  BINDING DENTRO DEL ESTILO: ${enEstilo} de ${estilos.length - sinNodo}  → ${enEstilo === estilos.length - sinNodo ? "el sistema se propaga SOLO al aplicar el estilo" : "🔴 hay estilos con números crudos: la rejilla siguiente nacerá sin token"}`)
console.log(`  destino de los bindings: space=${aSpace} unit=${aUnit} otros=${aOtro}`)
const usados = new Set(rejillas.filter(r => r.estilo).map(r => r.estilo))
console.log(`  rejillas aplicadas: ${rejillas.length} · con estilo: ${rejillas.filter(r => r.estilo).length} · SUELTAS (sin gobierno): ${rejillas.filter(r => !r.estilo).length}`)
console.log(`  estilos publicados SIN uso en estas páginas: ${estilos.filter(s => !usados.has(s.node_id)).map(s => s.name).join(" · ") || "ninguno"}`)

/* ── 5 · VARIABLES AJENAS ──────────────────────────────────────────── */
const totalBind = localesN + ajenos
console.log(`\n=== 4 · DE DÓNDE VIENEN LOS BINDINGS — ${totalBind} de ${totalBind} ===`)
console.log(`  del DS:          ${String(localesN).padStart(7)}  ${(100 * localesN / totalBind).toFixed(1)}%`)
console.log(`  de librería:     ${String(ajenos).padStart(7)}  ${(100 * ajenos / totalBind).toFixed(1)}%  ← NO empalman con ningún origin.id de los ${tokens.length} tokens`)
console.log(`  ⚠️  Este método NO puede decir de cuántas librerías vienen ni a qué valor resuelven: haría falta leer esos archivos.`)
