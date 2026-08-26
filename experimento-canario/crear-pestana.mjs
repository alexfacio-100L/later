import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const BUTTON_PID = process.argv[3] ?? "249d3b24-ca1f-4e1b-b27d-cd97f391d492"
const nombre = process.argv[2]
try {
  const r = await sn.documentation.createDocumentationTab(ref, {
    fromItemPersistentId: BUTTON_PID,
    tabName: nombre,
  })
  console.log("OK creada:", JSON.stringify(r).slice(0,200))
} catch(e){ console.log("ERR:", (e?.message ?? String(e)).slice(0,300)) }
