import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const OUT = process.argv[2]; const log = []
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
// El grupo Button y sus tres pestañas. El contenido vive en el repo:
// plantilla-componente/salida/button/*.mdx — esto es reversible.
try {
  await sn.documentation.deleteDocumentationGroup(ref, { id: "561d3e6e-c1fb-47b6-871e-b3a1b84d6d68" })
  log.push("✓ grupo Button borrado con sus tres pestañas")
} catch(e){ log.push("🔴 " + (e?.message ?? String(e)).slice(0,260)) }
fs.writeFileSync(OUT, log.join("\n"))
