function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export async function POST(req: NextRequest){
  const { post, metrics=null, goals=null } = await req.json()
  const brand = await fs.readFile(process.cwd()+"/knowledge/brand.md","utf-8").catch(()=> "")
  const play  = await fs.readFile(process.cwd()+"/knowledge/playbooks.md","utf-8").catch(()=> "")

  const prompt = buildPrompt({ post, metrics, goals, brand, playbooks: play })

  // Si tu brain ya responde en la raíz, usa 'complete'.
  // Si expone /v1/complete, igual queda ok con joinUrl.
  const url = joinUrl(process.env.SYNDABRAIN_API_URL!, "v1/complete")

  const headers: Record<string,string> = { "Content-Type": "application/json" }
  if (process.env.SYNDABRAIN_API_KEY) {
    headers.Authorization = `Bearer ${process.env.SYNDABRAIN_API_KEY}`
  }

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: process.env.SYNDABRAIN_MODEL || 'gpt-5-synda',
      input: prompt,
      response_format: { type: 'json_object' }
    })
  })

  if(!r.ok){
    const txt = await r.text()
    return NextResponse.json({ error: `Syndabrain error ${r.status}: ${txt}` }, { status: 500 })
  }
  const data = await r.json()
  return NextResponse.json({ result: data })
}
