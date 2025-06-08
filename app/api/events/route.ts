import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEvents, 
  // getEventsByCategory, // Assuming you might want to add this back later if needed
  getEventByName, 
  createEvent, 
  updateEventByName, 
  deleteEvent 
} from '@/app/actions/events';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const eventName = searchParams.get('eventName');
    
    if (eventName && category) {
      const event = await getEventByName(category, eventName);
      return NextResponse.json(event, { status: 200 });
    } else if (category) {
      // Assuming getEventsByCategory is intended to be used, if not, this part might need adjustment
      // const events = await getEventsByCategory(category); 
      // return NextResponse.json(events, { status: 200 });
      // If getEventsByCategory is not available or not intended, adjust this part accordingly.
      // For now, I'll comment it out to avoid errors if it's not defined in actions.
      return NextResponse.json({ error: "Fetching all events for a category is not implemented yet" }, { status: 501 });
    } else {
      const events = await getAllEvents();
      return NextResponse.json(events, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Parse coordinators from form data (expected as JSON string)
    let coordinators: any[] = [];
    const coordinatorsJson = formData.get('coordinators');
    
    if (coordinatorsJson && typeof coordinatorsJson === 'string') {
      coordinators = JSON.parse(coordinatorsJson);
    }
    
    // Parse rules from form data (expected as JSON string)
    let rules: string[] = [];
    const rulesJson = formData.get('rules');
    
    if (rulesJson && typeof rulesJson === 'string') {
      rules = JSON.parse(rulesJson);
    }
    
    // Create event object from form data
    const eventData = {
      coordinators,
      description: formData.get('description') as string,
      document: formData.get('document') as string,
      endTime: Number(formData.get('endTime')),
      eventCategory: formData.get('eventCategory') as string,
      eventName: formData.get('eventName') as string,
      flagship: formData.get('flagship') === 'true',
      rules,
      startTime: Number(formData.get('startTime')),
      venue: formData.get('venue') as string,
      image: formData.get('image') as File,
    };
    
    if (!eventData.eventCategory || !eventData.eventName) {
      return NextResponse.json(
        { error: 'Event category and name are required' },
        { status: 400 }
      );
    }
    
    const result = await createEvent(eventData);
    
    return NextResponse.json(
      { id: result, message: 'Event created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const category = formData.get('category') as string;
    const eventName = formData.get('eventName') as string;
    
    if (!category || !eventName) {
      return NextResponse.json(
        { error: 'Event category and name are required' },
        { status: 400 }
      );
    }
    
    // Parse coordinators from form data (expected as JSON string)
    let coordinators: any[] = [];
    const coordinatorsJson = formData.get('coordinators');
    
    if (coordinatorsJson && typeof coordinatorsJson === 'string') {
      coordinators = JSON.parse(coordinatorsJson);
    }
    
    // Parse rules from form data (expected as JSON string)
    let rules: string[] = [];
    const rulesJson = formData.get('rules');
    
    if (rulesJson && typeof rulesJson === 'string') {
      rules = JSON.parse(rulesJson);
    }
    
    // Build updated data object
    const updatedData: any = {
      coordinators,
      description: formData.get('description') as string,
      document: formData.get('document') as string,
      endTime: Number(formData.get('endTime')),
      eventCategory: formData.get('eventCategory') as string,
      eventName: formData.get('eventName') as string,
      flagship: formData.get('flagship') === 'true',
      rules,
      startTime: Number(formData.get('startTime')),
      venue: formData.get('venue') as string,
    };
    
    // Include image if provided
    if (formData.has('image')) {
      updatedData.image = formData.get('image') as File;
    }
    
    const result = await updateEventByName(category, eventName, updatedData);
    
    return NextResponse.json(
      { success: result, message: 'Event updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const eventName = searchParams.get('eventName');
    
    if (!category || !eventName) {
      return NextResponse.json(
        { error: 'Event category and name are required' },
        { status: 400 }
      );
    }
    
    await deleteEvent(category, eventName);
    
    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
