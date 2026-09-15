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

<SNCallout variant="Info">
**Escribe directo y concreto.** Las reglas están debajo y se comprueban con \`npm run doc:registro -- <ruta.md>\`.
</SNCallout>

Usa frases de 25 palabras como máximo, 18 de media. Una idea por frase.

No uses incisos con raya. Si merece decirse, es otra frase.

Marca un solo **énfasis** por párrafo, y sobre un término. Nunca sobre una frase entera.

Empieza cada párrafo por el verbo o por el sujeto. Nunca por un conector.

Habla de tú y en voz activa. No menciones la página dentro de la página.

Pon el porqué después de la instrucción, y solo si cambia lo que alguien hace.

## Propósito

[Qué necesidad de interfaz o interacción resuelve]

<SNCallout variant="Info">
[Regla principal o diferenciador del componente, cuando aplique]
</SNCallout>

${OPCIONAL}

## Vista del componente

[Agregar Figma component cuando se documente el componente]

## Dónde está disponible

| Plataforma | Estado | Qué hay hoy |
| --- | --- | --- |
| Design System · Bricks UI | [Estado] | [Qué hay hoy] |
| Web · WebApp | [Estado] | [Qué hay hoy] |
| Web · 100 Ladrillos | [Estado] | [Qué hay hoy] |
| Mobile · 100 Ladrillos App | [Estado] | [Qué hay hoy] |
| CMS · HubSpot Templates | [Estado] | [Qué hay hoy] |
| Email · Templates | [Estado] | [Qué hay hoy] |

Las seis plataformas son fijas para todo componente. Solo cambia el estado. No añadas ni quites filas sin decisión del Lead.

Un componente no está disponible en una plataforma hasta que está **producido** ahí. Si no lo has comprobado, escribe «Pendiente de verificar». No lo dejes en blanco.

## Información general

- [Categoría]
- [Owner]
- [Componentes relacionados]

## Recursos

[Agregar Shortcut links a Figma, Storybook, uSpec, Foundations o repositorio cuando existan]

## Recursos

[Agregar Shortcut links a Figma, Storybook, uSpec, Foundations o repositorio cuando existan]`,

  "Usos": `# Uso

[Cómo se usa el componente. Empieza por el verbo]

## Cuándo usar

[Agregar Guidelines tipo Do cuando se documente el componente]

## Cuándo no usar

[Agregar Guidelines tipo Don't cuando aplique]

## Consideraciones

[Agregar Guidelines tipo Caution cuando aplique]

## Variantes y jerarquía

[Cuándo usar cada variante. Solo si aplica]

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

La especificación técnica vive en uSpec. Aquí no se duplica.

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

<SNCallout variant="Info">
Parte una sección en pestañas solo si el eje **diverge**. El criterio está debajo.
</SNCallout>

Mide dos cosas. **D** es cuántas filas cambian con el eje sobre el total. **V** es cuántas filas tiene la sección.

Si D vale cero, no la partas. Documenta el eje como nota o como fila.

Si D pasa de cero y V no llega a 10, no la partas. Pon las facetas en columnas. En una tabla corta comparar es el objetivo, y las pestañas lo impiden.

Si D pasa de cero y V pasa de 10, pártela en pestañas. Pasadas diez filas nadie compara de un vistazo, así que el lado a lado no cuesta nada y el scroll sí.

Escribe en la página qué separa las pestañas. Quien las lea tiene que saberlo sin abrirlas.

## Foundations relacionadas

[Agregar Shortcut links a Foundations relacionadas]`,

  "Estatus y cambios": `# Lifecycle

[Mostrar estado de madurez del componente]

## Component health

[Agregar bloque Component health y seleccionar el componente correspondiente]

## Definition of done

[Agregar bloque Component checklist y seleccionar el componente correspondiente]

<SNCallout variant="Info">
**Son tres puertas, no una.** Un verde de \`doc:done\` cierra la documentación de diseño, no el componente.
</SNCallout>

La primera puerta certifica el componente en Figma. La segunda certifica su documentación. La tercera la cierra **Ingeniería** al producirlo en Bricks UI.

Corre \`npm run doc:done -- <slug>\` para la segunda. Encadena nueve condiciones y falla en la primera que no pase.

Tres condiciones no las comprueba ningún comando. Las firma una persona:

- Lo verificaste en Preview, no en el editor.
- Miraste el render, no solo el árbol de tokens.
- Cada bloque vivo está configurado, no solo colocado.

## Changelog

[Agregar historial real de cambios cuando exista]

## Deprecation y migration

[Utilizar únicamente cuando el componente esté deprecado o tenga un proceso de migración]

${OPCIONAL}`,
}

const leerKey = () => fs.readFileSync(path.join(RAIZ, ".env"), "utf8")
  .split("\n").find(l => l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()

/* 🔴 MODO ACTUALIZAR, añadido el 14 sep 2026.
 *
 * Este guion nació para CREAR el molde. Correrlo otra vez crearía un SEGUNDO molde
 * en vez de actualizar el que existe. Con `--actualizar` escribe sobre las cuatro
 * pestañas ya creadas, cuyos ids viven en `maestra.ids.json`.
 *
 * ⚠️ El molde está OCULTO a propósito. `writeMarkdownToPage` escribe CONTENIDO y no
 * toca los ajustes de la página, así que no debería revelarla. No se puede comprobar:
 * ni `getDocumentationStructure` del SDK ni el listado del MCP devuelven la
 * visibilidad. Lo confirma una persona mirando. */
const actualizar = async () => {
  const sn = new Supernova(leerKey())
  const version = await sn.versions.getActiveVersion(DESIGN_SYSTEM_ID)
  const ref  = { designSystemId: DESIGN_SYSTEM_ID, versionId: version.id, workspaceId: WORKSPACE_ID }
  const refW = { designSystemId: DESIGN_SYSTEM_ID, versionId: version.id }
  const ids = JSON.parse(fs.readFileSync(path.join(AQUI, "maestra.ids.json"), "utf8"))
  const nombres = Object.keys(TABS)

  for (const nombre of nombres) {
    const r = await sn.import.validateMarkdown(refW, TABS[nombre])
    if (!r?.isValid) { console.error(`🔴 ${nombre}: ${r?.error?.code} — ${r?.error?.message}`); process.exit(1) }
  }
  console.log(`✓ ${nombres.length} de ${nombres.length} pestañas válidas`)

  const items = await sn.documentation.getDocumentationStructure(ref)
  const numerico = new Map(items.map(i => [i.persistentId, String(i.id)]))

  /* Respaldo antes de escribir: writeMarkdownToPage reemplaza la página entera. */
  const dir = path.join(AQUI, "../experimento-canario/respaldos")
  fs.mkdirSync(dir, { recursive: true })
  const previo = {}
  for (const nombre of nombres) {
    if (!numerico.get(ids.pestanas[nombre])) {
      console.error(`🔴 «${nombre}» no está en el árbol. Aborta antes de escribir nada.`); process.exit(1)
    }
    previo[nombre] = await sn.documentation.getDocumentationContentRaw(ref, ids.pestanas[nombre])
  }
  fs.writeFileSync(path.join(dir, "molde.json"), JSON.stringify(previo, null, 1))
  console.log(`✓ respaldo de las ${nombres.length} pestañas → respaldos/molde.json`)

  let n = 0
  for (const nombre of nombres) {
    const r = await sn.import.writeMarkdownToPage(refW, numerico.get(ids.pestanas[nombre]), TABS[nombre])
    console.log(`  ✓ ${nombre} → ${r?.blockCount ?? "?"} bloques`)
    n++
  }
  console.log(`\n✓ ${n} de ${nombres.length} pestañas actualizadas — EN PREVIEW`)
  console.log(`⚠️ El molde está oculto y la API no expone visibilidad. Confírmalo mirando.`)
}

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

const arrancar = process.argv.includes("--actualizar") ? actualizar : main
arrancar().catch(e => { console.error("🔴 " + (e?.message ?? e)); process.exit(1) })
