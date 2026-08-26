import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const casos = {
  "bloque Tabs desde Markdown": `<SNBlock packageId="io.supernova.block.tabs" variantId="tabs">\n  <SNItem>\n    <SNProp name="title" value="Uno" />\n  </SNItem>\n</SNBlock>`,
  "Guidelines Do/Don't":        `<SNBlock packageId="io.supernova.block.do-dont-guidelines" variantId="prominent">\n  <SNItem>\n    <SNProp name="type" value="Do" />\n  </SNItem>\n</SNBlock>`,
  "Callout":                    `<SNCallout variant="Info">\nTexto\n</SNCallout>`,
  "Lista":                      `- uno\n- dos`,
}
for (const [nombre, md] of Object.entries(casos)) {
  try {
    const r = await sn.import.validateMarkdown(ref, md)
    console.log(`${r?.isValid ? "✓ acepta " : "🔴 RECHAZA"}  ${nombre}` + (r?.isValid ? "" : ` — ${r?.error?.message?.slice(0,110)}`))
  } catch(e){ console.log(`🔴 ERROR   ${nombre} — ${(e?.message??e).toString().slice(0,110)}`) }
}
