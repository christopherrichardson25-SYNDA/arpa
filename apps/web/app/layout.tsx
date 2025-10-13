
export const metadata = { title: "SyndaTools — ARPA", description: "ARPA (TRU‑Social) — cálculo RS y ρ" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="es"><body style={{fontFamily:'Inter,system-ui,Arial',maxWidth:920,margin:'0 auto',padding:'24px'}}>
    <h1 style={{marginBottom:8}}>SyndaTools — ARPA</h1>
    <p style={{color:'#5b6675'}}>Calcula RS y ρ de tus posts (LinkedIn). Subí un CSV o completá a mano.</p>
    {children}<footer style={{marginTop:24,color:'#6d7b8a'}}>© 2025 Synda — TRU‑Social</footer></body></html>)
}
