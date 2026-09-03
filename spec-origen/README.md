# `spec-origen/` — lo que ENTRA a la especificación de un componente

**Un subdirectorio por componente.** Aquí vive todo lo que alimenta a la extracción de uSpec; lo que sale de ella —`Componentes/<slug>.md` y la página de Supernova— vive fuera.

```text
spec-origen/
  button/
    README.md                    Qué es cada cosa y cómo se corre la extracción
    _contexto-para-pegar.txt     El optionalContext. Se pega tal cual en el plugin
    button-_base.json            El volcado del component set. Snapshot fechado de Figma
    ESTADO-DE-LA-EXTRACCION.md   Dónde quedó la última pasada
```

## Las tres reglas de esta carpeta

**1 · Del `optionalContext` hay UNA sola copia, y está aquí.** *No se duplica en un `.md` explicativo, ni en el tablero, ni en el cuerpo de un script.* Se cita por ruta.

🔴 **Por qué es regla y no preferencia:** hasta el 3 de septiembre de 2026 había dos copias, y la que llevaba el nombre «contexto para la extracción» **estaba congelada el 20 de agosto** — dictaba la escala vieja `37 · 45 · 53` y un defecto tipográfico ya resuelto. *Un contexto caduco no falla: produce una extracción entera sobre una premisa falsa, con la forma correcta y sin hueco visible.* **Ya envenenó el brief del Button tres veces.**

**2 · El contexto se actualiza ANTES de extraer, y quitando lo que dejó de ser cierto.** *Un contexto que solo acumula capas es exactamente cómo se llegó a las tres veces anteriores.*

**3 · Los `_base.json` SÍ se versionan** *(excepción explícita en el `.gitignore`, con su porqué)*. **No son regenerables:** los produce una persona con el plugin, dentro de Figma, contra un archivo que cambia. *Son evidencia fechada, no caché.*

## De dónde vino esto

**El 27 de agosto la tarea 4.18 rehízo la geometría del Button.** El 3 de septiembre se descubrió que la página publicaba radios que ya no existían —8, 12 y 24 donde el componente tiene 16— y que la afirmación del `.md` sobre el radio **nunca se había verificado**: el extractor no lee el binding de las esquinas y la fila salió marcada `inferred`.

**Nada de eso se vio venir porque los insumos estaban repartidos** —el contexto en `Componentes/`, el `_base.json` en `_extraccion/`, la caché en `.uspec-cache/`— *y ninguno de los tres sitios se llamaba «lo que entra».* **Esta carpeta es ese sitio.**
