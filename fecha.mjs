/**
 * fecha.mjs — Toda fecha que lee un humano se emite en SU reloj, con la zona dicha.
 *
 * POR QUÉ EXISTE
 * --------------
 * El Lead: «ya van más de dos ocasiones que lees un horario que no corresponde a
 * lo que pasa en tiempo real». Tenía razón, y el diagnóstico tiene dos mitades
 * que conviene no mezclar:
 *
 *   1. LAS COMPARACIONES ESTABAN BIEN. Todas operan sobre epochs (`Date.parse`,
 *      `.getTime()`), así que un instante en UTC y otro en local se comparan
 *      correctamente. Ahí no había error de seis horas.
 *
 *   2. LA EMISIÓN ESTABA MAL, y de dos formas que sí producen fallos:
 *
 *      a) `comp:auditar` escribía `**Corrida:**` con `toISOString()` —UTC— y
 *         `uspec:contexto` la releía con `new Date(fecha + "T00:00:00")`, que es
 *         MEDIANOCHE LOCAL. Una auditoría corrida a las 19:00 de México se
 *         escribe como el día siguiente y C3 la lee como «un día después de la
 *         revisión»: fallo en falso, y del que nadie sospecharía.
 *
 *      b) `String(extraido).slice(0, 10)` toma los diez primeros caracteres del
 *         ISO, o sea el DÍA EN UTC. Una extracción de las 20:00 del día 6 en
 *         México se imprime como día 7. El humano lee un día que no ocurrió.
 *
 * LA REGLA: se guarda y se compara en UTC; se IMPRIME en la zona del Lead con la
 * etiqueta puesta. Un informe que lee una persona habla en su reloj.
 */

export const ZONA = "America/Mexico_City"

/** Epoch en ms desde un Date, un ISO string o un número. Robusto a los tres. */
export const aInstante = (x) => {
  if (x == null) return NaN
  if (x instanceof Date) return x.getTime()
  if (typeof x === "number") return x
  return Date.parse(String(x))
}

/** La etiqueta real de la zona en ese instante — no se asume, se pregunta. */
export const etiquetaZona = (x = Date.now()) => {
  const d = new Date(aInstante(x))
  const p = new Intl.DateTimeFormat("en-US", { timeZone: ZONA, timeZoneName: "longOffset" }).formatToParts(d)
  const bruto = p.find((q) => q.type === "timeZoneName")?.value ?? "GMT"
  return bruto.replace(/:00$/, "").replace(/GMT([+-])0(\d)/, "GMT$1$2")
}

const partes = (x) => {
  const d = new Date(aInstante(x))
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d)
  const g = (t) => f.find((q) => q.type === t)?.value ?? "??"
  return { y: g("year"), m: g("month"), d: g("day"), H: g("hour"), M: g("minute") }
}

/** `2026-09-07` — el día EN LA ZONA DEL LEAD, no en UTC. */
export const fechaLocal = (x) => {
  if (!Number.isFinite(aInstante(x))) return "(fecha ilegible)"
  const p = partes(x)
  return `${p.y}-${p.m}-${p.d}`
}

/** `2026-09-07 15:59 (GMT-6)` — lo que se imprime para un humano. */
export const selloLocal = (x) => {
  if (!Number.isFinite(aInstante(x))) return "(fecha ilegible)"
  const p = partes(x)
  return `${p.y}-${p.m}-${p.d} ${p.H}:${p.M} (${etiquetaZona(x)})`
}

/** Medianoche LOCAL de un `YYYY-MM-DD`, como instante. Para comparar días. */
export const desdeFechaLocal = (s) => {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return NaN
  const tentativo = Date.UTC(+m[1], +m[2] - 1, +m[3])
  const desfase = new Date(tentativo).getTime() - new Date(new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(tentativo)) + "T00:00:00Z").getTime()
  return tentativo + desfase
}
