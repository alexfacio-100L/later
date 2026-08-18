# HANDOFF — Later: Brand System · Diagnóstico
**Fecha:** 2026-06-17 | **Para:** Nueva sesión de Claude

---

## Estado actual

| Tarea | Estado |
|-------|--------|
| Recuperar datos de encuesta (Drive) | ✅ Completado |
| Analizar 5 clusters de fricción | ✅ Completado |
| Research Synthesis (cruce con literatura) | ✅ Completado → archivo `.md` en la carpeta |
| **Crear Excel de análisis (5 hojas)** | ⏳ **PENDIENTE** |
| **Crear slides PPTX para Kickoff (2 slides)** | ⏳ **PENDIENTE** |

---

## Instrucción para retomar

Saluda a Alex y dile: "Listo para continuar. Voy a construir el Excel y el PPTX en paralelo." Luego ejecuta ambas tareas sin hacer preguntas adicionales.

---

## Datos de la encuesta (16 respuestas)

### Fuente
- **Google Sheet:** `Later: Brand System · Diagnóstico (respuestas)`
- **ID:** `19oQqU9vKz2iwWUEir5SjpYaL8UZB6xqmb0dDKv1yqUI`
- Re-fetch con: `mcp__612ce71d-63c5-405d-90f3-7d98dcb96f8d__read_file_content` si los datos no están en contexto.

### Distribución de equipos
- Marketing: n=5 (31.3%)
- Tecnología/Desarrollo: n=9 (56.2%)
- Product Design: n=2 (12.5%) ← subrepresentado, mencionarlo en el Kickoff

### Columnas del formulario
1. Marca de tiempo
2. Equipo (Marketing / Tecnología / Product Design)
3. **P3:** ¿Con qué frecuencia encuentras fricciones al usar el sistema de marca? (Likert 1-5)
4. **P4:** ¿Cuánto tiempo pierdes por semana por estas fricciones? (opciones en horas)
5. **P5 (abierta):** Describe la fricción más frecuente que encuentras

---

## Los 5 Clusters de fricción (coding inductivo)

| # | Cluster | Nombre corto | Teams afectados |
|---|---------|-------------|-----------------|
| 1 | Desincronización Diseño↔Código (Token & Component Gap) | **Token Gap** | Tec (n=7), Design (n=2) |
| 2 | Gobierno deficiente / Falta de reglas y versioning | **Governance** | Tec (n=5), Mkt (n=3) |
| 3 | Assets visuales desactualizados / Brand-Product Gap | **Asset Drift** | Mkt (n=5), Design (n=1) |
| 4 | Accesibilidad y distribución de assets | **Distribution** | Mkt (n=4), Tec (n=2) |
| 5 | Capacitación y Onboarding | **Onboarding** | Tec (n=3), Mkt (n=2) |

### Quotes clave por cluster (para Slide 2 del PPTX)
- **Token Gap:** *"Los tokens de color en Figma no coinciden con lo que tenemos en código"* — Dev
- **Governance:** *"No hay una fuente de verdad clara para saber qué versión del sistema usar"* — Dev
- **Asset Drift:** *"Los logos y colores que usamos en campañas ya no son los mismos que los de producto"* — Mkt
- **Distribution:** *"Pierdo tiempo buscando dónde están los assets actualizados"* — Mkt
- **Onboarding:** *"Cuando alguien nuevo entra al equipo no hay documentación de cómo usar el sistema"* — Dev

### Métricas clave (para slides y Excel)
- **Frecuencia "alta/muy alta":** ~75% de respuestas (P3 ≥ 4)
- **Tiempo perdido promedio:** 2-3 hrs/semana por persona
- **Tec reporta mayor frecuencia** que Marketing en Token Gap y Governance

---

## TAREA #2 — Excel de Análisis

### Archivo de salida
`Brand System · Análisis de Diagnóstico.xlsx`
Guardar en: `/Users/alexfacio/Proyectos/2025/100 Ladrillos/Later: Brand System/`

### 5 hojas requeridas

**Hoja 1 — Respuestas Crudas**
- Datos originales de las 16 respuestas (re-fetch de Drive si es necesario)
- Agregar columna extra: `Cluster asignado` (mapping manual según P5)
- Agregar columna: `Código de cluster` (1–5)
- Headers en fila 1, negrita, fondo #1A1A2E (azul oscuro), texto blanco
- Cada equipo con color de fila alternado: Mkt=coral suave, Tec=azul suave, Design=verde suave

**Hoja 2 — Affinity Map**
- 5 secciones, una por cluster
- Columnas: Cluster | Equipo | Cita/evidencia | Frecuencia (n)
- Color de encabezado por cluster (paleta: naranja, azul, coral, verde, morado)
- Fondo general claro (#F8F9FA)

**Hoja 3 — Insights Clave**
- Tabla priorizada: Insight | Equipo(s) | Frecuencia (n) | Evidencia textual | Nivel de impacto
- Ordenar de mayor a menor frecuencia
- Columna "Nivel de impacto": Alto / Medio / Bajo con color de celda (rojo/amarillo/verde)
- **Usar fórmulas COUNTIF** para frecuencias, no valores hardcoded

**Hoja 4 — Métricas**
- Gráfica de barras: Frecuencia de fricción por equipo (P3 promedio por equipo) — `pres.charts.BAR`
- Gráfica de donut: Distribución de tiempo perdido por semana (P4) — `pres.charts.DOUGHNUT`
- Datos en tabla debajo de cada gráfica con fórmulas `=AVERAGE`, `=COUNTIF`

**Hoja 5 — Matriz Frecuencia × Impacto**
- Cuadrante 2×2 visual
- Eje X: Frecuencia (baja → alta)
- Eje Y: Impacto en flujo de trabajo (bajo → alto)
- 5 burbujas etiquetadas con nombre corto del cluster
- Posición de cada cluster:
  - Token Gap → Alta Frec / Alto Impacto (cuadrante Q1 — prioridad crítica)
  - Governance → Alta Frec / Alto Impacto (Q1)
  - Asset Drift → Alta Frec / Medio Impacto (Q2)
  - Distribution → Media Frec / Medio Impacto (Q3)
  - Onboarding → Baja Frec / Medio Impacto (Q4)
- Implementar como imagen PNG generada con matplotlib, insertada con `add_image`

### Instrucciones técnicas
```bash
# Path en bash (workspace):
/sessions/admiring-focused-heisenberg/mnt/Later: Brand System/

# Crear con openpyxl + pandas
# SIEMPRE usar fórmulas Excel, nunca valores hardcoded de Python
# Después de crear, ejecutar:
python scripts/recalc.py output.xlsx

# Verificar que status sea "success" y total_errors sea 0
```

### Fuente tipográfica
- Fuente: `Calibri` (disponible en todos los sistemas)
- Títulos de hoja: 14pt negrita
- Headers de tabla: 11pt negrita
- Datos: 10pt regular

---

## TAREA #3 — PPTX Slides para Kickoff

### Archivo de salida
`Kickoff Slides — Resultados Diagnóstico.pptx`
Guardar en: `/Users/alexfacio/Proyectos/2025/100 Ladrillos/Later: Brand System/`

### Contexto del deck existente
- **Google Slides:** `[Overview] - Fase 2: Renovare -> Later: Brand System - Sprint 2 Q326`
- **ID:** `1uOtIrl5mlC-kfsMRO1HsneoPVNjNKP0UK8gNjvwizdQ`
- El deck tiene 11 slides; **Slide 7 = "Resultados del estudio"** (placeholder para estos resultados)
- Estas 2 slides reemplazarán/ampliarán el slide 7

### Paleta de colores (extraída del deck)
```
Background oscuro:  1A1A2E  (azul muy oscuro)
Background claro:   F5F5F5  (casi blanco)
Accent principal:   E94560  (rojo/coral)
Accent secundario:  0F3460  (azul marino)
Texto principal:    FFFFFF  (blanco, sobre fondo oscuro)
Texto secundario:   2D2D2D  (gris oscuro, sobre fondo claro)
Tag/chip Mkt:       FF6B6B  (coral)
Tag/chip Tec:       4ECDC4  (teal)
Tag/chip Design:    45B7D1  (azul claro)
```

### Tipografía
- Títulos: `Trebuchet MS` (36-40pt bold)
- Body: `Calibri` (14-16pt)
- Métricas grandes: `Arial Black` (56-72pt)

### SLIDE 1 — Mapa de Afinidad

**Estructura:** 5 tarjetas de clusters en grid (2-2-1), fondo oscuro

```
Layout: fondo 1A1A2E
Título (top): "5 Fricciones Críticas · Brand System" — Trebuchet MS 36pt, blanco

Grid de 5 tarjetas (RECTANGLE, fondo 0F3460, sin borde):
┌─────────────────┬─────────────────┐
│  01 Token Gap   │  02 Governance  │
│  Tec+Design     │  Tec+Mkt        │
│  n=9 evidencias │  n=8 evidencias │
├─────────────────┼─────────────────┤
│  03 Asset Drift │  04 Distribution│
│  Mkt+Design     │  Mkt+Tec        │
│  n=6 evidencias │  n=6 evidencias │
└────────┬────────┴────────┬────────┘
         │  05 Onboarding  │
         │  Tec+Mkt        │
         │  n=5 evidencias │
         └─────────────────┘

Cada tarjeta tiene:
- Número (01-05) en E94560, 24pt bold
- Nombre del cluster en blanco, 16pt bold
- Tags de equipo (chips de color) debajo del nombre
- "n=X evidencias" en gris claro, 11pt
- Accent bar izquierda de 4px en E94560

Sección inferior (strip oscuro 0F3460):
"Marketing n=5 · Tecnología n=9 · Product Design n=2 · Total: 16 respuestas"
```

### SLIDE 2 — Evidencia y Métricas Clave

**Estructura:** Half-split. Izquierda: 2 grandes métricas. Derecha: 4 quotes

```
Layout: fondo F5F5F5 (claro)
Título (top): "Lo que encontramos" — Trebuchet MS 36pt, color 1A1A2E

MITAD IZQUIERDA (x=0, w=4.5", h=5.625"):
  Fondo 1A1A2E
  Métrica 1:
    "75%" — Arial Black 72pt, color E94560
    "reporta fricciones de alta frecuencia" — Calibri 14pt, blanco

  Separador horizontal thin (E94560, 1px)

  Métrica 2:
    "2-3h" — Arial Black 64pt, color 4ECDC4
    "perdidas por semana · por persona" — Calibri 14pt, blanco

  Nota al pie:
    "⚠ Product Design subrepresentado (12.5%)" — Calibri 10pt, color FFCC00

MITAD DERECHA (x=4.7", w=5.1", h=5.625"):
  4 quote cards (RECTANGLE fondo blanco, shadow sutil):
  
  Quote 1 (chip coral = Tec):
    "Los tokens de color en Figma no coinciden con lo que tenemos en código"
    — Dev · Token Gap
  
  Quote 2 (chip azul marino = Tec):
    "No hay una fuente de verdad clara para saber qué versión del sistema usar"
    — Dev · Governance
  
  Quote 3 (chip coral = Mkt):
    "Los logos y colores que usamos en campañas ya no son los mismos que los de producto"
    — Mkt · Asset Drift
  
  Quote 4 (chip coral = Mkt):
    "Pierdo tiempo buscando dónde están los assets actualizados"
    — Mkt · Distribution
```

### Instrucciones técnicas críticas
```javascript
// NUNCA usar "#" en colores: "E94560" NO "#E94560"
// NUNCA 8-char hex para opacity: usar propiedad opacity separada
// SIEMPRE crear fresh shadow objects con función makeShadow()
// QA obligatorio: convertir a PDF → pdftoppm → inspección visual

// Instalación:
npm install -g pptxgenjs react-icons react react-dom sharp

// Layout:
pres.layout = 'LAYOUT_16x9';  // 10" × 5.625"

// Conversión para QA:
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

---

## Archivos ya existentes en la carpeta

```
/Users/alexfacio/Proyectos/2025/100 Ladrillos/Later: Brand System/
├── Research Synthesis — Later Brand System Diagnóstico.md  ✅ (cruce con literatura)
└── HANDOFF — Sesión pendiente.md  (este archivo)
```

---

## Datos que el modelo necesitará re-fetchear

Si el survey data no está en contexto, re-fetch así:
```
Tool: mcp__612ce71d-63c5-405d-90f3-7d98dcb96f8d__read_file_content
fileId: 19oQqU9vKz2iwWUEir5SjpYaL8UZB6xqmb0dDKv1yqUI
```

---

## Notas finales para el Kickoff

1. **Mencionar** la subrepresentación de Product Design (12.5%) como limitación del estudio
2. **No** presentar los datos como conclusivos — son diagnóstico cualitativo
3. **Dos datos con caveat** en el Research Synthesis (marcados con ⚠️):
   - "41% design systems no mantenidos" — fuente no 100% verificada
   - "23% revenue lift brand consistency" — atribución conflictiva (Lucidpress vs Forbes)
4. El objetivo del Kickoff es alinear equipos, no cerrar decisiones
