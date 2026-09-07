import { apiKey } from "/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario/entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const tokens = await sdk.tokens.getTokens({ designSystemId: ds.id, versionId: v.id })
console.log("tokens totales:", tokens.length)
let comps = []
try { comps = await sdk.components.getComponents({ designSystemId: ds.id, versionId: v.id }) } catch(e){ console.log("componentes error:", e.message) }
console.log("componentes en Supernova:", comps.length, comps.slice(0,10).map(c=>c.name))
// mapa nombre completo -> token
const byName = new Map()
for (const t of tokens) byName.set(t.origin?.name ?? t.name, t)
const objetivo = ["background/brandHover","background/brandMain","background/brandPressed","border/focus","background/hover","text/primaryInverse","background/selected"]
for (const n of objetivo) {
  const t = byName.get(n)
  if (!t) { console.log(n, "🔴 no encontrado"); continue }
  const u = await sdk.tokens.getTokenUsage({ designSystemId: ds.id, versionId: v.id, tokenId: t.persistentId ?? t.id })
  const keys = Object.keys(u ?? {})
  const resolve = (arr)=> (arr??[]).length
  console.log(`\n${n}  claves=${keys.join(",")}`)
  console.log(`   tokens que lo aliasan: ${resolve(u.tokens)}  ${(u.tokens??[]).map(x=>x.name??x.id).slice(0,20).join(", ")}`)
  console.log(`   componentes: ${resolve(u.components)}`)
  console.log(`   páginas de doc: ${resolve(u.documentationPages)}`)
}
