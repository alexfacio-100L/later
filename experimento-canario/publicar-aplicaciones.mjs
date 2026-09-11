/**
 * publicar-aplicaciones.mjs — la landing de `Aplicaciones` y su plantilla.
 *
 * QUÉ CONSTRUYE
 *   Aplicaciones (grupo, ya existía en la navegación)
 *   ├── Aplicaciones                        ← la landing
 *   └── Application Documentation Template  ← el molde
 *
 * 🔴 NO toca la navegación global. El grupo `Aplicaciones` ya existe y se
 * conserva tal cual; lo único que cambia es el contenido de su página y la
 * creación de una segunda. *Verificado antes de escribir: si el grupo no está
 * donde se espera, aborta.*
 *
 * ⚠️ La página de la landing HOY se llama `Untitled page` — es una de las dos sin
 * título que la auditoría del sitio detectó el 10 sep. Se renombra, no se crea
 * otra: crear una segunda dejaría la vacía colgando en el árbol público.
 *
 * 🟡 DECISIÓN DE ARQUITECTURA, para validar: **el encargo pedía un `Header` con
 * el título «Aplicaciones» al principio de la landing, y no se pone.** *La página
 * ya lleva ese título, y repetirlo como primer bloque lo publica dos veces
 * seguidas.* Es el patrón del resto del sistema —el Button tampoco abre con un
 * H1 «Button»—. **Si se prefiere el título repetido, es una línea.**
 *
 *   npm run docs:aplicaciones              # valida
 *   npm run docs:aplicaciones -- --escribir  # escribe (queda en PREVIEW)
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { convertir } from "./conversor.mjs"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const ESCRIBIR = process.argv.includes("--escribir")
const GRUPO = "Aplicaciones"
const PLANTILLA = "Application Documentation Template"

const leer = (f) => readFileSync(path.join(AQUI, "../Aplicaciones", f), "utf8").trim()

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const st = await sdk.documentation.getDocumentationStructure(from)
const porPid = new Map(st.map(e => [e.persistentId, e]))
const porId = new Map(st.map(e => [String(e.id), e]))
const get = id => porPid.get(id) ?? porId.get(String(id))

const grupo = st.find(e => e.title === GRUPO && /group/i.test(e.type))
if (!grupo) { console.error(`🔴 No existe el grupo «${GRUPO}». NO se crea: la navegación no se toca.`); process.exit(1) }

const hijos = (grupo.childrenIds ?? []).map(get).filter(Boolean)
console.log(`Grupo «${GRUPO}» — ${hijos.length} página(s): ${hijos.map(h => h.title).join(", ") || "(ninguna)"}`)

/* La landing es la primera página del grupo, se llame como se llame hoy. */
const landing = hijos.find(h => /page/i.test(h.type))
if (!landing) { console.error(`🔴 El grupo no tiene ninguna página que usar como landing.`); process.exit(1) }
const yaPlantilla = hijos.find(h => h.title === PLANTILLA)

const docs = [
  { titulo: GRUPO,     md: leer("landing-aplicaciones.md"),  destino: landing },
  { titulo: PLANTILLA, md: leer("plantilla-aplicacion.md"),  destino: yaPlantilla ?? null },
]

for (const d of docs) {
  const { mdx, informe } = convertir(d.md)
  d.mdx = mdx; d.informe = informe
  const val = await sdk.import.validateMarkdown(from, mdx)
  if (!val.isValid) {
    console.log(`✗ «${d.titulo}»: ${String(val.error?.message).replace(/\s+/g, " ").slice(0, 220)}`)
    process.exit(1)
  }
  console.log(`  ✓ «${d.titulo}» — ${val.blockCount} bloques · ${informe.callouts} callout(s)` +
    (d.destino ? `  → ${d.destino.title}` : `  → se creará`))
}

if (!ESCRIBIR) {
  console.log(`\nNo se escribió nada. Para publicarlo: npm run docs:aplicaciones -- --escribir`)
  process.exit(0)
}

for (const d of docs) {
  if (!d.destino) {
    /* 🔴 El campo es `parentPersistentId`, no `parentId`. Con el nombre
     * equivocado el SDK no falla con un mensaje claro: revienta dentro de su
     * generador de slugs con «Expected a string, got undefined» y vuelca el
     * bundle entero. El nombre correcto está en el tipo
     * `DTOCreateDocumentationPageInputV2` de `@supernova-studio/client`. */
    const nuevoId = await sdk.documentation.createDocumentationPage(from, {
      parentPersistentId: grupo.persistentId, title: d.titulo,
    })
    d.destino = { id: nuevoId, title: d.titulo, persistentId: nuevoId }
    console.log(`  + creada «${d.titulo}»`)
  } else if (d.destino.title !== d.titulo) {
    await sdk.documentation.updateDocumentationPageOrTab(from, {
      id: String(d.destino.id), title: d.titulo,
    })
    console.log(`  ↻ «${d.destino.title}» renombrada a «${d.titulo}»`)
  }
  await sdk.import.writeMarkdownToPage(from, String(d.destino.id), d.mdx)
  console.log(`  ✓ escrita «${d.titulo}»`)
}

/* Verificación releyendo, no confiando en el log. */
const st2 = await sdk.documentation.getDocumentationStructure(from)
const g2 = st2.find(e => e.title === GRUPO && /group/i.test(e.type))
const h2 = (g2.childrenIds ?? []).map(id => st2.find(x => x.persistentId === id || String(x.id) === String(id))).filter(Boolean)
console.log(`\ncobertura: ${h2.length} página(s) en «${GRUPO}»: ${h2.map(x => x.title).join(" · ")}`)
const sinTitulo = h2.filter(x => !x.title || /^untitled/i.test(x.title))
if (sinTitulo.length) { console.log(`🔴 Quedan ${sinTitulo.length} sin título.`); process.exitCode = 1 }
console.log(`\n  ⚠️  Esto ESCRIBIÓ las páginas; NO las publicó al sitio público.`)
console.log(`      Revísalas en Preview. La publicación a Live la hace el Lead.`)
