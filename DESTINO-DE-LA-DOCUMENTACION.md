# Los dos caminos para documentar un componente

**El proyecto tiene dos formas de producir la documentación de un componente.** Cuál se usa lo decide una bandera en el `.env` de la raíz:

```bash
DESTINO_DOCUMENTACION=supernova   # vigente, por defecto
DESTINO_DOCUMENTACION=figma       # contingencia
```

---

## Lo primero: los dos comparten casi todo

**La bandera no cambia cómo se genera la documentación. Cambia qué se hace con ella.**

```
        Figma → [plugin uSpec Extract] → _base.json → create-component-md → button.md
                                                                                │
                                              ┌─────────────────────────────────┴──────┐
                                              ▼                                        ▼
                                   DESTINO=supernova                          DESTINO=figma
                              conversor.mjs → SDK → páginas              skills create-* → frames
                                   con bloques vivos                       de anotación en Figma
```

> **La bifurcación es el último paso.** Todo lo de arriba —el plugin, el JSON, el `.md`— es idéntico en ambos. *Cambiar de camino no obliga a rehacer nada de lo anterior.*

---

## `supernova` — el camino vigente

| | |
| --- | --- |
| **Cómo** | `conversor.mjs` traduce el `.md` a MDX-lite y lo publica con el SDK |
| **Coste** | **Bajo.** No renderiza nada en Figma |
| **Requiere** | `SUPERNOVA_API_KEY` en el `.env` y rol Editor u Owner |
| **Produce** | Páginas con **bloques vivos**: tokens, contraste calculado, propiedades del componente |

**Skills que usa:** `create-component-md` y las cuatro `extract-*`.

```bash
node publicar.mjs             # valida sin escribir
node publicar.mjs --escribir  # publica
```

---

## `figma` — la contingencia

| | |
| --- | --- |
| **Cómo** | Las skills `create-*` dibujan frames de anotación dentro de Figma |
| **Coste** | 🔴 **~100k tokens por skill y por corrida. Son siete skills.** |
| **Requiere** | Acceso de edición al archivo y las plantillas de uSpec publicadas |
| **Produce** | Frames de anotación en la página del componente |

**Cuándo tiene sentido:** Supernova no está disponible y hay que entregar documentación igualmente.

⚠️ **No es equivalente.** Lo que produce son imágenes de anotación: **no hay bloques vivos, ni contraste calculado, ni tokens que se actualicen solos.** Es documentación que caduca en cuanto cambie cualquier cosa.

---

## Las guardas

**Los scripts se niegan a correr con el destino equivocado.** *Es lo que evita el accidente caro: publicar por el camino de Figma sin querer.*

```
$ DESTINO_DOCUMENTACION=figma node publicar.mjs

Este script publica en Supernova, pero el destino configurado es Figma.
  ⚠️  DESTINO_DOCUMENTACION=figma
```

**Y un valor inválido también detiene la ejecución**, en vez de caer silenciosamente en un default.

---

## Por qué existe esta bandera

**La contingencia es el caso menos probable.** Lo que de verdad resuelve es dejar **constancia explícita de cuál es el camino vigente y cuál el de respaldo.**

> Sin ella, quien llegue nuevo al repositorio no tiene forma de saber que las skills `create-*` cuestan cien veces más que el camino nuevo. **Lo descubriría gastándolo.**

*Y deja registrado que el camino caro no está prohibido: está disponible, documentado, y con su precio a la vista.*

---

## Antes de cambiar de destino, comprueba por qué falla

```bash
npm run docs:estado
```

**Hay tres situaciones que se parecen desde fuera y piden respuestas opuestas:**

| Diagnóstico | Qué significa | Qué hacer |
| --- | --- | --- |
| ✅ La API responde | Todo bien | Publicar |
| 🔴 Ni API ni web | **Supernova caído** | Ver [supernova.statuspage.io](https://supernova.statuspage.io). Si urge entregar, `DESTINO=figma` |
| 🔴 **Web sí, API no** | **Problema de RUTA desde tu conexión** | **VPN o avisar al ISP.** *Cambiar a `figma` no ayuda y cuesta caro* |

> ⚠️ **La tercera es la trampa.** *El 20 ago 2026 se reinició el equipo buscando un fallo que estaba fuera:* un problema de peering hacia AWS Irlanda. **La web de Supernova respondía perfecto mientras su API era inalcanzable, y ningún host de `eu-west-1` — ni de Amazon — respondía.**
>
> **Cambiar de destino habría gastado ~700k tokens sin arreglar nada.** *Lo que lo resolvió fue cambiar de red.*

**La prueba que las separa:** `cloud.supernova.io` va por CDN con presencia local; `api.supernova.io` apunta directo a Irlanda. **Misma empresa, rutas distintas.**


---

## ¿Y si el que falla es Figma?

**La bandera NO tiene simétrico, y la razón importa: Figma es la fuente, Supernova es el destino.**

```
Figma  ──►  _base.json  ──►  button.md  ──┬──►  Supernova
 fuente                                    └──►  Figma (contingencia)
```

**Si cae Supernova**, la documentación se produce igual y se dibuja en Figma. *Caro, pero existe.*
🔴 **Si cae Figma, no hay a dónde ir**: sin Figma no se extrae, así que no hay `.md` nuevo que producir. **Los dos caminos de la bandera arrancan del mismo sitio.**

### Lo que sí se puede hacer con Figma caído

**Publicar lo que ya está extraído.** Si el `.md` existe en el repo, `publicar.mjs` no necesita Figma para nada:

| Qué | ¿Sobrevive sin Figma? |
| --- | --- |
| El texto, las tablas, el contrato de API | ✅ salen del `.md` |
| Tokens y contraste calculado | ✅ los resuelve Supernova |
| El playground de Storybook | ✅ es del código |
| **Los previews** | ✅ **si ya están subidos** — viven en Supernova, no en Figma |
| **Re-extraer o regenerar el `.md`** | 🔴 **no** |
| `figma-frames` y `figma-components-propstable` con datos nuevos | 🔴 **no** |

> **En corto: con Figma caído se publica, pero no se actualiza.** *Y eso casi siempre es suficiente para no bloquear una entrega.*

### Antes de dar Figma por caído

```bash
node experimento-canario/verificar-status.mjs
```

Consulta **Figma y Supernova** a la vez y **avisa de incidentes de las últimas 48 h aunque hoy esté todo verde** — un fallo de ayer se explica con un incidente de ayer.

⚠️ **Y aplica aquí la misma trampa que la tabla de arriba:** *el 26 ago 2026 los scripts contra Figma daban timeout y se culpó al encargo —«demasiadas variantes, agente saturado»—, hasta el punto de estar a punto de rediseñar una tarea de 60 variantes.* **Era una interrupción MAJOR del MCP de Figma, publicada en su status ese mismo día.** Páginas: [status.figma.com](https://status.figma.com/) · [supernova.statuspage.io](https://supernova.statuspage.io)
