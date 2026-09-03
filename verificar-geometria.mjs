#!/usr/bin/env node
/**
 * ¿Qué geometría del componente está bindeada a token, y qué valor crudo YA
 * TIENE un token en el sistema que lo cubre?
 *
 * 🔴 POR QUÉ EXISTE, y son dos fallos del 3 sep 2026 en el mismo componente:
 *
 *   1. Se midió el `strokeWeight` del Button —1, 1.5 y 2, crudos— y se reportó
 *      como «geometría que nadie había documentado», mandándolo al contexto de
 *      extracción **para que se documentara como característica**. No lo era:
 *      la colección `border` ya tenía `width/xs` (1), `width/s` (1.5) y
 *      `width/m` (2), con el valor idéntico. **Era un bug, y se estuvo a punto
 *      de publicarlo como decisión de diseño.**
 *   2. Antes, el mismo día, se afirmó del radio lo contrario sin comprobarlo.
 *
 * **La pregunta que faltaba en los dos casos es la misma: ¿el sistema ya tenía
 * un token para este valor?** Un minuto de cruce separa «hallazgo a documentar»
 * de «defecto a corregir». Este script hace ese cruce sobre TODA propiedad
 * numérica, raíz e hijos.
 *
 *   node verificar-geometria.mjs [slug]
 *
 * ⚠️ DOS LÍMITES DECLARADOS, porque sin ellos el resultado se lee de más:
 *
 *   · **El extractor es CIEGO a algunos bindings.** Dice `token: null` en el
 *     `cornerRadius` de las 60 y están las 60 bindeadas a `radius/l` —medido en
 *     vivo—. Así que lo que sale aquí son **CANDIDATOS a verificar contra
 *     Figma**, nunca bugs probados. El fichero `geometria-verificada.json` lista
 *     lo ya comprobado en vivo para que no se reporte dos veces.
 *   · **El `_base.json` no registra si un borde está PINTADO**, solo su grosor.
 *     Figma pone `strokeWeight: 1` en cualquier nodo, tenga stroke o no, así que
 *     un `1` crudo en un nodo sin borde no es un defecto: es un valor que no se
 *     ve. Se marcan aparte.
 */
import fs from "node:fs"
import path from "node:path"

const AQUI = path.dirname(new URL(import.meta.url).pathname)
const slug = process.argv[2] ?? "button"
const base = path.join(AQUI, "spec-origen", slug, `${slug}-_base.json`)
if (!fs.existsSync(base)) { console.error(`🔴 No hay ${base}`); process.exit(1) }
const d = JSON.parse(fs.readFileSync(base, "utf8"))

const verificadoPath = path.join(AQUI, "spec-origen", slug, "geometria-verificada.json")
const verificado = fs.existsSync(verificadoPath) ? JSON.parse(fs.readFileSync(verificadoPath, "utf8")) : {}

const rv = d.variables.resolvedVariables
const cols = new Map(d.variables.localCollections.map(c => [c.id, c.name]))

/** Colección que le corresponde a cada propiedad. Un 16 de radio se cubre con
 *  `radius/l`, no con `unit/16`: el primitivo existe pero no es el semántico. */
const COLECCION = { cornerRadius: "radius", strokeWeight: "border",
  itemSpacing: "space", counterAxisSpacing: "space", minWidth: "sizing", minHeight: "sizing" }
const coleccionDe = (prop) => COLECCION[prop.split(".")[0]] ?? (prop.startsWith("padding") ? "space" : null)

/**
 * 🔴 Los ALIAS hay que resolverlos, y no es un detalle: `width/m` no guarda un 2,
 * guarda `{kind:"alias", targetName:"unit/2"}`. Un índice que solo mira `value`
 * deja fuera a todos los tokens semánticos definidos por alias — que son la
 * mayoría— y entonces propone bindear al primitivo (`unit/2`) en vez de al
 * semántico (`width/m`). **Es el error que este script existe para evitar,
 * cometido dentro del propio script.** Pasó en su primera versión.
 */
const valorDe = (v, prof = 0) => {
  if (prof > 8) return null
  if (typeof v === "number") return v
  if (!v || typeof v !== "object") return null
  if (v.kind === "number" || typeof v.value === "number") return typeof v.value === "number" ? v.value : null
  if (v.kind === "alias") {
    const destino = rv[v.targetId] ?? Object.values(rv).find(t => t.name === v.targetName)
    if (!destino) return null
    for (const dv of Object.values(destino.valuesByMode ?? destino.values ?? {})) {
      const n = valorDe(dv, prof + 1); if (n !== null) return n
    }
  }
  return null
}
const porValor = new Map()
for (const t of Object.values(rv)) {
  for (const v of Object.values(t.valuesByMode ?? t.values ?? {})) {
    const n = valorDe(v)
    if (n === null) continue
    if (!porValor.has(n)) porValor.set(n, [])
    porValor.get(n).push({ nombre: t.name, coleccion: cols.get(t.collectionId) ?? "?" })
  }
}
const tokenPara = (valor, prop) => {
  const pref = coleccionDe(prop)
  const cand = (porValor.get(valor) ?? []).filter(c => !/color/i.test(c.coleccion))
  const bueno = cand.filter(c => pref && c.coleccion === pref)
  return [...new Set((bueno.length ? bueno : cand).map(c => `${c.nombre} [${c.coleccion}]`))]
}

const PROPS = ["minWidth","minHeight","itemSpacing","counterAxisSpacing","cornerRadius","strokeWeight"]
const acc = new Map()
const anota = (ruta, dim) => {
  if (!dim) return
  const mete = (prop, c) => {
    if (!c || typeof c.value !== "number") return
    const k = `${ruta}|${prop}`
    if (!acc.has(k)) acc.set(k, new Map())
    const mk = `${c.value}|${c.token ?? "CRUDO"}`
    acc.get(k).set(mk, (acc.get(k).get(mk) ?? 0) + 1)
  }
  for (const p of PROPS) mete(p, dim[p])
  if (dim.padding) for (const s of ["vertical","horizontal","top","right","bottom","left"]) mete(`padding.${s}`, dim.padding[s])
}
const walk = (n, ruta) => {
  const r = ruta ? `${ruta} > ${n.name}` : "Button"
  anota(r, n.dimensions)
  for (const c of (n.children ?? [])) walk(c, r)
}
for (const v of d.variants) walk(v.treeHierarchical ?? v, "")

let medTotal = 0, medBind = 0
const bugs = [], invisibles = [], yaVerificadas = []
const filas = []
for (const [k, valores] of [...acc].sort()) {
  const [ruta, prop] = k.split("|")
  const lista = [...valores].map(([mk, n]) => { const [val, tok] = mk.split("|"); return { val: +val, tok, n } })
  const N = lista.reduce((a, f) => a + f.n, 0)
  const bind = lista.filter(f => f.tok !== "CRUDO").reduce((a, f) => a + f.n, 0)
  medTotal += N; medBind += bind
  filas.push({ ruta, prop, bind, N, lista })
  for (const f of lista) {
    if (f.tok !== "CRUDO") continue
    if (f.val === 0) continue                              // un cero no necesita token
    if (verificado[`${ruta}|${prop}`]) { yaVerificadas.push(`${ruta} · ${prop} — ${verificado[`${ruta}|${prop}`]}`); continue }
    const cand = tokenPara(f.val, prop)
    if (!cand.length) continue
    const destino = (prop === "strokeWeight" && ruta !== "Button") ? invisibles : bugs
    destino.push({ ruta, prop, val: f.val, n: f.n, cand })
  }
}

console.log(`GEOMETRÍA DE «${slug}» — ${d.variants.length} variantes, raíz e hijos\n`)
for (const f of filas) {
  const e = f.bind === f.N ? "🟢" : f.bind === 0 ? "🔴" : "🟡"
  const vf = verificado[`${f.ruta}|${f.prop}`]
  console.log(`${e} ${f.ruta} · ${f.prop}: ${f.bind} de ${f.N} bindeadas según el extractor` + (vf ? `  ← ${vf}` : ""))
}
console.log(`\nCOBERTURA: ${medBind} de ${medTotal} mediciones con token según el extractor.`)
if (yaVerificadas.length) {
  console.log(`\n🟢 Ya comprobadas en vivo, no son candidatas (${[...new Set(yaVerificadas)].length}):`)
  for (const s of [...new Set(yaVerificadas)]) console.log(`   · ${s}`)
}
console.log(`\n🔴 CANDIDATOS A BUG — valor crudo VISIBLE con token que ya existe: ${bugs.length}`)
for (const b of bugs) console.log(`   · ${b.ruta} · ${b.prop} = ${b.val} (×${b.n})  →  ${b.cand.join(" · ")}`)
if (invisibles.length) {
  console.log(`\n⚪ Grosor crudo en nodos que puede que ni pinten borde — el _base.json no lo dice (${invisibles.length}):`)
  for (const b of invisibles) console.log(`   · ${b.ruta} = ${b.val} (×${b.n})  →  ${b.cand.join(" · ")}`)
}
console.log(`\n⚠️  Son CANDIDATOS, no bugs probados: el extractor es ciego a algunos bindings.`)
console.log(`    Confírmalos en vivo antes de tocar Figma, y anótalos en geometria-verificada.json.`)
if (bugs.length) process.exit(1)
