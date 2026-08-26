/**
 * Genera las tres pestañas de una página de componente para Supernova.
 *
 * Por qué existe
 * ──────────────
 * La alternativa era duplicar la página en la interfaz de Supernova. Se descartó
 * el 26 ago 2026 con una razón medible: de los bloques que dan valor a la página
 * —figma-frames, propstable, la rejilla de contraste, los tokens, el playground,
 * los enlaces— TODOS apuntan a una entidad concreta, así que duplicar deja el
 * esqueleto y cero contenido. Se copia lo barato y se rehace lo caro.
 *
 * Aquí la plantilla vive en el repo, junto al .md que produce uSpec, y el coste
 * por componente pasa de rehacer siete bloques a mano a correr esto.
 *
 * El reparto, y su porqué
 * ───────────────────────
 * De las 360 líneas publicables del button.md, la narrativa que necesita un
 * diseñador —qué es, cuándo, cuál elijo— es el 8%, enterrada bajo el 62% de
 * especificación. Y Supernova NO tiene acordeón ni bloque plegable: la pestaña
 * de página es su único mecanismo de plegado. Por eso «de menos a más» se
 * consigue REPARTIENDO, no ocultando.
 *
 *   Uso            ¿cuál elijo?        overview · anatomy · variantes · do/don't
 *   Especificación ¿cuánto mide?       known gaps · structure · color · voice
 *   Código         ¿cómo lo implemento? props generadas · el contrato
 *
 * 🔴 La regla de cuántas pestañas se CUENTA, no se juzga — una regla que exige
 * criterio no se ejecuta. Menos de 120 líneas publicables va a una sola página;
 * 120 o más va a las tres. Nunca dos: con dos, o el diseñador atraviesa 225
 * líneas de tabla, o la especificación se esconde donde el front-end no la busca.
 *
 * Uso
 * ───
 *   node generar.mjs button            escribe los .mdx en salida/ y no toca nada
 *   node generar.mjs button --validar  además los valida contra Supernova
 *   node generar.mjs button --publicar  los escribe en la página real
 */
import pkg from "@supernovaio/sdk"
const { Supernova } = pkg
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
/**
 * 🔴 La conversión de Markdown a MDX-lite NO se reimplementa aquí.
 *
 * `experimento-canario/conversor.mjs` ya la resuelve en 479 líneas, y sus reglas
 * salieron de `validateMarkdown`, no de suposiciones: pipe tables a <SNTable> con
 * anchos calculados, comentarios fuera —Supernova no admite ninguno—, etiquetas
 * como <button> citadas para que MDX no las lea como JSX, llaves literales.
 *
 * Este generador solo decide QUÉ va en cada pestaña. Cómo se escribe, ya estaba.
 */
import { convertir } from "../experimento-canario/conversor.mjs"

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.dirname(AQUI)
const DESIGN_SYSTEM_ID = "825551"
const WORKSPACE_ID = "767109"

/** Umbral del reparto. Ver la cabecera: se cuenta, no se juzga. */
const LINEAS_PARA_TRES_PESTANAS = 120

/** Qué sección del .md de uSpec va a qué pestaña. Lo que no está aquí, no se publica. */
const REPARTO = {
  uso:            ["Overview", "Anatomy", "Cross-references"],
  especificacion: ["Known gaps", "Structure", "Color", "Voice / Screen reader"],
  codigo:         ["API"],
}

/** Nunca se publican: `Follow-ups` es gestión de trabajo y `Provenance` es metadato del repo. */
const NUNCA_SE_PUBLICAN = ["Follow-ups", "Provenance"]

const leerKey = () => {
  const linea = fs.readFileSync(path.join(RAIZ, ".env"), "utf8")
    .split("\n").find(l => l.startsWith("SUPERNOVA_API_KEY="))
  if (!linea) throw new Error("No encontré SUPERNOVA_API_KEY en .env")
  return linea.split("=").slice(1).join("=").trim()
}

/** Parte el .md por encabezados de nivel 2. Devuelve {seccion: cuerpo}. */
const partirEnSecciones = (md) => {
  const secciones = {}
  let actual = null, buffer = []
  for (const linea of md.split("\n")) {
    const m = linea.match(/^## (.+)$/)
    if (m) {
      if (actual) secciones[actual] = buffer.join("\n").trim()
      actual = m[1].trim()
      buffer = []
    } else if (actual) buffer.push(linea)
  }
  if (actual) secciones[actual] = buffer.join("\n").trim()
  return secciones
}

const contarPublicables = (secciones) =>
  Object.entries(secciones)
    .filter(([nombre]) => !NUNCA_SE_PUBLICAN.includes(nombre))
    .reduce((n, [, cuerpo]) => n + cuerpo.split("\n").length, 0)

/* ── Los bloques ─────────────────────────────────────────────────────────── */

/** Un slot que espera a la tarea 4.15. Visible a propósito. */
const pendiente = (que) =>
  `*Pendiente: ${que}. Es contenido que ninguna herramienta genera — ni Figma lo contiene ni el código lo declara.*`

const callout = (tipo, texto) =>
  `<SNCallout variant="${tipo}">\n${texto}\n</SNCallout>`

const tablaParidad = (filas) => {
  const cuerpo = filas.map(f =>
    `| ${f.plataforma} | ${f.estado} | ${f.enlace ? `[abrir](${f.enlace})` : "—"} |`).join("\n")
  return `| Plataforma | Estado | Storybook |\n| --- | --- | --- |\n${cuerpo}`
}

/**
 * El hueco compartido de la tabla de propiedades.
 *
 * 🔴 Un solo hueco, dos ocupantes: mientras no exista la historia de Storybook,
 * lo llena la propstable del componente de Figma. El día que exista, se sustituye
 * el bloque y la página no se reescribe.
 *
 * ⚠️ El id es el del componente DE FIGMA, no el canónico. El validador comprueba
 * la forma del valor, no que la entidad exista: confundirlos valida igual y
 * publica una tabla equivocada.
 */
const tablaDePropiedades = ({ componenteFigma, historiaStorybook }) => {
  // ⚠️ <SNBlock> solo acepta <SNItem> como hijo. Meter <SNProp> directo lo rechaza
  // con UNSUPPORTED_CONTENT — y el rechazo solo se ve leyendo `isValid`, no `errors`.
  if (historiaStorybook) {
    return `<SNBlock packageId="io.supernova.block.storybook" variantId="playground">
  <SNItem>
    <SNProp name="embed" value={[{ entityId: "${historiaStorybook}" }]} />
    <SNProp name="showProperties" value={true} />
    <SNProp name="showCode" value={true} />
  </SNItem>
</SNBlock>`
  }
  return `<SNBlock packageId="io.supernova.block.figma-components-propstable">
  <SNItem>
    <SNProp name="figmaComponent" value={[{ entityId: "${componenteFigma}", entityType: "FigmaComponent" }]} />
  </SNItem>
</SNBlock>`
}

/**
 * Quita de `## API` SOLO la tabla de propiedades: esa se genera del componente.
 *
 * ⚠️ Quitar toda línea que empiece por `|` se lleva por delante las tablas de
 * ejemplos y deja encabezados huérfanos — válido en sintaxis, roto en contenido.
 * Por eso se identifica la tabla por su cabecera y se elimina solo ese bloque.
 */
const contratoSinTabla = (cuerpo) => {
  const lineas = cuerpo.split("\n")
  const salida = []
  let dentroDeLaTablaDeProps = false
  for (const l of lineas) {
    const esFila = /^\s*\|/.test(l)
    if (esFila && !dentroDeLaTablaDeProps && /\|\s*Property\s*\|/i.test(l)) {
      dentroDeLaTablaDeProps = true
      continue
    }
    if (dentroDeLaTablaDeProps) {
      if (esFila) continue
      dentroDeLaTablaDeProps = false
    }
    salida.push(l)
  }
  return salida.join("\n").replace(/\n{3,}/g, "\n\n").trim()
}

/* ── Las tres pestañas ───────────────────────────────────────────────────── */

const pestanaUso = (cfg, s) => {
  const partes = [
    `# ${cfg.titulo}`,
    cfg.unaFrase,
    callout("Info",
      `**Estado:** ${cfg.estado}` +
      (cfg.sinonimos?.length ? `  ·  **También llamado:** ${cfg.sinonimos.join(", ")}` : "")),
    `## Disponibilidad por plataforma`,
    tablaParidad(cfg.paridad),
  ]
  if (s["Overview"])         partes.push(`## Qué es`, s["Overview"])
  if (s["Anatomy"])          partes.push(`## Anatomía`, s["Anatomy"])
  // 🔴 Los cuatro slots de la tarea 4.15 que caen aquí. Ninguna herramienta los
  // genera: ni uSpec, porque Figma no los contiene, ni Storybook, porque el
  // código no los declara. Se escriben a mano o la primera pantalla queda coja.
  // 🔴 Los cuatro slots de la 4.15 que caen en la pestaña que se abre por defecto.
  // Se emiten como texto VISIBLE, no como comentario: Supernova no admite
  // comentarios de ninguna clase, y una sección que declara lo que le falta es
  // más útil que una que finge estar completa.
  partes.push(
    `## Cuándo usarlo`,  pendiente("los pares do/don't — el primero: este componente frente a su alternativa"),
    `## Contenido`,      pendiente("cómo se redacta el label y qué pasa cuando no cabe"),
    `## Comportamiento`, pendiente("foco, teclado, área táctil y estado de carga"),
    `## Responsive`,     pendiente("cómo cambia entre breakpoints"))
  if (s["Cross-references"]) partes.push(`## Relacionados`, s["Cross-references"])
  return partes.join("\n\n")
}

const pestanaEspecificacion = (cfg, s) => {
  const partes = [`# ${cfg.titulo} · Especificación`]
  // Los defectos van ARRIBA. Al fondo no los lee quien está a punto de implementar.
  // ⚠️ No va en callout: `Known gaps` trae encabezados y un callout solo admite
  // contenido en línea. Va como sección propia, y arriba — al fondo no lo lee
  // quien está a punto de implementar.
  if (s["Known gaps"]) partes.push(`## Defectos conocidos`, s["Known gaps"])
  if (s["Structure"])  partes.push(`## Medidas`, s["Structure"])
  if (s["Color"])      partes.push(`## Color`, s["Color"])
  if (s["Voice / Screen reader"]) partes.push(`## Lector de pantalla`, s["Voice / Screen reader"])
  partes.push(`## Movimiento`, pendiente("duración y easing de cada transición"))
  partes.push(`## Criterios de aceptación`, pendiente("la batería base más los propios del componente"))
  return partes.join("\n\n")
}

const pestanaCodigo = (cfg, s) => {
  const partes = [
    `# ${cfg.titulo} · Código`,
    `## Propiedades`,
    tablaDePropiedades(cfg.entidades),
  ]
  if (s["API"]) {
    // La tabla se genera arriba; aquí queda lo que ninguna tabla contiene.
    partes.push(`## El contrato`, contratoSinTabla(s["API"]))
  }
  return partes.join("\n\n")
}

/* ── Orquestación ────────────────────────────────────────────────────────── */

const main = async () => {
  const slug = process.argv[2]
  if (!slug) { console.error("Uso: node generar.mjs <slug> [--validar|--publicar]"); process.exit(1) }
  const validar  = process.argv.includes("--validar")
  const publicar = process.argv.includes("--publicar")

  const cfg = JSON.parse(fs.readFileSync(path.join(AQUI, "config", `${slug}.json`), "utf8"))
  const md = fs.readFileSync(path.join(RAIZ, cfg.fuente), "utf8")
  const secciones = partirEnSecciones(md)

  const lineas = contarPublicables(secciones)
  const tresPestanas = lineas >= LINEAS_PARA_TRES_PESTANAS
  console.log(`${cfg.titulo}: ${lineas} líneas publicables → ${tresPestanas ? "TRES pestañas" : "UNA página"}`)

  const faltan = Object.values(REPARTO).flat().filter(n => !secciones[n])
  if (faltan.length) console.log(`  ⚠️ el .md no trae: ${faltan.join(", ")}`)

  const pestanas = tresPestanas
    ? { "1-uso": pestanaUso(cfg, secciones),
        "2-especificacion": pestanaEspecificacion(cfg, secciones),
        "3-codigo": pestanaCodigo(cfg, secciones) }
    : { "1-uso": [pestanaUso(cfg, secciones), pestanaEspecificacion(cfg, secciones), pestanaCodigo(cfg, secciones)].join("\n\n") }

  // Cada pestaña pasa por el conversor: entra Markdown, sale MDX-lite válido.
  // `convertir` devuelve { mdx, informe }: el informe dice qué secciones omitió
  // y qué bloques vivos colocó, y conviene mirarlo — no solo el MDX.
  const informes = {}
  for (const nombre of Object.keys(pestanas)) {
    const r = convertir(pestanas[nombre])
    pestanas[nombre] = r.mdx
    informes[nombre] = r.informe
  }

  const dir = path.join(AQUI, "salida", slug)
  fs.mkdirSync(dir, { recursive: true })
  for (const [nombre, contenido] of Object.entries(pestanas)) {
    fs.writeFileSync(path.join(dir, `${nombre}.mdx`), contenido)
    const inf = informes[nombre]
    const vivos = inf?.vivas?.length ? ` · ${inf.vivas.length} bloques vivos` : ""
    const tablas = inf?.tablas ? ` · ${inf.tablas} tablas` : ""
    const sinResolver = inf?.tokensNoResueltos?.size ? ` · ⚠️ ${inf.tokensNoResueltos.size} tokens sin resolver` : ""
    console.log(`  ✓ salida/${slug}/${nombre}.mdx — ${contenido.split("\n").length} líneas${tablas}${vivos}${sinResolver}`)
  }

  if (!validar && !publicar) {
    console.log("\nNada se tocó en Supernova. Añade --validar para comprobarlos, --publicar para escribirlos.")
    return
  }

  let hayErrores = false
  const sn = new Supernova(leerKey())
  const version = await sn.versions.getActiveVersion(DESIGN_SYSTEM_ID)
  const ref = { designSystemId: DESIGN_SYSTEM_ID, versionId: version.id }

  for (const [nombre, contenido] of Object.entries(pestanas)) {
    // 🔴 El campo es `isValid` y `error`. NO `errors` ni `issues`: leerlos devuelve
    // undefined y todo parece válido, incluido un bloque que no existe.
    const r = await sn.import.validateMarkdown(ref, contenido)
    if (r?.isValid) console.log(`  ✓ ${nombre}: válido`)
    else { console.log(`  🔴 ${nombre}: ${r?.error?.code} — ${r?.error?.message}`); hayErrores = true }
  }

  if (hayErrores) { console.error("\n🔴 No se publica nada con errores de validación."); process.exit(1) }
  if (!publicar) { console.log("\nValidado. Nada se escribió."); return }

  // 🔴 writeMarkdownToPage REEMPLAZA la página entera, y cada pestaña es una
  // página hermana: son tantas escrituras como pestañas, no una. Republicar una
  // pestaña no toca las otras dos, que es justo lo que se quiere.
  if (!cfg.paginas) {
    console.error("🔴 Falta `paginas` en el config: un pageId por pestaña.")
    process.exit(1)
  }
  console.log("")
  for (const [nombre, contenido] of Object.entries(pestanas)) {
    const pageId = cfg.paginas[nombre]
    if (!pageId) { console.error(`  🔴 ${nombre}: sin pageId en config`); continue }
    const r = await sn.import.writeMarkdownToPage(ref, pageId, contenido)
    const bloques = r?.blockCount ?? r?.blocks?.length ?? "?"
    console.log(`  ✓ ${nombre} → página ${pageId} · ${bloques} bloques`)
  }
}

main().catch(e => { console.error("🔴 " + (e?.message ?? e)); process.exit(1) })
