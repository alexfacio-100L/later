import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key); const log=[]
const me = await sn.me.me()
log.push(`sesión: ${me.email ?? me.name ?? me.id}`)
const wss = await sn.workspaces.workspaces(me.id)
for (const w of wss) {
  log.push(`\nworkspace ${w.id} · ${w.name}`)
  for (const k of Object.keys(w)) {
    if (/plan|tier|subscription|seat|billing|trial/i.test(k)) log.push(`   ${k}: ${JSON.stringify(w[k]).slice(0,160)}`)
  }
}
fs.writeFileSync(process.argv[2], log.join("\n"))
