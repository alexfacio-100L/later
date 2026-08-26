import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }
const GRUPO = "561d3e6e-c1fb-47b6-871e-b3a1b84d6d68"
const USO    = "4f226a37-a18d-4343-83ed-1c5555599ef6"
const ESPEC  = "249d3b24-ca1f-4e1b-b27d-cd97f391d492"
const CODIGO = "5e049f0e-fff9-4629-b755-ed5632136ecf"
// Orden deseado: Uso · Especificación · Código
const pasos = [
  ["Uso a la primera posición",     { id: USO,    parentPersistentId: GRUPO }],
  ["Especificación tras Uso",       { id: ESPEC,  parentPersistentId: GRUPO, afterPersistentId: USO }],
  ["Código tras Especificación",    { id: CODIGO, parentPersistentId: GRUPO, afterPersistentId: ESPEC }],
]
for (const [que, payload] of pasos) {
  try { await sn.documentation.moveDocumentationPage(ref, payload); console.log("  ✓ " + que) }
  catch(e){ console.log("  🔴 " + que + " — " + (e?.message ?? e).toString().slice(0,160)) }
}
