import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const e = await sn.dataSources.getStorybookEntries({ designSystemId:"825551", versionId:v.id })
const log = [`${e.length} historias\n`, "— forma de la primera —", JSON.stringify(e[0]).slice(0,700), "", "— todas —"]
for (const x of e) {
  const u = (x.url ?? "").split("?").pop()
  log.push(`  ${x.id}  ${u.slice(0,90)}`)
}
fs.writeFileSync(process.argv[2], log.join("\n"))
