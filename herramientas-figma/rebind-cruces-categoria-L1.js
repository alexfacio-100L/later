/* ============================================================================
 * rebind-cruces-categoria-L1.js — pegar en Scripter (plugin de Figma)
 * ----------------------------------------------------------------------------
 * QUE HACE
 *   Cierra los cruces de categoria que `tokens:lint` (check L1) encontro en los
 *   componentes MAESTROS: tokens de la coleccion `spacing` aplicados a radio o
 *   a grosor. Rebindea cada uno al token exacto de `border` del MISMO VALOR.
 *
 * [CRITICO] POR QUE UN SCRIPT Y NO LA REST API
 *   La REST API de Figma LEE `boundVariables` pero NO LOS ESCRIBE. Es lo que
 *   hace `tokens:lint`: mide, no arregla. El unico instrumento que escribe
 *   bindings es el plugin. Mismo motivo que su hermano
 *   `rebind-iconos-a-capa-de-componente.js`.
 *
 * POR QUE ES INVISIBLE EL DEFECTO — la misma familia que `width/l` como radio
 *   `space/xs` y `radius/xs` valen los dos 4 px. `space/2xs` y `width/m` valen
 *   los dos 2 px. No lo ve el ojo, ni el render, ni un verificador que busque
 *   literales. Solo la CATEGORIA los distingue, y por eso L1 mide por coleccion
 *   y `tokenType`, NUNCA por nombre.
 *
 * CERO PIXELES DE CAMBIO — verificado token a token el 24 sep 2026:
 *   space/xs  4  ->  radius/xs  4
 *   space/xl  24 ->  radius/xl  24
 *   space/2xs 2  ->  width/m    2
 *   Ninguna sustitucion cambia el valor renderizado. Si alguna lo cambiara,
 *   no estaria en este lote.
 *
 * ALCANCE DECLARADO — 16 de los 22 bindings cruzados en masters, 6 de 12 nodos
 *   Los otros 6 bindings (4 `slider-bg` y 2 `progress bar` Nano, todos
 *   `size.y` = ALTURA ligada a un token de `spacing`) NO ENTRAN AQUI: la
 *   coleccion `sizing` no tiene peldaño de 8 ni de 2, asi que no existe token
 *   destino. Los cierra el SEGUNDO script.
 *
 * ORDEN DE PEGADO — son dos, y este es el PRIMERO
 *   1º este                                    (16 bindings)
 *   2º `crear-y-bindear-slider-progress.js`    (4 tokens nuevos + 16 nodos)
 *   No hay dependencia tecnica: el orden es para leer `tokens:lint` una sola
 *   vez, al final.
 *   [OJO] Este script solo NO cierra L1: deja 6. Con los DOS aplicados,
 *   `npm run tokens:lint` debe reportar 0 cruzados en masters.
 *
 * [CRITICO] CERRAR L1 NO DEJA EL SLIDER COHERENTE — medido el 24 sep 2026
 *   `Slider-point` tiene 10 variantes. Solo 4 tienen el radio de `slider main`
 *   BINDEADO (al token cruzado que este script arregla); LAS OTRAS 6 LO TIENEN
 *   CRUDO, con el mismo 4 px. Lo mismo en `slider-bg`: 4 con la altura
 *   bindeada, 6 crudas a 8 px.
 *   *L1 no las ve, y no es un fallo suyo: mide BINDINGS, y un valor crudo no
 *   tiene binding.* Quien las ve es L2.
 *   NO LEER «L1 en cero» COMO «el Slider esta bien». Son dos preguntas
 *   distintas, y esta es la forma «falso completo» de la regla 16: el lote sale
 *   con la forma correcta, sin error y sin hueco visible.
 *
 * ES SEGURO
 *   - GUARDA DE VALOR: solo reescribe si el binding actual es EXACTAMENTE el
 *     token esperado. Si encuentra otra cosa, lo salta y lo reporta.
 *   - Idempotente: lo ya correcto se cuenta como `yaHecho` y no se toca.
 *   - QUIRURGICO EN LAS CLAVES. En `.Slot`/`Col` el MISMO `space/xl` sirve a
 *     `itemSpacing` y a los cuatro paddings — eso es uso LEGITIMO de un token
 *     de espaciado y NO SE TOCA. Solo se reescriben las cuatro claves de radio.
 *   - En `slider main` solo hay DOS esquinas ligadas (izquierdas). Las derechas
 *     estan libres y siguen libres: ligarlas seria inventar diseño.
 *   - No toca BS-01 ni la App.
 *
 * [OJO] Scripter NO imprime el valor devuelto por una funcion `async`. Mira la
 *   consola: los `console.log` si salen.
 *
 * USO
 *   Consola del plugin, con el archivo de auditoria abierto
 *   (FILE_KEY UGwIBzERV4vB7mk0mejZ0y). Devuelve cobertura `n de N`.
 *   Despues: `npm run tokens:lint` para releer. Una llamada sin error no
 *   prueba el efecto.
 * ========================================================================== */
(async () => {
  // Tokens destino, por su id de variable en Figma (verificados 24 sep 2026)
  const DESTINO = {
    'radius/xs': 'VariableID:3481:3696', // border / BorderRadius / 4
    'radius/xl': 'VariableID:9146:96',   // border / BorderRadius / 24
    'width/m':   'VariableID:3481:3701'  // border / BorderWidth  / 2
  }
  // Tokens origen, los cruzados
  const ORIGEN = {
    'space/xs':  'VariableID:3475:2738', // spacing / Space / 4
    'space/xl':  'VariableID:3475:2734', // spacing / Space / 24
    'space/2xs': 'VariableID:3475:2739'  // spacing / Space / 2
  }

  const RADIOS  = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
  const GROSORES = ['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight']

  /* El plan, nodo a nodo. `claves` es EXHAUSTIVO a proposito: lo que no esta
   * listado no se toca, aunque comparta token. */
  const PLAN = [
    { id: '4057:7642', rotulo: 'Chip · state=focus',        claves: GROSORES,                          de: 'space/2xs', a: 'width/m'   },
    { id: '9034:5014', rotulo: '.Slot · Col',               claves: RADIOS,                            de: 'space/xl',  a: 'radius/xl' },
    { id: '9853:370',  rotulo: 'Slider green · slider main', claves: ['topLeftRadius','bottomLeftRadius'], de: 'space/xs', a: 'radius/xs' },
    { id: '9853:356',  rotulo: 'Slider re · slider main',    claves: ['topLeftRadius','bottomLeftRadius'], de: 'space/xs', a: 'radius/xs' },
    { id: '9853:342',  rotulo: 'Slider blue · slider main',  claves: ['topLeftRadius','bottomLeftRadius'], de: 'space/xs', a: 'radius/xs' },
    { id: '5960:124',  rotulo: 'Slider normal · slider main', claves: ['topLeftRadius','bottomLeftRadius'], de: 'space/xs', a: 'radius/xs' }
  ]

  const N = PLAN.reduce((s, p) => s + p.claves.length, 0) // 16
  let hechos = 0, yaHecho = 0, saltados = 0, sinNodo = 0

  // Precarga de variables destino, con control de metodo: si una no resuelve, abortar.
  const vars = {}
  for (const [nombre, id] of Object.entries(DESTINO)) {
    const v = await figma.variables.getVariableByIdAsync(id)
    if (!v) { console.log(`ABORTADO · el token destino ${nombre} (${id}) no resuelve en este archivo. Sin el, el script escribiria mal.`); return }
    vars[nombre] = v
  }

  for (const p of PLAN) {
    const n = await figma.getNodeByIdAsync(p.id)
    if (!n) { console.log(`SIN NODO · ${p.rotulo} (${p.id}) no existe aqui`); sinNodo += p.claves.length; continue }
    for (const k of p.claves) {
      const actual = (n.boundVariables || {})[k]
      const idActual = actual && actual.id
      if (idActual === DESTINO[p.a]) { yaHecho++; continue }
      if (idActual !== ORIGEN[p.de]) {
        console.log(`SALTADO · ${p.rotulo} .${k} — esperaba ${p.de}, encontro ${idActual || '(sin binding)'}`)
        saltados++; continue
      }
      n.setBoundVariable(k, vars[p.a])
      hechos++
    }
  }

  console.log('────────────────────────────────────────')
  console.log(`rebindeados: ${hechos} · ya correctos: ${yaHecho} · saltados: ${saltados} · sin nodo: ${sinNodo}`)
  console.log(`COBERTURA: ${hechos + yaHecho} de ${N} bindings del lote`)
  if (hechos + yaHecho !== N) console.log('🔴 NO ES TOTAL. Revisa los saltados antes de dar esto por cerrado.')
  console.log('Quedan fuera, por decision pendiente del Lead: 6 bindings `size.y` en 4 `slider-bg` y 2 `progress bar` Nano.')
  console.log('Siguiente paso obligatorio: `npm run tokens:lint` — debe reportar 6 cruzados en masters, no 0.')
})()
