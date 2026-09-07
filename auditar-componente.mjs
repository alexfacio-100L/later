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
 *   B0 · Frescura por timestamp       — INFORMATIVO. El sello se mueve por
 *                                       pushes de variables y por el auto-sync,
 *                                       así que no prueba deriva del componente
 *   B0b· Extracción incoherente        — BLOQUEANTE. El mismo rol ligado a dos
 *                                       tokens distintos: el árbol se capturó a
 *                                       medio camino. Mira contenido, no relojes
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

/* ─────────── La cadena de alias ───────────
 * 🔴 POR QUÉ EXISTE, y nació de un falso positivo propio el 7 sep 2026.
 * Al abrir la capa de tokens de componente, `B3` marcó como rotos los tres
 * `secondaryPressed` — que aliasan a `background/selected`,
 * `text/primaryInverseStatic` e `icon/inverseStatic`, los tres dictaminados
 * CORRECTOS dos días antes por el corolario Static.
 *
 * La causa: `B3` juzgaba por el NOMBRE (`/Static$/`, `/^background\//`) y el
 * nombre cambió de sitio al nacer la capa. Una guarda que no sigue al dato
 * cuando el dato se mueve — el mismo patrón que `B2` midiendo sobre una
 * fuente ciega.
 *
 * La regla: un token de componente que aliasa a un semántico HEREDA lo que
 * ese semántico sea. Si el semántico está exento, hereda la exención; si
 * está roto, hereda el defecto — y se dice con la cadena entera delante. */
const porTokenId = new Map(tokens.map((t) => [t.id, t]))
const nombreDe = (t) => t.origin?.name ?? t.name
const cadenaDe = (t) => {
  const out = []
  const vistos = new Set()
  let cur = t
  while (cur && !vistos.has(cur.id)) {
    vistos.add(cur.id)
    out.push(nombreDe(cur))
    const sig = cur.value?.referencedTokenId
    cur = sig ? porTokenId.get(sig) : null
  }
  return out
}
const pintaCadena = (c) => c.join(" → ")
// ¿Algún eslabón de la cadena cumple el patrón? Es lo que hereda un alias.
const enCadena = (t, re) => cadenaDe(t).some((n) => re.test(n))

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
 * 🔴 LA SEÑAL YA SE VIO MOVER — Y RESULTÓ NO SERVIR. NO SE PROMUEVE.
 * La versión anterior decía «se promueve a bloqueante cuando se observe que
 * avanza». Avanzó el 7 sep 2026 y el resultado fue un FALSO POSITIVO: el
 * `updatedAt` del Button saltó a las 15:39 por un PUSH DE VARIABLES, no por
 * una edición del componente. La extracción de las 11:58 seguía describiendo
 * la estructura correcta.
 *
 * La causa es de fondo y no se arregla afinando el umbral: `updatedAt` es un
 * sello a nivel de COMPONENTE, y la extracción solo necesita estar fresca
 * para la ESTRUCTURA. Los valores de token se leen en vivo desde Supernova en
 * esta misma corrida, así que un push de variables no puede caducarla.
 * **El campo se mueve por razones que no son la que el check quiere detectar.**
 *
 * Se descartó la salida obvia —distinguir el auto-sync por su firma de lote,
 * varios componentes compartiendo sello— porque no es viable: Supernova tiene
 * hoy DOS componentes, y dos sellos distintos no forman un lote.
 *
 * 🔴 Y LA RAZÓN DE NO DEJARLO BLOQUEANDO ES LA REGLA DE LA CASA: con
 * sincronizado horario esto dispararía cada hora sobre cualquier componente.
 * Una puerta que bloquea siempre se acaba saltando con `--forzar`, y entonces
 * no protege de nada. Mejor un aviso que se lee que un rojo que se ignora.
 *
 * QUEDA COMO INFORMATIVO, SIEMPRE. La defensa real contra la deriva
 * estructural es re-extraer después de tocar el componente (E6→E1 del
 * proceso), no un sello que mide otra cosa. */
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
          ? "⚪ Supernova marca el componente más nuevo que la extracción — pero el sello se mueve también por pushes de variables y por el sincronizado horario, así que NO prueba deriva estructural"
          : "⚪ Supernova no reporta cambios posteriores",
      senalProbada: false,
    }
    if (dSN > dEx)
      add(
        "B0-extraccion-vieja",
        "informativo",
        SLUG,
        `Supernova marca ${c.updatedAt} y la extracción es de ${base._meta.extractedAt}. **No es prueba de deriva**: el sello se mueve también con un push de variables o con el sincronizado horario, y los valores de token de este informe se leen en vivo. Si has TOCADO el componente desde entonces, re-extrae; si no, ignóralo`,
      )
  } else {
    frescura = { veredicto: "⚠️ No comparable: falta `updatedAt` en Supernova o `extractedAt` en la extracción", senalProbada: false }
  }
} catch (e) {
  frescura = { veredicto: `⚠️ No se pudo consultar Supernova: ${String(e.message).slice(0, 120)}`, senalProbada: false }
}

/* ─────────── B0b · La extracción es incoherente consigo misma ───────────
 * 🔴 ESTE ES EL CHECK QUE B0 QUERÍA SER, y nació el 7 sep 2026 de un fallo real.
 *
 * `B0` intentaba detectar una extracción vieja por un TIMESTAMP, y el timestamp
 * se mueve por cosas que no son el componente. Este mira el CONTENIDO, y por eso
 * no puede fallar en falso.
 *
 * La idea: `size` y `surface` NO cambian el token de color de un rol — la propia
 * extracción lo declara en su `sectionReduction` («surface y size solo alteran el
 * token de sombra»). Así que si el MISMO rol —misma variante, mismo estado, misma
 * ruta de capa, misma propiedad— aparece ligado a DOS tokens distintos, no hay
 * lectura benigna: la extracción capturó el árbol a medio camino.
 *
 * El caso que lo destapó: tras abrir la capa de componente, la extracción de las
 * 17:58 mostraba `3x icon/inverse` y `3x button/icon/primary` para el mismo rol
 * —3 y 3 son exactamente los ejes size/surface—, mientras Figma en vivo tenía las
 * 123 pinturas ya en `button/*`. Y sus nodeIds de icono ya no existían.
 *
 * 🔴 Y ES BLOQUEANTE, al contrario que B0: una extracción incoherente no describe
 * ningún estado real del componente, así que documentar desde ella publica una
 * mezcla de dos momentos. */
const rolesB0b = new Map()
for (const v of variantes) {
  const el = (v.colorWalk ?? [])[0]?.element ?? v.name ?? ""
  const st = (el.match(/state=([a-zA-Z]+)/) ?? [])[1] ?? "?"
  const va = (el.match(/variant=([a-zA-Z]+)/) ?? [])[1] ?? "?"
  for (const p of v.colorWalk ?? []) {
    if (p.property === "drop shadow" || !p.boundVariableId) continue
    const t = porVarId.get(p.boundVariableId)
    const n = t ? nombreDe(t) : `(desconocido ${p.boundVariableId})`
    const suf = p.path ? p.path.split(" > ").slice(1).join(">") : "(raíz)"
    const k = `${va} · ${st} · ${suf} · ${p.property}`
    if (!rolesB0b.has(k)) rolesB0b.set(k, new Map())
    const m = rolesB0b.get(k)
    m.set(n, (m.get(n) ?? 0) + 1)
  }
}
const incoherentes = [...rolesB0b].filter(([, m]) => m.size > 1)
for (const [k, m] of incoherentes) {
  const reparto = [...m].map(([n, c]) => `${c}× \`${n}\``).join(" y ")
  add(
    "B0b-extraccion-incoherente",
    "crítico",
    k,
    `el mismo rol aparece con ${m.size} tokens distintos — ${reparto}. **\`size\` y \`surface\` no cambian el token de color de un rol**, así que esto no tiene lectura benigna: la extracción se capturó a medio camino y describe una mezcla de dos momentos. 🔴 **RE-EXTRAE.**`,
  )
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

/* ─────────── B2 · Geometría sin token ───────────
 *
 * 🔴 LA CEGUERA SE DETECTA SOLA, NO SE MANTIENE A MANO.
 *
 * La primera versión llevaba una lista fija con `cornerRadius` dentro y
 * `strokeWeight` fuera. Resultado: `B2` reportó 60 de 60 crudas después de que
 * las 60 estuvieran bindeadas — un falso positivo PERMANENTE, porque medía
 * sobre una fuente incapaz de mostrar el dato. Yo mismo había escrito el aviso
 * en el `optionalContext` del Button y no lo apliqué a mi propio auditor.
 *
 * La regla ahora es la regla 16 hecha código: **si NINGUNA variante del
 * universo trae token para una propiedad, el extractor es ciego a ella y su
 * `null` no prueba nada.** Si al menos una lo trae, el método puede mostrar la
 * presencia y entonces un `null` sí es un valor crudo real.
 *
 * Verificado sobre la extracción del 4 sep: de 15 propiedades dimensionales,
 * el extractor sólo emite token para 3 —`minWidth`, `minHeight`, `itemSpacing`—.
 * `strokeWeight` y `cornerRadius` salen ciegas y se declaran como tales.
 */

// `width`/`height`/`counterAxisSpacing` son resultado del auto-layout, no una
// decisión: no son defecto ni aunque salgan sin token.
const DERIVADAS = /^(width|height|counterAxisSpacing)$/

// Paso 1 — censar qué propiedades puede mostrar el extractor.
const censo = {}
for (const v of variantes) {
  for (const [prop, d] of Object.entries(v.dimensions ?? {})) {
    if (!d || typeof d !== "object" || !("token" in d)) continue
    if (typeof d.value !== "number") continue
    if (DERIVADAS.test(prop)) continue
    ;(censo[prop] ??= { con: 0, sin: 0 })
    d.token ? censo[prop].con++ : censo[prop].sin++
  }
}
const CIEGAS = Object.entries(censo).filter(([, c]) => c.con === 0).map(([p]) => p)
const MEDIBLES = Object.entries(censo).filter(([, c]) => c.con > 0).map(([p]) => p)

// Paso 2 — sólo se juzgan las medibles.
const geomCrudas = new Map()
let b2Props = 0
for (const v of variantes) {
  for (const [prop, d] of Object.entries(v.dimensions ?? {})) {
    if (!MEDIBLES.includes(prop)) continue
    if (!d || typeof d.value !== "number") continue
    b2Props++
    if (d.token === null) {
      const k = `${prop} = ${d.value}`
      geomCrudas.set(k, (geomCrudas.get(k) ?? 0) + 1)
    }
  }
}
for (const [k, n] of geomCrudas) add("B2-geometria-cruda", "alto", k, `${n} de ${N} variantes con valor crudo y sin token`)

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
    const n = nombreDe(t)
    const e = consumidos.get(n) ?? { t, usos: 0 }
    e.usos++
    consumidos.set(n, e)
  }
}
// Los pares REALES fondo→primer plano del componente, para poder juzgar el
// corolario Static (un fondo que no cambia obliga a un texto que tampoco).
const paresPorFondo = new Map()
for (const v of variantes) {
  const paints = (v.colorWalk ?? []).filter((x) => x.property !== "drop shadow")
  const fondo = paints.find((x) => x.property === "fill" && !x.path)
  const tf = fondo?.boundVariableId && porVarId.get(fondo.boundVariableId)
  if (!tf) continue
  const nf = tf.origin?.name ?? tf.name
  for (const x of paints) {
    if (!x.path || !x.boundVariableId) continue
    const tp = porVarId.get(x.boundVariableId)
    if (tp) (paresPorFondo.get(nf) ?? paresPorFondo.set(nf, new Set()).get(nf)).add(tp.origin?.name ?? tp.name)
  }
}
const invierte = (n) => {
  const t = colores.find((x) => (x.origin?.name ?? x.name) === n)
  const v = t && valores(t)
  return v ? v.light !== v.dark : null
}

// Un semántico que no invierte y no lleva `Static` es el defecto C1 de foundations.
// ⚠️ Con la MISMA excepción de categoría que `auditar-foundations.mjs`: un tinte
// de sombra no es superficie ni primer plano, así que la convención `Static` no
// le aplica. **La regla vive duplicada en los dos scripts y eso es deuda** — la
// misma forma de deuda que el troceador de tablas. Si cambia, cambia en los dos.
const TINTE = /(^|\/)(shadow|shadowTint)\//
const b3Exentos = []
for (const [n, { t, usos }] of consumidos) {
  // 🔴 Los tres patrones se prueban contra la CADENA COMPLETA, no contra el
  // nombre del token bindeado. Un `button/icon/secondaryPressed` que aliasa a
  // `icon/inverseStatic` ES Static aunque su propio nombre no lo diga.
  const cad = cadenaDe(t)
  if (enCadena(t, TINTE)) { b3Exentos.push(`${pintaCadena(cad)} (${usos}×)`); continue }
  const val = valores(t)
  if (!val) continue
  if (val.light === val.dark && !enCadena(t, /Static$/)) {
    // 🟢 EXCEPCIÓN DEL COROLARIO STATIC, ya fijada en el sistema el 17 ago 2026:
    // «un fondo que no cambia por mode obliga a un texto que tampoco cambie».
    // Si es un fondo que no invierte Y todo lo que el componente pone encima
    // tampoco invierte, el par es correcto por construcción — no un token sin
    // adaptar. Es el caso de `background/selected` + `text/primaryInverseStatic`,
    // que ya dictaminé a mano y el auditor seguía marcando.
    const encima = [...(paresPorFondo.get(n) ?? [])]
    const esFondo = enCadena(t, /(^|\/)background\//)
    const parCoherente = esFondo && encima.length > 0 && encima.every((fg) => invierte(fg) === false)
    const via = cad.length > 1 ? ` (vía ${pintaCadena(cad)})` : ""
    if (parCoherente) {
      add("B3-par-static", "informativo", n, `no invierte, y **es correcto**${via}: todo lo que el componente pone encima tampoco invierte (${encima.join(", ")}). Corolario Static del 17 ago — el par es deliberado, no un token sin adaptar`)
    } else {
      add("B3-semantico-roto", "alto", n, `el componente lo usa ${usos}×, y no invierte (${val.light} en ambos modes) sin llevar \`Static\` en ningún eslabón de su cadena${via} — defecto C1 de \`docs:foundations\``)
    }
  }
}

/* ─────────── B4 · Pares REALES fondo/texto e icono, por variante y por mode ─────────── */
// Esto es lo que `docs:foundations` declara NO CUBIERTO: ahí el par se inventa
// desde un emparejamiento canónico; aquí sale de la variante que existe.
let b4Pares = 0
const b4NoMedibles = []
const b4Fallos = new Map()
const b4Cadenas = new Map()
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
        const clave = `${nombreDe(tp)} sobre ${nombreDe(tf)} · ${modo === "light" ? "Light" : "Dark"} · ${r}:1 (min ${min})`
        b4Fallos.set(clave, (b4Fallos.get(clave) ?? 0) + 1)
        if (!b4Cadenas.has(clave)) b4Cadenas.set(clave, [...cadenaDe(tp), ...cadenaDe(tf)])
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
  // Se prueba sobre la CADENA, igual que B3: `button/label/primaryDisabled`
  // hereda la exención de `text/disabled`, y seguiría heredándola aunque el
  // token de componente se llamara de otra forma.
  const exento = /disabled|placeholder/i.test(k) || (b4Cadenas.get(k) ?? []).some((n) => /disabled|placeholder/i.test(n))
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
  { id: "B0b-extraccion-incoherente", que: "Roles (variante × estado × capa × propiedad) con un solo token en toda la extracción", n: rolesB0b.size - incoherentes.length, N: rolesB0b.size },
  { id: "B1-pintura-cruda", que: "Pinturas (fill, stroke, text fill) con variable enlazada", n: b1Pinturas, N: b1Pinturas },
  {
    id: "B2-geometria-cruda",
    que: `Propiedades dimensionales que el extractor SÍ puede mostrar (${MEDIBLES.join(", ") || "ninguna"})`,
    n: b2Props,
    N: b2Props,
    nota: CIEGAS.length
      ? `🔴 **${CIEGAS.length} propiedades NO medibles desde la extracción y excluidas: ${CIEGAS.join(", ")}.** *Ninguna de las ${N} variantes trae token para ellas, así que el extractor es ciego y su \`null\` no prueba ausencia de binding.* **Se comprueban en Figma en vivo, no aquí.** Estado verificado el 4 sep 2026: \`strokeWeight\` 60/60 (width/xs·s·m) y \`cornerRadius\` 60/60 (radius/l).`
      : "",
  },
  { id: "B3-semantico-roto", que: "Semánticos consumidos, cruzados con los defectos de foundations", n: consumidos.size, N: consumidos.size },
  { id: "B4-contraste-real", que: "Pares reales primer-plano/relleno del propio componente × 2 modes", n: b4Pares, N: b4Pares },
  { id: "B5-tokens-de-componente", que: "Existencia de capa de tokens de componente", n: 1, N: 1 },
]

const noCubierto = [
  `**El \`_base.json\` NO exporta \`boundVariables\`**, así que ninguna propiedad cuyo binding viva ahí es medible desde la extracción. Hoy son ${CIEGAS.length}: ${CIEGAS.join(", ")}. *Se detectan solas —cero tokens en ${N} variantes— y se excluyen de B2 declarándolo.* 🔴 **Un \`null\` en una propiedad ciega no es un valor crudo: es una pregunta mal formulada.**`,
  `**Estados que no existen en Figma** — \`isLoading\` se decidió el 31 ago y no tiene variante. Un estado ausente no es medible desde la extracción.`,
  `**Motion, comportamiento y responsive** — no salen de Figma. Son los slots humanos del \`.md\`, y su done es editorial, no mecánico.`,
  `**Contraste contra la superficie de la página** — las variantes sin relleno propio (${b4NoMedibles.length}) dependen de dónde se coloque el botón. Listadas abajo, no omitidas.`,
  b3Exentos.length ? `**Tintes de sombra exentos de B3 por categoría** (${b3Exentos.join(", ")}): un tinte no es superficie ni primer plano. **Lo que sí queda abierto es de diseño: si la elevación debe leerse en Dark.**` : "",
  `**Deriva estructural entre la extracción y Figma.** \`B0b\` caza la extracción capturada a medio camino porque se contradice a sí misma, pero una extracción **coherente y vieja** —tomada limpia antes de un cambio— pasa sin detectarse. *Este script no lee Figma.* 🔴 **La defensa es re-extraer después de tocar el componente (E6→E1), no un check.**`,
  `**Completitud de la capa de componente.** \`B5\` comprueba que EXISTA, no que esté completa: un componente con un solo token de componente y el resto en semánticos pasa. *La completitud se juzga leyendo la tabla de tokens de arriba, donde cada cadena se muestra entera.*`,
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
    p(`> ⚠️ **Señal descartada como bloqueante, con evidencia.** El 7 sep 2026 \`updatedAt\` avanzó por un **push de variables**, no por una edición del componente, y \`B0\` marcó un falso positivo. *El sello es de componente; la extracción solo necesita estar fresca para la **estructura**, y los valores de token se leen en vivo aquí.* **Este check informa y NO bloquea, y no se va a promover:** con sincronizado horario dispararía cada hora, y una puerta que bloquea siempre se acaba saltando. **La defensa real es re-extraer después de tocar el componente.**`)
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
  p(`## Tokens que consume (${consumidos.size})`)
  p()
  p(`*Cuando el token es de componente se muestra su cadena de alias: es lo que \`B3\` juzga.*`)
  p()
  p(
    [...consumidos]
      .sort((a, b) => b[1].usos - a[1].usos)
      .map(([n, { t, usos }]) => {
        const c = cadenaDe(t)
        return c.length > 1 ? `\`${pintaCadena(c)}\` (${usos})` : `\`${n}\` (${usos})`
      })
      .join(" · "),
  )
  if (MD_OUT) {
    const destino = new URL(`../2. Proyecto/Diagnóstico/defectos-componente-${SLUG}.md`, import.meta.url)
    writeFileSync(destino, md.join("\n") + "\n")
    console.log(`Informe escrito: ${decodeURIComponent(destino.pathname)}`)
  }
}

if (bloqueantes.length) {
  console.error(`\n🔴 ${bloqueantes.length} defectos bloqueantes en '${SLUG}'. El componente NO está cerrado: no se documenta.`)
  /* 🔴 `process.exitCode`, NUNCA `process.exit(1)`. Cazado el 7 sep 2026:
   * `process.exit()` corta las escrituras PENDIENTES a stdout cuando stdout es
   * un pipe —a un fichero son síncronas y no se nota—. El informe `--json` pesa
   * 170 KB, así que quien lo leía por pipe recibía 65 154 bytes y un JSON
   * cortado por la mitad.
   *
   * Y lo que lo hacía grave: esto solo pasaba con `bloqueantes.length > 0`, es
   * decir **exactamente cuando hay algo que reportar**. `uspec:contexto` perdía
   * C4 y C5 justo en el caso en que sirven. Asignar `exitCode` conserva el
   * código de salida y deja que Node vacíe el buffer antes de terminar. */
  process.exitCode = 1
} else {
  console.log(`\n🟢 '${SLUG}' sin defectos bloqueantes de componente.`)
}
