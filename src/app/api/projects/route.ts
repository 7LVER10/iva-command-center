import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/iva/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, niche, grp, relevance, priority, status, summary_en, summary_ru, summary_de, summary_tr } = body;

    if (!name || !country || !niche || !grp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = createProject({
      name, country, niche, grp,
      relevance: relevance ?? 0.5,
      priority: priority || 'medium',
      status: status || 'active',
      summary_en, summary_ru, summary_de, summary_tr,
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
