import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const OUT = process.argv[2]; const log = []
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const GRUPO = "50531aaf-af9d-42ce-b9fb-6670d348eeb8"
for (const nombre of ["Usos", "Especificaciones", "Estatus y cambios"]) {
  try {
    const id = await sn.documentation.createDocumentationTab(ref, { fromItemPersistentId: GRUPO, tabName: nombre })
    log.push(`✓ ${nombre}: ${id}`)
  } catch(e){ log.push(`🔴 ${nombre}: ${(e?.message ?? String(e)).slice(0,260)}`) }
}
fs.writeFileSync(OUT, log.join("\n"))
