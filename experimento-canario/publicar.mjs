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

// ── Puerta de calidad de los previews ──
// Va ANTES de escribir: validateMarkdown responde por la sintaxis, no por lo
// que se ve. Un preview con el componente diminuto valida igual de bien.
if (process.argv.includes("--escribir") && !process.argv.includes("--forzar")) {
  const { verificar } = await import("./verificar-previews.mjs")
  const malos = verificar(frames, import.meta.url).filter(f => f.problemas.length)
  if (malos.length) {
    console.log(`\n🔴 ${malos.length} preview(s) no pasan la verificación:`)
    for (const f of malos) console.log(`   · ${f.seccion} — ${f.problemas.join("; ")}`)
    console.log("\n   Corrige y reintenta, o publica con --forzar si es deliberado.")
    process.exit(1)
  }
  console.log("✓ previews verificados")

  // ── Puerta de foundations ──
  // El 3 sep 2026 el Lead fijó el orden: los defectos de foundations se corrigen
  // ANTES de documentar. Documentar sobre un token roto publica el defecto — y
  // luego hay que despublicar, que cuesta más. Nada lo imponía hasta ahora.
  // Se salta el barrido de huérfanos (--sin-uso): son informativos y cuestan 84 llamadas.
  const { execFileSync } = await import("node:child_process")
  let informe
  try {
    informe = JSON.parse(
      execFileSync(process.execPath, [new URL("./auditar-foundations.mjs", import.meta.url).pathname, "--json", "--sin-uso"], {
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      }),
    )
  } catch (e) {
    // Salida 1 = hay defectos y el JSON viene por stdout igualmente.
    try { informe = JSON.parse(e.stdout ?? "") } catch {
      console.log("\n🔴 La auditoría de foundations no pudo correr. NO se publica: sin auditoría no hay permiso.")
      console.log(`   ${String(e.message).slice(0, 200)}`)
      process.exit(1)
    }
  }
  const bloqueantes = informe.defectos.filter(d => d.severidad === "crítico" || d.severidad === "alto")
  if (bloqueantes.length) {
    console.log(`\n🔴 ${bloqueantes.length} defectos bloqueantes en foundations. NO se documenta encima de esto.`)
    for (const d of bloqueantes.slice(0, 8)) console.log(`   · ${d.token} — ${d.detalle.replace(/[*`]/g, "")}`)
    if (bloqueantes.length > 8) console.log(`   … y ${bloqueantes.length - 8} más. Informe: npm run docs:foundations:md`)
    console.log("\n   Corrígelos, o publica con --forzar si el Lead lo ha decidido explícitamente.")
    process.exit(1)
  }
  console.log("✓ foundations sin defectos bloqueantes")
}

if (process.argv.includes("--escribir")) {
  const r = await sdk.import.writeMarkdownToPage(from, PAGE, mdx)
  console.log(`✓ escrito — ${r.blockCount} bloques`)
}
