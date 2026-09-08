/**
 * anchos-de-tabla.mjs — un ajuste manual del Lead es una DECISIÓN.
 *                       Un cálculo del generador es un DEFAULT.
 *                       El default nunca pisa la decisión.
 *
 * POR QUÉ EXISTE, y nace de un error mío del 8 sep 2026
 * -----------------------------------------------------
 * El Lead ajustó a mano los anchos de las tablas del Button en Supernova. Yo medí
 * ese ajuste, intenté REPRODUCIRLO con una fórmula, y al reescribir la página la
 * sobrescribí con el cálculo. Su veredicto: «se ven mal las proporciones de las
 * tablas a como los creé».
 *
 * 🔴 Y el dato que lo hacía evitable estaba en mi propio informe: medí que el
 * error de la fórmula bajaba de 447 a 306 px y NO llegaba a cero, y escribí que
 * «sus anchos son decisiones por tabla, no una fórmula». **Con esa frase
 * delante, recalcular era la vía equivocada.** Ninguna fórmula reproduce un
 * criterio; lo que hay que hacer es no tocarlo.
 *
 * ⚠️ LO QUE SE PERDIÓ, y hay que decirlo: `writeMarkdownToPage` reemplaza la
 * página entera, así que sus anchos manuales ya no están en Supernova. Solo se
 * pueden restaurar los que quedaron MEDIDOS en
 * `2. Proyecto/Diagnóstico/patron-editorial-canario.md`. El resto se recalcula, y
 * este módulo declara cuáles son cuáles en cada corrida.
 *
 * CÓMO EMPAREJA
 * -------------
 * Por la FIRMA DE ENCABEZADOS, no por posición: insertar una sección mueve todas
 * las tablas y la posición deja de identificar nada. Si una tabla cambia de
 * columnas, no se puede preservar — se recalcula y se dice.
 */

/** Firma estable de una tabla: sus encabezados, normalizados. */
export const firmaDeTabla = (cabecera) =>
  cabecera.map(c => String(c).replace(/\s+/g, " ").trim().toLowerCase()).join(" | ")

/**
 * Anchos que el Lead fijó a mano, medidos el 7 y 8 sep 2026.
 * Fuente: `2. Proyecto/Diagnóstico/patron-editorial-canario.md`.
 * 🔴 Esto NO se recalcula. Se edita solo cuando él vuelva a ajustar.
 */
export const ANCHOS_DEL_LEAD = {
  "# | qué pasa":                                        [117, 639],
  "# | área | criterio":                                 [60, 94, 600],
  "dimensión | comportamiento":                          [196, 560],
  "dimension | comportamiento":                          [196, 560],
  "propiedad | tipo | valores | por defecto | notas":    [113, 96, 106, 105, 336],
  "plataforma | estado | qué hay hoy":                   [252, 252, 252],
  "el botón tiene | al cargar | ancho":                  [197, 252, 307],
  "qué | a quién afecta | estado":                       [348, 319, 88],
}

/**
 * Devuelve los anchos de una tabla y de dónde salen.
 * @returns {{anchos: number[]|null, origen: "lead"|"calculado"}}
 */
export function anchosDe(cabecera, calcular) {
  const f = firmaDeTabla(cabecera)
  const suyos = ANCHOS_DEL_LEAD[f]
  if (suyos && suyos.length === cabecera.length) return { anchos: suyos, origen: "lead" }
  return { anchos: calcular ? calcular(cabecera) : null, origen: "calculado" }
}

/** Informe de una corrida: qué se preservó y qué hubo que recalcular. */
export function informeDeAnchos(registro) {
  const lead = registro.filter(r => r.origen === "lead")
  const calc = registro.filter(r => r.origen === "calculado")
  console.log(`  ✓ anchos de tabla: ${lead.length} preservados del Lead · ${calc.length} calculados`)
  if (calc.length) {
    console.log(`    calculados (no hay ancho suyo registrado para esta firma):`)
    for (const r of calc) console.log(`      · ${r.firma.slice(0, 66)}`)
  }
}
