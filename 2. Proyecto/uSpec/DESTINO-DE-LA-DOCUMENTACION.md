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
