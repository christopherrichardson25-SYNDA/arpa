import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from './prompt'
import fs from 'node:fs/promises'

export async function POST(req: NextRequest){
  const { post, metrics=null, goals=null } = await req.json()

  // Carga knowledge local
  const brand = await fs.readFile(process.cwd()+"/knowledge/brand.md","utf-8").catch(()=> "")
  const play  = await fs.readFile(process.cwd()+"/knowledge/playbooks.md","utf-8").catch(()=> "")

  const prompt = buildPrompt({ post, metrics, goals, brand, playbooks: play })

  const r = await fetch(process.env.SYNDABRAIN_API_URL!, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SYNDABRAIN_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.SYNDABRAIN_MODEL || 'gpt-5-synda',
      input: prompt,
      response_format: { type: 'json_object' }
    })
  })

  if(!r.ok){
    return NextResponse.json({ error: await r.text() }, { status: 500 })
  }
  const data = await r.json()
  return NextResponse.json({ result: data })
}
