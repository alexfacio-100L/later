import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const log = []
for (const [nombre, id] of [["Especificaciones","40847796"]]) {
  try {
    const raw = await sn.documentation.getDocumentationContentRaw(ref, id)
    const txt = typeof raw === "string" ? raw : JSON.stringify(raw)
    log.push(txt)
  } catch(e){ log.push(`${nombre}: ERR ${(e?.message??e).toString().slice(0,120)}`) }
}
fs.writeFileSync(process.argv[2], log.join("\n"))
