# Extracción del Button — dónde quedó

**3 sep 2026, 17:06 CST.** *El Lead corrió el plugin uSpec Extract con el `optionalContext` reescrito ese mismo día. `extractedAt: 2026-09-03T23:06:26Z`, 60 variantes, nodo `3566:3197`.*

## 🔴 Lo primero, antes de interpretar nada

```
npm run uspec:origen        # sale con código 1 si la caché no es esta extracción
```

**Hoy sale en rojo, y es correcto que salga:** `.uspec-cache/button/` guarda la extracción del **27 de agosto**. *Las skills `extract-*` leen la caché, no esta carpeta.* **Interpretar sin re-stagear produciría un `.md` bien formado, completo y describiendo el componente de hace una semana.**

## Qué mide esta extracción, y qué no

| | |
| --- | --- |
| ✅ **Escala dimensional** | **60 de 60** bindeadas: `size/control/*` en `minHeight` y `minWidth`, `space/l\|xl\|2xl` en `paddingInline`, `space/s` constante en `paddingBlock` |
| ✅ **Grosor de borde** | Medido y crudo: **1** en 48 · **1.5** en 8 · **2** en 4. Coincide con lo documentado en el contexto |
| 🔴 **Radio** | **`token: null` en las 60**, igual que el 27 de agosto. **El extractor sigue siendo CIEGO al binding de las esquinas** |
| 🔴 **`isLoading`** | **No existe en Figma**, y es correcto que no exista. Los únicos booleanos medidos son `showIconLeft` y `showIconRight` |

## 🔴 El hallazgo de método, y vale para todo componente que venga

**El `optionalContext` NO cambia lo que la extracción MIDE.** *Viaja dentro del `_base.json`, en `_meta`, para que lo lean las skills de interpretación — y ahí acaba su influencia.*

**Se probó a propósito:** el contexto de hoy avisa explícitamente de que el radio está bindeado y de que el `token: null` es un falso negativo del extractor. **La extracción volvió a emitir `token: null` en las 60.** *No falló el aviso: el aviso nunca fue para el extractor.*

**Las dos consecuencias, que hay que tener presentes al interpretar:**

1. **Lo que Figma no expone** —`isLoading`— **y lo que el extractor no sabe leer** —el binding del radio— **no van a aparecer medidos nunca**, por mucho que se avisen. *Entran por la interpretación o no entran.*
2. **Por eso el aviso está donde tiene que estar.** *Sirve para que la interpretación no documente el radio como «sin tokenizar» ni lo degrade a `inferred`: **hay evidencia externa, medida en vivo el 3 de septiembre, 60 de 60**.* **Emítelo como medido, citando esa medición.**

## Estado de las pasadas

| | |
| --- | --- |
| `_base.json` | ✅ 3 sep 2026 |
| `api.json` · `api-dictionary.json` · `color.json` · `voice.json` | ⚠️ Del 20 ago — **de la extracción anterior** |
| `structure.json` | 🔴 Nunca se completó: el subagente murió por límite de sesión en su paso 2 |

**El `.md` vigente (`Componentes/button.md`) se generó desde la extracción del 27 de agosto**, más los cinco slots humanos escritos el 1 de septiembre. **Regenerarlo desde ésta es tarea aparte**, y exige re-stagear primero.

⚠️ **Lo que NO hay que rehacer al regenerar:** los cinco slots humanos (`## Behavior & interaction`, motion, responsive, supuestos de contenido, criterios propios) **no salen de Figma**. *Se escribieron a mano el 1 de septiembre y una regeneración limpia los borra.*

🟢 **Y lo que sí sobrevive solo:** los 23 previews son bloques `figma-frames` **emitidos por el generador**, no texto del `.md`. *Una regeneración no los pierde.*
