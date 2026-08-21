# Experimento canario — escribir en Supernova desde Markdown

**Responde la pregunta que decide la ruta uSpec → Supernova:** ¿`writeMarkdownToPage` conserva la estructura, o aplana todo a texto?

## Correr

**Primero, una sola vez:** copia `.env.example` como `.env` en la **raíz del proyecto** y pega ahí tu API key.

```bash
cp .env.example .env        # desde la raíz de "later-brand-system"
```

**La key sale de** [cloud.supernova.io](https://cloud.supernova.io) → foto de perfil → *Profile settings* → *Authentication*. Hereda los permisos de quien la genera: hace falta **Editor u Owner**.

🔒 **`.env` está en `.gitignore`. Nunca se sube al repositorio, y por eso la key va ahí y no dentro de un script.**

**Después, los scripts la leen solos:**

```bash
cd "2. Proyecto/uSpec/experimento-canario"
npm install
node escribir-en-supernova.mjs --validar    # NO toca la página
node escribir-en-supernova.mjs --escribir   # reemplaza su contenido
```

*En un pipeline de CI no hace falta `.env`: si `SUPERNOVA_API_KEY` ya existe como variable de entorno, tiene prioridad.*

## Qué mirar después

| | La pregunta |
| --- | --- |
| 1 | ¿Las tablas quedaron como tablas o como texto plano? |
| 2 | ¿Los encabezados conservaron jerarquía? |
| 3 | ¿Se edita bloque a bloque, o es un muro de texto? |
| 4 | 🔴 **¿Hay bloques VIVOS —tokens, componentes— o todo es estático?** |

**La 4 es la que decide.** Si todo queda estático, la documentación sería una foto desconectada del design system, y habría que combinar la escritura de Markdown con bloques nativos añadidos aparte.

## La página

`Componentes / Button Canario` — `44285c3c-dbe6-4504-a485-2ab58a6fa8ba`. Está vacía, creada por el Lead para esto.

⚠️ **`writeMarkdownToPage` REEMPLAZA el contenido.** Por eso se usa una página de descarte y no la buena.

## Lo que ya se sabe de la sintaxis

Leyendo la plantilla *"Detalle de Componente NO BORRAR"* en MDX-lite, Supernova acepta Markdown estándar **más** sus propios componentes:

```jsx
<SNCallout type="Info|Success">…</SNCallout>
<SNImage alignment="Left" />
<SNTable showBorder highlightHeaderRow>
  <SNTableRow><SNTableCell alignment="Left" columnWidth={250}>…</SNTableCell></SNTableRow>
</SNTable>

<SNBlock packageId="io.supernova.block.figma-frames" variantId="bordered" columns={4}>
  <SNItem><SNPropFigmaNode name="figmaNodes" value={[]} showFrameDetails /></SNItem>
</SNBlock>
```

**`figma-frames` es la respuesta a la parte visual:** referencia nodos de Figma **en vivo**, no PNG exportados. Si el componente cambia, la muestra se actualiza sola.

🔴 **Pero hoy no llegarían:** el design source tiene `documentationFrames: false`. Hay que activarlo antes de probar esa parte.
