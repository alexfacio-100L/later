/**
 * contraste-real.mjs — el contraste de las combinaciones que el botón produce,
 *                      calculado, no escrito.
 *
 * POR QUÉ EXISTE, y sustituye a un bloque vivo
 * --------------------------------------------
 * El 2 sep 2026 se quitaron seis imágenes de color y se pusieron en su lugar el
 * bloque `color-accessibility-grid`, con un argumento correcto: **una imagen de
 * contraste sigue viéndose bien cuando ya miente.**
 *
 * 🔴 Pero a esa grilla se le pasaban SEIS tokens y los seis eran `background/*`.
 * El contraste es una relación entre dos colores: sin colores de texto, no podía
 * mostrar el contraste de ninguna combinación real. Medía fondos contra fondos.
 * Es el **falso completo** de la regla 16 — forma correcta, ratios de verdad,
 * ningún error, y ninguna respuesta.
 *
 * ⚠️ **No lo detectó ninguna revisión de código: lo detectaron personas.**
 * Diseñadores que la vieron y no supieron qué estaban mirando (9 sep 2026). Se
 * les añadieron los 14 tokens que sí forman pares y el veredicto del Lead fue
 * *«nada útil»*. **El instrumento era el equivocado, no su configuración.**
 *
 * LO QUE HACE
 * -----------
 * Lee las tablas de color de `Componentes/button.md` —variante × mode, estados en
 * columnas— y para cada estado calcula el contraste REAL entre el relleno del
 * contenedor y lo que va encima: label, icono inicial e icono final.
 *
 * 🔴 No es un bloque vivo, y hay que decir qué se pierde: si un token cambia en
 * Figma y nadie regenera, esta tabla envejece. **Lo que lo compensa es que el
 * ratio no se escribe a mano** —se calcula en cada corrida— y que `md:verificar`
 * compara los hex del `.md` contra la extracción vigente. El día que el exporter
 * corra, esto se sustituye por el dato de Supernova.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const AQUI = path.dirname(fileURLToPath(import.meta.url))

/* Parametrizado el 14 sep 2026 para que `doc:done` pueda correrlo por componente.
 * Sin argumento se comporta como siempre: el Button. */
const SLUG = process.argv.slice(2).find(a => !a.startsWith("--")) ?? "button"
const MD_COMPONENTE = path.join(AQUI, "Componentes", `${SLUG}.md`)

/** Luminancia relativa WCAG 2.1. */
const luminancia = (hex) => {
  const c = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Ratio de contraste WCAG entre dos hex. Siempre ≥ 1. */
export const ratio = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/**
 * Veredicto para texto. El label del botón es texto normal (< 18.66px bold /
 * < 24px), así que el umbral es 4.5 para AA y 7 para AAA.
 * ⚠️ Los ICONOS no son texto: su umbral es 3:1 (WCAG 1.4.11, no textual). Por eso
 * el veredicto se pide con el umbral explícito y no se asume.
 */
const veredicto = (r, minimo) => r >= minimo ? "PASA" : "FALLA"

/* 🔴 Trunca, no redondea. `toFixed` mostraba «4.50» para un 4.4999 que NO llega
 * al 4.5 exigido: el número impreso decía lo contrario del veredicto. Un ratio
 * que se redondea hacia arriba aprueba visualmente lo que la norma suspende. */
const N = (x) => (Math.floor(x * 100) / 100).toFixed(2)

/** Extrae `token (#HEX)` de una celda; devuelve null si la celda dice `none`. */
const celda = (t) => {
  const m = String(t).match(/`([^`]+)`\s*\(#([0-9A-Fa-f]{6})\)/)
  return m ? { token: m[1], hex: "#" + m[2].toUpperCase() } : null
}

/** Lee las tablas `### variante / mode` de button.md. */
export function combinaciones(md) {
  const out = []
  const secciones = md.split(/\n### /).slice(1)
  for (const s of secciones) {
    const cab = s.split("\n")[0].trim()
    const m = cab.match(/^(\w+)\s*\/\s*(Light|Dark)$/)
    /* 🔴 Un encabezado que este parser no entiende se saltaba EN SILENCIO, y la
     * corrida seguía informando una cobertura que no incluía esa sección.
     * Ocurrió el 11 sep 2026: la sección del primario de marketing se tituló
     * `### cta — familia de tokens…` y la salida dijo «48 de 48 pares pasan»
     * mientras tres pares fallaban dentro. *Forma «falso completo» de la regla 16:
     * forma correcta, sin error, sin hueco visible.*
     * Ahora una sección con tabla de color que no case ABORTA. */
    if (!m) {
      const pareceColor = s.split("\n").filter(l => l.startsWith("|")).length >= 3
        && /^\|\s*Container fill\s*\|/m.test(s)   // marca inequívoca de tabla de color
      if (pareceColor) {
        console.error(`\n🔴 Encabezado de color no reconocido: «### ${cab}»`)
        console.error(`   Se esperaba \`### <variante> / Light|Dark\` con la variante en UNA palabra.`)
        console.error(`   Saltarla informaría una cobertura falsa. Corrige el encabezado.`)
        process.exit(1)
      }
      continue
    }
    const [, variante, mode] = m
    const filas = s.split("\n").filter(l => l.startsWith("|"))
    if (filas.length < 3) continue
    const estados = filas[0].split("|").slice(2, -2).map(x => x.trim())
    const por = {}
    for (const f of filas.slice(2)) {
      const cs = f.split("|").slice(1, -1).map(x => x.trim())
      por[cs[0]] = cs.slice(1)
    }
    out.push({ variante, mode, estados, filas: por })
  }
  return out
}

/**
 * 🔴 El estado deshabilitado está EXENTO por norma, y hay que decirlo o la tabla
 * publica diez incumplimientos que no lo son.
 *
 * WCAG 2.1, SC 1.4.3: *«Text or images of text that are part of an inactive user
 * interface component ... have no contrast requirement»*. Lo mismo en 1.4.11 para
 * los componentes no textuales.
 *
 * ⚠️ Exento NO es lo mismo que bien: `icon/disabled` sobre `background/disabled`
 * da 1.74:1 en Light. Es legal y es ilegible. Por eso se muestra con su ratio y
 * su nota — el dato sirve para decidir, y la página ya tiene una sección
 * «Cuándo no deshabilitar» que este número respalda.
 */
const EXENTO = /isDisabled|disabled/i

/** Los pares reales: lo que va ENCIMA del relleno, con su umbral. */
const ENCIMA = [
  { fila: /^Label$/,           etiqueta: "Label",         minimo: 4.5, tipo: "texto" },
  { fila: /^Leading icon/,     etiqueta: "Icono inicial", minimo: 3.0, tipo: "icono" },
  { fila: /^Trailing icon/,    etiqueta: "Icono final",   minimo: 3.0, tipo: "icono" },
]

export function paresDe(md) {
  const pares = []
  for (const c of combinaciones(md)) {
    const fondos = c.filas["Container fill"]
    if (!fondos) continue
    for (let i = 0; i < c.estados.length; i++) {
      const fondo = celda(fondos[i])
      if (!fondo) continue
      for (const e of ENCIMA) {
        const clave = Object.keys(c.filas).find(k => e.fila.test(k))
        if (!clave) continue
        const enc = celda(c.filas[clave][i])
        if (!enc) continue
        const r = ratio(fondo.hex, enc.hex)
        const exento = EXENTO.test(c.estados[i])
        pares.push({
          variante: c.variante, mode: c.mode, estado: c.estados[i],
          sobre: e.etiqueta, tipo: e.tipo, minimo: e.minimo,
          fondo: fondo.token, fondoHex: fondo.hex,
          color: enc.token, colorHex: enc.hex,
          ratio: r, exento,
          /* Un estado exento no "pasa": queda fuera del juicio. Marcarlo como
           * aprobado sería tan falso como marcarlo suspenso. */
          pasa: exento ? null : r >= e.minimo,
        })
      }
    }
  }
  return pares
}

// ── CLI ──
if (import.meta.url === `file://${process.argv[1]}`) {
  const md = fs.readFileSync(MD_COMPONENTE, "utf8")
  const pares = paresDe(md)
  const fallan = pares.filter(p => p.pasa === false)
  const exentos = pares.filter(p => p.exento)
  const juzgados = pares.filter(p => !p.exento)
  const combis = new Set(pares.map(p => `${p.variante}/${p.mode}`))

  console.log(`\nContraste real — ${pares.length} pares en ${combis.size} combinaciones\n`)
  let act = null
  for (const p of pares) {
    const k = `${p.variante} / ${p.mode}`
    if (k !== act) { console.log(`── ${k}`); act = k }
    const marca = p.exento ? "· " : (p.pasa ? "  " : "🔴")
    console.log(`  ${marca} ${p.estado.padEnd(20)} ${p.sobre.padEnd(14)} ${N(p.ratio).padStart(6)}:1  (min ${p.minimo})${p.exento ? " EXENTO" : "      "}  ${p.color} sobre ${p.fondo}`)
  }
  /* Cobertura, regla 16: se dice sobre cuántos, y se falla si alguno no pasa. */
  console.log(`\ncobertura: ${juzgados.length - fallan.length} de ${juzgados.length} pares juzgados pasan su umbral`)
  console.log(`           ${exentos.length} exentos por estado inactivo (WCAG 1.4.3) — se muestran, no se juzgan`)
  if (fallan.length) {
    console.log(`🔴 ${fallan.length} par(es) por debajo del mínimo:`)
    for (const p of fallan)
      console.log(`   · ${p.variante}/${p.mode} · ${p.estado} · ${p.sobre}: ${N(p.ratio)}:1 < ${p.minimo}`)
    process.exitCode = 1
  }
}

/**
 * La tabla para la página: compacta a propósito.
 *
 * 🔴 El formato importa tanto como el dato. La grilla que esto sustituye eran
 * 196 celdas con scroll horizontal; una tabla con un par por fila serían 60
 * filas de scroll vertical. **Cambiar un problema de scroll por otro no es
 * arreglarlo.**
 *
 * Por eso: una fila por (variante × mode × estado) —20— y los elementos en
 * columnas. El label y los dos iconos comparten fila porque comparten fondo.
 * Los dos iconos van juntos: en las cuatro combinaciones documentadas siempre
 * usan el mismo token, y se declara si alguna vez dejan de hacerlo.
 */
export function tablaMarkdown(pares) {
  const filas = new Map()
  for (const p of pares) {
    const k = `${p.variante} / ${p.mode} | ${p.estado}`
    const f = filas.get(k) ?? { variante: p.variante, mode: p.mode, estado: p.estado, exento: p.exento }
    if (p.sobre === "Label") { f.label = p; }
    else { (f.iconos ??= []).push(p) }
    f.fondo = p.fondo
    filas.set(k, f)
  }
  const L = [
    "| Combinación | Estado | Fondo | Label | Iconos |",
    "|---|---|---|---|---|",
  ]
  for (const f of filas.values()) {
    const ics = f.iconos ?? []
    const distintos = new Set(ics.map(i => i.color))
    /* Si los dos iconos dejaran de compartir token, la celda combinada mentiría.
     * Se declara en vez de asumirlo. */
    const ic = ics.length === 0 ? "—"
      : distintos.size > 1 ? ics.map(i => `${i.color} ${N(i.ratio)}:1`).join(" · ")
      : `${N(ics[0].ratio)}:1`
    const marca = (p) => !p ? "—" : f.exento ? `${N(p.ratio)}:1 *` : `**${N(p.ratio)}:1**`
    L.push(`| ${f.variante} / ${f.mode} | \`${f.estado}\` | \`${f.fondo}\` | ${marca(f.label)} | ${f.exento && ics.length ? ic + " *" : ic} |`)
  }
  return L.join("\n")
}

if (process.argv.includes("--md")) {
  const md = fs.readFileSync(MD_COMPONENTE, "utf8")
  console.log(tablaMarkdown(paresDe(md)))
}

/**
 * Los tokens que interviene cada variante, derivados de las tablas — no listados
 * a mano. Si mañana `secondary` deja de usar un token, esto lo refleja solo.
 */
export function tokensPorVariante(md) {
  const por = {}
  for (const p of paresDe(md)) {
    ;(por[p.variante] ??= new Set()).add(p.fondo)
    por[p.variante].add(p.color)
  }
  return Object.fromEntries(Object.entries(por).map(([k, v]) => [k, [...v]]))
}
