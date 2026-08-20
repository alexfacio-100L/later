#!/usr/bin/env node
/**
 * Compara la instalación local de uSpec con una versión publicada.
 *
 * Responde tres preguntas antes de actualizar:
 *   1. ¿Qué cambió uSpec?           → lo que hay que revisar
 *   2. ¿Qué hemos tocado nosotros?  → lo que se perdería al actualizar
 *   3. ¿Dónde chocan las dos cosas? → el conflicto real
 *
 * Uso:
 *   node verificar-uspec.mjs            compara con la última publicada
 *   node verificar-uspec.mjs 0.4.0      compara con una versión concreta
 *
 * No instala nada globalmente: descarga el paquete a un temporal y lo borra.
 */

import { execSync } from "node:child_process"
import { readFileSync, existsSync, mkdtempSync, rmSync, readdirSync, statSync } from "node:fs"
import { resolve, dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { tmpdir } from "node:os"

const AQUI = dirname(fileURLToPath(import.meta.url))
const CONFIG = resolve(AQUI, "uspecs.config.json")

/**
 * `init` resuelve dos familias de placeholder al instalar:
 *
 *   {{ref:api/x.md}}          → ../../../references/api/x.md
 *   {{skill:create-x}}        → the `create-x` skill
 *   {{repo:figma-plugin/x}}   → ../../../figma-plugin/x
 *
 * Sin normalizarlas, las 13 skills aparecen como modificadas y el informe
 * no sirve para nada. Fue justo lo que pasó en el primer intento.
 */
const normalizar = (texto) =>
  texto
    .replace(/\{\{ref:([^}]+)\}\}/g, "«REF:$1»")
    .replace(/(?:\.\.\/)+references\/([^\s)`]+)/g, "«REF:$1»")
    .replace(/\{\{skill:([^}]+)\}\}/g, "«SKILL:$1»")
    .replace(/\{\{repo:([^}]+)\}\}/g, "«REPO:$1»")
    .replace(/(?:\.\.\/)+(figma-plugin\/[^\s)`]+)/g, "«REPO:$1»")
    .replace(/the `([a-z-]+)` skill/g, "«SKILL:$1»")
    .replace(/\r\n/g, "\n")
    .trim()

const archivosDe = (raiz) => {
  const salida = []
  const andar = (d) => {
    if (!existsSync(d)) return
    for (const e of readdirSync(d)) {
      const p = join(d, e)
      statSync(p).isDirectory() ? andar(p) : salida.push(p)
    }
  }
  andar(raiz)
  return salida
}

// ── Versión local ──────────────────────────────────────────
const versionLocal = existsSync(CONFIG)
  ? JSON.parse(readFileSync(CONFIG, "utf-8")).cliVersion
  : "(desconocida)"

const objetivo = process.argv[2] ?? "latest"
console.log(`instalada: ${versionLocal}   ·   comparando contra: ${objetivo}\n`)

// ── Descargar la versión a comparar ────────────────────────
const tmp = mkdtempSync(join(tmpdir(), "uspec-"))
try {
  execSync(`npm pack uspec-skills@${objetivo} --silent`, { cwd: tmp, stdio: "pipe" })
  const tgz = readdirSync(tmp).find((f) => f.endsWith(".tgz"))
  execSync(`tar xzf "${tgz}"`, { cwd: tmp, stdio: "pipe" })
  const versionNueva = tgz.replace(/^uspec-skills-|\.tgz$/g, "")

  const UP = join(tmp, "package", "templates")
  const pares = [
    [resolve(AQUI, ".claude/skills"), join(UP, "skills"), "skills"],
    [resolve(AQUI, "references"), join(UP, "references"), "references"],
  ]

  const nuestros = []   // los tocamos nosotros → se perderían
  const suyos = []      // los cambió uSpec → hay que revisarlos
  const nuevos = []     // aparecen en la versión nueva
  const retirados = []  // ya no están arriba

  for (const [local, upstream, etq] of pares) {
    const localFiles = archivosDe(local)
    const upFiles = archivosDe(upstream)

    for (const f of localFiles) {
      const rel = relative(local, f)
      const up = join(upstream, rel)
      if (!existsSync(up)) { retirados.push(`${etq}/${rel}`); continue }
      const a = normalizar(readFileSync(f, "utf-8"))
      const b = normalizar(readFileSync(up, "utf-8"))
      if (a === b) continue
      // Si la versión es la misma que la instalada, la diferencia es NUESTRA.
      // Si es una versión distinta, no se puede distinguir sin un original.
      ;(versionNueva === versionLocal ? nuestros : suyos).push(`${etq}/${rel}`)
    }
    for (const f of upFiles) {
      const rel = relative(upstream, f)
      if (!existsSync(join(local, rel))) nuevos.push(`${etq}/${rel}`)
    }
  }

  const bloque = (titulo, lista, nota) => {
    if (!lista.length) return
    console.log(`${titulo} (${lista.length})`)
    for (const x of lista) console.log(`   · ${x}`)
    if (nota) console.log(`   ${nota}`)
    console.log()
  }

  if (versionNueva === versionLocal) {
    console.log(`Misma versión (${versionNueva}). Toda diferencia es una modificación local.\n`)
    bloque("🔴 MODIFICADOS POR NOSOTROS", nuestros,
      "Se perderían al reinstalar. Hay que reaplicarlos o convertirlos en extensión aparte.")
    if (!nuestros.length) console.log("✅ Ninguna modificación local. Actualizar es seguro.\n")
  } else {
    console.log(`Versión nueva disponible: ${versionLocal} → ${versionNueva}\n`)
    bloque("⚠️  CAMBIARON RESPECTO A LO INSTALADO", suyos,
      "Puede ser cambio de uSpec, modificación nuestra, o ambas. Revisar uno a uno.")
    bloque("➕ NUEVOS en la versión nueva", nuevos)
    bloque("➖ RETIRADOS arriba", retirados,
      "Si dependemos de alguno, la actualización lo rompe.")
    if (!suyos.length && !nuevos.length && !retirados.length)
      console.log("✅ Sin diferencias de contenido.\n")
  }

  console.log("Recuerda: `uspecs.config.json`, el conversor y todo lo de")
  console.log("`experimento-canario/` son nuestros y NO los toca ninguna actualización.")
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
