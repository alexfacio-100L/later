import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const BLOQUES = ["assets","blockquote","callout","code","code-react","color-accessibility-grid",
"component-checklist","component-checklist-all","component-health","context-mcp","design-tokens",
"divider","do-dont-guidelines","embed","embed-figma","embed-lottie","embed-youtube",
"figma-components","figma-components-propstable","figma-frames","files","image","markdown",
"ordered-list","release-notes","rich-text","shortcut-links","storybook","table",
"title1","title2","title3","title4","title5","unordered-list","token-color-ramps"]

for (const b of BLOQUES) {
  const md = `## P\n\n<SNBlock packageId="io.supernova.block.${b}">\n  <SNItem />\n</SNBlock>\n`
  try {
    const r = await sdk.import.validateMarkdown(from, md)
    if (r.isValid) { console.log(`✅ ${b}`); continue }
    const m = r.error.message.replace(/\s+/g,' ')
    // El mensaje suele nombrar la propiedad que falta
    console.log(`${m.includes("UnknownBlockDefinition") ? "❌" : "🔧"} ${b.padEnd(30)} ${m.slice(0,110)}`)
  } catch(e) { console.log(`⚠️  ${b.padEnd(30)} ${String(e.message).slice(0,80)}`) }
}
