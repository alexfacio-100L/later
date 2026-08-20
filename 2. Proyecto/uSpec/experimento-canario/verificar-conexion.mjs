/** Comprueba que la API key del .env funciona. Nunca imprime la key. */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
const { Supernova } = sdkPkg

console.log(`key detectada: ${apiKey.slice(0,3)}…${apiKey.slice(-4)}  (${apiKey.length} caracteres)`)
const sdk = new Supernova(apiKey)
try {
  const me = await sdk.me.me()
  const ws = await sdk.workspaces.workspaces(me.id)
  const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
  const v  = await sdk.versions.getActiveVersion(ds.id)
  console.log(`✅ CONECTA — ${me.name} · ${ds.name} · versión draft ${v.id}`)

  // Probar que además ESCRIBE, no solo lee: validar no modifica nada
  const val = await sdk.import.validateMarkdown(
    { designSystemId: ds.id, versionId: v.id }, "# Prueba de permisos\n")
  console.log(val.isValid ? "✅ PERMISOS DE ESCRITURA correctos" : "🔴 sin escritura")
} catch(e) {
  console.log(`🔴 FALLA — ${String(e.message).slice(0,120)}`)
  console.log("   Revisa que en .env la línea sea  SUPERNOVA_API_KEY=sn.xxxx  sin comillas ni espacios.")
}
