/**
 * crear-componentes.mjs — crea en Supernova la ENTIDAD de cada componente y la
 *                         vincula con su página de documentación.
 *
 * POR QUÉ EXISTE, y es un paso que se estaba obviando
 * ----------------------------------------------------
 * En Supernova hay dos cosas distintas que es fácil confundir:
 *
 *   · La **página de documentación** — el sidebar de `Componentes` tiene 57.
 *   · El **componente** — una entidad aparte, con su estado, su enlace a la
 *     documentación y su enlace a Figma. **Solo existían DOS**: `Button` y
 *     `Text field`, creados a mano por el Lead.
 *
 * 🔴 Y de esa entidad —no de la página— se alimentan los bloques vivos. Por eso
 * la lista de la página `Componentes` mostraba **2 de 57**: no era que faltara
 * documentación, es que faltaban las entidades.
 *
 * QUÉ HACE, Y QUÉ NO
 * ------------------
 * Crea el componente con su **nombre** y lo vincula a su **página**. Nada más.
 *
 * 🟡 **NO pone `status`**, por decisión del Lead el 11 sep 2026: ninguno ha pasado
 * la revisión, y la propia página declara que «sin estado» significa *existe en
 * Figma, no ha pasado la revisión*. **Poner `healthy` por defecto sería afirmar
 * una garantía que nadie ha comprobado.**
 *
 * 🟡 **NO vincula `figmaComponent`**, y tampoco es olvido. Ese vínculo exige
 * emparejar cada página con su componente de Figma, y **los nombres no
 * coinciden** —`Text field` es `inputText`, `Check` es `Checkbox`—. *Un
 * emparejamiento automático equivocado crearía 55 vínculos malos que nadie
 * revisaría.* **Se pone cuando cada componente entra a producción.**
 *
 *   npm run docs:crear-componentes              # dice qué crearía
 *   npm run docs:crear-componentes -- --escribir  # los crea
 *
 * ⚠️ Es idempotente por nombre: un componente que ya existe no se duplica.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"

const { Supernova } = sdkPkg
const ESCRIBIR = process.argv.includes("--escribir")
const GRUPO_RAIZ = "Componentes"
const PESTANAS = new Set(["Resumen general", "Usos", "Especificaciones", "Estatus y cambios"])

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

// ── El sidebar: qué páginas de componente hay ──
const st = await sdk.documentation.getDocumentationStructure(from)
const porPid = new Map(st.map(e => [e.persistentId, e]))
const porId = new Map(st.map(e => [String(e.id), e]))
const get = id => porPid.get(id) ?? porId.get(String(id))
const raiz = st.find(e => e.title === GRUPO_RAIZ && /group/i.test(e.type))
if (!raiz) { console.error(`🔴 No existe el grupo «${GRUPO_RAIZ}».`); process.exit(1) }

const paginas = []
const walk = (e, grupo) => {
  for (const cid of e.childrenIds ?? []) {
    const h = get(cid); if (!h) continue
    if (/^Component Documentation Template$/.test(h.title)) continue
    if (PESTANAS.has(h.title)) continue
    const esGrupo = /group/i.test(h.type)
    /* Un grupo cuyos hijos son las cuatro pestañas ES el componente: su enlace
     * apunta al grupo, no a una pestaña. Así está hecho el Button. */
    if (esGrupo && h.childrenIds?.some(c => PESTANAS.has(get(c)?.title))) {
      paginas.push({ nombre: h.title, pid: h.persistentId, grupo }); continue
    }
    if (esGrupo) { walk(h, grupo ?? h.title); continue }
    paginas.push({ nombre: h.title, pid: h.persistentId, grupo })
  }
}
for (const cid of raiz.childrenIds ?? []) {
  const g = get(cid)
  if (g && !/Template/.test(g.title)) walk(g, g.title)
}

// ── Lo que ya existe ──
const existentes = await sdk.components.getComponents(from)
const yaHay = new Map(existentes.map(c => [c.name.trim().toLowerCase(), c]))
const props = await sdk.components.getComponentProperties(from)
const propDoc = props.find(p => p.codeName === "documentationLink")
if (!propDoc) { console.error("🔴 No existe la propiedad «documentationLink»."); process.exit(1) }

const crear = paginas.filter(p => !yaHay.has(p.nombre.trim().toLowerCase()))
const saltados = paginas.filter(p => yaHay.has(p.nombre.trim().toLowerCase()))

console.log(`\nComponentes en el sidebar: ${paginas.length}`)
console.log(`  ya existen como entidad : ${saltados.length}  (${saltados.map(s => s.nombre).join(", ")})`)
console.log(`  por crear               : ${crear.length}\n`)

let g = null
for (const p of crear) {
  if (p.grupo !== g) { console.log(`  ── ${p.grupo}`); g = p.grupo }
  console.log(`     ${p.nombre}`)
}

if (!ESCRIBIR) {
  console.log(`\nNo se escribió nada. Para crearlos: npm run docs:crear-componentes -- --escribir`)
  console.log(`  Se crean SIN estado y SIN vínculo a Figma — ver la cabecera de este archivo.`)
  process.exit(0)
}

// ── Crear ──
let ok = 0, fallos = []
for (const p of crear) {
  try {
    const local = sdk.components.createLocalComponent(v.id, ds.brandId ?? existentes[0]?.brandId)
    local.name = p.nombre
    const res = await sdk.components.createComponent(from, local)
    const id = res?.id ?? res?.persistentId ?? local.id
    const creado = { ...local, id }
    /* El enlace a la documentación sí se puede derivar solo: lo da el sidebar. */
    await sdk.components.updateComponentPropertyValue(from, p.pid, creado, propDoc)
    ok++
    console.log(`  ✓ ${p.nombre}`)
  } catch (e) {
    fallos.push({ nombre: p.nombre, error: String(e.message ?? e).slice(0, 110) })
    console.log(`  🔴 ${p.nombre} — ${String(e.message ?? e).slice(0, 90)}`)
  }
}

/* Cobertura declarada (regla 16): sobre cuántos de cuántos. */
console.log(`\ncobertura: ${ok} de ${crear.length} creados y vinculados a su página`)
if (fallos.length) {
  console.log(`🔴 ${fallos.length} fallaron:`)
  for (const f of fallos) console.log(`   · ${f.nombre}: ${f.error}`)
  process.exitCode = 1
} else {
  console.log(`🟢 La lista de la página «Componentes» pasa de ${saltados.length} a ${saltados.length + ok}.`)
  console.log(`   Siguen SIN estado y SIN vínculo a Figma, a propósito.`)
}
