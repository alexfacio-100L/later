import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const ROOT = "9b865d29-2c54-4c57-b92a-0f00fdf67a87"

const R = []
const probar = async (nombre, fn) => {
  try { const r = await fn(); R.push(["✅", nombre, typeof r === "string" ? r.slice(0,38) : ""]); return r }
  catch(e){ R.push(["❌", nombre, String(e.message).replace(/\s+/g," ").slice(0,72)]); return null }
}

// ── ESTRUCTURA DE DOCUMENTACIÓN ──
const grupo = await probar("crear GRUPO", () =>
  sdk.documentation.createDocumentationGroup(from, { parentId: ROOT, title: "🧪 Zona de pruebas" }))

const pagina = grupo && await probar("crear PÁGINA dentro del grupo", () =>
  sdk.documentation.createDocumentationPage(from, { parentId: grupo, title: "Página de prueba" }))

const tabGroup = await probar("crear GRUPO DE TABS", () =>
  sdk.documentation.createDocumentationTab(from, { parentId: ROOT, title: "🧪 Tabs de prueba" }))

if (grupo) await probar("renombrar grupo", () =>
  sdk.documentation.updateDocumentationGroup(from, { id: grupo, title: "🧪 Zona de pruebas (renombrada)" }))

if (grupo) await probar("convertir grupo a TABS (groupBehavior)", () =>
  sdk.documentation.updateDocumentationGroup(from, { id: grupo, groupBehavior: "Tabs" }))

if (pagina) await probar("escribir markdown en la página nueva", () =>
  sdk.import.writeMarkdownToPage(from, pagina, "# Prueba\n\nTexto de prueba.\n"))

if (pagina) await probar("duplicar página", () =>
  sdk.documentation.duplicateDocumentationPageOrTab(from, { id: pagina }))

if (pagina) await probar("leer historial de versiones de la página", () =>
  sdk.documentation.listPageHistoryVersions(from, pagina))

// ── TOKENS ──
await probar("leer tokens", () => sdk.tokens.getTokens(from))
await probar("leer temas de tokens", () => sdk.tokens.getTokenThemes(from))

// ── COMPONENTES ──
await probar("leer componentes", () => sdk.components.getComponents(from))

// ── PUBLICACIÓN ──
await probar("consultar si hay build en curso", () =>
  sdk.documentation.isPublishing(from, "Live"))

// ── LIMPIEZA ──
if (pagina) await probar("borrar página", () => sdk.documentation.deleteDocumentationPage(from, pagina))
if (grupo)  await probar("borrar grupo y su árbol", () => sdk.documentation.deleteDocumentationGroupAndTree(from, grupo))
if (tabGroup) await probar("borrar grupo de tabs", () => sdk.documentation.deleteDocumentationTabGroup(from, tabGroup))

console.log("\n╔══ PRUEBA DE ESTRÉS ══")
for (const [s,n,d] of R) console.log(`║ ${s} ${n.padEnd(42)} ${d}`)
console.log("╚══ " + R.filter(r=>r[0]==="✅").length + "/" + R.length + " operaciones posibles")
