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

// Los PNG salen del frame YA DOCUMENTADO (`Button Anatomy`, 12362:5484), no de la
// plantilla maestra. En la plantilla los cuatro iconos estan superpuestos dentro de
// `#indicator`, asi que exportarlos uno a uno arrastra el borde redondeado del
// contenedor y los descentra — `instance` salia recortado a 160x192 en vez de 192x192.
// En el frame documentado cada fila tiene visible solo su icono, y salen limpios.
const ICONOS = {
  instance: { archivo: "frames/iconos-tipo/instance.png", nodo: "12362:5586", etiqueta: "Instance" },
  text:     { archivo: "frames/iconos-tipo/text.png",     nodo: "12362:5604", etiqueta: "Text" },
  frame:    { archivo: "frames/iconos-tipo/frame.png",    nodo: "12362:5576", etiqueta: "Frame" },
  // El Button no tiene ranuras, asi que no hay fila de slot que copiar: se exporto
  // clonando un `#indicator` sobre fondo blanco y dejando visible solo `#slot`.
  slot:     { archivo: "frames/iconos-tipo/slot.png",     nodo: "12362:5569 (clon)", etiqueta: "Slot" },
  // Indicador de jerarquia de las tablas de Structure. Sale de `Button Structure`
  // YA DOCUMENTADO (fila `clipsContent`, unica con el estado de esquina aislado),
  // no del componente maestro: alli los dos estados estan empalmados en el mismo
  // frame y exportar uno arrastra al otro.
  // Se usa la esquina para TODA fila hija: el otro estado, `within-group`, es una
  // linea de 24x188 que solo funciona cuando las filas se continuan visualmente,
  // y en Supernova cada celda es independiente.
  jerarquia:{ archivo: "frames/iconos-tipo/jerarquia.png", nodo: "12362:6409", etiqueta: "Sub-propiedad" },
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
