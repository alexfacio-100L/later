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

/**
 * Los rótulos de la sección de Color, añadidos el 9 sep 2026.
 *
 * POR QUÉ, y viene de una sugerencia del Lead que resultó ser la buena:
 * la grilla de accesibilidad recibía los 14 tokens del componente y los cruzaba
 * TODOS CONTRA TODOS — 196 celdas, con scroll horizontal, de las que ~28
 * correspondían a una combinación real. Diseñadores que la vieron *«no supieron
 * qué estaban mirando»*, y el veredicto del Lead fue **«nada útil»**.
 *
 * Su propuesta: dejar de mirarlo global y hacerlo **por parte del componente**.
 * 🔴 Partir por tipo de color (fondos / textos / iconos) NO sirve —está medido:
 * las dos mitades vuelven a cruzar los mismos 7 fondos entre sí y suman 221
 * celdas, más que la grilla única—. **Lo que sí sirve es partir por VARIANTE**,
 * porque cada variante usa su propio juego de fondos, y meterlas en pestañas,
 * que era la segunda mitad de su idea.
 *
 * Dentro de una pestaña todas las celdas pertenecen a la misma decisión: el
 * cruce fondo-contra-fondo deja de ser ruido y pasa a significar «los fondos de
 * primary comparados entre sí».
 *
 * ⚠️ NO se parte además por mode. El bloque declara `allowThemeSelection: false`
 * —no acepta elegir tema—, así que una pestaña «Light» y otra «Dark» mostrarían
 * lo mismo. *Está pendiente de comprobar en Preview qué tema resuelve.*
 */
/* 🔴 AMPLIADO EL 11 SEP 2026 con `marketingPrimary`, y la lección está en cómo se
 * detectó. Esta lista estaba cableada a dos valores; el `.md` declaró una tercera
 * variante de color —el primario de la superficie marketing, en rojo— y la página
 * la habría publicado SIN su pestaña de combinaciones seguras, sin error y sin
 * hueco visible. *Forma «falso completo» de la regla 16 de `CLAUDE.md`.*
 * `button-canario.mjs` ahora ABORTA si el .md declara una variante que no esté aquí. */
export const VARIANTES_DE_COLOR = ["primary", "secondary", "marketingPrimary"]

/**
 * LOS GRUPOS QUE SE CONVIERTEN EN PESTAÑAS.
 *
 * Los dos primeros los montó el Lead a mano en Supernova el 9 sep 2026, y este
 * módulo los reproduce porque `writeMarkdownToPage` los borraría en la siguiente
 * publicación. **Su criterio, que es el mismo que ya justificaba las pestañas de
 * plataforma, generalizado:** cuando varias secciones hermanas son facetas
 * comparables del mismo tema, apiladas obligan a subir y bajar para compararlas;
 * en pestañas la comparación es un clic.
 *
 * `nivel` es el del título que rotula cada pestaña. Importa por dos motivos: es
 * lo que distingue un grupo de otro, y **marca dónde termina cada pestaña** — su
 * contenido llega hasta el siguiente título de nivel IGUAL O SUPERIOR, de modo
 * que los subtítulos de dentro viajan con ella. *La pestaña «Estados» lleva un
 * `### Cómo se declara isLoading` dentro; cortar en «cualquier título» lo habría
 * dejado fuera.*
 *
 * `conservarTitulo` distingue las dos convenciones que hoy conviven en la página:
 * en las de plataforma el título se CONSUME para nombrar la pestaña y dentro solo
 * queda la tabla; en las que montó el Lead el título se queda también dentro.
 * ⚠️ Se reproduce lo que él hizo, no se normaliza: unificarlas es decisión suya.
 */
export const GRUPOS = [
  { nivel: 2, titulos: ["Anatomía", "Propiedades", "Estados"], conservarTitulo: true },
  { nivel: 3, titulos: ["Por talla", "Por superficie", "Por variante", "En foco"], conservarTitulo: true },
  { nivel: 4, titulos: PLATAFORMAS, conservarTitulo: false },
  { nivel: 4, titulos: VARIANTES_DE_COLOR, conservarTitulo: false },
  /* 🔴 Las montó el LEAD A MANO en la página el 14 sep 2026, para acortar el scroll
   * de la sección de color separando por `surface`. Se reproducen aquí porque
   * `writeMarkdownToPage` reemplaza la página entera y la siguiente escritura las
   * borraría — es el mismo motivo por el que ya viven aquí las de plataforma. */
  { nivel: 4, titulos: ["product", "marketing"], conservarTitulo: false },
]

const NIVEL = {
  "io.supernova.block.title1": 1, "io.supernova.block.title2": 2,
  "io.supernova.block.title3": 3, "io.supernova.block.title4": 4,
}

/** El grupo al que pertenece un título, o null si no agrupa. */
const grupoDe = (item) => {
  const n = NIVEL[paqueteDe(item)]
  if (!n) return null
  const t = textoDe(item)
  return GRUPOS.find(g => g.nivel === n && g.titulos.includes(t)) ?? null
}

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

const esTituloDePlataforma = (item) => grupoDe(item) !== null

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
    const grupo = grupoDe(items[i])
    if (!grupo) { salida.push(items[i++]); continue }

    /* Una tirada: títulos DEL MISMO GRUPO, cada uno con lo que cuelga de él hasta
     * el siguiente título de nivel igual o superior. */
    const pestanas = []
    let j = i
    while (j < items.length && grupoDe(items[j]) === grupo) {
      const titulo = textoDe(items[j])
      const bloques = grupo.conservarTitulo ? [items[j]] : []
      j++
      while (j < items.length && items[j]?.type !== "Section" &&
             !(NIVEL[paqueteDe(items[j])] && NIVEL[paqueteDe(items[j])] <= grupo.nivel)) {
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
