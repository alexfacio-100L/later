import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const d = await sn.designSystems.designSystemCustomDomain("825551")
fs.writeFileSync(process.argv[2], `estado: ${d.state}\ndominio: ${d.customerDomain}\n${d.error ? "error: "+d.error : "sin error"}`)
