import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const result = await updateUser();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update users' },
      { status: 500 }
    );
  }
}
