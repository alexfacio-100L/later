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

**Todas se llaman `#preview`** desde el 21 ago 2026. *Antes había cuatro nombres distintos para lo mismo:*

| Plantilla | Se llamaba | Ahora |
| --- | --- | --- |
| Anatomy · Properties · Color | `#preview` | *(sin cambio)* |
| **Structure** | `#Preview` | `#preview` |
| **API** | `Preview` | `#preview` |
| **Screen reader** | `Preview placeholder` | `#preview` |

*`.Motion` no tiene contenedor de preview: produce una línea de tiempo, no una muestra.*

🔴 **Aun así, las skills NO buscan por cadena exacta.** *Las seis usan un matcher por forma:*

```js
const esPreview = n => /^#?\s*preview(\s+placeholder)?$/i.test(n.name);
```

**Por dos razones:** los frames renderizados **antes** del renombrado conservan el nombre viejo y deben seguir funcionando; y una plantilla que vuelva de una actualización de uSpec con el nombre de fábrica tampoco romperá nada. *El matcher deja fuera `#preview-instruction-light` y `Light theme preview placeholder`, que son placeholders internos, no el contenedor.*

**Y hay previews vacíos.** En `Anatomy` hay dos: uno de 290 px **sin hijos** —la plantilla sin rellenar— y otro de 473 px con el botón y sus anotaciones numeradas. **Solo sirve el segundo.**

> **La regla: descartar los que tengan cero hijos.** Un preview vacío exporta un rectángulo en blanco, y nada avisa de que está mal.

---

## Cuántos previews hay por sección

*Del juego light:*

⚠️ **La fila de API estuvo mal cinco días.** *Decía 0 porque se contaron buscando la cadena `#preview`, y las de API se llaman `Preview`. **La ausencia solo es evidencia si el método podía encontrar la presencia** — y aquí no podía.*

| Sección | Frame | Previews útiles |
| --- | --- | --- |
| **Anatomy** | `12290:10522` | 1 *(de 2; uno vacío)* |
| **Properties** | `12301:2020` | 6 |
| **Structure** | `12304:2187` | 5 *(como `#Preview`)* |
| **Color** | `12311:2189` | 5 |
| **Screen reader** | `12318:2192` | 4 *(como `Preview placeholder`; uno vacío)* |
| **API** | `12362:5630` | **4** — *se dieron por cero hasta el 21 ago 2026* |

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

---

## `#hierarchy-indicator`: la jerarquía entre propiedades

**En el frame `Button API` hay 14 capas `#hierarchy-indicator`**, cada una con una flecha, y **solo dos están visibles**:

```
✅ visible:  iconLeft · iconRight
❌ oculto:   variant · surface · size · label · isDisabled · isLoading
             showIconLeft · showIconRight
```

**Marca dependencia:** `iconLeft` solo aplica cuando `showIconLeft` es `true`. *Es un recurso de la plantilla de uSpec para dibujar el anidamiento en la tabla.*

### Cómo se lleva a Supernova

**No hace falta leerlo de Figma: el `.md` ya conserva la dependencia**, en prosa dentro de la columna de notas:

```
| `iconLeft` | … | Solo tiene sentido cuando `showIconLeft` = `true`. …
```

**El conversor detecta ese patrón y prefija la fila con `↳`** — la misma convención que el archivo de Figma usa para las páginas anidadas. *Una tabla de Supernova no tiene indentación nativa, así que el prefijo es la forma más limpia de expresarlo.*

```
  `showIconLeft`
↳ `iconLeft`
  `showIconRight`
↳ `iconRight`
```
