import { NextRequest, NextResponse } from 'next/server';
import { updateUserByAdmin } from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateUserByAdmin(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
