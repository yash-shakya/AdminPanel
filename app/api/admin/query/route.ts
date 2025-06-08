import { NextRequest, NextResponse } from 'next/server';
import { deleteQuery } from '@/app/actions/admin';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await deleteQuery(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete query' },
      { status: 500 }
    );
  }
}
