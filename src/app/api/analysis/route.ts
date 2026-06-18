import { NextRequest, NextResponse } from 'next/server';
import { runAnalysis } from '@/lib/iva/data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = '', country = 'all', niche = 'all', group = 'all', status = 'all' } = body;
    const result = runAnalysis(query, country, niche, group, status);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
