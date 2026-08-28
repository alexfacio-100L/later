import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key); const WS="767109"; const log=[]
try {
  const m = await sn.workspaces.userMemberships(WS)
  log.push(`MIEMBROS: ${m.length}`)
  for (const x of m) log.push(`  ${(x.user?.name ?? x.userId ?? "?").padEnd(22)} ${(x.user?.email ?? "").padEnd(32)} ${x.role ?? x.seat ?? "?"}`)
} catch(e){ log.push("miembros ERR: " + (e?.message??e).toString().slice(0,140)) }
try {
  const inv = await sn.workspaces.workspaceInvitations(WS)
  log.push(`\nINVITACIONES PENDIENTES: ${inv.length}`)
  for (const i of inv) log.push(`  ${(i.email??"?").padEnd(34)} ${i.role ?? "?"}  ${i.id}`)
} catch(e){ log.push("invitaciones ERR: " + (e?.message??e).toString().slice(0,140)) }
try {
  const f = await sn.workspaces.workspaceProductFeatures(WS)
  const j = JSON.stringify(f)
  for (const k of ["workspaceViewers","workspaceSeats","fullSeats","documentationPages","publicDocumentation"]) {
    const m = j.match(new RegExp(`"${k}":\\{[^}]*\\}|"${k}":[^,}]*`))
    if (m) log.push(`\n  ${k}: ${m[0].split(":").slice(1).join(":")}`)
  }
} catch(e){ log.push("\nfeatures ERR: " + (e?.message??e).toString().slice(0,90)) }
fs.writeFileSync(process.argv[2], log.join("\n"))
