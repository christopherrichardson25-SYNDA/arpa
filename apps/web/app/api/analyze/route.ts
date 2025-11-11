import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from './prompt'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Une URLs correctamente, evitando dobles o faltas de "/"
 */
function joinUrl(base: string, suffix: string) {
  return `${base.replace(/\/+$/, '')}/${suffix.replace(/^\/+/, '')}`
}

/**
 * Endpoint principal de análisis ARPA
 * Evalúa un post (texto + métricas) usando Syndabrain.
 */
export async function POST(req: NextRequest) {
  const { post, metrics = null, goals = null } = await req.json().catch(() => ({}))

  if (!post || typeof post !== 'string') {
    return NextResponse.json(
      { error: 'Falta el campo "post" (string) en el body).' },
      { status: 400 },
    )
  }

  // 🧠 Cargar knowledge base (marca + playbooks genéricos)
  const kbase = path.join(process.cwd(), 'apps/web/knowledge')
  const brand = await fs.readFile(path.join(kbase, 'brand.md'), 'utf-8').catch(() => '')
  const playbooks = await fs.readFile(path.join(kbase, 'playbooks.md'), 'utf-8').catch(() => '')

  // 🧩 Construir el prompt que se enviará al Syndabrain
  const prompt = buildPrompt({ post, metrics, goals, brand, playbooks })

  // ⚙️ Variables de entorno (compatibles con monorepo y entorno local)
  const baseUrl =
    process.env.SYNDABRAIN_API_URL ||
    process.env.NEXT_PUBLIC_SYNDABRAIN_API_URL ||
    ''

  if (!baseUrl) {
    console.error('⚠️ SYNDABRAIN_API_URL no detectada en entorno.')
    return NextResponse.json(
      { error: 'SYNDABRAIN_API_URL no está disponible en entorno.' },
      { status: 500 },
    )
  }

  // 🧭 Ruta al endpoint de Syndabrain
  const url = joinUrl(baseUrl, 'v1/complete')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.SYNDABRAIN_API_KEY) {
    headers.Authorization = `Bearer ${process.env.SYNDABRAIN_API_KEY}`
  }

  // 🚀 Llamada al Syndabrain
  let r: Response
  try {
    r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: process.env.SYNDABRAIN_MODEL || 'gpt-5-synda',
        input: prompt,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (err: any) {
    console.error('❌ Error conectando con Syndabrain:', err)
    return NextResponse.json(
      { error: 'No se pudo conectar con Syndabrain (revisa la URL o red).' },
      { status: 502 },
    )
  }

  // 🧱 Manejo de errores HTTP
  if (!r.ok) {
    const txt = await r.text().catch(() => '')
    return NextResponse.json(
      { error: `Syndabrain error ${r.status}: ${txt}` },
      { status: 500 },
    )
  }

  // ✅ Devolver el resultado JSON
  const data = await r.json().catch(() => null)
  return NextResponse.json({ result: data })
}
