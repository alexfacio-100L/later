#!/usr/bin/env node
/**
 * crear-pestanas.mjs — convierte una hoja YA EXISTENTE en grupo de pestañas,
 *                      y le añade las que le falten.
 *
 * POR QUÉ EXISTE, y es un hueco de pipeline, no una mejora
 * --------------------------------------------------------
 * El árbol de Supernova está poblado de hojas vacías a propósito: son el ÍNDICE
 * declarado de lo que se va a documentar. El flujo asumido era «ya se identificó
 * la hoja, se le crean las pestañas y listo».
 *
 * 🔴 Ese flujo NO estaba implementado. Verificado el 25 sep 2026 sobre los 41
 * scripts `.mjs` del repo: solo DOS llaman a `createDocumentationTab`, y los dos
 * llevan el destino hardcodeado —`maestra.mjs` crea el molde, `button.mjs` crea
 * la página «Button»—. `generar.mjs` no crea estructura: exige que le pasen un
 * pageId por pestaña y aborta si falta.
 *
 * O sea: se sabía crear una página nueva CON pestañas, y no se sabía colgarle
 * pestañas a una hoja que ya existe. Este guion es la segunda mitad.
 *
 * QUE LA PLATAFORMA PUEDE, Y NO ES DEDUCCIÓN
 * ------------------------------------------
 * `DTOCreateDocumentationTabInput` es `{ persistentId, fromItemPersistentId,
 * tabName }` — leído el 25 sep 2026 en los TIPOS del paquete, no en la web:
 * `node_modules/@supernova-studio/client/dist/index.d.ts:34954`.
 *
 * `fromItemPersistentId` es el persistentId de un ítem EXISTENTE CUALQUIERA.
 * Nada en el tipo exige que sea recién creado. Que el Button lo estrenara sobre
 * una página nueva fue casualidad del caso, no un requisito de la API.
 *
 * La mecánica, tal como la describe `maestra.mjs:308`:
 *   · La PRIMERA llamada, apuntando a la PÁGINA, la convierte en grupo con
 *     pestañas, renombra la página original con el `tabName` y devuelve el id
 *     del GRUPO nuevo.
 *   · Las SIGUIENTES, apuntando al GRUPO, añaden pestañas.
 *
 * ⚠️ RENOMBRA la página original. Si la hoja se llama «Link» y la primera
 * pestaña es «Resumen general», después de correr esto la hoja se llama
 * «Resumen general» y el grupo se llama «Link». Es lo que se quiere, pero
 * conviene saberlo antes y no después.
 *
 * LA LECTURA ES LA AUTORITATIVA, Y ESO TAMPOCO ES DETALLE
 * ------------------------------------------------------
 * 🔴 `getDocumentationStructure` NO devuelve `configuration`: `isHidden` llega
 * `undefined` SIEMPRE y `groupBehavior` no viene. Con esa lectura este guion no
 * podría distinguir un grupo de pestañas de un grupo normal, ni verificar lo que
 * acaba de escribir. Se usa `getFullDocumentationLegacyRepresentation`, que sí
 * los trae. Es la corrección que ya pagó `ocultar-plantilla.mjs` el 24 sep 2026.
 *
 * ⚠️ Y NO se usa el MCP Consumer para comprobar nada de esto. Medido el 25 sep
 * 2026: su listado servía TODAVÍA los títulos con errata corregidos el día 24
 * —`Emojins`, `Breadcrums`, `Tipográfia`— mientras el árbol real ya los tenía
 * bien. Sirve una foto vieja. Para verificar una escritura, no vale.
 *
 * USO
 * ---
 *   node crear-pestanas.mjs --pagina=<persistentId>              → informa, no toca nada
 *   node crear-pestanas.mjs --pagina=<pid> --aplicar             → crea las que falten
 *   node crear-pestanas.mjs --pagina=<pid> --pestanas="A,B,C"    → nombres a medida
 *   node crear-pestanas.mjs --buscar="Link"                      → resuelve el pid por título
 *
 * Es IDEMPOTENTE: lee antes, crea solo lo que falta, y si no falta nada lo dice
 * y no escribe. Declara cobertura `n de N` y sale con código 1 si no es total.
 */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

/** Las cuatro pestañas canónicas de un componente.
 *
 * 🔴 Son las de `button.mjs`, y esa es la estructura VIVA — verificado el 25 sep
 * 2026 leyendo el árbol: el grupo `Button` (836f5e48-…) tiene `groupBehavior:
 * "Tabs"` y estas cuatro hojas debajo.
 *
 * `generar.mjs` propone otras tres —`1-uso` / `2-especificacion` / `3-codigo`—
 * y está MUERTO: los cuatro ids de `config/button.json` que apuntarían a ellas
 * (40847088, 40750051, 40847087 y el grupo 561d3e6e-…) NO EXISTEN en el árbol.
 * No se copian de ahí. */
const PESTANAS_COMPONENTE = ["Resumen general", "Usos", "Especificaciones", "Estatus y cambios"]

const arg = n => process.argv.find(a => a.startsWith(`--${n}=`))?.slice(n.length + 3)
const APLICAR = process.argv.includes("--aplicar")
const PAGINA  = arg("pagina")
const BUSCAR  = arg("buscar")
const NOMBRES = (arg("pestanas")?.split(",").map(s => s.trim()).filter(Boolean)) ?? PESTANAS_COMPONENTE

if (!PAGINA && !BUSCAR) {
  console.error(`
Falta el destino.

  node crear-pestanas.mjs --pagina=<persistentId>   la hoja que se convierte
  node crear-pestanas.mjs --buscar="<título>"       o búscala por su título

Opcionales:
  --pestanas="A,B,C"   nombres a medida (por defecto, las cuatro de componente)
  --aplicar            escribe; sin esto solo informa
`)
  process.exit(1)
}
if (NOMBRES.length === 0) { console.error("🔴 La lista de pestañas está vacía."); process.exit(1) }

const sdk = new Supernova(apiKey)
const me  = await sdk.me.me()
const ws  = await sdk.workspaces.workspaces(me.id)
const ds  = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
if (!ds) { console.error("🔴 No encontré un design system «Later»."); process.exit(1) }
const v   = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

/** Lectura autoritativa: la única que trae `groupBehavior` e `isHidden`.
 *
 * Devuelve también `padreDe`, que el modelo NO trae: los grupos declaran
 * `childrenIds`, pero una página no sabe quién la contiene. Hace falta para la
 * idempotencia — ver `LA TRAMPA` abajo. */
const leer = async () => {
  const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(ref)
  const grupos = new Set(full.allGroups.map(g => g.persistentId))
  const todo = [...full.allGroups, ...full.allPages]
  const padreDe = new Map()
  for (const g of full.allGroups) for (const c of g.childrenIds ?? []) padreDe.set(c, g)
  return {
    porPid: new Map(todo.map(i => [i.persistentId, i])),
    esGrupo: i => grupos.has(i.persistentId),
    padreDe,
    todo,
  }
}

let { porPid, esGrupo, padreDe, todo } = await leer()

/* ── Resolver el destino ───────────────────────────────────────────────── */
let pid = PAGINA
if (!pid) {
  // El `_` de los títulos ocultos es un marcador que añade la API, no parte del
  // nombre: se ignora al comparar o «Usos» nunca encontraría «_Usos».
  const limpio = t => t.replace(/^_/, "")
  const hits = todo.filter(i => limpio(i.title).toLowerCase() === BUSCAR.toLowerCase())
  if (hits.length === 0) { console.error(`🔴 Ningún ítem se titula «${BUSCAR}».`); process.exit(1) }
  if (hits.length > 1) {
    console.error(`🔴 «${BUSCAR}» es ambiguo — ${hits.length} coincidencias. Pasa --pagina= con una:`)
    for (const h of hits) console.error(`     ${h.persistentId}  ${esGrupo(h) ? "grupo" : "página"}  «${h.title}»`)
    process.exit(1)
  }
  pid = hits[0].persistentId
}

let destino = porPid.get(pid)
if (!destino) { console.error(`🔴 El persistentId ${pid} no está en el árbol.`); process.exit(1) }
const limpio = t => t.replace(/^_/, "")

console.log(`\nPedido: «${destino.title}»  ·  pid ${destino.persistentId}  ·  id ${destino.id}`)

/* 🔴 LA TRAMPA, y costó una corrida sucia el 25 sep 2026.
 *
 * Convertir una hoja en grupo de pestañas NO consume su persistentId: la hoja
 * original SOBREVIVE como la PRIMERA PESTAÑA del grupo nuevo. Así que el mismo
 * pid significa dos cosas distintas antes y después.
 *
 * Y volver a correr el guion con ese pid es lo natural —es el que uno tiene
 * apuntado—. La primera versión miraba solo «¿el destino es un grupo Tabs?»,
 * veía una página, la daba por hoja suelta y la volvía a convertir: el grupo
 * acabó con OCHO pestañas, las cuatro duplicadas.
 *
 * ⚠️ Y el segundo `createDocumentationTab` sobre una página que YA es pestaña
 * no devuelve el id de un grupo: devuelve el de la PESTAÑA NUEVA. La relectura
 * lo buscaba como grupo, no encontraba hijos y reportaba `0 de 4` con código 1.
 * *La cobertura hizo su trabajo y falló ruidosamente — pero después de escribir.*
 *
 * La corrección: si el destino es una PÁGINA que cuelga de un grupo `Tabs`,
 * el destino real es ESE GRUPO. Se redirige y se avisa. */
const padre = padreDe.get(destino.persistentId)
if (!esGrupo(destino) && padre?.groupBehavior === "Tabs") {
  console.log(`  ↳ ya es una pestaña del grupo «${padre.title}». El destino real es el GRUPO.`)
  destino = padre
}

/* ── Diagnóstico: qué hay hoy ──────────────────────────────────────────── */
const yaEsTabs = esGrupo(destino) && destino.groupBehavior === "Tabs"
const existentes = yaEsTabs
  ? (destino.childrenIds ?? []).map(id => porPid.get(id)).filter(Boolean)
  : []

console.log(`Destino: «${destino.title}»  ·  pid ${destino.persistentId}  ·  id ${destino.id}`)
console.log(`  tipo: ${esGrupo(destino) ? `grupo (groupBehavior=${destino.groupBehavior})` : "página"}  ·  isHidden=${destino.isHidden}`)

if (esGrupo(destino) && !yaEsTabs) {
  console.error(`\n🔴 Es un grupo NORMAL, no una hoja ni un grupo de pestañas.`)
  console.error(`   Este guion convierte PÁGINAS. Un grupo normal no se convierte: sus hijos`)
  console.error(`   son páginas hermanas, no pestañas. Apunta a una de sus páginas.`)
  process.exit(1)
}

console.log(`\nPestañas pedidas (${NOMBRES.length}): ${NOMBRES.join(" · ")}`)
if (yaEsTabs) {
  console.log(`Pestañas que ya tiene (${existentes.length}): ${existentes.map(e => e.title).join(" · ")}`)
  /* Un grupo con dos pestañas del mismo nombre es siempre una corrida sucia:
   * el guion nunca crea una que ya existe. Se avisa y no se arregla — borrar
   * páginas solo lo decreta el Lead. */
  const cuenta = new Map()
  for (const e of existentes) cuenta.set(limpio(e.title), (cuenta.get(limpio(e.title)) ?? 0) + 1)
  const dup = [...cuenta].filter(([, n]) => n > 1)
  if (dup.length) {
    console.log(`\n  ⚠️ PESTAÑAS DUPLICADAS: ${dup.map(([t, n]) => `«${t}» ×${n}`).join(" · ")}`)
    console.log(`     Este guion nunca crea una que ya existe, así que vienen de otra parte.`)
    console.log(`     No se tocan: borrar páginas lo decide el Lead.`)
  }
} else {
  console.log(`Pestañas que ya tiene: ninguna — es una hoja suelta.`)
  console.log(`  ⚠️ La primera llamada RENOMBRA esta página a «${NOMBRES[0]}» y crea el grupo «${destino.title}» encima.`)
}

const yaHay = new Set(existentes.map(e => limpio(e.title)))
const faltan = NOMBRES.filter(n => !yaHay.has(n))

if (faltan.length === 0) {
  console.log(`\n✓ ${NOMBRES.length} de ${NOMBRES.length} pestañas ya existen. Nada que hacer.`)
  process.exit(0)
}
console.log(`\nPor crear (${faltan.length} de ${NOMBRES.length}): ${faltan.join(" · ")}`)

if (!APLICAR) {
  console.log(`\nNada tocado. Añade --aplicar para crearlas.`)
  process.exit(0)
}

/* ── Escritura ─────────────────────────────────────────────────────────── */
/* El orden importa: si la hoja aún no es grupo, la PRIMERA pestaña pedida tiene
 * que ser la primera llamada, porque es la que absorbe la página original. */
let grupoId = yaEsTabs ? destino.persistentId : null
let creadas = 0
const fallos = []

for (const nombre of faltan) {
  try {
    if (!grupoId) {
      // Convierte la hoja en grupo de pestañas. Devuelve el id del GRUPO.
      grupoId = await sdk.documentation.createDocumentationTab(ref, {
        fromItemPersistentId: destino.persistentId, tabName: nombre,
      })
      console.log(`  ✓ «${nombre}» — la hoja se convirtió en grupo de pestañas (${grupoId})`)
    } else {
      await sdk.documentation.createDocumentationTab(ref, {
        fromItemPersistentId: grupoId, tabName: nombre,
      })
      console.log(`  ✓ «${nombre}»`)
    }
    creadas++
  } catch (e) {
    console.error(`  🔴 «${nombre}»: ${e?.message ?? e}`)
    fallos.push(nombre)
  }
}

/* ── Relectura: se verifica sobre el árbol, no sobre lo que creemos haber hecho ── */
;({ porPid, esGrupo } = await leer())
const grupoFinal = porPid.get(grupoId)
const finales = (grupoFinal?.childrenIds ?? []).map(id => porPid.get(id)).filter(Boolean)
const titulos = new Set(finales.map(f => limpio(f.title)))
const verificadas = NOMBRES.filter(n => titulos.has(n))

console.log(`\n── Relectura (getFullDocumentationLegacyRepresentation) ──`)
console.log(`  grupo «${grupoFinal?.title}» · groupBehavior=${grupoFinal?.groupBehavior}`)
for (const f of finales) console.log(`     - ${f.title}  (id=${f.id})`)

console.log(`\n✓ ${verificadas.length} de ${NOMBRES.length} pestañas verificadas en el árbol`)
if (fallos.length) console.log(`  🔴 fallaron: ${fallos.join(" · ")}`)

if (verificadas.length !== NOMBRES.length) {
  console.error(`\n🔴 Cobertura incompleta: ${verificadas.length} de ${NOMBRES.length}. No se da por bueno.`)
  process.exit(1)
}
console.log(`\n⚠️ Esto escribe en el EDITOR. Publicar a Preview o a Live es aparte.`)
