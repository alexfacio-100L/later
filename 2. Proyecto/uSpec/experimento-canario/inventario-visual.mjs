import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const frames = await sdk.resources.getFigmaFrames(from)
console.log(`FRAMES DE FIGMA DISPONIBLES: ${frames.length}`)
const btn = frames.filter(f => /button|link|chip/i.test(f.title || f.name || ""))
console.log(`  relacionados con Button/Link/Chip: ${btn.length}`)
for (const f of btn.slice(0,12)) {
  console.log(`   · ${(f.title||f.name||"?").slice(0,52).padEnd(54)} id=${f.id ?? f.persistentId}`)
}
if (frames.length && !btn.length) {
  console.log("\n  muestra de los que sí hay:")
  for (const f of frames.slice(0,8)) console.log(`   · ${(f.title||f.name||"?").slice(0,60)}`)
}
