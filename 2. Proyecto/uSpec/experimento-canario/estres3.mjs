import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const ROOT = "9b865d29-2c54-4c57-b92a-0f00fdf67a87"
const R = []
const P = async (n, fn) => { try { const r = await fn(); R.push(["✅", n, typeof r==="string"?r.slice(0,36):(Array.isArray(r)?`${r.length} elementos`:"")]); return r }
  catch(e){ R.push(["❌", n, JSON.stringify(e?.response?.data ?? e?.message ?? e).slice(0,58)]); return null } }

const grupo = await P("crear GRUPO", () => sdk.documentation.createDocumentationGroup(from, { parentPersistentId: ROOT, title: "🧪 Zona de pruebas" }))
const pag   = grupo && await P("crear PÁGINA en el grupo", () => sdk.documentation.createDocumentationPage(from, { parentPersistentId: grupo, title: "Prueba" }))
const tabs  = await P("crear GRUPO DE TABS", () => sdk.documentation.createDocumentationTab(from, { parentPersistentId: ROOT, title: "🧪 Tabs" }))
if (grupo) await P("renombrar grupo", () => sdk.documentation.updateDocumentationGroup(from, { persistentId: grupo, title: "🧪 Renombrada" }))
if (grupo) await P("grupo → TABS (groupBehavior)", () => sdk.documentation.updateDocumentationGroup(from, { persistentId: grupo, groupBehavior: "Tabs" }))
if (pag)   await P("escribir markdown en página nueva", () => sdk.import.writeMarkdownToPage(from, pag, "# Prueba\n\nTexto.\n"))
if (pag)   await P("duplicar página", () => sdk.documentation.duplicateDocumentationPageOrTab(from, { persistentId: pag }))
if (pag)   await P("historial de versiones", () => sdk.documentation.listPageHistoryVersions(from, pag))
if (pag)   await P("mover página al raíz", () => sdk.documentation.moveDocumentationPage(from, { persistentId: pag, parentPersistentId: ROOT }))
await P("crear TOKEN", () => sdk.tokens.createToken?.(from, {}) ?? Promise.reject(new Error("sin método directo")))
await P("leer estructura de documentación", () => sdk.documentation.getDocumentationStructure(from))
await P("¿hay build en curso?", () => sdk.documentation.isPublishing(from, "Live"))
await P("listar builds recientes", () => sdk.documentation.getDocumentationBuilds(ws[0].id, v.id, "Live", undefined, undefined, 3))
// limpieza
if (pag)   await P("borrar página", () => sdk.documentation.deleteDocumentationPage(from, pag))
if (grupo) await P("borrar grupo y árbol", () => sdk.documentation.deleteDocumentationGroupAndTree(from, grupo))
if (tabs)  await P("borrar grupo de tabs", () => sdk.documentation.deleteDocumentationTabGroup(from, tabs))

console.log("\n╔═══ PRUEBA DE ESTRÉS ═══")
for (const [s,n,d] of R) console.log(`║ ${s} ${n.padEnd(36)} ${d}`)
console.log(`╚═══ ${R.filter(r=>r[0]==="✅").length}/${R.length}`)
