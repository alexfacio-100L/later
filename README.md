# Later · Brand System

Proyecto de **Renovare**: traducir el design system de Figma a código, con Supernova como fuente de verdad.

**Por dónde entrar:** `2. Proyecto/Contexto/tablero-de-ejecucion.md` — dice qué sigue.
Su vecino `estado-del-proyecto.md` explica el porqué de cada cosa, y `roadmap-fase2.md` las fechas.
**Corre `2. Proyecto/Contexto/verificar-tablero.py` antes de proponer trabajo:** el tablero tiene casillas y prosa, y solo las casillas se mantienen solas.

**Lo que se quedó en el repo del área** (`100Ladrillos/`): `DECISIONS.md`, la convención de nombres y el mapa de Supernova. *La frontera: si sobrevive al cierre del proyecto y sirve al siguiente, es del área.*

### Reporte de estado para stakeholders

`0. Planificación de proyecto/reporte-de-estado.html` → publicado en **https://claude.ai/code/artifact/c6be2bbd-112c-41fd-923d-be8a82d54144**

⚠️ **Ese archivo es lo que permite republicar en el mismo enlace.** Si se pierde, la página queda congelada y habría que crear otra con otra URL. Se actualiza al cierre de cada sprint.

---

## Cómo está organizada esta carpeta

Modelo **IPO — Input · Process · Output**. Es la convención del área para todos los proyectos, no solo para éste.

| Carpeta | Qué va | Regla |
| --- | --- | --- |
| **raíz** | Solo el `README.md` y las cuatro carpetas | La portada del proyecto |
| **`0. Planificación de proyecto`** | Kick-off, cronogramas, calendarios, reportes de estado, material de seguimiento y comunicación | Lo que explica **cómo se va a trabajar** y cómo se comunica el avance |
| **`1. Recursos`** | Input: material en bruto, insumos de terceros, referencias externas | **No se edita.** Entra como llegó |
| **`2. Proyecto`** | Process: todo lo editable — investigaciones, auditorías, correcciones, herramientas | Aquí se trabaja. Admite subcarpetas |
| **`3. Entregables`** | Output: resultados no editables y entregables | PDFs, o **un documento con la URL** cuando el entregable vive en Figma, Notion u otra plataforma |

**Subcarpetas de `2. Proyecto`:** `Diagnóstico` (auditorías e investigación) · `Correcciones` (lo que se aplicó al sistema) · `Snapshots` (respaldos previos a cambios destructivos) · `Soporte` (consultas y handoffs) · `_Superado` (documentos vigentes solo como histórico) · `uSpec` (la herramienta de documentación).

---

## uSpec — cómo se opera

**Qué es.** Herramienta de terceros (MIT) que genera la especificación de un componente desde Figma: un `.md` portátil y, a partir de él, seis anotaciones visuales dentro de Figma.
Repositorio: `github.com/redongreen/uSpec` · Documentación: `docs.uspec.design`

**Dónde vive cada pieza y por qué:**

```text
2. Proyecto/uSpec/
├── .claude/skills/     las 13 skills (create-*, extract-*, firstrun)
├── references/         plantillas e instrucciones de terceros
├── uspecs.config.json  claves de las plantillas de Figma + tipografía
└── .uspec-cache/       regenerable · no se versiona

3. Entregables/Componentes/
└── button.md           la especificación · lo que se entrega
```

⚠️ **`references/` NO se puede mover a `1. Recursos` aunque sea material de terceros.** Las skills lo referencian como `../../../references/` desde `.claude/skills/`, así que **tiene que ser hermano de `.claude/`**. Moverlo rompe las seis skills de render.

### El flujo, en orden

1. **Extraer** — plugin `uSpec Extract` sobre el component set en Figma → descarga un `_base.json`.
2. **Generar** — `create-component-md` con `baseJsonPath` → produce el `.md`.
   Usar `--output` para que aterrice en `3. Entregables/Componentes/`, en vez del `./components/` que la herramienta asume.
3. **Anotar** — las skills `create-anatomy`, `create-api`, `create-property`, `create-structure`, `create-color` y `create-voice` leen ese `.md` y dibujan en Figma.
   **Una por una: se solapan si corren en paralelo.**

### Tres trampas verificadas — no son opinión

**`importComponentByKeyAsync` no funciona aquí.** Las siete plantillas son componentes **locales y sin publicar** dentro del archivo de Figma, así que falla con *"Component with key not found"*. Hay que localizarlas por su `key` en la página `_Local Componentes`, instanciar y desacoplar. **Cada skill necesita esa instrucción.**

**El idioma es mixto a propósito.** La prosa va en español; **los encabezados, nombres de columna e identificadores van en inglés** porque las skills localizan las secciones por su texto literal (`## Voice / Screen reader`, `### State: …`, la fila `Announcement`). Traducirlos deja de funcionar el render. Los nombres de propiedad y token tampoco se traducen: **deben coincidir con el código.**

**El idioma tiene TRES capas, no dos.** Verificado el 18 ago al re-renderizar:

| Capa | Dónde vive | ¿Se traduce? |
| --- | --- | --- |
| Contenido | el `.md` | **Sí** — y de ahí sale la mayor parte de lo visible |
| Etiquetas de tabla | la plantilla de Figma | Se puede, pero es un fork de material de terceros |
| Textos del script | **hardcoded en la skill** | **No llega por el `.md`** — hay que traducirlos en el frame **después de cada render** |

Los de la tercera capa son títulos de sección y frases de apoyo que **la skill escribe por su cuenta** (*"Component structure"*, *"Elements that compose the Button…"*). **Parchear las skills no sirve: son de terceros y se actualizan.** Lo barato es pedir la traducción como paso final del encargo de render.

**El modo oscuro no sale solo.** `create-component-md` emite **un único conjunto de tokens** por combinación, sin expandir por modo. Hay que añadir el segundo valor a mano: `token (#Light · #Dark)`. En el Button, **10 de 14 tokens cambiaban entre modos** — sin esa columna la especificación describe menos de un tercio del color real.

### Bugs conocidos de las plantillas

- `counterAxisSizingMode: 'FILL'` es rechazado en este entorno → usar `layoutAlign = 'STRETCH'`.
- Las celdas clonadas conservan `WIDTH_AND_HEIGHT` y se desbordan → `textAutoResize = 'HEIGHT'` + `layoutSizingHorizontal = 'FILL'`.
- `findStopNode` de `create-voice` busca solo descendientes: si la raíz del componente y un texto hijo se llaman igual, marca el nodo equivocado.
