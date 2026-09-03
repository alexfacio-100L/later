#!/usr/bin/env node
/**
 * ¿La imagen que la página PUBLICA es la que tenemos en disco?
 *
 * 🔴 Por qué existe, y es la tercera forma de la regla 16 —el falso completo—.
 * El 27 de agosto la tarea 4.18 rehízo la geometría del Button y re-exportó los
 * 23 previews. El 28 se recortaron los 23. Y de esos 23, **solo 8 llegaron a
 * subirse**. Los otros 15 siguieron sirviéndose desde el asset anterior, así
 * que la página publicó durante siete días botones con `radius` 8 en product,
 * 12 en marketing y 24 en las tallas m y l — geometría que ya no existe en
 * Figma— mientras el `.md` afirmaba «un único radius/l (16) en las 60
 * variantes». Las dos cosas eran ciertas por separado: el componente estaba
 * bien y las imágenes eran viejas.
 *
 * ⚠️ Y no había ninguna frase que revisar. `frames-subidos.json` traía sus 23
 * entradas con su URL, `verificar-previews.mjs` daba verde —comprueba la
 * `fraccionAncho`, no el contenido— y el `.md` se escribía completo. Un método
 * que resuelve 8 de 23 y no declara su cobertura se lee como si hubiera
 * resuelto los 23.
 *
 * 🟢 Lo que este script sí compara: los BYTES del asset que está en Supernova
 * contra los del PNG local que dice representarlo. Es la única lectura que
 * distingue «subido» de «registrado».
 *
 *   node verificar-subidos.mjs          → cobertura y salida 1 si algo no cuadra
 *   node verificar-subidos.mjs --lista  → además, qué archivo local toca resubir
 */
import { readFileSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"
import path from "node:path"

const AQUI = path.dirname(new URL(import.meta.url).pathname)
const REG  = path.join(AQUI, "frames-subidos.json")
const registro = JSON.parse(readFileSync(REG, "utf8"))
const entradas = Object.entries(registro)

const sha = (b) => createHash("sha256").update(b).digest("hex").slice(0, 12)

/** El PNG que de verdad se subió es el recortado, si existe; si no, el crudo. */
const localDe = (f) => {
  const base = f.archivo.split("/").pop()
  const rec = path.join(AQUI, "frames/recortados", base)
  return existsSync(rec) ? rec : path.join(AQUI, f.archivo)
}

const iguales = [], distintos = [], sinLocal = [], sinRed = []

await Promise.all(entradas.map(async ([seccion, f]) => {
  const ruta = localDe(f)
  if (!existsSync(ruta)) { sinLocal.push({ seccion, ruta }); return }
  if (!f.url)            { sinRed.push({ seccion, motivo: "sin url en el registro" }); return }
  let remoto
  try {
    const r = await fetch(f.url)
    if (!r.ok) { sinRed.push({ seccion, motivo: `HTTP ${r.status}` }); return }
    remoto = Buffer.from(await r.arrayBuffer())
  } catch (e) { sinRed.push({ seccion, motivo: (e?.message ?? e).toString().slice(0, 60) }); return }
  const local = readFileSync(ruta)
  const par = { seccion, ruta, local: sha(local), remoto: sha(remoto), bytes: [local.length, remoto.length] }
  ;(local.equals(remoto) ? iguales : distintos).push(par)
}))

const N = entradas.length
const sum = iguales.length + distintos.length + sinLocal.length + sinRed.length
if (sum !== N) throw new Error(`El reparto no cuadra: ${sum} ≠ ${N}`)

console.log(`Previews del registro: ${N}`)
console.log(`  ✓ el asset publicado es el PNG local: ${iguales.length} de ${N}`)
console.log(`  🔴 publicado ≠ local (falta resubir):  ${distintos.length} de ${N}`)
console.log(`  ⚠️  sin PNG local:                      ${sinLocal.length} de ${N}`)
console.log(`  ⚠️  no se pudo leer el asset:           ${sinRed.length} de ${N}`)

const listar = process.argv.includes("--lista")
if (distintos.length) {
  console.error(`\n🔴 Estos ${distintos.length} publican una imagen que ya no es la de disco:`)
  for (const d of distintos.sort((a, b) => a.seccion.localeCompare(b.seccion)))
    console.error(`   · ${d.seccion.padEnd(34)} local ${d.local} (${d.bytes[0]} B) ≠ publicado ${d.remoto} (${d.bytes[1]} B)`
      + (listar ? `\n       resubir: ${path.relative(AQUI, d.ruta)}` : ""))
  console.error(`\n   Resúbelos con subir-frame.mjs (o resubir-recortados.mjs) y vuelve a escribir la página:`)
  console.error(`   el registro guarda una URL nueva por cada subida, así que sin reescribir no cambia nada.`)
}
for (const s of [...sinLocal, ...sinRed])
  console.error(`   ⚠️  ${s.seccion}: ${s.motivo ?? "no existe " + s.ruta}`)

if (distintos.length || sinLocal.length || sinRed.length) process.exit(1)
console.log("\n🟢 Los 23 assets publicados son byte a byte los PNG de disco.")
