# Snapshot del Button — 17 ago 2026, antes de la reconstrucción

**Estado de partida:** `Button`, component set en la página `↳ Button`, **175 variantes**.

| Eje | Valores hoy | Tras la reconstrucción |
| --- | --- | --- |
| `Size` | XXL · XL · **L · M · S** | **L · M · S** |
| `Surface` | Marketing · Product | *sin cambio* |
| `Type` | Primary · Secondary · **Tertiary** | Primary · Secondary |
| `State` | Default · Hover · Pressed · Focus · **Loading** · Disabled | sin `Loading` |

**Reparto actual:** Primary 60 · Secondary 60 · Tertiary 55.
**La matriz es regular** — no hay ninguna combinación incompleta.

## La aritmética, verificada

```text
Button  S/M/L · sin Loading · sin Tertiary   =  60
Link    S/M/L · sin Loading · Tertiary       =  30
se van por Size XL/XXL                       =  70
se van por Loading en S/M/L                  =  15
                                          total 175  ✅
```

## Las dos fases, separadas a propósito

**Fase A — extraer `Tertiary` a un `Link` propio.** *Mueve, no borra.* Reversible: devolver los componentes al set original y restaurar el nombre con `Type=Tertiary`.

**Fase B — borrar `XL`/`XXL` y `Loading`.** *Destructiva.* **Bloqueada** hasta que el Lead verifique instancias de `XL`/`XXL` en los archivos de producto, según el prerrequisito declarado en `11-renovare-ejecucion.md`: *"Si aparecen, no se borran"*.

**Las 175 variantes conservan su `key` de componente**, así que las instancias existentes siguen ligadas aunque el set cambie de forma.

## 🔴 Prerrequisito NO resuelto — rectificación

**Se dio por resuelto y no lo está.** En la página `↳ Login & SL` existe un `Spiner` —con una sola `n`—, pero **mide 110 × 110 px y es una sola capa `Ellipse 1`**: es un **loader de pantalla completa** del flujo de Login, con cuatro fotogramas de animación. **No es un icono y no cabe en un botón.**

**El prerrequisito del 14 ago sigue vigente: no existe un icono de spinner.**

**Decisión del Lead:** se mantiene `Arrow PathSolid` tamaño `mini` en la variante `Loading`, **como deuda conocida documentada**, no como solución — dos flechas en círculo dicen *"recargar"*, no *"cargando"*, y al ser simétricas la rotación no se percibe.

## Las tres variantes Tertiary de muestra, para verificar el mapeo

```text
Size=XXL, Surface=Marketing, Type=Tertiary, State=Disabled   →  key 32bd34da…
Size=L,   Surface=Marketing, Type=Tertiary, State=Disabled   →  key e1d4c609…
Size=S,   Surface=Marketing, Type=Tertiary, State=Disabled   →  key 4ac928a3…
```

Al pasar al `Link`, el nombre pierde el segmento `Type=Tertiary` y queda `Size=… , Surface=… , State=…`. **Si se conservara, el `Link` tendría un eje `Type` con un solo valor** — una propiedad que no decide nada.
