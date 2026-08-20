/** Genera el mapa nombre-de-token → id, para poblar los bloques vivos. */
import { apiKey } from "./entorno.mjs"
import sdkPkg from "@supernovaio/sdk"
import { writeFileSync } from "node:fs"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me()
const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v  = await sdk.versions.getActiveVersion(ds.id)
const tokens = await sdk.tokens.getTokens({ designSystemId: ds.id, versionId: v.id })

const mapa = {}
for (const t of tokens) {
  // El nombre completo se arma con el path del grupo + el nombre
  const ruta = [...(t.parentGroupId ? [] : []), t.name].join("/")
  const completo = t.origin?.name ?? t.name
  if (completo) mapa[completo] = t.id ?? t.persistentId
}
writeFileSync("./tokens.json", JSON.stringify(mapa, null, 1))
console.log(`${Object.keys(mapa).length} tokens mapeados`)
const prueba = ["background/brandMain","text/primaryInverse","border/focus","icon/disabled"]
for (const p of prueba) console.log(`  ${p.padEnd(24)} ${mapa[p] ?? "🔴 no encontrado"}`)
