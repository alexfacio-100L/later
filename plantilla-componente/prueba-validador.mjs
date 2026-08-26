import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const r = await sn.import.validateMarkdown(ref, `<SNBlock packageId="io.supernova.block.acordeon-que-no-existe">\n<SNProp name="x" value={1} />\n</SNBlock>`)
console.log("forma del resultado:", JSON.stringify(r).slice(0, 600))
