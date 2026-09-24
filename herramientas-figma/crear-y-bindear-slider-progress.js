/* ============================================================================
 * crear-y-bindear-slider-progress.js — pegar en Scripter (plugin de Figma)
 * ----------------------------------------------------------------------------
 * ORDEN DE PEGADO: este es el SEGUNDO.
 *   1º `rebind-cruces-categoria-L1.js`  (16 bindings, cero pixeles)
 *   2º este                              (4 tokens nuevos + 16 nodos)
 *   No hay dependencia tecnica entre ambos: el orden es para que
 *   `npm run tokens:lint` se lea una sola vez, al final, y de 0.
 *
 * QUE HACE
 *   (1) Crea los 4 tokens de `componentDimension` que el Lead aprobo el 24 sep
 *       2026, y (2) rebindea con ellos la ALTURA de `Slider-point` y
 *       `progress bar` — tanto la que colgaba de un token cruzado como la que
 *       estaba cruda.
 *
 * LOS 4 TOKENS — nombres corregidos contra `13-convencion-naming.md` §2b
 *   El patron del Button es <component>/<category>/<variant>, con la CATEGORIA
 *   SEGUNDA (`button/radius/default`). Por eso NO son `slider/track/height` ni
 *   `progress/height/nano`, que fue lo primero que se propuso:
 *     slider/size/track     = 8
 *     progress/size/nano    = 2
 *     progress/size/micro   = 8
 *     progress/size/small   = 16
 *   Y se omite el eje a proposito: `sizing` ya nombra `size/control/l` y
 *   `size/icon/s` sin decir que son alturas.
 *
 * [CRITICO] ESTOS CUATRO SON DIRECTOS, Y ES UNA DESVIACION DECLARADA
 *   Los cuatro del Button dicen en su descripcion: «SIEMPRE aliasa a un
 *   semantico, nunca a un primitivo ni a un valor crudo». AQUI NO SE PUEDE
 *   CUMPLIR: la coleccion `sizing` solo tiene `control` (48·56·64) e `icon`
 *   (16·20·24). No hay semantico de 8 ni de 2, y aliasar `progress/size/small`
 *   a `size/icon/s` seria semanticamente falso — una barra no es un icono.
 *   Aliasar a `unit/*` esta prohibido por esa misma regla: es un primitivo.
 *   Se resuelve como la DOCTRINA DEL HAIRLINE ya resolvio `width/xs` y
 *   `width/s`: valor directo, con el porque escrito en la descripcion.
 *   Es REVERSIBLE — si el Lead abre despues los semanticos, estos cuatro pasan
 *   a alias SIN TOCAR UN SOLO NODO.
 *
 * [CRITICO] LOS 6 `slider main` SIN RADIO NO SE TOCAN — y corrige un error mio
 *   Yo afirme que «las otras 6 variantes tienen los radios CRUDOS a 4 px».
 *   ES FALSO, medido el 24 sep 2026: no tienen radio NINGUNO — ni bindeado ni
 *   crudo. Son esquinas rectas, radio 0.
 *   Bindearlas a `radius/xs` las llevaria de 0 a 4 y ESO MUEVE PIXELES, asi
 *   que quedan fuera y las mira el Lead.
 *   *Lo que destapan no es deuda de tokens: `Slider-point` tiene DOS
 *   geometrias distintas del mismo `slider main` —4 variantes con las esquinas
 *   izquierdas a 4 y 6 completamente rectas—. Eso es una decision de diseño.*
 *
 * COBERTURA DE ESTE SCRIPT: 16 nodos de los 26 del alcance
 *   10 `slider-bg` (4 que colgaban de `space/s` + 6 crudas) · 6 `progress bar`
 *   (2 que colgaban de `space/2xs` + 4 crudas).
 *   Los otros 10: 4 `slider main` los cierra el script 1, y 6 `slider main`
 *   quedan excluidos por lo de arriba. 20 de 26 tocados, 6 declarados fuera.
 *
 * CERO PIXELES — verificado nodo a nodo el 24 sep 2026
 *   Los 10 `slider-bg` miden ya 8 de alto; los `progress` miden ya 16, 8 y 2
 *   segun su talla. Ningun nodo se redondea a un peldaño cercano: si alguno no
 *   coincide EXACTO, el script lo salta y lo reporta en vez de moverlo.
 *
 * ES SEGURO
 *   - Idempotente en los dos tramos: si el token ya existe lo reutiliza en vez
 *     de duplicarlo, y si el binding ya es el correcto lo cuenta como yaHecho.
 *   - La coleccion se localiza POR EL ID DE UN TOKEN EXISTENTE del Button, no
 *     por su nombre. El empalme por nombre es el que ya mintio en este sistema.
 *   - GUARDA DE ALTURA: solo bindea si la altura actual es EXACTAMENTE la del
 *     token. Nada se redondea.
 *   - No toca BS-01 ni la App.
 *
 * [OJO] Scripter NO imprime el valor devuelto por una funcion `async`. Mira la
 *   consola: los `console.log` si salen.
 *
 * DESPUES — la relectura, que no es opcional
 *   El script RELEE los 4 tokens por su id recien creado y RELEE cada binding
 *   tras escribirlo. Una llamada sin error no prueba el efecto.
 *   Luego: push de variables a Supernova (lo hace el Lead, en PREVIEW) y
 *   `npm run tokens:lint`, que debe dar 0 cruzados en masters.
 * ========================================================================== */
(async () => {
  const ANCLA = 'VariableID:12971:1612' // button/radius/default — solo para hallar la coleccion

  /* Los 4 tokens: nombre, valor y descripcion. */
  const NUEVOS = [
    { nombre: 'slider/size/track', valor: 8,
      desc: 'Alto de la pista de Slider-point. Valor directo (8), no alias: la coleccion sizing solo tiene control (48·56·64) e icono (16·20·24), asi que no existe semantico al que aliasar — misma desviacion declarada que la doctrina del hairline en width/xs y width/s. Se aplica a las 10 variantes. Token acotado a un componente. Si se abre un semantico de 8, este pasa a alias sin tocar nodos.' },
    { nombre: 'progress/size/nano', valor: 2,
      desc: 'Alto de progress bar en la talla Nano. Valor directo (2), no alias: sizing no tiene peldaño de 2 — ver slider/size/track. Aplica a Roundend=Pill y Roundend=Default. Token acotado a un componente.' },
    { nombre: 'progress/size/micro', valor: 8,
      desc: 'Alto de progress bar en la talla Micro. Valor directo (8), no alias: sizing no tiene peldaño de 8 — ver slider/size/track. Aplica a Roundend=Pill y Roundend=Default. Token acotado a un componente.' },
    { nombre: 'progress/size/small', valor: 16,
      desc: 'Alto de progress bar en la talla Small. Valor directo (16), no alias: el unico 16 de sizing es size/icon/s, y una barra no es un icono — aliasar ahi seria semanticamente falso. Aplica a Roundend=Pill y Roundend=Default. Token acotado a un componente.' }
  ]

  /* Los 16 nodos, con la altura que DEBEN tener ya. */
  const PLAN = [
    // slider-bg — 10 variantes de Slider-point, todas a 8
    ...['5979:288','5979:300','5979:312','5960:94','5960:101','5960:108','9853:368','9853:354','9853:340','5960:122']
      .map(id => ({ id, rotulo: 'Slider · slider-bg', token: 'slider/size/track', alto: 8 })),
    // progress bar — 6 variantes, tres tallas
    { id: '8270:285', rotulo: 'Progress · Pill/Small',    token: 'progress/size/small', alto: 16 },
    { id: '3449:207', rotulo: 'Progress · Default/Small', token: 'progress/size/small', alto: 16 },
    { id: '8270:291', rotulo: 'Progress · Pill/Micro',    token: 'progress/size/micro', alto: 8 },
    { id: '3449:213', rotulo: 'Progress · Default/Micro', token: 'progress/size/micro', alto: 8 },
    { id: '8632:1630', rotulo: 'Progress · Pill/Nano',    token: 'progress/size/nano',  alto: 2 },
    { id: '8632:1632', rotulo: 'Progress · Default/Nano', token: 'progress/size/nano',  alto: 2 }
  ]
  const N = PLAN.length // 16

  /* ── 1 · La coleccion, por el id del ancla ───────────────────────────── */
  const ancla = await figma.variables.getVariableByIdAsync(ANCLA)
  if (!ancla) { console.log(`ABORTADO · el ancla ${ANCLA} (button/radius/default) no resuelve. Sin ella no se que coleccion es componentDimension, y adivinarla por nombre es el error que este sistema ya cometio.`); return }
  const coleccion = await figma.variables.getVariableCollectionByIdAsync(ancla.variableCollectionId)
  if (!coleccion) { console.log('ABORTADO · la coleccion del ancla no resuelve.'); return }
  console.log(`Coleccion destino: "${coleccion.name}" (${coleccion.modes.length} mode/s)`)

  /* ── 2 · Crear o reutilizar los 4 tokens ─────────────────────────────── */
  const existentes = await figma.variables.getLocalVariablesAsync('FLOAT')
  const enColeccion = new Map(existentes.filter(v => v.variableCollectionId === coleccion.id).map(v => [v.name, v]))
  const vars = {}
  let creados = 0, reutilizados = 0
  for (const t of NUEVOS) {
    let v = enColeccion.get(t.nombre)
    if (v) { reutilizados++ }
    else {
      v = figma.variables.createVariable(t.nombre, coleccion, 'FLOAT')
      creados++
    }
    for (const m of coleccion.modes) v.setValueForMode(m.modeId, t.valor)
    v.description = t.desc
    vars[t.nombre] = v
  }
  console.log(`Tokens · creados: ${creados} · reutilizados: ${reutilizados} · de ${NUEVOS.length}`)

  /* ── 3 · RELECTURA de los tokens, por id. El log de creacion no prueba nada ── */
  let okTokens = 0
  for (const t of NUEVOS) {
    const rel = await figma.variables.getVariableByIdAsync(vars[t.nombre].id)
    const val = rel && rel.valuesByMode[coleccion.modes[0].modeId]
    const bien = rel && rel.name === t.nombre && val === t.valor && rel.description === t.desc
    if (bien) okTokens++
    else console.log(`🔴 RELECTURA FALLIDA · ${t.nombre} — nombre="${rel && rel.name}" valor=${val} descOk=${rel && rel.description === t.desc}`)
  }
  console.log(`Relectura de tokens: ${okTokens} de ${NUEVOS.length}`)
  if (okTokens !== NUEVOS.length) { console.log('🔴 ABORTADO antes de bindear: no se bindea contra tokens que no se pudieron releer.'); return }

  /* ── 4 · Bindear la altura, con guarda de valor ──────────────────────── */
  let hechos = 0, yaHecho = 0, saltados = 0, sinNodo = 0
  const releer = []
  for (const p of PLAN) {
    const n = await figma.getNodeByIdAsync(p.id)
    if (!n) { console.log(`SIN NODO · ${p.rotulo} (${p.id})`); sinNodo++; continue }
    const actual = (n.boundVariables || {}).height
    if (actual && actual.id === vars[p.token].id) { yaHecho++; continue }
    if (Math.abs(n.height - p.alto) > 0.001) {
      console.log(`SALTADO · ${p.rotulo} (${p.id}) mide ${n.height}, el token ${p.token} vale ${p.alto}. NO se redondea: esto moveria pixeles y lo mira el Lead.`)
      saltados++; continue
    }
    n.setBoundVariable('height', vars[p.token])
    hechos++; releer.push(p)
  }

  /* ── 5 · RELECTURA de los bindings ───────────────────────────────────── */
  let okBind = 0
  for (const p of releer) {
    const n = await figma.getNodeByIdAsync(p.id)
    const b = n && (n.boundVariables || {}).height
    if (b && b.id === vars[p.token].id && Math.abs(n.height - p.alto) < 0.001) okBind++
    else console.log(`🔴 RELECTURA FALLIDA · ${p.rotulo} (${p.id}) — binding=${b && b.id} alto=${n && n.height}`)
  }

  console.log('────────────────────────────────────────')
  console.log(`bindeados: ${hechos} · ya correctos: ${yaHecho} · saltados: ${saltados} · sin nodo: ${sinNodo}`)
  console.log(`COBERTURA: ${hechos + yaHecho} de ${N} nodos · relectura OK: ${okBind} de ${hechos}`)
  if (hechos + yaHecho !== N || okBind !== hechos) console.log('🔴 NO ES TOTAL. Revisa lo saltado antes de dar esto por cerrado.')
  console.log('FUERA POR DISEÑO, no por defecto: 6 `slider main` sin radio (0, no 4). Bindearlos moveria pixeles — decision del Lead.')
  console.log('Siguiente: push de variables a Supernova en PREVIEW (lo hace el Lead) y `npm run tokens:lint` — L1 debe dar 0 cruzados en masters.')
})()
