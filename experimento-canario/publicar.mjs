/**
 * Convierte el .md de uSpec y lo escribe en Supernova.
 *   node publicar.mjs            → solo valida e informa
 *   node publicar.mjs --escribir → escribe en la página
 */
import { exigirDestino, destino } from "./destino.mjs"
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { convertir } from "./conversor.mjs"
const { Supernova } = sdkPkg

exigirDestino("supernova")
console.log(`destino: ${destino.nombre} (${destino.estado})\n`)

const PAGE = "44285c3c-dbe6-4504-a485-2ab58a6fa8ba"   // Componentes / Button Canario
const MD   = new URL("../Componentes/button.md", import.meta.url)

const tokens = existsSync(new URL("./tokens.json", import.meta.url))
  ? JSON.parse(readFileSync(new URL("./tokens.json", import.meta.url), "utf-8")) : {}

const original = readFileSync(MD, "utf-8")
const frames = existsSync(new URL("./frames-subidos.json", import.meta.url))
  ? JSON.parse(readFileSync(new URL("./frames-subidos.json", import.meta.url), "utf-8")) : {}
const iconosTipo = existsSync(new URL("./iconos-tipo.json", import.meta.url))
  ? JSON.parse(readFileSync(new URL("./iconos-tipo.json", import.meta.url), "utf-8")) : {}
const { mdx, informe } = convertir(original, tokens, frames, iconosTipo)
writeFileSync(new URL("./salida.mdx", import.meta.url), mdx)

console.log(`entrada : ${original.split("\n").length} líneas`)
console.log(`salida  : ${mdx.split("\n").length} líneas`)
console.log(`\nsecciones omitidas (metadato) : ${informe.omitidas.join(", ") || "ninguna"}`)
console.log(`bloques vivos                 : ${informe.vivas.join(" · ") || "ninguno"}`)
console.log(`tablas convertidas            : ${informe.tablas}`)
console.log(`callouts generados            : ${informe.callouts}`)
if (informe.tokensNoResueltos.length)
  console.log(`⚠️  tokens sin resolver        : ${informe.tokensNoResueltos.join(", ")}`)

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const val = await sdk.import.validateMarkdown(from, mdx)
if (!val.isValid) { console.log(`\n✗ ${val.error.message.replace(/\s+/g," ").slice(0,300)}`); process.exit(1) }
console.log(`\n✓ válido — ${val.blockCount} bloques`)

if (process.argv.includes("--escribir")) {
  const r = await sdk.import.writeMarkdownToPage(from, PAGE, mdx)
  console.log(`✓ escrito — ${r.blockCount} bloques`)
}
