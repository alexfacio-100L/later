import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const r = await sn.resources.getAssetResources(ref)
const log = [`recursos: ${r.length}`, "", "— forma del primero —", JSON.stringify(r[0]).slice(0,400), ""]
const F = JSON.parse(fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario/frames-subidos.json","utf8"))
const a = F["Anatomy"]
const ridUrl = a.url.split("/").pop().replace(".png","")
log.push(`Anatomy · assetId=${a.assetId}`)
log.push(`Anatomy · id-en-url=${ridUrl}`)
const porAsset = r.find(x => String(x.id) === a.assetId)
const porUrl = r.find(x => String(x.id) === ridUrl)
log.push(`  ¿existe recurso con el assetId? ${porAsset ? "SÍ" : "no"}`)
log.push(`  ¿existe recurso con el id de la url? ${porUrl ? "SÍ" : "no"}`)
if (porAsset) log.push("  campos: " + JSON.stringify(porAsset).slice(0,300))
fs.writeFileSync(process.argv[2], log.join("\n"))
