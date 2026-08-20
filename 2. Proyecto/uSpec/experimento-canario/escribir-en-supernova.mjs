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

import { Supernova } from "@supernovaio/sdk"
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const AQUI = dirname(fileURLToPath(import.meta.url))

// La página que el Lead creó para esto — Componentes / Button Canario
const PAGE_ID = "44285c3c-dbe6-4504-a485-2ab58a6fa8ba"
const MD = resolve(AQUI, "../../../3. Entregables/Componentes/button.md")

const apiKey = process.env.SUPERNOVA_API_KEY
if (!apiKey) {
  console.error("Falta SUPERNOVA_API_KEY.")
  console.error("Se genera en Supernova Cloud → perfil → profile settings → authentication.")
  process.exit(1)
}

const modo = process.argv.includes("--escribir") ? "escribir" : "validar"

const markdown = readFileSync(MD, "utf-8")
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
