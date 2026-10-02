/**
 * verificar-anchos.mjs — ¿alguien ajustó un ancho a mano y no lo capturó?
 *
 * POR QUÉ EXISTE
 * --------------
 * `anchos-de-tabla.mjs` preserva los anchos que el Lead ajusta a mano, pero solo
 * los que están EN EL REGISTRO. Y el registro solo se llena si alguien corre
 * `docs:anchos` DESPUÉS de ajustar.
 *
 * 🔴 Eso es E3 del FODA: una regla que exige acordarse no se ejecuta. El 1 oct
 * 2026 aparecieron 3 anchos nuevos en el changelog de «Bordes» entre las 22:22 y
 * las 22:31, y nada lo habría dicho. Lo cazó un diff corrido por otro motivo.
 *
 * Esto convierte el «acuérdate» en una comprobación, y el precedente de por qué
 * importa es del 8 sep 2026: se perdieron 16 anchos del Button y se recuperaron 7.
 *
 * 🎯 LA IDEA QUE LO HACE POSIBLE SIN RUIDO
 * ----------------------------------------
 * El problema no es detectar que un ancho vivo no está en el registro: eso pasa
 * en CUALQUIER tabla que nadie haya ajustado nunca. «Grillas y espacios» tiene
 * 10 tablas así y «Curvas esquinadas» 4. Un aviso que las marcara nacería
 * gritando y moriría ignorado en dos semanas.
 *
 * **La señal no es «no está registrado»: es «no coincide con el cálculo».**
 * Un ancho que la fórmula produce es un DEFAULT, lo haya registrado alguien o no.
 * Un ancho que la fórmula no produce lo puso una persona.
 *
 * LAS CUATRO SITUACIONES, y solo dos paran
 * ----------------------------------------
 *   registro  vivo            veredicto
 *   ────────  ──────────────  ────────────────────────────────────────────────
 *   no        == cálculo      `default`     nadie lo tocó. Silencio
 *   no        != cálculo      `sin-capturar` 🔴 alguien ajustó y no capturó
 *   sí        == registro     `preservado`  capturado bien. Silencio
 *   sí        != registro     `ajuste-nuevo` 🔴 se reajustó después de capturar
 *
 * Y una quinta que NO para, porque es legítima: una firma del registro que ya no
 * aparece viva significa que la tabla cambió de contenido. Se recalculará, y eso
 * es lo correcto.
 *
 * ⚠️ LÍMITE DECLARADO: esto solo ve las tablas cuya firma empareja entre el `.md`
 * y la página viva. Si una tabla cambió de contenido en esta misma corrida, su
 * firma no empareja y queda fuera de la comprobación. Se declara en la cobertura.
 */

/** Dos listas de anchos son la misma. */
const igual = (a, b) =>
  Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i])

/**
 * Compara lo que se va a escribir contra lo que hay vivo.
 * Función pura: no toca la red, así que se puede probar con datos inventados.
 *
 * @param registro - [{ firma, origen, calculados }] del generador de esta corrida
 * @param vivos    - { firma: number[] } leído de la página publicada
 * @param delLead  - ANCHOS_DEL_LEAD
 * @returns {{ veredictos: object[], paran: object[], cobertura: string }}
 */
export const compararAnchos = (registro, vivos, delLead) => {
  const veredictos = []
  for (const r of registro) {
    const vivo = vivos[r.firma]
    if (!vivo) { veredictos.push({ ...r, clase: "sin-pareja" }); continue }
    const suyo = delLead[r.firma]
    if (suyo) {
      veredictos.push({ ...r, vivo, registrado: suyo, clase: igual(vivo, suyo) ? "preservado" : "ajuste-nuevo" })
      continue
    }
    veredictos.push({ ...r, vivo, clase: igual(vivo, r.calculados) ? "default" : "sin-capturar" })
  }
  const paran = veredictos.filter(v => v.clase === "sin-capturar" || v.clase === "ajuste-nuevo")
  const emparejadas = veredictos.filter(v => v.clase !== "sin-pareja").length
  return { veredictos, paran, cobertura: `${emparejadas} de ${registro.length} tablas comparadas contra la página viva` }
}

/**
 * Informa, y ABORTA si hay un ajuste sin capturar.
 *
 * 🔴 ABORTA, no avisa, y el porqué no es gusto: `writeMarkdownToPage` REEMPLAZA
 * la página entera, así que el daño es irreversible en el momento de escribir. Un
 * aviso que no para se lee una vez y se ignora la siguiente; y recuperar lo
 * perdido costó 9 de 16 anchos en septiembre. **Parar cuesta un comando; no parar
 * costó rehacer a mano.**
 *
 * ⚠️ Solo aborta al ESCRIBIR. En validación informa y sigue, porque ahí no hay
 * daño que prevenir y bloquear la validación pararía la puerta sin motivo.
 *
 * @returns true si se puede seguir
 */
export const informarYDecidir = ({ veredictos, paran, cobertura }, { escribir, grupo, forzar }) => {
  const n = (c) => veredictos.filter(v => v.clase === c).length
  console.log(`  ✓ anchos vivos: ${n("preservado")} preservados · ${n("default")} por defecto · ${n("sin-pareja")} sin pareja viva`)
  console.log(`    ${cobertura}`)

  if (!paran.length) return true

  console.log(`\n  🔴 ${paran.length} tabla(s) con un ancho puesto a mano que NO está capturado:`)
  for (const v of paran) {
    console.log(`     · ${v.firma.slice(0, 70)}`)
    if (v.clase === "sin-capturar") {
      console.log(`         en la página viva: [${v.vivo.join(",")}]`)
      console.log(`         se escribiría:     [${(v.calculados ?? []).join(",")}]  ← el cálculo, y pisaría el ajuste`)
    } else {
      console.log(`         en la página viva: [${v.vivo.join(",")}]`)
      console.log(`         en el registro:    [${v.registrado.join(",")}]  ← capturado antes, y se reajustó después`)
    }
  }
  console.log(`\n  Captúralos antes de publicar, y el ajuste se conserva:`)
  console.log(`     npm run docs:anchos -- --grupo=${grupo} --escribir`)

  if (!escribir) { console.log(`  (no se está escribiendo, así que solo se informa)`); return true }
  if (forzar) { console.log(`  ⚠️ --forzar-anchos: se escribe igualmente y el ajuste se pierde.`); return true }
  console.error(`\n🔴 No se escribe. Un ancho ajustado a mano es una decisión, y el cálculo no la pisa.`)
  console.error(`   Si de verdad quieres descartarlo: añade --forzar-anchos.\n`)
  return false
}

/** Las tablas vivas de una página, indexadas por firma. Comparte extractor con el capturador. */
export const tablasVivas = (raw, firmaDeTabla, textoDe) => {
  const out = {}
  ;(function w(o) {
    if (!o || typeof o !== "object") return
    if (Array.isArray(o)) return o.forEach(w)
    if (o.packageId === "io.supernova.block.table") {
      for (const item of o.items ?? []) {
        const filas = item?.props?.table?.value
        if (!Array.isArray(filas) || !filas.length) continue
        const cab = (filas[0].cells ?? []).map(textoDe)
        const anchos = (filas[0].cells ?? []).map(c => c.columnWidth)
        const col0 = filas.slice(1).map(f => textoDe((f.cells ?? [])[0]))
        if (anchos.every(a => typeof a === "number") && anchos.length)
          out[firmaDeTabla(cab, col0)] = anchos
      }
      return
    }
    for (const val of Object.values(o)) w(val)
  })(raw)
  return out
}

/* ── Pruebas, ejecutables: node verificar-anchos.mjs --probar ───────────────── */
/* 🔴 Existen porque la primera versión de este frente se dio por probada sobre un
 * cálculo hecho a mano con filas inventadas, y la conclusión salió al revés: se
 * afirmó que «Bordes» tenía 3 anchos puestos a mano cuando los 6 son el cálculo.
 * Una prueba que no usa los datos reales prueba otra cosa. */
if (process.argv.includes("--probar")) {
  const { ANCHOS_DEL_LEAD } = await import("./anchos-de-tabla.mjs")
  const { convertir, REGISTRO_ANCHOS, vaciarRegistroDeAnchos } = await import("./experimento-canario/conversor.mjs")
  const { readFileSync } = await import("node:fs")

  const registroDe = (slug) => {
    vaciarRegistroDeAnchos()
    const md = readFileSync(new URL(`./Cimientos/${slug}.md`, import.meta.url), "utf8")
    for (const t of md.split(/^# /m).filter(Boolean)) convertir("# " + t)
    return REGISTRO_ANCHOS.map(r => ({ ...r }))
  }

  const reg = registroDe("bordes")
  const vivosReales = Object.fromEntries(reg.map(r => [r.firma, r.calculados]))
  let malos = 0
  const caso = (nombre, vivos, esperado, opciones = { escribir: true, grupo: "X" }) => {
    const cmp = compararAnchos(reg, vivos, ANCHOS_DEL_LEAD)
    const clases = cmp.veredictos.map(v => v.clase)
    const para = cmp.paran.length > 0
    const ok = para === esperado
    console.log(`  ${ok ? "✓" : "🔴"} ${nombre.padEnd(46)} ${para ? "PARA" : "calla"} · esperado ${esperado ? "PARA" : "calla"}`)
    if (!ok) { malos++; console.log(`        clases: ${clases.join(", ")}`) }
    return cmp
  }

  console.log("\n── el aviso de anchos, probado con el registro y los cálculos REALES de «Bordes» ──")
  caso("tal como está hoy, todo capturado", vivosReales, false)

  const sinRegistrar = { ...ANCHOS_DEL_LEAD }
  const unaFirma = reg.find(r => r.firma.startsWith("fecha")).firma
  const ajustado = { ...vivosReales, [unaFirma]: [200, 200, 355] }
  const cmp2 = caso("un ancho puesto a mano y SIN capturar", ajustado, true)

  const reajustado = { ...vivosReales, [unaFirma]: [90, 300, 365] }
  caso("un ancho reajustado DESPUÉS de capturar", reajustado, true)

  const sinPareja = Object.fromEntries(Object.entries(vivosReales).filter(([k]) => !k.startsWith("fecha")))
  caso("una tabla que cambió de forma", sinPareja, false)

  console.log("\n── y el abort, que es la decisión que protege ──")
  const puedeSeguir = informarYDecidir(cmp2, { escribir: true, grupo: "X", forzar: false })
  console.log(`  ${puedeSeguir === false ? "✓" : "🔴"} al ESCRIBIR con un ajuste sin capturar → ${puedeSeguir ? "sigue" : "NO se escribe"}`)
  if (puedeSeguir !== false) malos++
  const enValidacion = informarYDecidir(cmp2, { escribir: false, grupo: "X", forzar: false })
  console.log(`  ${enValidacion === true ? "✓" : "🔴"} en VALIDACIÓN → ${enValidacion ? "informa y sigue" : "para"}`)
  if (enValidacion !== true) malos++

  if (malos) { console.error(`\n🔴 ${malos} caso(s) no se comportan.`); process.exit(1) }
  console.log(`\n🟢 Todos los casos correctos.`)
}
