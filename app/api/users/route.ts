import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserEvents, 
  updateUserEvent, 
  unregisterUserEvent,
  addQuery
} from '@/app/actions/users';

export async function GET(request: NextRequest) {
  try {
    const events = await getUserEvents();
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user events' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    const body = await request.json();
    
    if (!body.eventName || !body.eventCategory) {
      return NextResponse.json(
        { error: 'Event name and category are required' },
        { status: 400 }
      );
    }
    
    if (action === 'unregister') {
      const result = await unregisterUserEvent(body);
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await updateUserEvent(body);
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user event' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.email || !body.query) {
      return NextResponse.json(
        { error: 'Name, email, and query are required' },
        { status: 400 }
      );
    }
    
    const result = await addQuery(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add query' },
      { status: 500 }
    );
  }
}
