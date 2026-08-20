import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

// ¿text/disabled está corregido allá?
const tokens = await sdk.tokens.getTokens(from)
const td = tokens.find(t => (t.origin?.name ?? t.name) === 'text/disabled')
console.log("text/disabled en Supernova:")
if (td) {
  const val = JSON.stringify(td.value ?? td).slice(0, 120)
  console.log("  ", val)
}
// Fecha del último import
const fuentes = await sdk.dataSources.getDataSources(from)
console.log("\nImports:")
for (const f of fuentes) {
  const fecha = f.lastImportedAt ? new Date(f.lastImportedAt).toISOString().slice(0,16).replace('T',' ') : '—'
  console.log(`  ${f.type.padEnd(22)} ${fecha}  ${f.hasError ? '🔴 error' : ''}`)
}
