
import { NextResponse } from 'next/server'
export async function GET(){
  return NextResponse.json({ items: [ { id: 'urn:li:ugcPost:123', text: 'Post ejemplo', createdAt: '2025-09-01T10:00:00Z' } ] })
}
