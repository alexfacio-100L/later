import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const estructuras = await sdk.dataSources.getFigmaNodeStructures(from)
console.log(`ESTRUCTURAS DE NODOS IMPORTADAS: ${estructuras.length}`)
for (const e of estructuras) {
  console.log(`  estado=${e.state}  actualizada=${e.updatedAt?.toISOString?.().slice(0,16) ?? "?"}  id=${e.id}`)
  try {
    const det = await sdk.dataSources.getFigmaNodeStructureDetail({ ...from, figmaStructureId: e.id })
    const raiz = det.rootNode
    console.log(`     raíz: ${raiz.name} (${raiz.type}) · ${raiz.children.length} páginas`)
    const btn = raiz.children.find(c => /Button/i.test(c.name))
    if (btn) console.log(`     ✅ página Button encontrada: "${btn.name}" con ${btn.children.length} nodos`)
    else console.log(`     páginas: ${raiz.children.slice(0,6).map(c=>c.name.trim()).join(" · ")}`)
  } catch (err) { console.log(`     (sin detalle: ${String(err.message).slice(0,60)})`) }
}
if (!estructuras.length) console.log("  → hay que re-importar el source para que Supernova lea el árbol de nodos")
