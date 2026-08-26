/**
 * Crea en Supernova la plantilla maestra de documentación de componentes.
 *
 * Es NEUTRAL a propósito: solo títulos de sección y placeholders entre corchetes.
 * Sin componentes reales, sin variantes, sin tokens, sin ids, sin links ficticios.
 * Se duplica y se puebla cuando toque documentar un componente.
 *
 * Por qué las pestañas son páginas hermanas y no el bloque `Tabs`
 * ──────────────────────────────────────────────────────────────
 * 🔴 `io.supernova.block.tabs` NO existe: el validador responde
 * `UnknownBlockDefinition`. Lo que existe es una Section de pestañas que solo se
 * alcanza desde la interfaz, nunca desde Markdown — y entonces la plantilla no
 * podría generarse ni duplicarse por script, que es justo lo que la hace barata.
 *
 * Las pestañas de PÁGINA sí se crean por SDK, sí admiten tablas, y son el mismo
 * patrón que usan Material, Carbon, Atlassian y Primer. Cada una cuenta como
 * página del presupuesto: cuatro pestañas son cuatro páginas.
 */
import pkg from "@supernovaio/sdk"
const { Supernova } = pkg
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.dirname(AQUI)
const DESIGN_SYSTEM_ID = "825551"
const WORKSPACE_ID = "767109"
const GRUPO_COMPONENTES = "074cc38b-fbf2-40b8-8802-d519fff8c76e"
const TITULO = "Component Documentation Template"

/** Marca visible de que una sección puede borrarse si no aplica al componente. */
const OPCIONAL = "*Módulo opcional: elimina esta sección si no aplica al componente.*"

const TABS = {
  "Resumen general": `# Nombre del componente

[Definición breve del componente]

## Propósito

[Qué necesidad de interfaz o interacción resuelve]

<SNCallout variant="Info">
[Regla principal o diferenciador del componente, cuando aplique]
</SNCallout>

${OPCIONAL}

## Vista del componente

[Agregar Figma component cuando se documente el componente]

## Información general

- [Categoría]
- [Owner]
- [Plataformas]
- [Componentes relacionados]

## Recursos

[Agregar Shortcut links a Figma, Storybook, uSpec, Foundations o repositorio cuando existan]`,

  "Usos": `# Uso

[Explicación general sobre cómo utilizar correctamente el componente]

## Cuándo usar

[Agregar Guidelines tipo Do cuando se documente el componente]

## Cuándo no usar

[Agregar Guidelines tipo Don't cuando aplique]

## Consideraciones

[Agregar Guidelines tipo Caution cuando aplique]

## Variantes y jerarquía

[Explicar cuándo utilizar cada variante, únicamente si aplica]

${OPCIONAL}

## Comportamiento

[Documentar reglas de interacción y comportamiento del componente]

## Content guidelines

[Agregar reglas de contenido y UX Writing cuando aplique]

${OPCIONAL}

## Responsive

[Documentar comportamiento responsive cuando aplique]

${OPCIONAL}

## Internacionalización

[Documentar consideraciones de localización, RTL o expansión de texto cuando aplique]

${OPCIONAL}

## Componentes relacionados

[Agregar Shortcut links cuando existan componentes relacionados]

${OPCIONAL}`,

  "Especificaciones": `# Especificaciones

La especificación técnica detallada del componente se mantiene en uSpec para evitar duplicidad de información.

## Especificación técnica

[Agregar la documentación generada por uSpec cuando se documente el componente]

## Propiedades

[Agregar el bloque que genera la tabla de propiedades: desde el componente de Figma mientras no exista implementación, desde Storybook cuando exista]

## Implementación

[Agregar Storybook cuando exista una implementación conectada]

${OPCIONAL}

## Accesibilidad

- [Keyboard, cuando aplique]
- [Focus, cuando aplique]
- [Contrast, cuando aplique]
- [Touch target, cuando aplique]
- [Reduced motion, cuando aplique]
- [Otras consideraciones relevantes]

## Foundations relacionadas

[Agregar Shortcut links a Foundations relacionadas]`,

  "Estatus y cambios": `# Lifecycle

[Mostrar estado de madurez del componente]

## Component health

[Agregar bloque Component health y seleccionar el componente correspondiente]

## Definition of done

[Agregar bloque Component checklist y seleccionar el componente correspondiente]

## Changelog

[Agregar historial real de cambios cuando exista]

## Deprecation y migration

[Utilizar únicamente cuando el componente esté deprecado o tenga un proceso de migración]

${OPCIONAL}`,
}

const leerKey = () => fs.readFileSync(path.join(RAIZ, ".env"), "utf8")
  .split("\n").find(l => l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()

const main = async () => {
  const sn = new Supernova(leerKey())
  const version = await sn.versions.getActiveVersion(DESIGN_SYSTEM_ID)
  const ref  = { designSystemId: DESIGN_SYSTEM_ID, versionId: version.id, workspaceId: WORKSPACE_ID }
  const refW = { designSystemId: DESIGN_SYSTEM_ID, versionId: version.id }

  const nombres = Object.keys(TABS)

  // Validar TODO antes de crear nada: crear páginas consume presupuesto y
  // publicar reemplaza la página entera. Un error se publica igual de rápido
  // que un acierto.
  for (const nombre of nombres) {
    const r = await sn.import.validateMarkdown(refW, TABS[nombre])
    if (!r?.isValid) {
      console.error(`🔴 ${nombre}: ${r?.error?.code} — ${r?.error?.message}`)
      process.exit(1)
    }
    console.log(`  ✓ ${nombre}: válido`)
  }

  const paginaId = await sn.documentation.createDocumentationPage(ref, {
    title: TITULO, parentPersistentId: GRUPO_COMPONENTES,
  })
  console.log(`\n✓ página creada`)

  // La primera llamada convierte la PÁGINA en grupo con pestañas y renombra la
  // original con el tabName. Las siguientes, apuntando al GRUPO, añaden pestañas.
  const grupo = await sn.documentation.createDocumentationTab(ref, {
    fromItemPersistentId: paginaId, tabName: nombres[0],
  })
  const pestanas = { [nombres[0]]: paginaId }
  for (const nombre of nombres.slice(1)) {
    pestanas[nombre] = await sn.documentation.createDocumentationTab(ref, {
      fromItemPersistentId: grupo, tabName: nombre,
    })
  }
  console.log(`✓ ${nombres.length} pestañas creadas`)

  // Hace falta el id numérico para escribir: el persistentId no sirve aquí.
  const items = await sn.documentation.getDocumentationStructure(ref)
  const numerico = new Map(items.map(i => [i.persistentId, String(i.id)]))

  for (const nombre of nombres) {
    const id = numerico.get(pestanas[nombre])
    const r = await sn.import.writeMarkdownToPage(refW, id, TABS[nombre])
    console.log(`  ✓ ${nombre} → ${r?.blockCount ?? "?"} bloques`)
  }

  fs.writeFileSync(path.join(AQUI, "maestra.ids.json"),
    JSON.stringify({ grupo, pestanas }, null, 2) + "\n")
  console.log(`\n✓ ids guardados en maestra.ids.json`)
}

main().catch(e => { console.error("🔴 " + (e?.message ?? e)); process.exit(1) })
