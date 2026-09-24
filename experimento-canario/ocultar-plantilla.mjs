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

/* 🔴 CORREGIDO EL 24 SEP 2026 — la lectura anterior no podía ver lo que escribe.
 * `getDocumentationStructure` NO devuelve `configuration`: `isHidden` llega como
 * `undefined` SIEMPRE, esté oculto o no. Con esa lectura el script informaba
 * «isHidden actual: undefined», contaba 0 páginas dentro (el campo `parent` no
 * existe en ese modelo; los hijos están en `childrenIds`) y, tras escribir, la
 * verificación final habría fallado con la escritura hecha.
 * `getFullDocumentationLegacyRepresentation` SÍ trae `configuration.isHidden`.
 * Es la regla 16 —un método que no puede mostrar la presencia no prueba la
 * ausencia— aplicada al verificador mismo. */
const leer = async () => {
  const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(ref)
  const todo = [...full.allGroups, ...full.allPages]
  const grupo = full.allGroups.find(i => i.persistentId === GRUPO)
  const hijos = (grupo?.childrenIds ?? []).map(id => todo.find(i => i.persistentId === id)).filter(Boolean)
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
