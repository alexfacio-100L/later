// Vuelca el contenido crudo completo de una pagina de documentacion a un archivo.
// Existe porque writeMarkdownToPage REEMPLAZA la pagina entera: cualquier bloque
// creado a mano en la interfaz se pierde en la siguiente publicacion.
//   node volcar-pagina.mjs <pageId> <archivo-destino>
import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const raw = await sn.documentation.getDocumentationContentRaw(
  { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }, process.argv[2])
const obj = typeof raw === "string" ? JSON.parse(raw) : raw
fs.writeFileSync(process.argv[3], JSON.stringify(obj, null, 2))
