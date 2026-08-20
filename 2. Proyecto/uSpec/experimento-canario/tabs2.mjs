import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const ROOT = "9b865d29-2c54-4c57-b92a-0f00fdf67a87"

const pid = await sdk.documentation.createDocumentationGroup(from, { parentPersistentId: ROOT, title: "🧪 Tabs" })
let est = await sdk.documentation.getDocumentationStructure(from)
const g = est.find(x => x.persistentId === pid)
console.log(`grupo: id=${g.id} persistentId=${pid} behavior=${g.groupBehavior}`)

for (const [etq, p] of [
  ["id numérico + groupBehavior", { id: g.id, groupBehavior: "Tabs" }],
  ["id numérico + title",         { id: g.id, title: "🧪 Renombrado OK" }],
]) {
  try { await sdk.documentation.updateDocumentationGroup(from, p); console.log(`  llamada OK: ${etq}`) }
  catch(e){ console.log(`  ❌ ${etq}`) }
}
est = await sdk.documentation.getDocumentationStructure(from)
const f = est.find(x => x.persistentId === pid)
console.log(`\nRESULTADO → title="${f.title}"  groupBehavior=${f.groupBehavior}`)
console.log(f.groupBehavior === "Tabs" ? "✅ TABS FUNCIONA" : "❌ no aplicó")
await sdk.documentation.deleteDocumentationGroupAndTree(from, pid).catch(()=>{})
