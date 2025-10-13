
import { NextRequest, NextResponse } from 'next/server'
export async function GET(_req: NextRequest, { params }:{ params:{ id: string } }){
  const { id } = params
  return NextResponse.json({
    id, impressions: 12540, shares: 91, reactions: 417, comments: 28,
    saves: null, followers_gained: null, watch_s: 10, dur_s: 16
  })
}
