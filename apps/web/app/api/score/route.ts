
import { NextRequest, NextResponse } from 'next/server'
import { RS, rho } from '@synda/core'
export async function POST(req: NextRequest){
  const body = await req.json()
  const { imp, sv=null, sh, seg=null, watch=null, dur=null } = body || {}
  const rs = RS({ imp, sv, sh, watch, dur })
  const rh = rho({ imp, seg })
  const tag = (rs>=0.01 && rh>=3)? 'Armónico' : (rs>=0.004 ? 'Metaestable' : 'Entrópico')
  return NextResponse.json({ rs, rho: rh, etiqueta: tag })
}
