
# Agente ARPA — Starter Kit (SYNDAtools)

Lanza un **Agente ARPA**: sugiere variantes de post, elige agentes aliados y horarios, y mide **RS** y **ρ**.

## Contenido
- `prompts/Agente_ARPA_Instrucciones.txt` → Pégalo en tu **GPT Personalizado**.
- `data/agents.sample.csv` → Lista de agentes.
- `data/campana.sample.csv` → Datos de campaña.
- `scripts/arpa_core.js` → Funciones JS: seleccionar agentes, UTM y cálculos RS/ρ.

## Uso rápido (sin código)
1. Crea un GPT y pega el prompt.
2. Sube los CSV al chat y pide: “3 variantes + 6–8 agentes + horarios + briefs + UTM”.
3. Tras el lanzamiento, sube métricas por agente para RS/ρ y ranking.

## En SYNDAtools
- Importa `agents.sample.csv` a tu DB.
- Usa `arpa_core.js` en tu backend para asignar agentes y generar links por agente.
- Conecta con el widget TRU-Social para ver RS/ρ.

## Métrica
- RS = (Sv% + Sh%) × R  (R=1 si no es video)
- ρ = Seguidores_ganados / Impresiones × 1000
- Armónico: RS≥1% y ρ≥3; Metaestable: 0.4–1%; Entrópico: <0.4%.
