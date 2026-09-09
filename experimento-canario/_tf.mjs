import sdkPkg from "@supernovaio/sdk"
import { apiKey } from "./entorno.mjs"
const { Supernova } = sdkPkg
const sdk = new Supernova(apiKey)
const me = await sdk.me.me(); const ws = await sdk.workspaces.workspaces(me.id)
const ds = (await sdk.designSystems.designSystems(ws[0].id)).find(d=>/later/i.test(d.name))
const v = await sdk.versions.getActiveVersion(ds.id)
const from = { designSystemId: ds.id, versionId: v.id }
const comps = await sdk.components.getComponents({...from, workspaceId: ws[0].id})
const tf = comps.find(c => /text field/i.test(c.name))
const vals = await sdk.components.getComponentPropertyValues(from)
const suyo = vals.filter(x => x.targetElementId === tf.id || x.componentId === tf.id)
console.log(`Text field (${tf.id}) — ${suyo.length} valor(es):`)
for (const x of suyo) console.log(`   valueId=${x.id ?? x.valueId}  prop=${x.definitionId ?? x.propertyId}  valor=${x.value}`)
