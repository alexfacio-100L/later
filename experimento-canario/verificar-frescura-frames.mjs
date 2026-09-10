/**
 * verificar-frescura-frames.mjs — ¿la imagen que publica la página sigue siendo
 *                                 la que Supernova tiene?
 *
 * POR QUÉ EXISTE, y nace del 10 sep 2026
 * ---------------------------------------
 * `frames-vivos.json` guarda, por cada preview, la URL de su imagen renderizada.
 * Esa URL se incrusta en la página. **Supernova re-renderiza por su cuenta** —el
 * sync de Figma corre cada hora— y al hacerlo **emite una URL NUEVA**.
 *
 * 🔴 La vieja no da error: sigue sirviendo el PNG de siempre. Así que la página
 * publica una imagen que ya no es la vigente, con la forma correcta y sin ningún
 * aviso. *Medido ese día: el registro apuntaba a `cd7531e9…` y Supernova ya
 * servía `1047e669…` — un render de la 1:00 p.m. que la página no estaba usando.*
 *
 * ⚠️ LO QUE ESTA GUARDA **NO** DETECTA, y hay que decirlo porque fue el error
 * que la motivó: **si el frame cambia en Figma pero el nodo registrado no lo
 * incluye, esto no ve nada.** El caso real: el Lead añadió cotas de padding al
 * frame «Button sizes» y no aparecían — porque lo que se renderiza es la capa
 * `#Preview`, y las cotas estaban FUERA de ella. Dimensiones idénticas, URL
 * nueva, contenido incompleto. *Ningún número lo delata: hay que mirar la
 * imagen.* **Esto vigila la frescura del render, no que el nodo sea el correcto.**
 *
 *   npm run docs:frescura
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import fs from "node:fs"

const { Supernova } = sdkPkg
const RUTA = new URL("./frames-vivos.json", import.meta.url)
const reg = JSON.parse(fs.readFileSync(RUTA, "utf8"))

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const frames = await sdk.resources.getFigmaFramesV2(from)
const porNodo = new Map(frames.map(f => [String(f.data?.sceneNodeId), f]))
const loc = d => d ? new Date(d).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) : "—"

const obsoletos = [], redimensionados = [], ausentes = []
let frescos = 0
const N = Object.keys(reg).length

for (const [seccion, r] of Object.entries(reg)) {
  const f = porNodo.get(String(r.nodo))
  if (!f) { ausentes.push(seccion); continue }
  const img = f.data?.renderedImage ?? {}
  const mismaUrl = img.url === r.url
  const mismoTam = img.width === r.ancho && img.height === r.alto

  if (!mismoTam) redimensionados.push({ seccion, antes: `${r.ancho}×${r.alto}`, ahora: `${img.width}×${img.height}`, cuando: loc(f.updatedAt) })
  else if (!mismaUrl) obsoletos.push({ seccion, cuando: loc(f.updatedAt) })
  else frescos++
}

console.log(`\nFrescura de los previews — ${loc(Date.now())} (CDMX)\n`)

if (redimensionados.length) {
  /* Un cambio de tamaño es la señal MÁS fuerte: el frame cambió de verdad. */
  console.log(`🔴 ${redimensionados.length} frame(s) cambiaron de tamaño en Figma:`)
  for (const o of redimensionados)
    console.log(`   ${o.seccion.padEnd(34)} ${o.antes} → ${o.ahora}   (${o.cuando})`)
}
if (obsoletos.length) {
  console.log(`${redimensionados.length ? "\n" : ""}🔶 ${obsoletos.length} preview(s) con render NUEVO que la página no usa:`)
  for (const o of obsoletos) console.log(`   ${o.seccion.padEnd(34)} re-renderizado ${o.cuando}`)
  console.log(`\n   La página sigue sirviendo la URL vieja. No da error: sirve el PNG de siempre.`)
}
if (ausentes.length) {
  console.log(`\n⚠️  ${ausentes.length} registrado(s) que Supernova ya no tiene:`)
  for (const s of ausentes) console.log(`   ${s}`)
}

/* Cobertura declarada (regla 16). */
console.log(`\ncobertura: ${frescos} de ${N} previews al día` +
  (obsoletos.length ? ` · ${obsoletos.length} con render más nuevo` : "") +
  (redimensionados.length ? ` · ${redimensionados.length} redimensionados` : "") +
  (ausentes.length ? ` · ${ausentes.length} ausentes` : ""))

if (frescos === N) { console.log(`🟢 Todos los previews publican la imagen vigente.`); process.exit(0) }

console.log(`\n   Para traer los renders vigentes:  npm run docs:frames -- --render --registro`)
console.log(`   Y despues republicar:             npm run button:escribir`)
console.log(`\n⚠️  Antes de regenerar, MIRA la imagen. Un render fresco de un nodo`)
console.log(`   equivocado se ve igual de bien y sigue sin decir lo que debe.`)
process.exitCode = 1
