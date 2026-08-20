# Extracción del Button — dónde quedó

**20 ago 2026.** *Interrumpida por límite de tokens. El cache es válido: no hay que rehacer nada de lo hecho.*

## Completado

| | |
| --- | --- |
| `_base.json` | ✅ Extraído 19:08, 60 variantes, ejes ya con `variant`/`surface` |
| `api.json` | ✅ 9 propiedades · eje `state` descompuesto · `ArrowRight` como referenciado |
| `api-dictionary.json` | ✅ El vocabulario que guía a los especialistas |
| `color.json` | ✅ Estrategia B · 8 secciones · 16 tokens · **Light y Dark** |
| `voice.json` | ✅ 1 punto de foco · 2 estados · VoiceOver/TalkBack/ARIA |

## 🔴 Falta

**`structure.json`** — el subagente murió por límite de sesión en su paso 2.

## Para retomar

**Relanzar solo la pasada de estructura**, con estos parámetros:

```
skill        .claude/skills/extract-structure/SKILL.md
slug         button
cachePath    .uspec-cache/button
dictionary   .uspec-cache/button/button-api-dictionary.json
evidence     .uspec-cache/button/button-evidence-structure.json
delta        false
```

*El `optionalContext` está dentro del `_base.json` staged, en `_meta.optionalContext`.*

**Después:** paso 8.5 (reconciliación), 9.5 (integridad) y render a `Componentes/button.md`.

## Y lo que ya sabemos que pasará al publicar

⚠️ **Los `#preview` subidos a Supernova son de la corrida anterior** — muestran `Type`, paddings viejos e iconos Heroicons. **El `.md` saldrá fresco con imágenes caducas.**

*Es previsible y está aceptado: se marca al publicar, y se decide después si conviene recortar las `create-*` antes de regenerarlos.*
