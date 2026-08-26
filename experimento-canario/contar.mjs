import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const items = await sn.documentation.getDocumentationStructure(ref)
const paginas = items.filter(i => !Array.isArray(i.childrenIds ?? i.children))
const log = [`PÁGINAS: ${paginas.length} de 20`, ""]
for (const p of paginas) {
  const bloques = (p.blocks ?? []).length
  log.push(`  ${(p.title ?? "?").padEnd(32)} ${bloques ? bloques + " bloques" : "— vacía —"}`)
}
fs.writeFileSync(process.argv[2], log.join("\n"))
