/**
 * verificar-size.mjs — la puerta de la tarea 4.18.
 *
 * Comprueba que la capa semántica `size/*` llegó a Supernova como tipo `Size`,
 * aliasada a `unit/*` y con los valores que la escala del Button declara.
 *
 * Los tokens se crean en FIGMA (colección `sizing`, scope "Width and height")
 * y llegan aquí por el push del plugin de Supernova. Este script no crea nada:
 * solo dice si el push ya ocurrió y si trajo lo que tenía que traer.
 *
 * Uso:  node experimento-canario/verificar-size.mjs
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

/** Lo esperado: nombre → píxeles. Si la escala cambia, se cambia aquí y en Figma. */
const ESPERADO = {
  "size/icon/s": 16,
  "size/icon/m": 20,
  "size/icon/l": 24,
  "size/control/s": 48,
  "size/control/m": 56,
  "size/control/l": 64,
}

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: v.id }

const tokens = await sdk.tokens.getTokens(ref)
const porNombre = new Map()
for (const t of tokens) porNombre.set(t.origin?.name ?? t.name, t)

let fallos = 0
console.log(`Design system ${ds.id} · versión ${v.id}\n`)
for (const [nombre, px] of Object.entries(ESPERADO)) {
  const t = porNombre.get(nombre)
  if (!t) { console.log(`🔴 ${nombre.padEnd(16)} no existe en Supernova — falta el push del plugin desde Figma`); fallos++; continue }
  const tipoOk = t.tokenType === "Size"
  const valorOk = t.value?.measure === px
  const aliasOk = Boolean(t.value?.referencedTokenId)
  const marca = tipoOk && valorOk && aliasOk ? "🟢" : "🔴"
  if (marca === "🔴") fallos++
  console.log(`${marca} ${nombre.padEnd(16)} tipo=${String(t.tokenType).padEnd(10)} valor=${t.value?.measure}px ${
    aliasOk ? "(alias a unit)" : "🔴 VALOR CRUDO, no aliasa a unit"}${tipoOk ? "" : "  🔴 el scope de Figma no era «Width and height»"}`)
}

const tiposSize = tokens.filter(t => t.tokenType === "Size").length
console.log(`\nTokens de tipo Size en el sistema: ${tiposSize}`)
if (fallos) {
  console.log(`\n🔴 ${fallos} de ${Object.keys(ESPERADO).length} sin cumplir. 4.18 NO puede regenerar el .md todavía.`)
  process.exit(1)
}
console.log(`\n🟢 La capa está completa. 4.18 puede regenerar el .md y la tabla de tokens.`)
