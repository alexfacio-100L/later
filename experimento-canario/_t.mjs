import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me(); const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id, workspaceId: ws[0].id }
const st = await sdk.documentation.getDocumentationStructure(from)
const g = st.find(e=>/Component Documentation Template/i.test(e.title||""))
console.log(`grupo: «${g.title}»  id=${g.id}\n`)
for (const cid of g.childrenIds) {
  const p = st.find(x=>x.persistentId===cid||x.id===cid); if(!p) continue
  const raw = await sdk.documentation.getDocumentationContentRaw(from, p.id)
  const s = JSON.stringify(raw)
  const marcadores = [...new Set(s.match(/\[[A-Za-z ]{3,20}\]/g)||[])].slice(0,6)
  console.log(`  ${p.title.padEnd(22)} ${String(s.length).padStart(7)} chars  actualizada ${new Date(p.updatedAt).toLocaleDateString("es-MX")}`)
  if (marcadores.length) console.log(`      marcadores: ${marcadores.join(" ")}`)
}
