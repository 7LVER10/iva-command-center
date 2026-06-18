import { NextRequest, NextResponse } from 'next/server';
import { updateProjectStatus, updateProject, deleteProject } from '@/lib/iva/data';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const projectId = parseInt(id, 10);

  if (body.status) {
    updateProjectStatus(projectId, body.status);
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const projectId = parseInt(id, 10);
    updateProject(projectId, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  deleteProject(projectId);
  return NextResponse.json({ ok: true });
}
