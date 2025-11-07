// Ejemplo de llamada autenticada (pegar tu token manualmente para probar)
export async function GET() {
  const token = process.env.LINKEDIN_TEST_TOKEN // opcional, solo pruebas
  if (!token) return new Response("Define LINKEDIN_TEST_TOKEN en .env.local para probar", { status: 400 })

  const r = await fetch("https://api.linkedin.com/v2/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await r.json().catch(()=> ({}))
  return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json" } })
}
