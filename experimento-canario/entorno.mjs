/**
 * Carga la API key desde el `.env` de la raíz del proyecto.
 * Sin dependencias: `process.loadEnvFile` viene en Node 21+.
 *
 * Prioridad: variable de entorno ya definida > .env del proyecto.
 * Así funciona igual en local que en un pipeline de CI.
 */
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync } from "node:fs"

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const ENV = resolve(RAIZ, ".env")

if (!process.env.SUPERNOVA_API_KEY && existsSync(ENV)) {
  process.loadEnvFile(ENV)
}

export const apiKey = process.env.SUPERNOVA_API_KEY

if (!apiKey) {
  console.error(`
Falta SUPERNOVA_API_KEY.

  1. Copia .env.example como .env en la raíz del proyecto
  2. Genera la key en cloud.supernova.io → perfil → Profile settings → Authentication
  3. Pégala en SUPERNOVA_API_KEY=

El .env está en .gitignore: no se sube al repositorio.
`)
  process.exit(1)
}
