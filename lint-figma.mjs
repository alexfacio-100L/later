/**
 * lint-figma.mjs — la capa que lee BINDINGS de Figma para `tokens:lint`.
 *
 * POR QUÉ ES UN MÓDULO APARTE
 * ---------------------------
 * Supernova sabe qué tokens EXISTEN; solo Figma sabe DÓNDE SE CONSUMEN.
 * L1, L2 y L4 viven de ese segundo dato, y sin él darían verde sin haber mirado.
 *
 * 🔴 TRES TRAMPAS APRENDIDAS A GOLPES, Y LAS TRES ESTÁN CUBIERTAS AQUÍ:
 *
 *  1. LAS CLAVES POR LADO. Una propiedad con lados se expande a una clave por lado,
 *     y la clave agregada NO EXISTE. Pedirla no da error: da vacío, que se lee igual
 *     que una ausencia real. Y la forma cambia según la superficie:
 *       · REST   → `rectangleCornerRadii` { RECTANGLE_TOP_LEFT_CORNER_RADIUS: {...} }
 *       · Plugin → `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`
 *     Nos mordió tres veces, dos el mismo día desde lados opuestos. Se cubren AMBAS.
 *
 *  2. EL EMPALME Figma↔Supernova va por `origin.id`, no por nombre. Un token que
 *     pierde su origen conserva `idInVersion` pero su `name` deja de llevar la ruta.
 *
 *  3. EL CONTROL DE MÉTODO. Antes de dar un conteo por bueno hay que demostrar que
 *     el método VE PRESENCIA. Si el control sale 0, esto falla ruidosamente en vez
 *     de informar «sin hallazgos» — es la diferencia entre «no hay defectos» y
 *     «mi método está roto».
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs"
import path from "node:path"

/* Las 32 páginas con contenido, en cuatro lotes para no reventar la petición. */
export const LOTES = [
  "84:2,0:1,12376:8434,80:7,80:11,80:12,80:8,80:9",
  "527:1726,80:15,80:16,80:19,173:592,80:21,5618:849,80:23",
  "82:27,82:29,80:20,80:22,82:26,82:30,82:31,82:32",
  "82:48,82:33,82:36,82:39,82:43,82:45,82:46,12108:13428"
]
export const FILE_KEY = "UGwIBzERV4vB7mk0mejZ0y"
const CACHE = ".cache-figma"

/** Descarga el árbol, o reutiliza la caché con `--cache`. */
export async function traerArbol({ usarCache = false } = {}) {
  const key = process.env.FIGMA_API_KEY
  if (!key) throw new Error("FIGMA_API_KEY no está en el entorno. Sin credencial no hay medición, y 'cero hallazgos' se leería como 'todo bien'.")
  if (!existsSync(CACHE)) mkdirSync(CACHE)
  const ficheros = []
  for (let i = 0; i < LOTES.length; i++) {
    const f = path.join(CACHE, `lote${i}.json`)
    if (usarCache && existsSync(f)) { ficheros.push(f); continue }
    const r = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${LOTES[i]}`, { headers: { "X-Figma-Token": key } })
    if (!r.ok) throw new Error(`Figma respondió ${r.status} en el lote ${i}. ${r.status === 403 ? "Falta scope o la credencial caducó." : ""}`)
    writeFileSync(f, await r.text())
    ficheros.push(f)
  }
  return ficheros
}

/* ── Las claves, agrupadas por la CATEGORÍA que les corresponde ───────────── */
export const CATEGORIA_DE_PROPIEDAD = {
  BorderRadius: ["rectangleCornerRadii", "topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius", "cornerRadius"],
  BorderWidth:  ["individualStrokeWeights", "strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight", "strokeWeight"],
  Space:        ["itemSpacing", "counterAxisSpacing", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
  Color:        ["fills", "strokes", "effects", "textRangeFills"],
  Size:         ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight", "size"]
}
const PROP_A_CAT = {}
for (const [cat, props] of Object.entries(CATEGORIA_DE_PROPIEDAD)) for (const p of props) PROP_A_CAT[p] = cat

/** Recorre boundVariables COMPLETO y recursivo — cubre las dos formas de clave. */
function aliasesDe(bv) {
  const out = []
  for (const [prop, val] of Object.entries(bv || {})) {
    const pila = [val]
    while (pila.length) {
      const x = pila.pop()
      if (Array.isArray(x)) { pila.push(...x); continue }
      if (x && typeof x === "object") {
        if (x.type === "VARIABLE_ALIAS" && x.id) out.push({ prop, id: x.id })
        else pila.push(...Object.values(x))
      }
    }
  }
  return out
}

/** Barre el árbol y devuelve cada binding con su nodo, su propiedad y su categoría esperada. */
export function barrer(ficheros) {
  const bindings = []
  const crudos = []
  let nodos = 0
  const walk = (n, pagina, anc) => {
    nodos++
    const esInstancia = String(n.id || "").startsWith("I") || n.type === "INSTANCE"
    const master = [...anc].reverse().find(a => a.t === "COMPONENT" || a.t === "COMPONENT_SET")
    const comun = { pagina, id: n.id, name: n.name, type: n.type, esInstancia, master: master ? master.n : null }
    const bv = n.boundVariables || {}
    const al = aliasesDe(bv)
    for (const a of al) bindings.push({ ...comun, prop: a.prop, variableId: a.id, categoriaEsperada: PROP_A_CAT[a.prop] ?? null })
    /* valores crudos: solo donde NO hay binding de esa familia y el nodo no es instancia */
    const tieneRadio = al.some(a => PROP_A_CAT[a.prop] === "BorderRadius")
    if (!tieneRadio && typeof n.cornerRadius === "number" && n.cornerRadius > 0 && !esInstancia && n.type !== "COMPONENT_SET")
      crudos.push({ ...comun, prop: "cornerRadius", valor: n.cornerRadius, categoria: "BorderRadius" })
    /* 🔴 El grosor de un ICONO no es un borde: es el dibujo.
     * Sin este filtro, L2 pedía bindear 23.218 nodos y 11.170 eran trazos de
     * vectores de Phosphor. Un check que grita de más se deja de leer, y eso es
     * peor que no tenerlo. Solo cuentan los CONTENEDORES. */
    const ES_CONTENEDOR = ["FRAME", "COMPONENT", "RECTANGLE", "GROUP", "SECTION"]
    const tieneGrosor = al.some(a => PROP_A_CAT[a.prop] === "BorderWidth")
    if (!tieneGrosor && ES_CONTENEDOR.includes(n.type) && typeof n.strokeWeight === "number" && n.strokeWeight > 0
        && !esInstancia && Array.isArray(n.strokes) && n.strokes.length)
      crudos.push({ ...comun, prop: "strokeWeight", valor: n.strokeWeight, categoria: "BorderWidth" })
    for (const c of n.children || []) walk(c, pagina, [...anc, { n: n.name, t: n.type }])
  }
  for (const f of ficheros) {
    const d = JSON.parse(readFileSync(f, "utf8"))
    for (const w of Object.values(d.nodes || {})) {
      const doc = w.document || {}
      walk(doc, (doc.name || "?").trim(), [])
    }
  }
  return { bindings, crudos, nodos }
}
