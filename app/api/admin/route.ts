import { NextRequest, NextResponse } from 'next/server';
import { 
  addCategory,
  deleteQuery,
  sendMailToMultipleUsers,
  sendNotification,
  updateUser,
  updateUserByAdmin
} from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const body = await request.json();

    // Route to the appropriate function based on the request path
    if (path.endsWith('/category')) {
      const result = await addCategory(body);
      return NextResponse.json(result, { status: 201 });
    } 
    else if (path.endsWith('/mail')) {
      const result = await sendMailToMultipleUsers(body);
      return NextResponse.json(result, { status: 200 });
    }
    else if (path.endsWith('/notification')) {
      const result = await sendNotification(body);
      return NextResponse.json(result, { status: 200 });
    }
    else if (path.endsWith('/update-users')) {
      const result = await updateUser();
      return NextResponse.json(result, { status: 200 });
    }
    else if (path.endsWith('/update-user')) {
      const result = await updateUserByAdmin(body);
      return NextResponse.json(result, { status: 200 });
    }
    else {
      return NextResponse.json(
        { error: 'Invalid endpoint' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle the query deletion
    const result = await deleteQuery(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete query' },
      { status: 500 }
    );
  }
}
