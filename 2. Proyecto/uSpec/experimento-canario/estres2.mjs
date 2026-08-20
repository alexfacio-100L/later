import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const ROOT = "9b865d29-2c54-4c57-b92a-0f00fdf67a87"

// Probar varias formas del payload hasta dar con la correcta
const intentos = [
  ["parentId + title",            { parentId: ROOT, title: "🧪 Prueba A" }],
  ["parentGroupId + title",       { parentGroupId: ROOT, title: "🧪 Prueba B" }],
  ["parentPersistentId + title",  { parentPersistentId: ROOT, title: "🧪 Prueba C" }],
  ["parentId + name",             { parentId: ROOT, name: "🧪 Prueba D" }],
]
for (const [etq, payload] of intentos) {
  try {
    const id = await sdk.documentation.createDocumentationGroup(from, payload)
    console.log(`✅ ${etq.padEnd(28)} → ${id}`)
    await sdk.documentation.deleteDocumentationGroupAndTree(from, id).catch(()=>{})
    break
  } catch(e) {
    const det = e?.response?.data ?? e?.cause ?? e?.detail ?? e?.message ?? e
    console.log(`❌ ${etq.padEnd(28)} ${JSON.stringify(det).slice(0,190)}`)
  }
}
