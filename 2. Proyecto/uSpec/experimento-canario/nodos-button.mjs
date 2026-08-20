import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const [e] = await sdk.dataSources.getFigmaNodeStructures(from)
const det = await sdk.dataSources.getFigmaNodeStructureDetail({ ...from, figmaStructureId: e.id })
const btn = det.rootNode.children.find(c => /Button/i.test(c.name))
console.log(`Página: "${btn.name.trim()}"  (id ${btn.id})\n`)
for (const n of btn.children) {
  console.log(`  ${n.type.padEnd(16)} ${n.name.slice(0,52).padEnd(54)} id=${n.id}  hijos=${n.children.length}`)
}
