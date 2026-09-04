/**
 * verificar-contexto.mjs — El contexto que se pega al extractor no puede estar caduco.
 *
 * POR QUÉ EXISTE
 * -------------
 * Cinco veces se ha pegado al plugin uSpec un `optionalContext` que afirmaba
 * como abierto algo ya corregido. El quinto lo evitó el Lead preguntando, no
 * una guarda. Y el propio archivo lleva la lección escrita dentro desde el día
 * anterior: no sirvió, porque nadie la lee ANTES de pegar.
 *
 * Es E3 del FODA en estado puro — una regla que exige que alguien se acuerde no
 * se ejecuta. Así que esto no es doctrina: es un comando que falla ruidosamente.
 *
 * 🔴 LO QUE HACE CARO EL FALLO: el contexto no describe el componente, lo DICTA.
 * Un `.md` equivocado se corrige reescribiéndolo; un contexto equivocado hace
 * que la interpretación entera salga mal, con la forma correcta y sin error.
 *
 * USO
 * ---
 *   npm run uspec:contexto           # verifica; sale 1 si algo falla
 *   npm run uspec:contexto -- --json
 *
 * LÍMITE DECLARADO
 * ----------------
 * NO puede leer Figma. Comprueba coherencia entre el contexto y lo que las
 * auditorías ya saben. Un contexto que afirme algo sobre lo que ninguna
 * auditoría opina pasa sin verificarse — y eso se dice en el informe.
 */

import { readFileSync, existsSync, statSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const RAIZ = dirname(fileURLToPath(import.meta.url))
const ARGS = process.argv.slice(2)
const JSON_OUT = ARGS.includes("--json")
const SLUG = ARGS.find((a) => !a.startsWith("--")) ?? "button"
const RUTA = resolve(RAIZ, `spec-origen/${SLUG}/_contexto-para-pegar.txt`)

const fallos = [], avisos = [], oks = []
const F = (c, m) => fallos.push({ check: c, mensaje: m })
const A = (c, m) => avisos.push({ check: c, mensaje: m })
const OK = (c, m) => oks.push({ check: c, mensaje: m })

if (!existsSync(RUTA)) {
  console.error(`🔴 No existe el contexto de '${SLUG}': ${RUTA}\n   Sin contexto no se extrae: el extractor documentaría a ciegas.`)
  process.exit(1)
}
const texto = readFileSync(RUTA, "utf8")

/* ── C1 · Una sola copia ────────────────────────────────────────────────
 * La política es una sola copia viva; el histórico vive en git. Una segunda
 * copia se congela el día que se crea y nadie vuelve a ella — ya pasó con una
 * del 20 de agosto. */
let copias = []
try {
  const salida = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" })
  copias = salida.split("\n").filter((f) => /_contexto-para-pegar|optionalContext.*\.txt/.test(f))
} catch { A("C1-copias", "No se pudo consultar git; la comprobación de duplicados NO se hizo") }
const propias = copias.filter((f) => f.includes(`/${SLUG}/`))
if (propias.length > 1) F("C1-copias", `Hay ${propias.length} copias del contexto de '${SLUG}': ${propias.join(", ")}. La política es UNA. Borra las demás: el histórico vive en git.`)
else if (propias.length === 1) OK("C1-copias", `Una sola copia viva: ${propias[0]}`)

/* ── C2 · Fecha de revisión declarada ───────────────────────────────────
 * Sin fecha no hay frescura comprobable. Se exige en la cabecera. */
const m = texto.match(/Revisad[oa][^\n]*?(\d{1,2}) de (\w+) de (\d{4})/i)
const MESES = { enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5, julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11 }
let fechaRevision = null
if (!m || !(m[2].toLowerCase() in MESES)) {
  F("C2-fecha", 'El contexto no declara fecha de revisión. Añade en la cabecera: "Revisado entero el <D> de <mes> de <AAAA> contra el estado de ese día."')
} else {
  fechaRevision = new Date(+m[3], MESES[m[2].toLowerCase()], +m[1])
  OK("C2-fecha", `Revisión declarada: ${fechaRevision.toISOString().slice(0, 10)}`)
}

/* ── C3 · Frescura contra lo que sí sabemos que cambió ──────────────────
 * El informe de defectos se regenera después de cada corrección, así que su
 * fecha es un suelo razonable: si el contexto es anterior, se escribió antes
 * de la última corrección conocida. */
const INFORME = resolve(RAIZ, `../2. Proyecto/Diagnóstico/defectos-componente-${SLUG}.md`)
if (fechaRevision && existsSync(INFORME)) {
  const mi = readFileSync(INFORME, "utf8").match(/\*\*Corrida:\*\*\s*(\d{4}-\d{2}-\d{2})/)
  if (mi) {
    const fInf = new Date(mi[1] + "T00:00:00")
    const dias = Math.round((fInf - fechaRevision) / 86400000)
    if (dias > 0) F("C3-frescura", `El contexto se revisó el ${fechaRevision.toISOString().slice(0,10)} y la última auditoría del componente es del ${mi[1]} (${dias} día(s) después). Hubo cambios que el contexto no puede reflejar.`)
    else OK("C3-frescura", `Revisión (${fechaRevision.toISOString().slice(0,10)}) al día con la última auditoría (${mi[1]})`)
  } else A("C3-frescura", "El informe de defectos no declara `Corrida:`; frescura NO comprobada")
} else if (!existsSync(INFORME)) A("C3-frescura", `No hay informe de defectos para '${SLUG}'. Corre \`npm run comp:auditar:md\` primero — frescura NO comprobada`)

/* ── C4 · Contradicción con lo que la auditoría ya da por cerrado ───────
 * Es el check que habría cazado los cinco envenenamientos. Busca en el contexto
 * afirmaciones de "sigue crudo / defecto abierto" sobre una propiedad, y las
 * contrasta contra `comp:auditar`. */
let informe = null
try {
  informe = JSON.parse(execFileSync(process.execPath, [resolve(RAIZ, "auditar-componente.mjs"), SLUG, "--json"], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }))
} catch (e) { try { informe = JSON.parse(e.stdout ?? "") } catch {} }

if (!informe) {
  A("C4-contradiccion", "`comp:auditar` no pudo correr: la contradicción NO se comprobó. No es un aprobado.")
} else {
  const crudasReales = new Set(
    informe.defectos.filter((d) => d.check === "B2-geometria-cruda").map((d) => String(d.donde).split(" ")[0]),
  )
  // 🔴 SE PARSEA UN BLOQUE DECLARADO, NO LA PROSA.
  //
  // La primera versión buscaba frases tipo "sigue crudo" en el texto. Falló dos
  // veces seguidas y de las dos maneras posibles: con el contexto envenenado no
  // detectó nada —decía "el grosor CRUDO" y yo buscaba "strokeWeight"— y al
  // arreglarlo empezó a disparar sobre el contexto BUENO, porque frases como
  // "ninguna cruda" contienen la palabra que busca.
  //
  // Un check que grita en falso se acaba ignorando, igual que una puerta que
  // bloquea siempre se acaba saltando. Así que la fuente de verdad deja de ser
  // la prosa y pasa a ser un bloque que el autor del contexto declara a mano.
  // Escribirlo es el momento en que alguien tiene que mirar el estado real.
  const bloque = texto.match(/ESTADO-VERIFICABLE[^\n]*\n([\s\S]*?)(\n\s*\n|$)/)
  const VIGILADAS = ["strokeWeight", "cornerRadius", "minHeight", "minWidth", "paddingInline", "paddingBlock", "itemSpacing"]
  if (!bloque) {
    F("C4-contradiccion", `El contexto no lleva bloque ESTADO-VERIFICABLE. Añádelo con una línea por propiedad (${VIGILADAS.join(", ")}), cada una \`bindeado\` o \`crudo\`. Sin él, la contradicción NO se puede comprobar y no se extrae.`)
  } else {
    const declarado = {}
    for (const l of bloque[1].split("\n")) {
      const mm = l.match(/^\s*([A-Za-z]+)\s*:\s*(bindeado|crudo)\s*$/)
      if (mm) declarado[mm[1]] = mm[2]
    }
    const faltan = VIGILADAS.filter((v) => !(v in declarado))
    if (faltan.length) F("C4-contradiccion", `El bloque ESTADO-VERIFICABLE no declara: ${faltan.join(", ")}. Declara las ${VIGILADAS.length}, o la cobertura es parcial y se lee como total.`)
    let contradicciones = 0
    for (const [prop, estado] of Object.entries(declarado)) {
      const realmenteCruda = crudasReales.has(prop)
      if (estado === "crudo" && !realmenteCruda) {
        contradicciones++
        F("C4-contradiccion", `El contexto declara \`${prop}: crudo\` y \`comp:auditar\` NO lo reporta crudo. Pegarlo así haría documentar como hueco algo ya cerrado.`)
      }
      if (estado === "bindeado" && realmenteCruda) {
        // ⚠️ Hay DOS causas y se resuelven al revés. `comp:auditar` lee la
        // extracción de disco, no Figma: si la extracción es anterior a la
        // revisión del contexto, lo viejo es la AUDITORÍA, no el contexto — es
        // justo la señal de que toca re-extraer. Tratarlo como mentira del
        // contexto mandaría a "corregir" algo que ya está bien.
        const extraidoAntes = informe.extraido && fechaRevision && Date.parse(informe.extraido) < fechaRevision.getTime()
        if (extraidoAntes) {
          A("C4-contradiccion", `El contexto declara \`${prop}: bindeado\` y \`comp:auditar\` lo ve crudo — pero la extracción es del ${String(informe.extraido).slice(0,10)}, ANTERIOR a la revisión del contexto. No es una mentira del contexto: es la extracción que va vieja. 🔴 RE-EXTRAE ANTES DE DOCUMENTAR (lo corre el Lead con el plugin uSpec).`)
        } else {
          contradicciones++
          F("C4-contradiccion", `El contexto declara \`${prop}: bindeado\` y \`comp:auditar\` SÍ lo reporta crudo, con una extracción posterior a la revisión. El contexto afirma de más.`)
        }
      }
    }
    if (!contradicciones && !faltan.length) OK("C4-contradiccion", `${Object.keys(declarado).length} de ${VIGILADAS.length} propiedades declaradas y todas coinciden con \`comp:auditar\``)
  }
}

/* ── Informe ─────────────────────────────────────────────────────────── */
const cobertura = [
  "🔴 NO CUBIERTO — este verificador no lee Figma. Comprueba coherencia entre el contexto y lo que las auditorías ya saben; una afirmación sobre la que ninguna auditoría opina pasa sin verificarse.",
  `🔴 NO CUBIERTO — la prosa sobre COLOR no se contrasta. C4 solo vigila 7 propiedades geométricas, porque son las que \`comp:auditar\` mide como binario crudo/bindeado.`,
  "🔴 NO CUBIERTO — que el contexto esté COMPLETO. Detecta lo que sobra y ha caducado, no lo que falta.",
  "🔴 NO CUBIERTO — C4 es tan fresco como la extracción. `comp:auditar` lee `_base.json` de disco, no Figma: si la extracción va vieja, C4 contrasta contra el estado viejo. Por eso avisa de la caducidad en vez de dar por buena su propia comparación.",
]

if (JSON_OUT) console.log(JSON.stringify({ slug: SLUG, ruta: RUTA, fallos, avisos, oks, cobertura }, null, 2))
else {
  console.log(`\nContexto de '${SLUG}' — ${RUTA.replace(RAIZ + "/", "")}`)
  for (const o of oks) console.log(`  🟢 ${o.check}: ${o.mensaje}`)
  for (const a of avisos) console.log(`  ⚠️  ${a.check}: ${a.mensaje}`)
  for (const f of fallos) console.log(`  🔴 ${f.check}: ${f.mensaje}`)
  console.log(`\nLo que este método NO puede encontrar:`)
  for (const c of cobertura) console.log(`  · ${c}`)
}

if (fallos.length) {
  console.error(`\n🔴 ${fallos.length} problema(s) en el contexto. NO se extrae con esto: el contexto DICTA la interpretación, no la describe.`)
  process.exit(1)
}
console.log(`\n🟢 Contexto listo para pegar en el plugin uSpec.`)
