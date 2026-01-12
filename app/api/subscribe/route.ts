import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, linkedin, jobTitle, company } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const API_KEY = process.env.CONVERTKIT_API_KEY;
    const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;
    
    // Tag ID from your URL (likely "Community Members" or the new tag you created)
    const TAG_ID = "14338360"; 

    const API_URL = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
        first_name: firstName,
        
        // This applies the tag to the new subscriber
        tags: [TAG_ID], 

        // Mapping website inputs to your specific ConvertKit Custom Fields
        fields: {
          last_name: lastName,
          phone_number: phone,
          linkedin_url: linkedin,          // Maps to "LinkedIn URL"
          current_role_business: jobTitle, // Maps "Job Title" to "Current Role / Business"
          company_name: company            // Maps "Company" to "Company Name"
        }
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("ConvertKit API Error:", data); // Log error for debugging
      return NextResponse.json({ error: data.message || 'API Error' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}