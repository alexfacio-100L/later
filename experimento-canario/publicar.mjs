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

/* 🔴 CORREGIDO EL 11 SEP 2026. Esta constante apuntaba a
 * `44285c3c-dbe6-4504-a485-2ab58a6fa8ba` — «Componentes / Button Canario», una página
 * que YA NO EXISTE en el árbol. El censo de páginas del 11 sep no la devuelve.
 *
 * ⚠️ Y el guion no lo decía: `--escribir` habría llamado a `writeMarkdownToPage`
 * contra un id muerto. *Forma «falso vigente» de la regla 16: el comentario probaba
 * que la página se llamó así, no que siguiera existiendo.*
 *
 * Ahora el destino se pasa por argumento y SE COMPRUEBA contra el árbol antes de
 * escribir. Sin comprobación, el fallo vuelve a ser silencioso. */
/* 🔴 SIN DESTINO POR DEFECTO, Y ES LA LECCIÓN CARA DEL 11 SEP 2026.
 *
 * Este guion apuntaba a una página BORRADA. Al descubrirlo se le repuntó a la
 * página real del Button… y se sobrescribió con su salida, que es el volcado
 * plano del `.md`: **8 bloques `figma-frames`, el `design-tokens` con sus
 * swatches y 8 `previewContainerSize` se reemplazaron por prosa.** El Lead lo vio
 * en vivo: *«todo lo que habíamos elaborado anteriormente está atropellado»*.
 *
 * ⚠️ El error no fue el id muerto: fue **repuntar un publicador superado a una
 * página viva**. Para el Button el generador vigente es
 * `plantilla-componente/button-canario.mjs` (`npm run button:escribir`), que
 * COLOCA el contenido en secciones y usa bloques vivos. *El `.md` es INSUMO, no
 * la página.*
 *
 * Por eso ya no hay destino por defecto: hay que nombrarlo, y eso obliga a
 * preguntarse si este es el publicador correcto para esa página. */
const PAGE = process.argv.find(a => a.startsWith("--pagina="))?.slice("--pagina=".length)
if (!PAGE) {
  console.error(`\n🔴 Falta el destino. Pásalo con --pagina=<id>.`)
  console.error(`   Y antes de pasarlo, comprueba que ESTE es el publicador de esa página:`)
  console.error(`   el Button se publica con \`npm run button:escribir\`, no con este guion.`)
  process.exit(1)
}
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

  // ── Puerta de foundations, ACOTADA AL COMPONENTE ──
  //
  // 🔴 Corregido el 4 sep 2026: la primera versión bloqueaba si foundations
  // tenía CUALQUIER defecto bloqueante. Había 175 y va a haberlos durante
  // meses — eso no es una puerta, es un muro permanente, y un muro permanente
  // se acaba saltando con --forzar por costumbre. Entonces la guarda deja de
  // existir de verdad y nadie lo nota.
  //
  // El criterio correcto ya estaba escrito en `comp:auditar`: su check
  // `B3-semantico-roto` mira SOLO los semánticos que el componente consume.
  // Documentar el Button no debería esperar a que se arregle un token de una
  // familia que el Button no toca.
  //
  // ⚠️ Y se declara el número global igualmente, para que nadie confunda
  // «este componente puede publicarse» con «el sistema está sano».
  const { execFileSync } = await import("node:child_process")
  const correr = (script, args) => {
    try { return JSON.parse(execFileSync(process.execPath, [new URL(script, import.meta.url).pathname, ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })) }
    catch (e) { try { return JSON.parse(e.stdout ?? "") } catch { return null } }
  }
  const global = correr("./auditar-foundations.mjs", ["--json", "--sin-uso"])
  const comp = correr("../auditar-componente.mjs", ["--json"])
  if (!comp) {
    console.log("\n🔴 La auditoría de componente no pudo correr. NO se publica: sin auditoría no hay permiso.")
    process.exit(1)
  }
  const globBloq = global ? global.defectos.filter(d => d.severidad === "crítico" || d.severidad === "alto").length : "no medible"
  const propios = comp.defectos.filter(d => d.severidad === "crítico" || d.severidad === "alto")
  if (propios.length) {
    console.log(`\n🔴 ${propios.length} defectos bloqueantes DE ESTE COMPONENTE. No se documenta encima de esto.`)
    for (const d of propios.slice(0, 8)) console.log(`   · ${d.check} — ${d.donde}: ${d.detalle.replace(/[*`]/g, "").slice(0, 120)}`)
    if (propios.length > 8) console.log(`   … y ${propios.length - 8} más. Informe: npm run comp:auditar:md`)
    console.log("\n   Corrígelos, o publica con --forzar si el Lead lo ha decidido explícitamente.")
    process.exit(1)
  }
  console.log(`✓ componente sin defectos bloqueantes propios`)
  console.log(`  ⚠️ foundations tiene ${globBloq} defectos abiertos en el sistema — NINGUNO afecta a este componente.`)
  console.log(`     Publicar esto NO significa que el sistema esté sano. Informe: npm run docs:foundations:md`)
}

/* La página destino existe, o no se escribe. Se comprueba SIEMPRE —también en modo
 * validación— para que el defecto salga antes de que alguien confíe en el guion. */
const estructura = await sdk.documentation.getDocumentationStructure(from)
const aplanar = (n, acc = []) => { acc.push(n); for (const h of (n.children ?? n.pages ?? [])) aplanar(h, acc); return acc }
const nodos = Array.isArray(estructura) ? estructura.flatMap(n => aplanar(n)) : aplanar(estructura)
const paginas = nodos.filter(n => n && (n.id || n.persistentId))
const destinoPagina = paginas.find(p => p.persistentId === PAGE || p.id === PAGE)
if (!destinoPagina) {
  console.log(`\n🔴 La página destino NO EXISTE en el árbol: ${PAGE}`)
  console.log(`   ${paginas.length} nodos censados. Pásala con --pagina=<id>.`)
  process.exit(1)
}
console.log(`\n✓ página destino verificada: «${destinoPagina.title ?? destinoPagina.name}» (${PAGE})`)

if (process.argv.includes("--escribir")) {
  const r = await sdk.import.writeMarkdownToPage(from, PAGE, mdx)
  console.log(`✓ escrito — ${r.blockCount} bloques — QUEDA EN PREVIEW. Publicar a Live lo hace el Lead.`)
}
