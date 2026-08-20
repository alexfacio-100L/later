#!/usr/bin/env node
/**
 * Puerta de calidad de los previews, ANTES de que lleguen a Supernova.
 *
 * Un preview con el componente diminuto valida igual de bien que uno legible:
 * `validateMarkdown` responde por la sintaxis, no por lo que se ve. El 21 ago
 * 2026 se publicaron previews donde el componente ocupaba el 6% del lienzo.
 *
 *   node verificar-previews.mjs          → informa y falla si algo no cumple
 *   node verificar-previews.mjs --forzar → informa pero deja pasar
 *
 * Cada entrada de frames-subidos.json debe traer `ocupacion` (el % del wrapper
 * que ocupa el contenido dibujado, medido en Figma al recortar). Sin ese dato
 * el preview cuenta como NO verificado: la ausencia de medida no es aprobado.
 */
import { readFileSync, existsSync, statSync } from "node:fs"

// Supernova escala la imagen al ancho de la columna, asi que lo que decide como
// se ve NO es el area ocupada sino la FRACCION DE ANCHO que ocupa el contenido.
// Medido el 21 ago 2026 con el mismo preview del Button:
//   contenido / ancho = 14%  →  diminuto
//   contenido / ancho = 71%  →  gigante
//   contenido / ancho = 33%  →  correcto
export const LIMITES = {
  fraccionAnchoMin: 25,  // % del ancho ocupado por el contenido
  fraccionAnchoMax: 55,  // por encima, la imagen se amplia y el trazo se ve tosco
  ladoMaximo: 4096,      // px — por encima, la imagen pesa sin aportar
  ladoMinimo: 120,       // px — por debajo, se pixela al ampliarla
}

/** Lee ancho y alto de un PNG sin dependencias: bytes 16..24 de la cabecera IHDR. */
function medirPNG(ruta) {
  const b = readFileSync(ruta)
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: statSync(ruta).size }
}

export function verificar(registro, baseUrl) {
  const filas = []
  for (const [seccion, meta] of Object.entries(registro)) {
    const fila = { seccion, nombre: meta.nombre ?? seccion, problemas: [] }

    const fr = typeof meta.fraccionAncho === "number" ? meta.fraccionAncho : null
    fila.fraccionAncho = fr
    if (fr === null) {
      fila.problemas.push("sin medir — falta `fraccionAncho` en el registro")
    } else if (fr < LIMITES.fraccionAnchoMin) {
      fila.problemas.push(`el contenido ocupa el ${fr}% del ancho (mínimo ${LIMITES.fraccionAnchoMin}%) — se verá diminuto`)
    } else if (fr > LIMITES.fraccionAnchoMax) {
      fila.problemas.push(`el contenido ocupa el ${fr}% del ancho (máximo ${LIMITES.fraccionAnchoMax}%) — se verá desproporcionado`)
    }

    const ruta = meta.archivo ? new URL(meta.archivo, baseUrl) : null
    if (ruta && existsSync(ruta)) {
      const px = medirPNG(ruta)
      if (px) {
        fila.px = `${px.w}×${px.h}`
        fila.kb = Math.round(px.bytes / 1024)
        const largo = Math.max(px.w, px.h), corto = Math.min(px.w, px.h)
        if (largo > LIMITES.ladoMaximo) fila.problemas.push(`${largo}px de lado (máximo ${LIMITES.ladoMaximo})`)
        if (corto < LIMITES.ladoMinimo) fila.problemas.push(`${corto}px de lado (mínimo ${LIMITES.ladoMinimo})`)
      }
    }
    filas.push(fila)
  }
  return filas
}

// ── Ejecutable ───────────────────────────────────────────────
// La comparacion se hace sobre rutas decodificadas: la carpeta del proyecto
// lleva espacios, y `import.meta.url` los trae como %20 mientras argv[1] no.
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"
const esEjecutable = process.argv[1] &&
  resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])
if (esEjecutable) {
  const REG = new URL("./frames-subidos.json", import.meta.url)
  if (!existsSync(REG)) { console.log("No hay frames-subidos.json — nada que verificar."); process.exit(0) }
  const filas = verificar(JSON.parse(readFileSync(REG, "utf-8")), import.meta.url)

  console.log("Previews registrados\n")
  for (const f of filas) {
    const marca = f.problemas.length ? "🔴" : "✅"
    const ocup = f.fraccionAncho === null ? "  ?  " : `${String(f.fraccionAncho).padStart(3)}% `
    console.log(`  ${marca} ${ocup} ${(f.px ?? "").padEnd(11)} ${f.seccion}`)
    for (const p of f.problemas) console.log(`         ↳ ${p}`)
  }

  const malos = filas.filter(f => f.problemas.length)
  if (!malos.length) { console.log(`\n✓ ${filas.length} previews en regla.`); process.exit(0) }

  console.log(`\n🔴 ${malos.length} de ${filas.length} no cumplen.`)
  console.log("   Reajusta el Artwork wrapper y vuelve a exportar —")
  console.log("   ver ACTUALIZAR-USPEC.md > «El recorte del artwork».")
  process.exit(process.argv.includes("--forzar") ? 0 : 1)
}
