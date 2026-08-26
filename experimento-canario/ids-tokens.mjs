import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const tokens = await sn.tokens.getTokens(ref)
const grupos = await sn.tokens.getTokenGroups(ref)
const gmap = new Map(grupos.map(g => [g.id, g]))
const ruta = t => { const g = gmap.get(t.parentGroupId); return g ? `${g.name}/${t.name}` : t.name }
const QUIERO = ["background/brandMain","background/brandHover","background/brandPressed",
  "background/hover","background/selected","background/secondary","background/disabled",
  "text/primaryInverse","text/primaryInverseStatic","text/secondary","text/disabled",
  "icon/inverse","icon/inverseStatic","icon/disabled","border/focus","border/disabled"]
const out = {}
for (const t of tokens) { const r = ruta(t); if (QUIERO.includes(r) && !out[r]) out[r] = t.id }
const faltan = QUIERO.filter(q => !out[q])
fs.writeFileSync(process.argv[2], JSON.stringify({ tokens: out, faltan }, null, 2))
