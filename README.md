# Later · Brand System

**El sistema de documentación del design system.** Genera la especificación de un componente desde Figma y la publica en Supernova.

Parte de **Renovare**: traducir el design system de Figma a código, con Supernova como fuente de verdad.

> **Esta carpeta contiene el SISTEMA.** La gestión del proyecto —tablero, contexto, roadmap, entregables— vive un nivel arriba, en `Later2.0/`, bajo el modelo IPO.

**Por dónde entrar:** `../2. Proyecto/Contexto/tablero-de-ejecucion.md` — dice qué sigue.
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
| `npm run docs:estado` | **¿Se puede publicar ahora?** Distingue caída de Supernova de ruta rota |
| `npm run docs:validar` | Convierte el `.md` y valida contra Supernova **sin escribir** |
| `npm run docs:publicar` | Convierte y **publica** en Supernova |
| `npm run docs:tokens` | Regenera el mapa de tokens que usan los bloques vivos |
| `npm run uspec:verificar` | Compara la instalación de uSpec con lo publicado. **Antes de actualizar** |

---

## Cómo está organizado

**Esta carpeta es el sistema; la gestión del proyecto vive fuera.**

```text
Later2.0/                              ← modelo IPO, la gestión del proyecto
├── 0. Planificación de proyecto/      kick-off, cronogramas, reporte de estado
├── 1. Recursos/                       input sin editar
├── 2. Proyecto/                       Contexto (tablero, estado, roadmap), Diagnóstico…
├── 3. Entregables/                    output no editable
└── Later: Brand System/               ← ESTA CARPETA · el sistema, con git
    ├── Componentes/                   las especificaciones producidas
    ├── .claude/skills/                las 13 skills de uSpec
    ├── references/                    plantillas de uSpec
    ├── experimento-canario/           el conversor y el publicador
    ├── uspecs.config.json
    └── verificar-uspec.mjs
```

⚠️ **`references/` tiene que ser hermano de `.claude/`.** Las skills lo referencian como `../../../references/`, así que **la pareja se mueve junta o no se mueve.**

> 🔴 **El repositorio git cubre solo esta carpeta.** Lo que vive en `Later2.0/` —el tablero, el contexto, los diagnósticos— **no está versionado aquí.** *Conviene darle su propio repositorio o respaldarlo aparte.*

### Reporte de estado para stakeholders

`../0. Planificación de proyecto/reporte-de-estado.html` → publicado en **https://claude.ai/code/artifact/c6be2bbd-112c-41fd-923d-be8a82d54144**

⚠️ **Ese archivo es lo que permite republicar en el mismo enlace.** Si se pierde, la página queda congelada.

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

### Cómo decidir si hay que cambiar de destino

```bash
npm run docs:estado
```

**No te dice solo si responde: distingue tres situaciones que se parecen desde fuera** y piden respuestas opuestas.

| | Qué hacer |
| --- | --- |
| ✅ **La API responde** | Publicar normalmente |
| 🔴 **Ni API ni web** | Supernova caído → consultar [status.supernova.io](https://status.supernova.io) y, si urge entregar, `DESTINO=figma` |
| 🔴 **La web responde y la API no** | **Es TU ruta, no Supernova.** Esperar no sirve |

> ⚠️ **La tercera es la que engaña, y costó tiempo aprenderla.** El 20 de agosto se reinició el equipo buscando un fallo que estaba fuera: un problema de peering del ISP hacia AWS Irlanda. **La web de Supernova respondía perfectamente mientras su API era inalcanzable.**
>
> **La prueba que las separa:** `cloud.supernova.io` se sirve por CDN con presencia local; `api.supernova.io` apunta directo a Irlanda. **Si `cloud` responde y `api` no, el problema es de ruta.** *Se confirma probando `s3.eu-west-1.amazonaws.com`: si tampoco responde, es la región entera.* **La solución es una VPN o avisar al ISP — cambiar de red lo resolvió.**

**Detalle:** `DESTINO-DE-LA-DOCUMENTACION.md`

### Los pasos, uno por uno

**1 · Extraer** — el plugin `uSpec Extract` sobre el component set en Figma produce un `_base.json`.

> 🔴 **Es el único paso que no se puede automatizar**, porque el plugin corre dentro de Figma. **Y el `_base.json` es una fotografía: si el componente cambió, hay que re-extraer.** Regenerar sin re-extraer produce documentación caduca con apariencia de fresca.

**2 · Generar el `.md`** — `create-component-md` con `baseJsonPath`. Usar `--output` para que aterrice en `Componentes/`.

**3 · Publicar** — `npm run docs:validar` primero, `npm run docs:publicar` después.

**4 · Los previews** — las imágenes de Figma se suben aparte. Ver `experimento-canario/PREVIEWS-DE-FIGMA.md`.

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

**Procedimiento completo:** `ACTUALIZAR-USPEC.md`

---

## uSpec — qué es y dónde vive

Herramienta de terceros (MIT) que genera la especificación de un componente desde Figma.
Repositorio: `github.com/redongreen/uSpec` · Documentación: `docs.uspec.design`

```text
Later: Brand System/
├── .claude/skills/          las 13 skills (create-*, extract-*, firstrun)
├── references/              plantillas e instrucciones de terceros
├── uspecs.config.json       claves de las plantillas de Figma + tipografía
├── verificar-uspec.mjs      compara con lo publicado
├── experimento-canario/     NUESTRO: conversor, publicador, documentación
├── Componentes/             las especificaciones producidas
└── .uspec-cache/            regenerable · no se versiona
```

⚠️ **`references/` tiene que ser hermano de `.claude/`.** Las skills lo referencian como `../../../references/`, y esa profundidad es lo que hizo que la reorganización del 20 ago no rompiera nada: **uSpec se movió como bloque.**

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
| `ACTUALIZAR-USPEC.md` | El procedimiento de actualización |
| `DESTINO-DE-LA-DOCUMENTACION.md` | Los dos caminos y cuándo usar cada uno |
| `100Ladrillos/contexto/16-supernova-plataforma.md` | Las cuatro superficies de Supernova |
