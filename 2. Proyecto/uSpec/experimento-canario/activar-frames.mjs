import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const fuentes = await sdk.dataSources.getDataSources(from)
const figma = fuentes.find(f => f.type === "Figma")
console.log("ANTES:", JSON.stringify(figma.scope))

const r = await sdk.dataSources.updateFigmaSource(from, figma.id, {
  scopes: {
    tokens: figma.scope.tokens,
    components: figma.scope.components,
    assets: figma.scope.assets,
    documentationFrames: true,               // ← lo que se activa
    isUnpublishedContentFallbackEnabled: figma.scope.isUnpublishedContentFallbackEnabled,
  }
})
console.log("DESPUÉS:", JSON.stringify(r.scope))
