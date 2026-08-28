/**
 * La regla de los blockquote: cómo se reparte una cita de varios párrafos.
 *
 * ── El problema ───────────────────────────────────────────────────────────────
 * Un blockquote de Supernova acepta **UN solo párrafo**. Los del `.md` de uSpec
 * traen diez: la sección `Voice / Screen reader` abre con un preámbulo y nueve
 * párrafos de criterio.
 *
 * Los dos consumidores fallaban de forma distinta y las dos formas son malas:
 *   · `plantilla-componente/button-canario.mjs` los UNÍA TODOS en una sola cita
 *     para que validara. Validaba perfecto y publicaba un muro citado de 900
 *     palabras, ilegible.
 *   · `experimento-canario/conversor.mjs` no los trataba, y `docs:validar`
 *     rechazaba el documento entero con
 *     `A blockquote accepts a single paragraph`.
 *
 * ── El criterio, deliberadamente mecánico ─────────────────────────────────────
 * El equipo no documenta por hábito, así que una regla que exige juicio para
 * ejecutarse no se ejecuta. Ésta no lo exige, y se apoya en algo que uSpec ya
 * hace de forma consistente: **los párrafos de criterio van rotulados**, con la
 * forma `**Título.** cuerpo`.
 *
 *   · Párrafo rotulado  → fila de una tabla de dos columnas: `Tema | Criterio`.
 *     Un rótulo con su explicación ES una tabla; escrito como cita se lee peor.
 *   · Párrafo sin rótulo → cita propia, una por párrafo. Es prosa de encuadre.
 *
 * Nada de esto depende del componente ni del contenido: sirve igual para los 40
 * que vienen.
 *
 * ⚠️ Y como siempre en esta plataforma: que valide no significa que se vea bien.
 * La versión que unía los diez párrafos validaba al 100%.
 */

/** `**Título.** cuerpo` — el punto final del rótulo es opcional. */
const ROTULO = /^\*\*(.+?)\.?\*\*\s+(.+)$/

/**
 * @param texto  el fragmento de Markdown, con sus citas `>` intactas
 * @param emitirTabla  `(cabecera, filas) => string` del consumidor. Se inyecta
 *   porque cada pipeline emite `<SNTable>` con su propio reparto de anchos, y
 *   duplicar el emisor aquí lo dejaría fuera de sincronía con el suyo.
 */
export const reagruparCitas = (texto, emitirTabla) =>
  texto.replace(/(?:^>.*(?:\n|$))+/gm, (bloque) => {
    // Los párrafos se separan por líneas `>` vacías. Descartarlas junto con la
    // separación es lo que producía el muro.
    const parrafos = []
    let actual = []
    for (const l of bloque.split("\n")) {
      const t = l.replace(/^>\s?/, "").trim()
      if (t) actual.push(t)
      else if (actual.length) { parrafos.push(actual.join(" ")); actual = [] }
    }
    if (actual.length) parrafos.push(actual.join(" "))

    const salida = []
    let filas = []
    const cerrarTabla = () => {
      if (!filas.length) return
      salida.push(emitirTabla(["Tema", "Criterio"], filas))
      filas = []
    }
    for (const p of parrafos) {
      const m = p.match(ROTULO)
      if (m) filas.push([m[1], m[2]])
      else { cerrarTabla(); salida.push(`> ${p}`) }
    }
    cerrarTabla()
    // 🔴 Dos saltos al final, no uno. Con uno, la línea siguiente del `.md`
    // queda pegada al `</SNTable>` y MDX lo lee como JSX en línea:
    // «Unsupported top-level content: mdxJsxTextElement».
    return salida.join("\n\n") + "\n\n"
  })
