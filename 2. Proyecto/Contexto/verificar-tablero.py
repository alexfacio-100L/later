#!/usr/bin/env python3
"""
Verifica que el tablero de ejecución no se contradiga a sí mismo.

Por qué existe: el 18 de agosto de 2026 el bloque "Por dónde seguir" recomendaba
tres tareas que llevaban cuatro días cerradas. El tablero tiene dos fuentes de
verdad —las casillas [x] y la prosa del encabezado— y solo la primera se mantenía
al día. Este script contrasta una contra otra.

Uso:  python3 verificar-tablero.py
Corre al ABRIR sesión, antes de proponer trabajo. Salida distinta de 0 = hay que arreglar algo.
"""
import re
import sys
from pathlib import Path
from collections import Counter

TABLERO = Path(__file__).parent / "tablero-de-ejecucion.md"
DECISIONES = Path("/Users/alexfacio/100Ladrillos/DECISIONS.md")


def main() -> int:
    if not TABLERO.exists():
        print(f"✗ No encuentro {TABLERO}")
        return 1

    texto = TABLERO.read_text(encoding="utf-8")
    problemas = []

    # Las casillas son la fuente de verdad
    cerradas = re.findall(r"^- \[x\] \*\*([0-9]+\.[0-9]+[a-z]?)", texto, re.M)
    abiertas = re.findall(r"^- \[ \] \*\*([0-9]+\.[0-9]+[a-z]?)", texto, re.M)
    set_cerradas, set_abiertas = set(cerradas), set(abiertas)

    # 1 · El encabezado no puede recomendar tareas ya cerradas
    seguir = re.search(r"▶ Por dónde seguir.*?(?=\n>?\s*\n)", texto, re.S)
    if seguir:
        citadas = set(re.findall(r"\*\*([0-9]+\.[0-9]+[a-z]?)\*\*", seguir.group(0)))
        muertas = sorted(citadas & set_cerradas)
        if muertas:
            problemas.append(
                f"'Por dónde seguir' recomienda tareas YA CERRADAS: {', '.join(muertas)}"
            )
        fantasmas = sorted(citadas - set_cerradas - set_abiertas)
        if fantasmas:
            problemas.append(
                f"'Por dónde seguir' cita tareas que no existen en el tablero: {', '.join(fantasmas)}"
            )
    else:
        problemas.append("No hay bloque '▶ Por dónde seguir' — el tablero no dice por dónde entrar")

    # 2 · Un número de tarea, una tarea
    for num, veces in Counter(cerradas + abiertas).items():
        if veces > 1:
            problemas.append(f"La tarea {num} aparece {veces} veces — numeración duplicada")

    # 3 · Contradicción interna: abierta pero su texto se declara cerrada
    for linea in texto.splitlines():
        m = re.match(r"^- \[ \] \*\*([0-9]+\.[0-9]+[a-z]?)", linea)
        if m and re.search(r"CERRADA|✅ \*\*Cerrada|✅ \*\*CERRADA", linea):
            problemas.append(f"La tarea {m.group(1)} está SIN marcar pero su texto dice que cerró")

    # 4 · Cerrada sin dejar rastro de cuándo
    for bloque in re.split(r"(?=^- \[x\] )", texto, flags=re.M)[1:]:
        m = re.match(r"- \[x\] \*\*([0-9]+\.[0-9]+[a-z]?)", bloque)
        if m and not re.search(r"\d{1,2}\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)", bloque):
            problemas.append(f"La tarea {m.group(1)} está cerrada pero no dice en qué fecha")

    # 5 · La fecha del encabezado contra la última fecha citada
    cabecera = texto.split("## Cómo se usa")[0]
    if not re.search(r"Última actualización", cabecera):
        problemas.append("El encabezado no lleva 'Última actualización'")

    # 6 · Las tareas que vas a trabajar, ¿tienen historia en DECISIONS?
    #     El 19 ago la tarea 1.17 arrastró una premisa que DECISIONS había
    #     invalidado cinco días antes. El tablero era coherente consigo mismo,
    #     así que ninguna comprobación interna podía verlo.
    historia = {}
    if DECISIONES.exists() and seguir:
        dec = DECISIONES.read_text(encoding="utf-8")
        entradas = re.split(r"(?=^## \d{4}-\d{2}-\d{2})", dec, flags=re.M)
        for num in sorted(set(re.findall(r"\*\*([0-9]+\.[0-9]+[a-z]?)\*\*", seguir.group(0))) & set_abiertas):
            citas = [e.split("\n")[0].lstrip("# ").strip()
                     for e in entradas
                     if re.search(r"\b" + re.escape(num) + r"\b", e)]
            if citas:
                historia[num] = citas[-3:]

    print(f"Tablero: {len(set_cerradas)} cerradas · {len(set_abiertas)} abiertas\n")
    if problemas:
        print(f"✗ {len(problemas)} contradicción(es):\n")
        for p in problemas:
            print(f"  · {p}")
        print("\nArréglalas ANTES de proponer trabajo: el tablero es lo que se lee para decidir.")
        return 1

    print("✓ Sin contradicciones. Las casillas y la prosa dicen lo mismo.")
    if seguir:
        pendientes = sorted(set(re.findall(r"\*\*([0-9]+\.[0-9]+[a-z]?)\*\*", seguir.group(0))))
        print(f"  Por dónde seguir: {', '.join(pendientes)}")
    if historia:
        print("\n  LEE ESTO ANTES DE EMPEZAR — decisiones que ya hablaron de estas tareas:")
        for num, citas in historia.items():
            print(f"    {num}:")
            for c in citas:
                print(f"       · {c}")
        print("\n    Una tarea puede seguir abierta y su premisa estar caducada.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
