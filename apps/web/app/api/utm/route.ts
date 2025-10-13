
import { NextResponse } from 'next/server'
export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const base = searchParams.get('base') || ''
  const source = (searchParams.get('source') || '').replace(/\s+/g,'_')
  const campaign = searchParams.get('campaign') || 'arpa'
  const url = `${base}?utm_source=${encodeURIComponent(source)}&utm_medium=organic&utm_campaign=${encodeURIComponent(campaign)}`
  return NextResponse.json({ url })
}
