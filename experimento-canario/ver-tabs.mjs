import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const raw = await sn.documentation.getDocumentationContentRaw(
  { designSystemId:"825551", versionId:v.id, workspaceId:"767109" }, "40847796")
const t = typeof raw === "string" ? raw : JSON.stringify(raw)
const i = t.indexOf('"type":"Section"')
fs.writeFileSync(process.argv[2], t.slice(Math.max(0,i-120), i+1400))
