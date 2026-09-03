#!/usr/bin/env node
/**
 * ¿La extracción que se va a interpretar es la que crees?
 *
 * 🔴 Por qué existe. Hay DOS `_base.json` del Button en el repo:
 *   · `spec-origen/<slug>/<slug>-_base.json`  — el que deposita el Lead. Manda.
 *   · `.uspec-cache/<slug>/<slug>-_base.json` — la copia stageada del CLI.
 * Las skills `extract-*` leen la CACHÉ. Así que si el Lead corre una extracción
 * nueva y nadie re-stagea, la interpretación entera se hace sobre la anterior
 * **sin que nada falle**: sale un `.md` bien formado, completo, y describiendo
 * el componente de hace una semana.
 *
 * Es el mismo defecto que ya costó una semana en agosto, con otro disfraz: el
 * 27 de agosto se descubrió que el `_base.json` en disco era del 20 y que
 * regenerar desde él «habría producido documentación caduca con apariencia de
 * fresca».
 *
 *   node verificar-origen.mjs [slug]     → compara y sale 1 si no coinciden
 */
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const AQUI = path.dirname(new URL(import.meta.url).pathname)
const slug = process.argv[2] ?? "button"
const origen = path.join(AQUI, "spec-origen", slug, `${slug}-_base.json`)
const cache  = path.join(AQUI, ".uspec-cache", slug, `${slug}-_base.json`)

const meta = (p) => {
  if (!existsSync(p)) return null
  try { const d = JSON.parse(readFileSync(p, "utf8"))
        return { extractedAt: d?._meta?.extractedAt ?? null,
                 nodeId: d?._meta?.nodeId ?? null,
                 variantes: Array.isArray(d?.variants) ? d.variants.length : null,
                 contexto: (d?._meta?.optionalContext ?? "").length,
                 bytes: readFileSync(p).length } }
  catch (e) { return { error: (e?.message ?? e).toString().slice(0, 80) } }
}

const o = meta(origen), c = meta(cache)
const linea = (n, m) => m
  ? console.log(`  ${n.padEnd(14)} ${m.error ? "🔴 ilegible: " + m.error
      : `extractedAt=${m.extractedAt} · nodo=${m.nodeId} · ${m.variantes} variantes · contexto ${m.contexto} chars · ${m.bytes} B`}`)
  : console.log(`  ${n.padEnd(14)} (no existe)`)

console.log(`Extracción de «${slug}»:`)
linea("spec-origen", o); linea(".uspec-cache", c)

if (!o) { console.error(`\n🔴 No hay extracción en spec-origen/${slug}/. Es la que manda: deposítala ahí.`); process.exit(1) }
if (!c) { console.log(`\n🟢 No hay caché stageada. La interpretación tendrá que stagear desde spec-origen.`); process.exit(0) }
if (o.error || c.error) { console.error("\n🔴 Alguno de los dos no se puede leer."); process.exit(1) }

if (o.extractedAt !== c.extractedAt) {
  console.error(`\n🔴 LA CACHÉ NO ES LA EXTRACCIÓN VIGENTE.`)
  console.error(`   spec-origen  → ${o.extractedAt}`)
  console.error(`   .uspec-cache → ${c.extractedAt}`)
  console.error(`\n   Las skills extract-* leen la CACHÉ, así que interpretar ahora describiría`)
  console.error(`   el componente de esa fecha, con un .md bien formado y ningún error.`)
  console.error(`   Re-stagea desde spec-origen antes de interpretar (uspecs component-md prepare).`)
  process.exit(1)
}
console.log(`\n🟢 Coinciden: la caché es la extracción del ${o.extractedAt}.`)
