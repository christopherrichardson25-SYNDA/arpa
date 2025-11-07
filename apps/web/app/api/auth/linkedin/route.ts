// Redirige al login OAuth de LinkedIn
export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID!
  const redirect = process.env.LINKEDIN_REDIRECT_URI!
  // Scopes mínimos: ajusta según lo que te apruebe LinkedIn
  const scope = [
    "r_liteprofile",        // perfil básico
    "r_emailaddress",       // email
    "rw_organization_admin" // administrar/leer páginas (métricas)
  ].join(" ")

  const url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirect)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=synda_arpa_${Math.random().toString(36).slice(2)}`

  return Response.redirect(url, 302)
}
