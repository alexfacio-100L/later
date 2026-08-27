#!/usr/bin/env node
/**
 * Paso cero antes de correr uSpec. Si esto falla, no se arranca.
 *
 * Por qué existe
 * ──────────────
 * uSpec extrae de Figma y renderiza previews en Figma: **no hay corrida que
 * sobreviva a Figma caído.** Y una caída no se anuncia como caída — se anuncia
 * como timeouts intermitentes, que es lo que se confunde con un problema propio.
 *
 * El 26 ago 2026 los scripts contra Figma daban timeout. Se culpó al encargo
 * —«demasiadas variantes, agente saturado»— y se estuvo a punto de rediseñar una
 * tarea de 60 variantes. **Era una interrupción MAJOR del MCP de Figma**,
 * publicada en su status ese mismo día.
 *
 * Y el 20 ago se reinició el equipo buscando un fallo que estaba fuera: un
 * problema de peering hacia AWS Irlanda.
 *
 * 🔴 Dos veces en una semana se diagnosticó hacia dentro lo que estaba fuera.
 * Por eso esto es un script y no una recomendación: **una regla que exige que
 * alguien se acuerde, no se cumple.**
 *
 *   npm run preflight        → informa y sale con error si algo está caído
 *   npm run preflight -- --seguir  → informa pero deja pasar
 */

const ANSI = { ok: "\x1b[32m", mal: "\x1b[31m", aviso: "\x1b[33m", tenue: "\x1b[2m", fin: "\x1b[0m" }
const c = (col, t) => `${ANSI[col]}${t}${ANSI.fin}`
const SEGUIR = process.argv.includes("--seguir")

const traer = async (url, ms = 12000) => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try { return await (await fetch(url, { signal: ctrl.signal })).json() }
  finally { clearTimeout(t) }
}

/**
 * Figma es INDISPENSABLE: es la fuente de la extracción y donde se dibujan los
 * previews. Supernova es el destino y tiene contingencia (`DESTINO=figma`), así
 * que su caída avisa pero no detiene.
 */
const SERVICIOS = [
  { nombre: "Figma", api: "https://status.figma.com/api/v2", web: "https://status.figma.com/", bloquea: true },
  { nombre: "Supernova", api: "https://supernova.statuspage.io/api/v2", web: "https://supernova.statuspage.io", bloquea: false },
]

let bloqueado = false
let hayAvisos = false
console.log(`\n  ${c("tenue", "Preflight de uSpec — Figma es indispensable; Supernova tiene contingencia")}\n`)

for (const s of SERVICIOS) {
  try {
    const estado = await traer(`${s.api}/status.json`)
    const ind = estado?.status?.indicator ?? "?"
    const sano = ind === "none"
    if (!sano && s.bloquea) bloqueado = true
    if (!sano) hayAvisos = true
    console.log(`  ${sano ? c("ok", "🟢") : c("mal", "🔴")} ${s.nombre.padEnd(10)} ${estado?.status?.description ?? "?"}` +
      (s.bloquea ? c("tenue", "  · indispensable") : c("tenue", "  · tiene contingencia")))

    const inc = await traer(`${s.api}/incidents.json`)
    const limite = Date.now() - 48 * 60 * 60 * 1000
    for (const i of (inc?.incidents ?? []).filter(i => new Date(i.created_at).getTime() > limite)) {
      hayAvisos = true
      console.log(`     ${c("aviso", "⚠️")}  ${i.created_at.slice(0, 16)}  [${i.impact}]  ${i.name}`)
    }
  } catch (e) {
    // No poder consultar el status NO es lo mismo que el servicio estar caído.
    hayAvisos = true
    console.log(`  ${c("aviso", "⚠️")} ${s.nombre.padEnd(10)} no se pudo consultar su status (${e.name === "AbortError" ? "timeout" : e.message})`)
    console.log(`     ${c("tenue", "Puede ser tu red. Compruébalo a mano: " + s.web)}`)
  }
}

console.log("")
if (bloqueado) {
  console.log(c("mal", "  🔴 Figma tiene una interrupción activa. NO arranques uSpec: la extracción y los previews dependen de él."))
  console.log(c("tenue", "     A esperar. Con --seguir se ignora, bajo tu responsabilidad.\n"))
  if (!SEGUIR) process.exit(1)
} else if (hayAvisos) {
  console.log(c("aviso", "  ⚠️  Hay incidentes recientes. Si algo falla hoy, míralos antes de culpar al flujo propio.\n"))
} else {
  console.log(c("ok", "  🟢 Vía libre. Si algo falla, es nuestro.\n"))
}
