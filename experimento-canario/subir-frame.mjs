#!/usr/bin/env node
/**
 * Sube un frame ya descargado a Supernova y lo registra en frames-subidos.json.
 *
 *   node subir-frame.mjs frames/button-color.png "Color" "12362:6853" "Button Color"
 *
 * El PNG se obtiene antes con `download_assets` de Figma + curl. Se hace en dos
 * pasos a propósito: así la imagen nunca pasa por el contexto del agente, que
 * sería caro y además la truncaría.
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { basename } from "node:path"
const { Supernova } = sdkPkg

const [ruta, seccion, nodo, nombre] = process.argv.slice(2)
if (!ruta || !seccion) {
  console.error('Uso: node subir-frame.mjs <ruta.png> <Sección> [nodoId] [nombre]')
  process.exit(1)
}

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const buf = readFileSync(ruta)
const archivo = new File([buf], basename(ruta), { type: "image/png" })
const r = await sdk.resources.uploadAssetResource(from, archivo)
console.log(`✓ subido — ${Math.round(buf.length/1024)} KB · ${r.id}`)

const REG = new URL("./frames-subidos.json", import.meta.url)
const reg = existsSync(REG) ? JSON.parse(readFileSync(REG, "utf-8")) : {}
reg[seccion] = { nodo: nodo ?? null, nombre: nombre ?? basename(ruta), assetId: r.id, url: r.url }
writeFileSync(REG, JSON.stringify(reg, null, 2))
console.log(`✓ registrado en frames-subidos.json bajo "${seccion}"`)
