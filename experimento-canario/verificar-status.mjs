#!/usr/bin/env node
/**
 * ¿Está caído el servicio, o está roto lo nuestro?
 *
 * Por qué existe
 * ──────────────
 * El 26 ago 2026 los scripts contra Figma empezaron a devolver timeout. Se
 * diagnosticó como problema del encargo —demasiadas variantes, agente saturado—
 * y se estuvo a punto de rediseñar la tarea. Al día siguiente el Lead miró el
 * status page: **«Figma MCP Disruption», impacto MAJOR, ese mismo día.**
 *
 * Es la regla 14 del área aplicada a la disponibilidad: *consulta la herramienta
 * antes de llamarle fallo*. Un servicio caído no es un bug propio, y confundirlos
 * cuesta un rediseño que no hacía falta.
 *
 * 🔴 Correr esto ANTES de dar por roto cualquier flujo de Figma o Supernova.
 *
 *   node verificar-status.mjs
 */

const SERVICIOS = [
  { nombre: "Figma",     api: "https://status.figma.com/api/v2",        web: "https://status.figma.com/" },
  { nombre: "Supernova", api: "https://supernova.statuspage.io/api/v2", web: "https://supernova.statuspage.io" },
]

const ANSI = { ok: "\x1b[32m", mal: "\x1b[31m", aviso: "\x1b[33m", tenue: "\x1b[2m", fin: "\x1b[0m" }
const c = (col, t) => `${ANSI[col]}${t}${ANSI.fin}`

/** `none` es lo normal; cualquier otro indicador merece mirarse antes de seguir. */
const SANO = "none"

const traer = async (url) => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try { return await (await fetch(url, { signal: ctrl.signal })).json() }
  finally { clearTimeout(t) }
}

let algoMal = false
console.log("")

for (const s of SERVICIOS) {
  try {
    const estado = await traer(`${s.api}/status.json`)
    const ind = estado?.status?.indicator ?? "?"
    const desc = estado?.status?.description ?? "sin descripción"
    const sano = ind === SANO
    if (!sano) algoMal = true
    console.log(`  ${sano ? c("ok", "🟢") : c("mal", "🔴")} ${s.nombre.padEnd(10)} ${desc}  ${c("tenue", `· ${ind}`)}`)

    // Un incidente de las últimas 48 h explica un fallo de ayer aunque hoy esté verde.
    const inc = await traer(`${s.api}/incidents.json`)
    const limite = Date.now() - 48 * 60 * 60 * 1000
    const recientes = (inc?.incidents ?? []).filter(i => new Date(i.created_at).getTime() > limite)
    for (const i of recientes) {
      algoMal = true
      console.log(`     ${c("aviso", "⚠️")}  ${i.created_at.slice(0, 16)}  [${i.impact}]  ${i.name}`)
    }
  } catch (e) {
    algoMal = true
    console.log(`  ${c("mal", "🔴")} ${s.nombre.padEnd(10)} no se pudo consultar el status — ${e.name === "AbortError" ? "timeout" : e.message}`)
    console.log(`     ${c("tenue", s.web)}`)
  }
}

console.log("")
console.log(algoMal
  ? c("aviso", "  ⚠️  Hay algo que mirar antes de dar por roto un flujo propio.\n")
  : c("tenue", "  Los servicios están sanos: si algo falla, es nuestro.\n"))
