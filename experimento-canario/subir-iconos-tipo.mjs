#!/usr/bin/env node
/**
 * Sube los cuatro iconos de tipo de la plantilla de anatomía a Supernova y los
 * registra en iconos-tipo.json. Se suben UNA vez: los reusan todos los componentes.
 *
 *   node subir-iconos-tipo.mjs
 *
 * Los PNG se exportan antes desde la plantilla `.Anatomy` (12214:6725) con
 * download_assets + curl, para que la imagen no pase por el contexto del agente.
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { readFileSync, writeFileSync } from "node:fs"
const { Supernova } = sdkPkg

const ICONOS = {
  instance: { archivo: "frames/iconos-tipo/instance.png", nodo: "12214:6756", etiqueta: "Instance" },
  text:     { archivo: "frames/iconos-tipo/text.png",     nodo: "12214:6758", etiqueta: "Text" },
  slot:     { archivo: "frames/iconos-tipo/slot.png",     nodo: "12214:6760", etiqueta: "Slot" },
  frame:    { archivo: "frames/iconos-tipo/frame.png",    nodo: "12214:6762", etiqueta: "Frame" },
}

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const reg = {}
for (const [clave, meta] of Object.entries(ICONOS)) {
  const buf = readFileSync(new URL(meta.archivo, import.meta.url))
  const archivo = new File([buf], `tipo-${clave}.png`, { type: "image/png" })
  const r = await sdk.resources.uploadAssetResource(from, archivo)
  reg[clave] = { ...meta, assetId: r.id, url: r.url }
  console.log(`  ✓ ${clave.padEnd(9)} ${String(buf.length).padStart(5)} bytes · ${r.id}`)
}
writeFileSync(new URL("./iconos-tipo.json", import.meta.url), JSON.stringify(reg, null, 2))
console.log(`\n✓ registrados en iconos-tipo.json`)
