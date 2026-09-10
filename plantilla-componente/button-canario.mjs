/**
 * El experimento del Button canario: la plantilla maestra, poblada con bloques vivos.
 *
 * 🔴 La lección que lo motiva. La primera publicación se rechazó —«estaba
 * revuelta»— porque se volcó el `.md` repartido en pestañas: `Especificación`
 * quedó con 1739 líneas y 13 tablas. **El `.md` de uSpec es INSUMO, no la página.**
 *
 * Aquí el contenido se COLOCA en la sección que le corresponde, y donde existe un
 * bloque vivo que hace el trabajo, se usa el bloque en vez de la tabla escrita:
 * el contraste lo calcula `color-accessibility-grid`, los valores los muestra
 * `design-tokens`, las props las genera el playground de Storybook.
 *
 * Lo que no cabe en una sección de la plantilla NO entra a la página. Se queda
 * en el repo, que es donde vive la especificación completa.
 */
import pkg from "@supernovaio/sdk"
const { Supernova } = pkg
import { exigirAgnostico } from "../filtro-agnostico.mjs"
import { anchosDe, firmaDeTabla, informeDeAnchos } from "../anchos-de-tabla.mjs"

/** Qué tabla salió del ajuste del Lead y cuál de un cálculo. Se informa al final. */
const REGISTRO_ANCHOS = []
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { aplicarPestanas, VARIANTES_DE_COLOR as VARIANTES_COLOR } from "./pestanas-plataforma.mjs"
import { tokensPorVariante, tablaMarkdown, paresDe } from "../contraste-real.mjs"
import { reagruparCitas } from "../experimento-canario/citas.mjs"
import { traducirCabecera, anchosDeColumna } from "../experimento-canario/conversor.mjs"

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.dirname(AQUI)
// DS y WS ya NO se escriben a mano: `main()` los resuelve por API.
const GRUPO_COMPONENTES = "074cc38b-fbf2-40b8-8802-d519fff8c76e"

const TK = JSON.parse(fs.readFileSync(path.join(AQUI, "config/button-tokens.json"), "utf8"))
/* Cobertura de las propiedades de token, medida contra Supernova. Decide qué
 * columnas puede emitir la tabla — ver `columnasDeToken`. */
/* Derivados del .md, no escritos: los tokens que usa cada variante y la tabla de
 * contraste de las combinaciones reales. Se recalculan en cada corrida. */
const MD_BUTTON = fs.readFileSync(path.join(AQUI, "../Componentes/button.md"), "utf8")
const TOKENS_POR_VARIANTE = tokensPorVariante(MD_BUTTON)
const TABLA_CONTRASTE = tablaMarkdown(paresDe(MD_BUTTON))
/**
 * La entrada de changelog del arreglo de la familia `brand` en Dark.
 *
 * 🔴 SE EMITE SOLO SI EL ARREGLO YA ESTÁ EN SUPERNOVA, y ésa es toda la gracia.
 * El Lead corrige en Figma y el plugin de variables sincroniza; entre una cosa y
 * otra hay una ventana en la que la página diría «ya es azul» mientras el token
 * sigue valiendo blanco. **Publicar el changelog antes que el hecho es fabricar
 * un falso vigente en el sitio donde más se cree.**
 *
 * El dato se mide en `config/estado-brand-dark.json`, que actualiza
 * `npm run docs:brand-dark`. Mientras diga `pendiente`, esta entrada no sale.
 */
const ESTADO_BRAND = JSON.parse(fs.readFileSync(path.join(AQUI, "config/estado-brand-dark.json"), "utf8"))
const ENTRADA_BRAND_DARK = ESTADO_BRAND.corregido
  ? `- **${ESTADO_BRAND.fecha}** — la familia \`brand\` recupera el color de marca en Dark. \`background/brandMain\`, \`brandHover\` y \`brandPressed\` apuntaban a la escala **neutra** —blanco y grises, sin una gota de azul— mientras en Light apuntan a la de marca. Ahora usan \`neutralDarkBlue\` en su tramo claro, espejo del patrón de Light: reposo en el extremo de la escala, \`hover\` tres pasos hacia el centro y \`pressed\` entre los dos. **El contraste del label sigue por encima de AA en los tres estados.**\n`
  : ""

const COBERTURA_TK = JSON.parse(fs.readFileSync(path.join(AQUI, "config/cobertura-propiedades-token.json"), "utf8"))

/**
 * Los 21 previews que ya se subieron a Supernova el 21 de agosto. NO se vuelven
 * a subir: el registro guarda su assetId, y la página los referencia.
 *
 * ⚠️ `fraccionAncho` es el % del ancho que ocupa el contenido dibujado, medido en
 * Figma. Supernova escala la imagen al ancho de la columna, así que sin ese dato
 * un preview sale diminuto o gigante — y valida igual de bien en los dos casos.
 */
/**
 * 🔴 CAMBIO DEL 3 SEP 2026 — la fuente pasa de `frames-subidos.json` (imágenes
 * exportadas y subidas a mano) a `frames-vivos.json` (frames renderizados por
 * Supernova desde el nodo de Figma).
 *
 * Por qué, y no es preferencia estética: **una imagen subida es una foto.** Se
 * saca una vez y a partir de ahí miente en silencio en cuanto el componente
 * cambia. El 27 de agosto se rehizo la geometría del Button, se re-exportaron
 * los 23 previews, se recortaron los 23 — y solo 8 se subieron. Los otros 15
 * publicaron durante siete días un radio de 8, 12 y 24 donde el componente
 * tiene 16, bajo un texto que afirmaba «un único `radius/l` (16) en las 60
 * variantes». Nada falló: el registro tenía sus 23 entradas y la puerta daba
 * verde.
 *
 * Un frame vivo apunta al nodo y se rehace solo. Verificado midiendo el render:
 * las tallas `l` y `m` dan 16, frente a los 24 del asset subido.
 *
 * ⚠️ Y la contrapartida, aceptada por el Lead el 3 sep con su razón: un frame
 * vivo **nunca se congela**, así que una edición a medias en Figma se publica
 * sola. Se cambia una foto que envejece por un espejo que no avisa. *El fallo
 * del espejo es visible en el momento; el de la foto estuvo siete días fuera.*
 */
const FRAMES = JSON.parse(fs.readFileSync(
  path.join(RAIZ, "experimento-canario/frames-vivos.json"), "utf8"))

/** Los iconos que sustituyen al texto en la columna Type y marcan la jerarquía. */
const ICONOS = JSON.parse(fs.readFileSync(
  path.join(RAIZ, "experimento-canario/iconos-tipo.json"), "utf8"))

/**
 * Un preview ya subido, por el nombre de sección con el que se registró.
 *
 * 🔴 `resourceId` NO es el `assetId`. Son dos ids distintos: el del recurso vive
 * dentro de la URL del asset. Pasar el `assetId` publica un bloque con
 * `"url": ""` y la imagen no carga — y valida igual de bien, porque el
 * validador comprueba la forma del valor, no que el recurso exista.
 */
/**
 * Un preview, como bloque `figma-frames` apuntando al nodo vivo de Figma.
 *
 * 🔴 Los tres ids NO son intercambiables, y confundirlos produce un bloque que
 * valida, se guarda y no pinta nada:
 *   · `entityId`   — el id del FRAME en Supernova (`persistentId`). Es el que
 *                    ata el bloque al nodo.
 *   · `resourceId` — el id de la IMAGEN renderizada. Vive dentro de la URL.
 *   · `nodo`       — el id en Figma. No se usa aquí; sirve para re-renderizar.
 * Los tres los asigna Supernova al renderizar, así que salen de
 * `frames-vivos.json` y NO se escriben a mano.
 *
 * 🔴 Y la forma del bloque es `<SNFigmaImages>/<SNFigmaFrame>`, NO la que
 * documenta `MAPA-DE-BLOQUES.md` (`<SNBlock packageId=…><SNPropFigmaNode …>`
 * con un objeto `resource` anidado). Esa forma la rechaza `validateMarkdown`
 * con `UndeclaredValueKey … no value.0.resource`. *El mapa se escribió leyendo
 * una página existente, y el esquema cambió por debajo.*
 *
 * 🔴 `previewSize="NaturalHeight"`, y esto se escribe desde aquí a propósito.
 * Es el «fit to image size» que el Lead ponía A MANO en el panel de Supernova,
 * bloque por bloque, en los 11 de la página. Medido el 8 sep 2026 al leer su
 * ajuste manual. Antes se emitía `"Centered"`, así que él tenía que repetir el
 * mismo gesto en cada preview de cada componente. *Si el generador puede
 * escribirlo, el Lead no debería tener que acordarse.*
 *
 * ⚠️ Dos variaciones suyas que NO se codifican porque no está confirmado que
 * sean deliberadas: `showFrameDetails={false}` en un bloque y
 * `itemBackgroundColor={{ value: "#080808" }}` en otro —presumiblemente el
 * preview de modo oscuro—. **Se le preguntan antes de generalizarlas.**
 *
 * ⚠️ `variant="plain"` a propósito: cada preview es una imagen sola, y
 * `bordered` está pensado para rejillas de varios frames. Y sin
 * `showFrameDetails`, que añadiría el nombre de la capa y el enlace a Figma en
 * cada uno de los 23 — traza útil para nosotros, ruido para quien lee la
 * página. La traza vive en `frames-vivos.json`, que sí la conserva entera.
 */
/**
 * Un preview de Figma, con su título y su descripción.
 *
 * 🔴 Hasta el 10 sep 2026 esta función recibía un segundo parámetro `pie` y **lo
 * descartaba en silencio**. Catorce pies de foto escritos con cuidado —«primary
 * y secondary», «s, m y l con sus medidas»— nunca llegaron a la página. Nadie lo
 * notó porque no producía error ni hueco: el preview salía, solo que mudo.
 *
 * Lo destapó el Lead al descubrir en el editor que el bloque acepta título y
 * descripción, ponerlos a mano en dos previews y pedir el resto.
 *
 * ⚠️ La sintaxis no está documentada y se averiguó probando contra
 * `validateMarkdown`: van como **atributos directos** de `<SNFigmaFrame>`.
 * `entityMeta={{...}}` y `caption=` se rechazan, pese a que `entityMeta` es
 * justo como lo devuelve la API al leer.
 *
 * @param seccion  clave en el registro de frames vivos
 * @param titulo   qué se está viendo. Corto: es la etiqueta, no la explicación
 * @param desc     qué aporta esa imagen que no aporte el texto de al lado
 */
const preview = (seccion, titulo, desc) => {
  const f = FRAMES[seccion]
  if (!f?.entityId || !f?.resourceId || !f?.url) throw new Error(
    `«${seccion}» no está en frames-vivos.json, o le falta entityId/resourceId/url.\n` +
    `   Registrados: ${Object.keys(FRAMES).join(" · ")}\n` +
    `   Regenera el registro con: npm run docs:frames -- --render --registro`)

  /* 🔴 Un preview sin título es un preview mudo, y es el estado del que venimos.
   * Se exige aquí para que no se pueda volver a él por olvido. */
  if (!titulo) throw new Error(
    `El preview «${seccion}» no tiene título. Todo preview lleva título y descripción:\n` +
    `   preview("${seccion}", "Qué se ve", "Qué aporta")`)

  const esc = (t) => String(t).replace(/"/g, "&quot;")
  const attr = desc ? ` title="${esc(titulo)}" description="${esc(desc)}"` : ` title="${esc(titulo)}"`
  return `<SNFigmaImages previewSize="NaturalHeight" variant="plain" columns={1}>
  <SNFigmaFrame id="${f.entityId}" resourceId="${f.resourceId}" src="${f.url}"${attr} />
</SNFigmaImages>`
}
/**
 * Los previews que NO se colocan en la página, y por qué. Un preview registrado
 * tiene que estar o colocado o aquí: no hay tercera opción.
 *
 * 🔴 Existe porque el 27 de agosto se contaron «12 previews sueltos» y el número
 * ya era falso al escribirse — el 28 se registraron dos más y nadie recontó, así
 * que eran 14. Un conteo a mano de un conjunto que crece es un dato con fecha de
 * caducidad y sin aviso de caducidad. `verificarCobertura()` lo cuenta solo.
 *
 * 🟡 DECISIÓN EDITORIAL, 2 sep 2026 — los seis previews de color quedan fuera.
 * La página publica los mismos valores con `color-accessibility-grid`, que los
 * calcula sobre los tokens VIVOS. Una imagen de color miente en silencio en
 * cuanto un token cambia: sigue viéndose bien, y ya no dice la verdad. Es el
 * defecto que el bloque vivo existe para no tener. Las ocho combinaciones
 * completas siguen en la especificación del repo, que es donde deben estar.
 * No se borran de Supernova: cuestan cero y sirven si la decisión cambia.
 */
const FUERA_A_PROPOSITO = {
  "Primary / Marketing / Light":   "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",
  "Primary / Marketing / Dark":    "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",
  "Secondary / Product / Light":   "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",
  "Secondary / Product / Dark":    "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",
  "Secondary / Marketing / Light": "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",
  "Secondary / Marketing / Dark":  "cubierto por color-accessibility-grid, que resuelve sobre tokens vivos",

  /* 🟡 DECISIÓN EDITORIAL del Lead, 9 sep 2026 — se retira la sección «Ejemplos».
   * Textual: *«no veo necesario y no aporta nada»*. Eran tres imágenes sueltas
   * sin una línea de texto: un botón principal, uno secundario con icono y uno
   * deshabilitado. **Los tres casos ya están mostrados donde significan algo**
   * —variante, ranuras de icono y estados tienen su propia sección con su
   * explicación—, así que la galería solo repetía sin decir nada nuevo.
   * No se borran de Supernova: cuestan cero y sirven si la decisión cambia. */
  "Accion principal":              "la sección «Ejemplos» se retiró: repetía casos ya explicados en su sección",
  "Secundario con icono final":    "la sección «Ejemplos» se retiró: repetía casos ya explicados en su sección",
  "Deshabilitado":                 "la sección «Ejemplos» se retiró: repetía casos ya explicados en su sección",
}

/**
 * Cuenta cuántos previews registrados llegan a la página y falla si alguno no
 * está ni colocado ni declarado fuera. **Emite la cobertura siempre**, en regla
 * o no: un método que resuelve un conjunto dice sobre cuántos de cuántos.
 */
const verificarCobertura = (paginas) => {
  const texto = Object.values(paginas).join("\n")
  const registrados = Object.keys(FRAMES)
  const colocados = registrados.filter(s => texto.includes(FRAMES[s].url))
  const fuera = registrados.filter(s => s in FUERA_A_PROPOSITO && !colocados.includes(s))
  const huerfanos = registrados.filter(s => !colocados.includes(s) && !(s in FUERA_A_PROPOSITO))
  console.log(`  Previews: ${colocados.length} colocados + ${fuera.length} fuera a propósito = ` +
              `${colocados.length + fuera.length} de ${registrados.length} registrados.`)
  if (huerfanos.length) throw new Error(
    `${huerfanos.length} preview(s) registrados no están ni colocados ni declarados fuera:\n` +
    huerfanos.map(s => `     · ${s}`).join("\n") +
    `\n   Colócalos en una pestaña o añádelos a FUERA_A_PROPOSITO con su razón.`)
  return { colocados: colocados.length, fuera: fuera.length, total: registrados.length }
}

const COMPONENTE_CANONICO = "d4f71d86-4a9b-4535-949d-0b3aadd0818f"
/**
 * 🔴 RETIRADO DE LA PÁGINA EL 2 SEP 2026, y conviene entender qué se retiró.
 *
 * `681057` es `Example/Button — Primary`: el botón de ANDAMIAJE DE FÁBRICA de
 * Storybook, el que viene en cualquier proyecto recién inicializado. No es el
 * Button de Later. Verificado contra la plataforma:
 *   URL → .../alias/bricks-ui-canario/iframe.html?id=example-button--primary
 *   Title → "Example/Button"
 *
 * Se puso «para simular que desarrollo ya consumió la spec», y esa simulación
 * SE PUBLICÓ: la pestaña `Especificaciones` —la página que un externo abre para
 * juzgar el sistema— enseñaba un botón de demo genérico bajo el título
 * «Propiedades», sin decir en ningún sitio que no era el componente.
 *
 * ⚠️ No se sustituye por otro embed porque no hay por qué sustituirlo: hoy hay
 * **cero componentes de código** en Supernova y las 11 historias conectadas son
 * todas `Example/*`. Un hueco declarado es honesto; un demo sin etiquetar, no.
 * Vuelve cuando exista el Button en código — que va después de 7.3, no antes.
 */
// (La constante se retiró: no queda ningún embed de Storybook en la página.)

/**
 * Trae una tabla del .md de uSpec y la emite como <SNTable>.
 *
 * 🔴 Emitirla con pipes NO funciona, y falla del peor modo posible: el validador
 * la acepta y al escribir la descarta en silencio. La página queda con sus
 * títulos y sus imágenes, y sin un solo dato, sin que nada lo avise.
 */
const tablaDelMd = (encabezado, ocurrencia = 1) => {
  const md = fs.readFileSync(path.join(RAIZ, "Componentes/button.md"), "utf8")
  const lineas = md.split("\n")
  // ⚠️ Cuatro encabezados del .md se repiten —`| Spec | s | m | l | Notes |` está
  // en «Button sizes» y en «Button — Focus»; `| # | Area | Criterion |` está en
  // la batería base y en los criterios propios—. Sin `ocurrencia` el segundo es
  // inalcanzable, y pedirlo devuelve el primero SIN avisar: la página sale bien
  // formada con la tabla equivocada. Es la regla 16 en su forma de falso completo.
  let i = -1, vistas = 0
  for (let k = 0; k < lineas.length; k++) {
    if (lineas[k].trim() === encabezado && ++vistas === ocurrencia) { i = k; break }
  }
  if (i < 0 && vistas > 0) throw new Error(
    `La tabla «${encabezado}» aparece ${vistas} vez/veces en button.md, y se pidió la ${ocurrencia}.ª.`)
  if (i < 0) throw new Error(
    `No encontré la tabla «${encabezado}» en button.md.\n` +
    `   Encabezados de tabla que SÍ existen en el .md:\n` +
    lineas.filter(l => /^\|\s*(#|Spec|Property|Element)\s*\|/.test(l.trim()))
          .map(l => `     ${l.trim()}`).join("\n"))
  // 🔴 Desde `i`, no desde `i + 1`: el encabezado ES la primera fila de la tabla.
  // Empezar después lo descarta, la primera fila de datos pasa a hacer de
  // cabecera, y la columna `Type` deja de encontrarse — sin que nada falle.
  const filas = []
  for (let j = i; j < lineas.length; j++) {
    if (/^\s*\|/.test(lineas[j])) filas.push(lineas[j])
    else if (filas.length) break
  }
  if (!filas.length) throw new Error(`La tabla «${encabezado}» existe en button.md pero no tiene filas.`)
  // 🔴 `\|` es un dato dentro de la celda, no un separador. uSpec lo emite en
  // toda columna de valores de enum. Partir por `|` a secas hizo que 10 filas
  // de `Properties` salieran con el doble de celdas y Supernova rechazara la
  // pagina entera con `RaggedTableRow` (27 ago 2026). Mismo arreglo que en
  // experimento-canario/conversor.mjs — ojo: el troceador esta duplicado.
  const celdas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "")
    .split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, "|"))
  const cuerpo = filas.map(celdas).filter(cs => !cs.every(c => /^:?-+:?$/.test(c)))
  // 🔴 La cabecera al español. Sin esto la página quedaba en español con
  // once tablas encabezadas en inglés: la segunda voz que había que quitar.
  return tabla(cuerpo[0].map(traducirCabecera), cuerpo.slice(1))
}

/**
 * Trae una sección completa del .md de uSpec, por su encabezado de nivel 2.
 *
 * 🔴 Existe porque su ausencia costó una sección entera publicada a medias: al
 * reescribir esta pestaña para meter los previews, la línea que insertaba
 * `## Voice / Screen reader` desapareció sin que nada fallara. El .md la tenía,
 * el generador no la colocaba, y la página salió con el resto correcto — que es
 * la forma más silenciosa de perder contenido.
 */
const seccionDelMd = (encabezado) => {
  const md = fs.readFileSync(path.join(RAIZ, "Componentes/button.md"), "utf8")
  const lineas = md.split("\n")
  const i = lineas.findIndex(l => l.trim() === `## ${encabezado}`)
  if (i < 0) throw new Error(
    `No encontré la sección «## ${encabezado}» en button.md.\n` +
    `   Secciones de nivel 2 que SÍ existen:\n` +
    lineas.filter(l => /^## /.test(l)).map(l => `     ${l.trim()}`).join("\n"))
  const cuerpo = []
  for (let j = i + 1; j < lineas.length; j++) {
    if (/^## /.test(lineas[j])) break
    cuerpo.push(lineas[j])
  }
  // ⚠️ Fuera los comentarios: Supernova no admite ninguno, ni HTML ni MDX, y
  // esta sección lleva dentro el carry `voice-render-meta` que consume uSpec.
  let txt = cuerpo.join("\n")
    // ⚠️ Fuera los comentarios: Supernova no admite ninguno, ni HTML ni MDX, y
    // esta sección lleva dentro el carry `voice-render-meta` que consume uSpec.
    .replace(/<!--[\s\S]*?-->/g, "")
  // ⚠️ Y las etiquetas HTML citadas: MDX lee `<button>` como un componente JSX
  // y exige cerrarlo. Aquí son DATO —el marcado que el lector de pantalla
  // espera— así que van como código, no como etiqueta.
  txt = txt.replace(/(?<!`)<(\/?[a-z][a-z0-9]*(?:\s[^<>]*?)?)>(?!`)/g, "`<$1>`")
  // La regla de las citas vive en experimento-canario/citas.mjs, compartida con
  // el conversor: los dos pipelines fallaban en el mismo punto de formas
  // distintas y la regla no puede existir por duplicado.
  txt = reagruparCitas(txt, (cabecera, filas) => tabla(cabecera, filas, [180, 580]))
  // 🔴 Y las pipe tables a <SNTable>. Es el fallo más silencioso de la
  // plataforma: validan, se publican, y al escribir se descartan sin aviso.
  // La sección quedaba con sus títulos y sin una sola tabla de anuncios.
  const lineas2 = txt.split("\n")
  const salida = []
  for (let j = 0; j < lineas2.length; j++) {
    if (!/^\s*\|/.test(lineas2[j])) { salida.push(lineas2[j]); continue }
    const filas = []
    while (j < lineas2.length && /^\s*\|/.test(lineas2[j])) filas.push(lineas2[j++])
    j--
    const celdas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim())
    const cuerpo2 = filas.map(celdas).filter(cs => !cs.every(c => /^:?-+:?$/.test(c)))
    if (cuerpo2.length) salida.push(tabla(cuerpo2[0], cuerpo2.slice(1)))
  }
  txt = salida.join("\n")
  return txt.replace(/\n{3,}/g, "\n\n").trim()
}

/**
 * Las tres tablas de anuncio —VoiceOver, TalkBack, ARIA— de UN estado.
 *
 * 🔴 Sustituye a `seccionDelMd("Voice / Screen reader")`, y ésa es la corrección
 * editorial más grande de esta reescritura. Volcar la sección entera arrastraba
 * el bloque de cita de nueve párrafos que la abre: «Merge analysis», «Confidence»,
 * «Reconciliation», la voz del extractor en crudo. Ese vertido es el que hacía
 * que `Especificaciones` se leyera como un reporte y no como una herramienta.
 *
 * Aquí entran los DATOS —los tres H4 y sus tablas, que son lo que un ingeniero
 * consulta— y el encuadre lo escribe la página, en su voz. El bloque de cita no
 * se pierde: sigue íntegro en `Componentes/button.md`, que es su sitio.
 *
 * Los H4 se conservan tal cual porque `aplicarPestanas` los agrupa en Tabs: el
 * nombre de plataforma es su única señal.
 */
const tablasDeEstado = (estado) => {
  const md = fs.readFileSync(path.join(RAIZ, "Componentes/button.md"), "utf8")
  const lineas = md.split("\n")
  const i = lineas.findIndex(l => l.trim() === `### ${estado}`)
  if (i < 0) throw new Error(
    `No encontré el estado «### ${estado}» en button.md.\n` +
    `   Estados que SÍ existen:\n` +
    lineas.filter(l => /^### State: /.test(l)).map(l => `     ${l.trim()}`).join("\n"))
  const salida = []
  let plataformas = 0
  for (let j = i + 1; j < lineas.length; j++) {
    const l = lineas[j]
    if (/^#{1,3} /.test(l)) break                 // otro estado o sección: se acabó
    if (/^#### /.test(l)) { plataformas++; salida.push(l); continue }
    if (!/^\s*\|/.test(l)) continue                // fuera la prosa: la escribe la página
    const filas = []
    while (j < lineas.length && /^\s*\|/.test(lineas[j])) filas.push(lineas[j++])
    j--
    const celdas = (t) => t.trim().replace(/^\|/, "").replace(/\|$/, "")
      .split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, "|"))
    const cuerpo = filas.map(celdas).filter(cs => !cs.every(c => /^:?-+:?$/.test(c)))
    // ⚠️ `<button type="button">` y `<div role="button">` son DATO en la columna
    // Value: MDX los leería como JSX y exigiría cerrarlos. Van como código.
    const seguro = cuerpo.map(cs => cs.map(c =>
      c.replace(/(?<!`)<(\/?[a-z][a-z0-9]*(?:\s[^<>]*?)?)>(?!`)/g, "`<$1>`")))
    // ⚠️ Dos rótulos de la primera columna NO son nombres canónicos —no son
    // `accessibilityLabel` ni `aria-hidden`—: son etiquetas de fila, y en una
    // tabla en español se leían como un injerto. Se traducen solo esos dos.
    const ROTULOS = { "Announcement": "Anuncio", "`Do NOT`": "**No hagas**" }
    const es = seguro.map((cs, f) => f === 0 ? cs.map(traducirCabecera)
                                             : cs.map((c, k) => k === 0 ? (ROTULOS[c] ?? c) : c))
    /* Sin anchos incrustados: `[200, 220, 340]` sumaba 760 y era la tabla que el
     * Lead señaló como «la única por encima de la banda y probablemente la que
     * produce scroll». El reparto por defecto la deja bajo el techo y manda el
     * sobrante a `Notas`, que es lo que su patrón prescribe para estas seis. */
    if (es.length) salida.push(tabla(es[0], es.slice(1)))
  }
  // 🔴 Cobertura, no confianza: las tres plataformas o nada. Si uSpec deja de
  // emitir una, la página saldría con dos y sin hueco visible.
  if (plataformas !== 3) throw new Error(
    `«${estado}» trajo ${plataformas} de 3 plataformas. Faltan tablas en button.md.`)
  return salida.join("\n\n")
}

const token = (ruta) => ({ entityId: TK[ruta], entityType: "Token" })

/**
 * Los temas del sistema, por nombre. Leídos de Supernova el 8 sep 2026.
 * 🔴 Son ids, no nombres: si alguien renombra «Dark» el id sigue valiendo, pero
 * si BORRA el tema esto apunta a nada. `md:verificar` lo comprueba.
 */
const TEMA = {
  light: "bbea853c-ddd6-405d-8a2b-3908c2656805",
  dark:  "10b101be-fad3-40dc-88c3-02cd375ed3db",
}

/**
 * Un bloque de tokens, con un swatch POR CADA MODE que la sección representa.
 *
 * POR QUÉ ES PARÁMETRO Y NO CONSTANTE — petición del Lead, 8 sep 2026:
 * *«que se activen los swatches dependiendo del mode que queremos representar»*.
 * Una sección que solo habla de Light no debe mostrar una columna Dark vacía de
 * sentido; una que compara los dos las necesita ambas. **Lo decide la sección, no
 * el generador.**
 *
 * ⚠️ Y esto existe porque el ajuste era MANUAL: el Lead activó los swatches a
 * mano en Supernova y la siguiente escritura se los habría llevado, igual que se
 * llevó 16 anchos de tabla el 8 sep. Un ajuste que solo vive donde escribimos no
 * está guardado.
 *
 * @param modes - Nombres de mode a mostrar, en orden. Sin ellos, sin swatches.
 */
const tokens = (...rutas) => JSON.stringify(rutas.map(token))

/**
 * Título de un bloque que lo admite (`component-checklist`, y cualquiera con la
 * prop `title`). Sin él, el bloque publica su `defaultValue` en inglés.
 */
const titulo = (texto) => `<SNProp name="title" value={${JSON.stringify(texto)}} />`

/**
 * Propiedades de token que la tabla muestra como COLUMNAS.
 *
 * 🔴 Se emiten SOLO si los tokens tienen valor, y el motivo lo dio el Lead el
 * 9 sep 2026: *«cuando las activé, todas estaban vacías y no sabía qué era lo que
 * debía mostrarse»*. Una columna vacía no informa de nada y además esconde el
 * hueco detrás de un guion.
 *
 * Medido ese día sobre los 16 tokens del Button:
 *   · `collection`      → los 16 son `semanticColors`. Columna CONSTANTE, no informa
 *   · `tokenSet`        → redundante con la anterior
 *   · `code-syntax-web` → 0 de 16 con valor. Publicaría 16 guiones
 *
 * ⚠️ `code-syntax-web` es la que de verdad importa a futuro: es el puente entre
 * el nombre en Figma y el nombre en código, que es lo que un desarrollador
 * necesita. Está vacía porque nadie la ha rellenado, no porque no sirva.
 * **Aparecerá sola el día que los tokens la tengan** — sin que nadie se acuerde.
 */
const PROPIEDADES_DE_TOKEN = {
  "code-syntax-web": "cf941a6d-02a1-4d2c-b273-68d09210494c",
}

/**
 * Devuelve la prop `selectedPropertyIds` con las columnas que HOY tienen valor.
 * @param cobertura - `{ propiedad: nDeTokensConValor }`, medido contra Supernova.
 * @param total     - Cuántos tokens lleva la tabla.
 */
const columnasDeToken = (cobertura, total) => {
  const vivas = Object.entries(PROPIEDADES_DE_TOKEN)
    .filter(([code]) => (cobertura[code] ?? 0) === total)
  const parciales = Object.entries(PROPIEDADES_DE_TOKEN)
    .filter(([code]) => { const n = cobertura[code] ?? 0; return n > 0 && n < total })
  /* Cobertura declarada (regla 16): una columna a medias es peor que ninguna,
   * porque los huecos salen como guiones indistinguibles de un valor ausente. */
  for (const [code] of parciales)
    console.log(`  ⚠️  columna '${code}': ${cobertura[code]} de ${total} tokens con valor — NO se emite`)
  console.log(`  ✓ columnas de token: ${vivas.length} de ${Object.keys(PROPIEDADES_DE_TOKEN).length} con cobertura total`)
  return vivas.length
    ? `<SNProp name="selectedPropertyIds" value={${JSON.stringify(vivas.map(([, id]) => id))}} />`
    : ""
}

const swatches = (...modes) => {
  const desconocidos = modes.filter(m => !TEMA[m])
  if (desconocidos.length) throw new Error(
    `Mode(s) sin tema en Supernova: ${desconocidos.join(", ")}. Conocidos: ${Object.keys(TEMA).join(", ")}.`)
  return JSON.stringify(modes.map((m, i) => ({
    id: i === 0 ? "swatch-0" : `swatch-${m}`,
    selectedThemeIds: [TEMA[m]],
  })))
}

/**
 * El id del recurso ES el `assetId` del registro.
 *
 * ⚠️ El id que aparece dentro de la URL del asset NO existe como recurso: es
 * solo el nombre del archivo en el almacén. Apuntar ahí publica un bloque que
 * valida, se guarda, y no muestra nada. Verificado contra `getAssetResources`.
 */
const idDelRecurso = (registro) => registro?.assetId

/** Las pipe tables no se soportan: se emiten como <SNTable>. */
/**
 * @param anchos - Reparto explícito del ancho, en px por columna. Sin él, las
 *   columnas van a partes iguales. Se pasa cuando el reparto uniforme rompe la
 *   tabla: una columna de rótulos de 20 caracteres junto a una de párrafos de
 *   600 no se leen igual con 380 px cada una.
 */
export const tabla = (cabecera, filas, anchos) => {
  const colTipo = cabecera.findIndex(c => /^type$/i.test(c.trim()))
  /* 🔴 PRIORIDAD, y este orden es la regla: lo que el Lead ajustó a mano gana
   * SIEMPRE. Un ajuste suyo es una decisión; el reparto del generador es un
   * default, y un default no pisa una decisión.
   *
   * Antes esto era `Math.floor(760 / columnas)` — reparto igual y por encima de
   * la banda 754-757, o sea el scroll que él quita a mano y luego el generador
   * volvía a poner en cada escritura. */
  /* 🔴 La primera columna entra en la firma, y no es un detalle: el Button tiene
   * 24 tablas pero solo 17 combinaciones distintas de encabezados —`Propiedad |
   * Valor | Notas` se repite seis veces con seis anchos distintos—. Emparejar
   * solo por encabezados preservaba 17 y recalculaba 7 sin decir nada. */
  const col0 = filas.map(f => String(f?.[0] ?? ""))
  const { anchos: delRegistro, origen } = anchosDe(cabecera, null, col0)
  REGISTRO_ANCHOS.push({ firma: firmaDeTabla(cabecera, col0), origen })
  /* El default para una tabla sin ancho suyo NO es reparto igual: es su misma
   * regla —la columna de dato se comprime, la descriptiva absorbe—, para que una
   * tabla nueva nazca ya con la forma que él le daría. */
  const calculados = anchosDeColumna([cabecera, ...filas], cabecera.length)
  const anchoDe = (c) => delRegistro?.[c] ?? anchos?.[c] ?? Math.floor(calculados[c] ?? 756 / cabecera.length)

  /**
   * ⚠️ Dentro de una celda, la imagen va en su PROPIO párrafo: texto, línea en
   * blanco, imagen. En la misma línea que el texto —antes o después— el
   * validador la rechaza con «accepts text and <SNImage>, not <SNImage>».
   * Y `caption` dentro de una celda también la rechaza.
   */
  /**
   * 🔴 Los iconos dentro de celdas NO son posibles hoy, y es un callejón cerrado:
   * una celda solo acepta `<SNImage>` —rechaza la imagen Markdown— y `<SNImage>`
   * valida pero no renderiza. No hay tercera forma.
   *
   * Así que la columna `Type` y los prefijos de jerarquía se quedan en texto.
   * Se pierde el icono, no el dato. Cuando el bloque de imagen funcione dentro
   * de celdas, esto vuelve en una línea.
   */
  const textoConIcono = (texto) => texto

  const celda = (t, c, esCabecera) => {
    let contenido = t, ancho = anchoDe(c)
    // La columna `Type` dice "Instance"; se publica como el icono de la plantilla.
    if (!esCabecera && c === colTipo) {
      const ic = ICONOS[(t ?? "").trim().toLowerCase()]
      // ⚠️ Una celda NO acepta solo una imagen: el validador pide texto además.
      // Así que el icono acompaña al nombre del tipo en vez de sustituirlo.
      if (ic) { contenido = t; ancho = 96 }
    }
    // Los prefijos ├ └ del .md marcan anidamiento: se publican como el icono
    // de jerarquía, que es lo que la plantilla usa para leerlo de un vistazo.
    if (!esCabecera && /^[├└]/.test((t ?? "").trim())) {
      contenido = `└ ${t.replace(/^[├└]\s*/, "")}`
    }
    // ⚠️ Una celda que empieza por `#` la lee Markdown como encabezado y la
    // rechaza. Se escapa: es el caso de la columna `#` de la anatomía.
    const seguro = String(contenido).replace(/^(#+)(\s|$)/, "\\$1$2")
    return `    <SNTableCell alignment="Left" columnWidth={${ancho}}>\n      ${seguro}\n    </SNTableCell>`
  }

  const fila = (cs, esCabecera) => `  <SNTableRow>\n${cs.map((t, c) => celda(t, c, esCabecera)).join("\n")}\n  </SNTableRow>`
  return `<SNTable showBorder highlightHeaderRow>\n${fila(cabecera, true)}\n${filas.map(f => fila(f, false)).join("\n")}\n</SNTable>`
}

/**
 * Un par Do/Don't, en UN bloque de dos columnas. Los tipos son minúsculas:
 * do · dont · caution.
 *
 * 🔴 Esta función se reescribió el 2 sep 2026 porque la anterior publicaba los
 * bloques VACÍOS, y es el fallo silencioso de la plataforma en su peor forma.
 * Emitía `<SNProp name="description" value="…" />`: `validateMarkdown` lo
 * aceptaba, la escritura conservaba el `type` y DESCARTABA el texto. La página
 * llevaba cinco bloques Do/Don't sin una sola palabra dentro, con la forma
 * correcta y sin error que revisar. `description` no es un prop de texto — es
 * un prop de RICH TEXT, y el rich text va como HIJO, nunca como atributo.
 *
 * 🟢 La forma canónica, verificada el 2 sep 2026 escribiendo y volviendo a leer
 * (validar NO basta: las tres formas candidatas validaban igual):
 *
 *     <SNGuidelines variant="prominent" columns={2}>
 *       <SNGuideline type="do">texto **con** markdown</SNGuideline>
 *       <SNGuideline type="dont">texto</SNGuideline>
 *     </SNGuidelines>
 *
 * Es la abreviatura que la propia plataforma devuelve al releer la página, y
 * admite negrita y `código` en línea. Un par va en un solo bloque con
 * `columns={2}` para que el do y el dont se lean enfrentados, que es lo que
 * hace útil al patrón: la comparación, no la lista.
 *
 * ⚠️ Y la lección de método, que es la regla 16 otra vez: la primera sonda dio
 * «texto DESCARTADO» en las tres formas porque leía con
 * `getDocumentationContentRaw`, que para un id de página UUID devuelve un
 * registro vacío. Hasta el texto plano de control salió ausente. Para verificar
 * una escritura hay que releer con el MCP (`sn_get_documentation_page_content`)
 * — el raw del SDK no es capaz de mostrar la presencia.
 */
const par = (hacer, noHacer) => `<SNGuidelines variant="prominent" columns={2}>
  <SNGuideline type="do">
    ${hacer}
  </SNGuideline>

  <SNGuideline type="dont">
    ${noHacer}
  </SNGuideline>
</SNGuidelines>`

/** Una advertencia suelta, sin contraparte. */
const cuidado = (texto) => `<SNGuidelines variant="prominent" columns={1}>
  <SNGuideline type="caution">
    ${texto}
  </SNGuideline>
</SNGuidelines>`

/**
 * 🔴 LAS CUATRO PESTAÑAS, REESCRITAS EL 2 SEP 2026 CON LA CAPA EDITORIAL.
 *
 * El motivo, en las palabras del Lead al leer la publicación anterior: «me da
 * hueva leerlo». Estructuralmente estaba bien —las cuatro pestañas, cada cosa en
 * su sitio— y aun así no se leía. El diagnóstico fue que la página tenía TRES
 * voces mezcladas: la escrita a mano aquí, la del extractor volcada en crudo
 * (`Merge analysis`, `Confidence`, los bloques de cita de nueve párrafos), y la
 * del generador (`*Pendiente: …*` siete veces).
 *
 * 🟢 Las tres reglas que ordenan esta reescritura:
 *
 *   1. UNA SOLA VOZ. Toda la prosa se escribe aquí. Del `.md` entran DATOS
 *      —tablas—, nunca párrafos. Decisión primero, razón después.
 *   2. VARÍA LA PROFUNDIDAD, NO LA ESCRITURA. `Especificaciones` CONTIENE lo
 *      denso; no se ESCRIBE denso. Una tabla de medidas se lee en diez segundos;
 *      el párrafo que la explica con rodeos es lo que cansa.
 *   3. LO QUE NO EXISTE NO SE PUBLICA. Cero `Pendiente`. O la sección se omite,
 *      o el hueco se declara como hecho, con su razón. «El Button no reacciona
 *      al breakpoint» es información; «*Pendiente: responsive*» es un placeholder.
 *
 * ⚠️ Y nada del `.md` se pierde por no publicarse: `Componentes/button.md` sigue
 * siendo la especificación completa. Esta página es la experiencia de lectura.
 */
const TABS = {
// ⚠️ La primera línea NO repite la descripción de la pestaña. Supernova ya
// pinta el título y la descripción arriba —«Ejecuta una acción. Lo que navega
// es un Link.»— y volver a escribirla la deja dos veces seguidas en pantalla.
"Resumen general": `El control de acción del sistema. Sesenta variantes sobre cuatro ejes, una sola parada de foco y label siempre visible.

${/* 🟡 DECISIÓN EDITORIAL, 8 sep 2026 — portada del componente, a petición del Lead.
    * Es el MISMO frame que ilustra «Cuál variante» en Usos, reutilizado a propósito:
    * un lector que baja de la portada a la guía reconoce la imagen y no tiene que
    * releerla. Y reusarlo no descuadra la cobertura — `verificarCobertura` busca la
    * URL en el texto de TODAS las pestañas juntas, así que sigue contando uno. */
  preview("variant", "Las dos variantes",
    "`primary` para la acción principal de la vista; `secondary` para las de apoyo.")}

<SNCallout type="Info">
**Categoría:** Acciones · **Dueño:** Product Design · **También llamado:** Action, CTA, Call to action
</SNCallout>

## Qué resuelve

Button es el control con el que alguien **hace que algo pase**: guardar, enviar, confirmar, aplicar un filtro, abrir un modal. La acción ocurre donde está el botón.

Si al pulsarlo cambia la dirección —otra pantalla, otra URL—, el componente correcto es **Link**. Salió de aquí: el antiguo valor \`tertiary\` se convirtió en Link porque un enlace navega y un botón actúa, y en código son dos elementos distintos.

## Cómo está construido

- **Una sola parada de foco.** El label, los iconos y el fondo se anuncian como un único control.
- **El label es obligatorio.** No existe un botón solo de icono.
- **Dos ranuras de icono**, izquierda y derecha, independientes entre sí.
- **Tres tallas y dos superficies**, todas con el mismo radio.
- **Sesenta variantes** en la librería, sobre cuatro ejes.

<SNCallout type="Warning">
La propiedad de jerarquía se llama \`variant\`, no \`type\`. En HTML \`type\` ya significa otra cosa —\`button\`, \`submit\`, \`reset\`— y usar ese nombre confundiría las dos.
</SNCallout>

## Dónde está disponible

${tabla(["Plataforma", "Estado", "Qué hay hoy"], [
  ["Bricks UI", "En curso", "Storybook conectado"],
  ["Web · Next", "Sin implementar", "Consume esta especificación"],
  ["Web · Astro", "Sin implementar", "Consume esta especificación"],
  ["Mobile · Expo", "Sin implementar", "Consume esta especificación"],
])}

**Bricks UI es la única implementación en curso.** Las demás plataformas todavía trabajan contra esta especificación, no contra un componente existente.`,

"Usos": `Esta pestaña responde una sola pregunta: **¿cuál elijo?**

## Button o Link

${par(
  "Usa **Button** para **ejecutar una acción donde estás**: guardar, enviar, confirmar, filtrar, abrir un modal.",
  "No uses Button para **ir a otra pantalla o a otra URL**. Eso es un \`Link\`, el componente en el que se convirtió el antiguo \`tertiary\`."
)}

**Un enlace navega, un botón actúa.** Si al pulsarlo cambia la dirección, es un Link aunque se parezca a un botón. En código son \`<a href>\` y \`<button>\`, y el lector de pantalla los anuncia distinto.

## Cuál variante

${par(
  "Reserva \`primary\` para **la acción principal de la vista**. Usa \`secondary\` para las de apoyo.",
  "No pongas **dos \`primary\` compitiendo** en la misma vista. Si todo destaca, nada destaca."
)}

${preview("variant", "primary y secondary",
  "El peso visual es lo que jerarquiza: el relleno sólido reclama la acción principal y el contorno acompaña.")}

## Cuál superficie

${par(
  "Elige \`surface\` por **dónde vive el botón**: \`product\` en app, login y modales; \`marketing\` en landings y campañas.",
  "No uses \`marketing\` **para dar más peso** dentro del producto. No es un escalón de jerarquía: solo cambia el peso tipográfico del label y su escalón de sombra."
)}

${preview("surface", "product y marketing",
  "Cambia el peso del label y el escalón de sombra. La geometría, el radio y el color son los mismos.")}

## Cuál talla

**La talla la eliges tú, por dónde vive el botón.** Un CTA de hero es \`l\`; uno de fila de tabla es \`s\`. El componente no la deduce del ancho de la pantalla.

${preview("size", "s, m y l",
  "Las tres comparten radio. Lo que cambia es la altura y el espacio interior.")}

<SNCallout type="Warning">
**El defecto es \`m\` desde el 27 de agosto de 2026** — antes era \`s\`. Toda instancia que no especifique talla cambia de aspecto al actualizar la librería.
</SNCallout>

## Cómo se escribe el label

El label **es** el nombre accesible del control: es lo único que anuncia el lector de pantalla.

- **De una a tres palabras, en verbo de acción.** «Guardar», «Ver detalle», «Invertir ahora».
- **Máximo 24 caracteres con espacios.** Pasado ese número es un hallazgo de revisión, no criterio de quien escribe.
- **No se trunca, no lleva elipsis y no envuelve.** Si no cabe, se acorta el texto — el botón no.
- **Las mayúsculas se escriben, no se transforman.** Nada de \`text-transform\`: altera la pronunciación en algunos motores de lectura y no se puede deshacer.
- **Llega ya traducido y ya formateado.** «Invertir $10,000» lo compone quien usa el componente, separadores de locale incluidos.

${par(
  "Escribe un label que **describa la acción**: «Guardar», «Enviar», «Invertir ahora».",
  "No uses labels que describan **la apariencia o el genérico** —«Botón», «Aceptar» para todo—."
)}

**Al traducir, presupuesta +30% de ancho**, y cuenta con que una cadena de menos de 10 caracteres puede duplicarse («Ver» → «Anzeigen»). Un layout que solo encaje con la cadena exacta en español está roto antes de traducirse.

## Cuándo no deshabilitar

${par(
  "Prefiere un **control habilitado que explique qué falta** antes de deshabilitarlo. Un botón que no se puede pulsar y no dice por qué deja al usuario sin salida.",
  "No te apoyes en \`isDisabled\` **como forma de guiar**. En Light el fondo deshabilitado da **1.30:1** contra el lienzo: no se percibe como control, así que ni siquiera comunica que existe."
)}

${preview("isDisabled", "Habilitado y deshabilitado",
  "El deshabilitado pierde contraste a propósito: no debe invitar a pulsar. Por eso conviene evitarlo cuando se puede explicar el motivo.")}

${cuidado("El estado deshabilitado se distingue **solo por color** —ni forma, ni borde, ni texto—. La tecnología asistiva sí lo recibe, porque el atributo nativo lo declara; el problema es de quien mira la pantalla, no de quien la escucha.")}

## Qué pasa mientras carga

Al pulsar, un spinner ocupa la ranura derecha y el botón deja de aceptar activaciones. **Conserva el foco, conserva su color y conserva su label.**

**No se deshabilita**, y la razón está en el mensaje: deshabilitar comunica «no puedes», y aquí lo que hay que comunicar es «espera».

${tablaDelMd("| El botón tiene | Al cargar | Ancho |")}

El componente **no lanza la petición, no cronometra y no reintenta**. Si la petición nunca resuelve, el botón se queda bloqueado: el timeout y el camino de error son de quien lo usa.

## Las dos ranuras de icono

Son independientes: ninguna, una, la otra, o las dos. Y son **decorativas** — un icono nunca puede ser el único portador del significado.

${preview("showIconLeft", "Con y sin icono inicial",
  "La ranura es opcional y no depende de la otra: se puede usar una, las dos o ninguna.")}

${preview("showIconRight", "Con y sin icono final",
  "El icono acompaña al label, nunca lo sustituye: no existe un botón solo de icono.")}

## Lo que este componente no hace

- **No hay modo solo-icono.** El label siempre está presente.
- **No es un toggle.** No mantiene estado presionado; \`aria-pressed\` no se usa nunca.
- **No decide el resultado.** Modal, navegación o recarga los resuelve quien lo usa.
- **No muestra el resultado.** Éxito, error y validación viven en el contenedor, nunca dentro del control.
- **No reacciona al breakpoint.** Ninguna medida suya cambia con el ancho de la pantalla.

## Componentes relacionados

- **Link** — para navegar
- **ArrowRight** — el icono por defecto de las dos ranuras`,

"Especificaciones": `Todo lo de abajo sale del componente real y se regenera con él.

${/* 🔴 Encabezado contenedor de las tres pestañas, añadido el 9 sep 2026.
    * Lo creó el Lead a mano en Supernova: agrupó «Anatomía», «Propiedades» y
    * «Estados» —que eran tres secciones hermanas apiladas— en una sola con tres
    * pestañas. Se reproduce aquí porque `writeMarkdownToPage` borra las Sections
    * y la reorganización se habría perdido en la siguiente publicación.
    *
    * ⚠️ El agrupador necesita que este título EXISTA y que los tres que agrupa
    * vayan justo detrás: convierte una tirada de títulos del mismo grupo en
    * pestañas, y este de arriba es el que queda fuera rotulándolas. */ ""}
## Anatomía, Propiedades y Estados

## Anatomía

${preview("Anatomy", "Los cuatro elementos",
  "Los marcadores numerados corresponden, en el mismo orden, a las filas de la tabla de abajo.")}

Los marcadores del dibujo y las filas de la tabla son la misma lista, en el mismo orden.

${tablaDelMd("| # | Type | Element | Notes |")}

## Propiedades

Lo que se configura desde código. \`hover\`, \`pressed\` y \`focus\` no están aquí a propósito: son condiciones de runtime que resuelve la plataforma.

${tablaDelMd("| Property | Type | Values | Default | Notes |")}

Las dos ranuras aceptan cualquier icono de la librería Phosphor. El que traen por defecto es \`ArrowRight\`, en \`Format=Outline\`.

## Estados

${tablaDelMd("| Condition | Qué la dispara | Qué cambia | Focus stops |")}

- Es \`focus-visible\`, no \`focus\`: el anillo aparece para el teclado, no tras un clic. **No se suprime nunca** — es lo que satisface WCAG 2.4.7.
- \`hover\` **no puede ser el único portador de información**: en táctil no existe.
- El puntero activa **al soltar dentro del control**, no al presionar. Arrastrar fuera antes de soltar cancela.
- El teclado activa con **Enter y Espacio**. Las tres plataformas lo dan gratis con el control nativo: no lo reimplementes sobre un \`<div>\`.

### Cómo se declara \`isLoading\`

${tablaDelMd("| Platform | Declaración | No uses |")}

🔴 **\`aria-busy\` no bloquea nada por sí solo.** El bloqueo contra clics repetidos se implementa en código: mientras \`isLoading\` sea \`true\`, toda activación —puntero o teclado— se ignora.

## Medidas

Las alturas y los anchos son **mínimos, nunca fijos**: \`heightMode\` es \`hug\` en las 60 variantes, y es lo que permite que el texto crezca al 200% sin recortarse.

### Área táctil

${tablaDelMd("| Size | min-height | min-width | ≥ 44 px |")}

El umbral son **44 px, estándar propio de 100 Ladrillos**, alineado a WCAG 2.5.5 (AAA) y a las Apple HIG. El mínimo AA de 2.5.8 son 24 px. Supuesto declarado: 1 px de Figma = 1 px CSS.

### Por talla

${preview("Button sizes", "Las tres tallas",
  "`s`, `m` y `l` en proporción, una al lado de otra. Las medidas exactas están en la tabla de abajo.")}

${tablaDelMd("| Spec | s | m | l | Notes |")}

### Por superficie

${preview("Button surface", "Las dos superficies",
  "Mismas medidas en ambas: lo que cambia es el peso del label y el escalón de sombra, no la geometría.")}

${tablaDelMd("| Spec | product | marketing | Notes |")}

### Por variante

${tablaDelMd("| Spec | primary | secondary | Notes |")}

### En foco

${preview("Button states", "Los cinco estados",
  "Reposo, puntero encima, presionado, con foco y deshabilitado. Solo cambia el relleno; la caja no se mueve.")}

${tablaDelMd("| Spec | s | m | l | Notes |", 2)}

## Ancho, alto y zoom

${tablaDelMd("| Dimension | Comportamiento |")}

**El botón nunca se pone al 100% por su cuenta.** Estirarlo es decisión del contenedor; al estirarse, el contenido sigue centrado y el inset no cambia.

🔴 **Nunca cambies \`min-height\` por \`height\` para cuadrar un layout.** Es exactamente el defecto que corrigió la escala del 27 de agosto.

**Light y Dark no son responsive:** el modo lo resuelve la colección \`semanticColors\` en la capa de tema, no una media query dentro del componente.

## Color

${/* 🔴 REESTRUCTURADO el 9 sep 2026, y la forma la propuso el Lead.
    *
    * Antes: UNA grilla con los 14 tokens del componente, cruzados todos contra
    * todos. 196 celdas, scroll horizontal, y ~28 correspondientes a una
    * combinación real. Diseñadores que la vieron «no supieron qué estaban
    * mirando»; el veredicto fue «nada útil».
    *
    * Su propuesta —dejar de mirarlo global y hacerlo por parte— con la corrección
    * de que la partición útil es por VARIANTE y no por tipo de color (partir en
    * fondos/textos/iconos suma 221 celdas: cada mitad recruza los 7 fondos), más
    * las pestañas embebidas que él mismo montó para el lector de pantalla.
    *
    * Ahora son dos preguntas distintas, separadas a propósito:
    *   · la GRILLA responde «qué combinaciones son seguras» — explorador
    *   · la TABLA responde «qué combinaciones usa este botón» — especificación
    *
    * Los tokens de cada pestaña se DERIVAN de las tablas del .md
    * (`tokensPorVariante`), no se listan aquí: si una variante deja de usar un
    * token, esto lo refleja solo. */ ""}
El contraste se calcula sobre los valores vivos de cada token, así que **ningún ratio escrito a mano puede caducar aquí.**

### Qué combinaciones son seguras

Cada pestaña cruza los colores de una variante entre sí. Sirve para decidir: si una combinación no está en la tabla de abajo pero la necesitas, aquí ves si es segura antes de usarla.

${VARIANTES_COLOR.map(v => `#### ${v}

<SNBlock packageId="io.supernova.block.color-accessibility-grid">
  <SNItem>
    <SNProp name="tokens" value={${tokens(...TOKENS_POR_VARIANTE[v])}} />
  </SNItem>
</SNBlock>`).join("\n\n")}

### Las que este botón usa

Un par por estado, con el contraste de lo que va encima del relleno. **El label exige 4.5:1** (texto normal) y **los iconos 3:1** (WCAG 1.4.11, no textual).

${TABLA_CONTRASTE}

Los valores marcados con \\* son del estado deshabilitado, **exento de requisito de contraste** por WCAG 1.4.3: un control inactivo no tiene umbral que cumplir. Se muestran igualmente porque exento no es lo mismo que legible — el icono deshabilitado da 1.74:1 en Light, y ése es el argumento de la sección «Cuándo no deshabilitar».

### Cómo resuelve en cada mode

${preview("Primary / Product / Light", "Light Mode",
  "El relleno toma la escala de marca y el label resuelve a su inverso claro.")}

${preview("Primary / Product / Dark", "Dark Mode",
  "Los mismos tokens sobre lienzo oscuro: el relleno aclara dentro de la escala de marca y el label invierte a oscuro.")}

Las ocho combinaciones —\`variant\` × \`surface\` × mode— están en la especificación del repositorio.

### Los tokens del componente

<SNBlock packageId="io.supernova.block.design-tokens" variantId="table">
  <SNItem>
    <SNProp name="tokens" value={${tokens("background/brandMain","background/brandHover","background/brandPressed","background/hover","background/selected","background/secondary","background/disabled","text/primaryInverse","text/primaryInverseStatic","text/secondary","text/disabled","icon/inverse","icon/inverseStatic","icon/disabled","border/focus","border/disabled")}} swatches={${swatches("light","dark")}} />
    ${columnasDeToken(COBERTURA_TK.cobertura, COBERTURA_TK._totalDeTokens)}
  </SNItem>
</SNBlock>

<SNCallout type="Warning">
**Un token que invierte con el mode no puede ir sobre un fondo que no invierte.** \`background/selected\` resuelve \`#315fa3\` en Light y en Dark —es azul de marca, no depende del lienzo—, así que el texto y el icono sobre él usan las variantes **Static**. Antes heredaban las normales: en Light casaba por casualidad y en Dark el texto caía a 3.29:1.
</SNCallout>

## Movimiento

No hay especificación de After Effects para este componente. Lo de abajo es la intención a implementar.

${tablaDelMd("| # | Qué anima | Duración | Easing | Notas |")}

### Con \`prefers-reduced-motion: reduce\`

${tablaDelMd("| # | Qué pasa |")}

**El spinner se ralentiza; no se quita.** \`reduce\` significa eliminar el movimiento capaz de provocar malestar vestibular —desplazamientos grandes, paralaje, zoom— **sin perder información**. El spinner mide 16 · 20 · 24 px, gira sobre su propio centro y es la única señal visible de que el botón está trabajando.

## Contenido que recibe

${tablaDelMd("| Input | Type | Required | Lo que el componente asume |")}

## Lector de pantalla

Qué anuncia cada plataforma, estado por estado. **Es una decisión de diseño, no una consecuencia del marcado:** el código tiene atributos, no anuncios comprometidos.

### Dónde cae el foco

Las tablas dicen **qué se anuncia**; estas dos imágenes dicen **dónde para el foco**, que es lo único que el texto no puede enseñar.

${preview("State: rest / hover / active / focus-visible", "Una sola parada de foco",
  "El anillo rodea el control entero, no sus partes: label e iconos se anuncian como un único elemento.")}

${preview("State: isDisabled === true", "Deshabilitado, fuera del tabulador",
  "Cero paradas de foco: el control sale del orden de tabulación y el teclado no puede alcanzarlo.")}

### En reposo, con el puntero encima, presionado y con foco

Una sola parada de foco y el mismo anuncio en los cuatro. Solo cambian relleno, borde y sombra.

${tablasDeEstado("State: rest / hover / active / focus-visible")}

### Deshabilitado

Cero paradas de foco: el control sale por completo del orden de tabulación.

${tablasDeEstado("State: isDisabled === true")}

<SNCallout type="Info">
El anuncio de \`isLoading\` está especificado en Figma y todavía no transcrito aquí: esta página documenta **2 de las 4** paradas de foco de la anotación. Lo que falta está registrado en Defectos abiertos.
</SNCallout>

## Criterios de aceptación

Lo que hay que poder comprobar para dar el componente por construido. **Ninguno se verifica mirando.**

### Batería base — idéntica en todo el sistema

${tablaDelMd("| # | Área | Criterio |")}

### Propios del Button

${tablaDelMd("| # | Área | Criterio |", 2)}

## Foundations relacionadas

- **Color** — la colección \`semanticColors\` y sus dos modes
- **Espaciado** — la escala \`space\`, de la que salen todos los insets`,

/**
 * 🔴 EL METADATO `Estado` SALE DEL CALLOUT — 8 sep 2026, y solo ese.
 *
 * El Lead lo señaló como «un tercer sitio diciendo lo mismo, a mano». Tenía
 * razón, y se midió cuál de los cuatro datos lo era: `sdk.components`
 * `.getComponentProperties` devuelve **`Status` como propiedad real del
 * componente**, con valor `status-healthy` en el Button. Eso es lo que publican
 * `component-health` y `component-checklist` en `Estatus y cambios`.
 *
 * ⚠️ Los otros tres NO se borran, y es una desviación deliberada de la
 * instrucción «el callout sobra»: **`Categoría`, `Dueño` y `También llamado` no
 * son propiedades de componente** —solo hay cinco definidas y ninguna es esas—,
 * así que nada más en el sistema los publica. Borrar el callout entero habría
 * tirado tres datos para quitar uno duplicado. *`También llamado` además es el
 * anillo de sinónimos: es lo que hace que quien busca «CTA» encuentre el Button.*
 *
 * 🔴 Y de paso destapa una incoherencia que hay que resolver: el callout decía
 * `Stable` y la propiedad vale `status-healthy`. **Dos vocabularios para el
 * mismo campo.** Al quitar el texto a mano queda uno solo, que es el bueno.
 */

/**
 * 🔴 DOS DECISIONES EDITORIALES DEL 3 SEP 2026, las dos con su porqué.
 *
 * 1 · FUERA el párrafo de apertura «**Stable.** El componente está documentado,
 *     en uso, y con su escala dimensional ya rehecha: alturas 48 · 56 · 64…».
 *     Era el TERCER sitio de esta misma pestaña diciendo lo mismo: el metadato
 *     del `Resumen general` ya publica `**Estado:** Stable`, la primera entrada
 *     del changelog ya cuenta la escala, y `component-health` declara el estado
 *     leyéndolo del componente real. **Un dato escrito a mano al lado de un
 *     bloque que lo calcula es el dato que se queda viejo.**
 *
 * 2 · El changelog SE QUEDA COMO LISTA, y no pasa a `release-notes` pese a que
 *     el nombre del bloque promete justo eso. **Verificado, no supuesto:**
 *     `release-notes` se declara con `properties: []` —no acepta contenido— y su
 *     descripción es *«Show formatted release notes from all previously
 *     released versions»*: muestra el historial de versiones del DESIGN SYSTEM,
 *     no un changelog de componente escrito a mano.
 *
 *     ⚠️ Y hoy ese historial está vacío: el design system tiene **una sola
 *     versión, `Shared Draft`, con `changeLog: null`**. Sustituir la lista por
 *     `<SNReleaseNotes />` habría borrado las seis entradas para no enseñar
 *     nada. *El bloque es el correcto el día que se versione el sistema; el
 *     contenido que tenemos no es el suyo.*
 */
"Estatus y cambios": `<SNCallout type="Info">
**El cambio de más alcance para quien consume el componente es el defecto de \`size\`, que pasó de \`s\` a \`m\`.** Toda instancia que no especifique talla cambia de aspecto al actualizar la librería.
</SNCallout>

## Salud del componente

<SNBlock packageId="io.supernova.block.component-health">
  <SNItem>
    <SNProp name="components" value={[{ entityId: "${COMPONENTE_CANONICO}", entityType: "Component" }]} />
  </SNItem>
</SNBlock>

## Definition of done

<SNBlock packageId="io.supernova.block.component-checklist">
  <SNItem>
    <SNProp name="components" value={[{ entityId: "${COMPONENTE_CANONICO}", entityType: "Component" }]} />
    ${/* 🔴 El título es PARÁMETRO, no constante, y la razón la puso el Lead el
        * 9 sep 2026: «tengo la sensación de que si existe este campo es porque
        * puede variar la comunicación del componente». Tiene razón — Supernova lo
        * hizo editable a propósito. Se fija un default en español y cada
        * componente puede apartarse.
        *
        * ⚠️ Y esto se publicaba en INGLÉS sin que nadie lo hubiera decidido: sin
        * la prop, el bloque usa su `defaultValue`, que es «Component checklist».
        * No era una decisión, era el default de la herramienta saliendo a una
        * documentación en español. Es la clase de defecto que no produce error ni
        * hueco visible — solo se ve mirando la página publicada.
        *
        * No repite el encabezado «Definition of done» que lleva encima: dice qué
        * contiene la lista, no vuelve a nombrar la sección. */
      titulo("Lo que el sistema tiene registrado")}
    ${/* Confirmado por el Lead el 9 sep 2026: la descripción se queda. Se emite
        * EXPLÍCITO aunque coincida con el default del bloque — un valor heredado
        * y uno decidido se ven igual en la página, y solo el segundo sobrevive a
        * que Supernova cambie su default. */
      ""}<SNProp name="showDescription" value={true} />
  </SNItem>
</SNBlock>

## Defectos abiertos

Cuatro, y ninguno impide usar el componente. Se publican porque afectan a quien lo consume.

${tabla(["Qué", "A quién afecta", "Estado"], [
  ["\`background/disabled\` apenas se distingue del lienzo en Light — **1.30:1**", "A quien mira la pantalla. Quien la escucha sí recibe el estado: el atributo nativo lo declara", "Abierto"],
  ["Las instancias de icono embebidas traen \`Weight=Fill\`; el defecto declarado de la librería Phosphor es \`Weight=Regular\`", "Al aspecto del icono en las dos ranuras", "Abierto"],
  ["Los 60 \`labelBox\` conservan un \`cornerRadius\` de 12 que no se ve —no tienen relleno— pero sigue en el archivo", "A nadie visualmente. Es residuo de bajar su inset a 0", "A limpiar"],
  ["El anuncio asistivo de \`isLoading\` está dibujado en Figma y no transcrito: esta página documenta 2 de las 4 paradas de foco", "A quien implemente el estado de carga en iOS o Android", "Abierto"],
], [330, 300, 130])}

## Changelog

${ENTRADA_BRAND_DARK}- **1 sep 2026** — \`isLoading\` queda especificado: spinner \`CircleNotch\` en la ranura derecha, **sin una sola variante nueva en Figma**. Con él entran el movimiento, las reglas responsive, los supuestos de contenido y quince criterios de aceptación propios.
- **27 ago 2026** — escala dimensional rehecha: alturas **48 · 56 · 64**, radio único \`radius/l\` (16) en las 60 variantes, y el defecto de \`size\` pasa de \`s\` a \`m\`.
- **21 ago 2026** — corregidas las seis variantes \`secondary\` + \`pressed\`: el texto y el icono pasan a las variantes **Static**. En Dark el texto caía a 3.29:1.
- **20 ago 2026** — \`text/disabled\` pasa a \`neutral/600\` en Light y \`neutral/700\` en Dark. El contraste sobre \`background/disabled\` sube de 1.74:1 a **4.50** y **4.89**.
- **20 ago 2026** — insets alineados a la escala \`space\`.
- **17 ago 2026** — \`tertiary\` sale del componente y nace **Link**; \`quaternary\` se elimina. El Button pasa de **175 a 60 variantes** y su API de **16 propiedades a 9**, idéntica a la del Link.

## Deprecación y migración

Nada deprecado. **La única migración viva es el defecto de \`size\`:** revisa las instancias que no especifican talla antes de actualizar la librería, porque van a cambiar de \`s\` a \`m\`.`,
}

/**
 * 🔴 ESCRIBIR NO ES PUBLICAR, y la distinción es de proceso, no de detalle.
 *
 * `writeMarkdownToPage` deja el contenido en la página. Sacarlo al sitio público
 * es OTRA llamada —`sdk.documentation.publish(ref, "Live")`— que este script no
 * hace y no va a hacer. Verificado el 2 sep 2026 contra los tipos del paquete
 * (`DocumentationEnvironment` tiene `Preview` y `Live` como entornos separados)
 * y contra la plataforma: tras escribir, `isPublishing` sigue en idle y el
 * `publishMetadata` de las cuatro pestañas no cambia.
 *
 * El flujo acordado con el Lead: se escribe → se revisa en `Preview` → **una
 * persona aprueba** → el Lead publica a mano. La aprobación es juicio humano y
 * no la automatiza nadie.
 */
const NO_PUBLICA = `
  ⚠️  Esto ESCRIBIÓ la página; NO la publicó al sitio público.
      Revísala en Preview. La publicación a Live la hace el Lead a mano.`

/**
 * 🔴 Antes de nada, el destino. Copiado del patrón de `publicar.mjs`, que era
 * el único de los tres caminos que lo tenía: si el `.env` apunta a la vía de
 * contingencia, escribir en Supernova es un accidente caro.
 */
import { exigirDestino, destino } from "../experimento-canario/destino.mjs"
/**
 * 🔴 Y la key por `entorno.mjs`, no a mano. El `leerKey()` anterior hacía
 * `.find(...).split(...)` sin comprobar que la línea existiera: sin `.env`
 * reventaba con un TypeError que no dice qué falta. `entorno.mjs` usa
 * `process.loadEnvFile`, respeta la variable de entorno si ya está puesta —así
 * funciona igual en CI— y sale con instrucciones si falta.
 */
import { apiKey } from "../experimento-canario/entorno.mjs"

/**
 * 🔴 La puerta de previews, también de `publicar.mjs`. Va ANTES de escribir:
 * `validateMarkdown` responde por la sintaxis, no por lo que se ve. Un preview
 * sin `fraccionAncho` sale diminuto o gigante y valida igual de bien.
 */
const verificarPreviews = async () => {
  const { verificar } = await import("../experimento-canario/verificar-previews.mjs")
  const malos = verificar(FRAMES, import.meta.url).filter(f => f.problemas.length)
  if (!malos.length) { console.log(`  Previews en regla: ${Object.keys(FRAMES).length}.`); return }
  console.error(`\n🔴 ${malos.length} preview(s) con problemas:`)
  for (const f of malos) console.error(`     · ${f.seccion} — ${f.problemas.join(" · ")}`)
  console.error("   Corrígelos, o escribe con --forzar si es deliberado.")
  process.exit(1)
}

/**
 * 🔴 La segunda puerta, y nació de un defecto de siete días. `verificar-previews`
 * comprueba que cada preview traiga su `fraccionAncho`; NO comprueba que el
 * asset que Supernova sirve sea el PNG que tenemos en disco. El 27 de agosto se
 * re-exportaron los 23 previews con la geometría nueva, el 28 se recortaron los
 * 23 — y solo 8 se subieron. Los otros 15 siguieron publicando el render
 * anterior: `radius` 8 en product, 12 en marketing, 24 en las tallas m y l.
 * Geometría que ya no existía en Figma, en la página, bajo un texto que decía
 * «un único radius/l (16) en las 60 variantes».
 *
 * ⚠️ Nada de eso produjo un error. El registro tenía sus 23 entradas, la puerta
 * de previews daba verde y el `.md` salía completo. Un método que resuelve 8 de
 * 23 sin declarar su cobertura se lee como si hubiera resuelto los 23.
 */
/**
 * 🔴 LA PUERTA, desde el 3 sep 2026. Sustituye a las dos anteriores, y las dos
 * dejan de aplicar por la misma razón: **ya no hay imágenes subidas en esta
 * página.**
 *
 *   · `verificarPreviews` medía `fraccionAncho`, el % del lienzo ocupado por el
 *     contenido. Existía porque un PNG exportado con mucho margen sale diminuto
 *     al escalarse a la columna. Un frame vivo no tiene lienzo: Supernova
 *     renderiza el nodo exacto. **La causa desapareció, no se sustituye.**
 *   · `verificarSubidos` comparaba el asset publicado con el PNG de disco. Sin
 *     PNG de disco no hay nada que comparar.
 *
 * ⚠️ Las dos siguen en el repo y siguen sirviendo: en cuanto un componente
 * vuelva a colocar una imagen subida, vuelven a ser la puerta de esa imagen.
 * `npm run docs:previews` y `npm run docs:subidos`.
 */
const verificarFramesVivos = async () => {
  const { execFileSync } = await import("node:child_process")
  try {
    const out = execFileSync("node", [path.join(RAIZ, "experimento-canario/frames-vivos.mjs")])
    for (const l of out.toString().trim().split("\n")) console.log("  " + l.trim())
  } catch (e) {
    console.error((e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? ""))
    console.error("🔴 Los frames vivos no están en regla. Corre `npm run docs:frames -- --render --registro`.")
    process.exit(1)
  }
}

const verificarSubidos = async () => {
  const { execFileSync } = await import("node:child_process")
  try {
    const out = execFileSync("node", [path.join(RAIZ, "experimento-canario/verificar-subidos.mjs")])
    console.log("  " + out.toString().trim().split("\n").slice(1).join("\n  "))
  } catch (e) {
    console.error((e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? ""))
    console.error("🔴 Hay previews publicados que ya no son los de disco. Resúbelos, o escribe con --forzar si es deliberado.")
    process.exit(1)
  }
}

/**
 * 🔴 Corre SIEMPRE justo después de escribir, y ese orden no se puede invertir.
 *
 * `writeMarkdownToPage` reemplaza la página entera, así que borra las Sections
 * de pestañas de la publicación anterior. Volver a crearlas no es un remiendo:
 * es el segundo paso obligatorio de cada publicación. Markdown no sabe emitir
 * Sections — solo `elementAction` — y por eso son dos pasos y no uno.
 */
const agruparPlataformas = async (sn, ref, idPagina, nombre) => {
  const { secciones } = await aplicarPestanas(sn, ref, idPagina)
  for (const s of secciones) console.log(`    ↳ pestañas en ${nombre}: ${s.join(" · ")}`)
}

const main = async () => {
  // `--escribir` es el nombre correcto; `--publicar` se conserva porque estaba
  // en uso, pero MIENTE: este script nunca publica al sitio público.
  const escribir = process.argv.includes("--escribir") || process.argv.includes("--publicar")
  exigirDestino("supernova")
  console.log(`  destino de documentación: ${destino.nombre} (${destino.estado})`)
  const sn = new Supernova(apiKey)
  // 🔴 DS y WS se resuelven por API, no se escriben a mano. Estaban hardcodeados
  // y eso ata el script a un espacio concreto sin decirlo.
  const me = await sn.me.me()
  const ws = (await sn.workspaces.workspaces(me.id))[0]
  const ds = (await sn.designSystems.designSystems(ws.id)).find(d => /later/i.test(d.name))
  if (!ds) throw new Error(`No encontré un design system «Later» en el workspace ${ws.id}.`)
  const version = await sn.versions.getActiveVersion(ds.id)
  const ref  = { designSystemId: ds.id, versionId: version.id, workspaceId: ws.id }
  const refW = { designSystemId: ds.id, versionId: version.id }
  console.log(`  destino: ${ds.name} (${ds.id}) · workspace ${ws.id} · versión ${version.id}`)
  const nombres = Object.keys(TABS)

  // 🔴 Antes que nada, y también en --dump: un preview registrado tiene que
  // estar colocado o declarado fuera. Sin esta puerta, la página sale con la
  // forma correcta y con previews perdidos que nada delata.
  verificarCobertura(TABS)

  if (process.argv.includes("--dump")) {
    const dir = path.join(AQUI, "salida", "button-tabs")
    fs.mkdirSync(dir, { recursive: true })
    for (const n of nombres) fs.writeFileSync(path.join(dir, `${n}.mdx`), TABS[n])
    console.log("volcado en salida/button-tabs/")
    return
  }

  /* 🔴 Antes que la validación de sintaxis: que la prosa no hable del mecanismo.
   * Va aquí y no en doctrina porque como doctrina no se ejecutó — se publicaron
   * tres fugas. Y corre sobre TABS, o sea sobre lo que sale a la página: el `.md`
   * de uSpec sí puede hablar del extractor, la página no. Una de las tres venía
   * literalmente de una celda del `.md`. */
  exigirAgnostico(TABS)
  informeDeAnchos(REGISTRO_ANCHOS)

  // Validar TODO antes de crear nada.
  let ok = true
  for (const n of nombres) {
    const r = await sn.import.validateMarkdown(refW, TABS[n])
    if (r?.isValid) console.log(`  ✓ ${n}`)
    else { console.log(`  🔴 ${n}: ${r?.error?.message}`); ok = false }
  }
  if (!ok) { console.error("\n🔴 No se crea nada con errores."); process.exit(1) }
  if (!escribir) { console.log("\nValidado. Añade --escribir para volcarlo a la página."); return }
  if (!process.argv.includes("--forzar")) await verificarFramesVivos()

  // Si el Button ya existe, se REESCRIBE. Crear otro duplicaría la página y
  // consumiría cuatro más del presupuesto.
  const registro = path.join(AQUI, "button.ids.json")
  if (fs.existsSync(registro)) {
    const { pestanas: previas } = JSON.parse(fs.readFileSync(registro, "utf8"))
    const items = await sn.documentation.getDocumentationStructure(ref)
    const numerico = new Map(items.map(i => [i.persistentId, String(i.id)]))
    console.log("\nEl Button ya existe: se reescriben sus pestañas.")
    for (const n of nombres) {
      const id = numerico.get(previas[n])
      if (!id) { console.log(`  🔴 ${n}: la pestaña ya no existe`); continue }
      const r = await sn.import.writeMarkdownToPage(refW, id, TABS[n])
      console.log(`  ✓ ${n} → ${r?.blockCount ?? "?"} bloques`)
      await agruparPlataformas(sn, ref, id, n)
    }
    console.log(NO_PUBLICA)
    return
  }

  const paginaId = await sn.documentation.createDocumentationPage(ref, {
    title: "Button", parentPersistentId: GRUPO_COMPONENTES,
  })
  const grupo = await sn.documentation.createDocumentationTab(ref, {
    fromItemPersistentId: paginaId, tabName: nombres[0],
  })
  const pestanas = { [nombres[0]]: paginaId }
  for (const n of nombres.slice(1)) {
    pestanas[n] = await sn.documentation.createDocumentationTab(ref, { fromItemPersistentId: grupo, tabName: n })
  }
  const items = await sn.documentation.getDocumentationStructure(ref)
  const numerico = new Map(items.map(i => [i.persistentId, String(i.id)]))
  console.log("")
  for (const n of nombres) {
    const r = await sn.import.writeMarkdownToPage(refW, numerico.get(pestanas[n]), TABS[n])
    console.log(`  ✓ ${n} → ${r?.blockCount ?? "?"} bloques`)
    await agruparPlataformas(sn, ref, numerico.get(pestanas[n]), n)
  }
  fs.writeFileSync(path.join(AQUI, "button.ids.json"), JSON.stringify({ grupo, pestanas }, null, 2) + "\n")
  console.log(NO_PUBLICA)
}

main().catch(e => { console.error("🔴 " + (e?.message ?? e)); process.exit(1) })
