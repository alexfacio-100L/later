# Cómo actualizar uSpec sin planchar nuestras adecuaciones

**20 ago 2026.** *Resuelto antes de tocar nada de uSpec, que es el momento en que sale barato.*

---

## El punto de partida, verificado

**Hoy no hemos modificado ni una línea de uSpec.** Las 13 skills y los 14 references son idénticos al paquete publicado `0.3.2`.

⚠️ **Parecía lo contrario.** Una comparación directa marca **12 de 13 skills como modificadas**, y es falso: **`init` resuelve tres familias de placeholder al instalar**, y esas sustituciones cambian el archivo sin cambiar su contenido.

| Placeholder en el paquete | Se convierte en |
| --- | --- |
| `{{ref:api/x.md}}` | `../../../references/api/x.md` |
| `{{skill:create-x}}` | `` the `create-x` skill `` |
| `{{repo:figma-plugin/x}}` | `../../../figma-plugin/x` |

> **Sin normalizar esas tres, cualquier comparación es ruido.** *Fue exactamente lo que pasó en el primer intento: 12 falsos positivos.*

---

## La herramienta

```bash
node verificar-uspec.mjs          # compara con la última publicada
node verificar-uspec.mjs 0.4.0    # compara con una versión concreta
```

**No instala nada globalmente.** Descarga el paquete a un temporal, compara, y lo borra. *Así se puede consultar cualquier versión sin ensuciar el sistema ni tocar el proyecto.*

**Qué responde:**

| | |
| --- | --- |
| **Contra la versión instalada** | Toda diferencia es **nuestra**. Es la lista de lo que se perdería al reinstalar |
| **Contra una versión nueva** | Qué cambió arriba, qué archivos son nuevos y cuáles se retiraron |

---

## La estrategia: no editar arriba, extender al lado

**La regla que hace todo esto sostenible:**

> **Lo de uSpec se deja intacto. Lo nuestro vive aparte.**

**Lo que ya cumple esa regla:**

| Nuestro | Dónde |
| --- | --- |
| El conversor a Supernova | `experimento-canario/conversor.mjs` |
| La bandera de destino | `experimento-canario/destino.mjs` |
| Configuración | `uspecs.config.json` |
| Toda la documentación de este directorio | `*.md` |

**Ninguno lo toca una actualización**, porque `init` solo escribe en `.claude/skills/` y `references/`.

### Cuando haya que modificar una skill

*El caso previsto: recortar las `create-*` para que solo dibujen el `#preview`.*

**Antes de hacerlo, correr `verificar-uspec.mjs` para partir de verde.** Después:

1. **Modificar lo mínimo**, y anotar qué y por qué en este archivo
2. **Guardar el original** junto al modificado, como `SKILL.md.orig`
3. **Volver a correr el verificador**: la skill aparecerá en la lista de modificados, que es justo lo que queremos — **es el inventario de lo que hay que reaplicar**

---

## El procedimiento de actualización

**1 · Ver qué cambió arriba**

```bash
node verificar-uspec.mjs
```

**2 · Si hay modificaciones nuestras, guardarlas** — copiar los archivos que el verificador liste.

**3 · Actualizar**

```bash
npx uspec-skills@<versión> init
```

**4 · Reaplicar** lo nuestro sobre la versión nueva, comprobando que el cambio de arriba no lo haya dejado sin sentido.

**5 · Fijar la versión** en `uspecs.config.json` y en el `package.json` del proyecto.

**6 · Correr el verificador otra vez** — debe listar exactamente lo que reaplicaste, ni más ni menos.

---

## Lo que queda pendiente

🔴 **No existe `package.json` en la raíz del proyecto.** `npx uspec-skills` **resuelve la última versión publicada cada vez**. Hoy el config declara `0.3.2` y npm sirve `0.3.2` — **coinciden por casualidad, no por garantía.** *Cuando uSpec publique `0.4.0`, el proyecto la usará sin avisar y sin que nadie lo decida.*

**Fijarla como `devDependency` es lo que convierte este procedimiento en una decisión en vez de un accidente.**
