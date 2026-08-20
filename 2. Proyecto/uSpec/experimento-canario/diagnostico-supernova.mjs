#!/usr/bin/env node
/**
 * ¿Se puede publicar en Supernova ahora mismo?
 *
 * Distingue tres situaciones que se parecen desde fuera y exigen respuestas
 * distintas:
 *
 *   1. Todo bien                → publicar normalmente
 *   2. Supernova está caído     → esperar, o cambiar a DESTINO=figma
 *   3. TU ruta está rota        → esperar no sirve: VPN o avisar al ISP
 *
 * La tercera es la que engaña. El 20 ago 2026 se perdió tiempo reiniciando el
 * equipo por un fallo de ruta hacia AWS Irlanda que no era ni del equipo ni de
 * Supernova: su web respondía perfectamente mientras la API era inalcanzable.
 *
 * La prueba que las separa: `cloud.supernova.io` se sirve por CDN con presencia
 * local y `api.supernova.io` apunta directo a Irlanda. **Si cloud responde y api
 * no, el problema es de ruta, no de Supernova.**
 */

const TIEMPO = 10_000

const probar = async (url) => {
  const inicio = Date.now()
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), TIEMPO)
    const r = await fetch(url, { signal: ctrl.signal, redirect: "manual" })
    clearTimeout(t)
    return { ok: true, codigo: r.status, ms: Date.now() - inicio }
  } catch {
    return { ok: false, codigo: 0, ms: Date.now() - inicio }
  }
}

const [api, cloud, status] = await Promise.all([
  probar("https://api.supernova.io/"),
  probar("https://cloud.supernova.io/"),
  probar("https://status.supernova.io/"),
])

const linea = (etq, r) =>
  console.log(`  ${r.ok ? "✅" : "🔴"} ${etq.padEnd(26)} ${r.ok ? `HTTP ${r.codigo}` : "sin respuesta"}  (${r.ms} ms)`)

console.log("Comprobando Supernova…\n")
linea("api.supernova.io", api)
linea("cloud.supernova.io", cloud)
linea("status.supernova.io", status)
console.log()

// ── Diagnóstico ────────────────────────────────────────────
if (api.ok) {
  console.log("✅ LA API RESPONDE — se puede publicar.")
  console.log("   DESTINO_DOCUMENTACION=supernova\n")
  console.log("   npm run docs:validar      valida sin escribir")
  console.log("   npm run docs:publicar     publica")
  process.exit(0)
}

if (cloud.ok) {
  // La web responde por CDN local, la API no: el fallo está en la ruta.
  console.log("🔴 LA API NO RESPONDE, PERO SU WEB SÍ.")
  console.log()
  console.log("   Eso apunta a un problema de RUTA desde esta conexión, no a")
  console.log("   una caída de Supernova: `cloud` se sirve por CDN local y")
  console.log("   `api` apunta directo a AWS Irlanda (eu-west-1).")
  console.log()
  console.log("   Para confirmarlo, otro host de la misma región:")
  console.log("     curl -s -o /dev/null -w '%{http_code}\\n' --max-time 8 \\")
  console.log("       https://s3.eu-west-1.amazonaws.com")
  console.log()
  console.log("   Si también da 000, es la ruta. Entonces:")
  console.log("     · una VPN suele resolverlo de inmediato")
  console.log("     · si no, reportar al ISP el peering hacia AWS eu-west-1")
  console.log("     · ⚠️  esperar NO sirve, y reiniciar el equipo tampoco")
  console.log()
  console.log("   Mientras tanto se puede trabajar sin la API:")
  console.log("     npm run docs:validar   convierte el .md y deja salida.mdx listo")
} else {
  console.log("🔴 NI LA API NI LA WEB RESPONDEN.")
  console.log()
  console.log(status.ok
    ? "   Su página de estado sí responde: consulta https://status.supernova.io"
    : "   Su página de estado tampoco responde — puede ser esta conexión.")
  console.log()
  console.log("   Si Supernova está caído de verdad y hay que entregar igualmente,")
  console.log("   existe el camino de contingencia — pero mide el coste antes:")
  console.log("     DESTINO_DOCUMENTACION=figma   en el .env")
  console.log("   🔴 ~100k tokens por skill, y son siete. Ver DESTINO-DE-LA-DOCUMENTACION.md")
}

console.log()
console.log("   Estado en vivo: https://status.supernova.io")
process.exit(1)
