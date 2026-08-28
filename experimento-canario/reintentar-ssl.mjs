import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const log = []
try {
  const r = await sn.designSystems.startSslGenerationForCustomDomain("825551")
  log.push("petición enviada: " + JSON.stringify(r).slice(0,300))
} catch(e){ log.push("ERR al lanzar: " + (e?.message ?? e).toString().slice(0,240)) }
await new Promise(r => setTimeout(r, 8000))
try {
  const d = await sn.designSystems.designSystemCustomDomain("825551")
  log.push(`\nestado ahora: ${d.state}` + (d.error ? `  ·  ${d.error}` : ""))
} catch(e){ log.push("no pude releer: " + (e?.message??e).toString().slice(0,120)) }
fs.writeFileSync(process.argv[2], log.join("\n"))
