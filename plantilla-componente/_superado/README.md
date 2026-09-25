# Retirados

**Lo que está aquí NO se corre.** Se conserva legible porque su código todavía explica una decisión; no porque sirva.

⚠️ **Antes de mover algo aquí, su criterio se traslada a donde se encuentre solo.** *Un archivo retirado con doctrina dentro es doctrina perdida: nadie abre una carpeta que se llama «superado» buscando cómo se hace algo.*

## `generar.mjs` — retirado el 25 sep 2026

**Por qué:** producía una estructura de **tres** pestañas (`1-uso`, `2-especificacion`, `3-codigo`). **La viva en Supernova son las cuatro de `button.mjs`** — `Resumen general`, `Usos`, `Especificaciones`, `Estatus y cambios`, verificado leyendo el árbol: el grupo `Button` tiene `groupBehavior: "Tabs"` con esas cuatro hojas.

🔴 **Y no era solo divergencia: los cuatro ids de `config/button.json` con los que escribía NO EXISTEN en el árbol** — `40847088`, `40750051`, `40847087` y el grupo `561d3e6e-…`. *Correrlo con `--publicar` escribía contra ids fantasma.*

**Qué se rescató antes, y dónde vive ahora:**

| Lo que tenía | Dónde está |
| --- | --- |
| El reparto concreto: qué sección del `.md` de uSpec va a qué pestaña · el umbral de 120 líneas · «nunca dos» | `README.md` del repo, paso **2.7** del flujo de documentación |
| El principio agnóstico: tres lectores, tres preguntas, contar en vez de juzgar | Skill `design-systems` del repo del área |

**Lo que NO se rescató, porque no existe:** *el reparto contra las cuatro pestañas vivas nunca se escribió.* **Vive implícito en el contenido a mano de `button.mjs`, y hay que expresarlo antes de documentar el segundo componente.**

> ⚠️ **Estuvo fichado como trampa un mes entero sin que nadie lo retirara.** *El tablero del 27 ago 2026 ya decía: «`generar.mjs` sigue produciendo la estructura vieja … quien documente el segundo componente entrará por ahí si nadie lo retira. Retirarlo o apuntarlo al camino bueno: 15 min».* **Escribir el riesgo no lo retira.**

**Para crear pestañas sobre una hoja existente:** `npm run docs:pestanas`.
