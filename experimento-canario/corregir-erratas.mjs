#!/usr/bin/env node
/**
 * corregir-erratas.mjs — corrige las erratas de TÍTULO del árbol de documentación.
 *
 * POR QUÉ EXISTE
 * --------------
 * El árbol público arrastra erratas de nombre desde el censo del 2 sep 2026.
 * Son visibles para cualquier externo y no cuestan nada de contenido: solo el
 * título. Este script las corrige de una en una, **por persistentId**, y vuelve
 * a leer para comprobar el efecto.
 *
 * 🔴 CÓMO SE VERIFICA, y no es opcional. `getDocumentationStructure` NO devuelve
 * `configuration`, así que no sirve para verificar nada de visibilidad; y una
 * llamada sin error no prueba el efecto (28 ago 2026: una relectura devolvió el
 * árbol anterior sin que `updatedAt` lo delatara). Aquí se relee con
 * `getFullDocumentationLegacyRepresentation` en una segunda pasada y se compara
 * el título contra el esperado, uno por uno.
 *
 * 🔴 COBERTURA OBLIGATORIA: imprime `n de N` y sale con código 1 si n < N.
 *
 * ⚠️ RIESGO CONOCIDO, declarado: el `slug` se deriva del título y `userSlug` es
 * null en todas estas entidades, así que **renombrar cambia la URL**. Los enlaces
 * antiguos a `.../breadcrums-RiNG5sht` dejan de resolver por ruta. El sufijo
 * corto (`RiNG5sht`) es el `shortPersistentId` y no cambia.
 *
 * ⚠️ OBSERVACIÓN SIN CONFIRMAR (24 sep 2026): las 9 entidades ocultas del árbol
 * —y solo ellas— devuelven el título con un `_` delante. Puede ser un marcador
 * que añade la API a lo oculto, o puede ser parte del título. No está verificado.
 *
 *   node corregir-erratas.mjs            → dice qué cambiaría, no toca nada
 *   node corregir-erratas.mjs --aplicar  → aplica y verifica releyendo
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

/** persistentId → [título actual esperado, título corregido, por qué] */
const ERRATAS = [
  ["1daac161-bcd6-4751-af3a-90ed670629bd", "Page",  "Emojins",        "Emojis",       "no existe «emojins»"],
  ["71374c1c-44f6-4ee6-9055-11c4438e513e", "Page",  "Acronimos",      "Acrónimos",    "falta la tilde"],
  ["58b7577b-20bd-4259-b86b-5b08d526008f", "Page",  "Breadcrums",     "Breadcrumbs",  "falta la «b»"],
  ["e4957a70-c729-4b65-8a82-612a26ac133c", "Page",  "Illustraciones", "Ilustraciones","«ll» es del inglés"],
  ["546745b5-eef0-4532-b2c5-7051a1170519", "Group", "Tipográfia",     "Tipografía",   "tilde permutada"],
  ["3d1588f4-5c63-4cec-b932-fef6f93143d9", "Group", "Audiencia ",     "Audiencia",    "espacio sobrante al final"],
  ["0ed5aef6-e5e0-4259-9780-15a6ad291cfa", "Group", "_Inlcusión",     "Inclusión",    "letras permutadas"],
]

const APLICAR = process.argv.includes("--aplicar")
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const leer = async () => {
  const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(ref)
  return new Map([...full.allGroups, ...full.allPages].map(x => [x.persistentId, x]))
}

let arbol = await leer()
const N = ERRATAS.length
const plan = []
for (const [pid, tipo, antes, despues, porque] of ERRATAS) {
  const e = arbol.get(pid)
  if (!e)                 { console.log(`⚠️  ${antes} → no existe con pid ${pid}`); continue }
  if (e.title === despues){ console.log(`✓  «${despues}» ya estaba corregido`); plan.push([pid, tipo, despues, true]); continue }
  if (e.title !== antes)  { console.log(`⚠️  ${pid}: esperaba «${antes}», encontré «${e.title}» — no lo toco`); continue }
  console.log(`   «${antes}» → «${despues}»   (${porque})`)
  plan.push([pid, tipo, despues, false])
}

if (!APLICAR) { console.log(`\nPlan: ${plan.filter(p=>!p[3]).length} cambio(s) de ${N}. Añade --aplicar.`); process.exit(0) }

for (const [pid, tipo, titulo, yaEstaba] of plan) {
  if (yaEstaba) continue
  if (tipo === "Group") await sdk.documentation.updateDocumentationGroup(ref, { id: pid, title: titulo })
  else                  await sdk.documentation.updateDocumentationPageOrTab(ref, { id: pid, title: titulo })
}

arbol = await leer()
let ok = 0
for (const [pid, , , despues] of ERRATAS.map(e => [e[0], e[1], e[2], e[3]])) {
  const e = arbol.get(pid)
  const bien = e && (e.title === despues || e.title === `_${despues}`)
  console.log(`${bien ? "✓" : "🔴"}  ${despues}  → leído: «${e?.title ?? "NO EXISTE"}»`)
  if (bien) ok++
}
console.log(`\ncobertura: ${ok} de ${N} erratas corregidas y verificadas`)
if (ok < N) { console.error("🔴 No todas se aplicaron. NO se declara el frente cerrado."); process.exit(1) }
