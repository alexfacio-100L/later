# Llevar frames de anotación de Figma a Supernova

**Probado de punta a punta el 19 ago 2026.** *No hace falta copiar y pegar a mano.*

## La cadena

```
Figma  →  download_assets (URL temporal)  →  curl a disco
       →  sdk.resources.uploadAssetResource()
       →  <SNImage src="…" />  en la página
```

**Se hace en dos pasos a propósito.** Si la imagen pasara por el contexto del agente en base64 sería caro **y se truncaría** — un PNG de 200 KB son ~28k tokens y no cabe entero. *Bajándola a disco, el agente nunca la lee: solo la mueve.*

## Cómo se hace

**1 · Obtener la URL de descarga** — `download_assets` con el `fileKey` y el `nodeId` del frame:

```
fileKey: UGwIBzERV4vB7mk0mejZ0y
nodeId:  12362:5484        ← Button Anatomy
defaultFormat: png · defaultScale: 2
```

**2 · Descargar.** La URL es efímera, así que se usa enseguida:

```bash
curl -sL -o frames/button-anatomy.png "<url temporal>"
```

**3 · Subir y registrar:**

```bash
node subir-frame.mjs frames/button-anatomy.png "Anatomy" "12362:5484" "Button Anatomy"
```

**4 · Publicar.** El conversor lee `frames-subidos.json` y coloca la imagen en su sección.

## Los frames disponibles del Button

🔴 **CORRECCIÓN:** los dos juegos **no son dos corridas de uSpec** — son **los dos modos**. Los `12290`–`12318` son **light** (los produce uSpec) y los `12362:*` son **dark** (duplicados a mano por el Lead). *Se distinguen con `frame.explicitVariableModes`.*

⚠️ **Y no se exporta el frame completo, sino su capa `#preview`** — nueve veces más ligero. **Ver `PREVIEWS-DE-FIGMA.md`, que es el procedimiento vigente.**

| Sección | Nodo | Tamaño |
| --- | --- | --- |
| **Anatomy** | `12362:5484` | 1720 × 1547 |
| **API** | `12362:5630` | 1720 × 4620 |
| **Properties** | `12362:6004` | 1720 × 3024 |
| **Structure** | `12362:6171` | 1720 × 6708 |
| **Color** | `12362:6853` | 1720 × 4956 |
| **Screen reader** | `12362:7428` | 2400 × 8545 |

⚠️ **No borres ninguno de los dos juegos: son light y dark.** *Lo que hay que elegir bien es cuál se sube, y con qué capa.*

## Qué se puede subir así

**Cualquier frame de Figma.** No solo anotaciones: los do/don't, las notas, los ejemplos de uso, los diagramas de flujo. **Si está en un frame, se puede llevar.**

## Las dos formas que Supernova acepta

```jsx
<SNImage alignment="Left" src="https://studio-assets.supernova.io/…" />   ✅
![Anatomía del botón](https://studio-assets.supernova.io/…)              ✅
```

**Lo que NO funciona:** `<SNImage assetId="…">`, `<SNImage url="…">`, ni el bloque `io.supernova.block.image` con `SNPropImage` en ninguna de sus formas. *Todos dan `UndeclaredValueKey` o `PropertyValueSchemaMismatch`.*

## El límite que hay que aceptar

> 🔴 **Es una imagen, no un bloque vivo.** Si el frame cambia en Figma, **hay que volver a exportarlo y subirlo.** No se actualiza solo.
>
> *La alternativa viva es `figma-frames`, que referencia el nodo en vez de una copia — pero exige que los frames estén importados como recursos del design source, lo que requiere un re-import con `documentationFrames` activo.*

**Mientras tanto, esta vía funciona hoy y no depende de nada.**
