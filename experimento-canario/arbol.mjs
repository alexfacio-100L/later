import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const OUT = process.argv[2]; const log = []
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const items = await sn.documentation.getDocumentationStructure(ref)
const pages = items.filter(i => !(i.childrenIds ?? i.children))
log.push(`elementos: ${items.length}`)
for (const i of items) {
  const esGrupo = Array.isArray(i.childrenIds ?? i.children)
  log.push(`${esGrupo ? "▸ GRUPO" : "· pág  "} ${(i.title ?? i.name ?? "(sin título)").padEnd(28)} id=${i.id}  persistentId=${i.persistentId ?? "-"}`)
}
fs.writeFileSync(OUT, log.join("\n"))
