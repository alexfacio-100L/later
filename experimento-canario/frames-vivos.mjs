#!/usr/bin/env node
/**
 * Pide a Supernova que RENDERICE los nodos de Figma del registro y los deje
 * disponibles como frames de documentación referenciables por el bloque
 * `figma-frames`. Declara cobertura y sale con código 1 si alguno no cuadra.
 *
 *   node frames-vivos.mjs            → estado actual, no pide nada
 *   node frames-vivos.mjs --render   → pide el render de los 23 y espera
 *
 * 🟢 QUÉ RESUELVE, y es la conclusión del canario del 3 sep 2026.
 * Un preview en imagen es una foto: se saca una vez, se sube, y a partir de ahí
 * miente en silencio en cuanto el componente cambia. El 27 de agosto se rehizo
 * la geometría del Button y 15 de los 23 previews publicados se quedaron con el
 * radio anterior —8, 12 y 24 donde el componente tiene 16— sin que nada fallara.
 * Un frame renderizado por Supernova NO es una foto: apunta al nodo de Figma y
 * se rehace solo. Verificado midiendo el render: las tallas `l` y `m` dan 16,
 * que es la geometría de hoy, frente a los 24 del asset subido.
 *
 * 🔴 LA PREGUNTA QUE ESTE SCRIPT RESPONDIÓ, porque estuvo abierta una semana:
 * los previews del Button NO son frames de primer nivel — son capas anidadas
 * dentro del frame de anotación. **Llegan igual.** `getRenderedFigmaFramesAsync`
 * acepta cualquier `figmaFileNodeId`, anidado o no, y da igual cómo se llame la
 * capa: renderizaron los 23, incluidos tres `Artwork wrapper` que ni siquiera
 * siguen la convención `#preview`.
 *
 * ⚠️ Y LO QUE NO HAY QUE CREERSE, porque es donde estuvo la trampa: tener
 * `documentationFrames: true` NO trae estos nodos solo. Ya estaba activado, y la
 * importación había traído 12 frames — **cero de los 23 del Button**. La
 * importación decide por su cuenta qué sube; esta llamada es explícita, y por
 * eso es la que tiene cobertura declarable: se piden N y se comprueban N.
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
const src = (await sdk.dataSources.getDataSources(from)).find(f => f.type === "Figma")

const reg = JSON.parse(fs.readFileSync(new URL("./frames-subidos.json", import.meta.url), "utf8"))
const pares = Object.entries(reg).map(([sec, x]) => [sec, String(x.nodo)])
const objetivo = new Map(pares.map(([s, n]) => [n, s]))
const N = pares.length

if (process.argv.includes("--render")) {
  console.log(`Pidiendo el render de ${N} nodos…`)
  await sdk.assets.getRenderedFigmaFramesAsync(from,
    pares.map(([, n]) => ({ inputType: "NodeId", sourceId: src.id, figmaFileNodeId: n, format: "Png", scale: 2 })))
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 5000))
    const mios = (await sdk.resources.getFigmaFramesV2(from)).filter(f => objetivo.has(String(f.data?.sceneNodeId)))
    const listos = mios.filter(m => m.data.renderState !== "InProgress")
    console.log(`  espera ${i + 1}: presentes ${mios.length} de ${N} · resueltos ${listos.length}`)
    if (mios.length === N && listos.length === N) break
  }
}

const frames = await sdk.resources.getFigmaFramesV2(from)
const mios = frames.filter(f => objetivo.has(String(f.data?.sceneNodeId)))
const ok = mios.filter(m => m.data.renderState === "Success")
const fallidos = mios.filter(m => m.data.renderState !== "Success")
const ausentes = pares.filter(([, n]) => !mios.some(m => String(m.data?.sceneNodeId) === n))

// 🔴 La cobertura se emite sola, y la suma tiene que cuadrar o el reparto perdió algo.
if (ok.length + fallidos.length + ausentes.length !== N)
  throw new Error(`El reparto no cuadra: ${ok.length}+${fallidos.length}+${ausentes.length} ≠ ${N}`)

console.log(`\nFrames vivos del registro: ${ok.length} de ${N} renderizados`)
if (process.argv.includes("--lista"))
  for (const m of ok) console.log(`  ✓ ${objetivo.get(String(m.data.sceneNodeId)).padEnd(34)} ${m.meta?.name ?? "-"}  ${m.data.renderedImage?.width}x${m.data.renderedImage?.height}\n      ${m.data.renderedImage?.url}`)
for (const m of fallidos) console.error(`  🔴 ${objetivo.get(String(m.data.sceneNodeId))}: renderState=${m.data.renderState}`)
for (const [s, n] of ausentes) console.error(`  🔴 ${s} (${n}): sin frame. Corre con --render`)

if (fallidos.length || ausentes.length) process.exit(1)
console.log("🟢 Los 23 nodos del registro están vivos en Supernova.")
