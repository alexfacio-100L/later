import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const defs = await sn.designSystems.getBlockDefinitions("825551", v.id)
const corto = id => (id ?? "").replace("io.supernova.block.", "").replace(/^block\./, "")
const propCorta = p => (p.id ?? "").split(".property.").pop()
const log = [`36 bloques · catálogo\n`]
for (const d of defs) {
  log.push(`── ${corto(d.id)}   [${d.category}]  ${d.name}`)
  if (d.variants?.length) log.push(`   variantes: ${d.variants.map(x => x.id ?? x.key).map(corto).join(" · ")}`)
  const props = [...(d.properties ?? []), ...(d.item?.properties ?? [])]
  for (const p of props) {
    let extra = ""
    const op = p.options ?? p.values
    if (op) extra = " → " + JSON.stringify(op).slice(0, 200)
    log.push(`     ${propCorta(p).padEnd(26)} ${String(p.type).padEnd(12)}${extra}`)
  }
}
fs.writeFileSync(process.argv[2], log.join("\n"))
