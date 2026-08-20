# Contexto para la extracción del Button

**Pegar en el campo *Optional context* del plugin uSpec Extract**, al generar el `_base.json` del component set `Button`.

*Recoge todo lo que cambió el 19 y 20 de agosto, para que la especificación no repita lo ya corregido ni describa lo que ya no existe.*

---

```
El componente se auditó y corrigió el 19 y 20 de agosto de 2026. Ten en cuenta:

NOMBRES DE PROPIEDAD (cambiaron; la documentación anterior está caduca)
- El eje "Type" ahora se llama "variant". Se renombró porque `type` está
  reservado en HTML para el tipo de botón (button/submit/reset).
- Las propiedades usan camelCase: label, showIconLeft, showIconRight,
  iconLeft, iconRight.
- Los valores tertiary y quaternary ya no existen. tertiary pasó a ser el
  componente Link (un enlace navega, un botón actúa) y quaternary se
  eliminó. En producción el 53% de los botones eran quaternary: al migrar
  se llevaron a Link.

ESPACIADO (corregido el 20 de agosto)
- Los paddings están tokenizados al 100%: ningún valor crudo en las 60
  variantes. Antes había 18px y 10px, que no existían en la escala.
- La progresión es s: 8/16 · m: 12/16 · l: 16/24, toda dentro de la escala
  space (8·12·16·24). Alturas resultantes 37, 45 y 53.
- El gap usa space/zero.

DEFECTO CONOCIDO, NO CORREGIDO
- `size` NO escala la tipografía: los tres tamaños usan fuente 14. Antes
  del 20 de agosto lo único que diferenciaba l de m eran 2px de padding
  fuera de escala. Documéntalo como hueco abierto, no como decisión.

COLOR
- El estado disabled se corrigió: text/disabled pasó de neutralSoft/700 a
  neutral/600 en Light y neutral/700 en Dark. Antes daba 1.74:1 sobre el
  fondo deshabilitado (ilegible); ahora 4.50 en Light y 4.89 en Dark.
- background/brandHover y brandPressed tienen alias distinto por mode: en
  Light aclaran, en Dark oscurecen. La dirección la marca el fondo, no el
  mode.
- Sigue abierto: background/disabled apenas se distingue del lienzo en
  Light (1.30:1).

ICONOS
- La librería es Phosphor, no Heroicons. Los iconos usan Format=Outline y
  Weight=Regular por defecto.
- El icono por defecto de iconLeft/iconRight es ArrowRight.
- Existe un icono de marca propio: "Ladrillo", con Weight=Fill y
  Weight=Duotone. Los otros cuatro pesos están pendientes de dibujar.

IDIOMA
- La prosa va en español. Los encabezados de sección, los nombres de
  columna y los identificadores van en inglés: las skills localizan las
  secciones por su texto literal, y los nombres de propiedad y token deben
  coincidir con el código.
```

---

## Por qué cada bloque

**Los nombres de propiedad** evitan que la especificación nueva vuelva a decir `Type`, que es el error que arrastra el `.md` actual.

**El espaciado** impide que se documente como defecto algo ya corregido — sin esto, el generador vería la progresión nueva y podría reportarla como inconsistencia.

**El defecto conocido** se declara explícitamente para que **no se documente como decisión de diseño**. *Es la diferencia entre "los tres tamaños comparten fuente" y "los tres tamaños comparten fuente, y eso es un hueco abierto".*

**El color** da el porqué de los alias por mode, que sin contexto parecen arbitrarios.

**El idioma** replica la nota que ya lleva el `.md`, para que la convención sobreviva a la regeneración.
