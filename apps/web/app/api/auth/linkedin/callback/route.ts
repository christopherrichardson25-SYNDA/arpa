// Intercambia "code" por access_token y lo muestra (piloto)
// ⚠️ En producción: guarda el token en DB (cifrado) asociado a tu usuario/empresa.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const err  = searchParams.get("error")
  if (err) return new Response(`OAuth error: ${err}`, { status: 400 })
  if (!code) return new Response("missing code", { status: 400 })

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
  })

  const r = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  })

  const data = await r.json().catch(()=> ({}))
  if (!r.ok) return new Response(`Token error: ${JSON.stringify(data)}`, { status: 500 })

  // Devuelve el token para verificar que funciona (piloto)
  // En prod: redirige a tu app y guarda el token en servidor.
  return new Response(
    `✅ Autenticación OK.\naccess_token=${data.access_token}\nexpires_in=${data.expires_in}`,
    { status: 200, headers: { "Content-Type": "text/plain" } }
  )
}
