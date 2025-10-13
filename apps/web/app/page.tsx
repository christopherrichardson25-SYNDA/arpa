
'use client'
import { useState } from 'react'
import { RS, rho } from '@synda/core'
type Row = { url?: string; imp: number; sv?: number; sh: number; seg?: number; watch?: number; dur?: number }
export default function Page(){
  const [rows, setRows] = useState<Row[]>([{ imp: 0, sv: 0, sh: 0, seg: 0, watch: 0, dur: 0 }])
  const [csvErr, setCsvErr] = useState<string>('')
  function addRow(){ setRows(r => [...r, { imp: 0, sv: 0, sh: 0, seg: 0, watch: 0, dur: 0 }]) }
  function update(i:number, k:keyof Row, v:any){ const copy=[...rows]; (copy[i] as any)[k]=(v===''?undefined:Number.isNaN(+v)?v:+v); setRows(copy) }
  async function onCSV(file: File){
    setCsvErr(''); const text = await file.text()
    const [head, ...lines] = text.split(/\r?\n/).filter(Boolean)
    const cols = head.split(',').map(s=>s.trim().toLowerCase()); const idx=(n:string)=>{const i=cols.indexOf(n); if(i<0) throw new Error('Falta columna '+n); return i}
    try{
      const get=(r:string[],n:string)=>{const i=idx(n); return r[i]||''}
      const next = lines.map(l=>{ const r=l.split(','); return { url:get(r,'url'), imp:+(get(r,'impresiones')||0), sv:+(get(r,'sv')||0), sh:+(get(r,'sh')||0), seg:+(get(r,'seguidores')||0), watch:+(get(r,'watch_s')||0), dur:+(get(r,'dur_s')||0) } as Row })
      setRows(next)
    }catch(e:any){ setCsvErr(e.message) }
  }
  const results = rows.map(r=>{ const rs = RS({imp:r.imp, sv:r.sv??null, sh:r.sh, watch:r.watch??null, dur:r.dur??null}); const rh = rho({imp:r.imp, seg:r.seg??null}); const tag = (rs>=0.01 && rh>=3)? 'Armónico' : (rs>=0.004 ? 'Metaestable' : 'Entrópico'); return { rs, rh, tag } })
  return <main>
    <section style={{border:'1px solid #e4e9f2',borderRadius:12,padding:16,margin:'16px 0'}}>
      <h3>Cargar CSV</h3>
      <p style={{fontSize:14,color:'#6d7b8a'}}>Columnas: <code>url,impresiones,sv,sh,seguidores,watch_s,dur_s</code></p>
      <input type="file" accept=".csv" onChange={e=> e.target.files && onCSV(e.target.files[0])} />
      {csvErr && <p style={{color:'#c0392b'}}>{csvErr}</p>}
    </section>
    <section style={{border:'1px solid #e4e9f2',borderRadius:12,padding:16,margin:'16px 0'}}>
      <h3>Ingresar manualmente</h3>
      {rows.map((r,i)=>(
        <div key={i} style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,marginBottom:8}}>
          <input placeholder="URL" onChange={e=>update(i,'url',e.target.value)} />
          <input placeholder="Imp" type="number" onChange={e=>update(i,'imp',e.target.value)} />
          <input placeholder="Sv" type="number" onChange={e=>update(i,'sv',e.target.value)} />
          <input placeholder="Sh" type="number" onChange={e=>update(i,'sh',e.target.value)} />
          <input placeholder="Seg+" type="number" onChange={e=>update(i,'seg',e.target.value)} />
          <input placeholder="Watch s" type="number" onChange={e=>update(i,'watch',e.target.value)} />
          <input placeholder="Dur s" type="number" onChange={e=>update(i,'dur',e.target.value)} />
        </div>
      ))}
      <button onClick={addRow}>Agregar fila</button>
    </section>
    <section style={{border:'1px solid #e4e9f2',borderRadius:12,padding:16,margin:'16px 0'}}>
      <h3>Resultados</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th>URL</th><th>RS</th><th>ρ</th><th>Etiqueta</th></tr></thead>
        <tbody>{rows.map((r,i)=>{ const {rs, rh, tag} = results[i]; return <tr key={i}><td style={{borderTop:'1px solid #eef2f7',padding:'6px 8px'}}>{r.url||''}</td><td style={{borderTop:'1px solid #eef2f7',padding:'6px 8px'}}>{(rs*100).toFixed(2)}%</td><td style={{borderTop:'1px solid #eef2f7',padding:'6px 8px'}}>{rh.toFixed(2)}</td><td style={{borderTop:'1px solid #eef2f7',padding:'6px 8px'}}>{tag}</td></tr> })}</tbody>
      </table>
    </section>
  </main>
}
