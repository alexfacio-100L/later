# Mapeo · páginas de Figma ↔ componentes de Supernova

**Plan `enumerated-bouncing-glacier`.**
🟢 **Fase 1 (mapeo) y fase 2 (los 16 renombrados) EJECUTADAS el 7 oct 2026.** Registro en §4-bis.
⬜ **Fase 3 (crear las 31 páginas que faltan) NO empezada.** *No se ha creado ninguna página.*

**Medido el 7 oct 2026, en vivo.**
Fuente Figma: `GET /v1/files/UGwIBzERV4vB7mk0mejZ0y?depth=2` y `GET /v1/files/.../components`.
Fuente Supernova: `sn_get_documentation_page_list`.
⚠️ **No se usó `.cache-figma/`** — está caducada (lista `Typography`, `Brand Book`, `Cards (WIP)`, que ya no existen).

---

## Las cifras · `n de N`

**Las 7 preguntas de criterio las cerró el Lead el 7 oct 2026. Quedan 0 abiertas.**

| | |
| --- | --- |
| Páginas bajo `Components ↴` | **32 de 43** del archivo |
| **Con destino de componente** | **26 de 32** — 19 claras + 7 decididas por el Lead |
| **Sin correspondencia en Supernova** | **3 de 32** — vacías, se reutilizan |
| **Huérfanas con contenido, se quedan** | **3 de 32** |
| **→ Renombradas en fase 2** | 🟢 **16 de 16 ejecutadas** · las otras 16 conservan nombre |
| | |
| Componentes de Supernova | **57 en 7 categorías** |
| **Con página** | **26 de 57** |
| **Sin página — se crean en fase 3** | **31 de 57** |
| **En disputa** | **0 de 57** |

🟢 **Control de método:** 26 + 31 = 57 por un lado, 26 + 3 + 3 = 32 por el otro, y las 26 páginas con destino son exactamente los 26 componentes con página. **Las dos cuentas se cierran por separado y coinciden.**

🔴 **Y una corrección a la primera versión de este documento, que se entregó con un error.** Decía «19 con página · **32** sin página · **6** en disputa» y declaraba el control como verde porque **19 + 32 + 6 = 57**. *Los dos números estaban mal —eran **31** y **7**— y los errores se compensaban, así que la suma cuadraba igual.* **Un control que suma totales no ve un error que se cancela con otro: hay que cuadrar también por categoría**, que es como salió (`Mostrar datos` declaraba 8 a crear y son 7). *Es la forma «falso completo» de la regla 16, con la agravante de que el verificador la firmó.*

---

## 1 · Las 32 páginas, una por fila

🟢 **Los renombrados de estas tablas YA SE EJECUTARON** — registro y verificación en §4-bis.

**Columna «qué hay dentro»: los nombres de los nodos, no el de la página.** Es lo que decide el mapeo.

### 1.a · Correspondencia clara — **19 de 32**

| # | Página hoy | Fr. | Qué hay dentro | Supernova | Qué se hace |
| --- | --- | --- | --- | --- | --- |
| 1 | `↳ Avatar` | 1 | `Avatar` | Mostrar datos / **Avatar** | **Dejar** |
| 2 | `↳ Accordion` | 0 | — | Mostrar datos / **Accordion** | **Dejar** |
| 3 | `↳ Button` | 11 | `Button`, `Link`, `Chip`, `Button Menu`, `Button Card` + 6 previews | Acciones / **Button** | **Dejar** ⚠️ ver nota A |
| 4 | `↳ Cards` | 7 | `Card/ Deafult`, `Card Product List`, `Card Product Full`, `Card Post` | Superficies / **Card** | **Renombrar** → `Card` |
| 5 | `↳ Checkbox` | 2 | `Checkbox/Default`, `Checkbox con Label` | Entradas / **Check** | **Renombrar** → `Check` |
| 6 | `↳ Datepicker` | 2 | `_Date picker/Desktop`, `/Mobile` | Entradas / **Date picker** | **Renombrar** → `Date picker` |
| 7 | `↳ Divider` | 0 | — | Mostrar datos / **Divider** | **Dejar** |
| 8 | `↳ Input Field` | 14 | `inputText`, `inputNumber` + 12 etiquetas de estado | Entradas / Form fields / **Text field** | **Renombrar** → `Text field` |
| 9 | `↳ Select` | 29 | `Select`, `.Select/List`, `.Select/List/Option` + 26 etiquetas | Entradas / Form fields / **Select** | **Dejar** |
| 10 | `↳ Skeleton` | 0 | — | Mostrar datos / **Placeholder** | **Renombrar** → `Placeholder` |
| 11 | `↳ Radio Button` | 2 | `.Radio Button/Default`, `Radio button con Label` | Entradas / **Radio** | **Renombrar** → `Radio` |
| 12 | `↳ Toggle` | 2 | `Toggle`, `Toggle con Label` | Entradas / **Switch** | **Renombrar** → `Switch` |
| 13 | `↳ Table` | 34 | 34 nodos `Table / Column /…` y `Table / Individual /…` | Datos y tablas / **Table** | **Dejar** ⚠️ ver pregunta 4 |
| 14 | `↳ Tag` | 6 | `Tags`, `Tipo de Ladrillos`, `Tipo de Propiedades`, `Status de Producto`, `Comercial` | Mostrar datos / **Tag** | **Dejar** |
| 15 | `↳ Tabs` | 8 | `Tabs/Primary‖Secondary‖Tertiary`, `Control Segment`, `.Segments`, `.Button/…` | Navegación / **Tabs** | **Dejar** ⚠️ ver nota B |
| 16 | `↳ Tooltips` | 3 | `Tooltip`, `_BaseTooltip`, `_Notch` | Mostrar datos / **Tooltip** | **Renombrar** → `Tooltip` |
| 17 | `↳ Empty state` | 0 | — | Mostrar datos / **Empty state** | **Dejar** |
| 18 | `↳ File upload` | 0 | — | Entradas / **File upload** | **Dejar** |
| 19 | `↳ Steps` | 5 | `Step`, `.Step Indicator`, `progressBarLeft/Right`, `Content` | Mostrar datos / **Progress steps** | **Renombrar** → `Progress steps` |

**Renombrados: 9** (#4, 5, 6, 8, 10, 11, 12, 16, 19). **Nombre ya correcto: 10.**

> ⚠️ **Nota A — `Button` guarda cinco familias, no una.** Además de `Button` contiene `Link` (que en Supernova es componente propio de *Acciones*), `Chip`, `Button Menu` y `Button Card`. **No se reparte ahora** —el plan excluye mover frames—, pero significa que `Link` tendrá página vacía mientras su contenido vive aquí.
>
> ⚠️ **Nota B — `Tabs` mezcla dos categorías.** `Control Segment` y `.Segments` son **Segment control**, que en Supernova está en *Entradas y controles*, no en *Navegación*. Mismo caso que `Progress & Slides`, pero el plan no lo había detectado.

### 1.b · Pedían criterio — **7 de 32** · 🟢 **resueltas, 0 abiertas**

| # | Página hoy | Fr. | **Qué hay dentro, medido** | Candidatos en Supernova |
| --- | --- | --- | --- | --- |
**Resueltas por el Lead el 7 oct 2026.** Quedan 0 de 32 abiertas.

| # | Página hoy | Fr. | Qué hay dentro, medido | **Decisión** |
| --- | --- | --- | --- | --- |
| 20 | `↳ Alerts` | 7 | Set `Alerts` (`Type Alert = Success‖Warning‖Error‖Info‖Normal`, `Size = S‖M‖L`, `Propouse = Normal‖Highligt`) **y tres nodos sueltos llamados `Snackbar`** | 🟢 **Renombrar → `Snackbar`.** *Mandó el contenido* |
| 21 | `↳ Progress & Slides` | 2 | `Slider-point` **y** `progress bar` | 🟢 **Renombrar → `Progress bar`.** `Slider` nace vacía, **deuda declarada** |
| 22 | `↳ Notification` | 0 | vacía | 🟢 **Renombrar → `Toast`** |
| 23 | `↳ Navigation` | 17 | `Navbar`×2, `Top Bar`, `Sidebar Left/Right`, `.Title Bar`, `.Top Second Nav`, `History`, `Option`, `Title`, `.List options`, `.Arrows` | 🟢 **Renombrar → `Top navigation`** (principal). Las otras 7 de *Navegación* nacen vacías, **deuda declarada** |
| 24 | `↳ Dialog Box` | 1 | **`Button sheet`** (`Type = Text‖Options`, `Full Width`) | 🟢 **Renombrar → `Sheet`.** Ver §6, era pregunta de arquitectura |
| 25 | `↳ Banners` | 2 | `Descricpión de oportunidad`, `Comercial/Asesor` | 🟢 **Renombrar → `Banner`** |
| 26 | `↳ Data Visualization` | 1 | **solo `Gauge`** (`State = 0…10`, `Size = Small‖Medium‖Big`) | 🟢 **Renombrar → `Charts`**, que absorbe el `Gauge` |
| 15b | `↳ Tabs` *(nota B, ya contada en 1.a)* | 8 | `Tabs/*` **y** `Control Segment`, `.Segments` | 🟢 **Dejar `Tabs`.** `Segment control` nace vacía, **deuda declarada** |

### 🔸 La deuda declarada que deja la regla «nombrar por el principal»

**Cuatro páginas nacerán vacías con su contenido viviendo en otra página.** Hay que anotarlo **en la página vacía**, o se pierde:

| Página vacía | Su contenido vive hoy en | Nodos |
| --- | --- | --- |
| `Slider` | `Progress bar` *(ex `Progress & Slides`)* | `Slider-point` |
| `Segment control` | `Tabs` | `Control Segment`, `.Segments` |
| `Side navigation` · `Navigator header` · `Button navigation` · `Breadcrumbs` · `Page controls` · `Pagination` · `Tree view` | `Top navigation` *(ex `Navigation`)* | `Sidebar Left/Right`, `.Title Bar`, `.Top Second Nav`, `.Arrows`… |
| `Link` | `Button` | `Link` |

⚠️ **`Data table`** queda en el mismo caso respecto a `Table`, y **`Modal full screen`** respecto a nada — ver §6.

### 1.c · Sin correspondencia en Supernova — **3 de 32**

Las tres están **vacías**, así que son material de reutilización sin coste.

| # | Página | Fr. | Nota |
| --- | --- | --- | --- |
| 27 | `↳ Filter` | 0 | Supernova no tiene «Filter» |
| 28 | `↳ Biometrics` | 0 | No existe en Supernova |
| 29 | `↳ Login & SL` | 0 | No existe en Supernova — es un patrón, no un componente |

### 1.d · Huérfanas con contenido — **3 de 32** · se quedan (decisión ya tomada)

| # | Página | Fr. | |
| --- | --- | --- | --- |
| 30 | `↳ Thumbnails` | 6 | Portadas del archivo, no del producto |
| 31 | `↳ App Icon` | 2 | Dos rectángulos de imagen |
| 32 | `↳ Widgets` | 2 | `Financial Simple`, `Financial/Financial Investment` |

---

## 2 · Componentes de Supernova **sin página** — **31 de 57** · se crean

✅ con página · ⬜ **sin página, se crea**

| Categoría | Componentes | ✅ | Se crean |
| --- | --- | --- | --- |
| **Acciones** (6) | ✅Button · ⬜Button Dock · ⬜Button group · ⬜Link · ⬜Tile · ⬜Timed button | 1 | **5** |
| **Entradas y controles** (14) | ✅Check · ✅Date picker · ✅Text field · ✅Select · ⬜PIN Code · ✅File upload · ⬜Menu · ✅Radio · ⬜Segment control · ⬜Slider · ⬜Star rating · ⬜Stepper · ✅Switch · ⬜Time picker | 7 | **7** |
| **Mostrar datos** (17) | ⬜Badge · ✅Accordion · ✅Avatar · ✅Divider · ⬜Draggable list · ⬜Drawer · ✅Empty state · ⬜List item · ⬜Message card · ✅Placeholder · ⬜Popover · ✅Progress bar · ⬜Progress circle · ✅Progress steps · ⬜Section heading · ✅Tag · ✅Tooltip | 9 | **8** |
| **Estados y retroalimentación** (5) | ✅Banner · ⬜Dialog · ✅Snackbar · ⬜System banner · ✅Toast | 3 | **2** |
| **Superficies** (3) | ✅Card · ⬜Modal full screen · ✅Sheet | 2 | **1** |
| **Navegación** (9) | ⬜Button navigation · ⬜Breadcrumbs · ⬜Navigator header · ⬜Page controls · ⬜Pagination · ⬜Side navigation · ✅Tabs · ✅Top navigation · ⬜Tree view | 2 | **7** |
| **Datos y tablas** (3) | ✅Charts · ⬜Data table · ✅Table | 2 | **1** |
| | | **26** | **31** |

**Cada fila cuadra contra el total de su categoría** — 1+5=6, 7+7=14, 9+8=17, 3+2=5, 2+1=3, 2+7=9, 2+1=3 — y las columnas suman 26 y 31. *Este cuadre por categoría es el que faltaba en la primera versión.*

---

## 3 · Las decisiones del Lead · 7 oct 2026

| # | Pregunta | 🟢 Decisión | Porqué |
| --- | --- | --- | --- |
| **P1** | `Alerts` | **`Snackbar`** · y `Notification` → **`Toast`** | *Mandó el contenido:* la página ya tenía tres nodos `Snackbar` dentro |
| **P2** | `Progress & Slides` | **`Progress bar`** | **Nombrar por el principal, deuda declarada.** `Slider` nace vacía con su contenido anotado |
| **P3** | `Notification` | **`Toast`** | Resuelta con P1 |
| **P4** | `Navigation` y `Table` | **`Top navigation`** y **`Table`** | Misma regla que P2. Las otras 7 de *Navegación* y `Data table` nacen vacías |
| **P5** | `Dialog Box` | **`Sheet`** | 🔴 **No era pregunta de nombres sino de arquitectura.** Investigación completa en **§5** |
| **P6** | `Banners` | **`Banner`** | |
| **P7** | `Data Visualization` | **`Charts`** | `Charts` absorbe el `Gauge` |
| **P8** | `Tabs` *(hallazgo nuevo)* | **`Tabs`** | Misma regla que P2. `Segment control` nace vacía |

🎯 **La regla que el Lead fijó y vale para todo el archivo: _nombrar por el componente principal, y declarar la deuda en la página vacía._** *Es mecánica — no pide criterio para ejecutarse (E3 del FODA).*

---

## 4 · ¿Renombrar una página rompe la publicación?

🟢 **Contestada por medición el 7 oct 2026 — ya no es inferencia. Ver §4-bis.**
*Se conserva lo que se razonó antes de escribir, porque acertó y conviene saber que acertó.*

**Lo verificado, en lectura, antes de escribir:**

- **19 094 componentes publicados** en el archivo, repartidos en **24 páginas**.
- Cada componente publicado se identifica por **`key`** (estable a nivel de archivo) y **`node_id`**. **Ninguno de los dos depende del nombre de la página.**
- El índice de la librería guarda el nombre de la página **desnormalizado**, en `containing_frame.pageName` — hoy lee literalmente `"       ↳ Navigation"`.

**La inferencia, marcada como tal:** como el vínculo instancia↔componente resuelve por `key` y no por nombre de página, **un renombrado no debería romper instancias ni despublicar nada**. *Es inferencia, no medición.*

🔴 **Lo que NO es verificable sin escribir:** si `pageName` se actualiza solo con el renombrado o exige **republicar la librería**, y si Figma marca la librería como «con cambios» tras un renombrado. **Eso no se puede saber leyendo.**

### Recomendación de por dónde empezar la fase 2

**No por una página vacía.** Una página con 0 componentes publicados **no puede demostrar nada sobre la publicación** — daría un verde que no prueba nada (regla 16, falso negativo).

🎯 **Empezar por `↳ Tooltips` → `Tooltip`.** Es la **página publicada más pequeña del archivo: 4 componentes**. Renombrarla y releer `/v1/files/.../components` filtrando por esos 4 `key` responde la pregunta con el daño más chico posible.

⚠️ **Y corregir un supuesto del encargo:** el Lead señaló que *tres* de los renombrados llevan el icono `</>`. **Con las 16 páginas que se renombran ya decididas, son 13 de 16 las que publican componentes**:

| Página | Publ. | | Página | Publ. |
| --- | --- | --- | --- | --- |
| `Navigation` → `Top navigation` | **36** | | `Steps` → `Progress steps` | 10 |
| `Toggle` → `Switch` | 30 | | `Radio Button` → `Radio` | 10 |
| `Alerts` → `Snackbar` | 30 | | `Tooltips` → `Tooltip` | **4** |
| `Checkbox` → `Check` | 25 | | `Dialog Box` → `Sheet` | **4** |
| `Input Field` → `Text field` | 24 | | `Banners` → `Banner` | 3 |
| `Progress & Slides` → `Progress bar` | 16 | | `Datepicker` → `Date picker` | **0** |
| `Data Visualization` → `Charts` | 15 | | `Skeleton` → `Placeholder` | **0** |
| `Cards` → `Card` | 13 | | `Notification` → `Toast` | **0** |

**Las dos más pequeñas que sí publican empatan a 4**: `Tooltips` y `Dialog Box`. *Recomiendo `Tooltips`, porque su renombrado es trivial y mantiene la prueba técnica independiente de la decisión semántica de §5.*

⚠️ **El icono de las capturas no es censo fiable.** La lista del Lead incluye `Responsive` y `Shadows`, que tienen **0 componentes publicados**; y omite `Table`, `Navigation`, `Steps`, `Dialog Box`, `Banners`, `Widgets`, `Thumbnails` y `Data Visualization`, que **sí los tienen**. El archivo publica además **145 estilos**, y el endpoint `/styles` **no devuelve página**, así que no se puede atribuir. **Manda `/components`, no el icono.**

---

## 4-bis · 🟢 Fase 2 ejecutada · 7 oct 2026 · **16 de 16**

**Superficie usada: `use_figma`** (Figma Plugin API), no Scripter. *El plan recomendaba Scripter por precedente; `use_figma` funcionó y no necesitó pegado manual del Lead.* **Renombrar no requiere `setCurrentPageAsync`** —se resuelve con `getNodeByIdAsync(id).name = …`—, así que la trampa del reset de `currentPage` no aplicó y los 15 restantes cupieron en una sola llamada.

**El protocolo fue: sonda primero, lote después.**

| Paso | | Resultado |
| --- | --- | --- |
| **1 · Sonda** | `↳ Tooltips` → `↳ Tooltip`, sola. La página publicada más pequeña: **4 componentes** | 🟢 **4 de 4 siguen publicados** |
| **2 · Lote** | Las 15 restantes, con guarda de *todo-o-nada*: comprueba los 15 nombres **antes de tocar ninguno** y aborta entero si uno no cuadra | 🟢 **15 de 15** |

### Verificación, releída en vivo contra la línea base

| Qué se comprobó | `n de N` | |
| --- | --- | --- |
| Páginas con el nombre nuevo correcto | **16 de 16** | 🟢 |
| Cambios de nombre **no** previstos | **0** | 🟢 |
| Páginas que **conservan su conteo de frames** | **43 de 43** | 🟢 |
| Páginas totales — *no se creó ninguna* | **43 → 43** | 🟢 |
| Componentes publicados en el archivo | **19 094 → 19 094** | 🟢 |

🔴 **Verificado por el campo que cambia —el nombre— y no por los ids, que un renombrado no toca.** *Un renombrado que no entra produce un reporte de ids idéntico al de uno que sí: regla 16, falso contraste.* La comparación se hizo **con los dos lados sacados de la misma fuente**, `GET /v1/files/…?depth=2`, nada reconstruido a mano.

### 🔴 La respuesta a lo que no se sabía: **`pageName` NO se actualiza**

**Era la única pregunta que no se podía contestar sin escribir. Ya está contestada, y el resultado importa para la fase 3.**

| | |
| --- | --- |
| ¿Se despublica algo al renombrar? | 🟢 **No.** 19 094 → 19 094, y los 4 `key` de la sonda intactos |
| ¿Cambia `updated_at` de los componentes? | 🟢 **No.** Sin cambio |
| ¿Se actualiza `containing_frame.pageName` en el índice? | 🔴 **NO.** **13 de 13** páginas renombradas que publican **siguen devolviendo su nombre VIEJO** |

**Qué significa:** `GET /v1/files/…/components` **no sirve la estructura viva: sirve la última instantánea publicada de la librería.** Hoy devuelve `"       ↳ Tooltips"`, `"       ↳ Navigation"`, `"       ↳ Alerts"` — nombres que ya no existen en el archivo. *Presumiblemente se pondrá al día al republicar la librería, pero **eso no está medido** y no lo afirmo.*

⚠️ **Y la trampa que esto arma, que es exactamente la que esta semana ya costó cara:** quien verifique un renombrado leyendo `pageName` de `/components` **concluirá que no se hizo**. El árbol de `?depth=2` es la fuente viva; `/components` es un caché publicado. **No son intercambiables, aunque los dos vengan de la API de Figma y los dos parezcan «en vivo».**

🎯 **Consecuencia operativa para la fase 3:** el censo de §4 —«qué páginas publican»— se construyó con `pageName`, así que **a partir de hoy ese censo habla con los nombres viejos.** Para repetirlo hay que cruzar por **`containing_frame.pageId`**, que sí es estable.

### Lo que esta fase NO hizo, deliberadamente

- **No se creó ninguna página.** La fase 3 es aparte.
- **No se movió ni un frame.** `Button` sigue guardando `Link`, `Chip` y `Button Card`; `Tabs` sigue guardando `Control Segment`; `Top navigation` sigue guardando `.Arrows` y los demás átomos. **Es capa 2 y el Lead la cuestiona después.**
- **No se tocó `Foundation ↴`**, ni `BS-01`, ni la App.
- **No se renombró nada en Supernova.** *Queda anotado abajo.*

### 📌 Anotado, para otro encargo — **en Supernova, no en Figma**

🟢 **El Lead aprobó `Button navigation` → `Bottom navigation`.** *Base lo llama así y un bottom nav no es un button nav.* **No ejecutado aquí.** Mismo origen: `Navigator header` → `Navigation header` en Base — **ésa no está aprobada**, solo detectada.

---

## 5 · 🔴 P5 · El bottom sheet: `Sheet`, `Dialog` o `Modal full screen`

> El Lead: *«el `Button sheet` lo metí ahí porque no sé cómo tratarlo, ya que actualmente serían los sustitutos de modales».*

### 5.a · Cobertura de la investigación — **declarada, porque no es completa**

| Sistema | Qué conseguí | Cómo |
| --- | --- | --- |
| **Base (Uber)** | 🔸 **Fragmentos + dato duro** | La página **no renderiza**: 129 387 bytes de HTML y **18 caracteres de texto útil** («Base design system»). 🟢 Pero su HTML **lleva embebido el árbol completo de 191 páginas en JSON**, que sí es fuente primaria. La prosa viene de **búsqueda web — fuente secundaria** |
| **Carbon (IBM)** | 🟢 **Leído renderizado y completo** | 18 153 caracteres de texto |
| **Material 3** | ⬜ **No leído** | No renderiza: 67 caracteres útiles |
| **Apple HIG** | ⬜ **No leído** | No renderiza: 153 caracteres útiles |

🎯 **`1 de 4` leído renderizado · `1 de 4` por fragmentos con su árbol verificado · `2 de 4` no leídos.**

### 5.b · 🔴 El hallazgo que cambia la pregunta

**La taxonomía de Later ES la de Base.** No se parece: **es la misma**, categoría por categoría y componente por componente.

| Base (Uber) | Later / Supernova |
| --- | --- |
| `Action` → Button · Button dock · Button group · Link · Tile · Timed button | `Acciones` → **los mismos seis** |
| `Input & control` → Check · Date picker · **Form fields** (Select, PIN code, Text field) · File upload · Menu · Radio · Slider · Star rating · Stepper · Switch · Time picker · Segmented control | `Entradas y controles` → **los mismos**, con `Segment control` |
| `Data display` → Badge · Accordion · Avatar · Divider · Draggable list · Drawer · Empty state · List item · Message card · Placeholder · Popover · Progress bar · Progress circle · Progress steps · Section heading · Tag · Tooltip | `Mostrar datos` → **los 17, idénticos** |
| `Feedback & status` → Banner · **Dialog** · Snackbar · System banner · Toast | `Estados y retroalimentación` → **los cinco** |
| `Surfaces` → Card · **Modal full screen** · **Sheet** | `Superficies` → **los tres** |
| `Navigation` → Breadcrumbs · **Bottom navigation** · **Navigation header** · Page controls · Pagination · Side navigation · Tabs · Top navigation · Tree view | `Navegación` → los nueve, con **`Button navigation`** y **`Navigator header`** |
| `Data & tables` → Charts · Data table · Table | `Datos y tablas` → **los tres** |
| `Patterns` → Feedback · States · **Modality** · Inputting data · Selection | `Comportamientos` → Patrones · Retroalimentación · Estados · **Ventanas emergentes** · Insertando datos |
| `Content` → Global writing · Product tone · Product voice · Writing for components · Abbreviations · Acronyms · App permissions · Capitalization · Change log · Dates · Legal communication · Map annotations · Messages · Money · Numbers · Punctuation · Time · Emojis | `Cimientos/Lenguaje` y `Cimientos/Contenido` → **los mismos, traducidos** |

*Fuente: árbol de 191 páginas extraído del JSON embebido en `https://base.uber.com/6d2425e9f/p/775209-dialog`, 7 oct 2026.*

🎯 **Implicación operativa: la pregunta ya estaba contestada antes de hacerla.** `Sheet`, `Modal full screen` y `Dialog` están donde están en Supernova **porque están ahí en Base**. No hace falta inventar criterio: hace falta **leer el de Base**.

⚠️ **Y dos deslices de transcripción que conviene mirar aparte:**
- Base dice **`Bottom navigation`**; Later dice **`Button navigation`**. *Un bottom nav no es un button nav.* **Probable errata al copiar.**
- Base dice **`Navigation header`**; Later dice **`Navigator header`**.

*No los corrijo aquí — Supernova es la fuente de verdad de los nombres y cambiarlos es otra decisión.*

### 5.c · Las tres respuestas

**1 · ¿Un bottom sheet es un `Sheet` o un `Dialog`? → `Sheet`.**

**Lo que los distingue NO es el origen de la animación ni el tamaño: es la relación con lo que hay detrás.**

| | Base lo define como |
| --- | --- |
| **`Dialog`** | *«enfocar la atención del usuario en una alerta o una elección relacionada con la tarea principal»*. Una pregunta corta, de un paso, 2–3 opciones |
| **`Sheet`** | *«dar al usuario una forma de ver o modificar detalles relacionados con la superficie que tiene detrás»*. **Dos superficies atendidas a la vez** |

🔴 **Y la modalidad es ortogonal, no es el criterio.** Base documenta sheets **modales y no modales**: el modal oscurece el fondo con overlay y exige una acción de cierre; el no modal no bloquea y sirve cuando hay que consultar el fondo. **Que algo tenga overlay no lo convierte en `Dialog`.** Por eso Base tiene una página `Modality` en `Patterns` — y **Later ya tiene su casilla: `Comportamientos/Ventanas emergentes`.**

*Carbon lo refuerza desde el otro lado:* **«Modals are a type of dialog because it is a conversation between the user and the system»** — el *modal* es un comportamiento del diálogo, no una pieza distinta.

**2 · ¿Qué pasa con `Modal full screen` si el sheet lo sustituye? → Sigue teniendo razón de existir. No son sustitutos.**

Base escalona las tres por **volumen de contenido y número de pasos**, no por apariencia:

| Cuando la tarea es… | Base manda a |
| --- | --- |
| Una elección corta, 2–3 opciones, **un paso** | **`Dialog`** |
| Hay que **referenciar el fondo**, o el contenido crece, scrollea, se expande/colapsa o navega por pasos desde su header | **`Sheet`** |
| Es una tarea **autocontenida que toma la pantalla entera** y devuelve al contexto anterior al terminar; uno o varios pasos | **`Modal full screen`** |

Base además registra una diferencia de plataforma: presenta **estilo *stacked sheet* e *immersive***, y anota que **iOS soporta ambos y Android solo el immersive**.

🎯 **La intuición del Lead es cierta a medias, y vale la pena precisarla:** en móvil el bottom sheet **sí sustituye al diálogo-modal**, porque el pulgar llega al borde inferior y el diálogo centrado no. **Lo que no sustituye es `Modal full screen`**, que no es «un modal grande» sino **una tarea que se apodera de la pantalla y vuelve**. Son ejes distintos: `Sheet` ↔ `Dialog` compiten por *la elección corta*; `Modal full screen` juega en *la tarea larga*.

**3 · ¿Qué nombre toma `Dialog Box`? → `Sheet`.**

Su único contenido es `Button sheet` (`Type = Text‖Options`, `Full Width`), que por la definición de Base es un **sheet modal**: superficie anclada al borde con lista de opciones. **`Dialog` nace como página vacía.**

### 5.d · 🔴 El desacuerdo entre sistemas, que no disimulo

**Carbon no tiene `Sheet`.** Su catálogo de componentes va de `Modal` a `Popover`/`Tooltip`/`Toggletip`, sin ninguna superficie anclada al borde, y resuelve todo con variantes de `Modal` —*Passive, Transactional, Danger, Acknowledgment, Progress*— más un patrón `Dialogs`.

| | Base / Later | Carbon |
| --- | --- | --- |
| **Eje que organiza** | **La superficie**: ¿se relaciona con el fondo? | **La transacción**: ¿qué se le pide al usuario? |
| **`Sheet`** | Componente propio, en `Surfaces` | **No existe** |
| **Modalidad** | Propiedad transversal (`Patterns/Modality`) | Horneada en el componente |

**Por qué difieren, y no es que uno se equivoque:** **Carbon es enterprise de escritorio** y **Base es móvil primero**. El bottom sheet es una respuesta al pulgar; sin móvil, no hace falta.

🎯 **Later es móvil primero, como Base.** El desacuerdo **no cambia la recomendación**, pero sí explica por qué copiar a Carbon aquí sería un error.

**Sources:** [Base · Dialog](https://base.uber.com/6d2425e9f/p/775209-dialog) · [Base · Sheet](https://base.uber.com/6d2425e9f/p/033e0d-sheet) · [Base · Modal full screen](https://base.uber.com/6d2425e9f/p/81b842-modal-full-screen/b/46994b) · [Carbon · Modal](https://carbondesignsystem.com/components/modal/usage/)

---

## 6 · Lo que queda fuera de esta fase

- **Escribir en Figma.** Ni un renombrado.
- **Mover frames.** `Navigation`, `Table` y `Select` conservan su contenido.
- **`Foundation ↴`** y sus cinco páginas · **`BS-01`** · la App.
- **`lint-figma.mjs`** lleva los ids en `LOTES` fijos (`lint-figma.mjs:30-35`). **Si la fase 3 crea páginas, deja de verlas sin avisar.** Hay que actualizarlo antes de dar por buena cualquier medición posterior.
