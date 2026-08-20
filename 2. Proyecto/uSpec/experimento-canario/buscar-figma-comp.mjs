import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const comps = await sdk.components.getFigmaComponents?.(from) ?? await sdk.components.getComponents(from)
const lista = Array.isArray(comps) ? comps : []
console.log(`componentes leídos: ${lista.length}`)
const btn = lista.filter(c => /^(Button|Link|Chip)$/i.test(c.name ?? c.meta?.name ?? ""))
for (const b of btn) console.log(`  ${(b.name ?? b.meta?.name).padEnd(10)} id=${b.id}  persistentId=${b.persistentId ?? "—"}`)
if (!btn.length) console.log("  (ninguno con ese nombre exacto; muestra:", lista.slice(0,3).map(c=>c.name??c.meta?.name).join(" · "), ")")
