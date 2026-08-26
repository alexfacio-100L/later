import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const items = await sn.documentation.getDocumentationStructure(ref)
const porId = new Map(items.map(i => [String(i.id), i]))
const grupo = items.find(i => String(i.id) === "40847085")
console.log("grupo:", grupo?.title, "· behavior:", grupo?.groupBehavior ?? grupo?.behavior ?? "?")
const hijos = grupo?.childrenIds ?? grupo?.children ?? []
console.log("pestañas en orden:")
for (const cid of hijos) {
  const h = porId.get(String(cid))
  console.log("   " + (h?.title ?? cid))
}
