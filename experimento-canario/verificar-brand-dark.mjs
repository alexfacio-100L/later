/**
 * verificar-brand-dark.mjs — ¿ya llegó a Supernova el arreglo de `brand` en Dark?
 *
 * POR QUÉ EXISTE
 * --------------
 * El 9 sep 2026 se midió que `background/brandMain`, `brandHover` y
 * `brandPressed` apuntaban en el tema Dark a la escala **neutra** —#FFFFFF,
 * #BFBFBF, #DFDFDF, sin una gota de azul— mientras en Light apuntan a la de
 * marca. El Lead decidió **corregirlo en el origen**, que es el archivo de Figma
 * `[Auditoria] - Later: Brand System`, y sincronizar con el plugin de variables.
 *
 * 🔴 Entre la corrección en Figma y su llegada a Supernova hay una ventana. Si el
 * changelog se publica en esa ventana, la página afirma «ya es azul» mientras el
 * token vale blanco. **Publicar la nota antes que el hecho es fabricar un falso
 * vigente en el sitio donde más se cree.**
 *
 * Por eso el generador no decide: pregunta a este script, que mide.
 *
 *   npm run docs:brand-dark              # dice cómo está
 *   npm run docs:brand-dark -- --marcar  # si está corregido, lo registra
 *
 * ⚠️ Comprueba el PRIMITIVO al que apunta, no el hex. Un hex correcto alcanzado
 * con un valor suelto en vez de una referencia arreglaría el color y dejaría el
 * token desconectado de la escala — el defecto que la capa semántica existe para
 * no tener.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RUTA = path.join(AQUI, "../plantilla-componente/config/estado-brand-dark.json")
const MARCAR = process.argv.includes("--marcar")

const estado = JSON.parse(readFileSync(RUTA, "utf8"))
const ESPERADO = estado._esperado

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const base = await sdk.tokens.getTokens(from)
const temas = await sdk.tokens.getTokenThemes(from)
const nombre = t => t?.origin?.name ?? t?.name ?? ""
const hex = t => { const c = t?.value?.color; return c ? "#" + ["r","g","b"].map(k => c[k].toString(16).padStart(2,"0")).join("").toUpperCase() : "—" }
const porId = new Map(base.map(t => [t.id, t]))

const dark = temas.find(t => /^dark$/i.test(t.name))
if (!dark) { console.error("🔴 No hay tema «Dark»."); process.exit(1) }

/* La fuente de variables: si su última importación falló, lo que se lea aquí es
 * anterior al arreglo aunque el arreglo ya esté hecho en Figma. */
const fuentes = await sdk.designSystems.designSystemSources?.(ds.id).catch(() => null)
const plugin = fuentes?.find?.(f => /VariablesPlugin/i.test(f.type ?? ""))
if (plugin?.hasError)
  console.log(`⚠️  La fuente de variables de Figma reporta ERROR. Lo que se lea puede ser anterior al arreglo.\n`)

console.log(`Familia brand en Dark — ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (CDMX)\n`)
let ok = 0
const total = Object.keys(ESPERADO).length
for (const [ruta, esperado] of Object.entries(ESPERADO)) {
  const t = (dark.overriddenTokens ?? []).find(x => nombre(x) === ruta)
  const refId = t?.value?.referencedTokenId
  const apunta = refId ? nombre(porId.get(refId)) : "(valor directo, sin referencia)"
  const bien = apunta === esperado
  if (bien) ok++
  console.log(`  ${bien ? "🟢" : "🔴"} ${ruta.padEnd(26)} ${hex(t).padEnd(9)} → ${apunta}`)
  if (!bien) console.log(`       ${" ".repeat(26)} ${" ".repeat(9)}   esperado: ${esperado}`)
}

/* Cobertura declarada (regla 16): sobre cuántos de cuántos. */
console.log(`\ncobertura: ${ok} de ${total} tokens apuntan al primitivo esperado`)

if (ok < total) {
  console.log(`\n🟡 PENDIENTE. El changelog NO se publica hasta que sean ${total} de ${total}.`)
  console.log(`   El cambio va en Figma, modo Dark, archivo «[Auditoria] - Later: Brand System».`)
  process.exit(0)
}

console.log(`\n🟢 Corregido. El changelog ya puede publicarse.`)
if (!MARCAR) { console.log(`   Para registrarlo: npm run docs:brand-dark -- --marcar`); process.exit(0) }

const hoy = new Date().toLocaleDateString("es-MX", { timeZone: "America/Mexico_City", day: "numeric", month: "short", year: "numeric" })
  .replace(".", "").replace(/ de /g, " ")
writeFileSync(RUTA, JSON.stringify({ ...estado, corregido: true, fecha: hoy }, null, 2) + "\n")
console.log(`   ✓ registrado con fecha «${hoy}». Publica con: npm run button:escribir`)
