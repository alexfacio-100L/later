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

/**
 * 🔴 LA PUERTA QUE SUSTITUYE A LA DE ESCALA, y conviene saber qué cubre y qué no.
 *
 * `verificar-previews.mjs` medía `fraccionAncho`: el % del lienzo que ocupaba el
 * contenido dibujado. Existía porque Supernova escala la imagen al ancho de la
 * columna, así que un PNG exportado con 60% de margen salía diminuto. **Con
 * frames vivos esa causa desaparece por construcción**: Supernova renderiza el
 * nodo exacto, sin lienzo alrededor — los 23 miden justo lo que mide su
 * `#preview`. No hay margen que medir.
 *
 * Lo que sí puede salir mal y esto vigila: un frame **más alto que ancho** se
 * come la página al escalarse a la columna, y uno **demasiado estrecho** sale
 * borroso. Son dos números, y son criterio propio sobre n=23, sin respaldo
 * disciplinar: se declaran para que se puedan discutir, no porque sean canon.
 *
 * ⚠️ Y LO QUE NADIE VIGILA, dicho para que no se descubra tarde: que el frame
 * esté BIEN EN FIGMA. Un frame vivo se republica solo, así que una edición a
 * medias sale a la página sin que nada avise. **Es la contrapartida aceptada al
 * cambiar la foto por el espejo**, y no es automatizable desde aquí: haría falta
 * guardar una imagen de referencia, que es exactamente la foto que quitamos.
 */
const RATIO_MINIMO = 1.0   // más alto que ancho: se come la página

/* 🔴 UMBRAL REESCRITO EL 8 SEP 2026, y lo que cambió es el PORQUÉ, no el número.
 *
 * Decía 200 «porque por debajo el escalado a la columna lo emborrona». Esa razón
 * CADUCÓ: el generador emite ahora `previewSize="NaturalHeight"` —el «fit to
 * image size» que el Lead ponía a mano—, así que la imagen se dibuja a su tamaño
 * natural y NO se estira. Sin escalado no hay emborronado, a ningún ancho.
 *
 * Y lo destapó un cambio del Lead en otro sitio: al quitar el fondo de las
 * plantillas de preview, el frame pasó a ajustarse a su contenido y 20 de los 23
 * encogieron. Uno cayó a 133 px y este guard bloqueó la publicación de una página
 * cuyo render estaba BIEN — verificado con captura, no con el árbol de capas.
 *
 * EL RIESGO REAL, que es el que este número vigila ahora:
 *   No es la nitidez. Es la CONSISTENCIA VISUAL entre previews de una misma
 *   página. Un preview mucho más pequeño que sus vecinos se lee como un error de
 *   maquetación aunque esté perfecto, porque flota en una columna ancha.
 *
 * Por eso baja a 120 y no desaparece: sigue habiendo un suelo por debajo del cual
 * un preview deja de leerse como parte de la serie. 120 admite el botón suelto
 * más pequeño del sistema (133 px) y sigue atrapando un frame recortado por error.
 *
 * ⚠️ Si alguien vuelve a subirlo, que sea por consistencia visual medida en la
 * página, no por nitidez: la nitidez ya no depende de esto.
 */
const ANCHO_MINIMO = 120
const revisarForma = (lista) => {
  const raros = []
  for (const m of lista) {
    const { width: w, height: h } = m.data.renderedImage ?? {}
    const sec = objetivo.get(String(m.data.sceneNodeId))
    if (!w || !h) { raros.push(`${sec}: el render no declara dimensiones`); continue }
    if (w / h < RATIO_MINIMO) raros.push(`${sec}: ${w}×${h} — más alto que ancho (ratio ${(w / h).toFixed(2)})`)
    if (w < ANCHO_MINIMO)     raros.push(`${sec}: ${w}×${h} — más estrecho que ${ANCHO_MINIMO} px`)
  }
  return raros
}

/**
 * 🔴 El registro que consume el generador. Lo escribe este script y NO se edita
 * a mano: el `entityId` y el `resourceId` los asigna Supernova al renderizar, y
 * cambian si el nodo se vuelve a pedir. Copiarlos a mano es cómo se llega a un
 * bloque que valida, se guarda y no pinta nada.
 */
if (process.argv.includes("--registro")) {
  const salida = {}
  for (const m of ok) {
    const seccion = objetivo.get(String(m.data.sceneNodeId))
    salida[seccion] = {
      nodo: String(m.data.sceneNodeId),
      nombreEnFigma: m.meta?.name ?? null,
      entityId: m.persistentId,
      resourceId: m.data.renderedImage?.resourceId ?? null,
      url: m.data.renderedImage?.url ?? null,
      ancho: m.data.renderedImage?.width ?? null,
      alto: m.data.renderedImage?.height ?? null,
    }
  }
  const destino = new URL("./frames-vivos.json", import.meta.url)
  fs.writeFileSync(destino, JSON.stringify(salida, null, 2))
  console.log(`✓ frames-vivos.json escrito con ${Object.keys(salida).length} de ${N} entradas`)
  if (Object.keys(salida).length !== N) { console.error("🔴 El registro sale incompleto."); process.exit(1) }
}

const raros = revisarForma(ok)
if (raros.length) {
  console.error(`\n⚠️  ${raros.length} de ${ok.length} con forma sospechosa para una columna:`)
  for (const r of raros) console.error(`   · ${r}`)
} else if (ok.length) {
  console.log(`  Forma en regla: ${ok.length} de ${ok.length} — ninguno más alto que ancho ni por debajo de ${ANCHO_MINIMO} px.`)
}

if (fallidos.length || ausentes.length || raros.length) process.exit(1)
console.log(`🟢 Los ${N} nodos del registro están vivos en Supernova.`)
