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
import { execFileSync, spawnSync } from "node:child_process"
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
/* 🔴 `spawnSync`, NO `execFileSync`, y la razón es un fallo latente cazado el
 * 7 sep 2026: `execFileSync` LANZA cuando el hijo sale con código distinto de
 * cero, y en el error Node entrega el stdout TRUNCADO A 64 KB — se ignora el
 * `maxBuffer`. El informe del auditor pesa 170 KB, así que el `JSON.parse` del
 * catch fallaba con «Unterminated string» y C4/C5 quedaban sin comprobar.
 *
 * Y el detalle que lo hacía peligroso: `comp:auditar` sale con 1 EXACTAMENTE
 * cuando hay defectos bloqueantes. **La guarda se quedaba ciega justo en el
 * caso en que hace falta.** `spawnSync` no lanza y devuelve el stdout entero. */
let informe = null
{
  const r = spawnSync(process.execPath, [resolve(RAIZ, "auditar-componente.mjs"), SLUG, "--json"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
  const salida = r.stdout ?? ""
  try { informe = JSON.parse(salida) } catch {
    A("C4-contradiccion", `\`comp:auditar\` corrió (código ${r.status}) pero su salida no es JSON parseable (${salida.length} bytes). La contradicción NO se comprobó.`)
  }
}

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

/* ── C5 · La capa de tokens de componente ───────────────────────────────
 * POR QUÉ EXISTE, y es un hueco que costó caro el 7 de septiembre: C1–C4 solo
 * detectan lo que SOBRA o ha CADUCADO. Un dato NUEVO que nadie escribió no
 * tiene contra qué contrastarse, así que el verificador daba VERDE sobre un
 * contexto al que le faltaba la capa de componente entera — y el verde se lee
 * como "listo para pegar".
 *
 * No se puede detectar "falta algo" en general sin leer Figma. Lo que SÍ se
 * puede es exigir que se declare a mano lo que `comp:auditar` sabe medir, que
 * es el mismo truco de ESTADE-VERIFICABLE: el bloque obliga a mirar. */
if (informe) {
  const bloqueCapas = texto.match(/CAPAS-DE-TOKEN[^\n]*\n([\s\S]*?)(\n\s*\n|$)/)
  if (!bloqueCapas) {
    F("C5-capa-componente", 'El contexto no lleva bloque CAPAS-DE-TOKEN. Añádelo con `capaDeComponente: si|no`, `coleccion: <nombre>` y `tokensDeComponente: <n>`. Sin él no se puede comprobar si el contexto conoce la capa de componente.')
  } else {
    const d = {}
    for (const l of bloqueCapas[1].split("\n")) {
      const mm = l.match(/^\s*([A-Za-z]+)\s*:\s*(\S+)\s*$/)
      if (mm) d[mm[1]] = mm[2]
    }
    const faltan = ["capaDeComponente", "coleccion", "tokensDeComponente"].filter((k) => !(k in d))
    if (faltan.length) {
      F("C5-capa-componente", `El bloque CAPAS-DE-TOKEN no declara: ${faltan.join(", ")}.`)
    } else {
      const dice = d.capaDeComponente === "si"
      const auditoriaVeCapa = !informe.defectos.some((x) => x.check === "B5-tokens-de-componente")
      const extraidoAntes = informe.extraido && fechaRevision && Date.parse(informe.extraido) < fechaRevision.getTime()
      if (dice && !auditoriaVeCapa) {
        if (extraidoAntes) A("C5-capa-componente", `El contexto declara capa de componente (${d.coleccion}, ${d.tokensDeComponente} tokens) y \`comp:auditar\` no la ve — pero la extracción es del ${String(informe.extraido).slice(0,10)}, ANTERIOR a la revisión. No es una mentira del contexto: es la extracción que va vieja. 🔴 RE-EXTRAE ANTES DE DOCUMENTAR.`)
        else F("C5-capa-componente", `El contexto declara capa de componente y \`comp:auditar\` NO la ve, con una extracción posterior a la revisión. El contexto afirma de más.`)
      } else if (!dice && auditoriaVeCapa) {
        F("C5-capa-componente", `\`comp:auditar\` ve capa de tokens de componente y el contexto declara \`capaDeComponente: no\`. Pegarlo así documentaría el componente consumiendo semánticos directos. Actualiza el contexto.`)
      } else {
        OK("C5-capa-componente", `Capa de componente declarada (${d.capaDeComponente}) y coherente con \`comp:auditar\``)
      }
    }
  }
}

/* ── C6 · Texto plano: nada de emojis ni caracteres invisibles ──────────
 * POR QUÉ EXISTE, y lo pidió el Lead el 7 de septiembre: el contexto se PEGA
 * en el plugin uSpec, y de ahí su contenido puede acabar en el `.md` y en la
 * página publicada. El riesgo no es que el extractor no lea un emoji: es que
 * SÍ lo reproduzca. Un emoji entrando por el insumo se salta la guarda de lo
 * que se publica, que mira la salida.
 *
 * Y hay un caso peor porque no se ve: el archivo llevaba un U+00AD (guion
 * suave) dentro de una palabra. No se ve, parte la palabra al renderizar y
 * rompe cualquier búsqueda sin que nadie entienda por qué.
 *
 * 🔴 ESTE CHECK CUENTA CARACTERES, NO INTERPRETA PROSA. Los dos intentos de
 * parsear frases fallaron en las dos direcciones posibles (ver C4). Contar
 * puntos de código no puede fallar en falso.
 *
 * La jerarquía se conserva en ASCII: [CRITICO] lo que NO se debe hacer,
 * [OJO] lo que hay que mirar con cuidado, [OK] lo que ya está resuelto. */
{
  // Español + tipografía deliberada. Todo lo demás fuera de ASCII es fallo.
  const PERMITIDOS = new Set([..."áéíóúüñÁÉÍÓÚÜÑ¿¡—·«»‘’“”"])
  const malos = new Map()
  const lineas = texto.split("\n")
  for (let i = 0; i < lineas.length; i++) {
    for (const ch of lineas[i]) {
      const cp = ch.codePointAt(0)
      if (cp < 128 || PERMITIDOS.has(ch)) continue
      const clave = `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`
      if (!malos.has(clave)) malos.set(clave, { n: 0, lineas: [] })
      const e = malos.get(clave)
      e.n++
      if (e.lineas.length < 3) e.lineas.push(i + 1)
    }
  }
  if (malos.size) {
    const det = [...malos.entries()].map(([k, v]) => `${k} x${v.n} (línea ${v.lineas.join(", ")})`).join(" · ")
    const total = [...malos.values()].reduce((a, b) => a + b.n, 0)
    F("C6-texto-plano", `${total} carácter(es) no ASCII fuera del español: ${det}. El contexto se PEGA en el plugin y puede acabar publicado. Usa los marcadores en texto plano — [CRITICO] lo que NO se debe hacer, [OJO] lo que hay que mirar, [OK] lo resuelto — y borra los invisibles (U+00AD guion suave, U+200B-200D, U+FEFF, U+FE0F).`)
  } else {
    OK("C6-texto-plano", "Texto plano: cero emojis y cero caracteres invisibles")
  }
}

/* ── Informe ─────────────────────────────────────────────────────────── */
const cobertura = [
  "🔴 NO CUBIERTO — este verificador no lee Figma. Comprueba coherencia entre el contexto y lo que las auditorías ya saben; una afirmación sobre la que ninguna auditoría opina pasa sin verificarse.",
  `🔴 NO CUBIERTO — la prosa sobre COLOR no se contrasta. C4 solo vigila 7 propiedades geométricas, porque son las que \`comp:auditar\` mide como binario crudo/bindeado.`,
  "🔴 NO CUBIERTO — que el contexto esté COMPLETO. Detecta lo que sobra y ha caducado, y desde C5 exige declarar la capa de componente; pero un dato NUEVO de cualquier otro tipo que nadie haya escrito sigue sin tener contra qué contrastarse. Un verde NO significa completo.",
  "🔴 NO CUBIERTO — que algo haya nacido en Figma después de la fecha de revisión. Este verificador no lee Figma, y `_base.json` no lleva fechas de nacimiento de tokens. La única defensa es la pregunta humana: ¿ha cambiado algo desde esa fecha?",
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
/* 🔴 EL VERDE NO PUEDE DECIR "listo para pegar".
 * El 7 de septiembre este script dio verde sobre un contexto al que le faltaba
 * la capa de componente entera, y el Lead se salvó porque preguntó — la segunda
 * vez que le salva la misma pregunta humana. Un verificador que no puede juzgar
 * completitud no debe imprimir una frase que se lee como si pudiera. */
const fechaTxt = fechaRevision ? fechaRevision.toISOString().slice(0, 10) : "(sin fecha)"
console.log(`\n🟢 Sin contradicciones detectables — ${oks.length} check(s) pasados.`)
console.log(`\n⚠️  ESTO NO DICE QUE EL CONTEXTO ESTÉ COMPLETO.`)
console.log(`   Detecta lo que sobra y lo que ha caducado; no puede ver lo que falta.`)
console.log(`   Antes de pegar, contesta a mano: ¿ha cambiado algo en Figma desde el ${fechaTxt}?`)
console.log(`   Si la respuesta es sí o no lo sabes, actualiza el contexto ANTES de extraer.`)
if (avisos.length) console.log(`\n⚠️  Y hay ${avisos.length} aviso(s) arriba sin resolver. Léelos: alguno puede pedir re-extraer.`)
