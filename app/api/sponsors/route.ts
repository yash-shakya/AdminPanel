import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllSponsors, 
  createSponsor, 
  updateSponsor, 
  deleteSponsor,
  // getSponsorsByCategory // Commented out as it's not defined in actions
} from '@/app/actions/sponsors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (category) {
      // const sponsors = await getSponsorsByCategory(category); // Needs implementation in actions
      // return NextResponse.json(sponsors, { status: 200 });
      return NextResponse.json(
        { error: 'Fetching sponsors by category is not implemented yet. Implement getSponsorsByCategory in actions.' },
        { status: 501 } // 501 Not Implemented
      );
    } else {
      const sponsors = await getAllSponsors();
      return NextResponse.json(sponsors, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Create sponsor object from form data
    const sponsor = {
      category: formData.get('category') as string,
      alt: formData.get('alt') as string,
      name: formData.get('name') as string,
      targetUrl: formData.get('targetUrl') as string,
      image: formData.get('image') as File | null,
    };
    
    if (!sponsor.category || !sponsor.name) {
      return NextResponse.json(
        { error: 'Category and name are required' },
        { status: 400 }
      );
    }
    
    const result = await createSponsor(sponsor);
    
    if (typeof result === 'object' && 'err_desc' in result) {
      return NextResponse.json(
        { error: result.err_desc },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { id: result, message: 'Sponsor created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create sponsor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const currentCategory = formData.get('currentCategory') as string;
    
    if (!id || !currentCategory) {
      return NextResponse.json(
        { error: 'Sponsor ID and current category are required' },
        { status: 400 }
      );
    }
    
    // Build updated data object
    const updatedData: any = {};
    
    if (formData.has('category')) updatedData.category = formData.get('category') as string;
    if (formData.has('alt')) updatedData.alt = formData.get('alt') as string;
    if (formData.has('name')) updatedData.name = formData.get('name') as string;
    if (formData.has('targetUrl')) updatedData.targetUrl = formData.get('targetUrl') as string;
    if (formData.has('image')) updatedData.image = formData.get('image') as File;
    
    const result = await updateSponsor(id, currentCategory, updatedData);
    
    return NextResponse.json(
      { success: result, message: 'Sponsor updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update sponsor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    if (!id || !category) {
      return NextResponse.json(
        { error: 'Sponsor ID and category are required' },
        { status: 400 }
      );
    }
    
    const result = await deleteSponsor(category, id); // Swapped id and category to match action
    
    return NextResponse.json(
      { success: result, message: 'Sponsor deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete sponsor' },
      { status: 500 }
    );
  }
}
