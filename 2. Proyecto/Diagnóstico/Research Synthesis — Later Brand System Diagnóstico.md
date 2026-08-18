# Research Synthesis: Diagnóstico Later Brand System
## Validación cruzada: evidencia interna + literatura de industria 2022–2026

**Proyecto:** Later: Brand System — Fase 2  
**Elaborado:** 17 de junio de 2026  
**Propósito:** Fortalecer la base de evidencia del Kickoff cruzando los hallazgos de la encuesta interna (16 respuestas) con investigación de industria publicada entre 2022 y 2026.

---

## 1. Metodología

**Fuente interna:** Encuesta "Brand System · Diagnóstico de fricción" — 16 respuestas de equipos de Marketing (n=5), Tecnología/Desarrollo (n=9) y Product Design (n=2). Recolectada del 10 al 15 de junio de 2026.

**Fuentes externas revisadas (2022–2026):**
- Sparkbox Design Systems Survey 2022 (n=219 profesionales)
- Zeroheight Design Systems Report 2025 y 2026
- Knapsack Design System Adoption Insights (n=100+)
- Figr: "Figma Design System Drift: Why Components and Code Diverge" (2026)
- Atomize: "Design System Parity: Figma vs Code Sync in 2026"
- Miro: "Design System Governance: How to Keep Design and Code in Sync" (2026)
- Gartner Design System Effectiveness Report (via Knapsack)
- McKinsey "The Business Value of Design" (2018, citado en el Brief)
- Nielsen Norman Group (citado en el Brief)

**Metodología de validación:** Se identificaron 5 clusters a partir de codificación inductiva de respuestas abiertas (P2 y P5 de la encuesta). Cada cluster se cruzó contra hallazgos cuantitativos de la literatura. Se marcaron los datos sin fuente primaria verificable directamente.

---

## 2. Los 5 Clusters: evidencia interna y validación externa

---

### CLUSTER 1: Desincronización Diseño↔Código (Token & Component Gap)

**Definición:** Discrepancias entre lo que existe en Figma/Brand System y lo que está implementado en código (bricks-ui, web app, mobile). Se manifiesta en colores con valores distintos, íconos con nombres diferentes, componentes que visualmente difieren entre la herramienta de diseño y producción.

**Evidencia interna (verbatim):**

> *"los colores del brand system no están compartidos con figma por lo cual tenemos que buscar directamente el color y puede haber alteración"* — Tecnología
>
> *"los iconos entre el brand y en bricks-ui no tienen a veces los mismos nombres o tienen pequeñas variaciones"* — Tecnología
>
> *"lo que tenemos en Later no es lo mismo que consumen los devs"* — Product Design
>
> *"componentes que en bricks son de una manera en figma de otra y a la hora de usarlos no concuerdan con el diseño que se nos pone a hacer"* — Tecnología

**Alcance interno:** 6 de 9 personas de Tecnología (67%) mencionan este problema. 2 de 2 de Product Design (100%). Es el cluster con mayor impacto en tiempo perdido: 1 persona reporta **más de 3 horas semanales**, 4 reportan entre 30 min y 1 hora.

**Validación externa:**

- **Sparkbox 2022 (n=219):** "Parity between design & code" es citado como top challenge por el **37% de los maintainers** — siendo el tercer mayor reto después de deuda técnica (43%) y adopción (36%). Está también en el top 5 de prioridades (33%).

- **Atomize 2026:** "Token-level parity is achievable today. Component-level parity is a different and largely unsolved problem in 2026." El modelo de overrides de Figma no mapea directamente al modelo de props de React — cada herramienta que intenta sincronizarlos requiere interpretación, no traducción. "Component-level two-way sync between Figma and code just doesn't really exist yet — it's more a governance problem than a tooling one."

- **Figr 2026:** El drift de design system "empieza en la capa de tokens." Mecanismo típico: *"Engineering matches the mock by hard-coding the same color. Two sprints later, the brand color changes and nobody catches those local values."* Los tres tokens más frecuentemente quebrados bajo presión de deadline: **color, tipografía, espaciado**.

- **Figr 2026:** El renombramiento de íconos y tokens sin un proceso de changelog es una causa directa de divergencia entre Figma y código. "Token changes need a release rhythm, changelog, and owner on both sides. 'We updated Figma' is not synchronization."

**Conclusión del cluster:** Lo que reporta el equipo de 100 Ladrillos (colores no sincronizados, íconos con nombres distintos, componentes diferentes entre Figma y bricks) es el patrón exacto que la industria documenta como "design system drift" — un fenómeno universal que afecta al 37%+ de equipos encuestados. No es un fallo de ejecución del equipo; es el resultado predecible de no tener un pipeline token→código establecido.

---

### CLUSTER 2: Gobierno Deficiente / Falta de Reglas y Versioning

**Definición:** Ausencia de reglas claras para la evolución del sistema: sin distinción formal entre componentes experimentales y base, sin versionado, sin notificación de cambios, sin definición de comportamientos (web vs. mobile, dark/light mode).

**Evidencia interna (verbatim):**

> *"inconsistencias, falta de reglas y regulación entre componentes experimentales y los base"* — Tecnología
>
> *"comunicación al realizar cambios core"* — Tecnología
>
> *"hace falta darle tiempo a la definición tanto de requerimientos como de diseño... no cambiar cosas ya definidas"* — Tecnología
>
> *"Que tuviera versionado, definición de diseño y comportamiento"* — Tecnología (el más afectado: muy frecuente, 1-3 horas/semana)
>
> *"La actualización e implementación de componentes, hay casos en los que el flujo necesita soluciones nuevas que pueden generar fricción al implementarse."* — Product Design

**Alcance interno:** 4 de 9 personas de Tecnología (44%) mencionan explícitamente la falta de governance o reglas. Frecuencia: 1 persona reporta **"muy frecuente" (varias veces por semana)**, 3 reportan "frecuente" (1-2 veces/semana).

**Validación externa:**

- **Sparkbox 2022:** Solo el **44% de los equipos tiene modelos de governance**. El **43% de los maintainers** cita "deuda técnica/creativa" como su mayor challenge — más que adopción, parity o staffing. El **35% de los subscribers** reporta que "no es claro qué está desactualizado, roto o en construcción."

- **Knapsack / búsqueda 2024:** El **41% de los design systems creados en los últimos 2 años ya no estaban activamente mantenidos** *(dato atribuido a Knapsack 2024; pendiente de verificar con fuente primaria).*

- **Zeroheight 2025:** La satisfacción con el buy-in organizacional **cayó de 42% a 32% año contra año**. Tema recurrente: "falta de entendimiento del valor por parte del liderazgo senior" y "cambios frecuentes de prioridades."

- **Sparkbox 2022:** Solo el **16% de los equipos mide métricas de uso o satisfacción** de su design system — consistente con el hallazgo de la Fase 1 del Brief de 100 Ladrillos.

- **Miro 2026:** Las causas más comunes del colapso de governance: (1) ownership vago, (2) review bottlenecks, (3) contribution confusa. "When no one is accountable for evolution, standards drift and adoption slows."

- **Gartner 2025 Hype Cycle:** Los design systems están pasando del "Peak of Inflated Expectations" al "Trough of Disillusionment" — la fase donde el entusiasmo inicial choca con las realidades duras de mantenimiento, adopción y buy-in organizacional.

**Conclusión del cluster:** La demanda del equipo de Tecnología por versionado, reglas entre componentes experimentales y base, y notificación de cambios core no es una petición de nicho: **el 43-44% de los equipos en la industria comparte exactamente este problema**. La diferencia entre los sistemas que funcionan y los que no es precisamente la existencia de procesos de governance — no la calidad técnica del sistema en sí.

---

### CLUSTER 3: Assets Visuales Desactualizados / Brand-Product Gap

**Definición:** Deuda visual en el Brand Book: ilustraciones percibidas como pasadas de moda, paleta de colores incompleta o insuficiente, faltas ortográficas, y una brecha entre los activos de marca que usa Marketing y los que consume Product/Tecnología.

**Evidencia interna (verbatim):**

> *"los iconos e ilustraciones que están en el brandbook no se usan del todo, debemos actualizarlos"* — Marketing
>
> *"También eliminaría las ilustraciones, considero que se ven un poco pasadas de moda y corregiría los errores de dedo o faltas ortográficas"* — Marketing
>
> *"La falta de gráficos auxiliares o de apoyo, falta de lineamiento en contexto digital, mucha rigidez en estilos/variaciones tipográficas."* — Marketing
>
> *"Me gustaría cambiar el color Pressed, y agregar más variedad de colores al Brand System."* — Product Design

**Alcance interno:** 4 de 5 personas de Marketing (80%) mencionan elementos visuales desactualizados. Es el cluster dominante para el equipo de Marketing.

**Validación externa:**

- **Lucidpress / Capital One Shopping Research (2024):** El **95% de las empresas tiene guías de marca, pero solo el 25-30% las aplica activamente** en toda la organización. El **81% de las empresas lucha con creación de contenido fuera de marca**, a pesar de tener lineamientos documentados.

- **Renderforest 2024:** El **63% de los marketers** reporta dificultad para mantener contenido consistente a través de canales.

- **Múltiples fuentes:** Consistencia de marca = **incremento de ~23% en revenue** (cifra ampliamente citada, originada en estudios de Lucidpress). ⚠️ *Nota: esta cifra tiene múltiples atribuciones y debe usarse con precaución.*

- **Gartner / Knapsack:** *"Savvy designers collaborate with brand managers and product marketers to ensure the style elements in their design system accurately manifest the brand identity."* — Esto está descrito en la literatura como un objetivo aspiracional, no como la práctica estándar.

- **FinTech context (Webstacks 2024):** En empresas fintech, la consistencia de marca es especialmente crítica porque opera como señal de confianza ante usuarios que invierten dinero real. La inconsistencia visual reduce la percepción de credibilidad — directamente relacionado con el diagnóstico heurístico interno de 100 Ladrillos que identificó "debilidades en la categoría de confianza y credibilidad del sitio."

- **Miro 2026:** "Static documentation was never designed to govern a distributed team operating at speed." El problema de assets desactualizados es estructural cuando Marketing y Product operan sin un referente compartido vivo.

**Conclusión del cluster:** La deuda visual de Marketing (ilustraciones, paleta, tipografía) no es solo una preferencia estética — la industria la documenta como un fallo sistémico de governance que ocurre cuando la marca es "tratada como una iniciativa de Marketing exclusivamente." El brief de 100 Ladrillos ya había identificado esto como la brecha entre el Brand Book y el Design System; la encuesta confirma que Marketing lo siente en su trabajo diario.

---

### CLUSTER 4: Accesibilidad y Distribución de Assets

**Definición:** Dificultad para encontrar, descargar y compartir elementos del Brand System — especialmente con proveedores externos. Assets no disponibles en formatos directamente usables. Íconos no visibles en la documentación pública.

**Evidencia interna (verbatim):**

> *"El poder descargar algún elemento directamente, como la paleta de colores"* — Marketing
>
> *"El compartir la información con proveedores y el que algunas secciones o aplicaciones están nombradas de manera genérica"* — Marketing
>
> *"buscar los iconos en el sistema de diseño de figma ya que en la página de design system no están todos los iconos"* — Tecnología

**Alcance interno:** Afecta principalmente a Marketing (2 personas) y Tecnología (1 persona). Impacto en tiempo reportado: bajo (menos de 30 min/semana) — pero la fricción es cualitativa: bloquea workflows con terceros.

**Validación externa:**

- **Sparkbox 2022:** Los challenges más reportados por subscribers: *"documented poorly"* (39%), *"unclear what is old, broken, or coming soon"* (35%), *"organized poorly"* (26%), *"doesn't have what I need"* (26%). Solo el **65% de los sistemas incluye developer-ready code** y el **75% tiene designer-ready assets** — significa que el 25-35% no tiene activos en formatos directamente utilizables.

- **Zeroheight 2026:** "Lack of resources is the top complaint among design system teams." La distribución de assets sigue siendo principalmente manual en la mayoría de los equipos — la automatización "remains an aspiration."

- **Atomize 2026:** El modelo copy-and-own (popularizado por shadcn/ui en 2023) surgió precisamente porque los modelos tradicionales de distribución vía npm/Figma library crean demasiada fricción para los consumidores del sistema. Es evidencia de que la distribución de assets es un pain point a nivel de ecosistema.

- **Webrand 2024:** "At least 1 in 3 employees feels they have to redo work due to poor access to files and information" — lo que aumenta la probabilidad de inconsistencia de marca en materiales externos.

**Conclusión del cluster:** La dificultad de descargar y compartir assets con proveedores es un síntoma directo de que el sistema solo existe en Figma — sin un flujo de distribución definido. La industria lo documenta como un fallo de "last-mile delivery" del design system: el sistema puede estar bien construido internamente pero es inaccesible para quien no opera directamente en Figma.

---

### CLUSTER 5: Capacitación y Onboarding

**Definición:** Falta de procesos formales de onboarding al Brand System, ausencia de capacitaciones, dudas frecuentes sin canal de resolución establecido.

**Evidencia interna (verbatim):**

> *"herramientas y dudas frecuentes"* — Tecnología
>
> *"Necesitamos organizar capacitaciones"* — Tecnología
>
> *"No tengo problemas porque mi trabajo no está ahí al día a día"* — Tecnología (señal de bajo awareness, no ausencia de problema)

**Alcance interno:** Solo 2 menciones explícitas, pero hay una señal más fuerte: la respuesta "no tengo mucha interacción" de un miembro de Tecnología sugiere bajo awareness general del sistema — lo cual es en sí un síntoma de onboarding deficiente, no de ausencia de problema.

**Validación externa — el dato más fuerte de todo el research:**

- **Sparkbox 2022 — Key Finding:** Solo el **30% de todos los equipos tiene soporte, capacitación y onboarding** para nuevos usuarios. Sin embargo, de los equipos que reportaron tener un design system **exitoso**, el **76% tenía estas prácticas en funcionamiento**. La brecha entre el promedio (30%) y los exitosos (76%) es la evidencia más clara de que el onboarding es el diferenciador de adopción.

- **Zeroheight 2026:** *"76% of teams not providing onboarding materials, and over 4 in 5 teams not providing videos, newsletters or webinars is surprising. The huge dropoff from documentation and 1-1 consultations to the rest suggests that as an industry we're probably not investing enough time and resources into education and training around our design systems."*

- **Knapsack 2022 (n=100+):** El #1 challenge de adopción es **"falta de conocimiento y experiencia usando design systems"** (31% lo cita como el challenge de mayor esfuerzo). Sobrepasa a la política interna (21%) y a la falta de workflows documentados (21%).

- **Knapsack 2022:** Los recursos más efectivos para driving adoption: *self-service docs/videos* (29.4%) + *advocacy and training workshops* (26.5%). Juntos representan el **55.9% de los drivers de adopción más efectivos** — más que mandatos de liderazgo (25%) y live support (25%).

- **Gartner (vía Knapsack):** "Design systems are products, and they need resources." Gartner recomienda explícitamente involucrar UX designers, front-end developers, content strategists y accessibility specialists en el mantenimiento — un equipo cross-funcional que muy pocas organizaciones tienen.

**Conclusión del cluster:** La demanda de capacitaciones no es un "nice to have" — la industria la documenta como el factor que separa los sistemas adoptados de los que quedan como artefactos de Figma. El patrón de 100 Ladrillos (sistema documentado pero sin flujo de adopción) es exactamente lo que el Brief ya identificó: *"la existencia del sistema no garantiza su adopción; son los procesos de implementación y gobernanza los que determinan si el sistema genera valor real."*

---

## 3. Tabla de Validación Cruzada

| Cluster | Evidencia interna | Benchmarks de industria | Fuente(s) |
|---|---|---|---|
| 1. Token & Component Gap | 67% de Tech + 100% de Product Design | 37% citan parity D↔C como top challenge | Sparkbox 2022 |
| 1. Token & Component Gap | Colores, íconos, comportamientos desincronizados | Token drift empieza en color, tipo, espaciado bajo deadline | Figr 2026, Atomize 2026 |
| 2. Governance | Falta de reglas, versionado, notificación de cambios | 44% sin governance; 43% con deuda técnica como top challenge | Sparkbox 2022 |
| 2. Governance | Componentes experimentales vs. base sin distinción | 35% no sabe qué está desactualizado o roto | Sparkbox 2022 |
| 2. Governance | — | Buy-in cayó de 42% → 32% YoY | Zeroheight 2025 |
| 3. Brand-Product Gap | 80% de Marketing siente deuda visual | 95% tienen guidelines; solo 25-30% las aplican | Capital One Research / Renderforest 2024 |
| 3. Brand-Product Gap | Ilustraciones, paleta, tipografía desactualizadas | Brand inconsistency = riesgo de credibilidad en fintech | Webstacks 2024 |
| 4. Distribución de Assets | No se pueden descargar assets, compartir con proveedores, encontrar íconos | 25-35% de sistemas sin assets en formatos directamente usables | Sparkbox 2022 |
| 5. Onboarding | Solo 2 menciones explícitas, pero bajo awareness general | 70% de equipos SIN onboarding; 76% de exitosos CON onboarding | Sparkbox 2022 |
| 5. Onboarding | "Necesitamos capacitaciones" | #1 challenge de adopción = falta de conocimiento (31%) | Knapsack 2022 |

---

## 4. Síntesis Cross-Cluster: el patrón de fondo

Los 5 clusters no son problemas aislados. Son manifestaciones del mismo problema estructural: **un Brand System documentado sin puente de distribución, governance, y adopción.**

La industria lo documenta con precisión. El Sparkbox 2022 lo formula así: *"Design systems are faced with challenges like technical debt, adoption struggles, and discrepancies between design and code. These are the same cracks that subscribers see as they report being challenged by bad documentation and poor usability."*

El Brief de 100 Ladrillos ya había diagnosticado este patrón: *"la existencia del sistema no garantiza su adopción; son los procesos de implementación y gobernanza los que determinan si el sistema genera valor real o permanece como un artefacto sin uso."*

La encuesta lo confirma desde la voz de los equipos: el problema no es que el sistema sea malo — el problema es que no hay un flujo confiable y repetible para que diseño, código y marca operen desde el mismo referente.

**El caso de negocio (fuentes citadas en el Brief, vigentes):**
- McKinsey 2018: empresas con alto desempeño en diseño = +32 pp en crecimiento de ingresos vs. pares
- Nielsen Norman Group: costo de corregir UX después del lanzamiento = "intereses usurarios"
- Sparkbox 2022: solo el 16% de los equipos mide métricas de design system — lo que significa que la mayoría no puede demostrar ni justificar el valor del sistema

---

## 5. Limitaciones del análisis

1. **Muestra interna pequeña:** 16 respuestas, con Product Design sub-representado (n=2 / 12.5%). Los insights de ese equipo son válidos pero no estadísticamente representativos.

2. **Dato de Knapsack no verificado directamente:** El dato "41% de design systems de menos de 2 años ya no estaban activamente mantenidos" fue obtenido de un resumen de búsqueda; no se pudo verificar en la fuente primaria de Knapsack durante este análisis.

3. **"23% de revenue lift por consistencia de marca"** — citado en múltiples fuentes pero con atribuciones distintas (Lucidpress, Forbes). Usar con caveat en presentaciones.

4. **Temporalidad mixta:** El Sparkbox Survey más reciente disponible directamente es el de 2022 (el de 2023-2024 no está en open access completo). Los datos de Zeroheight 2025 y 2026 son los más recientes y relevantes para tendencias actuales.

---

## 6. Fuentes

- [The 2022 Design Systems Survey by Sparkbox](https://designsystemssurvey.sparkbox.com/2022/) — n=219
- [Design Systems Report 2025 — zeroheight](https://zeroheight.com/resource/design-system-report-2025/)
- [Design Systems Report 2026 — zeroheight](https://report.zeroheight.com/)
- [Figma Design System Drift: Why Components and Code Diverge — Figr](https://figr.design/blog/figma-design-system-drift) (2026)
- [Design System Parity: Figma vs Code Sync in 2026 — Atomize](https://atomize.tools/blog/figma-design-system-parity-code-sync) (2026)
- [Design System Governance: How to Keep Design and Code in Sync — Miro](https://miro.com/research-and-design/design-system-governance/) (2026)
- [Design System Adoption Insights — Knapsack](https://www.knapsack.cloud/blog/design-system-adoption-insights) (2022)
- [Insights from Gartner's Design System Effectiveness Report — Knapsack](https://knapsack-showcase.webflow.io/blog-posts/gartner-design-system-effectiveness)
- [Brand Consistency Guide 2025 — Canva](https://www.canva.com/resources/brand-consistency/)
- [5 Common Brand Consistency Challenges — Webrand](https://webrand.com/blog/brand-compliance/enterprise-marketing-brand-consistency-challenges-solutions-guide)
- [FinTech Brand Consistency — Webstacks](https://www.webstacks.com/blog/fintech-brand-consistency)
- McKinsey "The Business Value of Design" (2018) — citado en el Brief de 100 Ladrillos
- Nielsen Norman Group — UX debt (citado en el Brief de 100 Ladrillos)
