/**
 * filtro-agnostico.mjs — la documentación habla del COMPONENTE, no de cómo se hizo.
 *
 * POR QUÉ EXISTE
 * --------------
 * El Lead, 8 sep 2026: «vi que hay textos que indican o referencian a Supernova,
 * cuando la documentación se debe centrar en el componente, no en el mecanismo
 * que se está documentando, similar a las referencias de uSpec».
 *
 * Era el guardrail 1 de la capa editorial, y estaba escrito como doctrina: no se
 * ejecutaba. Se publicaron al menos tres fugas. **E3 del FODA: una regla que
 * exige acordarse no se ejecuta.** Esto la convierte en un comando que falla.
 *
 * 🔴 LA FRONTERA, y es lo que hace que el filtro tenga que vivir AQUÍ:
 * el `.md` de uSpec SÍ puede hablar de `_base.json`, del extractor y de la
 * extracción — es un artefacto técnico y esa traza es útil. Lo que no puede es
 * PUBLICARSE. Así que el filtro no mira el insumo: mira lo que sale a la página.
 * Una de las tres fugas venía literalmente de una celda del `.md`.
 *
 * LO QUE SÍ VALE, y por eso no es una lista de palabras prohibidas:
 * Figma, Storybook y Repository son legítimos cuando son un RECURSO NAVEGABLE
 * para quien lee —«ver en Figma»—. Lo que no vale es explicar cómo se produjo la
 * página. Por eso se filtran primero las etiquetas y atributos de bloque, que son
 * estructura invisible, y solo se revisa la PROSA.
 */

/** Términos que nombran el mecanismo de producción. Nunca en la prosa publicada. */
const MECANISMO = [
  /\bSupernova\b/i,
  /\buSpec\b/i,
  /\bScripter\b/i,
  /\b_base\.json\b/i,
  /\bextracci[oó]n\b/i,
  /\bextractor\b/i,
  /\bClaude\b/i,
  /\bMCP\b/,
  /\bse extrajo\b/i,
  /\bla herramienta\b/i,
  /\bel generador\b/i,
  /\bla pasada\b/i,
  /\bel pipeline\b/i,
]

/** Estructura de bloque: no es prosa, no la lee nadie. Se quita antes de mirar. */
const quitarEstructura = (t) =>
  t
    .replace(/<SN[A-Za-z]+[^>]*\/>/g, " ")        // bloques autocerrados
    .replace(/<\/?SN[A-Za-z]+[^>]*>/g, " ")       // apertura y cierre
    .replace(/packageId="[^"]*"/g, " ")
    .replace(/(resourceId|entityId|src|id)="[^"]*"/g, " ")
    .replace(/https?:\/\/\S+/g, " ")

/**
 * Revisa el contenido publicable de una pestaña.
 * @returns {Array<{termino: string, linea: number, texto: string}>}
 */
export function fugasDeMecanismo(mdx) {
  const fugas = []
  const lineas = quitarEstructura(mdx).split("\n")
  lineas.forEach((l, i) => {
    for (const re of MECANISMO) {
      const m = l.match(re)
      if (m) fugas.push({ termino: m[0], linea: i + 1, texto: l.trim().slice(0, 110) })
    }
  })
  return fugas
}

/**
 * Falla ruidosamente si alguna pestaña habla del mecanismo.
 * @param {Record<string,string>} tabs  nombre de pestaña → MDX
 */
export function exigirAgnostico(tabs) {
  const todas = []
  for (const [nombre, mdx] of Object.entries(tabs))
    for (const f of fugasDeMecanismo(mdx)) todas.push({ pestana: nombre, ...f })
  if (!todas.length) {
    console.log(`  ✓ tool-agnostic: ${Object.keys(tabs).length} de ${Object.keys(tabs).length} pestañas sin referencias al mecanismo`)
    return
  }
  console.error(`\n🔴 ${todas.length} referencia(s) al MECANISMO en la prosa publicable.`)
  console.error(`   La documentación habla del componente, no de cómo se hizo.`)
  console.error(`   El .md de uSpec SÍ puede decirlo; la página NO.\n`)
  for (const f of todas) console.error(`   · ${f.pestana} :${f.linea}  «${f.termino}»  → ${f.texto}`)
  console.error(`\n   Reescríbelo sin nombrar la herramienta. Suele decir lo mismo y mejor:`)
  console.error(`   «el contraste lo calcula Supernova sobre los tokens vivos»`)
  console.error(`   → «el contraste se calcula sobre los tokens vivos, así que ningún ratio escrito a mano caduca»`)
  process.exit(1)
}
