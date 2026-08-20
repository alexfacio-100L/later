import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const pruebas = {
  "design-tokens col=1": `<SNBlock packageId="io.supernova.block.design-tokens" columns={1}>\n  <SNItem>\n    <SNPropToken name="tokens" value={[]} />\n  </SNItem>\n</SNBlock>`,
  "design-tokens sin col": `<SNBlock packageId="io.supernova.block.design-tokens">\n  <SNItem>\n    <SNPropToken name="tokens" value={[]} />\n  </SNItem>\n</SNBlock>`,
  "figma-component-props": `<SNBlock packageId="io.supernova.block.figma-component-props-table">\n  <SNItem>\n    <SNPropFigmaComponent name="component" value={null} />\n  </SNItem>\n</SNBlock>`,
  "code":            `<SNBlock packageId="io.supernova.block.code">\n  <SNItem>\n    <SNPropCode name="code" value="const x = 1" />\n  </SNItem>\n</SNBlock>`,
  "do-dont":         `<SNBlock packageId="io.supernova.block.do-dont-guidelines">\n  <SNItem>\n    <SNPropText name="title" value="" />\n  </SNItem>\n</SNBlock>`,
  "color-ramps":     `<SNBlock packageId="io.supernova.block.color-ramps">\n  <SNItem>\n    <SNPropToken name="tokens" value={[]} />\n  </SNItem>\n</SNBlock>`,
  "embed-figma":     `<SNBlock packageId="io.supernova.block.embed-figma">\n  <SNItem>\n    <SNPropUrl name="url" value="" />\n  </SNItem>\n</SNBlock>`,
}
for (const [nombre, md] of Object.entries(pruebas)) {
  try {
    const r = await sdk.import.validateMarkdown(from, `## P\n\n${md}\n`)
    console.log(r.isValid ? `  ✅ ${nombre.padEnd(24)} válido` : `  ❌ ${nombre.padEnd(24)} ${r.error.message.replace(/\s+/g,' ').slice(0,95)}`)
  } catch(e) { console.log(`  ⚠️  ${nombre.padEnd(24)} ${String(e.message).slice(0,90)}`) }
}
