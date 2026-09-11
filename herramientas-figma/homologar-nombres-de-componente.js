/* ============================================================================
 * homologar-nombres-de-componente.js — pegar en Scripter (plugin de Figma)
 * ----------------------------------------------------------------------------
 * QUE HACE
 *   Renombra en Figma los componentes cuyo nombre no coincide con el de la
 *   documentacion. Cuatro renombres, con guardas.
 *
 * [CRITICO] POR QUE EXISTE — medido el 11 sep 2026
 *   Al cruzar el sidebar de Componentes con la libreria aparecio que los nombres
 *   NO coinciden. Un componente que en la documentacion se llama `Text field` y
 *   en Figma `inputText` es el mismo, y nadie lo sabe sin un mapa.
 *
 *   Decision del Lead: **manda el nombre de la documentacion.** Es el que ve
 *   quien consume el sistema y el que acaba en la conversacion y en el codigo.
 *   *La libreria es el taller; la documentacion es el contrato.*
 *
 * QUE RENOMBRA
 *     inputText     -> Text field
 *     Checkbox      -> Check
 *     RadioButton   -> Radio
 *     Toggle        -> Switch
 *
 * [OJO] `Alerts` NO entra, a proposito. En el sidebar hay CUATRO piezas -- Banner,
 *   System banner, Snackbar y Toast -- y en Figma hay UNA de 30 variantes. Eso no
 *   es un renombre: es decidir si son cuatro componentes o uno. **Decision del
 *   Lead, pendiente.** Renombrarlo ahora elegiria por el.
 *
 * [OJO] Scripter NO imprime el valor devuelto por una funcion `async`, asi que
 *   el script parece no decir nada y en realidad ya trabajo. Mira la consola.
 *
 * ES SEGURO
 *   - Renombrar CONSERVA el id del componente, asi que las instancias colocadas
 *     no se rompen y Supernova lo reconoce como el mismo en el siguiente sync.
 *   - Comprueba TODO antes de escribir NADA: si un nombre no aparece, o si el
 *     destino ya existe con otro componente, no toca nada y lo reporta.
 *   - Idempotente: lo ya renombrado se cuenta como `yaHecho`.
 *
 * [CRITICO] LO QUE HAY QUE HACER DESPUES, y no es opcional
 *   1. **Publicar la libreria**, o las instancias en otros archivos seguiran
 *      mostrando el nombre viejo.
 *   2. **Sincronizar Supernova.**
 *   3. Revisar que la documentacion del componente no cite el nombre viejo en su
 *      prosa. *El renombre cambia la etiqueta, no los textos que la mencionan.*
 *
 * USO
 *   1. Abre `[Auditoria] - Later: Brand System` en Figma
 *   2. Plugins > Scripter > pega esto > Run
 *   3. Lee la consola: debe decir `4 de 4`
 * ========================================================================== */

const MAPA = [
  { de: "inputText",   a: "Text field" },
  { de: "Checkbox",    a: "Check"      },
  { de: "RadioButton", a: "Radio"      },
  { de: "Toggle",      a: "Switch"     },
]

async function main() {
  // Los componentes raiz del archivo, sets incluidos.
  const todos = figma.root.findAllWithCriteria({ types: ["COMPONENT_SET", "COMPONENT"] })
    .filter(n => n.parent?.type !== "COMPONENT_SET")   // solo raices

  const porNombre = new Map()
  for (const n of todos) {
    const k = n.name.trim()
    if (!porNombre.has(k)) porNombre.set(k, [])
    porNombre.get(k).push(n)
  }

  /* ── Fase 1: comprobar TODO antes de escribir NADA ──
   * Un renombre a medias deja el sistema en un estado que nadie sabe leer. */
  const plan = [], problemas = []

  for (const paso of MAPA) {
    const origen = porNombre.get(paso.de) ?? []
    const destino = porNombre.get(paso.a) ?? []

    if (!origen.length && destino.length) { plan.push({ ...paso, estado: "yaHecho" }); continue }
    if (!origen.length) { problemas.push(`no existe ningun componente llamado '${paso.de}'`); continue }
    if (origen.length > 1) { problemas.push(`hay ${origen.length} componentes llamados '${paso.de}'. No se puede elegir`); continue }
    if (destino.length) { problemas.push(`'${paso.a}' YA existe y es otro componente. Renombrar crearia dos con el mismo nombre`); continue }

    plan.push({ ...paso, estado: "porHacer", nodo: origen[0] })
  }

  console.log("Homologar nombres de componente con la documentacion\n")
  for (const p of plan) {
    const m = p.estado === "yaHecho" ? "=" : ">"
    console.log(`  ${m} ${p.de.padEnd(14)} -> ${p.a}${p.estado === "yaHecho" ? "   (ya estaba)" : ""}`)
  }

  if (problemas.length) {
    console.log(`\n[CRITICO] ${problemas.length} problema(s). NO se renombro nada:`)
    for (const p of problemas) console.log(`   - ${p}`)
    console.log(`\n   Cobertura: 0 de ${MAPA.length}.`)
    return
  }

  const porHacer = plan.filter(p => p.estado === "porHacer")
  if (!porHacer.length) {
    console.log(`\n[OK] ${plan.length} de ${MAPA.length} ya estaban homologados. Nada que hacer.`)
    return
  }

  // ── Fase 2: renombrar ──
  for (const p of porHacer) p.nodo.name = p.a

  /* Cobertura declarada: n de N. */
  console.log(`\n[OK] ${porHacer.length} renombrado(s), ${plan.length - porHacer.length} ya estaban.`)
  console.log(`   Cobertura: ${plan.length} de ${MAPA.length}.`)
  console.log(`\n   AHORA, y no es opcional:`)
  console.log(`   1. Publica la libreria -- si no, las instancias en otros archivos`)
  console.log(`      siguen mostrando el nombre viejo.`)
  console.log(`   2. Sincroniza Supernova.`)
  console.log(`   3. 'Alerts' NO se toco: decidir antes si son cuatro componentes o uno.`)
}

main()
