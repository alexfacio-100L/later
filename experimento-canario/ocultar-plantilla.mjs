#!/usr/bin/env node
/**
 * Despublica el grupo `Componentes / _Component Documentation Template`.
 *
 * 🔴 Por qué: sus cuatro pestañas son las únicas páginas dummy del árbol —
 * marcadores entre corchetes e instrucciones al autor repetidas siete veces—.
 * La plantilla SIGUE EXISTIENDO como plantilla; lo que no debe es estar
 * publicada. No se borra nada: `isHidden` la saca de la publicación y la deja
 * en el editor, que es exactamente lo que se quiere.
 *
 *   node ocultar-plantilla.mjs            → informa del estado, no toca nada
 *   node ocultar-plantilla.mjs --aplicar  → oculta y vuelve a leer para verificar
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

const GRUPO = "4125f28b-2af1-4a80-9add-d19455925c4e" // _Component Documentation Template
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const leer = async () => {
  const items = await sdk.documentation.getDocumentationStructure(ref)
  const grupo = items.find(i => i.persistentId === GRUPO)
  const hijos = items.filter(i => i.parent?.persistentId === GRUPO || i.parentGroupId === GRUPO)
  return { grupo, hijos }
}

const { grupo, hijos } = await leer()
if (!grupo) { console.error(`🔴 No encontré el grupo ${GRUPO}.`); process.exit(1) }
console.log(`Grupo: "${grupo.title}"  ·  id numérico ${grupo.id}`)
console.log(`  isHidden actual: ${grupo.isHidden}  ·  isPrivate: ${grupo.isPrivate}`)
console.log(`  Páginas dentro: ${hijos.length}`)
for (const h of hijos) console.log(`    · ${h.title}  (isHidden=${h.isHidden})`)

if (!process.argv.includes("--aplicar")) {
  console.log("\nNada tocado. Añade --aplicar para ocultarlo.")
  process.exit(0)
}
if (grupo.isHidden) { console.log("\n✓ Ya estaba oculto. Nada que hacer."); process.exit(0) }

await sdk.documentation.updateDocumentationGroup(ref, {
  id: grupo.persistentId,
  configuration: { isHidden: true },
})

// 🔴 Releer SIEMPRE. Escribir y dar por hecho el resultado es el error del
// 28 de agosto: una relectura devolvió el árbol anterior sin que updatedAt lo
// delatara. Aquí la verificación es sobre el campo que se acaba de escribir.
const { grupo: despues } = await leer()
if (despues?.isHidden) {
  console.log(`\n✓ "${despues.title}" queda fuera de la publicación (isHidden=true).`)
  console.log("  Sigue existiendo en el editor como plantilla.")
} else {
  console.error(`\n🔴 La escritura NO se reflejó: isHidden sigue en ${despues?.isHidden}.`)
  process.exit(1)
}
