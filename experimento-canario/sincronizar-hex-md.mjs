/**
 * sincronizar-hex-md.mjs — los hex del `.md` contra los tokens vivos.
 *
 * POR QUÉ EXISTE, y nace del arreglo del 10 sep 2026
 * ---------------------------------------------------
 * `Componentes/button.md` guarda cada color como `` `token` (#HEX) ``. El token
 * es la referencia y el hex es una COPIA — cómoda para leer y para calcular
 * contraste sin red, y **desincronizable en silencio**.
 *
 * 🔴 Pasó ese día: se corrigió la familia `brand` en Dark —de la escala neutra a
 * la de marca— y el `.md` siguió diciendo `#FFFFFF`. La tabla de contraste se
 * calcula DESDE el `.md`, así que habría publicado 48 de 48 pares «correctos»
 * medidos sobre colores que ya no existen. **Falso vigente, y del caro: números
 * bien calculados sobre datos viejos no producen ningún error.**
 *
 *   npm run docs:hex              # compara y dice qué difiere
 *   npm run docs:hex -- --escribir  # actualiza el .md con los valores vivos
 *
 * ⚠️ Solo toca los HEX. El nombre del token no se toca nunca: si un token dejó
 * de existir o cambió de nombre, eso NO es un desajuste de valor y se reporta
 * aparte — corregirlo automáticamente enmascararía un cambio de arquitectura.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MD = path.join(AQUI, "../Componentes/button.md")
const ESCRIBIR = process.argv.includes("--escribir")

const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }

const base = await sdk.tokens.getTokens(from)
const temas = await sdk.tokens.getTokenThemes(from)
const nombre = t => t?.origin?.name ?? t?.name ?? ""
const hex = t => { const c = t?.value?.color; return c ? "#" + ["r","g","b"].map(k => c[k].toString(16).padStart(2,"0")).join("").toUpperCase() : null }

/** El valor de un token en un mode. Sin override, hereda del base. */
const valorEn = (ruta, mode) => {
  const th = temas.find(t => t.name.toLowerCase() === mode.toLowerCase())
  const ov = th && (th.overriddenTokens ?? []).find(x => nombre(x) === ruta)
  if (ov) return hex(ov)
  const b = base.find(x => nombre(x) === ruta)
  return b ? hex(b) : null
}

const md = readFileSync(MD, "utf8")
const lineas = md.split("\n")

/* El mode manda desde el último encabezado `### variante / Mode`. Una celda no
 * dice a qué tema pertenece: lo dice la sección en la que vive. */
let modeActual = null
let total = 0, iguales = 0
const difieren = [], huerfanos = []
const salida = lineas.map((linea, i) => {
  const enc = linea.match(/^###\s+\w+\s*\/\s*(Light|Dark)\s*$/)
  if (enc) { modeActual = enc[1]; return linea }
  if (!modeActual || !linea.startsWith("|")) return linea

  return linea.replace(/`([^`]+)`\s*\(#([0-9A-Fa-f]{6})\)/g, (m, ruta, viejo) => {
    total++
    const vivo = valorEn(ruta, modeActual)
    if (!vivo) { huerfanos.push({ linea: i + 1, ruta }); return m }
    if (vivo.toUpperCase() === ("#" + viejo).toUpperCase()) { iguales++; return m }
    difieren.push({ linea: i + 1, ruta, mode: modeActual, viejo: "#" + viejo.toUpperCase(), vivo })
    return `\`${ruta}\` (${vivo})`
  })
})

console.log(`\nHex del .md contra los tokens vivos — ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (CDMX)\n`)
if (difieren.length) {
  console.log(`🔴 ${difieren.length} desajuste(s):`)
  for (const d of difieren)
    console.log(`   L${String(d.linea).padStart(4)}  ${d.mode.padEnd(6)} ${d.ruta.padEnd(26)} ${d.viejo} → ${d.vivo}`)
}
if (huerfanos.length) {
  /* No se corrigen solos: un token que ya no existe es un cambio de
   * arquitectura, no un valor desactualizado. */
  console.log(`\n⚠️  ${huerfanos.length} token(s) del .md que no existen en Supernova — se reportan, NO se tocan:`)
  for (const h of huerfanos.slice(0, 10)) console.log(`   L${String(h.linea).padStart(4)}  ${h.ruta}`)
}

/* Cobertura declarada (regla 16). */
console.log(`\ncobertura: ${iguales} de ${total} hex coinciden con el token vivo` +
            (huerfanos.length ? ` · ${huerfanos.length} sin token` : ""))

if (!difieren.length) { console.log(`🟢 El .md está al día.`); process.exit(0) }

if (!ESCRIBIR) {
  console.log(`\n🔴 El .md está desactualizado. Todo lo que se calcule desde él —el contraste, la tabla de color— usa valores viejos.`)
  console.log(`   Para corregirlo: npm run docs:hex -- --escribir`)
  process.exitCode = 1
} else {
  writeFileSync(MD, salida.join("\n"))
  console.log(`\n✓ button.md actualizado: ${difieren.length} hex.`)
}
