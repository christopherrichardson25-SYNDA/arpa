export const buildPrompt = ({
  post, metrics, goals, brand, playbooks
}: {
  post: string; metrics?: any; goals?: any; brand: string; playbooks: string;
}) => `
Eres ARPA (Syndaverse). Evalúas resonancia de posts LinkedIn.

CONOCIMIENTO DE MARCA
${brand}

PLAYBOOKS
${playbooks}

POST
${post}

MÉTRICAS
${JSON.stringify(metrics || {})}

OBJETIVOS
${JSON.stringify(goals || {})}

TAREAS
1) Diagnóstico: Armónico / Metaestable / Entrópico (usa RS y ρ si están, o explica limitaciones).
2) 3 variantes (Hook + 3 líneas + CTA “Guárdalo / Compártelo”).
3) Mejoras concretas: tono, formato, ritmo; hora sugerida.
4) Riesgos (coherencia, privacidad, saturación).
Devuelve JSON: {diagnostico, motivo, variantes, mejoras, horarios, riesgos}
`

