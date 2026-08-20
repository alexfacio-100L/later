#!/usr/bin/env node
/**
 * Experimento canario: escribir un .md en una página de documentación de Supernova.
 *
 * Responde la pregunta que decide toda la ruta uSpec → Supernova:
 *   ¿writeMarkdownToPage conserva la estructura, o aplana el contenido?
 *
 * Uso:
 *   SUPERNOVA_API_KEY="xxx" node escribir-en-supernova.mjs --validar
 *   SUPERNOVA_API_KEY="xxx" node escribir-en-supernova.mjs --escribir
 *
 * `--validar` NO toca la página. Empieza siempre por ahí.
 */

// El SDK se publica como CommonJS: no expone named exports en ESM.
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const AQUI = dirname(fileURLToPath(import.meta.url))

// La página que el Lead creó para esto — Componentes / Button Canario
const PAGE_ID = "44285c3c-dbe6-4504-a485-2ab58a6fa8ba"
const MD = resolve(AQUI, "../Componentes/button.md")

const apiKey = process.env.SUPERNOVA_API_KEY
if (!apiKey) {
  console.error("Falta SUPERNOVA_API_KEY.")
  console.error("Se genera en Supernova Cloud → perfil → profile settings → authentication.")
  process.exit(1)
}

const modo = process.argv.includes("--escribir") ? "escribir" : "validar"

let markdown = readFileSync(MD, "utf-8")

/**
 * Adaptaciones descubiertas ejecutando `validateMarkdown` contra Supernova.
 * Cada una viene de un rechazo real: la especificación MDX-lite no es pública.
 */
const ADAPTACIONES = [
  {
    // Supernova NO acepta comentarios de ninguna clase.
    //   <!-- -->  → "Unexpected character `!` (U+0021) before name"
    //   {/* */}   → "Unsupported top-level content: mdxFlowExpression"
    // Se eliminan. La procedencia del documento ya vive en su sección Provenance.
    nombre: "comentarios eliminados (Supernova no admite ninguno)",
    aplicar: t => t.replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*\n(?=\s*\n)/gm, "")
  },
  {
    // Etiquetas HTML citadas como texto: MDX las lee como componentes JSX y
    // exige cierre. El error: "Expected a closing tag for `<button>`".
    // Es además un defecto del .md: en Markdown normal también se rompen.
    // Se envuelven en backticks, respetando lo que ya está en código.
    nombre: "etiquetas HTML citadas → código en backticks",
    aplicar: t => t.split("\n").map(linea => {
      if (linea.trimStart().startsWith("{/*")) return linea
      // Partir por backticks: los índices impares ya son código, no se tocan.
      return linea.split("`").map((trozo, i) =>
        i % 2 === 1 ? trozo : trozo.replace(/<(\/?(?!SN)[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*?)?)\/?>/g, "`<$1>`")
      ).join("`")
    }).join("\n")
  },
  {
    // Supernova rechaza las pipe tables de Markdown:
    //   "Pipe tables are not supported. Use <SNTable> with <SNTableRow> and <SNTableCell>."
    // Se convierten al componente nativo. El markdown inline de cada celda se conserva.
    nombre: "tablas Markdown → <SNTable>",
    aplicar: t => {
      const lineas = t.split("\n")
      const salida = []
      let i = 0
      const esFila = l => /^\s*\|.*\|\s*$/.test(l)
      const esSeparador = l => /^\s*\|[\s:|-]+\|\s*$/.test(l)
      const celdas = l => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim())

      while (i < lineas.length) {
        if (!esFila(lineas[i])) { salida.push(lineas[i]); i++; continue }

        // Reunir el bloque contiguo de filas
        const bloque = []
        while (i < lineas.length && esFila(lineas[i])) { bloque.push(lineas[i]); i++ }

        // Sin separador no es una tabla: se deja tal cual
        if (!bloque.some(esSeparador)) { salida.push(...bloque); continue }

        const filas = bloque.filter(l => !esSeparador(l)).map(celdas)
        const columnas = Math.max(...filas.map(f => f.length))

        salida.push(`<SNTable showBorder highlightHeaderRow highlightHeaderColumn={false}>`)
        for (const fila of filas) {
          salida.push("  <SNTableRow>")
          for (let c = 0; c < columnas; c++) {
            const contenido = (fila[c] ?? "").replace(/<br\s*\/?>/gi, " ")
            salida.push(`    <SNTableCell alignment="Left">`)
            salida.push(`      ${contenido}`)
            salida.push("    </SNTableCell>")
          }
          salida.push("  </SNTableRow>")
        }
        salida.push("</SNTable>")
        salida.push("")
      }
      return salida.join("\n")
    },
  }
]

for (const a of ADAPTACIONES) {
  const antes = markdown
  markdown = a.aplicar(markdown)
  if (antes !== markdown) console.log(`  · adaptado: ${a.nombre}`)
}
console.log(`Markdown: ${markdown.split("\n").length} líneas · ${(markdown.length / 1024).toFixed(1)} KB`)

const sdk = new Supernova(apiKey)

const me            = await sdk.me.me()
const workspaces    = await sdk.workspaces.workspaces(me.id)
const designSystems = await sdk.designSystems.designSystems(workspaces[0].id)
const ds            = designSystems.find(d => /later/i.test(d.name)) ?? designSystems[0]
const version       = await sdk.versions.getActiveVersion(ds.id)

console.log(`Workspace: ${workspaces[0].name}`)
console.log(`Design system: ${ds.name}`)
console.log(`Versión (draft, la única escribible): ${version.id}\n`)

const from = { designSystemId: ds.id, versionId: version.id }

// ---- Paso 1: validar. No escribe nada. ----
console.log("Validando…")
const validacion = await sdk.import.validateMarkdown(from, markdown)

if (!validacion.isValid) {
  console.error(`\n✗ RECHAZADO — ${validacion.error.code}`)
  console.error(validacion.error.message)
  console.error("\nEso dice qué sintaxis no soporta. Se corrige en la plantilla de uSpec:")
  console.error("  references/component-md/component-md-template.md")
  process.exit(1)
}

console.log(`✓ Válido — se convertiría en ${validacion.blockCount} bloques.\n`)

if (modo === "validar") {
  console.log("Solo validación. Para escribir de verdad: --escribir")
  process.exit(0)
}

// ---- Paso 2: escribir. REEMPLAZA el contenido de la página. ----
console.log("Escribiendo en Button Canario…")
const resultado = await sdk.import.writeMarkdownToPage(from, PAGE_ID, markdown)
console.log(`✓ Escrito — página ${resultado.pageId}, ${resultado.blockCount} bloques.`)

console.log(`
Ahora ábrela en Supernova y comprueba lo que decide la ruta:

  1. ¿Las tablas quedaron como tablas, o como texto plano?
  2. ¿Los encabezados conservaron su jerarquía?
  3. ¿Se puede editar bloque a bloque, o quedó un muro de texto?
  4. ¿Aparecen bloques VIVOS —tokens, componentes— o todo es estático?

La 4 es la que importa: si todo queda estático, la documentación
sería una foto desconectada del design system.
`)
