/**
 * doc-registro.mjs — mide el REGISTRO de un documento, no su contenido.
 *
 * POR QUÉ EXISTE
 * --------------
 * El Lead lo pidió dos veces sobre la misma página: *«editorialmente en voz y tono
 * puede mejorar en que sea directo y concreto, como Base de Uber. El contenido es
 * el correcto y se entiende.»* La segunda vez fue «insisto» — la primera corrección
 * no llegó al fondo porque nadie había medido qué hacía la prosa indirecta.
 *
 * 🔴 Mide FORMA. No juzga si el texto dice lo correcto: eso lo lee una persona.
 *
 * LAS CUATRO CONTABLES (de V1–V7, el criterio de voz y tono)
 *   V1  frase ≤ 25 palabras · media ≤ 18
 *   V2  cero incisos con raya en prosa — si merece decirse, es otra frase
 *   V3  máximo 1 énfasis por párrafo, sobre un término y no sobre una cláusula
 *   V6  cero metaprosa — el documento no se menciona a sí mismo
 *
 * ⚠️ MIDE PROSA, NO TABLAS NI CÓDIGO. Una celda no es una frase y un bloque de
 * código no tiene énfasis. Contarlo todo produce un número que miente, y una
 * guarda que miente acaba apagada.
 *
 *   npm run doc:registro -- <ruta.md>
 */
import fs from "node:fs"
import path from "node:path"

const RUTA = process.argv.slice(2).find(a => !a.startsWith("--"))
if (!RUTA || !fs.existsSync(RUTA)) {
  console.error(`🔴 Uso: node doc-registro.mjs <ruta.md>`)
  process.exit(1)
}
const bruto = fs.readFileSync(RUTA, "utf8")

/* 🔴 MODO MOLDE. Un molde es otro género que una página publicada: lleva
 * instrucciones a quien lo duplica —marcadores entre corchetes y la nota de
 * «módulo opcional»— que se BORRAN antes de publicar. Medirlas como si fueran
 * prosa del documento produce un falso positivo: el 14 sep 2026 V6 marcó
 * metaprosa por la frase «elimina esta sección si no aplica», que es
 * exactamente lo que un molde debe decir.
 *
 * Con `--molde` esas líneas quedan fuera del universo medido. Y se DECLARA
 * cuántas se excluyeron: un universo recortado en silencio es un número que
 * miente. */
const MOLDE = process.argv.includes("--molde")

/* ── Aislar la PROSA ───────────────────────────────────────────────────────── */
const sinCodigo = bruto.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "«término»")
const lineas = sinCodigo.split("\n")
const parrafos = lineas.filter(l => {
  const t = l.trim()
  if (!t) return false
  if (t.startsWith("|")) return false        // tabla
  if (/^#{1,6}\s/.test(t)) return false      // encabezado
  if (/^<SN|^<\/SN/.test(t)) return false    // bloque de Supernova
  if (/^[-*]\s/.test(t) && t.length < 90) return false  // viñeta corta: es una lista, no prosa
  if (MOLDE && /^\\?\[.+\]$/.test(t)) return false            // marcador del molde
  if (MOLDE && /Módulo opcional/i.test(t)) return false     // instrucción al que duplica
  return true
})
const excluidasPorMolde = MOLDE
  ? lineas.filter(l => { const t = l.trim(); return t && (/^\\?\[.+\]$/.test(t) || /Módulo opcional/i.test(t)) }).length
  : 0
const prosa = parrafos.join(" ")

/* ── Medidas ───────────────────────────────────────────────────────────────── */
const frases = prosa
  .split(/(?<=[.:;!?])\s+/)
  .map(f => f.replace(/^[>\s*_🔴⚠️🟢🟡🎯✅·—-]+/, "").trim())
  .filter(f => f.split(/\s+/).length >= 4)
const pal = f => (f.match(/[\wáéíóúñü]+/gi) ?? []).length
const largos = frases.map(pal)
const media = largos.length ? largos.reduce((a, b) => a + b, 0) / largos.length : 0
const maximo = largos.length ? Math.max(...largos) : 0
const pasadas = frases.filter(f => pal(f) > 25)

const negritas = (prosa.match(/\*\*[^*]+\*\*/g) ?? [])
const cursivas = (prosa.match(/(?<!\*)\*[^*\n]+\*(?!\*)/g) ?? [])
const enfasis = negritas.length + cursivas.length
const densidad = parrafos.length ? enfasis / parrafos.length : 0
/* Un énfasis sobre una CLÁUSULA —más de 6 palabras— destaca una frase entera, que es
 * justo lo que anula el énfasis. Se cuenta aparte porque es el defecto, no el volumen. */
const clausulas = [...negritas, ...cursivas].filter(e => pal(e) > 6)

const incisos = (prosa.match(/—/g) ?? []).length
const META = /\b(esta página|este documento|esta sección|lo de abajo|la tabla de abajo|de arriba|aquí abajo|más abajo)\b/gi
const metaprosa = (prosa.match(META) ?? [])

const CONECTOR = /^(Y|Por eso|Además|Pero|Entonces|Así que|De hecho|Es decir|Sin embargo|También)\b/i
const abrenConector = parrafos.filter(p => CONECTOR.test(p.replace(/^[>\s*_🔴⚠️🟢🟡🎯✅·—-]+/, "")))
const IMPERSONAL = /\bse (documenta|garantiza|mide|revisa|usa|hace|construye|aplica|resuelve|dice|cuenta|escribe|deja|comprueba)\b/gi
const impersonales = (prosa.match(IMPERSONAL) ?? [])

/* ── Informe ───────────────────────────────────────────────────────────────── */
const N = (x, d = 1) => x.toFixed(d)
const ok = (b) => b ? "✓" : "🔴"
console.log(`\n═══ doc:registro · ${path.basename(RUTA)} ═══`)
console.log(`prosa aislada: ${parrafos.length} párrafos · ${frases.length} frases (fuera tablas, encabezados, código y bloques SN)`)
if (MOLDE) console.log(`modo molde: ${excluidasPorMolde} líneas excluidas por ser marcador o instrucción al que duplica`)
console.log("")

const v1 = media <= 18 && maximo <= 25
console.log(` ${ok(v1)} V1  largo de frase`)
console.log(`       media ${N(media)} (máx permitido 18) · máximo ${maximo} (permitido 25)`)
console.log(`       ${pasadas.length} de ${frases.length} frases pasan de 25 palabras`)

const v2 = incisos === 0
console.log(` ${ok(v2)} V2  incisos con raya`)
console.log(`       ${incisos} en prosa (permitido 0) · ${N(incisos / Math.max(1, parrafos.length), 2)} por párrafo`)

const v3 = densidad <= 1 && clausulas.length === 0
console.log(` ${ok(v3)} V3  énfasis`)
console.log(`       ${enfasis} marcas · ${N(densidad, 2)} por párrafo (permitido 1)`)
console.log(`       ${clausulas.length} sobre cláusulas de más de 6 palabras (permitido 0)`)

const v6 = metaprosa.length === 0
console.log(` ${ok(v6)} V6  metaprosa`)
console.log(`       ${metaprosa.length} referencias al propio documento (permitido 0)`)
if (metaprosa.length) console.log(`       ${[...new Set(metaprosa.map(m => m.toLowerCase()))].slice(0, 6).join(" · ")}`)

console.log(`\n── lo que este comando NO comprueba ──`)
console.log(`   V4  el párrafo abre con verbo o sujeto concreto, nunca con conector`)
console.log(`       indicio contable: ${abrenConector.length} párrafos abren con conector`)
console.log(`   V5  segunda persona y voz activa`)
console.log(`       indicio contable: ${impersonales.length} construcciones impersonales «se + verbo»`)
console.log(`   V7  el porqué va después de la instrucción, y solo si cambia lo que alguien hace`)
console.log(`       no tiene indicio contable: lo lee una persona`)
console.log(`\n⚠️ Un verde aquí significa que las cuatro contables pasan. NO significa que el texto esté bien escrito.`)

const fallan = [["V1", v1], ["V2", v2], ["V3", v3], ["V6", v6]].filter(([, b]) => !b).map(([k]) => k)
if (fallan.length) {
  console.error(`\n🔴 ${fallan.length} de 4 reglas contables por debajo de umbral: ${fallan.join(" · ")}`)
  process.exit(1)
}
console.log(`\n🟢 4 de 4 reglas contables en umbral.\n`)
