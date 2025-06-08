import { NextRequest, NextResponse } from 'next/server';
import { addCategory } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await addCategory(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add category' },
      { status: 500 }
    );
  }
}
