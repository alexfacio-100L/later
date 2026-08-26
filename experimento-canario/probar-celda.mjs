import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const RID = "460b16bc-7ea5-4982-8f6e-d9b372a554d1"
const celda = (c) => `<SNTable showBorder>\n  <SNTableRow>\n    <SNTableCell alignment="Left" columnWidth={200}>\n${c}\n    </SNTableCell>\n  </SNTableRow>\n</SNTable>`
const casos = {
  "imagen + texto misma línea": celda(`      <SNImage alignment="Left" resourceId="${RID}" /> verticalPadding`),
  "texto + imagen misma línea": celda(`      verticalPadding <SNImage alignment="Left" resourceId="${RID}" />`),
  "texto, salto, imagen":       celda(`      verticalPadding\n\n      <SNImage alignment="Left" resourceId="${RID}" />`),
  "solo texto":                 celda(`      verticalPadding`),
  "imagen con caption":         celda(`      <SNImage alignment="Left" resourceId="${RID}" caption="x" /> verticalPadding`),
}
const log = []
for (const [n, md] of Object.entries(casos)) {
  const r = await sn.import.validateMarkdown(ref, md)
  log.push(`${r?.isValid ? "✓" : "🔴"} ${n}` + (r?.isValid ? "" : ` — ${r?.error?.message?.slice(0,80)}`))
}
fs.writeFileSync(process.argv[2], log.join("\n"))
