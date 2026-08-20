import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(process.env.SUPERNOVA_API_KEY)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
console.log("designSystemId:", ds.id, " versionId:", v.id)

// ¿Se pueden exportar nodos de Figma como recurso?
try {
  const frames = await sdk.resources.getFigmaFrames(from)
  console.log(`\nfigmaFrames disponibles: ${frames.length}`)
  if (frames[0]) console.log("  forma del primero:", JSON.stringify(frames[0]).slice(0,320))
} catch(e){ console.log("getFigmaFrames:", e.message.slice(0,70)) }

// Tokens de color del botón, para el grid de accesibilidad
const tokens = await sdk.tokens.getTokens(from)
const buscar = ["background/brandMain","background/brandHover","background/brandPressed",
                "text/primaryInverse","background/negative","text/link","background/positive"]
console.log("\nTOKEN IDS:")
for (const b of buscar) {
  const t = tokens.find(t => (t.name && t.origin?.name === b) || t.name === b.split("/").pop())
  const alt = tokens.find(t => JSON.stringify(t).includes(`"${b}"`))
  const found = t ?? alt
  if (found) console.log(`  ${b.padEnd(28)} ${found.id ?? found.persistentId}`)
}
