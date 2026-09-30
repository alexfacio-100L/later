/**
 * publicar-cimientos.mjs — escribe una página de FUNDAMENTO desde su `.md`.
 *
 * QUÉ CONSTRUYE
 *   Cimientos / Lenguaje Visual / Visual / <Fundamento>   ← grupo de 4 pestañas
 *     ├── Resumen general
 *     ├── Usos
 *     ├── Especificaciones
 *     └── Estatus y cambios
 *
 * Copia estructural de `publicar-aplicaciones.mjs`, con dos diferencias que el
 * género de fundamento obliga:
 *
 *  1. UN `.md`, CUATRO PESTAÑAS. Los encabezados de nivel 1 del `.md` son los
 *     cortes. Cada `# <nombre>` abre una pestaña y su texto es el nombre. La
 *     alternativa era cuatro archivos, y parte el documento que alguien escribe.
 *
 *  2. LOS TOKENS NO SE ESCRIBEN A MANO. El `.md` lleva `<SNTokens coleccion=…
 *     grupo=… />` y aquí se resuelve contra el sistema vivo, sustituyéndolo por
 *     un bloque `design-tokens` con los `entityId` reales.
 *     🔴 Los ids NUNCA van en el `.md`. Un id escrito a mano es un hecho que
 *     caduca sin avisar, y la página lo publica sin error y sin hueco visible.
 *
 * 🔴 NO CREA LAS PESTAÑAS. Si el destino todavía es una hoja suelta, aborta y
 * dice el comando exacto. Crear estructura es trabajo de `crear-pestanas.mjs`,
 * que ya lo hace y es idempotente. Dos guiones que crean lo mismo se
 * desincronizan, que es el defecto que este repo lleva semanas cazando.
 *
 * ⚠️ `docs:pestanas` RENOMBRA la hoja original a la primera pestaña, y el grupo
 * nuevo hereda el nombre de la hoja. Es el comportamiento de la API, no un fallo.
 *
 * LA LECTURA ES LA AUTORITATIVA
 * `getDocumentationStructure` no devuelve `configuration` ni `groupBehavior`, así
 * que no distingue un grupo de pestañas de un grupo normal. Se usa
 * `getFullDocumentationLegacyRepresentation`. Y no se verifica nada con el MCP
 * Consumer: sirve una foto anterior.
 *
 *   npm run docs:cimientos -- --pagina=bordes              # valida, no escribe
 *   npm run docs:cimientos -- --pagina=bordes --escribir   # escribe (queda en PREVIEW)
 *
 * La publicación a Live la hace el Lead.
 */
import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
import { convertir } from "./conversor.mjs"
import { aplicarPestanas, GRUPOS_FUNDAMENTO, HERRAMIENTAS } from "../plantilla-componente/pestanas-plataforma.mjs"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const { Supernova } = sdkPkg
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const ESCRIBIR = process.argv.includes("--escribir")
const ARG = (n) => process.argv.find(a => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=")
const SLUG = ARG("pagina") ?? "bordes"

/**
 * 🔴 MODO MOLDE. El molde es otro género que una página publicada: lleva
 * marcadores entre corchetes e instrucciones a quien lo duplica, y su
 * `<SNTokens/>` no apunta a ninguna colección real. Resolverlo daría cero
 * tokens y el publicador abortaría, con razón.
 *
 * Con `--molde` el marcador se sustituye por un callout que explica la
 * notación, y al terminar el grupo y sus pestañas se OCULTAN. La plantilla
 * existe en el editor para duplicarla; no se publica al sitio.
 *
 * Es el patrón de `_Application Documentation Template` y de
 * `_Component Documentation Template`. ⚠️ El `_` del título lo añade la API a
 * lo oculto: es marcador, no parte del nombre.
 */
const MOLDE = process.argv.includes("--molde")
const TITULO_MOLDE = "Foundation Documentation Template"
/* Dentro de `Cimientos`, a primer nivel, igual que el de aplicación cuelga de
 * `Aplicaciones`. NO junto a `Bordes`: un molde no es un fundamento. */
const PADRE_MOLDE = "8374f4ae-075f-4b18-adb5-c24971f1f803"

/** Las cuatro pestañas canónicas, las mismas que `crear-pestanas.mjs`. */
const PESTANAS = ["Resumen general", "Usos", "Especificaciones", "Estatus y cambios"]

/* ── El `.md` ──────────────────────────────────────────────────────────────── */
const MD = path.join(AQUI, "../Cimientos", MOLDE ? "plantilla-fundamento.md" : `${SLUG}.md`)
if (!existsSync(MD)) {
  console.error(`🔴 No existe ${MD}. Sin insumo no hay nada que publicar.`)
  process.exit(1)
}
/* 🔴 La tilde dentro de backticks declara un token RETIRADO: `~border/secondary`.
 * La comprueba `doc:done:fundamento`, y aquí se borra antes de convertir para
 * que la página publicada no muestre un carácter de notación interna. */
const bruto = readFileSync(MD, "utf8").replace(/`~([a-zA-Z][\w.]*(?:\/[\w.]+)+)`/g, "`$1`")

/**
 * Trocea por encabezados de nivel 1. Devuelve `[{ nombre, md }]` en el orden del
 * archivo, que es el orden en que se leen las pestañas.
 */
const trocear = (texto) => {
  const trozos = []
  let actual = null
  for (const linea of texto.split("\n")) {
    const h1 = linea.match(/^# (.+)$/)
    if (h1) { actual = { nombre: h1[1].trim(), lineas: [] }; trozos.push(actual); continue }
    if (actual) actual.lineas.push(linea)
  }
  return trozos.map(t => ({ nombre: t.nombre, md: t.lineas.join("\n").trim() }))
}
const trozos = trocear(bruto)

/* 🔴 Cobertura del troceo, y falla ruidosamente. Un `.md` con tres H1 produciría
 * tres pestañas bien formadas y la cuarta se perdería en silencio: es la forma
 * «falso completo» de la regla 16, la que no deja ninguna frase que revisar. */
console.log(`\n═══ docs:cimientos · «${SLUG}» ═══`)
console.log(`pestañas en el .md: ${trozos.length} de ${PESTANAS.length} — ${trozos.map(t => t.nombre).join(" · ")}`)
const faltan = PESTANAS.filter(p => !trozos.some(t => t.nombre === p))
const sobran = trozos.filter(t => !PESTANAS.includes(t.nombre)).map(t => t.nombre)
if (faltan.length || sobran.length) {
  if (faltan.length) console.error(`🔴 Faltan en el .md: ${faltan.join(" · ")}`)
  if (sobran.length) console.error(`🔴 No son pestañas canónicas: ${sobran.join(" · ")}`)
  process.exit(1)
}

/* ── Conexión ──────────────────────────────────────────────────────────────── */
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d => /later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }

/* ── Los tokens vivos ──────────────────────────────────────────────────────── */
const propiedades = await sdk.tokens.getTokenProperties(from)
const propColeccion = propiedades.find(p => p.codeName === "collection")
const opciones = new Map((propColeccion?.options ?? []).map(o => [o.id, o.name]))
const todosTokens = await sdk.tokens.getTokens(from)
const gruposToken = await sdk.tokens.getTokenGroups(from)
const grupoPorId = new Map(gruposToken.map(g => [g.id, g]))

/** La ruta de grupo de un token, sin la raíz. `border/primary` → `border`. */
const rutaDe = (t) => {
  const partes = []
  let g = grupoPorId.get(t.parentGroupId)
  while (g) { if (!g.isRoot) partes.unshift(g.name); g = grupoPorId.get(g.parentGroupId) }
  return partes.join("/")
}
/* 🔴 La colección se lee por `propertyValues["collection"]`, no por `property.id`.
 * Leerla por el id devuelve vacío en los 858 tokens, y un vacío se lee
 * exactamente igual que una ausencia real. Verificado el 30 sep 2026. */
const coleccionDe = (t) =>
  opciones.get(t.propertyValues?.collection ?? t.propertyValues?.[propColeccion?.id])

const temas = await sdk.tokens.getTokenThemes(from)
const temaPorNombre = new Map(temas.map(t => [String(t.name).toLowerCase(), t.id]))

/**
 * Sustituye cada `<SNTokens … />` por un bloque `design-tokens` con los ids
 * reales. Se aplica DESPUÉS de `convertir()`: el conversor deja intactas las
 * etiquetas que empiezan por `SN`, y así el bloque no pasa por su reescritura.
 *
 * Declara cobertura por marcador y falla si alguno resuelve cero tokens. Un
 * bloque vacío se publica sin error y sin hueco visible.
 */
const MARCADOR = /<SNTokens\s+([^>]*?)\/>/g
const atributos = (s) => Object.fromEntries(
  [...s.matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], m[2]]))

const CALLOUT_MARCADOR = [
  `<SNCallout type="Info">`,
  `**Aquí va el bloque vivo de tokens.** Sustituye el marcador por`,
  `\`<SNTokens coleccion="border" grupo="width" titulo="Grosores de borde" />\`, con la colección y el`,
  `grupo del fundamento. El publicador lo resuelve contra el sistema y emite el bloque \`design-tokens\``,
  `con los ids reales. Para una familia de color añade \`modes="light,dark"\`.`,
  `</SNCallout>`,
].join("\n")

const resolverTokens = (mdx, dondeDice) => {
  /* 🔴 En modo molde el marcador NO se resuelve: se explica. Un marcador de
   * plantilla no apunta a ninguna colección real. */
  if (MOLDE) {
    const n = (mdx.match(MARCADOR) ?? []).length
    console.log(`      marcador de tokens · ${n} explicado(s), 0 resuelto(s): es una plantilla`)
    return { mdx: mdx.replace(MARCADOR, CALLOUT_MARCADOR), marcadores: n, tokens: 0 }
  }
  const informe = []
  const salida = mdx.replace(MARCADOR, (_, attrs) => {
    const a = atributos(attrs)
    const elegidos = todosTokens
      .filter(t => coleccionDe(t) === a.coleccion && rutaDe(t) === a.grupo)
      .sort((x, y) => String(x.name).localeCompare(String(y.name)))
    informe.push({ ...a, n: elegidos.length })
    if (!elegidos.length) return `<!-- SNTokens sin resolver -->`
    const valor = JSON.stringify(elegidos.map(t => ({ entityId: t.id, entityType: "Token" })))
    /* Los swatches solo se emiten si la sección declara modes: una columna de
     * mode vacía de sentido es un ajuste que nadie tomó. */
    const modes = (a.modes ?? "").split(",").map(s => s.trim()).filter(Boolean)
    const desconocidos = modes.filter(m => !temaPorNombre.has(m.toLowerCase()))
    if (desconocidos.length) {
      console.error(`🔴 Mode(s) sin tema en Supernova: ${desconocidos.join(", ")}.`)
      console.error(`   Conocidos: ${[...temaPorNombre.keys()].join(", ")}`)
      process.exit(1)
    }
    const swatches = modes.length
      ? ` swatches={${JSON.stringify(modes.map((m, i) => ({
          id: i === 0 ? "swatch-0" : `swatch-${m}`,
          selectedThemeIds: [temaPorNombre.get(m.toLowerCase())],
        })))}}`
      : ""
    /* 🔴 `design-tokens` NO acepta la propiedad `title`: responde
     * `UnknownPropertyKey` al validar. El título del bloque es el encabezado de
     * markdown que lo precede en el `.md`. El atributo `titulo` del marcador
     * queda como etiqueta de la línea de cobertura, y no se emite. */
    return [
      `<SNBlock packageId="io.supernova.block.design-tokens" variantId="table">`,
      `  <SNItem>`,
      `    <SNProp name="tokens" value={${valor}}${swatches} />`,
      `  </SNItem>`,
      `</SNBlock>`,
    ].join("\n")
  })
  for (const i of informe) {
    const etiqueta = `${i.coleccion}/${i.grupo}`
    if (!i.n) {
      console.error(`🔴 «${dondeDice}» · ${etiqueta}: 0 tokens. El bloque quedaría vacío.`)
      process.exit(1)
    }
    console.log(`      tokens vivos · ${etiqueta}: ${i.n} resueltos${i.modes ? ` · modes ${i.modes}` : ""}`)
  }
  return { mdx: salida, marcadores: informe.length, tokens: informe.reduce((a, b) => a + b.n, 0) }
}

/* ── El destino ────────────────────────────────────────────────────────────── */
const full = await sdk.documentation.getFullDocumentationLegacyRepresentation(from)
const todos = [...full.allGroups, ...full.allPages]
const porPid = new Map(todos.map(x => [x.persistentId, x]))
const porId = new Map(todos.map(x => [String(x.id), x]))
const get = (id) => porPid.get(id) ?? porId.get(String(id))
const esGrupo = new Set(full.allGroups.map(x => x.persistentId))

/** El título que busca en el árbol. Por defecto, el slug con la primera en alta. */
const TITULO = MOLDE ? TITULO_MOLDE : (ARG("titulo") ?? (SLUG.charAt(0).toUpperCase() + SLUG.slice(1)))
/* ⚠️ El `_` delante del título lo añade la API a lo oculto. Se compara sin él. */
const limpio = (t) => String(t).replace(/^_/, "").toLowerCase()
const candidatos = todos.filter(x => limpio(x.title) === limpio(TITULO))
if (!candidatos.length && MOLDE) {
  if (!ESCRIBIR) {
    console.error(`\n🔴 No existe «${TITULO_MOLDE}». Se creará con --escribir, y después hay que darle pestañas:`)
    console.error(`     npm run docs:cimientos -- --molde --escribir`)
    console.error(`     npm run docs:pestanas -- --buscar="${TITULO_MOLDE}" --aplicar`)
    console.error(`     npm run docs:cimientos -- --molde --escribir\n`)
    process.exit(1)
  }
  const nuevo = await sdk.documentation.createDocumentationPage(from, {
    parentPersistentId: PADRE_MOLDE, title: TITULO_MOLDE,
  })
  console.error(`\n  + creada la hoja «${TITULO_MOLDE}» (${nuevo}) dentro de «Cimientos».`)
  console.error(`\n🔴 Ahora dale sus cuatro pestañas y vuelve a correr esto:`)
  console.error(`     npm run docs:pestanas -- --buscar="${TITULO_MOLDE}" --aplicar`)
  console.error(`     npm run docs:cimientos -- --molde --escribir\n`)
  process.exit(1)
}
if (!candidatos.length) {
  console.error(`🔴 No hay ningún ítem titulado «${TITULO}» en el árbol. NO se crea: la navegación no se toca.`)
  process.exit(1)
}
if (candidatos.length > 1) {
  console.error(`🔴 Hay ${candidatos.length} ítems titulados «${TITULO}». Pasa --titulo o desambigua a mano.`)
  process.exit(1)
}
const destino = candidatos[0]

if (!esGrupo.has(destino.persistentId) || destino.groupBehavior !== "Tabs") {
  console.error(`\n🔴 «${TITULO}» todavía no es un grupo de pestañas.`)
  console.error(`   Hoy es: ${esGrupo.has(destino.persistentId) ? `grupo con behavior «${destino.groupBehavior}»` : "una hoja suelta"}`)
  console.error(`\n   Créalas primero, que es idempotente:`)
  console.error(`     npm run docs:pestanas -- --buscar="${TITULO}" --aplicar`)
  console.error(`\n   ⚠️ Eso RENOMBRA la hoja original a «${PESTANAS[0]}» y el grupo hereda «${TITULO}».`)
  console.error(`      Es el comportamiento de la API.`)
  process.exit(1)
}

const hojas = (destino.childrenIds ?? []).map(get).filter(Boolean)
const hojaPorNombre = new Map(hojas.map(h => [h.title, h]))
console.log(`\ndestino: grupo «${destino.title}» (${destino.persistentId}) · ${hojas.length} pestaña(s): ${hojas.map(h => h.title).join(" · ")}`)

const sinDestino = PESTANAS.filter(p => !hojaPorNombre.has(p))
if (sinDestino.length) {
  console.error(`🔴 Faltan ${sinDestino.length} de ${PESTANAS.length} pestañas en el árbol: ${sinDestino.join(" · ")}`)
  console.error(`   npm run docs:pestanas -- --buscar="${TITULO}" --aplicar`)
  process.exit(1)
}

/* ── Convertir y validar ───────────────────────────────────────────────────── */
console.log(`\n── conversión y validación ──`)
let totalBloques = 0, totalTablas = 0, totalMarcadores = 0, totalTokens = 0
for (const t of trozos) {
  const { mdx: crudo, informe } = convertir(t.md)
  const r = resolverTokens(crudo, t.nombre)
  t.mdx = r.mdx
  totalMarcadores += r.marcadores
  totalTokens += r.tokens
  totalTablas += informe.tablas

  /* 🔴 Las pipe tables validan y se publican como TEXTO PLANO. Si el .md tiene
   * separadores de tabla y el conversor no emitió ninguna, algo se perdió. */
  if (!informe.tablas && /\|\s*---/.test(t.md)) {
    console.error(`🔴 «${t.nombre}» tiene pipe tables y el conversor no emitió ninguna <SNTable>.`)
    process.exit(1)
  }

  const val = await sdk.import.validateMarkdown(from, t.mdx)
  if (!val.isValid) {
    console.error(`✗ «${t.nombre}»: ${String(val.error?.message).replace(/\s+/g, " ").slice(0, 260)}`)
    process.exit(1)
  }
  t.bloques = val.blockCount
  totalBloques += val.blockCount
  console.log(`  ✓ «${t.nombre}» — ${val.blockCount} bloques · ${informe.tablas} tabla(s) · ${informe.callouts} callout(s)`)
}
console.log(`\ncobertura de conversión: ${trozos.length} de ${PESTANAS.length} pestañas · ${totalBloques} bloques · ${totalTablas} tablas · ${totalMarcadores} bloque(s) de tokens con ${totalTokens} tokens vivos`)

if (!ESCRIBIR) {
  console.log(`\nNo se escribió nada. Para publicarlo: npm run docs:cimientos -- --pagina=${SLUG} --escribir\n`)
  process.exit(0)
}

/* ── Escribir ──────────────────────────────────────────────────────────────── */
console.log(`\n── escritura ──`)
let escritas = 0
for (const t of trozos) {
  const hoja = hojaPorNombre.get(t.nombre)
  await sdk.import.writeMarkdownToPage(from, String(hoja.id), t.mdx)
  escritas++
  console.log(`  ✓ escrita «${t.nombre}» (${hoja.id})`)
}

/* ── Releer, que es lo único que prueba el efecto ──────────────────────────── */
const full2 = await sdk.documentation.getFullDocumentationLegacyRepresentation(from)
const todos2 = [...full2.allGroups, ...full2.allPages]
const porPid2 = new Map(todos2.map(x => [x.persistentId, x]))
const destino2 = porPid2.get(destino.persistentId)
const hojas2 = (destino2?.childrenIds ?? [])
  .map(id => todos2.find(x => x.persistentId === id || String(x.id) === String(id)))
  .filter(Boolean)

console.log(`\n── relectura ──`)
let verificadas = 0, tablasVivas = 0, tokensVivos = 0
for (const t of trozos) {
  const hoja = hojas2.find(h => h.title === t.nombre)
  const bloques = hoja?.blocks ?? []
  const tablas = bloques.filter(b => /table/i.test(b.packageId ?? b.type ?? "")).length
  const tokens = bloques.filter(b => /design-tokens/i.test(b.packageId ?? "")).length
  tablasVivas += tablas
  tokensVivos += tokens
  const ok = bloques.length > 0
  if (ok) verificadas++
  console.log(`  ${ok ? "✓" : "🔴"} «${t.nombre}» — ${bloques.length} bloques en la página releída (emitidos ${t.bloques})`)
}
console.log(`\ncobertura de escritura: ${escritas} de ${PESTANAS.length} escritas · ${verificadas} de ${PESTANAS.length} con contenido al releer`)

/* ── Las pestañas por HERRAMIENTA dentro de `Especificaciones` ─────────────────
 *
 * 🔴 NO se puede emitir desde Markdown, y conviene saber por qué antes de
 * buscarle sintaxis. Una pestaña de DENTRO de una página no es un bloque: es una
 * `Section` que envuelve bloques, y `writeMarkdownToPage` solo emite bloques.
 * Lo confirma la plataforma viva, no un recuerdo: el 30 sep 2026 el barrido de
 * las 158 páginas encontró 9 Sections de tipo `Tabs`, las 9 en la
 * `Especificaciones` del Button, ninguna nacida de un `.md`.
 *
 * ⚠️ Y hay algo peor: `writeMarkdownToPage` REEMPLAZA la página entera, así que
 * la escritura de arriba BORRA las pestañas de la corrida anterior. Por eso esto
 * es código y va después, no una instrucción para el Lead: se rehacen siempre.
 *
 * El mecanismo es el mismo que el del Button —`elementAction` con
 * `documentItems`—, con su propia lista de grupos: lo que parte a un fundamento
 * es la HERRAMIENTA, no la variante. */
if (!MOLDE) {
  console.log(`\n── pestañas por herramienta ──`)
  const espec = hojas2.find(h => h.title === "Especificaciones") ?? hojaPorNombre.get("Especificaciones")
  const esperadas = HERRAMIENTAS.filter(t => trozos.some(x => x.md.includes(`#### ${t}`)))
  if (!esperadas.length) {
    console.log(`   el .md no declara ninguna pestaña de herramienta — nada que agrupar`)
  } else {
    const { secciones } = await aplicarPestanas(sdk, from, espec.id, true, GRUPOS_FUNDAMENTO)
    const hechas = secciones.flat()
    console.log(`   secciones creadas: ${secciones.length} — ${secciones.map(s => s.join(" · ")).join(" | ")}`)
    console.log(`\ncobertura de pestañas: ${hechas.length} de ${esperadas.length} herramientas agrupadas`)
    /* 🔴 Falla ruidosamente. Una pestaña que no se agrupa se publica como un
     * título suelto seguido de su tabla: sale bien formada, sin error y sin
     * hueco visible. Es la forma «falso completo» de la regla 16. */
    if (hechas.length !== esperadas.length) {
      console.error(`🔴 el .md declara ${esperadas.join(" · ")} y se agruparon ${hechas.length}.`)
      process.exitCode = 1
    }
    /* ⚠️ Los títulos se CONSUMEN al rotular la pestaña, así que el árbol de
     * bloques pierde tres `rich-text`. Vuelve a guardar el respaldo después. */
    console.log(`   ⚠️ vuelve a guardar el respaldo: los ${hechas.length} títulos se consumieron al rotular.`)
  }
}

/* ── El molde se OCULTA, y se verifica con la lectura autoritativa ─────────── */
if (MOLDE) {
  /* 🔴 `getDocumentationStructure` NO devuelve `configuration`: `isHidden` llega
   * `undefined` SIEMPRE y se lee exactamente igual que `false`. Con esa lectura
   * este paso informaría verde con la escritura sin hacer. Se relee con
   * `getFullDocumentationLegacyRepresentation`, que sí lo trae. */
  const oculto = (x) => x?.isHidden ?? x?.configuration?.isHidden
  console.log(`\n── ocultar la plantilla ──`)
  console.log(`   Sigue existiendo en el editor para duplicarla. Lo que no debe es publicarse.`)

  await sdk.documentation.updateDocumentationGroup(from, {
    id: destino.persistentId, configuration: { isHidden: true },
  })
  for (const t of trozos) {
    const hoja = hojaPorNombre.get(t.nombre)
    await sdk.documentation.updateDocumentationPageOrTab(from, {
      id: String(hoja.persistentId), configuration: { isHidden: true },
    })
  }

  const full3 = await sdk.documentation.getFullDocumentationLegacyRepresentation(from)
  const todos3 = [...full3.allGroups, ...full3.allPages]
  const g3 = todos3.find(x => x.persistentId === destino.persistentId)
  const h3 = (g3?.childrenIds ?? [])
    .map(id => todos3.find(x => x.persistentId === id || String(x.id) === String(id)))
    .filter(Boolean)
  const entidades = [g3, ...h3]
  const ocultas = entidades.filter(oculto)
  for (const e of entidades) console.log(`   ${oculto(e) ? "✓" : "🔴"} «${e.title}» isHidden=${oculto(e)}`)
  console.log(`\ncobertura de ocultamiento: ${ocultas.length} de ${entidades.length} entidades ocultas`)
  /* ⚠️ El `_` que aparece delante del título lo añade la API a lo oculto. Es
   * marcador, no parte del nombre. */
  if (ocultas.length < entidades.length) {
    console.error(`🔴 ${entidades.length - ocultas.length} entidad(es) siguen visibles. La plantilla se publicaría.`)
    process.exitCode = 1
  }
}

if (verificadas < PESTANAS.length) {
  console.error(`🔴 ${PESTANAS.length - verificadas} pestaña(s) siguen vacías después de escribir.`)
  process.exitCode = 1
} else {
  console.log(`\n  ⚠️  Esto ESCRIBIÓ las pestañas; NO las publicó al sitio público.`)
  console.log(`      Revísalas en PREVIEW. La publicación a Live la hace el Lead.`)
  console.log(`      Y mira el RENDER, no solo el árbol: un bloque vivo colocado no es un bloque configurado.`)
}
