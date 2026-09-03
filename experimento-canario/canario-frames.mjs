#!/usr/bin/env node
/**
 * CANARIO · ¿puede `figma-frames` sustituir a los previews en imagen?
 *
 * La pregunta abierta, y es UNA: los previews del Button no son frames de
 * primer nivel — son una capa `#preview` ANIDADA dentro del frame de anotación.
 * Si la importación de `documentationFrames` solo trae el primer nivel, el
 * bloque `figma-frames` no puede apuntar a ellos y la vía no sirve tal cual.
 *
 *   node canario-frames.mjs           → solo mide, no activa nada
 *   node canario-frames.mjs --activar → activa documentationFrames y vuelve a medir
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import fs from "node:fs"
const { Supernova } = sdkPkg

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const fuentes = await sdk.dataSources.getDataSources(from)
const figma = fuentes.filter(f => f.type === "Figma")
console.log(`Fuentes Figma: ${figma.length}`)
for (const f of figma)
  console.log(`  · ${f.name ?? f.id}  documentationFrames=${f.scope?.documentationFrames}  components=${f.scope?.components}  tokens=${f.scope?.tokens}`)

const medir = async (etiqueta) => {
  console.log(`\n─── ${etiqueta} ───`)
  for (const [nombre, fn] of [["getFigmaFrames", "getFigmaFrames"], ["getFigmaFramesV2", "getFigmaFramesV2"]]) {
    try {
      const r = await sdk.resources[fn](from)
      console.log(`  ${nombre}: ${Array.isArray(r) ? r.length : typeof r} entradas`)
      if (Array.isArray(r) && r.length) {
        const conNombre = r.filter(x => x?.name)
        const preview = conNombre.filter(x => /preview/i.test(x.name))
        console.log(`     con nombre: ${conNombre.length} · que contienen "preview": ${preview.length}`)
        for (const x of r.slice(0, 8)) console.log(`     · ${x.name ?? "(sin nombre)"}  id=${x.id ?? "-"}  figmaNode=${x.figmaNodeId ?? x.nodeId ?? "-"}`)
        if (r.length > 8) console.log(`     … y ${r.length - 8} más`)
        fs.writeFileSync(`canario-frames-${fn}.json`, JSON.stringify(r, null, 1))
      }
    } catch (e) { console.log(`  ${nombre}: ERROR ${(e?.message ?? e).toString().slice(0, 140)}`) }
  }
}

await medir("ANTES")

if (process.argv.includes("--activar")) {
  for (const f of figma) {
    if (f.scope?.documentationFrames === true) { console.log(`\n(${f.name}: ya estaba en true)`); continue }
    const r = await sdk.dataSources.updateFigmaSource(from, f.id, { scopes: {
      tokens: f.scope.tokens, components: f.scope.components, assets: f.scope.assets,
      documentationFrames: true,
      isUnpublishedContentFallbackEnabled: f.scope.isUnpublishedContentFallbackEnabled } })
    console.log(`\n✓ ${f.name}: documentationFrames → ${r.scope?.documentationFrames}`)
  }
}
