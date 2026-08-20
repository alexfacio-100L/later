# Qué se puede delegar al agente en Supernova

**Prueba de estrés del 19 ago 2026**, a petición del Lead: *saber específicamente qué delegarme.*

**Todo lo de abajo está ejecutado contra el design system real**, no deducido de la documentación. Las pruebas se hicieron en un grupo temporal que se borró al terminar.

---

## ✅ Se puede delegar hoy

### Documentación — escritura completa

| Operación | Cómo |
| --- | --- |
| **Escribir una página entera** | `sdk.import.writeMarkdownToPage` — *reemplaza el contenido* |
| **Validar sin escribir** | `sdk.import.validateMarkdown` — **gratis, y dice qué rechaza** |
| **Los 36 bloques de Supernova** | Todos validan desde Markdown. *Ver `MAPA-DE-BLOQUES.md`* |
| **Crear un grupo** | `createDocumentationGroup(from, { parentPersistentId, title })` |
| **Crear una página** | `createDocumentationPage(from, { parentPersistentId, title })` |
| **Renombrar un grupo** | `updateDocumentationGroup(from, { id: <numérico>, title })` |
| **Borrar página / grupo con su árbol** | `deleteDocumentationPage` · `deleteDocumentationGroupAndTree` |
| **Leer el historial de versiones** | `listPageHistoryVersions` |

### Lectura — todo

Tokens, temas, componentes, estructura de documentación, frames de Figma, estructura de nodos del archivo, builds de publicación, usuarios y asientos.

### Configuración

**Cambiar el scope del design source** — `updateFigmaSource`. *Así se activó `documentationFrames` el 19 de agosto, que el Lead no encontraba en la interfaz.*

### Publicación

Consultar si hay build en curso, listar builds, y disparar la publicación.

---

## ❌ No se pudo, y por qué

| Operación | Qué pasó |
| --- | --- |
| **Convertir un grupo a Tabs** | 🔴 **La llamada se acepta sin error pero NO aplica.** `groupBehavior` sigue en `Group`. *Los tabs probablemente se crean de origen, no convirtiendo.* |
| **Crear un grupo de tabs** | `createDocumentationTab` rechaza todos los payloads probados |
| **Duplicar una página** | Payload no descubierto |
| **Mover una página de grupo** | Payload no descubierto |
| **Crear tokens** | `n.toWriteObject is not a function` — *requiere construir el objeto de dominio, no un literal* |

> ⚠️ **El fallo más traicionero es el primero: la llamada devuelve OK y no hace nada.** *No basta con que no lance error — hay que releer el estado y comprobar que cambió.* **Es la misma lección de las tablas escapadas: una señal verde no prueba el efecto.**

---

## Las reglas de payload que costaron descubrir

**El SDK es inconsistente en cómo identifica las cosas, y los errores llegan vacíos.** *Conviene tenerlas a mano:*

| | |
| --- | --- |
| **Crear** dentro de un grupo | `parentPersistentId` — **no** `parentId` ni `parentGroupId` |
| **Actualizar** un grupo | `id` **numérico** — no el `persistentId` |
| **Borrar** | acepta el `persistentId` |
| **Tokens y componentes en bloques** | objetos `{ entityId, entityType: "Token" }` — **no strings** |

---

## Cómo conviene repartir el trabajo

**Al agente:** generar y escribir páginas completas, mantenerlas sincronizadas con el `.md`, crear la estructura de grupos y páginas, poblar bloques vivos con tokens y componentes reales, auditar, y verificar después de cada cambio.

**Al Lead, en la interfaz:** la navegación en tabs, el borrado de tokens residuales *(R-12: los borrados no propagan por ninguna vía)*, la selección visual de frames dentro de un bloque, y cualquier decisión de diseño o de marca.

> **La frontera práctica: lo que es mecánico y verificable se delega; lo que exige criterio o toca la interfaz visual, no.**

---

## Y la regla que gobierna todo esto

**`validateMarkdown` es la herramienta más útil del conjunto.** No escribe, es gratis, y cada rechazo nombra el bloque, la propiedad y el problema exacto. **Construir contra él es más rápido que leer la documentación, y es la única fuente que no envejece.**

*Pero responde por la sintaxis, no por el resultado: **después de escribir, hay que mirar.***
