import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const log = []
try {
  const cols = await sn.tokens.getTokenCollections(ref)
  log.push(`colecciones en Supernova: ${cols.length}`)
  for (const c of cols) log.push(`  ${c.name ?? c.id}`)
} catch(e){ log.push("colecciones ERR: " + (e?.message??e).toString().slice(0,140)) }
fs.writeFileSync(process.argv[2], log.join("\n"))
