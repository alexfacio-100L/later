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

/**
 * 🔴 LAS PÁGINAS SE DESCUBREN, NO SE ESCRIBEN A MANO.
 *
 * Hasta el 7 oct 2026 esto era una constante `LOTES` con 32 ids fijos. El día
 * que el panel pasó de 43 a 79 páginas, esa lista habría seguido devolviendo
 * verde **sin ver 36 páginas**, y sin decirlo. Es la forma «falso completo» de
 * la regla 16: un método que resuelve una fracción y entrega el resultado con
 * la forma correcta, sin error y sin hueco visible.
 *
 * Ahora se descubren en vivo y se contrastan contra un CENSO VERSIONADO. Si
 * aparecen MENOS páginas que la última vez, esto FALLA RUIDOSAMENTE en vez de
 * medir menos y callar — porque una regla que exige criterio para ejecutarse no
 * se ejecuta (E3 del FODA).
 *
 * El censo vive en `censo-paginas.json`, versionado en git A PROPÓSITO: en
 * `.cache-figma/` estaría gitignorado, y un archivo que git no ve está a un
 * `rm` de no existir — que es justo el fallo del que esto protege.
 *
 * Para aceptar una bajada legítima (alguien borró una página a conciencia):
 *     node tokens-lint.mjs --actualizar-censo
 */
export const FILE_KEY = "UGwIBzERV4vB7mk0mejZ0y"
const CACHE = ".cache-figma"
export const CENSO = "censo-paginas.json"
const POR_LOTE = 8

/** Descubre las páginas en vivo. Devuelve solo las que tienen contenido. */
export async function descubrirPaginas() {
  const key = process.env.FIGMA_API_KEY
  if (!key) throw new Error("FIGMA_API_KEY no está en el entorno. Sin credencial no hay medición, y 'cero hallazgos' se leería como 'todo bien'.")
  const r = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=2`, { headers: { "X-Figma-Token": key } })
  if (!r.ok) throw new Error(`Figma respondió ${r.status} al descubrir páginas. ${r.status === 403 ? "Falta scope o la credencial caducó." : ""}`)
  const doc = (await r.json()).document.children
  return {
    todas: doc.map(p => ({ id: p.id, nombre: p.name, frames: (p.children || []).length })),
    conContenido: doc.filter(p => (p.children || []).length > 0).map(p => ({ id: p.id, nombre: p.name, frames: p.children.length }))
  }
}

/**
 * El guardián. Compara lo descubierto contra el censo y SALE CON CÓDIGO 1
 * si hay menos páginas que antes. Devuelve un resumen de cobertura.
 */
export function vigilarCenso(descubierto, { actualizar = false } = {}) {
  const previo = existsSync(CENSO) ? JSON.parse(readFileSync(CENSO, "utf8")) : null
  const ahora = {
    fecha: new Date().toISOString().slice(0, 10),
    n_paginas: descubierto.todas.length,
    n_con_contenido: descubierto.conContenido.length,
    paginas: descubierto.todas.map(p => ({ id: p.id, nombre: p.nombre }))
  }
  if (!previo) {
    writeFileSync(CENSO, JSON.stringify(ahora, null, 1) + "\n")
    return { cobertura: `${ahora.n_con_contenido} de ${ahora.n_paginas}`, nota: "censo creado por primera vez" }
  }
  const idsAhora = new Set(descubierto.todas.map(p => p.id))
  const perdidas = previo.paginas.filter(p => !idsAhora.has(p.id))
  if (perdidas.length && !actualizar) {
    throw new Error(
      `🔴 CENSO: faltan ${perdidas.length} de ${previo.paginas.length} páginas que SÍ estaban el ${previo.fecha}.\n` +
      perdidas.map(p => `   · ${p.id} ${JSON.stringify(p.nombre)}`).join("\n") +
      `\n\nNo mido con menos páginas de las que había sin que alguien lo decida.\n` +
      `Si la bajada es legítima, vuelve a correr con --actualizar-censo.`
    )
  }
  if (actualizar || descubierto.todas.length !== previo.n_paginas) {
    writeFileSync(CENSO, JSON.stringify(ahora, null, 1) + "\n")
  }
  return {
    cobertura: `${ahora.n_con_contenido} de ${ahora.n_paginas}`,
    delta: ahora.n_paginas - previo.n_paginas,
    perdidas: perdidas.length
  }
}

/** Descarga el árbol de las páginas con contenido, o reutiliza la caché con `--cache`. */
export async function traerArbol({ usarCache = false, actualizarCenso = false } = {}) {
  const key = process.env.FIGMA_API_KEY
  if (!key) throw new Error("FIGMA_API_KEY no está en el entorno. Sin credencial no hay medición, y 'cero hallazgos' se leería como 'todo bien'.")
  if (!existsSync(CACHE)) mkdirSync(CACHE)

  // El flag se lee también de argv para que funcione desde cualquier consumidor
  // sin tener que tocar los cuatro que importan esto.
  const actualizar = actualizarCenso || process.argv.includes("--actualizar-censo")
  const descubierto = await descubrirPaginas()
  const resumen = vigilarCenso(descubierto, { actualizar })
  console.error(`  páginas con contenido medidas: ${resumen.cobertura}${resumen.delta ? ` (${resumen.delta > 0 ? "+" : ""}${resumen.delta} desde el censo)` : ""}`)

  const ids = descubierto.conContenido.map(p => p.id)
  const lotes = []
  for (let i = 0; i < ids.length; i += POR_LOTE) lotes.push(ids.slice(i, i + POR_LOTE).join(","))

  const ficheros = []
  for (let i = 0; i < lotes.length; i++) {
    const f = path.join(CACHE, `lote${i}.json`)
    if (usarCache && existsSync(f)) { ficheros.push(f); continue }
    const r = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${lotes[i]}`, { headers: { "X-Figma-Token": key } })
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
