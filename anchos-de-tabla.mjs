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
 * ⚠️ LO QUE SE PERDIÓ EN SU DÍA: `writeMarkdownToPage` reemplaza la página
 * entera, así que aquel ajuste manual desapareció y solo se recuperaron los 7 que
 * por casualidad habían quedado medidos en un diagnóstico. **Los otros 16 se
 * perdieron.**
 *
 * 🟢 RESUELTO el 8 sep 2026: el Lead rehízo los ajustes y ahora existe
 * `npm run docs:anchos`, que los LEE de Supernova y los escribe aquí. Ya no
 * dependen de que alguien se acuerde de medirlos.
 *
 * 🔴 Por eso esta tabla NO se edita a mano: se regenera.
 *      npm run docs:anchos                # ver qué hay en Supernova
 *      npm run docs:anchos -- --escribir  # traerlo aquí
 *    Y se regenera SIEMPRE que el Lead vuelva a tocar anchos, ANTES de publicar.
 *
 * CÓMO EMPAREJA
 * -------------
 * NO por posición: insertar una sección mueve todas las tablas y la posición deja
 * de identificar nada.
 *
 * 🔴 Y NO solo por encabezados, que fue la primera versión y era insuficiente:
 * medido el 8 sep 2026, el Button tiene 24 tablas pero solo 17 combinaciones
 * distintas de encabezados —`Propiedad | Valor | Notas` se repite SEIS veces, con
 * seis anchos diferentes—. Emparejar así habría guardado 17 y perdido 7 **sin
 * error visible**: la forma «falso completo» de la regla 16.
 *
 * La firma que sí funciona lleva tres partes: **encabezados + primera celda +
 * hash de la primera columna entera**. Con ella, 24 de 24 son únicas. *El primer
 * dato solo no bastaba: las seis empiezan por «Anuncio».*
 *
 * Si una tabla cambia de columnas o de primera columna, no se puede emparejar —
 * se recalcula y se dice.
 */

/**
 * Normaliza el texto de una celda para la firma.
 *
 * 🔴 Quita el marcado, y es imprescindible: la misma celda es `` `variant` `` o
 * `**Anuncio**` en el .md y «variant» o «Anuncio» al leerla de Supernova, que ya
 * la devuelve en texto plano. Sin esta limpieza, 14 de 24 tablas no emparejaban y
 * se recalculaban — el ajuste del Lead se perdía otra vez, ahora en silencio.
 */
const norm = (x) => String(x)
  .replace(/`+/g, "")            // código
  .replace(/\*\*|__/g, "")       // negrita
  .replace(/(^|\W)[*_](\S)/g, "$1$2").replace(/(\S)[*_](\W|$)/g, "$1$2")  // cursiva
  .replace(/\s+/g, " ").trim().toLowerCase()

/** djb2 — hash corto y estable, solo para desempatar firmas. */
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0
  return h.toString(36).slice(0, 5)
}

/**
 * Firma de una tabla: encabezados + primera celda + hash de la primera columna.
 * 🔴 DEBE coincidir con la de `experimento-canario/capturar-anchos.mjs`, que es
 * quien genera las claves. Si divergen, el registro deja de emparejar y todo se
 * recalcula — en silencio, salvo por el informe.
 */
export const firmaDeTabla = (cabecera, col0 = []) => {
  const base = cabecera.map(norm).join(" | ")
  if (!col0.length) return base
  return `${base} @ ${norm(col0[0]).slice(0, 24)} #${hash(col0.map(norm).join("|"))} ~${col0.length}`
}

/**
 * Firma DÉBIL: la fuerte sin el hash del contenido.
 *
 * 🔴 Existe porque la fuerte es frágil ante una edición mínima. Medido: la tabla
 * de anatomía no emparejaba porque UNA celda dice «[inferred via radius/l] ├
 * cornerRadius» en Supernova y lleva ese fragmento en otro orden en el .md. Una
 * palabra movida y el ajuste del Lead se habría recalculado **sin avisar**.
 *
 * La débil conserva lo que no cambia al editar una celda —encabezados, primera
 * celda y número de filas— y solo se usa si identifica a UNA sola tabla.
 */
const firmaDebil = (f) => f.replace(/ #[a-z0-9]+ ~/, " ~")

/**
 * Anchos que el Lead fijó a mano. GENERADO — no editar a mano.
 * Fuente: Supernova, leído con `npm run docs:anchos` el 8 sep 2026, 13:18 CDMX.
 * Cobertura de esa captura: 24 de 24 tablas, 24 firmas únicas.
 */
export const ANCHOS_DEL_LEAD = {
  "plataforma | estado | qué hay hoy @ bricks ui #1c9ud ~4":               [252,252,252],
  "el botón tiene | al cargar | ancho @ icono a la derecha (trai #rh5do ~3": [197,252,307],
  "# | tipo | elemento | notas @ 1 #1b8jf ~4":                             [72,94,112,478],
  "propiedad | tipo | valores | por defecto | notas @ variant #m0s6p ~7":  [97,79,106,104,369],
  "condición | qué la dispara | qué cambia | focus stops @ rest #u2rrv ~6": [148,129,361,118],
  "plataforma | declaración | no uses @ web #1py6d ~2":                    [125,363,267],
  "tamaño | min-height | min-width | ≥ 44 px @ s #38a9j ~3":               [189,189,189,189],
  "especificación | s | m | l | notas @ container #222yi ~36":             [172,125,124,126,209],
  "especificación | product | marketing | notas @ label #sygu8 ~2":        [129,135,142,349],
  "especificación | primary | secondary | notas @ borderwidth #s5fmm ~2":  [131,87,100,438],
  "especificación | s | m | l | notas @ borderwidth #s5fmm ~2":            [131,81,81,81,382],
  "dimensión | comportamiento @ ancho #12ljm ~3":                          [239,515],
  "# | qué anima | duración | easing | notas @ m1 #v41d0 ~6":              [51,157,89,130,329],
  "# | qué pasa @ m1 #5te8a ~3":                                           [117,639],
  "entrada | tipo | obligatorio | lo que el componente asume @ label #1fdvw ~4": [111,90,102,453],
  "propiedad | valor | notas @ anuncio #121cy ~10":                        [161,118,475],
  "propiedad | valor | notas @ anuncio #cqfd8 ~9":                         [154,157,443],
  "propiedad | valor | notas @ anuncio #926f7 ~10":                        [114,149,492],
  "propiedad | valor | notas @ anuncio #pah0l ~6":                         [139,210,380],
  "propiedad | valor | notas @ anuncio #wfykj ~6":                         [166,164,397],
  "propiedad | valor | notas @ anuncio #pmn5e ~7":                         [156,178,396],
  "# | área | criterio @ b1 #9giw2 ~8":                                    [60,94,600],
  "# | área | criterio @ c1 #1p6n8 ~15":                                   [60,94,600],
  "qué | a quién afecta | estado @ background/disabled apen #1e1n5 ~4":    [348,319,88],
}

/**
 * Devuelve los anchos de una tabla y de dónde salen.
 * @param cabecera - Los encabezados de la tabla
 * @param calcular  - Fallback que reparte cuando no hay ancho registrado
 * @param col0      - Primera columna (sin encabezado). Sin ella no se desempata.
 * @returns {{anchos: number[]|null, origen: "lead"|"calculado"}}
 */
export function anchosDe(cabecera, calcular, col0 = []) {
  const f = firmaDeTabla(cabecera, col0)
  const suyos = ANCHOS_DEL_LEAD[f]
  if (suyos && suyos.length === cabecera.length) return { anchos: suyos, origen: "lead" }

  /* Nivel 2 — la firma débil, y SOLO si no es ambigua. Si dos tablas la comparten
   * no se puede elegir: preferimos recalcular y decirlo antes que acertar a medias. */
  const debil = firmaDebil(f)
  const candidatas = Object.entries(ANCHOS_DEL_LEAD)
    .filter(([k, a]) => firmaDebil(k) === debil && a.length === cabecera.length)
  if (candidatas.length === 1) return { anchos: candidatas[0][1], origen: "lead-debil" }
  if (candidatas.length > 1) return { anchos: calcular ? calcular(cabecera) : null, origen: "ambigua" }

  return { anchos: calcular ? calcular(cabecera) : null, origen: "calculado" }
}

/** Informe de una corrida: qué se preservó y qué hubo que recalcular. */
export function informeDeAnchos(registro) {
  const por = (o) => registro.filter(r => r.origen === o)
  const [lead, debil, amb, calc] =
    ["lead", "lead-debil", "ambigua", "calculado"].map(por)
  const preservados = lead.length + debil.length

  /* ⚠️ La cobertura se declara SIEMPRE, en `n de N` (regla 16 de CLAUDE.md).
   * Un generador que preserva 10 de 24 y no lo dice se lee igual que uno que
   * preserva 24. */
  console.log(`  ✓ anchos de tabla: ${preservados} de ${registro.length} preservados del Lead` +
    (debil.length ? ` (${debil.length} por firma débil)` : "") +
    ` · ${calc.length + amb.length} calculados`)
  if (debil.length) {
    console.log(`    🔶 emparejadas por firma débil — su contenido cambió desde la captura:`)
    for (const r of debil) console.log(`      · ${r.firma.slice(0, 66)}`)
    console.log(`       Si el cambio es definitivo, recaptura: npm run docs:anchos -- --escribir`)
  }
  if (amb.length) {
    console.log(`    🔴 ambiguas — varias tablas comparten firma débil, NO se puede elegir:`)
    for (const r of amb) console.log(`      · ${r.firma.slice(0, 66)}`)
  }
  if (calc.length) {
    console.log(`    calculados (no hay ancho suyo registrado para esta firma):`)
    for (const r of calc) console.log(`      · ${r.firma.slice(0, 66)}`)
  }
}
