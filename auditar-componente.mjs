/**
 * auditar-componente.mjs — Auditoría profunda de un componente, antes de documentarlo.
 *
 * POR QUÉ EXISTE
 * --------------
 * El 4 sep 2026 el Lead contó tres corridas de documentación del Button. Las tres
 * sirvieron —plantilla, pestañas, capa editorial— pero las tres partieron de un
 * supuesto falso: que el componente ya estaba cerrado. No lo estaba, y cada corrida
 * descubrió un defecto nuevo.
 *
 * La causa no es descuido: **no existía un «done» de COMPONENTE**. Hay criterio de
 * done para la documentación (`md:verificar`, `docs:previews`, `docs:subidos`) y
 * ninguno para lo que se documenta. Esto es la mitad mecanizable de esa puerta.
 *
 * QUÉ MIDE, Y POR QUÉ ESTOS CHECKS
 * --------------------------------
 *   B1 · Pintura sin variable         — un color crudo no llega a código
 *   B2 · Geometría sin token          — lo mismo, en la capa dimensional
 *   B3 · Semánticos rotos consumidos  — cruza con `docs:foundations`: documentar
 *                                       un componente que consume un token roto
 *                                       PUBLICA el defecto
 *   B4 · Pares REALES fondo/texto     — el check que `docs:foundations` declara
 *                                       explícitamente NO CUBIERTO, porque exige
 *                                       recorrer el componente. Aquí sí se puede:
 *                                       el par sale de la variante, no de un
 *                                       emparejamiento canónico inventado
 *   B5 · Tokens de componente         — acuerdo del Lead: un componente nace con
 *                                       los suyos. Hoy hay cero
 *
 * USO
 * ---
 *   npm run comp:auditar                 # Button por defecto
 *   npm run comp:auditar -- --md         # escribe el informe a Diagnóstico/
 *   npm run comp:auditar -- --json
 *
 * LÍMITE DE INSTRUMENTO, declarado y verificado
 * ---------------------------------------------
 * Lee `spec-origen/<slug>/<slug>-_base.json`, no Figma en vivo. Si la extracción
 * es vieja, esto audita el componente de esa fecha — y lo dice en la cabecera.
 * El extractor uSpec es CIEGO al binding de las esquinas (`cornerRadius` sale
 * `token: null` en las 60 aunque estén bindeadas): ese caso se declara como no
 * medible aquí, no como defecto.
 */

import { apiKey } from "./experimento-canario/entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { readFileSync, writeFileSync, existsSync } from "node:fs"

const { Supernova } = sdkPkg
const ARGS = process.argv.slice(2)
const SLUG = ARGS.find((a) => !a.startsWith("--")) ?? "button"
const JSON_OUT = ARGS.includes("--json")
const MD_OUT = ARGS.includes("--md")

const RUTA = new URL(`./spec-origen/${SLUG}/${SLUG}-_base.json`, import.meta.url)
if (!existsSync(RUTA)) {
  console.error(`🔴 No existe la extracción de '${SLUG}': ${decodeURIComponent(RUTA.pathname)}`)
  console.error(`   Sin extracción no hay universo, y sin universo no hay cobertura. Aborta.`)
  process.exit(1)
}
const base = JSON.parse(readFileSync(RUTA, "utf8"))
const variantes = base.variants ?? []
const N = variantes.length
if (N === 0) {
  console.error("🔴 La extracción no tiene variantes. Aborta.")
  process.exit(1)
}

/* ─────────── Contraste ─────────── */
const canal = (v) => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
const lum = (c) => 0.2126 * canal(c.r) + 0.7152 * canal(c.g) + 0.0722 * canal(c.b)
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100
}
const aRgb = (h) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
})
const aHex = (c) =>
  "#" + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase()

/* ─────────── Supernova: nombres y valores por mode ─────────── */
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find((d) => /later/i.test(d.name))
const version = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: version.id }
const tokens = await sdk.tokens.getTokens(ref)
const themes = await sdk.tokens.getTokenThemes(ref)
const colores = tokens.filter((t) => t.tokenType === "Color")
const resolver = (th) => {
  const m = new Map()
  for (const t of sdk.tokens.computeTokensByApplyingThemes(tokens, colores, [th])) m.set(t.id, t)
  return m
}
const L = resolver(themes.find((t) => t.codeName === "light"))
const D = resolver(themes.find((t) => t.codeName === "dark"))

// El puente: VariableID de Figma → token de Supernova.
const porVarId = new Map()
for (const t of tokens) if (t.origin?.id) porVarId.set(t.origin.id, t)

const valores = (t) => {
  const l = L.get(t.id)?.value?.color
  const d = D.get(t.id)?.value?.color
  return l && d ? { light: aHex(l), dark: aHex(d) } : null
}

const defectos = []
const add = (check, sev, donde, detalle) => defectos.push({ check, severidad: sev, donde, detalle })

/* ─────────── B0 · Frescura de la extracción contra Supernova ───────────
 * El 4 sep 2026 el Lead activó el sincronizado horario de Figma para
 * COMPONENTES (no para variables). Eso hace, por primera vez, que el
 * `updatedAt` del componente en Supernova pueda servir de señal de deriva:
 * si el componente cambió después de la extracción, `_base.json` está viejo
 * y nadie se entera — ni `uspec:origen`, que compara la caché contra
 * `spec-origen/`, no la extracción contra Figma.
 *
 * 🔴 PERO LA SEÑAL NO ESTÁ PROBADA, y por eso esto INFORMA y no bloquea.
 * En la primera corrida tras activar el auto-sync, el `updatedAt` del Button
 * marcaba el 19 de agosto — más viejo que la extracción del 3 de septiembre.
 * O el auto-sync todavía no había pasado, o no toca este campo.
 * **Un campo que no se ha visto moverse no prueba ausencia de cambio.**
 * Se promueve a bloqueante cuando se observe que avanza. */
let frescura = null
try {
  const comps = await sdk.components.getComponents(ref)
  const c = comps.find((x) => new RegExp(`^${SLUG}$`, "i").test(x.name ?? ""))
  if (c?.updatedAt && base._meta?.extractedAt) {
    const dSN = Date.parse(c.updatedAt), dEx = Date.parse(base._meta.extractedAt)
    frescura = {
      supernova: c.updatedAt,
      extraccion: base._meta.extractedAt,
      veredicto:
        dSN > dEx
          ? "🔴 Supernova tiene el componente MÁS NUEVO que la extracción: re-extrae antes de interpretar"
          : "⚪ Supernova no reporta cambios posteriores — pero ver la advertencia de señal no probada",
      senalProbada: false,
    }
    if (dSN > dEx) add("B0-extraccion-vieja", "alto", SLUG, `Supernova marca ${c.updatedAt} y la extracción es de ${base._meta.extractedAt}. El componente cambió después, así que la extracción describe otra cosa`)
  } else {
    frescura = { veredicto: "⚠️ No comparable: falta `updatedAt` en Supernova o `extractedAt` en la extracción", senalProbada: false }
  }
} catch (e) {
  frescura = { veredicto: `⚠️ No se pudo consultar Supernova: ${String(e.message).slice(0, 120)}`, senalProbada: false }
}

/* ─────────── B1 · Pintura sin variable ─────────── */
let b1Pinturas = 0
const crudas = new Map()
for (const v of variantes) {
  for (const p of v.colorWalk ?? []) {
    if (p.property === "drop shadow") continue // las sombras viven como estilo, no como variable
    b1Pinturas++
    if (!p.boundVariableId) {
      const k = `${p.property} de \`${p.path || v.name}\``
      crudas.set(k, (crudas.get(k) ?? 0) + 1)
    }
  }
}
for (const [k, n] of crudas) add("B1-pintura-cruda", "alto", k, `${n} apariciones con color literal, sin variable. No llega a código como token`)

/* ─────────── B2 · Geometría sin token ─────────── */
// El extractor es ciego al binding de las esquinas: `cornerRadius` se excluye y
// se declara, en vez de reportarse como defecto falso.
const CIEGO = new Set(["cornerRadius"])
const geomCrudas = new Map()
let b2Props = 0
for (const v of variantes) {
  for (const [prop, d] of Object.entries(v.dimensions ?? {})) {
    if (!d || typeof d !== "object" || !("token" in d)) continue
    if (typeof d.value !== "number") continue
    if (CIEGO.has(prop)) continue
    b2Props++
    if (d.token === null) {
      const k = `${prop} = ${d.value}`
      geomCrudas.set(k, (geomCrudas.get(k) ?? 0) + 1)
    }
  }
}
// `width`/`height` son el resultado del auto-layout, no una decisión: no son defecto.
const DERIVADAS = /^(width|height|counterAxisSpacing)/
for (const [k, n] of geomCrudas) {
  if (DERIVADAS.test(k)) continue
  add("B2-geometria-cruda", "alto", k, `${n} de ${N} variantes con valor crudo y sin token`)
}

/* ─────────── B3 · Semánticos consumidos, cruzados con foundations ─────────── */
const consumidos = new Map()
for (const v of variantes) {
  for (const p of v.colorWalk ?? []) {
    if (!p.boundVariableId) continue
    const t = porVarId.get(p.boundVariableId)
    if (!t) {
      add("B3-token-desconocido", "alto", p.boundVariableId, `bindeado en \`${p.path || v.name}\` pero no existe en Supernova`)
      continue
    }
    const n = t.origin?.name ?? t.name
    consumidos.set(n, (consumidos.get(n) ?? 0) + 1)
  }
}
// Un semántico que no invierte y no lleva `Static` es el defecto C1 de foundations.
for (const [n, usos] of consumidos) {
  const t = colores.find((x) => (x.origin?.name ?? x.name) === n)
  const val = t && valores(t)
  if (!val) continue
  if (val.light === val.dark && !/Static$/.test(n)) {
    add("B3-semantico-roto", "alto", n, `el componente lo usa ${usos}×, y no invierte (${val.light} en ambos modes) sin llevar \`Static\` — defecto C1 de \`docs:foundations\``)
  }
}

/* ─────────── B4 · Pares REALES fondo/texto e icono, por variante y por mode ─────────── */
// Esto es lo que `docs:foundations` declara NO CUBIERTO: ahí el par se inventa
// desde un emparejamiento canónico; aquí sale de la variante que existe.
let b4Pares = 0
const b4NoMedibles = []
const b4Fallos = new Map()
for (const v of variantes) {
  const paints = (v.colorWalk ?? []).filter((p) => p.property !== "drop shadow")
  const fondo = paints.find((p) => p.property === "fill" && !p.path)
  if (!fondo) {
    b4NoMedibles.push(`${v.name}: sin relleno propio (borde o fantasma) — el par depende de la superficie de la página`)
    continue
  }
  const tf = fondo.boundVariableId && porVarId.get(fondo.boundVariableId)
  const vf = tf && valores(tf)
  if (!vf) {
    b4NoMedibles.push(`${v.name}: el relleno no resuelve a un token de Supernova`)
    continue
  }
  for (const p of paints) {
    if (!p.path) continue
    const esTexto = p.property === "text fill"
    const min = esTexto ? 4.5 : 3.0
    const tp = p.boundVariableId && porVarId.get(p.boundVariableId)
    const vp = tp && valores(tp)
    if (!vp) continue
    for (const modo of ["light", "dark"]) {
      b4Pares++
      const r = ratio(aRgb(vp[modo]), aRgb(vf[modo]))
      if (r < min) {
        const clave = `${tp.origin?.name ?? tp.name} sobre ${tf.origin?.name ?? tf.name} · ${modo === "light" ? "Light" : "Dark"} · ${r}:1 (min ${min})`
        b4Fallos.set(clave, (b4Fallos.get(clave) ?? 0) + 1)
      }
    }
  }
}
for (const [k, n] of b4Fallos) {
  const r = parseFloat(k.match(/· ([\d.]+):1/)[1])
  // Misma exención que en `docs:foundations`, y por coherencia se aplica igual:
  // WCAG 1.4.3 y 1.4.11 EXIMEN a los componentes inactivos. Un `disabled` bajo
  // el mínimo se reporta para que se vea, no para bloquear. Que un botón
  // deshabilitado sea demasiado tenue sigue siendo decisión de diseño abierta
  // (tarea 4.13, `background/disabled` a 1.30:1 contra el lienzo).
  const exento = /disabled|placeholder/i.test(k)
  add(
    "B4-contraste-real",
    exento ? "informativo" : r < 3 ? "crítico" : "alto",
    k.split(" · ")[0],
    `${k.split(" · ").slice(1).join(" · ")} — en ${n} variante(s)${exento ? " · **exento**: WCAG exime componentes inactivos. Visible, no bloqueante" : ""}`,
  )
}

/* ─────────── B5 · Tokens de componente ─────────── */
// Acuerdo del Lead: un componente nace con sus propios tokens, apuntando a los
// semánticos. Hoy el Button consume semánticos directos, así que cualquier
// corrección de un semántico se propaga sin control a todo lo que lo comparta.
const deComponente = [...consumidos.keys()].filter((n) => new RegExp(`^${SLUG}/`, "i").test(n))
if (deComponente.length === 0) {
  add(
    "B5-tokens-de-componente",
    "alto",
    SLUG,
    `cero tokens de componente. Consume ${consumidos.size} semánticos directos, así que no hay capa donde absorber una corrección sin arrastrar a todo lo que comparta ese semántico`,
  )
}

/* ─────────── Informe ─────────── */
const extraido = base._meta?.extractedAt ?? "desconocido"
const dias = extraido === "desconocido" ? null : Math.floor((Date.now() - Date.parse(extraido)) / 86400000)

const cobertura = [
  { id: "B1-pintura-cruda", que: "Pinturas (fill, stroke, text fill) con variable enlazada", n: b1Pinturas, N: b1Pinturas },
  { id: "B2-geometria-cruda", que: "Propiedades dimensionales con token", n: b2Props, N: b2Props },
  { id: "B3-semantico-roto", que: "Semánticos consumidos, cruzados con los defectos de foundations", n: consumidos.size, N: consumidos.size },
  { id: "B4-contraste-real", que: "Pares reales primer-plano/relleno del propio componente × 2 modes", n: b4Pares, N: b4Pares },
  { id: "B5-tokens-de-componente", que: "Existencia de capa de tokens de componente", n: 1, N: 1 },
]

const noCubierto = [
  `\`cornerRadius\` — **el extractor uSpec es ciego al binding de las esquinas**: emite \`token: null\` en las ${N} aunque estén bindeadas (verificado en vivo el 3 sep 2026, 60 de 60 a \`radius/l\`). Se excluye de B2 a propósito. **Comprobarlo exige Figma en vivo, no esta extracción.**`,
  `**Estados que no existen en Figma** — \`isLoading\` se decidió el 31 ago y no tiene variante. Un estado ausente no es medible desde la extracción.`,
  `**Motion, comportamiento y responsive** — no salen de Figma. Son los slots humanos del \`.md\`, y su done es editorial, no mecánico.`,
  `**Contraste contra la superficie de la página** — las variantes sin relleno propio (${b4NoMedibles.length}) dependen de dónde se coloque el botón. Listadas abajo, no omitidas.`,
  `**Accesibilidad no cromática** — foco visible real, orden de tabulación, nombre accesible. No es medible desde geometría ni color.`,
]

const orden = { crítico: 0, alto: 1, medio: 2, informativo: 3 }
defectos.sort((a, b) => orden[a.severidad] - orden[b.severidad] || a.check.localeCompare(b.check))
const bloqueantes = defectos.filter((d) => d.severidad === "crítico" || d.severidad === "alto")

if (JSON_OUT) {
  console.log(JSON.stringify({ slug: SLUG, extraido, frescura, N, cobertura, noCubierto, defectos, consumidos: [...consumidos] }, null, 2))
} else {
  const md = []
  const p = (s = "") => (MD_OUT ? md.push(s) : console.log(s))
  p(`# Defectos de componente — \`${SLUG}\``)
  p()
  p(`**Corrida:** ${new Date().toISOString().slice(0, 16).replace("T", " ")} · **Variantes:** ${N}`)
  p(`**Extracción leída:** ${extraido}${dias !== null ? ` (hace ${dias} día${dias === 1 ? "" : "s"})` : ""}`)
  if (frescura) {
    p(`**Frescura contra Supernova:** ${frescura.veredicto}`)
    p(`> ⚠️ **Señal no probada.** El sincronizado horario de Figma cubre componentes, no variables. *No se ha observado que \`updatedAt\` avance con él*, así que este check **informa y no bloquea**. Se promueve a bloqueante el día que se vea moverse.`)
    p()
  }
  p(dias !== null && dias > 3 ? `> ⚠️ **La extracción tiene ${dias} días.** Esto audita el componente de esa fecha, no el de hoy. Re-extrae antes de declarar nada cerrado.` : `> 🟢 Extracción reciente.`)
  p()
  p(`## Cobertura declarada`)
  p()
  p(`| Check | Qué comprueba | Cobertura |`)
  p(`| --- | --- | --- |`)
  for (const c of cobertura) p(`| \`${c.id}\` | ${c.que} | **${c.n} de ${c.N}** ${c.n === c.N ? "✅" : "⚠️"} |`)
  p()
  p(`### Lo que este método NO puede encontrar`)
  p()
  for (const l of noCubierto) p(`- ${l}`)
  if (b4NoMedibles.length) {
    p()
    p(`<details><summary>Las ${b4NoMedibles.length} variantes sin relleno propio</summary>`)
    p()
    for (const l of b4NoMedibles) p(`- ${l}`)
    p()
    p(`</details>`)
  }
  p()
  p(`## Defectos: ${defectos.length} (${bloqueantes.length} bloqueantes)`)
  p()
  p(`| Sev | Check | Dónde | Detalle |`)
  p(`| --- | --- | --- | --- |`)
  for (const d of defectos) {
    const i = { crítico: "🔴", alto: "🟠", medio: "🟡", informativo: "⚪" }[d.severidad]
    p(`| ${i} | \`${d.check}\` | \`${d.donde}\` | ${d.detalle} |`)
  }
  p()
  p(`## Semánticos que consume (${consumidos.size})`)
  p()
  p([...consumidos].sort((a, b) => b[1] - a[1]).map(([n, c]) => `\`${n}\` (${c})`).join(" · "))
  if (MD_OUT) {
    const destino = new URL(`../2. Proyecto/Diagnóstico/defectos-componente-${SLUG}.md`, import.meta.url)
    writeFileSync(destino, md.join("\n") + "\n")
    console.log(`Informe escrito: ${decodeURIComponent(destino.pathname)}`)
  }
}

if (bloqueantes.length) {
  console.error(`\n🔴 ${bloqueantes.length} defectos bloqueantes en '${SLUG}'. El componente NO está cerrado: no se documenta.`)
  process.exit(1)
}
console.log(`\n🟢 '${SLUG}' sin defectos bloqueantes de componente.`)
