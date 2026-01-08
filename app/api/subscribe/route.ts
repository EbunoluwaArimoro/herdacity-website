import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Extract firstName and email
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const API_KEY = process.env.CONVERTKIT_API_KEY;
    const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;
    const API_URL = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        api_key: API_KEY,
        email: email,
        first_name: firstName, // Pass the name to ConvertKit
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json({ error: data.message || 'API Error' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}