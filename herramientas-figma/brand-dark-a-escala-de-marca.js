/* ============================================================================
 * brand-dark-a-escala-de-marca.js — pegar en Scripter (plugin de Figma)
 * ----------------------------------------------------------------------------
 * QUE HACE
 *   Reapunta tres variables semanticas en el modo DARK, de la escala neutra a
 *   la escala de marca. Tres clics manuales, hechos por codigo y con guardas.
 *
 * [CRITICO] POR QUE EXISTE — el defecto, medido el 9 sep 2026
 *   En el modo Dark, `background/brandMain`, `brandHover` y `brandPressed`
 *   apuntaban a `neutral/*`: blanco y grises puros, sin una gota de azul.
 *   En Light apuntan a la escala de marca. El resultado es que el boton
 *   primario DEJA DE SER de marca en Dark — no es una inversion del mismo
 *   color, es otro color.
 *
 *   Lo noto el Lead mirando la documentacion: "el color del boton en dark mode
 *   en los estados me parece algo raro".
 *
 * QUE VALORES, Y POR QUE ESOS
 *   Es el espejo exacto del patron que ya tiene Light: el reposo en el extremo
 *   de la escala, `hover` tres pasos hacia el centro y `pressed` entre los dos.
 *   En Light va del 900 hacia arriba; en Dark, del 100 hacia abajo.
 *
 *     brandMain     neutral/100  ->  neutralDarkBlue/100   #B2D1FF   13.46:1
 *     brandHover    neutral/300  ->  neutralDarkBlue/400   #4B79BD    4.77:1
 *     brandPressed  neutral/200  ->  neutralDarkBlue/300   #6B96D6    6.96:1
 *
 *   Los ratios son contra el NEGRO que lleva el label en Dark. Los tres pasan
 *   AA. Baja respecto al blanco actual —que daba 21:1— sin incumplir nada.
 *
 * [OJO] Scripter NO imprime el valor devuelto por una funcion `async`, asi que
 *   el script parece no decir nada y en realidad ya trabajo. Mira la consola:
 *   los `console.log` si salen.
 *
 * ES SEGURO
 *   - Guarda de valor: solo reescribe si la variable apunta EXACTAMENTE al
 *     neutro esperado. Si encuentra otra cosa, la salta y la reporta.
 *   - Idempotente: lo ya corregido se cuenta como `yaHecho` y no se toca.
 *   - Solo toca el modo DARK. Light no se roza.
 *   - Escribe un ALIAS a la variable primitiva, no un hex. Un color pegado a
 *     mano se veria igual hoy y dejaria de heredar cambios manana.
 *   - Aborta ANTES de escribir nada si algo no cuadra: si falta una variable,
 *     falta el modo Dark, o el valor actual no es el esperado.
 *
 * USO
 *   1. Abre el archivo `[Auditoria] - Later: Brand System` en Figma
 *   2. Plugins > Scripter > pega esto > Run
 *   3. Lee la consola: debe decir `3 de 3`
 *   4. Sincroniza el plugin de variables a Supernova
 *   5. Avisa: `npm run docs:brand-dark` debe decir 3 de 3
 * ========================================================================== */

const MODO = "Dark"

/** Que se reapunta, y desde que valor exacto. La guarda vive en `desde`. */
const MAPA = [
  { variable: "background/brandMain",    desde: "neutral/100", hacia: "neutralDarkBlue/100" },
  { variable: "background/brandHover",   desde: "neutral/300", hacia: "neutralDarkBlue/400" },
  { variable: "background/brandPressed", desde: "neutral/200", hacia: "neutralDarkBlue/300" },
]

async function main() {
  const colecciones = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()

  const porNombre = new Map(variables.map(v => [v.name, v]))
  const porId = new Map(variables.map(v => [v.id, v]))

  /* ── Fase 1: comprobar TODO antes de escribir NADA ──
   * Un script que escribe la primera y falla en la tercera deja el sistema a
   * medias, y a medias es peor que sin tocar: nadie sabe en que estado quedo. */
  const plan = []
  const problemas = []

  for (const paso of MAPA) {
    const v = porNombre.get(paso.variable)
    if (!v) { problemas.push(`no existe la variable '${paso.variable}'`); continue }

    const destino = porNombre.get(paso.hacia)
    if (!destino) { problemas.push(`no existe el primitivo destino '${paso.hacia}'`); continue }

    const col = colecciones.find(c => c.id === v.variableCollectionId)
    if (!col) { problemas.push(`'${paso.variable}' no tiene coleccion`); continue }

    const modo = col.modes.find(m => m.name === MODO)
    if (!modo) {
      problemas.push(`la coleccion '${col.name}' no tiene modo '${MODO}' (tiene: ${col.modes.map(m => m.name).join(", ")})`)
      continue
    }

    const actual = v.valuesByMode[modo.modeId]
    const alias = actual && actual.type === "VARIABLE_ALIAS" ? porId.get(actual.id) : null
    const nombreActual = alias ? alias.name : (actual ? "(valor directo, sin referencia)" : "(sin valor)")

    if (nombreActual === paso.hacia) { plan.push({ ...paso, estado: "yaHecho" }); continue }

    /* La guarda: si no es el neutro que esperabamos, alguien lo cambio y este
     * script ya no sabe lo que esta pisando. Se reporta y no se toca. */
    if (nombreActual !== paso.desde) {
      problemas.push(`'${paso.variable}' en ${MODO} apunta a '${nombreActual}', no a '${paso.desde}'. NO se toca.`)
      continue
    }

    plan.push({ ...paso, estado: "porHacer", v, destino, modeId: modo.modeId, coleccion: col.name })
  }

  console.log(`Reapuntar la familia brand en modo ${MODO}\n`)
  for (const p of plan) {
    const marca = p.estado === "yaHecho" ? "=" : ">"
    console.log(`  ${marca} ${p.variable.padEnd(26)} ${p.desde} -> ${p.hacia}${p.estado === "yaHecho" ? "   (ya estaba)" : ""}`)
  }

  if (problemas.length) {
    console.log(`\n[CRITICO] ${problemas.length} problema(s). NO se escribio nada:`)
    for (const p of problemas) console.log(`   - ${p}`)
    console.log(`\n   Cobertura: 0 de ${MAPA.length}. Revisa y vuelve a correr.`)
    return
  }

  const porHacer = plan.filter(p => p.estado === "porHacer")
  if (!porHacer.length) {
    console.log(`\n[OK] ${plan.length} de ${MAPA.length} ya estaban corregidas. Nada que hacer.`)
    return
  }

  // ── Fase 2: escribir ──
  for (const p of porHacer) {
    p.v.setValueForMode(p.modeId, { type: "VARIABLE_ALIAS", id: p.destino.id })
  }

  /* Cobertura declarada: n de N. Un script que resuelve una parte y no dice
   * sobre cuantos se lee como si hubiera resuelto todo. */
  console.log(`\n[OK] ${porHacer.length} reapuntada(s), ${plan.length - porHacer.length} ya estaban.`)
  console.log(`   Cobertura: ${plan.length} de ${MAPA.length} variables en el estado correcto.`)
  console.log(`\n   Ahora: sincroniza el plugin de variables a Supernova.`)
  console.log(`   Despues, en el repo: npm run docs:brand-dark  (debe decir 3 de 3)`)
}

main()
