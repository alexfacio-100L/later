/**
 * verificar-orden-fundamento.mjs — en cada pestaña, el cuerpo va antes que el apartado.
 *
 * POR QUÉ EXISTE, y es un caso medido, no una precaución
 * -----------------------------------------------------
 * El 1 oct 2026 se publicó `Bordes` con `El contraste en producto digital` DELANTE
 * de `Accesibilidad de la escala`, que es cuerpo. **Pasó la puerta 5 de 5.**
 *
 * 🔴 El diff de respaldo no lo vio, y no es un fallo suyo: compara el CENSO de
 * propiedades por pestaña —cuántos rich-text, cuántas tablas, qué anchos— y mover
 * una sección no cambia ningún conteo. Salió verde con el orden invertido.
 *
 * Lo cazó una persona leyendo encabezados. Una regla que depende de que alguien
 * se acuerde de leer no se ejecuta, que es E3 del FODA. Esto la vuelve mecánica.
 *
 * LA REGLA QUE COMPRUEBA, y es la regla, no una lista fija de títulos
 * ------------------------------------------------------------------
 * El molde de fundamento dice: el cuerpo no nombra una tecnología ni un destino;
 * un apartado lo nombra en su título. De ahí sale esto, y nada más:
 *
 *   **En cada pestaña, una vez que aparece un apartado no puede volver a
 *     aparecer una sección de cuerpo.**
 *
 * No se comprueba un orden canónico, porque no lo hay: cada fundamento tiene los
 * apartados que tiene. Se comprueba que el cuerpo no quede detrás.
 *
 * ⚠️ UNA EXCEPCIÓN, Y VIENE DEL MOLDE, NO DE LA CONVENIENCIA. `Changelog` y
 * `Deprecación y migración` cierran la última pestaña por prescripción del molde.
 * Van al final siempre, también detrás de un apartado. Están en `CIERRES`.
 *
 * CÓMO RECONOCE UN APARTADO. Dos vías, y basta una:
 *   1. El título nombra un destino de `DESTINOS`.
 *   2. La sección contiene una Section de pestañas rotulada con `HERRAMIENTAS`.
 *
 * 🔴 La segunda no mira el título a propósito. El bloque de herramienta se llama
 * distinto en cada página —«Qué número teclear en cada herramienta» en `Bordes`,
 * «Cómo se expresa la escala en cada herramienta» en `Grillas`— y reconocerlo por
 * su contenido no envejece con la redacción.
 *
 * SOLO SE MIRA EL NIVEL 2. Un apartado puede agrupar sus partes en títulos de
 * nivel 3, y ésos viajan dentro de él. Mirar todos los niveles obligaría a que
 * cada subtítulo repitiera el nombre del destino.
 *
 * LA LECTURA ES LA AUTORITATIVA, y aquí importa más que de costumbre: el defecto
 * apareció en el ÁRBOL PUBLICADO, no en el `.md`. Se lee con
 * `getFullDocumentationLegacyRepresentation` y `getDocumentationContentRaw`,
 * nunca con el MCP Consumer, que sirve una foto anterior.
 *
 *   node verificar-orden-fundamento.mjs --titulo=Bordes
 *   node verificar-orden-fundamento.mjs --titulo=Bordes --simular=cuerpo-detras
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { HERRAMIENTAS } from "./plantilla-componente/pestanas-plataforma.mjs"

const { Supernova } = sdkPkg
const ARG = (n) => process.argv.find(a => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=")
const TITULO = ARG("titulo") ?? "Bordes"
const SIMULAR = ARG("simular")

/** Los destinos que un apartado puede nombrar. Si entra uno nuevo, entra aquí. */
export const DESTINOS = ["producto digital", "marketing", "impresos", "impreso"]

/* La regla de reparto habla de DOS cosas, no de una: el cuerpo no nombra una
 * tecnología NI un destino. Así que una herramienta nombrada en el título marca
 * apartado igual que un destino. */
export const TECNOLOGIAS = ["herramienta", ...HERRAMIENTAS]

/** Las dos que el molde fija al final de la última pestaña. */
export const CIERRES = ["changelog", "deprecación y migración", "deprecacion y migracion"]

const limpio = (s) => String(s ?? "").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim()

/** Un título nombra un destino o una tecnología declarada. */
export const nombraDestino = (titulo) =>
  [...DESTINOS, ...TECNOLOGIAS].some(d => limpio(titulo).includes(limpio(d)))

export const esCierre = (titulo) => CIERRES.some(c => limpio(titulo) === limpio(c))

/**
 * Clasifica las secciones de nivel 2 de una pestaña.
 * Función pura sobre la lista de bloques, para poder probarla sin red.
 * @returns {{titulo: string, clase: "cuerpo"|"apartado"|"cierre"}[]}
 */
export const clasificar = (items) => {
  const out = []
  let actual = null
  const cerrar = () => { if (actual) out.push(actual) }
  for (const it of items ?? []) {
    if (it?.data?.packageId === "io.supernova.block.title2") {
      cerrar()
      const t = (it.data.items?.[0]?.props?.text?.value?.spans ?? []).map(s => s?.text ?? "").join("").trim()
      actual = { titulo: t, clase: esCierre(t) ? "cierre" : (nombraDestino(t) ? "apartado" : "cuerpo") }
      continue
    }
    if (!actual) continue
    /* Vía 2: la sección contiene las pestañas de herramienta. No mira el título. */
    if (it?.type === "Section") {
      const rotulos = (it.items ?? []).map(x => limpio(x?.title))
      const esHerramienta = HERRAMIENTAS.every(h => rotulos.includes(limpio(h)))
      if (esHerramienta && actual.clase === "cuerpo") actual.clase = "apartado"
    }
  }
  cerrar()
  return out
}

/**
 * La regla. Devuelve null si la pestaña está en orden, o el detalle del fallo.
 * 🔴 Dice qué esperaba y qué encontró. «Orden incorrecto» obliga a adivinar.
 */
export const primeraInfraccion = (secciones) => {
  let apartadoVisto = null
  for (const s of secciones) {
    if (s.clase === "apartado") { apartadoVisto ??= s.titulo; continue }
    if (s.clase === "cierre") continue
    if (apartadoVisto) {
      return {
        cuerpo: s.titulo,
        apartado: apartadoVisto,
        esperado: `«${s.titulo}» es cuerpo, así que va ANTES de «${apartadoVisto}»`,
        encontrado: `«${s.titulo}» aparece DESPUÉS de «${apartadoVisto}», que es apartado`,
      }
    }
  }
  return null
}

/* ── Modo simulación: la prueba negativa, sin publicar nada roto ───────────── */
if (SIMULAR === "cuerpo-detras") {
  const falso = [
    { titulo: "Los seis grosores", clase: "cuerpo" },
    { titulo: "El contraste en producto digital", clase: "apartado" },
    { titulo: "Accesibilidad de la escala", clase: "cuerpo" },
    { titulo: "Changelog", clase: "cierre" },
  ]
  const f = primeraInfraccion(falso)
  if (!f) { console.error("🔴 La simulación NO falló. La condición no sirve."); process.exit(1) }
  console.log("── simulación de una pestaña mal ordenada ──")
  console.log(`   esperado:   ${f.esperado}`)
  console.log(`   encontrado: ${f.encontrado}`)
  console.log("🟢 La condición detecta el defecto que ya ocurrió una vez.")
  process.exit(0)
}

/* ── Lectura autoritativa ──────────────────────────────────────────────────── */
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(from)

const grupo = full.allGroups.find(g => limpio(g.title) === limpio(TITULO))
if (!grupo) {
  console.error(`🔴 No hay ningún grupo titulado «${TITULO}». Sin destino no hay nada que verificar.`)
  process.exit(1)
}
/* ⚠️ `childrenIds` trae persistentIds, no ids. Emparejar por `id` devuelve cero
 * hojas y se lee como «el grupo está vacío», que es un falso negativo de manual. */
const hojas = grupo.childrenIds
  .map(cid => full.allPages.find(p => String(p.persistentId) === String(cid)))
  .filter(Boolean)

if (hojas.length !== grupo.childrenIds.length) {
  console.error(`🔴 ${hojas.length} de ${grupo.childrenIds.length} pestañas resueltas. No se verifica sobre un universo incompleto.`)
  process.exit(1)
}

console.log(`\n═══ orden de «${TITULO}» · el cuerpo va antes que el apartado ═══\n`)

let conformes = 0
const fallos = []
for (const h of hojas) {
  const raw = await sdk.documentation.getDocumentationContentRaw(from, h.id)
  const o = typeof raw === "string" ? JSON.parse(raw) : raw
  const secs = clasificar(o?.data?.items)
  const f = primeraInfraccion(secs)
  const marca = { cuerpo: "·", apartado: "▸", cierre: "=" }
  console.log(`  ${f ? "🔴" : "✓"}  «${h.title}»`)
  for (const s of secs) console.log(`        ${marca[s.clase]} ${s.clase.padEnd(8)} ${s.titulo}`)
  if (f) {
    console.log(`        esperado:   ${f.esperado}`)
    console.log(`        encontrado: ${f.encontrado}`)
    fallos.push(`«${h.title}»: ${f.encontrado}`)
  } else conformes++
}

console.log(`\ncobertura de orden: ${conformes} de ${hojas.length} pestañas en orden`)
if (fallos.length) {
  console.error(`\n🔴 ${fallos.length} pestaña(s) con el cuerpo detrás de un apartado:`)
  for (const f of fallos) console.error(`   ${f}`)
  console.error(`\n   La regla: una vez que aparece un apartado, no vuelve a aparecer cuerpo.`)
  console.error(`   Excepciones del molde, que sí van al final: ${CIERRES.slice(0, 2).join(" · ")}.`)
  process.exit(1)
}
console.log(`🟢 En las ${hojas.length} pestañas el cuerpo va delante.`)
