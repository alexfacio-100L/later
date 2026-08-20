/**
 * La bandera de destino de la documentación.
 *
 * Decide **qué se hace con el `.md` una vez generado**. No cambia cómo se
 * genera: los dos caminos comparten plugin Extract → `_base.json` → `.md`.
 * La bifurcación es solo el último paso.
 *
 *   supernova  (por defecto)  conversor → SDK → páginas con bloques vivos
 *   figma      (contingencia) skills create-* → frames de anotación en Figma
 */

import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")

const DESTINOS = {
  supernova: {
    nombre: "Supernova",
    estado: "vigente",
    como: "El conversor traduce el .md a MDX-lite y lo publica con el SDK.",
    coste: "Bajo — no renderiza nada en Figma.",
    requiere: ["SUPERNOVA_API_KEY en el .env", "rol Editor u Owner en el workspace"],
    skills: ["create-component-md", "extract-api", "extract-structure", "extract-color", "extract-voice"],
  },
  figma: {
    nombre: "Figma",
    estado: "contingencia",
    como: "Las skills create-* dibujan los frames de anotación dentro de Figma.",
    coste: "🔴 ALTO — ~100k tokens por skill y por corrida. Son siete skills.",
    requiere: ["acceso de edición al archivo de Figma", "las plantillas publicadas de uSpec"],
    skills: ["create-anatomy", "create-api", "create-color", "create-motion",
             "create-property", "create-structure", "create-voice"],
  },
}

function leerBandera() {
  if (process.env.DESTINO_DOCUMENTACION) return process.env.DESTINO_DOCUMENTACION.trim().toLowerCase()
  const env = resolve(RAIZ, ".env")
  if (!existsSync(env)) return "supernova"
  const m = readFileSync(env, "utf-8").match(/^\s*DESTINO_DOCUMENTACION\s*=\s*(.+)$/m)
  return m ? m[1].trim().toLowerCase().replace(/^["']|["']$/g, "") : "supernova"
}

const clave = leerBandera()

if (!DESTINOS[clave]) {
  console.error(`
DESTINO_DOCUMENTACION="${clave}" no es válido.

  Valores admitidos: ${Object.keys(DESTINOS).join(" · ")}
  Se configura en el .env de la raíz del proyecto.
`)
  process.exit(1)
}

export const destino = { clave, ...DESTINOS[clave] }
export const esSupernova = clave === "supernova"
export const esFigma = clave === "figma"

/**
 * Detiene el script si el destino configurado no es el que espera.
 * Evita el accidente caro: correr el camino de Figma sin querer.
 */
export function exigirDestino(esperado) {
  if (clave === esperado) return
  console.error(`
Este script publica en ${DESTINOS[esperado].nombre}, pero el destino configurado es ${destino.nombre}.

  ${destino.estado === "contingencia" ? "⚠️  " : ""}DESTINO_DOCUMENTACION=${clave}

Cámbialo en el .env de la raíz, o corre el flujo de ${destino.nombre}.
`)
  process.exit(1)
}

/** Aviso visible cuando se trabaja en el camino caro. */
export function avisarSiCostoso() {
  if (clave !== "figma") return
  console.warn(`
┌─────────────────────────────────────────────────────────────┐
│  DESTINO: FIGMA — camino de contingencia                    │
│                                                             │
│  ${DESTINOS.figma.coste.padEnd(57)}│
│  Solo debería usarse si Supernova no está disponible.       │
│                                                             │
│  El camino vigente es supernova. Se cambia en el .env.       │
└─────────────────────────────────────────────────────────────┘
`)
}
