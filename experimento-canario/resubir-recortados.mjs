/**
 * Sube los previews recortados y actualiza el registro con su nuevo recurso.
 *
 * Los originales tenían entre el 50% y el 68% del lienzo en margen. Supernova
 * escala la imagen al ancho de la columna, así que ese margen se comía el
 * espacio y el componente salía diminuto.
 *
 * ⚠️ Sube recursos NUEVOS: los antiguos siguen en el almacén. No se borran
 * porque otras páginas podrían referenciarlos.
 */
import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
import path from "node:path"

const AQUI = path.dirname(new URL(import.meta.url).pathname)
const REG = path.join(AQUI, "frames-subidos.json")
// Todos los del registro que tengan un recorte esperando.
const USADOS = null

const key = fs.readFileSync(path.join(AQUI, "../.env"), "utf8")
  .split("\n").find(l => l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId: "825551", versionId: v.id }

const registro = JSON.parse(fs.readFileSync(REG, "utf8"))
const log = []
for (const nombre of (USADOS ?? Object.keys(JSON.parse(fs.readFileSync(REG, "utf8"))))) {
  const f = registro[nombre]
  const base = f.archivo.split("/").pop()
  const ruta = path.join(AQUI, "frames/recortados", base)
  if (!fs.existsSync(ruta)) { log.push(`🔴 ${nombre}: falta el recortado`); continue }
  const buf = fs.readFileSync(ruta)
  const file = new File([buf], base, { type: "image/png" })
  try {
    const r = await sn.resources.uploadAssetResource(ref, file)
    // La fracción se actualiza aquí y no a mano: recortar al contenido con un
    // respiro del 4% por lado deja el 92%, y el verificador lo comprueba.
    registro[nombre] = { ...f, assetId: r.id, url: r.url, recortado: true, fraccionAncho: 92 }
    log.push(`✓ ${nombre.padEnd(30)} → ${r.id}`)
  } catch (e) { log.push(`🔴 ${nombre}: ${(e?.message ?? e).toString().slice(0, 120)}`) }
}
fs.writeFileSync(REG, JSON.stringify(registro, null, 2) + "\n")
fs.writeFileSync(process.argv[2], log.join("\n"))
