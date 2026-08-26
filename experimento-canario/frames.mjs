import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const log = []
try {
  const fc = await sn.components.getFigmaComponents(ref)
  const btn = fc.filter(c => /button/i.test(c.name ?? ""))
  log.push(`componentes Figma con "button": ${btn.length}`)
  for (const c of btn.slice(0,6)) log.push(`   ${c.name}  id=${c.id}`)
} catch(e){ log.push("figmaComponents ERR: " + (e?.message??e).toString().slice(0,120)) }
try {
  const src = await sn.dataSources.getDesignSources(ref)
  for (const s of src) log.push(`\nsource: ${s.name ?? s.id} · documentationFrames: ${s.settings?.documentationFrames ?? s.documentationFrames ?? "?"}`)
} catch(e){ log.push("sources ERR: " + (e?.message??e).toString().slice(0,120)) }
fs.writeFileSync(process.argv[2], log.join("\n"))
