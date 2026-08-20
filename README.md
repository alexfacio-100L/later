# Later · Brand System

Proyecto de **Renovare**: traducir el design system de Figma a código, con Supernova como fuente de verdad.

**Por dónde entrar:** `2. Proyecto/Contexto/tablero-de-ejecucion.md` — dice qué sigue.
Su vecino `estado-del-proyecto.md` explica el porqué de cada cosa, y `roadmap-fase2.md` las fechas.

> **Corre `npm run tablero` antes de proponer trabajo.** El tablero tiene dos fuentes de verdad —las casillas y la prosa— y solo las casillas se mantienen solas.

**Lo que se quedó en el repo del área** (`100Ladrillos/`): `DECISIONS.md`, la convención de nombres y el mapa de Supernova. *La frontera: si sobrevive al cierre del proyecto y sirve al siguiente, es del área.*

---

## Arranque

**Requisitos:** Node 21 o superior *(usa `process.loadEnvFile`)*, Python 3 y acceso de edición al archivo de Figma.

```bash
npm install          # fija uspec-skills en la versión que el proyecto espera
npm run setup        # instala las dependencias de las herramientas de documentación
```

**Después, la credencial.** Copia la plantilla y pega tu API key de Supernova:

```bash
cp .env.example .env
```

La key se genera en [cloud.supernova.io](https://cloud.supernova.io) → foto de perfil → **Profile settings** → **Authentication**. **Hereda los permisos de quien la crea: hace falta rol Editor u Owner.**

🔒 **`.env` está en `.gitignore` y nunca se sube.** *Si alguna vez se cuela una key en un commit, queda en el historial aunque la borres después.*

**Comprobar que todo quedó bien:**

```bash
npm run docs:conexion
```

### Los comandos

| | |
| --- | --- |
| `npm run tablero` | Verifica que el tablero no se contradiga. **Antes de proponer trabajo** |
| `npm run docs:conexion` | Comprueba la API key y los permisos de escritura |
| `npm run docs:validar` | Convierte el `.md` y valida contra Supernova **sin escribir** |
| `npm run docs:publicar` | Convierte y **publica** en Supernova |
| `npm run docs:tokens` | Regenera el mapa de tokens que usan los bloques vivos |
| `npm run uspec:verificar` | Compara la instalación de uSpec con lo publicado. **Antes de actualizar** |

---

## Cómo está organizada esta carpeta

Modelo **IPO — Input · Process · Output**. Es la convención del área para todos los proyectos, no solo para éste.

| Carpeta | Qué va | Regla |
| --- | --- | --- |
| **raíz** | El `README.md`, la configuración y las cuatro carpetas | La portada del proyecto |
| **`0. Planificación de proyecto`** | Kick-off, cronogramas, calendarios, reportes de estado | Lo que explica **cómo se va a trabajar** |
| **`1. Recursos`** | Input: material en bruto, insumos de terceros | **No se edita.** Entra como llegó |
| **`2. Proyecto`** | Process: todo lo editable — investigaciones, auditorías, herramientas | Aquí se trabaja |
| **`3. Entregables`** | Output: resultados no editables | PDFs, o **un documento con la URL** si el entregable vive en otra plataforma |

**Subcarpetas de `2. Proyecto`:** `Contexto` (tablero, estado, roadmap) · `Diagnóstico` (auditorías) · `Correcciones` · `Snapshots` · `Soporte` · `_Superado` · `uSpec`.

### Reporte de estado para stakeholders

`0. Planificación de proyecto/reporte-de-estado.html` → publicado en **https://claude.ai/code/artifact/c6be2bbd-112c-41fd-923d-be8a82d54144**

⚠️ **Ese archivo es lo que permite republicar en el mismo enlace.** Si se pierde, la página queda congelada. Se actualiza al cierre de cada sprint.

---

## El flujo de documentación

```
Figma → [plugin uSpec Extract] → _base.json → create-component-md → button.md
                                                                        │
                                          ┌─────────────────────────────┴────────┐
                                          ▼                                      ▼
                                 DESTINO=supernova                       DESTINO=figma
                            conversor → SDK → páginas                skills create-* →
                              con bloques vivos                      frames de anotación
```

**El destino lo decide una bandera en el `.env`:**

```bash
DESTINO_DOCUMENTACION=supernova   # vigente, por defecto
DESTINO_DOCUMENTACION=figma       # contingencia
```

> 🔴 **El camino de Figma cuesta ~100k tokens por skill, y son siete.** Solo debería usarse si Supernova no está disponible. **Los scripts se niegan a correr con el destino equivocado.**

**Detalle:** `2. Proyecto/uSpec/DESTINO-DE-LA-DOCUMENTACION.md`

### Los pasos, uno por uno

**1 · Extraer** — el plugin `uSpec Extract` sobre el component set en Figma produce un `_base.json`.

> 🔴 **Es el único paso que no se puede automatizar**, porque el plugin corre dentro de Figma. **Y el `_base.json` es una fotografía: si el componente cambió, hay que re-extraer.** Regenerar sin re-extraer produce documentación caduca con apariencia de fresca.

**2 · Generar el `.md`** — `create-component-md` con `baseJsonPath`. Usar `--output` para que aterrice en `3. Entregables/Componentes/`.

**3 · Publicar** — `npm run docs:validar` primero, `npm run docs:publicar` después.

**4 · Los previews** — las imágenes de Figma se suben aparte. Ver `2. Proyecto/uSpec/experimento-canario/PREVIEWS-DE-FIGMA.md`.

### Qué hace el conversor

**No traduce sintaxis: reconoce qué sección convierte y elige el bloque que corresponde.**

| Sección | Qué produce |
| --- | --- |
| `Color` | **`color-accessibility-grid`** — Supernova calcula el contraste |
| `API` | La tabla **más** `component-checklist` con el estado real |
| `Anatomy` | La imagen del `#preview` exportado |
| `Known gaps` | **Callouts por severidad** — `Alta` en rojo, `Media` en ámbar |
| `Provenance`, `Auto-reconciled` | **Se eliminan** — son metadato del generador, el 27% del documento |
| Resto de tablas | `<SNTable>` con anchos **proporcionales al contenido** |

**Y traduce al publicar.** El `.md` conserva el inglés como contrato técnico —uSpec y el propio conversor localizan las secciones por su texto literal—, pero **lo que lee el equipo sale en español.** *No se traducen identificadores: `isLoading`, `size`, `primary` deben coincidir con el código.*

---

## Actualizar uSpec sin perder nuestras adecuaciones

> **La regla: lo de uSpec se deja intacto, lo nuestro vive aparte.**

**`init` solo escribe en `.claude/skills/` y `references/`.** Todo lo demás —el conversor, la bandera de destino, la configuración, esta documentación— es nuestro y ninguna actualización lo toca.

```bash
npm run uspec:verificar          # contra la última publicada
```

**Descarga la versión a comparar a un temporal y la borra.** No instala nada en global.

⚠️ **Una comparación ingenua marca 12 de 13 skills como modificadas, y es falso.** `init` resuelve tres familias de placeholder al instalar —`{{ref:}}`, `{{skill:}}`, `{{repo:}}`— y el verificador las normaliza. *Sin eso, el informe es ruido.*

**Procedimiento completo:** `2. Proyecto/uSpec/ACTUALIZAR-USPEC.md`

---

## uSpec — qué es y dónde vive

Herramienta de terceros (MIT) que genera la especificación de un componente desde Figma.
Repositorio: `github.com/redongreen/uSpec` · Documentación: `docs.uspec.design`

```text
2. Proyecto/uSpec/
├── .claude/skills/          las 13 skills (create-*, extract-*, firstrun)
├── references/              plantillas e instrucciones de terceros
├── uspecs.config.json       claves de las plantillas de Figma + tipografía
├── verificar-uspec.mjs      compara con lo publicado
├── experimento-canario/     NUESTRO: conversor, publicador, documentación
└── .uspec-cache/            regenerable · no se versiona

3. Entregables/Componentes/
└── button.md                la especificación · lo que se entrega
```

⚠️ **`references/` NO se puede mover a `1. Recursos` aunque sea material de terceros.** Las skills lo referencian como `../../../references/` desde `.claude/skills/`, así que **tiene que ser hermano de `.claude/`**.

### Las dos familias de skill

| Familia | Qué hace | Coste |
| --- | --- | --- |
| **`extract-*`** (4) | Interpretan el `_base.json`. **No llaman a Figma** | Bajo |
| **`create-*` de render** (7) | Dibujan frames dentro de Figma | 🔴 **~100k tokens cada una** |
| **`create-component-md`** | Orquesta las cuatro `extract-*` y escribe el `.md` | Bajo |

*Citando el propio código de uSpec: "the majority of their weight is Figma rendering".* **El camino vigente no invoca ninguna `create-*`.**

---

## Trampas verificadas — no son opinión

**`importComponentByKeyAsync` no funciona aquí.** Las siete plantillas son componentes **locales y sin publicar**, así que falla con *"Component with key not found"*. Hay que localizarlas por su `key` en la página `_Local Componentes`, instanciar y desacoplar.

**Los frames de anotación están duplicados, y no son dos versiones del mismo trabajo.** Son **light y dark**: uSpec produce el light, el dark se duplicó a mano. Se distinguen con `frame.explicitVariableModes` — `{}` es light, `{ semanticColors: "Dark" }` es dark. **Borrar "el duplicado" destruye trabajo.**

**De Figma solo hace falta el `#preview`.** El frame `Button Anatomy` completo pesa 205 KB; su `#preview`, 23 KB. *Y el nombre no es consistente:* `#preview`, `#Preview` en Structure, `Preview placeholder` en Screen reader. **Hay previews vacíos que exportan un rectángulo en blanco sin avisar: descartar los que tengan cero hijos.**

**El modo oscuro no sale solo.** `create-component-md` emite **un único conjunto de tokens** por combinación. En el Button, **10 de 14 tokens cambiaban entre modos** — sin esa columna la especificación describe menos de un tercio del color real.

**Supernova no admite comentarios de ninguna clase** —ni `<!-- -->` ni `{/* */}`— **ni tablas Markdown con pipes.** El conversor lo resuelve, pero conviene saberlo. *Especificación completa en `experimento-canario/SINTAXIS-MDX-LITE.md`.*

> **Y la regla que gobierna todo esto: `validateMarkdown` responde "¿es sintaxis válida?", no "¿se ve bien?".** Un documento puede validar al 100% y ser ilegible. **Después de publicar, hay que mirar la página.**

---

## Documentación de referencia

| Archivo | Qué cubre |
| --- | --- |
| `experimento-canario/SINTAXIS-MDX-LITE.md` | Qué acepta y qué rechaza Supernova |
| `experimento-canario/MAPA-DE-BLOQUES.md` | Los 36 bloques y a qué sección corresponden |
| `experimento-canario/QUE-PUEDO-DELEGAR.md` | Qué se automatiza y qué no |
| `experimento-canario/PREVIEWS-DE-FIGMA.md` | Cómo llevar las imágenes de Figma |
| `uSpec/ACTUALIZAR-USPEC.md` | El procedimiento de actualización |
| `uSpec/DESTINO-DE-LA-DOCUMENTACION.md` | Los dos caminos y cuándo usar cada uno |
| `100Ladrillos/contexto/16-supernova-plataforma.md` | Las cuatro superficies de Supernova |
