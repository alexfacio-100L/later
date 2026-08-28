/**
 * Agrupa en pestañas las tablas por plataforma de la sección de lector de pantalla.
 *
 * ── Por qué existe ────────────────────────────────────────────────────────────
 * El `.md` de uSpec documenta cada estado tres veces, una por plataforma
 * —VoiceOver, TalkBack, ARIA—, y al publicarlas quedan APILADAS: seis títulos y
 * seis tablas seguidas para dos estados. Se leen, pero peor de lo que podrían:
 * lo que el lector compara es la MISMA propiedad entre plataformas, y apiladas
 * eso obliga a bajar y subir.
 *
 * El Lead montó a mano la forma que quiere —una `Section` de tipo `Tabs` con la
 * tabla dentro— y su ejemplar está guardado en
 * `experimento-canario/ejemplos-del-lead/section-tabs-lector-de-pantalla.json`.
 * Este módulo lo reproduce por API.
 *
 * ── 🔴 Por qué NO puede vivir en el Markdown ──────────────────────────────────
 * MDX-lite no tiene sintaxis para `Section`. Las Sections no son bloques: son un
 * contenedor de columnas que envuelve bloques, y `writeMarkdownToPage` solo
 * emite bloques.
 *
 * Y hay algo peor que hay que tener presente al leer esto: **`writeMarkdownToPage`
 * REEMPLAZA la página entera.** Cualquier Section creada a mano en la interfaz
 * se destruye en la siguiente publicación, sin aviso. Por eso esto es código y
 * no una instrucción para el Lead: el generador la rehace en cada corrida.
 *
 * ── Cómo se escribe, ya que Markdown no puede ─────────────────────────────────
 * `sn.documentation.elementAction()` con `DocumentationPageUpdateDocument`
 * acepta `documentItems`: el árbol COMPLETO de la página, Sections incluidas —
 * el mismo que devuelve `getDocumentationContentRaw`. Verificado en los tipos
 * (`@supernova-studio/client`, `elements-action-v2.ts` y `page-v2.ts`), que es
 * la única fuente que no envejece.
 *
 * Así que el orden de la publicación es, y no se puede invertir:
 *   1. `writeMarkdownToPage` — escribe la página y BORRA toda Section previa
 *   2. este módulo — relee el árbol y reagrupa lo publicado en pestañas
 *
 * ── La regla, deliberadamente mecánica ────────────────────────────────────────
 * Una regla que exige criterio para ejecutarse no se ejecuta. Ésta no lo exige:
 * **una tirada de dos o más títulos de nivel 4 cuyo texto esté en `PLATAFORMAS`,
 * cada uno con sus bloques hasta el siguiente título, se convierte en una
 * `Section` de pestañas.** Nada más. Si el `.md` cambia de plataformas, se
 * cambia la lista; si un estado documenta una sola plataforma, no se agrupa
 * —una pestaña sola no es una pestaña— y se queda como estaba.
 */

/** Los rótulos exactos que uSpec emite como `#### `. El orden de la página manda. */
export const PLATAFORMAS = ["VoiceOver (iOS)", "TalkBack (Android)", "ARIA (Web)"]

const TITULOS = new Set([
  "io.supernova.block.title1", "io.supernova.block.title2",
  "io.supernova.block.title3", "io.supernova.block.title4",
])

const uuid = () => crypto.randomUUID()

const paqueteDe = (item) => item?.type === "Block" ? item?.data?.packageId : null

/** El texto plano de un bloque de título. Los spans se concatenan en orden. */
const textoDe = (item) => {
  const spans = item?.data?.items?.[0]?.props?.text?.value?.spans
  if (!Array.isArray(spans)) return ""
  return spans.map(s => s?.text ?? "").join("").trim()
}

const esTituloDePlataforma = (item) =>
  paqueteDe(item) === "io.supernova.block.title4" && PLATAFORMAS.includes(textoDe(item))

/**
 * Reagrupa `items` en pestañas. Función pura: no toca la red, así que se puede
 * probar contra el JSON volcado de una página sin publicar nada.
 * @returns {{ items: any[], secciones: string[][] }} el árbol nuevo y los
 *   rótulos de cada Section creada, para poder informar de lo que se hizo.
 */
export const agruparEnPestanas = (items) => {
  const salida = []
  const secciones = []

  for (let i = 0; i < items.length;) {
    if (!esTituloDePlataforma(items[i])) { salida.push(items[i++]); continue }

    // Una tirada: título de plataforma + todo lo que cuelga de él hasta el
    // siguiente título de cualquier nivel (o el fin de la página).
    const pestanas = []
    let j = i
    while (j < items.length && esTituloDePlataforma(items[j])) {
      const titulo = textoDe(items[j])
      const bloques = []
      j++
      while (j < items.length && !TITULOS.has(paqueteDe(items[j])) && items[j]?.type !== "Section") {
        bloques.push(items[j++])
      }
      // Un separador `---` al final de la sección no pertenece a la pestaña:
      // marca el fin del bloque de contenido y queda suelto tras las pestañas.
      const colgantes = []
      while (bloques.length && paqueteDe(bloques.at(-1)) === "io.supernova.block.divider") {
        colgantes.unshift(bloques.pop())
      }
      pestanas.push({ titulo, bloques, colgantes })
    }

    // Una pestaña sola no es una pestaña: se deja tal cual estaba.
    if (pestanas.length < 2) {
      for (const p of pestanas) { salida.push(items[i]); salida.push(...p.bloques, ...(p.colgantes ?? [])) }
      i = j
      continue
    }

    salida.push({
      id: uuid(),
      type: "Section",
      variantId: "Tabs",
      sectionType: "Tabs",
      items: pestanas.map(p => ({
        id: uuid(),
        title: p.titulo,
        columns: [{ id: uuid(), blocks: p.bloques }],
      })),
    })
    salida.push(...pestanas.flatMap(p => p.colgantes ?? []))
    secciones.push(pestanas.map(p => p.titulo))
    i = j
  }

  return { items: salida, secciones }
}

/** El árbol de la página, ya parseado. */
export const leerItems = async (sn, ref, idPagina) => {
  const crudo = await sn.documentation.getDocumentationContentRaw(ref, String(idPagina))
  const contenido = typeof crudo === "string" ? JSON.parse(crudo) : crudo
  const items = contenido?.data?.items
  if (!Array.isArray(items)) throw new Error("La página no devolvió items.")
  return items
}

/**
 * 🔴 La lectura de la página va con RETRASO respecto a la escritura, y ése es
 * el fallo más caro de este módulo.
 *
 * El 28 ago 2026 costó una publicación entera, en silencio: se escribió el
 * Markdown nuevo, se releyó el árbol inmediatamente después —y llegó el
 * ANTERIOR—, se agrupó ése y se escribió encima. La página quedó con sus
 * pestañas perfectas y con el contenido de la corrida previa. Nada falló.
 *
 * ⚠️ `updatedAt` NO sirve para detectarlo: se queda en una fecha vieja incluso
 * después de escribir. Y crear un cliente nuevo tampoco basta — no es caché del
 * SDK, es la proyección del servidor, que tarda segundos en alcanzar.
 *
 * La señal que SÍ es inequívoca: **`writeMarkdownToPage` siempre deja la página
 * con CERO Sections**, porque reemplaza el documento entero y Markdown no sabe
 * emitir Sections. Así que un árbol que todavía trae las pestañas de la corrida
 * anterior es, con certeza, el árbol anterior.
 *
 * Y si tras el presupuesto de espera sigue trayéndolas, esto NO escribe. Agrupar
 * un árbol del que no se puede demostrar que es el recién publicado revierte la
 * publicación, que es exactamente el fallo que lo motivó.
 */
const esperarPublicacion = async (sn, ref, idPagina, intentos = 15, pausa = 4000) => {
  for (let n = 0; n < intentos; n++) {
    const items = await leerItems(sn, ref, idPagina)
    if (!items.some(i => i?.sectionType === "Tabs")) return items
    await new Promise(r => setTimeout(r, pausa))
  }
  return null
}

/**
 * Lee la página recién publicada, la reagrupa en pestañas y la escribe.
 *
 * Idempotente: sobre una página ya agrupada no encuentra tiradas de títulos
 * —están dentro de las Sections— y no hace nada.
 *
 * @param sn    instancia de Supernova
 * @param ref   { designSystemId, versionId, workspaceId }
 * @param idPagina  id numérico de la página
 * @param recienPublicada  si la página se acaba de escribir con
 *   `writeMarkdownToPage`, hay que esperar a que la lectura lo refleje.
 */
export const aplicarPestanas = async (sn, ref, idPagina, recienPublicada = true) => {
  const original = recienPublicada
    ? await esperarPublicacion(sn, ref, idPagina)
    : await leerItems(sn, ref, idPagina)

  if (!original) {
    throw new Error(
      `La página ${idPagina} sigue devolviendo las pestañas de la corrida ` +
      `anterior. No se agrupa: escribirlo revertiría la publicación.`)
  }

  const { items, secciones } = agruparEnPestanas(original)
  if (!secciones.length) return { secciones: [] }

  await sn.documentation.elementAction(ref, {
    type: "DocumentationPageUpdateDocument",
    input: { id: String(idPagina), documentItems: items },
  })
  return { secciones }
}
