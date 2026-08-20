import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
import { readFileSync } from "node:fs"
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const PAGE = "44285c3c-dbe6-4504-a485-2ab58a6fa8ba"
const md = readFileSync(new URL("./canario-widgets.mdx", import.meta.url), "utf-8")

const val = await sdk.import.validateMarkdown(from, md)
if (!val.isValid) { console.log("✗", val.error.message.replace(/\s+/g," ")); process.exit(1) }
console.log(`✓ válido — ${val.blockCount} bloques`)
if (process.argv.includes("--escribir")) {
  const r = await sdk.import.writeMarkdownToPage(from, PAGE, md)
  console.log(`✓ escrito — ${r.blockCount} bloques`)
}
