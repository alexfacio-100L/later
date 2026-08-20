import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const ROOT = "9b865d29-2c54-4c57-b92a-0f00fdf67a87"

const g = await sdk.documentation.createDocumentationGroup(from, { parentPersistentId: ROOT, title: "🧪 Tabs" })
console.log("grupo creado:", g)

const formas = [
  ["persistentId + groupBehavior",       { persistentId: g, groupBehavior: "Tabs" }],
  ["id + groupBehavior",                 { id: g, groupBehavior: "Tabs" }],
  ["persistentId + isTabbed",            { persistentId: g, isTabbed: true }],
  ["groupPersistentId + groupBehavior",  { groupPersistentId: g, groupBehavior: "Tabs" }],
  ["persistentId + title (renombrar)",   { persistentId: g, title: "🧪 Tabs OK" }],
  ["persistentId + name",                { persistentId: g, name: "🧪 Tabs OK" }],
]
for (const [etq, payload] of formas) {
  try { await sdk.documentation.updateDocumentationGroup(from, payload); console.log(`✅ ${etq}`) }
  catch(e){ console.log(`❌ ${etq.padEnd(36)} ${JSON.stringify(e?.response?.data ?? e?.message ?? "").slice(0,90)}`) }
}
// ¿quedó como Tabs?
const est = await sdk.documentation.getDocumentationStructure(from)
const mio = est.find(x => x.persistentId === g || x.id === g)
console.log("\nestado final:", JSON.stringify(mio).slice(0,220))
await sdk.documentation.deleteDocumentationGroupAndTree(from, g).catch(()=>{})
console.log("limpiado")
