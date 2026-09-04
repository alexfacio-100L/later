/**
 * auditar-foundations.mjs — El barrido completo de defectos de la capa de color.
 *
 * POR QUÉ EXISTE
 * --------------
 * La "auditoría de foundations" que este proyecto daba por cerrada revisó los
 * tokens que el Button consume, no el conjunto. Eso es la forma «falso completo»
 * de la regla 16 de CLAUDE.md: un método que resuelve una fracción y entrega el
 * resultado con la forma correcta, sin hueco visible. Se descubrió el 3 sep 2026
 * al ver que `border/secondary` vale #FFFFFF en Light y en Dark, sobre un
 * `background/secondary` que también es #FFFFFF en Light: contraste 1.00.
 *
 * OBLIGACIÓN DE COBERTURA
 * -----------------------
 * Cada comprobación declara `n de N` sobre el universo entero, y lo que no puede
 * comprobar lo declara como NO CUBIERTO en vez de dejarlo fuera en silencio.
 * Sale con código 1 si hay defectos, para que no dependa de que alguien lea.
 *
 * USO
 * ---
 *   npm run docs:foundations             # informe a stdout, salida 1 si hay defectos
 *   npm run docs:foundations -- --json   # informe en JSON
 *   npm run docs:foundations -- --md     # informe en Markdown (para volcar al repo)
 *
 * LÍMITE DE INSTRUMENTO, declarado
 * --------------------------------
 * Lee Supernova, no Figma. El source `FigmaVariablesPlugin` está en `hasError`
 * desde el 27 ago 2026, así que un cambio hecho en Figma después de esa fecha
 * puede no estar aquí. Este auditor lo comprueba y lo dice en la cabecera.
 */

import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { writeFileSync } from "node:fs"

const { Supernova } = sdkPkg
const ARGS = process.argv.slice(2)
const JSON_OUT = ARGS.includes("--json")
const MD_OUT = ARGS.includes("--md")
const SIN_USO = ARGS.includes("--sin-uso") // salta el barrido de huérfanos (197 llamadas)

/* ─────────────────────────── Color y contraste ─────────────────────────── */

const hex = (c) =>
  "#" + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase()

const canal = (v) => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
const luminancia = (c) => 0.2126 * canal(c.r) + 0.7152 * canal(c.g) + 0.0722 * canal(c.b)
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
const r2 = (n) => Math.round(n * 100) / 100

/* ─────────────────────────── Conexión ─────────────────────────── */

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find((d) => /later/i.test(d.name))
if (!ds) {
  console.error("🔴 No se encontró el design system 'Later'. Aborta: sin universo no hay cobertura.")
  process.exit(1)
}
const version = await sdk.versions.getActiveVersion(ds.id)
const ref = { designSystemId: ds.id, versionId: version.id }

const tokens = await sdk.tokens.getTokens(ref)
const themes = await sdk.tokens.getTokenThemes(ref)
const componentesEnSistema = await sdk.components.getComponents(ref).then((c) => c.length).catch(() => 0)
const light = themes.find((t) => t.codeName === "light")
const dark = themes.find((t) => t.codeName === "dark")
if (!light || !dark) {
  console.error("🔴 Faltan los temas light/dark. Aborta: la comprobación de inversión sería falsa.")
  process.exit(1)
}

// Frescura de la fuente: si el import de Figma está roto, lo que sigue puede estar viejo.
let fuente = { estado: "no verificable", detalle: "" }
try {
  const sources = await sdk.sources.getSources(ref)
  const plugin = sources.find((s) => /FigmaVariablesPlugin/i.test(s.type ?? s.name ?? ""))
  if (plugin) {
    fuente = {
      estado: plugin.hasError ? "🔴 hasError: true" : "🟢 sana",
      detalle: `último import: ${plugin.lastImportedAt ?? plugin.updatedAt ?? "desconocido"}`,
    }
  }
} catch {
  fuente = { estado: "⚠️ no verificable", detalle: "el SDK no devolvió los sources en esta corrida" }
}

/* ─────────────────────────── Universo ─────────────────────────── */

const COL_SEMANTICOS = "8273386a-4a2e-4160-85f6-e7660d95f553"
const COL_PRIMITIVOS = "43238e37-7010-4234-aef1-7a6e1faf6878"

const colores = tokens.filter((t) => t.tokenType === "Color")
const nombre = (t) => t.origin?.name ?? t.name

const semanticos = colores.filter((t) => t.collectionId === COL_SEMANTICOS)
const primitivos = colores.filter((t) => t.collectionId === COL_PRIMITIVOS)
const sinColeccion = colores.filter((t) => t.collectionId !== COL_SEMANTICOS && t.collectionId !== COL_PRIMITIVOS)

const N_SEM = semanticos.length
const N_PRIM = primitivos.length

// Resolución por tema. computeTokensByApplyingThemes devuelve el valor literal.
const resolver = (theme) => {
  const out = new Map()
  for (const t of sdk.tokens.computeTokensByApplyingThemes(tokens, colores, [theme])) {
    out.set(t.id, t)
  }
  return out
}
const L = resolver(light)
const D = resolver(dark)

const valorDe = (mapa, t) => {
  const r = mapa.get(t.id)
  if (!r?.value?.color) return null
  return {
    hex: hex(r.value.color),
    alfa: r.value.opacity?.measure ?? 1,
    alias: r.value.referencedTokenId ?? null,
    rgb: { r: r.value.color.r, g: r.value.color.g, b: r.value.color.b },
  }
}

// Índice resuelto: un solo objeto por token, con sus dos modos.
const idx = []
const noResueltos = []
for (const t of semanticos) {
  const l = valorDe(L, t)
  const d = valorDe(D, t)
  if (!l || !d) {
    noResueltos.push(nombre(t))
    continue
  }
  const n = nombre(t)
  idx.push({
    id: t.id,
    idInVersion: t.idInVersion,
    nombre: n,
    familia: n.split("/")[0],
    esStatic: /Static$/.test(n),
    light: l,
    dark: d,
    opaco: l.alfa === 1 && d.alfa === 1,
  })
}

const defectos = []
const add = (check, severidad, token, detalle) => defectos.push({ check, severidad, token, detalle })

/* ───────────────── C1 · Inversión: el detector de la convención Static ─────────────────
 * Regla del sistema (13-convencion-naming.md, §9): un token que NO cambia entre
 * modes lleva sufijo `Static`. La convención es, por tanto, una prueba ejecutable
 * en las dos direcciones. */

// 🔴 EXCEPCIÓN DE CATEGORÍA, y arreglarla quitó 13 falsos positivos.
// La convención `Static` se escribió para SUPERFICIES y PRIMEROS PLANOS: cosas
// que se dibujan una sobre otra y cuyo par hay que juzgar. Un TINTE DE SOMBRA
// no es ninguna de las dos: no se posa sobre nada, es el color de un efecto.
// Exigirle que invierta o que lleve `Static` es aplicarle una regla de otra
// familia — y eso marcaba los 13 `shadow/*` como defecto, incluido el que más
// bloqueaba al Button (42 usos).
// ⚠️ Lo que SÍ es pregunta abierta, y es de DISEÑO, no de token: si la
// elevación debe seguir leyéndose en Dark. Un tinte #0E1F35 sobre un lienzo
// negro no se ve. Eso lo decide el Lead; no lo decide este check.
const TINTE = /^(shadow|shadowTint)\//
let c1n = 0
const c1Exentos = []
for (const t of idx) {
  c1n++
  if (TINTE.test(t.nombre)) { c1Exentos.push(t.nombre); continue }
  const igual = t.light.hex === t.dark.hex && t.light.alfa === t.dark.alfa
  if (igual && !t.esStatic) {
    add("C1-inversion", "alto", t.nombre, `no invierte (${t.light.hex} en ambos modes) y no lleva sufijo Static`)
  }
  if (!igual && t.esStatic) {
    add("C1-inversion", "alto", t.nombre, `lleva Static pero SÍ cambia (${t.light.hex} → ${t.dark.hex})`)
  }
}

/* ───────────────── C2 · Contraste token/superficie ─────────────────
 *
 * ⚠️ EL FILTRO ES LA MITAD DEL CHECK, y es donde falló el barrido del 18 ago.
 * Medir cada primer plano contra cada fondo produce cientos de pares que no
 * existen: `text/primaryInverse` sobre `background/primary` no es un defecto,
 * es un uso que nadie hará. Un listado con 188 falsos positivos no se actúa.
 *
 * El emparejamiento se hace por ROL, en dos grupos declarados:
 *   · LIENZO   — las superficies neutras. Reciben el primer plano normal.
 *   · RELLENO  — fondos con color propio o invertidos. Reciben los `*Inverse*`
 *                y los `on*`, que existen precisamente para eso.
 *
 * Y el umbral se fija por lo que el token SIGNIFICA, no por su familia:
 *   · texto                        → 4.5  (WCAG 2.2 AA, 1.4.3)
 *   · icono y borde INFORMATIVO    → 3.0  (1.4.11 — focus, selected, estados)
 *   · borde ESTRUCTURAL            → 1.5  (no lo exige WCAG; por debajo el
 *                                          control desaparece, que es peor que
 *                                          incumplir: es el fallo de border/secondary)
 * La clasificación estructural/informativo es criterio de esta casa y va escrita
 * abajo para que se pueda discutir, no escondida en el código. */

const LIENZO = ["background/primary", "background/secondary", "background/subtle"]
const RELLENO = [
  "background/inverse", "background/inverseStatic", "background/systemStatic",
  "background/mono", "background/brandMain", "background/selected",
  "background/negative", "background/positive", "background/warning",
  "background/info", "background/offer", "background/accent",
]
// Bordes que sólo separan o encuadran. El resto de `border/*` comunica estado.
const BORDE_ESTRUCTURAL = ["border/primary", "border/secondary", "border/subtle", "border/inverse", "border/mono"]

const esInverso = (n) => /Inverse/i.test(n) || /^text\/on/.test(n)
const buscar = (ns) => ns.map((n) => idx.find((t) => t.nombre === n)).filter(Boolean)
const lienzo = buscar(LIENZO)
const relleno = buscar(RELLENO)
const superficiesFaltantes = [...LIENZO, ...RELLENO].filter((n) => !idx.some((t) => t.nombre === n))

const minimoDe = (t) => {
  if (t.familia === "text") return { min: 4.5, regla: "WCAG 1.4.3 AA" }
  if (t.familia === "icon") return { min: 3.0, regla: "WCAG 1.4.11" }
  if (t.familia === "border")
    return BORDE_ESTRUCTURAL.includes(t.nombre)
      ? { min: 1.5, regla: "perceptibilidad — criterio de casa, no WCAG" }
      : { min: 3.0, regla: "WCAG 1.4.11" }
  return null
}

const primerPlano = idx.filter((t) => minimoDe(t) !== null)
let c2paresMedidos = 0
let c2paresPosibles = 0
const c2NoMedibles = []

for (const t of primerPlano) {
  const { min, regla } = minimoDe(t)
  if (!t.opaco) {
    c2NoMedibles.push(`${t.nombre} (alfa ${t.light.alfa}/${t.dark.alfa}: el ratio depende de lo que haya debajo)`)
    continue
  }
  const contra = esInverso(t.nombre) ? relleno : lienzo
  for (const s of contra) {
    for (const modo of ["light", "dark"]) {
      if (!s[modo] || s[modo].alfa !== 1) continue
      c2paresPosibles++
      c2paresMedidos++
      const ratio = r2(contraste(t[modo].rgb, s[modo].rgb))
      if (ratio < min) {
        // Un borde estructural por debajo del umbral incumple criterio de casa,
        // no WCAG: es `medio`. Salvo que sea indistinguible (≤1.05), que es peor
        // que incumplir — el control deja de existir. Ese es border/secondary.
        const estructural = t.familia === "border" && BORDE_ESTRUCTURAL.includes(t.nombre)
        // WCAG 1.4.3 y 1.4.11 EXIMEN a los componentes inactivos. Un `disabled`
        // por debajo del mínimo no es incumplimiento; se reporta para que se vea,
        // no para bloquear. Es exención del estándar, no criterio nuestro.
        const exento = /disabled|placeholder/i.test(t.nombre)
        const sev = exento
          ? "informativo"
          : estructural
            ? ratio <= 1.05
              ? "crítico"
              : "medio"
            : ratio < 1.5
              ? "crítico"
              : "alto"
        add(
          "C2-contraste",
          sev,
          t.nombre,
          `${ratio}:1 sobre \`${s.nombre}\` en **${modo === "light" ? "Light" : "Dark"}** — mínimo ${min} (${regla})${exento ? " · **exento**: WCAG exime componentes inactivos" : ""}`,
        )
      }
    }
  }
}

/* ───────────────── C2b · Emparejamiento por comportamiento de mode ─────────────────
 * Doctrina ya registrada (DECISIONS.md, 21 ago; `design-tokens` › Layer 3):
 * un token que invierte con el mode no puede ir sobre un fondo que no invierte.
 * En Light casa por casualidad; en Dark se rompe. Es independiente del ratio:
 * un par puede pasar hoy en los dos modes y seguir siendo frágil por construcción.
 * Este check NO mide contraste — mide si el par es sostenible. */

// Se agrega POR TOKEN, no por par: 105 filas «X frágil con Y» son el mismo
// defecto contado muchas veces, y un listado que no se puede actuar no sirve.
let c2bPares = 0
for (const t of primerPlano) {
  const contra = esInverso(t.nombre) ? relleno : lienzo
  const fgInvierte = t.light.hex !== t.dark.hex
  const chocan = []
  for (const s of contra) {
    c2bPares++
    if (fgInvierte !== (s.light.hex !== s.dark.hex)) chocan.push(s.nombre)
  }
  if (chocan.length === 0) continue
  add(
    "C2b-emparejamiento",
    "informativo",
    t.nombre,
    `${fgInvierte ? "invierte" : "NO invierte"} y choca con ${chocan.length} de ${contra.length} superficies de su grupo, que ${fgInvierte ? "no invierten" : "sí invierten"}: ${chocan.join(", ")}`,
  )
}

/* ───────────────── C3 · Valor crudo en capa semántica ─────────────────
 * Un semántico debería aliasar a un primitivo. Un valor crudo es legítimo sólo
 * cuando el valor ES la decisión (un scrim con alfa que no existe como
 * primitivo) — por eso se separa en dos listas, no se mezcla. */

let c3n = 0
for (const t of idx) {
  c3n++
  const crudoL = !t.light.alias
  const crudoD = !t.dark.alias
  if (crudoL || crudoD) {
    const justificado = !t.opaco // alfa < 1: no existe como primitivo
    add(
      "C3-crudo",
      justificado ? "informativo" : "medio",
      t.nombre,
      justificado
        ? `valor crudo con alfa ${t.light.alfa}/${t.dark.alfa} — legítimo: el valor es la decisión`
        : `valor crudo opaco sin alias${crudoL && crudoD ? " en ambos modes" : crudoL ? " en Light" : " en Dark"} (${t.light.hex}/${t.dark.hex})`,
    )
  }
}

/* ───────────────── C4 · Duplicados en valor ─────────────────
 * "Alias, nunca dupliques" (design-tokens). Dos semánticos con el mismo par
 * Light/Dark son dos nombres para una decisión: o uno sobra, o uno miente. */

const porValor = new Map()
for (const t of idx) {
  const clave = `${t.light.hex}@${t.light.alfa}|${t.dark.hex}@${t.dark.alfa}`
  ;(porValor.get(clave) ?? porValor.set(clave, []).get(clave)).push(t)
}
for (const [clave, grupo] of porValor) {
  if (grupo.length < 2) continue
  // Mismo rol distinto nombre es sospechoso; familias distintas puede ser legítimo.
  const familias = new Set(grupo.map((t) => t.familia))
  for (const fam of familias) {
    const mismos = grupo.filter((t) => t.familia === fam)
    if (mismos.length < 2) continue
    add(
      "C4-duplicado",
      "medio",
      mismos.map((t) => t.nombre).join(" ≡ "),
      `mismo valor en ambos modes (${clave.replace("|", " / ")}) dentro de la misma familia`,
    )
  }
}

// Y los primitivos duplicados, que son la causa raíz de los duplicados semánticos.
const primPorValor = new Map()
let c4prim = 0
for (const t of primitivos) {
  const v = valorDe(L, t)
  if (!v) continue
  c4prim++
  ;(primPorValor.get(v.hex) ?? primPorValor.set(v.hex, []).get(v.hex)).push(nombre(t))
}
for (const [h, grupo] of primPorValor) {
  if (grupo.length < 2) continue
  add("C4-duplicado", "medio", grupo.join(" ≡ "), `primitivos con el mismo valor ${h}`)
}

/* ───────────────── C5 · Huérfanos ─────────────────
 * Un primitivo sin consumidores es peso muerto — pero "cero referencias" caduca:
 * corregir contraste consiste precisamente en reapuntar semánticos a primitivos
 * hasta entonces sin usar (DECISIONS.md, 14 ago). Por eso es informativo. */

let c5n = 0
const huerfanos = []
if (!SIN_USO) {
  const lote = 12
  for (let i = 0; i < primitivos.length; i += lote) {
    const parte = primitivos.slice(i, i + lote)
    const usos = await Promise.all(
      parte.map((t) =>
        sdk.tokens
          .getTokenUsage(ref, t.idInVersion)
          .then((u) => ({ t, u }))
          .catch(() => ({ t, u: null })),
      ),
    )
    for (const { t, u } of usos) {
      if (!u) continue // no contabiliza: no se pudo comprobar
      c5n++
      // ⚠️ Las claves son `tokens` / `components` / `documentationPages`.
      // La primera versión leyó `tokenIds` y devolvió 84 huérfanos de 84 —
      // un cero por clave inexistente se lee igual que un cero real.
      for (const k of ["tokens", "components", "documentationPages"]) {
        if (!(k in u)) {
          console.error(`🔴 getTokenUsage no devuelve la clave '${k}'. Aborta C5: contar sobre una clave que no existe da cero siempre.`)
          process.exit(2)
        }
      }
      const total = u.tokens.length + u.components.length + u.documentationPages.length
      if (total === 0) huerfanos.push(nombre(t))
    }
  }
  for (const h of huerfanos) add("C5-huerfano", "informativo", h, "ningún otro token lo aliasa. NO significa «sin usar»: el consumo desde Figma no es visible desde aquí")
}

/* ───────────────── Informe ─────────────────
 * Cada línea `n de N`. Donde n < N, la razón, explícita. */

const cobertura = [
  {
    id: "C1-inversion",
    que: "Inversión por mode contra la convención Static, en las dos direcciones",
    n: c1n,
    N: N_SEM,
    nota: [
      noResueltos.length ? `${noResueltos.length} sin valor resoluble: ${noResueltos.join(", ")}.` : "",
      c1Exentos.length ? `⚪ **${c1Exentos.length} tintes de sombra exentos por categoría** (\`shadow/*\`): un tinte no es superficie ni primer plano, y la convención \`Static\` se escribió para esos. **Lo que sí queda abierto, y es decisión de diseño: si la elevación debe leerse en Dark.**` : "",
    ].filter(Boolean).join(" "),
  },
  {
    id: "C2-contraste",
    que: `Ratio de cada par primer-plano/superficie emparejado por rol, en los dos modes`,
    n: c2paresMedidos,
    N: c2paresPosibles,
    nota: [
      `Universo de primer plano: **${primerPlano.length} de ${N_SEM}** semánticos (text · icon · border).`,
      `Lienzo (${lienzo.length}): ${lienzo.map((s) => s.nombre).join(", ")}. Relleno (${relleno.length}): ${relleno.map((s) => s.nombre).join(", ")}.`,
      `Emparejamiento: los \`*Inverse*\` y \`text/on*\` se miden contra Relleno; el resto contra Lienzo. **Medir todos contra todo produce cientos de pares que nadie usará** — es lo que hace inútil un listado.`,
      `Umbrales: texto 4.5 · icono y borde informativo 3.0 · borde estructural 1.5. Estructurales (criterio de casa, discutible): ${BORDE_ESTRUCTURAL.join(", ")}.`,
      superficiesFaltantes.length ? `⚠️ Declaradas y no existentes en el sistema, por tanto no medidas: ${superficiesFaltantes.join(", ")}.` : "",
      c2NoMedibles.length ? `🔴 NO CUBIERTO — ${c2NoMedibles.length} tokens translúcidos: ${c2NoMedibles.join("; ")}.` : "",
      `🔴 NO CUBIERTO — el par REAL de cada componente. Esto mide contra el emparejamiento canónico, no contra dónde el token se usa de verdad; para eso hay que recorrer Figma.`,
      `🔴 NO CUBIERTO — WCAG 1.4.1 (información sólo por color). No es medible desde el valor de un token.`,
    ]
      .filter(Boolean)
      .join(" "),
  },
  {
    id: "C2b-emparejamiento",
    que: "Pares donde uno de los dos invierte con el mode y el otro no",
    n: c2bPares,
    N: c2bPares,
    nota: "No mide ratio: mide si el par es sostenible. Un par puede pasar hoy en los dos modes y romperse en cuanto cambie cualquiera de los dos primitivos. Doctrina en `design-tokens` › Layer 3.",
  },
  { id: "C3-crudo", que: "Semánticos con valor crudo en vez de alias", n: c3n, N: N_SEM, nota: "" },
  {
    id: "C4-duplicado",
    que: "Duplicados en valor: semánticos entre sí y primitivos entre sí",
    n: idx.length + c4prim,
    N: N_SEM + N_PRIM,
    nota: "Compara valor resuelto, no alias: dos alias distintos al mismo hex cuentan como duplicado.",
  },
  {
    id: "C5-huerfano",
    que: "Primitivos que ningún otro **token** aliasa (no equivale a «sin usar» — ver nota)",
    n: SIN_USO ? 0 : c5n,
    N: N_PRIM,
    nota: SIN_USO
      ? "🔴 SALTADO por --sin-uso."
      : `🔴 LÍMITE DEL INSTRUMENTO, verificado, no supuesto: \`getTokenUsage\` devuelve \`components: []\` para TODOS los tokens, incluido \`background/primary\`, porque Supernova sólo conoce ${componentesEnSistema} componente(s) — el consumo real vive en Figma. Por tanto esto detecta «ningún otro TOKEN lo aliasa», no «nadie lo usa». Un primitivo que sólo consuma una capa de Figma sale aquí como huérfano y no lo es. Y «cero referencias» caduca: un primitivo muerto revive al corregir contraste (DECISIONS.md, 14 ago).`,
  },
]

const noCubiertoGlobal = [
  `Los ${sinColeccion.length} tokens de color sin colección (${[...new Set(sinColeccion.map((t) => nombre(t).split("/")[0]))].join(", ")}) quedan fuera del universo: llegan como *estilos* de Figma, no como variables, y no tienen modes que comparar.`,
  `Las capas Dimension, Space, BorderWidth, BorderRadius y Typography NO se auditan aquí. El hallazgo del grosor del Button (width/xs · width/s · width/m existían y no se usaban) es un defecto de USO en el componente, no de la capa de tokens: se detecta recorriendo Figma, no Supernova.`,
  `Este auditor lee Supernova. Fuente FigmaVariablesPlugin: ${fuente.estado}. ${fuente.detalle}`,
]

const orden = { crítico: 0, alto: 1, medio: 2, informativo: 3 }
defectos.sort((a, b) => orden[a.severidad] - orden[b.severidad] || a.check.localeCompare(b.check) || a.token.localeCompare(b.token))
const bloqueantes = defectos.filter((d) => d.severidad === "crítico" || d.severidad === "alto")

if (JSON_OUT) {
  console.log(JSON.stringify({ ds: ds.name, version: version.id, fuente, cobertura, noCubiertoGlobal, defectos }, null, 2))
} else {
  const md = []
  const p = (s = "") => (MD_OUT ? md.push(s) : console.log(s))

  p(`# Defectos de foundations — capa de color`)
  p()
  p(`**Corrida:** ${new Date().toISOString().slice(0, 16).replace("T", " ")} · **Sistema:** ${ds.name} · **Versión:** ${version.id}`)
  p(`**Fuente Figma:** ${fuente.estado} — ${fuente.detalle}`)
  p()
  p(`## Cobertura declarada`)
  p()
  p(`| Check | Qué comprueba | Cobertura |`)
  p(`| --- | --- | --- |`)
  for (const c of cobertura) {
    const total = c.n === c.N ? `**${c.n} de ${c.N}** ✅` : `**${c.n} de ${c.N}** ⚠️`
    p(`| \`${c.id}\` | ${c.que} | ${total} |`)
  }
  p()
  for (const c of cobertura) if (c.nota) p(`- **\`${c.id}\`** — ${c.nota}`)
  p()
  p(`### Lo que este método NO puede encontrar`)
  p()
  for (const l of noCubiertoGlobal) p(`- ${l}`)
  p()
  p(`## Defectos: ${defectos.length} (${bloqueantes.length} bloqueantes)`)
  p()
  p(`| Sev | Check | Token | Detalle |`)
  p(`| --- | --- | --- | --- |`)
  for (const d of defectos) {
    const icono = { crítico: "🔴", alto: "🟠", medio: "🟡", informativo: "⚪" }[d.severidad]
    p(`| ${icono} | \`${d.check}\` | \`${d.token}\` | ${d.detalle} |`)
  }
  if (MD_OUT) {
    const destino = new URL("../../2. Proyecto/Diagnóstico/defectos-foundations.md", import.meta.url)
    writeFileSync(destino, md.join("\n") + "\n")
    console.log(`Informe escrito: ${decodeURIComponent(destino.pathname)}`)
  }
}

if (bloqueantes.length > 0) {
  console.error(`\n🔴 ${bloqueantes.length} defectos bloqueantes de foundations. No se documenta encima de esto.`)
  process.exit(1)
}
console.log(`\n🟢 Sin defectos bloqueantes en la capa de color.`)
