"""
Recorta al contenido y luego le devuelve margen hasta una fracción objetivo.

🔴 La lección: Supernova escala la imagen al ancho de la columna (~760 px), así
que el tamaño APARENTE del contenido es `760 × fracción`. No es «cuanto menos
margen, mejor»:

    fracción 50%  →  el contenido se ve a ~380 px   ✓ legible
    fracción 92%  →  se ve a ~700 px                enorme

El 26 ago se recortó al 92% y salieron gigantes. El rango original del
verificador —25–55%— era el correcto; recalibrarlo a 70–100% fue el error.
"""
import json
from collections import Counter
from PIL import Image

E = "/Users/alexfacio/Proyectos/Later2.0/later-brand-system/experimento-canario"
OBJETIVO = 0.48          # fracción de ancho que debe ocupar el contenido
PROPORCION_MAXIMA = 3.5  # lado largo / lado corto — el mismo techo que verificar-previews.mjs
F = json.load(open(f"{E}/frames-subidos.json"))

def recuadro(img):
    """El bbox del contenido. El fondo está PINTADO, así que se toma el color dominante del borde."""
    rgb = img.convert("RGB"); w, h = rgb.size
    borde = ([rgb.getpixel((x, 0)) for x in range(0, w, 7)] +
             [rgb.getpixel((x, h-1)) for x in range(0, w, 7)] +
             [rgb.getpixel((0, y)) for y in range(0, h, 7)] +
             [rgb.getpixel((w-1, y)) for y in range(0, h, 7)])
    fondo = Counter(borde).most_common(1)[0][0]
    dif = lambda p: abs(p[0]-fondo[0]) + abs(p[1]-fondo[1]) + abs(p[2]-fondo[2]) > 24
    xs, ys = [], []
    for y in range(0, h, 3):
        for x in range(0, w, 3):
            if dif(rgb.getpixel((x, y))): xs.append(x); ys.append(y)
    return (min(xs), min(ys), max(xs)+1, max(ys)+1, fondo) if xs else None

for nombre, meta in F.items():
    base = meta["archivo"].split("/")[-1]
    try: img = Image.open(f"{E}/{meta['archivo']}")
    except FileNotFoundError: print(f"  🔴 {nombre}: falta el original"); continue
    r = recuadro(img)
    if not r: print(f"  ⚠️  {nombre}: lienzo uniforme"); continue
    x0, y0, x1, y1, fondo = r
    cw, ch = x1-x0, y1-y0

    # El lienzo final: el contenido debe ocupar OBJETIVO del ancho.
    nw = int(cw / OBJETIVO)
    nh = int(ch + (nw - cw) * 0.35)          # respiro vertical proporcional, no plano

    # 🔴 Y el techo de proporción, que la fracción de ancho no garantiza.
    # Supernova escala al ancho de la columna: una imagen muy apaisada encoge de
    # ALTO y el contenido se ve pequeño aunque la fracción sea la correcta. El
    # verificador lo limita a 3.5:1, así que el lienzo lo cumple por construcción.
    # El 27 ago «Button sizes» salió a 3.8:1 — 4.18 ensanchó los tres botones
    # (paddingInline 16/24/32 + minWidth) sin que el frame creciera de alto.
    nh = max(nh, int(nw / PROPORCION_MAXIMA))
    lienzo = Image.new("RGB", (nw, nh), fondo)
    lienzo.paste(img.convert("RGB").crop((x0, y0, x1, y1)), ((nw-cw)//2, (nh-ch)//2))
    lienzo.save(f"{E}/frames/recortados/{base}")
    print(f"  ✓ {nombre:30} contenido {cw}px en lienzo {nw}px → {round(100*cw/nw)}%  ·  se verá a ~{round(760*cw/nw)}px")
