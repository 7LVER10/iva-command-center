import { NextResponse } from 'next/server';
import { getAnalysisLogs } from '@/lib/iva/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const logs = getAnalysisLogs();
  return NextResponse.json(logs);
}
