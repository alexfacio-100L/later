import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const items = await sn.documentation.getDocumentationStructure(ref)
const paginas = items.filter(i => !Array.isArray(i.childrenIds ?? i.children))
const log = [`revisando ${paginas.length} páginas en busca de Sections tipo Tabs…\n`]
for (const p of paginas) {
  try {
    const raw = await sn.documentation.getDocumentationContentRaw(ref, String(p.id))
    const t = typeof raw === "string" ? raw : JSON.stringify(raw)
    if (/"sectionType":"Tabs"|"type":"Section"/.test(t)) {
      const n = (t.match(/"sectionType":"Tabs"/g) ?? []).length
      log.push(`  🎯 ${p.title}  ·  ${n} section(es) Tabs  ·  id ${p.id}`)
    }
  } catch(e){}
}
if (log.length === 1) log.push("  ninguna página usa Sections de tipo Tabs")
fs.writeFileSync(process.argv[2], log.join("\n"))
