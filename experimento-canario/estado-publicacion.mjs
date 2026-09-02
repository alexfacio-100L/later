#!/usr/bin/env node
/**
 * Qué páginas del árbol están PUBLICADAS y cuáles están ocultas.
 *
 * 🔴 Por qué existe, y es la regla 16 en su primera forma. El 1 de septiembre se
 * censó el árbol y se reportó que el grupo `_Component Documentation Template`
 * —cuatro páginas dummy, con marcadores entre corchetes— estaba **publicado**.
 * No lo estaba: el grupo y sus cuatro pestañas llevan `isHidden: true`. El censo
 * leyó el árbol del EDITOR, que muestra por igual lo publicado y lo oculto, y
 * trató «está en el árbol» como «está publicado». El método no podía distinguir
 * las dos cosas, así que su respuesta no era evidencia de ninguna.
 *
 * 🟢 Lo que sí distingue, y por eso este script usa esa lectura:
 * `getFullDocumentationLegacyRepresentation` trae `configuration.isHidden` y,
 * en las páginas publicadas, un `path`. Las ocultas no tienen `path`.
 * `getDocumentationStructure` NO trae `configuration` — de ahí el falso positivo.
 *
 * ⚠️ Y al revés, para que nadie lo intente: esta lectura NO trae `path`, así que
 * el `path` no sirve aquí para decidir si algo está publicado. Se probó y dio
 * «118 de 118 publicadas sin path», que es un falso positivo del mismo tipo. El
 * campo que decide es `configuration.isHidden`, y solo ése.
 *
 *   node estado-publicacion.mjs           → resumen y cobertura
 *   node estado-publicacion.mjs --ocultas → además, lista qué hay oculto
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(
  { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id })

const oculto = (x) => x.configuration?.isHidden === true
const gruposOcultos = new Set(full.allGroups.filter(oculto).map(g => g.persistentId))

const paginas = full.allPages
const ocultas = paginas.filter(oculto)
const publicadas = paginas.filter(p => !oculto(p))

// 🔴 Cobertura explícita: si la suma no cuadra, el reparto perdió páginas.
if (ocultas.length + publicadas.length !== paginas.length)
  throw new Error(`El reparto no cuadra: ${ocultas.length} + ${publicadas.length} ≠ ${paginas.length}`)

console.log(`Árbol de documentación — ${paginas.length} páginas, ${full.allGroups.length} grupos.`)
console.log(`  Publicadas: ${publicadas.length} de ${paginas.length}`)
console.log(`  Ocultas:    ${ocultas.length} de ${paginas.length}`)
console.log(`  Grupos ocultos: ${gruposOcultos.size}`)

if (process.argv.includes("--ocultas")) {
  console.log("\nOculto a propósito:")
  for (const g of full.allGroups.filter(oculto)) console.log(`  [grupo] ${g.title}`)
  for (const p of ocultas) console.log(`  [pág.]  ${p.title}`)
}
