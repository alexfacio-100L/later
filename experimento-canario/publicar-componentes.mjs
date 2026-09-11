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
import { convertir } from "./conversor.mjs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const PAGINA = "40870425"   // Componentes
const ESCRIBIR = process.argv.includes("--escribir")

/* 🔴 El markdown NO se pasa crudo. Supernova ACEPTA las pipe tables sin error y
 * las publica como TEXTO PLANO: `validateMarkdown` dice «válido», la página sale
 * con la forma correcta y las tablas no son tablas.
 *
 * Medido el 11 sep 2026 en esta misma página: cinco tablas escritas, y al releer
 * la página publicada había `rich-text × 12` y **cero bloques `table`**.
 *
 * ⚠️ Y el primer check que se escribió para detectarlo daba VERDE: buscaba pipes
 * sin convertir, y al volverse texto los pipes desaparecen. *El método no podía
 * mostrar la presencia del defecto que buscaba.* El check bueno cuenta bloques
 * `table` en la página releída, y está abajo.
 *
 * `convertir()` ya resuelve esto — es lo que usa el Button — y su propio comentario
 * documenta el mismo fallo, ocurrido el 19 ago. */
/**
 * Las columnas del listado de componentes.
 *
 * 🔴 ESTO SE CABLEA PORQUE SE PERDIÓ. El Lead las activó a mano en el editor y
 * **una republicación las devolvió a su valor por defecto** — el 11 sep 2026, y
 * no era la primera vez. *Un ajuste hecho en la interfaz vive solo en la página,
 * que es justo lo que `writeMarkdownToPage` reemplaza entero.*
 *
 * Es la doctrina que este proyecto subió al área el 10 sep: **colocar un bloque
 * no es configurarlo, y heredar un valor por defecto es una decisión que nadie
 * tomó.** Aquí cada columna lleva por qué está.
 */
const COLUMNAS = [
  { id: "99b630a0-b8b6-4908-b508-94204759319e", nombre: "Documented",
    porque: "distingue de un vistazo lo que tiene guía de lo que solo existe" },
  { id: "a0f04855-5c1e-4cd1-87d3-475a12f3c4a9", nombre: "Status",
    porque: "es la pregunta que trae el lector: ¿puedo confiar en esto?" },
  { id: "a65cbe03-7713-42ac-8767-0aa1d586577b", nombre: "Documentation link",
    porque: "desde el listado se salta a la página del componente sin buscarla" },
]

/**
 * ⚠️ DECISIÓN DEL LEAD, 11 sep 2026 — la columna de última edición se ENCIENDE.
 *
 * *Sustituye a la del 10 sep, que la apagaba.* El argumento de entonces sigue en
 * pie y conviene no perderlo: **desde el 4 sep hay sync horario de Figma**, así
 * que si la columna refleja el sync y no una revisión humana, **mostrará fechas
 * frescas de componentes que nadie ha mirado** — el peor error posible, porque
 * aparenta garantía. *No está verificado qué dato la alimenta.*
 *
 * **Se enciende porque el Lead lo decidió con el widget delante.** Si al mirarla
 * en Preview las fechas no corresponden a revisiones reales, la decisión vuelve
 * a estar abierta.
 */
const ULTIMA_EDICION = true

const md = readFileSync(path.join(AQUI, "../Componentes/pagina-componentes.md"), "utf8").trim()
const { mdx: prosa, informe } = convertir(md)

/* La tabla va DEBAJO de la explicación: primero se dice qué se está mirando y
 * qué significa cada estado, y luego se mira. Al revés, el lector interpreta las
 * columnas antes de que nadie le haya dicho qué prometen. */
const mdx = `${prosa}

## Los componentes

<SNBlock packageId="io.supernova.block.component-checklist-all">
  <SNItem>
    <SNProp name="components" value={[]} selectedPropertyIds={${JSON.stringify(COLUMNAS.map(c => c.id))}} />
    <SNProp name="showLastUpdatedColumn" value={${ULTIMA_EDICION}} />
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
console.log(`  tablas convertidas a <SNTable>: ${informe.tablas}`)
if (!informe.tablas && /\|\s*---/.test(md)) {
  console.log(`  🔴 El .md tiene pipe tables y el conversor no emitió ninguna.`)
  process.exit(1)
}

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

/* 🔴 Verificación que SÍ ve el defecto: contar bloques `table` en la página
 * releída. Una tabla que salió como texto no deja pipes que buscar. */
const arbol = await sdk.documentation.getDocumentationContentRaw(from, PAGINA)
let tablas = 0
;(function w(o) {
  if (!o || typeof o !== "object") return
  if (Array.isArray(o)) return o.forEach(w)
  if (o.packageId === "io.supernova.block.table") tablas++
  for (const q of Object.values(o)) w(q)
})(arbol)
console.log(`\n  tablas en la página publicada: ${tablas} de ${informe.tablas} emitidas`)

/* 🔴 Y las columnas del listado, que son lo que se perdió dos veces. */
let cols = []
;(function w(o) {
  if (!o || typeof o !== "object") return
  if (Array.isArray(o)) return o.forEach(w)
  if (o.packageId === "io.supernova.block.component-checklist-all")
    for (const it of o.items ?? []) cols = it.props?.components?.selectedPropertyIds ?? cols
  for (const q of Object.values(o)) w(q)
})(arbol)
const faltan = COLUMNAS.filter(c => !cols.includes(c.id))
console.log(`  columnas del listado: ${cols.length} de ${COLUMNAS.length} — ${COLUMNAS.filter(c => cols.includes(c.id)).map(c => c.nombre).join(", ") || "ninguna"}`)
if (faltan.length) {
  console.log(`  🔴 No llegaron: ${faltan.map(c => c.nombre).join(", ")}`)
  process.exitCode = 1
}
if (tablas < informe.tablas) {
  console.log(`  🔴 Faltan ${informe.tablas - tablas}. Salieron como texto plano.`)
  process.exitCode = 1
}
