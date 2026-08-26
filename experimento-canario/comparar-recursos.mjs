import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const r = await sn.resources.getAssetResources({ designSystemId:"825551", versionId:v.id })
const porId = new Map(r.map(x => [String(x.id), x]))
const F = JSON.parse(fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario/frames-subidos.json","utf8"))
const I = JSON.parse(fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario/iconos-tipo.json","utf8"))
const log = []
const nuevo = porId.get(F["Anatomy"].assetId)
const viejo = porId.get(I.frame.assetId)
log.push("RECIÉN SUBIDO (Anatomy recortada):")
log.push("  " + JSON.stringify(nuevo ?? "🔴 NO EXISTE COMO RECURSO"))
log.push("\nDEL CANARIO VIEJO (icono frame, que sí se veía):")
log.push("  " + JSON.stringify(viejo ?? "no existe"))
fs.writeFileSync(process.argv[2], log.join("\n"))
