import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key); const log=[]
const f = await sn.workspaces.workspaceProductFeatures("767109")
const j = JSON.stringify(f)
for (const k of ["workspaceViewers","workspaceMembers","documentationPages","publicDocumentation","designSystemStorybookSources","themes","codegenSchedules"]) {
  const m = j.match(new RegExp(`"${k}":(\\{[^}]*\\}|[^,}]*)`))
  log.push(`  ${k.padEnd(30)} ${m ? m[1].slice(0,90) : "—"}`)
}
const m = await sn.workspaces.userMemberships("767109")
log.push(`\n  miembros hoy: ${m.length}`)
fs.writeFileSync(process.argv[2], log.join("\n"))
