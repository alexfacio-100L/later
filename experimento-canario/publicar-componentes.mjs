/**
 * publicar-componentes.mjs — la página «Componentes» del portal.
 *
 * Texto de `designops-lead`, 9 sep 2026. Decidido por el Lead ese día.
 *
 * 🔴 PRESERVA la tabla que el Lead colocó a mano. `writeMarkdownToPage` reemplaza
 * la página entera, así que el bloque `component-checklist-all` se vuelve a emitir
 * aquí explícitamente. Si se quitara de este archivo, desaparecería de la página.
 *
 * ⚠️ `showLastUpdatedColumn` va en FALSE, y no es un descuido:
 * desde el 4 sep 2026 hay sync horario de Figma → Supernova. Si esa columna
 * refleja el sync y no una revisión humana, mostraría fechas frescas de
 * componentes que nadie ha mirado — **aparentando garantía**. No está verificado
 * qué dato la alimenta; hasta que lo esté, no se muestra.
 * *Y aunque reflejara ediciones: una fecha vieja sobre un componente sano se lee
 * como abandono, y un componente estable debe tener fecha vieja. La columna
 * castiga justo lo que el sistema quiere producir.*
 *
 *   node publicar-componentes.mjs              # valida
 *   node publicar-componentes.mjs --escribir   # escribe (queda en PREVIEW)
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const PAGINA = "40870425"   // Componentes
const ESCRIBIR = process.argv.includes("--escribir")

const prosa = readFileSync(path.join(AQUI, "../Componentes/pagina-componentes.md"), "utf8").trim()

/* La tabla va DEBAJO de la explicación: primero se dice qué se está mirando y
 * qué significa cada estado, y luego se mira. Al revés, el lector interpreta las
 * columnas antes de que nadie le haya dicho qué prometen. */
const mdx = `${prosa}

## Los componentes

<SNBlock packageId="io.supernova.block.component-checklist-all">
  <SNItem>
    <SNProp name="showLastUpdatedColumn" value={false} />
  </SNItem>
</SNBlock>`

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const val = await sdk.import.validateMarkdown(from, mdx)
if (!val.isValid) {
  console.log(`✗ ${String(val.error?.message).replace(/\s+/g, " ").slice(0, 300)}`)
  process.exit(1)
}
console.log(`✓ válido — ${val.blockCount} bloques · ${mdx.split("\n").length} líneas`)

/* Cobertura, no confianza (regla 16): los estados que la página EXPLICA tienen
 * que ser los que el sistema puede producir. Si alguien añade un estado en
 * Supernova y aquí no se explica, el lector ve una etiqueta sin significado. */
const props = await sdk.components.getComponentProperties(from)
const status = props.find(p => p.codeName === "status")
const opciones = (status?.options ?? []).map(o => o.name)
const explicados = opciones.filter(n => new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(prosa))
console.log(`  estados explicados: ${explicados.length} de ${opciones.length} — ${opciones.join(", ")}`)
if (explicados.length < opciones.length) {
  console.log(`  🔴 sin explicar: ${opciones.filter(n => !explicados.includes(n)).join(", ")}`)
  process.exitCode = 1
}
if (!/sin estado/i.test(prosa))
  console.log(`  ⚠️  no se explica la celda VACÍA, que es un estado más aunque Supernova no lo liste`)

if (!ESCRIBIR) {
  console.log("\nAñade --escribir para volcarlo a la página.")
  process.exit()
}
await sdk.import.writeMarkdownToPage(from, PAGINA, mdx)
console.log(`\n✓ escrito en «Componentes».`)
console.log("  ⚠️  Esto ESCRIBIÓ la página; NO la publicó al sitio público.")
console.log("      Revísala en Preview. La publicación a Live la hace el Lead.")
