import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from './prompt'
import fs from 'node:fs/promises'

export async function POST(req: NextRequest) {
  const { post, metrics, goals } = await req.json()

  const brand = await fs
    .readFile(process.cwd() + '/knowledge/brand.md', 'utf-8')
    .catch(() => '')
  const playbooks = await fs
    .readFile(process.cwd() + '/knowledge/playbooks.md', 'utf-8')
    .catch(() => '')

  const prompt = buildPrompt({ post, metrics, goals, brand, playbooks })

  const r = await fetch(process.env.SYNDABRAIN_API_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SYNDABRAIN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.SYNDABRAIN_MODEL || 'gpt-5-synda',
      input: prompt,
      response_format: { type: 'json_object' },
    }),
  })

  if (!r.ok) {
    const err = await r.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const data = await r.json()
  return NextResponse.json({ result: data })
}
