/* ============================================================================
 * rebind-iconos-consola.js — pegar en la consola del plugin de Figma
 * ----------------------------------------------------------------------------
 * QUE HACE
 *   Liga las pinturas de los iconos del Button a los tokens de componente
 *   (button/icon/*). Es la parte que el puente MCP NO pudo hacer.
 *
 * POR QUE EXISTE, y es un limite de instrumento medido el 7 sep 2026:
 *   Los iconos del Button son INSTANCIAS (iconLeft / iconRight de Phosphor).
 *   Desde `use_figma` la instancia devuelve `children: []` y `findAll()` no la
 *   atraviesa; `getMainComponentAsync()` resuelve el main pero no destraba los
 *   hijos, y el id sintetico `I<inst>;<hijo>` no resuelve con
 *   `getNodeByIdAsync`. Resultado: 63 de 120 pinturas de icono quedaron
 *   ligadas y 57 no. Dentro del plugin, en cambio, el arbol es accesible.
 *
 *   [CRITICO] Lo que esto ensena y por que el script se versiona: la
 *   verificacion se hizo con la MISMA traversal que el rebind, asi que no
 *   podia revelar lo que ambos se saltaban. Lo destapo el colorWalk de la
 *   extraccion, que es un instrumento independiente.
 *
 * ES SEGURO
 *   - Guarda de valor: solo reescribe si el token actual es EXACTAMENTE el
 *     esperado. Si encuentra otra cosa, lo salta y lo reporta.
 *   - Idempotente: lo ya ligado se cuenta como `yaHecho` y no se toca.
 *   - No toca el anillo de foco: `border/focus` se queda, por decision del Lead.
 *   - Cero pixeles cambiados: el token de componente aliasa al mismo semantico.
 *
 * USO
 *   Consola del plugin, con el archivo de auditoria abierto. Devuelve un
 *   resumen con cobertura `n de N`.
 * ========================================================================== */
(async () => {
  const SET_ID = '3566:3197'
  const set = await figma.getNodeByIdAsync(SET_ID)
  if (!set) throw new Error('No se encontro el component set ' + SET_ID)

  const vars = await figma.variables.getLocalVariablesAsync()
  const byName = {}, nameById = {}
  for (const v of vars) { byName[v.name] = v; nameById[v.id] = v.name }

  // (variant, state) -> [semantico esperado, token de componente destino]
  const MAPA = {
    'primary|default':    ['icon/inverse',        'button/icon/primary'],
    'primary|hover':      ['icon/inverse',        'button/icon/primary'],
    'primary|pressed':    ['icon/inverse',        'button/icon/primary'],
    'primary|focus':      ['icon/inverse',        'button/icon/primary'],
    'primary|disabled':   ['icon/disabled',       'button/icon/primaryDisabled'],
    'secondary|default':  ['text/secondary',      'button/icon/secondary'],
    'secondary|hover':    ['text/secondary',      'button/icon/secondary'],
    'secondary|focus':    ['text/secondary',      'button/icon/secondary'],
    'secondary|pressed':  ['icon/inverseStatic',  'button/icon/secondaryPressed'],
    'secondary|disabled': ['icon/disabled',       'button/icon/secondaryDisabled'],
  }

  const tokenDe = (n) => {
    const f = n.fills
    if (!f || f === figma.mixed || !f.length) return null
    const p = f[0]
    const bv = p.boundVariables && p.boundVariables.color
    return bv ? (nameById[bv.id] || ('remoto:' + bv.id)) : 'RAW'
  }

  const log = { total: 0, ligadas: 0, yaHecho: 0, saltadas: [], sinPintura: 0 }
  for (const variante of set.children) {
    const vp = variante.variantProperties || {}
    const par = MAPA[`${vp.variant}|${vp.state}`]
    if (!par) { log.saltadas.push(`combinacion desconocida: ${vp.variant}/${vp.state}`); continue }
    const [esperado, destino] = par
    if (!byName[destino]) { log.saltadas.push(`falta la variable ${destino}`); continue }

    // Los dos slots de icono, por nombre de capa; dentro, todo lo que pinte.
    for (const slot of variante.findAll((n) => n.name === 'iconLeft' || n.name === 'iconRight')) {
      const dentro = slot.findAll ? slot.findAll(() => true) : []
      for (const n of [slot, ...dentro]) {
        if (typeof n.fills === 'undefined') continue
        const actual = tokenDe(n)
        if (actual === null) { log.sinPintura++; continue }
        log.total++
        if (actual === destino) { log.yaHecho++; continue }
        if (actual !== esperado) { log.saltadas.push(`${vp.variant}/${vp.state} ${n.name}: esperaba ${esperado}, encontro ${actual}`); continue }
        const paint = JSON.parse(JSON.stringify(n.fills[0]))
        n.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', byName[destino])]
        log.ligadas++
      }
    }
  }

  const cobertura = `${log.ligadas + log.yaHecho} de ${log.total}`
  console.log('COBERTURA (pinturas de icono en tokens de componente):', cobertura)
  console.log('ligadas ahora:', log.ligadas, '| ya estaban:', log.yaHecho, '| sin pintura:', log.sinPintura)
  if (log.saltadas.length) {
    console.log('[CRITICO] SALTADAS —', log.saltadas.length, '— revisar antes de dar por bueno:')
    for (const s of [...new Set(log.saltadas)]) console.log('   ', s)
  } else {
    console.log('[OK] Ninguna saltada.')
  }
  if (log.ligadas + log.yaHecho !== log.total) console.log('[CRITICO] La cobertura NO es total. NO extraigas todavia.')
  return cobertura
})()
