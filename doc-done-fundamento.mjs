/**
 * doc-done-fundamento.mjs — la puerta de «documentación hecha» de un FUNDAMENTO.
 *
 * POR QUÉ EXISTE, y no es una copia de `doc:done`
 * -----------------------------------------------
 * `doc:done` encadena nueve condiciones y las nueve son de COMPONENTE. Un
 * fundamento no tiene variantes, ni estados, ni `component-health`, ni
 * especificación de uSpec: uSpec extrae componentes y no sabe leer una escala.
 * Correr la puerta de componente sobre una escala falla en D2 y no dice nada
 * útil sobre la escala.
 *
 * 🔴 LO QUE SÍ APLICA, y es lo que corre aquí:
 *   F1  las cuatro pestañas existen y ninguna está vacía
 *   F2  el `.md` convierte, valida, y sus bloques vivos resuelven tokens
 *   F3  ningún token citado en la prosa está retirado del sistema
 *   F4  escribir no perdió ningún ajuste de forma
 *   F5  el registro editorial V1–V7 está en umbral
 *
 * Y las tres que ningún comando puede comprobar van al final, siempre.
 *
 * 🔴 Sale con código 1 a la PRIMERA que falla. Un verificador que informa y sale
 * con 0 se ignora.
 *
 * 🔴 Declara cobertura `n de N` en cada condición que resuelve un conjunto. Un
 * método que resuelve una parte y no declara su cobertura se lee como si
 * hubiera resuelto todo, y ése es el fallo más caro de los tres de la regla 16.
 *
 * LA LECTURA ES LA AUTORITATIVA
 * `getFullDocumentationLegacyRepresentation`, no `getDocumentationStructure`
 * —que no devuelve `configuration` ni `groupBehavior`— y nunca el MCP Consumer,
 * que sirve una foto anterior.
 *
 *   npm run doc:done:fundamento -- --pagina=bordes
 *   npm run doc:done:fundamento -- --pagina=bordes --titulo=Bordes
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./experimento-canario/entorno.mjs"
import { spawnSync } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const ARG = (n) => process.argv.find(a => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=")
const SLUG = ARG("pagina") ?? "bordes"
const TITULO = ARG("titulo") ?? (SLUG.charAt(0).toUpperCase() + SLUG.slice(1))
const MD = path.join(AQUI, "Cimientos", `${SLUG}.md`)
const PESTANAS = ["Resumen general", "Usos", "Especificaciones", "Estatus y cambios"]

const correr = (bin, args) => {
  const r = spawnSync(bin, args, { cwd: AQUI, encoding: "utf8" })
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") }
}
const linea = (salida, re) => (salida.match(re) ?? [])[0]?.trim().replace(/\s+/g, " ").slice(0, 120)
  ?? "(el verificador no declaró cobertura)"

let corridas = 0
const ok = (id, que, detalle) => { console.log(`  ✓  ${id}  ${que}`); console.log(`        ${detalle}`); corridas++ }
const falla = (id, que, detalle) => {
  console.log(`  🔴 ${id}  ${que}`)
  for (const l of String(detalle).split("\n").slice(0, 10)) console.log(`        ${l.trim()}`)
  console.error(`\n🔴 Aborta en ${id}. No se sigue: una puerta que informa y continúa no es una puerta.\n`)
  process.exit(1)
}

console.log(`\n═══ doc:done:fundamento · «${TITULO}» — la puerta de un FUNDAMENTO ═══`)
console.log(`🔴 Esto NO es la puerta de componente. Las nueve de «doc:done» son de componente.`)
console.log(`   Un fundamento no tiene variantes, estados, component-health ni spec de uSpec.\n`)

if (!existsSync(MD)) {
  console.error(`🔴 No existe ${MD}. Sin insumo no hay nada que verificar.\n`)
  process.exit(1)
}
const bruto = readFileSync(MD, "utf8")

/* ── Conexión ──────────────────────────────────────────────────────────────── */
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

/* ── F1 · Las cuatro pestañas existen y ninguna está vacía ─────────────────── */
const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(from)
const todos = [...full.allGroups, ...full.allPages]
const candidatos = todos.filter(x => String(x.title).toLowerCase() === TITULO.toLowerCase())
if (candidatos.length !== 1) {
  falla("F1", "Las cuatro pestañas existen y ninguna está vacía",
    `${candidatos.length} ítem(s) titulados «${TITULO}» en el árbol. Se esperaba exactamente 1.`)
}
const grupo = candidatos[0]
if (grupo.groupBehavior !== "Tabs") {
  falla("F1", "Las cuatro pestañas existen y ninguna está vacía",
    `«${TITULO}» no es un grupo de pestañas (groupBehavior=${grupo.groupBehavior ?? "—"}).\n` +
    `npm run docs:pestanas -- --buscar="${TITULO}" --aplicar`)
}
const hojas = (grupo.childrenIds ?? [])
  .map(id => todos.find(x => x.persistentId === id || String(x.id) === String(id)))
  .filter(Boolean)
const presentes = PESTANAS.filter(p => hojas.some(h => h.title === p))
const conBloques = PESTANAS.filter(p => (hojas.find(h => h.title === p)?.blocks ?? []).length > 0)
if (presentes.length < PESTANAS.length || conBloques.length < PESTANAS.length) {
  falla("F1", "Las cuatro pestañas existen y ninguna está vacía",
    `presentes ${presentes.length} de ${PESTANAS.length} · con contenido ${conBloques.length} de ${PESTANAS.length}\n` +
    `vacías: ${PESTANAS.filter(p => !conBloques.includes(p)).join(" · ") || "—"}`)
}
const totalBloques = hojas.reduce((a, h) => a + (h.blocks ?? []).length, 0)
ok("F1", "Las cuatro pestañas existen y ninguna está vacía",
  `${presentes.length} de ${PESTANAS.length} presentes · ${conBloques.length} de ${PESTANAS.length} con contenido · ${totalBloques} bloques`)

/* ── F2 · Convierte, valida, y los bloques vivos resuelven ─────────────────── */
const r2 = correr("node", ["experimento-canario/publicar-cimientos.mjs", `--pagina=${SLUG}`, `--titulo=${TITULO}`])
if (r2.code !== 0) falla("F2", "El .md convierte, valida, y sus bloques vivos resuelven", r2.out)
const cob2 = linea(r2.out, /cobertura de conversión:[^\n]*/)
if (!/\d+ bloque\(s\) de tokens con [1-9]\d* tokens vivos/.test(cob2)) {
  falla("F2", "El .md convierte, valida, y sus bloques vivos resuelven",
    `Ningún bloque vivo resolvió tokens. Una escala documentada con una tabla escrita a mano caduca sin avisar.\n${cob2}`)
}
ok("F2", "El .md convierte, valida, y sus bloques vivos resuelven", cob2)

/* ── F3 · Ningún token citado está retirado ────────────────────────────────── */
/* 🔴 El universo son los nombres de token citados entre backticks con forma
 * `grupo/nombre`. Se contrastan contra el sistema VIVO, no contra un volcado:
 * un volcado prueba que el token existía el día que se volcó. */
const tokens = await sdk.tokens.getTokens(from)
const gruposToken = await sdk.tokens.getTokenGroups(from)
const grupoPorId = new Map(gruposToken.map(g => [g.id, g]))
const rutaDe = (t) => {
  const partes = []
  let g = grupoPorId.get(t.parentGroupId)
  while (g) { if (!g.isRoot) partes.unshift(g.name); g = grupoPorId.get(g.parentGroupId) }
  return partes.join("/")
}
const vivos = new Set(tokens.map(t => `${rutaDe(t)}/${t.name}`.replace(/^\//, "")))

/* 🔴 La tilde declara un token RETIRADO, y es la única forma de citar uno.
 * `~border/secondary` en el registro de cambios dice «esto ya no existe», y el
 * publicador la borra antes de escribir, así que la página sale limpia.
 *
 * La regla se comprueba en los dos sentidos, y el segundo es el que importa:
 * un token marcado como retirado que SIGUE VIVO también falla. Sin esa mitad,
 * la tilde sería un interruptor para apagar la comprobación. */
const citas = [...new Set((bruto.match(/`~?[a-zA-Z][\w.]*(?:\/[\w.]+)+`/g) ?? [])
  .map(s => s.replace(/`/g, "")))]
const citados = citas.filter(c => !c.startsWith("~"))
const declaradosMuertos = citas.filter(c => c.startsWith("~")).map(c => c.slice(1))
const retirados = citados.filter(c => !vivos.has(c))
const resucitados = declaradosMuertos.filter(c => vivos.has(c))
if (retirados.length || resucitados.length) {
  falla("F3", "Ningún token citado en la prosa está retirado",
    `${citados.length - retirados.length} de ${citados.length} citados vigentes · ` +
    `${declaradosMuertos.length - resucitados.length} de ${declaradosMuertos.length} declarados retirados\n` +
    (retirados.length ? `retirados sin declarar (márcalos con ~): ${retirados.join(" · ")}\n` : "") +
    (resucitados.length ? `declarados retirados y siguen vivos (quita la ~): ${resucitados.join(" · ")}` : ""))
}
ok("F3", "Ningún token citado en la prosa está retirado",
  `${citados.length} de ${citados.length} citados vivos · ${declaradosMuertos.length} de ${declaradosMuertos.length} declarados retirados y ausentes (${tokens.length} tokens censados)`)

/* ── F4 · Escribir no perdió nada ──────────────────────────────────────────── */
const r4 = correr("node", ["experimento-canario/respaldo-pagina.mjs", "--diff",
  `--componente=${SLUG}`, `--grupo=${grupo.persistentId}`])
if (r4.code !== 0) falla("F4", "Escribir no perdió ningún ajuste de forma", r4.out)
ok("F4", "Escribir no perdió ningún ajuste de forma", linea(r4.out, /cobertura:[^\n]*/))

/* ── F5 · El registro editorial ────────────────────────────────────────────── */
const r5 = correr("node", ["doc-registro.mjs", `Cimientos/${SLUG}.md`])
if (r5.code !== 0) falla("F5", "El registro editorial V1–V7 está en umbral",
  r5.out.split("\n").filter(l => /🔴/.test(l)).join("\n"))
ok("F5", "El registro editorial V1–V7 está en umbral", linea(r5.out, /\d+ de 4 reglas contables[^\n]*/))

/* ── Cierre ────────────────────────────────────────────────────────────────── */
const N = 5
console.log(`\n── cobertura de la puerta ──`)
console.log(`   ${corridas} de ${N} condiciones mecánicas comprobadas`)

console.log(`\n🔴 LAS TRES QUE ESTE COMANDO NO PUEDE COMPROBAR — las firma una persona, o no están hechas:`)
console.log(`   F6  Se verificó en PREVIEW, no en el editor`)
console.log(`        el editor no es fiel al resultado publicado (hallazgo del Lead, 8 sep 2026)`)
console.log(`   F7  Se miró el RENDER, no solo el árbol`)
console.log(`        el árbol de tokens decía #F9F9F9 y la página pintaba negro`)
console.log(`   F8  Cada bloque vivo está configurado, no solo colocado`)
console.log(`        un valor por defecto se publica igual que uno decidido: sin error y sin hueco visible`)

console.log(`\n⚠️ Lo que esta puerta NO cubre, declarado:`)
console.log(`   · que el criterio de uso sea el correcto. Lo lee una persona`)
console.log(`   · que los huecos declarados se hayan cerrado. Un hueco declarado pasa la puerta a propósito`)
console.log(`   · el puente a código. El exporter de 7.3 no ha corrido nunca\n`)

if (corridas < N) process.exitCode = 1
