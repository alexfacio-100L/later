# uSpec → Supernova: qué sobra, qué falta y cuánto ahorra

**Investigación del 19 ago 2026**, a petición del Lead: si la documentación deja de vivir como frames visuales en Figma y pasa a Supernova, ¿qué hay que cambiar en uSpec?

**La respuesta corta: casi nada hay que construir. Hay que dejar de usar la mitad cara.**

---

## 1 · Cómo está montado uSpec hoy

**Ya vive local en el proyecto** —`2. Proyecto/uSpec/`— con sus 13 skills, sus plantillas y su config. *La preocupación del Lead de que estuviera solo global no aplica: el contenido es local.*

🔴 **Pero hay un riesgo real y es otro: no existe `package.json` en el proyecto.** El CLI se invoca con `npx uspec-skills`, que **resuelve la última versión publicada cada vez**. Hoy `uspecs.config.json` declara `cliVersion: 0.3.2` y npm sirve 0.3.2 — coinciden por casualidad, no por garantía. **Cuando uSpec publique 0.4.0, el proyecto la usará sin avisar.**

> **Recomendación:** crear un `package.json` en la raíz del proyecto con `uspec-skills` fijado como `devDependency` en `0.3.2`. *Es la misma lógica de por qué el proyecto lleva git: el trabajo con agentes cambia rápido y sin historial ni versiones fijas no hay forma de saber qué cambió.*

---

## 2 · Las 13 skills son dos familias, y una de ellas sobra

| Familia | Qué hace | Si documentamos en Supernova |
| --- | --- | --- |
| **`extract-*`** (4) `api` · `color` · `structure` · `voice` | **Interpretan** un `_base.json`. No llaman a Figma | ✅ **Se quedan. Son el corazón** |
| **`create-*` de render** (7) `anatomy` · `api` · `color` · `motion` · `property` · `structure` · `voice` | **Pintan frames dentro de Figma** con plantillas publicadas | 🔴 **Sobran por completo** |
| **`create-component-md`** (1) | **Orquesta las cuatro `extract-*` y escribe un `.md`** | ✅ **Es el puente** |

### El costo, citado del propio código de uSpec

> *"The four `create-*` skills each cost ~100k tokens per run because the majority of their weight is Figma rendering (`setProperties`, `createInstance`, `loadFontAsync`, layout math). The `extract-*` skills strip all rendering."*

**Ahí está medida la intuición del Lead sobre el gasto de tokens.** El costo no está en interpretar el componente: **está en dibujarlo en Figma.** Y si la documentación vive en Supernova, ese dibujo no se usa.

**Las siete `create-*` de render suman 445 KB de instrucciones** —`create-property` sola pesa 116 KB—. **Dejar de invocarlas es el ahorro grande, y no cuesta desarrollo: es dejar de llamarlas.**

⚠️ **`create-component-md` ya lo dice explícitamente:** *"Do not call the `create-*` skills from here. They render Figma frames that overlap and do not compose into a single file."* **El camino correcto ya estaba diseñado; solo no se estaba tomando.**

---

## 3 · La ruta completa, y lo único que falta

```
Figma  →  [plugin uSpec Extract]  →  _base.json
                                         ↓
                        create-component-md  ← corre las 4 extract-* sin tocar Figma
                                         ↓
                                   button.md
                                         ↓
                    sdk.import.validateMarkdown()      ← preflight
                    sdk.import.writeMarkdownToPage()   ← escribe en Supernova
                                         ↓
                    supernova publish-documentation    ← publica el sitio
```

**El `.md` ya existe:** `3. Entregables/Componentes/button.md`, **690 líneas y 53 KB**. Y es **Markdown limpio** — encabezados, tablas y separadores, sin MDX ni sintaxis exótica. *Buen pronóstico para pasar la validación de MDX-lite, aunque hay que comprobarlo con `validateMarkdown` antes de afirmarlo.*

🔴 **Lo único que falta de verdad: el plugin de Figma de uSpec que produce el `_base.json`.** No está en el proyecto —`find` no encuentra ni el plugin ni ningún `_base.json`— y **`create-component-md` aborta sin él.** *Es el primer bloqueo a resolver, y es de instalación, no de desarrollo.*

---

## 4 · Prueba de que la documentación actual está caducada

**El `button.md` usa `Type=Primary` en sus 24 encabezados de color.** Esa propiedad **hoy se llama `variant`** — se renombró al descubrir que `type` es palabra reservada en HTML.

*No hace falta más evidencia: el `.md` describe un componente que ya no existe con esos nombres.* **Hay que regenerarlo**, y ese es el trabajo que el Lead dejó apuntado.

---

## 5 · Lo que el Lead planteaba —"modificar el core de uSpec"— y por qué probablemente no hace falta

**La idea era personalizar uSpec para que apunte a Supernova en vez de a Figma.** *Revisado el código, la personalización que hace falta es mucho menor de lo que parecía:*

| Lo que se pensaba | Lo que resulta |
| --- | --- |
| Modificar el core para no renderizar en Figma | **Ya existe esa vía:** `create-component-md` no renderiza |
| Escribir un exportador a Supernova | **Ya existe:** `sdk.import.writeMarkdownToPage` |
| Adaptar la salida al formato de Supernova | **Probablemente no:** el `.md` es Markdown estándar |

**Lo que sí puede necesitar ajuste es la plantilla**, no el core: `references/component-md/component-md-template.md`. *Si `validateMarkdown` rechaza algo, se corrige ahí — es un archivo de texto del proyecto, no código del paquete.*

> **El criterio: tocar la plantilla local antes que forkear el paquete.** Modificar el core convierte cada actualización de uSpec en un merge manual, y el proyecto pierde las mejoras del upstream.

---

## 6 · La pregunta que decide si esto sirve

🔴 **¿`writeMarkdownToPage` conserva los bloques vivos de Supernova —tokens y componentes de Figma— o los aplana a texto?**

**Si los aplana**, la documentación queda como una foto: bonita pero desconectada del design system, y perdería lo que hace valiosa a Supernova. **Si los conserva**, la ruta completa es viable.

*No hay forma de saberlo leyendo los tipos: hay que probarlo con una página de prueba.* **Es el primer experimento a correr, y es barato.**

---

**Fuente:** skills de uSpec en `2. Proyecto/uSpec/.claude/skills/` · `uspecs.config.json` · tipos de `@supernovaio/sdk@2.4.11` · ver `contexto/16-supernova-plataforma.md` en el repo del área
