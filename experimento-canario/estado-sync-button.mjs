import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const log = []
const fmt = d => d ? new Date(d).toISOString().slice(0,16).replace("T"," ") : "—"
const st = await sn.components.getFigmaNodeStructures(ref)
const btn = (st ?? []).filter(x => /button/i.test(x.name ?? ""))
log.push(`estructuras de Figma con "button": ${btn.length}`)
for (const b of btn.slice(0,4)) {
  log.push(`  ${b.name}  ·  actualizado ${fmt(b.updatedAt ?? b.importedAt)}`)
}
log.push(`\ntotal estructuras: ${(st ?? []).length}`)
const recientes = (st ?? []).filter(x => new Date(x.updatedAt ?? 0).getTime() > Date.now() - 6*3600*1000)
log.push(`actualizadas en las últimas 6 h: ${recientes.length}`)
log.push(`ahora: ${fmt(Date.now())}`)
fs.writeFileSync(process.argv[2], log.join("\n"))
