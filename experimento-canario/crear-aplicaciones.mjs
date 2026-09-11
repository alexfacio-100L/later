/**
 * crear-aplicaciones.mjs — la estructura de `Aplicaciones`: categorías y esqueletos.
 *
 * POR QUÉ EXISTE
 * --------------
 * El Lead pidió que `Aplicaciones` tuviera en el sidebar una estructura parecida
 * a la de `Componentes`: categorías con sus piezas dentro, no una landing suelta.
 *
 * ⚠️ Y eso contradice el encargo de la mañana del 11 sep, que decía *«no crear una
 * taxonomía profunda… se definirá posteriormente según el inventario real»*.
 * **Es una decisión del Lead, tomada ese mismo día con el sidebar delante.** Se
 * deja escrito para que se lea como cambio deliberado y no como olvido.
 *
 * 🔴 LO QUE NO SE HACE, y viene del mismo encargo: **las páginas NO se crean con
 * las 17 secciones de la plantilla llenas de placeholders.** *Publicar diecisiete
 * «[pendiente]» por página son 200 huecos en el sitio público.* Cada página lleva
 * **qué es esa aplicación** —una frase real— y **que está pendiente**. La
 * plantilla se duplica encima cuando le llegue el turno.
 *
 * ⚠️ La taxonomía es PROVISIONAL. Nace de lo que el Lead enumeró, no de un
 * inventario de piezas reales. *Se revisa cuando exista ese inventario.*
 *
 *   npm run docs:crear-aplicaciones              # dice qué crearía
 *   npm run docs:crear-aplicaciones -- --escribir  # lo crea
 *
 * Idempotente: lo que ya existe con ese nombre no se duplica.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { convertir } from "./conversor.mjs"

const { Supernova } = sdkPkg
const ESCRIBIR = process.argv.includes("--escribir")
const GRUPO = "Aplicaciones"

/**
 * La taxonomía. Cada grupo agrupa piezas que **se construyen igual**, no que se
 * parezcan: un deck y una carta comparten retícula y jerarquía tipográfica; un
 * post y una campaña comparten formato y canal. *Agrupar por parecido visual
 * habría juntado cosas que no comparten ni una regla.*
 */
const TAXONOMIA = [
  { grupo: "Documentos", piezas: [
    ["Presentaciones", "Decks de venta, de producto y de resultados. El formato donde la marca más se usa y menos se cuida."],
    ["Papelería", "Cartas, membretes, tarjetas y plantillas de documento corporativo."],
    ["Informes y propuestas", "Documentos largos con datos, tablas y anexos."],
  ]},
  { grupo: "Digital y social", piezas: [
    ["Redes sociales", "Piezas para feed, historias y perfiles, con sus formatos por plataforma."],
    ["Campañas", "Conjuntos de piezas que comparten mensaje y corren en varios canales a la vez."],
    ["Correo", "Newsletters y correos transaccionales, donde el formato impone sus propios límites."],
  ]},
  { grupo: "Audiovisual", piezas: [
    ["Video", "Piezas en movimiento: cortinillas, subtítulos, cierres de marca y ritmo."],
    ["Fotografía", "Criterio de imagen: qué se fotografía, cómo se encuadra y cómo se trata."],
    ["Motion", "Animación de marca y transiciones, y su relación con el movimiento del producto."],
  ]},
  { grupo: "Impresos", piezas: [
    ["Material promocional", "Folletos, carteles y piezas de punto de venta."],
    ["Editorial", "Publicaciones largas, con retícula, paginación y jerarquía propias."],
  ]},
  { grupo: "Espacios y objetos", piezas: [
    ["Señalización", "Orientación y rótulos en espacio físico, donde la distancia de lectura manda."],
    ["Espacios físicos", "Oficinas, stands y puntos de contacto construidos."],
    ["Merchandising", "Objetos y textil donde la marca vive sobre un soporte que no controla."],
  ]},
]

const esqueleto = (nombre, que) => `${que}

<SNCallout type="Warning">
**Esta aplicación todavía no está documentada.** Existe como intención del sistema, no como guía. *Mientras esta nota siga aquí, no hay reglas que seguir para este formato — pregunta antes de asumir.*
</SNCallout>

## Qué se documentará

Cómo se construye correctamente una pieza de este tipo con Later: su propósito, sus principios de formato, su construcción, y cómo se usan los fundamentos de \`Cimientos\` dentro de ella.

**La estructura completa está en \`Application Documentation Template\`**, que se duplica encima de esta página cuando le llegue el turno.`

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const leerArbol = async () => {
  const st = await sdk.documentation.getDocumentationStructure(from)
  const porPid = new Map(st.map(e => [e.persistentId, e]))
  const porId = new Map(st.map(e => [String(e.id), e]))
  return { st, get: id => porPid.get(id) ?? porId.get(String(id)) }
}
let { st, get } = await leerArbol()
const raiz = st.find(e => e.title === GRUPO && /group/i.test(e.type))
if (!raiz) { console.error(`🔴 No existe el grupo «${GRUPO}». No se crea: la navegación no se toca.`); process.exit(1) }

const hijos = (raiz.childrenIds ?? []).map(get).filter(Boolean)
const yaGrupo = new Map(hijos.filter(h => /group/i.test(h.type)).map(h => [h.title, h]))

let nuevosG = 0, nuevasP = 0
const plan = []
for (const cat of TAXONOMIA) {
  const existe = yaGrupo.get(cat.grupo)
  if (!existe) nuevosG++
  const dentro = existe ? (existe.childrenIds ?? []).map(get).filter(Boolean).map(x => x.title) : []
  for (const [nombre] of cat.piezas) if (!dentro.includes(nombre)) nuevasP++
  plan.push({ ...cat, existe, dentro })
}

console.log(`\nGrupo «${GRUPO}» — hoy: ${hijos.map(h => h.title).join(" · ")}\n`)
for (const c of plan) {
  console.log(`  ${c.existe ? "=" : "+"} ${c.grupo}`)
  for (const [n] of c.piezas) console.log(`      ${c.dentro.includes(n) ? "=" : "+"} ${n}`)
}
console.log(`\npor crear: ${nuevosG} categoría(s) · ${nuevasP} página(s)`)

if (!ESCRIBIR) {
  console.log(`\nNo se escribió nada. Para crearlo: npm run docs:crear-aplicaciones -- --escribir`)
  process.exit(0)
}

let okG = 0, okP = 0, fallos = []
for (const cat of TAXONOMIA) {
  let grupo = yaGrupo.get(cat.grupo)
  if (!grupo) {
    try {
      const id = await sdk.documentation.createDocumentationGroup(from, {
        parentPersistentId: raiz.persistentId, title: cat.grupo,
      })
      okG++; console.log(`  + grupo «${cat.grupo}»`)
      ;({ st, get } = await leerArbol())
      grupo = st.find(e => e.persistentId === id || String(e.id) === String(id)) ?? { persistentId: id }
    } catch (e) { fallos.push(`grupo ${cat.grupo}: ${String(e.message ?? e).slice(0, 90)}`); continue }
  }
  const dentro = (grupo.childrenIds ?? []).map(get).filter(Boolean).map(x => x.title)
  for (const [nombre, que] of cat.piezas) {
    if (dentro.includes(nombre)) continue
    try {
      const pid = await sdk.documentation.createDocumentationPage(from, {
        parentPersistentId: grupo.persistentId, title: nombre,
      })
      const { mdx } = convertir(esqueleto(nombre, que))
      await sdk.import.writeMarkdownToPage(from, String(pid), mdx)
      okP++; console.log(`      + ${nombre}`)
    } catch (e) { fallos.push(`${cat.grupo}/${nombre}: ${String(e.message ?? e).slice(0, 90)}`) }
  }
}

/* Cobertura declarada (regla 16). */
console.log(`\ncobertura: ${okG} de ${nuevosG} categorías · ${okP} de ${nuevasP} páginas`)
if (fallos.length) {
  console.log(`🔴 ${fallos.length} fallo(s):`)
  for (const f of fallos) console.log(`   · ${f}`)
  process.exitCode = 1
} else {
  console.log(`\n  ⚠️  Esto ESCRIBIÓ las páginas; NO las publicó al sitio público.`)
  console.log(`      Revísalas en Preview. La publicación a Live la hace el Lead.`)
}
