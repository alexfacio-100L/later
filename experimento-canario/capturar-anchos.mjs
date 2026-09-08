/**
 * capturar-anchos.mjs — lee de Supernova los anchos que el Lead fijó A MANO
 *                       y los deja escritos en el repo.
 *
 * POR QUÉ EXISTE, y nace de una pérdida real del 8 sep 2026
 * ---------------------------------------------------------
 * `writeMarkdownToPage` REEMPLAZA la página entera. El Lead había ajustado a mano
 * los anchos de 21 tablas; al reescribir la página se perdieron 16 de ellos, y solo
 * se pudieron restaurar los 7 que por casualidad habían quedado medidos en un
 * documento de diagnóstico.
 *
 * 🔴 La lección: sus ajustes vivían SOLO en Supernova, que es justo la superficie
 * que nosotros sobrescribimos. Un ajuste que solo existe donde vas a escribir no
 * está guardado — está en riesgo.
 *
 * QUÉ HACE
 * --------
 * Recorre las pestañas del componente, extrae de cada tabla su FIRMA (los
 * encabezados) y sus ANCHOS, y emite el bloque `ANCHOS_DEL_LEAD` listo para pegar
 * en `../anchos-de-tabla.mjs`. Con `--escribir` lo pega él mismo.
 *
 * ⚠️ Declara su cobertura —`n de N`— y falla si alguna tabla no da anchos.
 * Regla 16 de CLAUDE.md: un método que resuelve un conjunto dice sobre cuántos.
 *
 * USO
 *   npm run docs:anchos              # muestra lo capturado
 *   npm run docs:anchos -- --escribir  # actualiza anchos-de-tabla.mjs
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { writeFileSync, readFileSync } from "node:fs"

const { Supernova } = sdkPkg
const ESCRIBIR = process.argv.includes("--escribir")
const GRUPO = "836f5e48-77f0-4499-b344-51779236a6d6"   // Button
const DESTINO = new URL("../anchos-de-tabla.mjs", import.meta.url)

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const st = await sdk.documentation.getDocumentationStructure(from)
const grupo = st.find(e => e.persistentId === GRUPO)
if (!grupo) { console.error(`🔴 No se encontró el grupo ${GRUPO}`); process.exit(1) }

/** Texto plano de una celda, desde sus spans de rich text. */
const textoDe = (celda) => {
  const spans = celda?.content?.value?.spans ?? celda?.text?.value?.spans ?? []
  const t = spans.map(s => s.text ?? "").join("")
  if (t) return t
  // Fallback: buscar cualquier `.text` en el subárbol de la celda.
  const out = []
  ;(function w(o) {
    if (!o || typeof o !== "object") return
    if (typeof o.text === "string") out.push(o.text)
    for (const val of Object.values(o)) w(val)
  })(celda)
  return out.join("")
}

/** Recorre el árbol y devuelve todos los bloques de tabla, en orden. */
const tablasDe = (raw) => {
  const found = []
  ;(function w(o) {
    if (!o || typeof o !== "object") return
    if (Array.isArray(o)) return o.forEach(w)
    if (o.packageId === "io.supernova.block.table") {
      for (const item of o.items ?? []) {
        const filas = item?.props?.table?.value
        if (Array.isArray(filas) && filas.length) found.push(filas)
      }
    }
    for (const val of Object.values(o)) w(val)
  })(raw)
  return found
}

/**
 * Firma de una tabla. 🔴 NO basta con los encabezados.
 *
 * Medido el 8 sep 2026: en el Button hay 24 tablas y solo 17 combinaciones
 * distintas de encabezados. `Propiedad | Valor | Notas` se repite SEIS veces, con
 * seis anchos diferentes. Emparejar por encabezados habría guardado 17 y perdido
 * 7 **sin error y sin hueco visible** — la forma «falso completo» de la regla 16.
 *
 * ⚠️ Y el primer dato TAMPOCO basta: las seis empiezan por «Anuncio». Solo la
 * PRIMERA COLUMNA ENTERA las separa. Por eso la firma lleva un hash de ella —
 * corto para que la clave siga siendo legible, y estable frente a que la tabla
 * cambie de sitio, que es más de lo que da el índice de aparición.
 *
 * 🔴 Si dos tablas comparten encabezados Y primera columna completa, son
 * indistinguibles de verdad: el script falla en vez de guardar una y perder otra.
 */
/**
 * Normaliza el texto de una celda para la firma.
 *
 * 🔴 Quita el marcado, y es imprescindible: la misma celda es `` `variant` `` o
 * `**Anuncio**` en el .md y «variant» o «Anuncio» al leerla de Supernova, que ya
 * la devuelve en texto plano. Sin esta limpieza, 14 de 24 tablas no emparejaban y
 * se recalculaban — el ajuste del Lead se perdía otra vez, ahora en silencio.
 */
const norm = (x) => String(x)
  .replace(/`+/g, "")            // código
  .replace(/\*\*|__/g, "")       // negrita
  .replace(/(^|\W)[*_](\S)/g, "$1$2").replace(/(\S)[*_](\W|$)/g, "$1$2")  // cursiva
  .replace(/\s+/g, " ").trim().toLowerCase()

/** djb2 — hash corto y estable, solo para desempatar firmas. */
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0
  return h.toString(36).slice(0, 5)
}

const firmaDeTabla = (cab, col0 = []) => {
  const base = cab.map(norm).join(" | ")
  if (!col0.length) return base
  const etiqueta = norm(col0[0]).slice(0, 24)
  return `${base} @ ${etiqueta} #${hash(col0.map(norm).join("|"))} ~${col0.length}`
}

const capturado = {}
const informe = []
let total = 0, conAnchos = 0

for (const cid of grupo.childrenIds) {
  const pag = st.find(x => x.persistentId === cid || x.id === cid)
  if (!pag) continue
  const raw = await sdk.documentation.getDocumentationContentRaw(from, pag.id)
  for (const filas of tablasDe(raw)) {
    total++
    const cab = (filas[0].cells ?? []).map(textoDe)
    const anchos = (filas[0].cells ?? []).map(c => c.columnWidth)
    const col0 = filas.slice(1).map(f => textoDe((f.cells ?? [])[0]))
    const ok = anchos.length > 0 && anchos.every(a => typeof a === "number")
    if (ok) {
      conAnchos++
      capturado[firmaDeTabla(cab, col0)] = anchos
    }
    informe.push({
      pagina: pag.title, cab: cab.join(" | ") || "(sin encabezados)", primerDato: col0[0] ?? "", filas: col0.length,
      anchos: ok ? anchos : null, suma: ok ? anchos.reduce((a, b) => a + b, 0) : null,
    })
  }
}

console.log(`\nAnchos capturados de Supernova — ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (CDMX)\n`)
let pagAct = null
for (const t of informe) {
  if (t.pagina !== pagAct) { console.log(`\n── ${t.pagina} ──`); pagAct = t.pagina }
  const marca = t.anchos ? String(t.suma).padStart(4) : "  ??"
  console.log(`  ${marca}  ${(t.anchos ? t.anchos.join("/") : "SIN ANCHOS").padEnd(24)}  ${t.cab.slice(0, 46).padEnd(46)} @ ${String(t.primerDato).slice(0, 18).padEnd(18)} ${t.filas}f`)
}

// ── Cobertura, que es obligatoria (regla 16) ──
const firmas = Object.keys(capturado).length
console.log(`\ncobertura: ${conAnchos} de ${total} tablas con anchos · ${firmas} firmas únicas`)
if (conAnchos < total) {
  console.log(`🔴 ${total - conAnchos} tabla(s) sin anchos legibles — NO se puede preservar lo que no se lee.`)
  process.exitCode = 1
}
if (firmas < conAnchos) {
  console.log(`🔴 ${conAnchos - firmas} tabla(s) comparten firma: solo se guardaría la última, y las demás`)
  console.log(`   se perderían SIN ERROR. Añade discriminante o el emparejador no sirve.`)
  process.exitCode = 1
}

const bloque = "export const ANCHOS_DEL_LEAD = {\n" +
  Object.entries(capturado)
    .map(([f, a]) => `  ${(JSON.stringify(f) + ":").padEnd(72)} ${JSON.stringify(a)},`)
    .join("\n") + "\n}\n"

if (!ESCRIBIR) {
  console.log(`\n${bloque}`)
  console.log("Para guardarlo: npm run docs:anchos -- --escribir")
} else {
  const src = readFileSync(DESTINO, "utf8")
  const re = /export const ANCHOS_DEL_LEAD = \{[\s\S]*?\n\}\n/
  if (!re.test(src)) { console.error("🔴 No encontré ANCHOS_DEL_LEAD en anchos-de-tabla.mjs"); process.exit(1) }
  writeFileSync(DESTINO, src.replace(re, bloque))
  console.log(`\n✓ anchos-de-tabla.mjs actualizado con ${firmas} firmas.`)
}
