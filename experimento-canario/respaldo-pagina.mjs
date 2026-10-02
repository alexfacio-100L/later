/**
 * respaldo-pagina.mjs — fotografía el árbol de la página ANTES de escribirla,
 *                       y después dice qué se perdió.
 *
 * POR QUÉ EXISTE
 * --------------
 * `writeMarkdownToPage` REEMPLAZA la página entera. Todo ajuste que el Lead haga
 * en Supernova —anchos de columna, swatches de mode, tamaño de preview— vive
 * únicamente ahí, que es justo la superficie que sobrescribimos.
 *
 * 🔴 El 8 sep 2026 se perdieron 16 anchos de tabla así. Se recuperaron 7 porque
 * por casualidad estaban medidos en un diagnóstico; los otros 9 hubo que rehacerlos.
 *
 * Los ajustes CONOCIDOS ya los preserva el generador (`anchos-de-tabla.mjs` para
 * los anchos, `swatches()` para los modes). Este script cubre el resto: los que
 * todavía no sabemos que existen.
 *
 *   npm run docs:respaldo            # guarda el estado actual
 *   npm run docs:respaldo -- --diff  # compara el estado actual contra el respaldo
 *
 * ⚠️ El respaldo NO se restaura solo. Sirve para SABER qué se perdió — que es la
 * diferencia entre un ajuste recuperable y uno que nadie nota que faltaba.
 *
 * 🔴 LÍMITE DECLARADO, medido el 30 sep 2026: el censo se indexa por TÍTULO de
 * pestaña, así que un RENOMBRADO se lee como pérdida. Al renombrar
 * `Especificación` → `Usos` en `Curvas esquinadas`, el diff dio «1 instancia
 * perdida»: el bloque seguía en la misma página —id 40910523, 1 rich-text antes
 * y 1 después— y lo único que cambió fue la clave.
 * *No es un falso negativo: es un falso POSITIVO, y se lee igual de bien.*
 * **Tras renombrar pestañas hay que volver a guardar el respaldo**, o el
 * siguiente diff arrastra la alarma. Indexar por `id` en vez de por título lo
 * arreglaría; no se hizo aquí porque invalidaría los respaldos existentes.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const { Supernova } = sdkPkg
const DIFF = process.argv.includes("--diff")
/* Prueba la vigilancia de callouts sobre el árbol vivo, sin escribir ni publicar. */
const PROBAR = process.argv.includes("--probar-callout")
const PROBAR_TABLA = process.argv.includes("--probar-tabla")
/* Parametrizado el 14 sep 2026 para que `doc:done` sirva al primer lote y no solo
 * al canario. Sin argumento se comporta como siempre: el Button.
 *   node respaldo-pagina.mjs [--diff] [--componente=<slug>] [--grupo=<persistentId>]
 * El grupo se resuelve por NOMBRE contra el árbol si no se pasa su id. */
const ARG = (n) => process.argv.find(a => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=")
const COMPONENTE = ARG("componente") ?? "button"
const GRUPO_EXPLICITO = ARG("grupo")
const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "respaldos")

/* 🔴 TRAMPA CORREGIDA EL 30 SEP 2026, y era de la peor familia: resultado
 * completo, sin error y sin hueco visible. El id del Button era el DEFAULT del
 * grupo, así que `--componente=bordes` SIN `--grupo` comparaba el árbol vivo del
 * BUTTON contra `respaldos/bordes.json`. Salía un diff largo y creíble —«41
 * instancias perdidas, 35 párrafos perdidos»— sobre dos páginas que no tienen
 * nada que ver. La ruta buena (`doc-done-fundamento.mjs`) siempre pasa `--grupo`
 * y nunca lo pisó; quien corriera el comando a mano, sí.
 * Ahora: con `--grupo` manda el id; sin él manda el NOMBRE y, si no aparece,
 * **aborta en vez de caer al Button**. Sin argumentos sigue dando el Button,
 * porque el grupo se llama «Button». */
const normalizar = (s) => (s ?? "").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[-_\s]+/g, " ").trim()

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

const st = await sdk.documentation.getDocumentationStructure(from)
/* Por id si se dio, y si no por nombre: un slug es más fácil de pasar que un uuid. */
let grupo
if (GRUPO_EXPLICITO) {
  grupo = st.find(e => e.persistentId === GRUPO_EXPLICITO)
  if (!grupo) { console.error(`🔴 No se encontró el grupo ${GRUPO_EXPLICITO}`); process.exit(1) }
} else {
  grupo = st.find(e => normalizar(e.title ?? e.name) === normalizar(COMPONENTE))
  if (!grupo) {
    console.error(`🔴 Ningún grupo de la documentación se llama «${COMPONENTE}», y no se pasó --grupo.`)
    console.error(`   NO se compara contra otra página: un diff contra el árbol equivocado se lee igual de bien que uno bueno.`)
    console.error(`   Pasa el id: node experimento-canario/respaldo-pagina.mjs --diff --componente=${COMPONENTE} --grupo=<persistentId>`)
    process.exit(1)
  }
}
console.log(`grupo: «${grupo.title ?? grupo.name}» (${grupo.persistentId}) · respaldo: ${COMPONENTE}.json`)

const actual = {}
for (const cid of grupo.childrenIds) {
  const pag = st.find(x => x.persistentId === cid || x.id === cid)
  if (!pag) continue
  actual[pag.title] = await sdk.documentation.getDocumentationContentRaw(from, pag.id)
}

/**
 * Censo de ajustes: cuenta cada propiedad "de forma" que aparece en el árbol.
 * No compara el contenido —eso cambia en cada escritura, y debe cambiar— sino
 * las decisiones visuales, que NO deben desaparecer solas.
 */
const AJUSTES = ["columnWidth", "swatches", "previewContainerSize", "numberOfColumns"]

/* ⚠️ `indentLevel` y `selectedPropertyIds` NO entran, y conviene decir por qué:
 * el primero cambia legítimamente con el contenido, y el segundo aparece vacío
 * (`[]`) en cuanto alguien abre el bloque en el editor. Contarlos daba tres
 * «pérdidas» en rojo que no lo eran — y una guarda que grita en falso se acaba
 * ignorando, que es como se pierde una de verdad.
 *
 * `variantId` sí entra, pero solo el de bloques de PRIMER nivel: ahí es una
 * decisión visual (el bloque de tokens en modo `table`), mientras que anidado
 * cambia con el contenido. */
const censo = (arbol) => {
  const c = {}
  const add = (k) => { c[k] = (c[k] ?? 0) + 1 }
  ;(function w(o, prof) {
    if (!o || typeof o !== "object") return
    if (Array.isArray(o)) return o.forEach(x => w(x, prof))
    for (const [k, val] of Object.entries(o)) {
      if (AJUSTES.includes(k) && !(Array.isArray(val) && !val.length)) add(k)
      if (k === "variantId" && o.packageId) add(`variantId:${o.packageId.replace("io.supernova.block.", "")}`)
      w(val, prof + 1)
    }
  })(arbol, 0)
  return c
}

/**
 * Los bloques cuyo texto se vigila. Va declarado como lista para que el hueco
 * sea visible: lo que no esté aquí puede cambiar o desaparecer sin que el diff
 * diga nada.
 *
 * 🔴 `callout` ENTRÓ EL 1 OCT 2026, y por un caso medido. Hasta ese día solo se
 * vigilaba `rich-text`: se cambió el texto de un callout en «Bordes» y el diff
 * dio VERDE. En los callouts viven los huecos declarados, los ratios de
 * contraste con su fecha y la procedencia de la evidencia. Es contenido caro y
 * estaba sin vigilar.
 *
 * ⚠️ Ampliar esto NO invalida ningún respaldo: `prev.prosa` se DERIVA del árbol
 * guardado, así que los dos lados se recalculan con la regla nueva.
 *
 * 🔴 LO QUE SIGUE SIN VIGILARSE, declarado con su tamaño en los 6 respaldos de
 * hoy, porque un hueco callado se lee como que no existe:
 *     table                 49 bloques   el texto de las CELDAS, que es donde
 *                                        viven los peldaños y los changelogs
 *     title1-4             129 bloques   un encabezado borrado no se ve
 *     unordered-list         8 bloques
 *     do-dont-guidelines     6 bloques
 *     blockquote             2 bloques
 * `rich-text` y `callout` suman 278 de los ~472 bloques con texto. **La prosa
 * vigilada es poco más de la mitad.** Ampliar a tablas y títulos es la siguiente
 * decisión, y no se tomó aquí.
 */
const VIGILADOS = new Set([
  "io.supernova.block.rich-text",
  "io.supernova.block.callout",
])

/**
 * 🔴 `table` ENTRÓ EL 1 OCT 2026, y se trata aparte por una razón de ruido.
 *
 * Una tabla cambia de forma a menudo: se añade una fila, se reordena. Si se
 * recogiera su texto como UN solo bloque, cualquiera de esas dos cosas marcaría
 * la tabla entera como perdida, en cada publicación. **Un diff que grita siempre
 * deja de leerse, y entonces no vigila nada.**
 *
 * Se emite UNA ENTRADA POR FILA. Con esa granularidad:
 *   · añadir una fila      → 0 perdidos, las viejas siguen ahí
 *   · reordenar filas      → 0 perdidos, la comparación es por conjunto
 *   · cambiar una celda    → 1 fila marcada, con su contexto al lado
 *   · borrar una fila      → 1 fila marcada
 *
 * ⚠️ LÍMITE DECLARADO: dos filas IDÉNTICAS cuentan como una. Borrar una de las
 * dos no se detecta. No se ha visto ocurrir, y el precio de arreglarlo es perder
 * la inmunidad al reordenado.
 */
const ES_TABLA = "io.supernova.block.table"

/** La prosa de la página, en orden. Lo que NUNCA debe desaparecer sin querer. */
const prosa = (arbol) => {
  const o = []
  ;(function w(x) {
    if (!x || typeof x !== "object") return
    if (Array.isArray(x)) return x.forEach(w)
    if (x.packageId === ES_TABLA) {
      for (const item of x.items ?? []) {
        const filas = item?.props?.table?.value
        if (!Array.isArray(filas)) continue
        for (const fila of filas) {
          const celdas = (fila?.cells ?? []).map(c => {
            const s = []
            ;(function t(y) {
              if (!y || typeof y !== "object") return
              if (typeof y.text === "string") s.push(y.text)
              for (const q of Object.values(y)) t(q)
            })(c)
            return s.join("").replace(/\s+/g, " ").trim()
          })
          const txt = celdas.join(" | ").trim()
          if (txt.replace(/\|/g, "").trim()) o.push(txt)
        }
      }
      return
    }
    if (VIGILADOS.has(x.packageId)) {
      const s = []
      ;(function t(y) {
        if (!y || typeof y !== "object") return
        if (typeof y.text === "string") s.push(y.text)
        for (const q of Object.values(y)) t(q)
      })(x)
      const txt = s.join("").replace(/\s+/g, " ").trim()
      if (txt) o.push(txt)
    }
    for (const q of Object.values(x)) w(q)
  })(arbol)
  return o
}

const censoActual = Object.fromEntries(Object.entries(actual).map(([k, a]) => [k, censo(a)]))
const prosaActual = Object.fromEntries(Object.entries(actual).map(([k, a]) => [k, prosa(a)]))
const RUTA = path.join(DIR, `${COMPONENTE}.json`)

/* ── La prueba de que vigila, y no publica nada ────────────────────────────── */
/* 🔴 Una ampliación que no se ha visto fallar no se sabe si funciona. Esto toma
 * el árbol VIVO, le cambia el texto de UN callout en memoria, y comprueba que la
 * comparación lo marca. Si no lo marca, sale con código 1. */
/* 🔴 La prueba de la tabla, y lleva los dos escenarios de RUIDO dentro, porque
 * son el riesgo real: una tabla cambia de forma a menudo. Un diff que marca algo
 * al añadir una fila o al reordenarla se acaba ignorando. */
if (PROBAR_TABLA) {
  const perdidos = (arbolMutado) => {
    const mut = Object.fromEntries(Object.entries(arbolMutado).map(([k, a]) => [k, prosa(a)]))
    let n = 0
    for (const pag of Object.keys(prosaActual)) {
      const ahora = new Set(mut[pag] ?? [])
      n += (prosaActual[pag] ?? []).filter(t => !ahora.has(t)).length
    }
    return n
  }
  const conPrimeraTabla = (fn) => {
    const c = JSON.parse(JSON.stringify(actual))
    let hecho = false
    ;(function w(x) {
      if (hecho || !x || typeof x !== "object") return
      if (Array.isArray(x)) return x.forEach(w)
      if (x.packageId === "io.supernova.block.table") {
        for (const item of x.items ?? []) {
          const filas = item?.props?.table?.value
          if (Array.isArray(filas) && filas.length > 2 && !hecho) { fn(filas); hecho = true }
        }
        return
      }
      for (const q of Object.values(x)) w(q)
    })(c)
    return hecho ? c : null
  }

  const casos = [
    ["una celda cambiada", 1, (filas) => {
      ;(function t(y) { if (!y || typeof y !== "object") return
        if (typeof y.text === "string" && y.text.trim()) { y.text = "CELDA CAMBIADA"; return true }
        for (const q of Object.values(y)) if (t(q)) return true })(filas[1])
    }],
    ["una fila añadida", 0, (filas) => { filas.push(JSON.parse(JSON.stringify(filas[1]))) }],
    ["las filas reordenadas", 0, (filas) => { const d = filas.splice(1); filas.push(...d.reverse()) }],
  ]
  console.log(`── prueba de que el texto de una tabla se vigila ──`)
  let malos = 0
  for (const [nombre, esperado, fn] of casos) {
    const c = conPrimeraTabla(fn)
    if (!c) { console.error("🔴 No se encontró ninguna tabla con filas. La prueba no es concluyente."); process.exit(1) }
    const n = perdidos(c)
    const ok = esperado === 0 ? n === 0 : n >= 1
    console.log(`   ${ok ? "✓" : "🔴"} ${nombre.padEnd(24)} marca ${n} · esperado ${esperado === 0 ? "0" : "al menos 1"}`)
    if (!ok) malos++
  }
  if (malos) { console.error(`\n🔴 ${malos} de ${casos.length} escenarios no se comportan. La ampliación NO es buena.`); process.exit(1) }
  console.log(`🟢 ${casos.length} de ${casos.length} escenarios correctos: marca el cambio y calla ante la forma.`)
  process.exit(0)
}

if (PROBAR) {
  const copia = JSON.parse(JSON.stringify(actual))
  let tocado = null
  ;(function w(x) {
    if (tocado || !x || typeof x !== "object") return
    if (Array.isArray(x)) return x.forEach(w)
    if (x.packageId === "io.supernova.block.callout") {
      ;(function t(y) {
        if (tocado || !y || typeof y !== "object") return
        if (typeof y.text === "string" && y.text.trim()) { tocado = y.text; y.text = "TEXTO CAMBIADO EN MEMORIA" ; return }
        for (const q of Object.values(y)) t(q)
      })(x)
      return
    }
    for (const q of Object.values(x)) w(q)
  })(copia)

  if (!tocado) { console.error("🔴 No se encontró ningún callout con texto. La prueba no es concluyente."); process.exit(1) }

  const mutada = Object.fromEntries(Object.entries(copia).map(([k, a]) => [k, prosa(a)]))
  let marcados = 0
  for (const pag of Object.keys(prosaActual)) {
    const ahora = new Set(mutada[pag] ?? [])
    marcados += (prosaActual[pag] ?? []).filter(t => !ahora.has(t)).length
  }
  console.log(`── prueba de que el texto de un callout se vigila ──`)
  console.log(`   se cambió en memoria: «${tocado.slice(0, 70)}…»`)
  console.log(`   la comparación marca: ${marcados} fragmento(s)`)
  if (!marcados) { console.error("🔴 NO lo marcó. El callout sigue siendo zona ciega."); process.exit(1) }
  console.log(`🟢 Lo marca. El defecto del 1 oct 2026 ya no pasaría en verde.`)
  process.exit(0)
}

if (!DIFF) {
  mkdirSync(DIR, { recursive: true })
  writeFileSync(RUTA, JSON.stringify({
    tomadoEl: new Date().toISOString(),
    zona: "America/Mexico_City",
    legible: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
    censo: censoActual,
    prosa: prosaActual,
    arbol: actual,
  }, null, 1))
  const kb = (readFileSync(RUTA).length / 1024).toFixed(0)
  console.log(`✓ respaldo guardado — ${kb} KB · ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (CDMX)`)
  for (const [pag, c] of Object.entries(censoActual))
    console.log(`  ${pag}: ${Object.entries(c).map(([k, n]) => `${k}=${n}`).join(" · ") || "sin ajustes"}`)
  process.exit(0)
}

if (!existsSync(RUTA)) { console.error("🔴 No hay respaldo. Corre `npm run docs:respaldo` antes de escribir."); process.exit(1) }
const prev = JSON.parse(readFileSync(RUTA, "utf8"))
console.log(`comparando contra el respaldo del ${prev.legible} (CDMX)\n`)

/* 🔴 El censo y la prosa se DERIVAN del árbol guardado, no se leen del respaldo.
 * El respaldo también los almacena, pero usar esa copia hace que cualquier mejora
 * del censo compare formatos distintos y produzca 242 «pérdidas» fantasma — pasó
 * literalmente al afinar esta función. El árbol es el dato; lo demás es derivado. */
prev.censo = Object.fromEntries(Object.entries(prev.arbol).map(([k, a]) => [k, censo(a)]))
prev.prosa = Object.fromEntries(Object.entries(prev.arbol).map(([k, a]) => [k, prosa(a)]))

// ── Lo primero, la prosa: un párrafo borrado no se recupera solo ──
let parrafosPerdidos = 0
for (const pag of Object.keys(prev.prosa ?? {})) {
  const ahora = new Set(prosaActual[pag] ?? [])
  const idos = (prev.prosa[pag] ?? []).filter(t => !ahora.has(t))
  if (!idos.length) continue
  parrafosPerdidos += idos.length
  console.log(`  🔴 ${pag}: ${idos.length} párrafo(s) que estaban y ya no:`)
  idos.forEach(t => console.log(`       «${t.slice(0, 90)}${t.length > 90 ? "…" : ""}»`))
}
if (!parrafosPerdidos) console.log(`  ✓ prosa íntegra en las ${Object.keys(prosaActual).length} pestañas\n`)
else console.log()

let perdidas = 0, iguales = 0
for (const pag of new Set([...Object.keys(prev.censo), ...Object.keys(censoActual)])) {
  const a = prev.censo[pag] ?? {}, b = censoActual[pag] ?? {}
  const claves = new Set([...Object.keys(a), ...Object.keys(b)])
  const lineas = []
  for (const k of claves) {
    const antes = a[k] ?? 0, ahora = b[k] ?? 0
    if (antes === ahora) { iguales++; continue }
    const signo = ahora < antes ? "🔴" : "🔶"
    if (ahora < antes) perdidas += antes - ahora
    lineas.push(`    ${signo} ${k}: ${antes} → ${ahora}`)
  }
  console.log(`  ${pag}${lineas.length ? "" : "  ✓ sin cambios de forma"}`)
  lineas.forEach(l => console.log(l))
}

console.log(`\ncobertura: ${iguales} propiedad(es) sin cambio · ${perdidas} instancia(s) perdidas · ${parrafosPerdidos} párrafo(s) perdidos`)
if (perdidas || parrafosPerdidos) {
  console.log(`🔴 Se perdieron ajustes. El árbol anterior está íntegro en:`)
  console.log(`   ${path.relative(process.cwd(), RUTA)}`)
  process.exitCode = 1
} else {
  console.log(`🟢 Ningún ajuste de forma se perdió en la escritura.`)
}
