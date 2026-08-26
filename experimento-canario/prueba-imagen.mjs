import pkg from "@supernovaio/sdk"; const { Supernova } = pkg
import fs from "node:fs"
const key = fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/.env","utf8")
  .split("\n").find(l=>l.startsWith("SUPERNOVA_API_KEY=")).split("=").slice(1).join("=").trim()
const sn = new Supernova(key)
const v = await sn.versions.getActiveVersion("825551")
const ref = { designSystemId:"825551", versionId:v.id }
const F = JSON.parse(fs.readFileSync("/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario/frames-subidos.json","utf8"))
// Página `Especificaciones` del Button
const PAGE = "40847796"
const md = `# Prueba de imagen

Tres formas de referenciar la MISMA imagen. La que se vea, es la buena.

## 1 · resourceId del registro actual

<SNImage alignment="Left" resourceId="${F["Anatomy"].assetId}" />

## 2 · resourceId con caption

<SNImage alignment="Left" resourceId="${F["Anatomy"].assetId}" caption="con pie" />

## 3 · Markdown normal apuntando a la URL

![anatomía](${F["Anatomy"].url})
`
const r = await sn.import.validateMarkdown(ref, md)
if (!r?.isValid) { fs.writeFileSync(process.argv[2], "🔴 " + r?.error?.message); process.exit(1) }
const w = await sn.import.writeMarkdownToPage(ref, PAGE, md)
fs.writeFileSync(process.argv[2], `publicado · ${w?.blockCount ?? "?"} bloques\nassetId usado: ${F["Anatomy"].assetId}\nurl: ${F["Anatomy"].url}`)
