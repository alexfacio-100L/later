# Los `#preview`: qué exportar de Figma y por qué

**19 ago 2026.** *Corrige y precisa el procedimiento de `FRAMES-A-SUPERNOVA.md`.*

## El paradigma, en una frase

> **De Figma solo hace falta el `#preview`. Todo lo demás —tablas, títulos, notas— ya viaja en el `.md` y se convierte en bloques nativos.**

**Medido:** el frame `Button Anatomy` completo pesa **205 KB**. Su `#preview` pesa **23 KB**. **Nueve veces menos**, y es lo único que aporta algo que el texto no puede dar.

---

## 🔴 Light y dark: cómo distinguirlos sin adivinar

**Los frames aparecen duplicados, y no son dos versiones del mismo trabajo.**

| | Modo | Origen |
| --- | --- | --- |
| `12290`, `12292`, `12301`, `12304`, `12311`, `12318` | **Light** | **Los produce uSpec** |
| `12362:*` | **Dark** | **Duplicados a mano por el Lead**, cambiándoles la apariencia |

**La bandera que los distingue es programática:**

```js
frame.explicitVariableModes
//  {}                              → hereda → es LIGHT
//  { semanticColors: "Dark" }      → es DARK
```

*El primer intento subió el dark por no mirar esto.*

---

## Cómo se llaman las capas de preview

⚠️ **El nombre no es consistente. Hay que buscar los tres:**

| Sección | Nombre de la capa |
| --- | --- |
| Anatomy · Properties · Color | `#preview` |
| **Structure** | `#Preview` — **con P mayúscula** |
| **Screen reader** | `Preview placeholder` |

**Y hay previews vacíos.** En `Anatomy` hay dos: uno de 290 px **sin hijos** —la plantilla sin rellenar— y otro de 473 px con el botón y sus anotaciones numeradas. **Solo sirve el segundo.**

> **La regla: descartar los que tengan cero hijos.** Un preview vacío exporta un rectángulo en blanco, y nada avisa de que está mal.

---

## Cuántos previews hay por sección

*Del juego light:*

| Sección | Frame | Previews útiles |
| --- | --- | --- |
| **Anatomy** | `12290:10522` | 1 *(de 2; uno vacío)* |
| **Properties** | `12301:2020` | 6 |
| **Structure** | `12304:2187` | 5 *(como `#Preview`)* |
| **Color** | `12311:2189` | 5 |
| **Screen reader** | `12318:2192` | 4 *(como `Preview placeholder`; uno vacío)* |
| **API** | `12292:10564` | **0** — no tiene previews |

---

## La tabla de anotaciones, y la columna `Type`

**Estructura de `#annotation-table`:**

```
header row → #header-number · #header-element-type · #header-element-name · #header-notes
row        → #number · #indicator · #element-name · #notes
```

**La columna `Type` no lleva iconos sueltos: lleva `#indicator`**, un frame con cuatro variantes de las que solo una queda visible por fila:

```
#instance   #text   #slot   #frame
```

> **Son indicadores del tipo de elemento anotado.** Se pueden extraer leyendo cuál está visible en cada fila, y reflejarlos en la tabla de Supernova como texto o como icono. *Pendiente de implementar.*

---

## El procedimiento

**1 · Localizar el preview correcto** — light, no vacío, en la sección que toca.

**2 · Exportar** con `download_assets`, usando el `nodeId` del **preview**, no el del frame:

```
fileKey: UGwIBzERV4vB7mk0mejZ0y
nodeId:  12290:10571        ← el #preview, no el frame 12290:10522
defaultFormat: png · defaultScale: 2
```

**3 · Descargar y subir:**

```bash
curl -sL -o frames/anatomy-light-preview.png "<url temporal>"
node subir-frame.mjs frames/anatomy-light-preview.png "Anatomy" "12290:10571" "Button Anatomy · #preview (light)"
```

**4 · Publicar.** El conversor lee `frames-subidos.json` y coloca cada imagen en su sección.

---

## Lo que esto permite a futuro

**Publicar las dos apariencias.** Como el light y el dark son frames distintos y distinguibles, se pueden subir ambos y mostrarlos juntos en la documentación — *que es exactamente lo que faltaba para cerrar la tarea del modo oscuro.*
