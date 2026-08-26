import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const OUT = process.argv[2]; const log = []
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const paginas = [
  ["Uso",            "4f226a37-a18d-4343-83ed-1c5555599ef6"],
  ["Especificación", "249d3b24-ca1f-4e1b-b27d-cd97f391d492"],
  ["Código",         "5e049f0e-fff9-4629-b755-ed5632136ecf"],
]
for (const [nombre, pid] of paginas) {
  try { await sn.documentation.deleteDocumentationPage(ref, pid); log.push(`✓ ${nombre}`) }
  catch(e){ log.push(`🔴 ${nombre}: ${(e?.message ?? String(e)).slice(0,180)}`) }
}
fs.writeFileSync(OUT, log.join("\n"))
