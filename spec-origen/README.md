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

---

## Política del `_contexto-para-pegar.txt` — una sola copia, y se verifica antes de extraer

**Regla:** cada componente tiene **exactamente un** `spec-origen/<slug>/_contexto-para-pegar.txt`. *El histórico vive en git, igual que se decidió para los `_base.json`.*

🔴 **No se hacen copias «por si acaso».** *Una segunda copia se congela el día que se crea y nadie vuelve a ella — ya pasó con una del 20 de agosto.* **Si necesitas la versión de una fecha, `git show <commit>:<ruta>`.**

**Se actualiza QUITANDO lo que dejó de ser cierto, no apilando una capa encima.** *Un contexto que acumula es exactamente cómo se envenenó cinco veces.*

### Antes de pedir la extracción

```bash
npm run uspec:contexto      # sale 1 si el contexto no está listo
```

**Comprueba seis cosas** — una sola copia · fecha de revisión declarada · frescura contra la última auditoría · **coherencia del bloque `ESTADO-VERIFICABLE` contra `comp:auditar`** · **el bloque `CAPAS-DE-TOKEN`** · **texto plano sin emojis ni invisibles**.

> ⚠️ **Y un verde NO significa «listo para pegar».** *El verificador detecta lo que sobra y lo que ha caducado; **no puede ver lo que falta**.* **Por eso su salida termina en una pregunta con fecha —«¿ha cambiado algo en Figma desde el X?»— en vez de en un permiso.** *El 7 de septiembre dio verde sobre un contexto al que le faltaba la capa de componente entera, y al Lead lo salvó preguntar. Era la segunda vez que le salvaba la misma pregunta.*

**El bloque `ESTADO-VERIFICABLE` es obligatorio** y va en la cabecera del `.txt`:

```
ESTADO-VERIFICABLE — lo lee `npm run uspec:contexto`. Si mientes aquí, falla.
  strokeWeight: bindeado
  cornerRadius: bindeado
  ...
```

🔴 **Existe porque parsear la prosa no funciona.** *Se intentó: con el contexto envenenado no detectaba nada —decía «el grosor CRUDO» y el check buscaba «strokeWeight»— y al arreglarlo empezó a disparar sobre el contexto bueno, porque «ninguna cruda» contiene la palabra que busca.* **Un check que grita en falso se ignora, igual que una puerta que bloquea siempre se salta.**

🟢 **Y escribir el bloque a mano es el punto del ejercicio: es el momento en que alguien tiene que mirar el estado real.**


---

## Texto plano: ni emojis ni caracteres invisibles

> **El contexto se PEGA en el plugin. Lo que lleve dentro puede acabar en el `.md` y de ahí en la página publicada.**

🔴 **El riesgo no es que el extractor no lea un emoji: es que SÍ lo reproduzca.** *Entrando por el insumo se salta la guarda de lo que se publica, que mira la salida.*

**La jerarquía se conserva en ASCII**, con la convención que el archivo ya usaba en mayúsculas:

| Marcador | Qué significa |
| --- | --- |
| `[CRITICO]` | Lo que **NO** se debe hacer, o el error caro que va a pasar |
| `[OJO]` | Lo que hay que mirar con cuidado — un matiz que se pierde fácil |
| `[OK]` | Lo que **ya está resuelto** y no debe documentarse como hueco |

⚠️ **Y el caso que no se ve, que es el peor:** el contexto del Button llevaba un **`U+00AD` (guion suave)** dentro de una palabra. *Invisible, parte la palabra al renderizar y rompe cualquier búsqueda sin que nadie entienda por qué.* **Los invisibles que se barren:** `U+00AD` · `U+200B`–`U+200D` · `U+FEFF` · `U+FE0F`.

🟢 **Lo comprueba `C6-texto-plano`, y es el check más fiable de los seis porque CUENTA CARACTERES en vez de interpretar prosa.** *Permite el español y la tipografía deliberada (`—`, `·`, `«»`); todo lo demás fuera de ASCII falla, con su punto de código y su número de línea.* **Contar no puede fallar en falso.**

*Decidido con el Lead el 7 de septiembre de 2026. Aplica a CUALQUIER `optionalContext`, de cualquier componente.*
