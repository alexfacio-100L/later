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
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { aplicarPestanas } from "./pestanas-plataforma.mjs"
import { reagruparCitas } from "../experimento-canario/citas.mjs"

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.dirname(AQUI)
const DS = "825551", WS = "767109"
const GRUPO_COMPONENTES = "074cc38b-fbf2-40b8-8802-d519fff8c76e"

const TK = JSON.parse(fs.readFileSync(path.join(AQUI, "config/button-tokens.json"), "utf8"))

/**
 * Los 21 previews que ya se subieron a Supernova el 21 de agosto. NO se vuelven
 * a subir: el registro guarda su assetId, y la página los referencia.
 *
 * ⚠️ `fraccionAncho` es el % del ancho que ocupa el contenido dibujado, medido en
 * Figma. Supernova escala la imagen al ancho de la columna, así que sin ese dato
 * un preview sale diminuto o gigante — y valida igual de bien en los dos casos.
 */
const FRAMES = JSON.parse(fs.readFileSync(
  path.join(RAIZ, "experimento-canario/frames-subidos.json"), "utf8"))

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
 * 🔴 La imagen se referencia por URL con Markdown normal, NO con `<SNImage>`.
 *
 * `<SNImage resourceId="...">` valida, se guarda, y NO SE VE. Comprobado el 26
 * ago 2026 publicando las tres formas juntas en la misma página: solo renderiza
 * `![alt](url)`. El `resourceId` es correcto y el recurso existe — simplemente
 * ese bloque no pinta nada.
 */
const preview = (seccion, pie) => {
  const f = FRAMES[seccion]
  if (!f?.url) throw new Error(
    `No hay preview registrado para «${seccion}» en frames-subidos.json.\n` +
    `   Registrados: ${Object.keys(FRAMES).join(" · ")}`)
  return `![${pie ?? seccion}](${f.url})`
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
const HISTORIA_BUTTON = "681057"

/**
 * Trae una tabla del .md de uSpec y la emite como <SNTable>.
 *
 * 🔴 Emitirla con pipes NO funciona, y falla del peor modo posible: el validador
 * la acepta y al escribir la descarta en silencio. La página queda con sus
 * títulos y sus imágenes, y sin un solo dato, sin que nada lo avise.
 */
const tablaDelMd = (encabezado) => {
  const md = fs.readFileSync(path.join(RAIZ, "Componentes/button.md"), "utf8")
  const lineas = md.split("\n")
  const i = lineas.findIndex(l => l.trim() === encabezado)
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
  return tabla(cuerpo[0], cuerpo.slice(1))
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

const token = (ruta) => ({ entityId: TK[ruta], entityType: "Token" })
const tokens = (...rutas) => JSON.stringify(rutas.map(token))

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
  const anchoBase = Math.floor(760 / cabecera.length)
  const anchoDe = (c) => anchos?.[c] ?? anchoBase

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

const TABS = {
"Resumen general": `# Button

Ejecuta una acción. Lo que navega es un Link.

<SNCallout variant="Info">
**Estado:** Stable · **También llamado:** Action, Call to action, CTA
</SNCallout>

## Propósito

Es el control de acción del sistema: **ejecuta, no navega**. Lo que navega es un \`Link\`, que nació al separar el antiguo valor \`tertiary\`.

<SNCallout variant="Warning">
La propiedad se llama \`variant\`, no \`type\`: \`type\` está reservado en HTML para el tipo de botón. El antiguo \`tertiary\` pasó a ser el componente Link y \`quaternary\` se eliminó.
</SNCallout>

## Información general

- **Categoría:** Action
- **Owner:** Product Design
- **Plataformas:** Web (Bricks UI) · pendiente en Astro, Next y Expo
- **Componentes relacionados:** Link · ArrowRight

## Disponibilidad por plataforma

${tabla(["Plataforma", "Estado", "Implementación"], [
  ["Bricks UI", "En curso", "Storybook conectado"],
  ["Web Next", "Pendiente", "—"],
  ["Web Astro", "Pendiente", "—"],
  ["Mobile Expo", "Pendiente", "—"],
])}`,

"Usos": `# Uso

El Button ejecuta una acción en el lugar donde está. Si la interacción lleva a otra pantalla o a otra URL, el componente correcto es \`Link\`.

## Cuándo usar y cuándo no

**La primera decisión es si esto es un botón.** Las cinco de abajo se leen enfrentadas a propósito: el error que se comete a diario no es elegir mal un valor, es elegir mal el componente.

### Button o Link

${par(
  "Usa **Button** para **ejecutar una acción en el sitio donde estás**: guardar, enviar, confirmar, aplicar un filtro, abrir un modal.",
  "No uses Button para **ir a otra pantalla o a otra URL**. Eso es un \`Link\`, y es el componente en el que se convirtió el antiguo \`tertiary\`."
)}

**La regla, en una línea: un enlace navega, un botón actúa.** Si al pulsarlo cambia la dirección, es un Link aunque parezca un botón.

### Jerarquía

${par(
  "Reserva \`variant=primary\` para **la acción principal de la vista**, y usa \`secondary\` para las de apoyo.",
  "No pongas **dos \`primary\` compitiendo** en la misma vista: si todo destaca, nada destaca y el usuario tiene que leerlo todo para decidir."
)}

### \`surface\` no es jerarquía

${par(
  "Elige \`surface\` por **dónde vive el botón**: \`product\` en app, login y modales; \`marketing\` en landings y campañas.",
  "No uses \`marketing\` **para dar más peso** a un botón dentro del producto. No es un escalón de jerarquía — solo cambia el peso tipográfico del label y su escalón de sombra."
)}

### El label

${par(
  "Escribe un label que **describa la acción**: «Guardar», «Enviar», «Invertir». Es el nombre accesible del control: es lo único que anuncia el lector de pantalla.",
  "No uses labels que describan **la apariencia o el genérico** —«Botón», «Aceptar» para todo—. Y no existe hoy un botón solo de icono: si hiciera falta, exigiría \`aria-label\` explícito."
)}

### El estado deshabilitado

${par(
  "Prefiere un **control habilitado que explique qué falta** antes de deshabilitarlo. Un botón que no se puede pulsar y no dice por qué deja al usuario sin salida.",
  "No te apoyes en \`isDisabled\` **como forma de guiar**. En Light el fondo deshabilitado da **1.30:1** contra el lienzo: no se percibe como control, así que ni siquiera comunica que existe."
)}

${cuidado("El estado deshabilitado se distingue **solo por color** —ni forma, ni borde, ni texto—. Para la tecnología asistiva sí se expone, porque el atributo nativo \`disabled\` lo declara; el problema es de quien mira la pantalla, no de quien la escucha.")}

## Los ejes, uno a uno

Cada eje, con todos sus valores en la misma imagen. **Es la respuesta visual a «¿cuál elijo?»**, que es la pregunta de esta pestaña: los valores están en la especificación, pero la diferencia entre dos valores solo se ve mirándolos juntos.

### \`variant\` — la jerarquía

${preview("variant", "primary y secondary, enfrentados")}

### \`surface\` — dónde vive el botón

${preview("surface", "product y marketing: cambia el peso tipográfico y el escalón de sombra")}

### \`size\` — la talla

${preview("size", "s, m y l. El defecto es m desde el 27 ago 2026")}

### \`isDisabled\` — el estado bloqueado

${preview("isDisabled", "habilitado y deshabilitado, en las dos variantes")}

### \`showIconLeft\` y \`showIconRight\` — las dos ranuras

Son **ortogonales**: el botón puede mostrar ninguna, una, la otra, o las dos.

${preview("showIconLeft", "con y sin icono inicial")}

${preview("showIconRight", "con y sin icono final")}

## Comportamiento

**Los estados de interacción —hover, pressed, focus— los dibuja la plataforma y no se configuran por API.** El eje \`state\` de Figma existe para los diseñadores.

**El único estado que fija un ingeniero es \`isDisabled\`**, que bloquea la interacción y saca el control del orden de tabulación.

\`showIconLeft\` y \`showIconRight\` son independientes: el botón puede mostrar ninguno, uno u otro, o los dos.

## Content guidelines

*Pendiente: cómo se redacta el label y qué pasa cuando no cabe. Es contenido que ninguna herramienta genera — ni Figma lo contiene ni el código lo declara.*

## Responsive

*Pendiente: cómo cambia entre breakpoints. La relación entre el eje \`size\` y el breakpoint es una decisión abierta.*

## Internacionalización

*Pendiente: expansión de texto y RTL. El español expande respecto al inglés y no hay regla de ancho máximo definida.*

## Componentes relacionados

- **Link** — para navegar
- **ArrowRight** — el icono por defecto de ambas ranuras`,

"Especificaciones": `# Especificaciones

Lo que sigue lo genera uSpec desde Figma. **Se regenera, no se edita a mano**: cada preview y cada medida salen del componente real.

## Anatomía

${preview("Anatomy", "Los cuatro elementos, numerados")}

**La numeración es un contrato:** los marcadores del frame y las filas de esta tabla son la misma lista.

${tablaDelMd("| # | Type | Element | Notes |")}

## Medidas

### Por tamaño

${preview("Button sizes")}

${tablaDelMd("| Spec | s | m | l | Notes |")}

### Por superficie

${preview("Button surface", "product y marketing: cambian radio, peso tipográfico y escalón de sombra")}

### Por estado

${preview("Button states", "default, hover, pressed, focus y disabled")}

## Propiedades

<SNCallout variant="Warning">
**Pendiente: el playground interactivo.** Aquí va la tabla de propiedades en vivo cuando el Button exista en código. Hoy no existe —cero componentes de código en el sistema— y las medidas comprometidas están arriba, en Medidas.
</SNCallout>

## Color

El contraste lo calcula Supernova sobre los tokens vivos: **no hay ratios escritos a mano que puedan caducar.**

<SNBlock packageId="io.supernova.block.color-accessibility-grid">
  <SNItem>
    <SNProp name="tokens" value={${tokens("background/brandMain","background/brandHover","background/brandPressed","background/selected","background/secondary","background/disabled")}} />
  </SNItem>
</SNBlock>

### Cómo resuelve en cada mode

${preview("Primary / Product / Light", "Primary · Product · Light")}

${preview("Primary / Product / Dark", "Primary · Product · Dark")}

*Las ocho combinaciones completas —variant × surface × mode— están en la especificación del repo.*

### Los tokens del componente

<SNBlock packageId="io.supernova.block.design-tokens">
  <SNItem>
    <SNProp name="tokens" value={${tokens("background/brandMain","background/brandHover","background/brandPressed","background/hover","background/selected","background/secondary","background/disabled","text/primaryInverse","text/primaryInverseStatic","text/secondary","text/disabled","icon/inverse","icon/inverseStatic","icon/disabled","border/focus","border/disabled")}} />
  </SNItem>
</SNBlock>

<SNCallout variant="Warning">
**Un token que invierte con el mode no puede ir sobre un fondo que no invierte.** \`background/selected\` resuelve \`#315fa3\` en Light y en Dark —es azul de marca, no depende del lienzo—, así que el texto y el icono sobre él usan las variantes **Static**. Antes heredaban las normales: en Light casaba por casualidad y en Dark el texto caía a 3.29:1.
</SNCallout>

## Lector de pantalla

Qué anuncia cada plataforma, estado por estado. **Es una decisión de diseño, no una consecuencia del marcado:** el código tiene atributos, no anuncios comprometidos.

### Dónde cae el foco

Las tablas dicen **qué se anuncia**; estas dos imágenes dicen **dónde para el foco**, que es lo único que el texto no puede enseñar.

${preview("State: rest / hover / active / focus-visible", "rest, hover, active y focus-visible: una sola parada de foco, la misma en los cuatro")}

${preview("State: isDisabled === true", "isDisabled === true: cero paradas de foco — el control sale del orden de tabulación")}

${seccionDelMd("Voice / Screen reader")}

## Accesibilidad

- **Área táctil:** las alturas son **48 · 56 · 64**, en \`min-height\` **y** en \`min-width\`. Las tres tallas superan tanto los 24 x 24 px de **WCAG 2.5.8 Target Size (Minimum), nivel AA**, como los 44 x 44 de **2.5.5 Target Size (Enhanced), nivel AAA**. Los 44 px son un **estándar propio de 100 Ladrillos** alineado a 2.5.5 y a las Apple HIG, no una corrección de conformidad. Supuesto declarado: 1 px de Figma = 1 px CSS.
- **Foco:** \`border/focus\` da **4.80:1 en Light y 4.07:1 en Dark** contra el lienzo, por encima del 3:1 que exige WCAG 1.4.11.
- **Contraste:** el umbral es 4.5:1 en los tres tamaños — 12, 14 y 16 px son «texto normal» para WCAG.
- **Teclado:** activable con Enter y Space. El atributo \`disabled\` nativo lo saca del orden de tabulación.
- **Lector de pantalla:** el nombre accesible sale del \`textContent\`; los SVG van con \`aria-hidden="true"\` y \`focusable="false"\`.
- *Reduced motion: pendiente, junto con la especificación de movimiento.*

## Ejemplos

${preview("Accion principal", "Acción principal")}

${preview("Secundario con icono final", "Secundario con icono final")}

${preview("Deshabilitado", "Deshabilitado")}

## Foundations relacionadas

- **Color** — la colección \`semanticColors\` y sus dos modes
- **Espaciado** — la escala \`space\`, de la que salen todos los paddings`,

"Estatus y cambios": `# Lifecycle

**Stable.** El componente está documentado y en uso, y su escala dimensional ya se rehízo: alturas **48 · 56 · 64**, texto **12 · 14 · 16**, iconos **16 · 20 · 24**, con \`paddingBlock\` constante. La documentación de esta página describe la escala vigente.

<SNCallout variant="Info">
**El cambio de escala más relevante para quien consume el componente es el defecto del eje \`size\`, que pasó de \`s\` a \`m\`.** Todo lo que instancia el Button sin especificar talla cambia de aspecto al actualizar la librería.
</SNCallout>

## Component health

<SNBlock packageId="io.supernova.block.component-health">
  <SNItem>
    <SNProp name="components" value={[{ entityId: "${COMPONENTE_CANONICO}", entityType: "Component" }]} />
  </SNItem>
</SNBlock>

## Definition of done

<SNBlock packageId="io.supernova.block.component-checklist">
  <SNItem>
    <SNProp name="components" value={[{ entityId: "${COMPONENTE_CANONICO}", entityType: "Component" }]} />
  </SNItem>
</SNBlock>

## Changelog

- **21 ago 2026** — corregidas las seis variantes \`secondary\` + \`pressed\`: el texto y el icono pasan a las variantes **Static**. En Dark el texto caía a 3.29:1.
- **20 ago 2026** — \`text/disabled\` pasa a \`neutral/600\` en Light y \`neutral/700\` en Dark. El contraste sobre \`background/disabled\` sube de 1.74:1 a 4.50 y 4.89.
- **20 ago 2026** — paddings alineados a la escala \`space\`: s 8/16 · m 12/16 · l 16/24.

## Deprecation y migration

*No aplica: el componente está activo.*`,
}

const leerKey = () => fs.readFileSync(path.join(RAIZ, ".env"), "utf8")
  .split("\n").find(l => l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()

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
  const publicar = process.argv.includes("--publicar")
  const sn = new Supernova(leerKey())
  const version = await sn.versions.getActiveVersion(DS)
  const ref  = { designSystemId: DS, versionId: version.id, workspaceId: WS }
  const refW = { designSystemId: DS, versionId: version.id }
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

  // Validar TODO antes de crear nada.
  let ok = true
  for (const n of nombres) {
    const r = await sn.import.validateMarkdown(refW, TABS[n])
    if (r?.isValid) console.log(`  ✓ ${n}`)
    else { console.log(`  🔴 ${n}: ${r?.error?.message}`); ok = false }
  }
  if (!ok) { console.error("\n🔴 No se crea nada con errores."); process.exit(1) }
  if (!publicar) { console.log("\nValidado. Añade --publicar para crearlo."); return }

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
}

main().catch(e => { console.error("🔴 " + (e?.message ?? e)); process.exit(1) })
