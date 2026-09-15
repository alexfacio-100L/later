/**
 * doc-done.mjs — la segunda puerta, corrida.
 *
 * QUÉ ES
 * ------
 * El corredor de las condiciones MECÁNICAS de «cuándo la documentación está
 * hecha», definidas en `contexto/17-done-de-componente.md` del repo del área.
 *
 * 🔴 NO reimplementa ninguna verificación: encadena las que ya existen y lee su
 * código de salida. Duplicar la lógica sería tener dos verdades que se
 * desincronizan — que es el defecto que este proyecto lleva toda la semana
 * cazando en otras formas.
 *
 * 🔴 Y NO CIERRA EL COMPONENTE. Cierra la documentación de DISEÑO. El done
 * completo lo cierra Ingeniería al producirlo en Bricks UI — E11 de
 * `18-proceso-de-componente.md`. Un verde aquí no es «está todo bien».
 *
 * CÓMO SE CORRE
 *   npm run doc:done            # el Button
 *   npm run doc:done -- <slug>  # otro componente
 *
 * Sale con código 1 a la PRIMERA que falla. Un verificador que informa y sale
 * con 0 se ignora.
 */
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync } from "node:fs"

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const SLUG = process.argv.slice(2).find(a => !a.startsWith("--")) ?? "button"
const MD = path.join(AQUI, "Componentes", `${SLUG}.md`)

/**
 * Las nueve condiciones mecánicas de la segunda puerta.
 *
 * `cmd: null` significa **no encadenable hoy**, y se declara en la salida en vez
 * de omitirse. *Ocho de nueve declaradas es un resultado; ocho presentadas como
 * nueve es un falso completo.*
 *
 * `soloButton` marcaba las que leían rutas cableadas al canario. 🟢 **D4 y D6 se
 * parametrizaron el 14 sep 2026** y ya no lo necesitan; el mecanismo se conserva
 * porque el siguiente verificador que nazca cableado lo va a necesitar, y saltarse
 * una condición en silencio es peor que declararla saltada.
 */
const CONDICIONES = [
  { id: "D1", que: "El .md insumo está completo",
    cmd: ["node", ["completar-md.mjs", MD]] },
  { id: "D2", que: "El componente pasó la primera puerta",
    cmd: ["node", ["auditar-componente.mjs", SLUG]] },
  { id: "D3", que: "Ningún par de color incumple",
    cmd: ["node", ["contraste-real.mjs", SLUG]] },
  { id: "D4", que: "Ninguna imagen publicada está caducada",
    cmd: ["node", ["experimento-canario/verificar-frescura-frames.mjs", `--componente=${SLUG}`]] },
  { id: "D5", que: "Todo preview registrado está colocado o declarado fuera",
    cmd: ["node", [`plantilla-componente/${SLUG}-canario.mjs`]], grupo: "generador" },
  { id: "D6", que: "Escribir no perdió nada",
    cmd: ["node", ["experimento-canario/respaldo-pagina.mjs", "--diff", `--componente=${SLUG}`]] },
  { id: "D7", que: "Los anchos ajustados por el Lead se conservan",
    grupo: "generador" },
  { id: "D8", que: "Toda sección partida por un eje cumple el criterio de pestañas",
    grupo: "generador" },
  { id: "D9", que: "Los nombres coinciden con los oficiales de la documentación",
    cmd: null,
    porQueNo: "no existe verificador. Hoy se contrasta a mano contra el sidebar de Supernova. Es la única de las nueve sin mecánica" },
]

/** Las tres que NINGÚN comando puede comprobar. Se imprimen SIEMPRE, pase lo que pase. */
const NO_MECANIZABLES = [
  ["D10", "Se verificó en PREVIEW, no en el editor",
    "el editor no es fiel al resultado publicado (hallazgo del Lead, 8 sep 2026)"],
  ["D11", "Se miró el RENDER, no solo el árbol",
    "el árbol de tokens decía #F9F9F9 y la página pintaba negro; dos censos del mismo árbol se contradijeron"],
  ["D12", "Cada bloque vivo está configurado, no solo colocado",
    "un valor por defecto se publica igual que uno decidido: sin error y sin hueco visible"],
]

const correr = (bin, args) => {
  const r = spawnSync(bin, args, { cwd: AQUI, encoding: "utf8" })
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") }
}
/** La línea de cobertura que el verificador ya emite. No se recalcula: se cita. */
const cobertura = (salida) => {
  const m = salida.match(/(?:cobertura|Cobertura)[^\n]*|(\d+)\s+de\s+(\d+)[^\n]*/)
  return m ? m[0].trim().replace(/\s+/g, " ").slice(0, 110) : "(el verificador no declaró cobertura)"
}

console.log(`\n═══ doc:done · «${SLUG}» — la segunda puerta ═══`)
console.log(`Las condiciones mecánicas de «cuándo la documentación está hecha».`)
console.log(`🔴 Esto NO cierra el componente: cierra su documentación de diseño.\n`)

if (!existsSync(MD)) {
  console.error(`🔴 No existe ${MD}. Sin insumo no hay nada que verificar.`)
  process.exit(1)
}

let corridas = 0, saltadas = 0, sinMecanica = 0
let generadorYaCorrido = null

for (const c of CONDICIONES) {
  // Las tres del generador salen de UNA sola corrida: no se llama tres veces.
  if (c.grupo === "generador") {
    if (generadorYaCorrido === null) {
      if (!existsSync(path.join(AQUI, `plantilla-componente/${SLUG}-canario.mjs`))) {
        console.log(`  ⏭️  ${c.id}  ${c.que}`)
        console.log(`        SALTADA: no hay generador para «${SLUG}». Las tres del generador (D5, D7, D8) quedan sin comprobar.`)
        generadorYaCorrido = { saltado: true }
        saltadas++
        continue
      }
      generadorYaCorrido = correr("node", [`plantilla-componente/${SLUG}-canario.mjs`])
    }
    if (generadorYaCorrido.saltado) { saltadas++; continue }
    const g = generadorYaCorrido
    const linea = c.id === "D5" ? g.out.match(/Previews:[^\n]*/)
      : c.id === "D7" ? g.out.match(/anchos de tabla:[^\n]*/)
      : g.out.match(/criterio de pestañas[\s\S]{0,400}/)
    if (g.code !== 0) {
      console.log(`  🔴 ${c.id}  ${c.que}`)
      console.log(`        FALLA — el generador salió con código ${g.code}`)
      console.log(g.out.split("\n").filter(l => /🔴/.test(l)).slice(0, 6).map(l => "        " + l.trim()).join("\n"))
      console.error(`\n🔴 Aborta en ${c.id}. No se sigue: una puerta que informa y continúa no es una puerta.`)
      process.exit(1)
    }
    console.log(`  ✓  ${c.id}  ${c.que}`)
    console.log(`        ${linea ? linea[0].trim().replace(/\s+/g, " ").slice(0, 110) : "(sin línea de cobertura)"}`)
    corridas++
    continue
  }

  if (!c.cmd) {
    console.log(`  ⚠️  ${c.id}  ${c.que}`)
    console.log(`        SIN MECÁNICA: ${c.porQueNo}`)
    sinMecanica++
    continue
  }
  if (c.soloButton && SLUG !== "button") {
    console.log(`  ⏭️  ${c.id}  ${c.que}`)
    console.log(`        SALTADA: su verificador todavía lee rutas cableadas al Button. Parametrizarlo es tarea abierta.`)
    saltadas++
    continue
  }

  const r = correr(c.cmd[0], c.cmd[1])
  if (r.code !== 0) {
    console.log(`  🔴 ${c.id}  ${c.que}`)
    /* Se muestran las líneas que el verificador MARCÓ como fallo, no la cola de su
     * salida: la cola suele ser el resumen y deja fuera justo lo que falla. */
    const lineas = r.out.split("\n").filter(Boolean)
    const marcadas = lineas.filter(l => /🔴|<\s*\d|FALLA|no existe|Falta/i.test(l))
    console.log((marcadas.length ? marcadas.slice(0, 10) : lineas.slice(-8))
      .map(l => "        " + l.trim()).join("\n"))
    console.error(`\n🔴 Aborta en ${c.id}. No se sigue: una puerta que informa y continúa no es una puerta.`)
    process.exit(1)
  }
  console.log(`  ✓  ${c.id}  ${c.que}`)
  console.log(`        ${cobertura(r.out)}`)
  corridas++
}

console.log(`\n── cobertura de la puerta ──`)
console.log(`   ${corridas} de ${CONDICIONES.length} condiciones comprobadas · ${saltadas} saltadas · ${sinMecanica} sin mecánica`)

console.log(`\n🔴 LAS TRES QUE ESTE COMANDO NO PUEDE COMPROBAR — las firma una persona, o no están hechas:`)
for (const [id, que, porque] of NO_MECANIZABLES) {
  console.log(`   ${id}  ${que}`)
  console.log(`        ${porque}`)
}
console.log(`\n⚠️ Un verde aquí significa que las mecánicas pasan. NO significa «está todo bien».`)
console.log(`   Las tres de arriba son las que más caro han salido: el label negro cumplía 4,88:1 y era`)
console.log(`   inaceptable a la vista, y 23 de 23 previews servían URLs caducadas siendo el defecto un PNG.`)
console.log(`\n   Y esto cierra la documentación de DISEÑO. El done completo lo cierra Ingeniería en Bricks UI.\n`)
