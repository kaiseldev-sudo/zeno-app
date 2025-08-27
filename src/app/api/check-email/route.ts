import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Checking email existence for:', email);

    // Create a Supabase client with the anon key
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to sign in with a dummy password to check if user exists
    // This is a common pattern to check user existence without revealing if password is correct
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-checking-existence'
    });

    console.log('Auth error:', error?.message);

    // If we get "Invalid login credentials", the user exists but password is wrong
    // If we get "User not found" or similar, the user doesn't exist
    if (error) {
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('Invalid login')) {
        // User exists but password is wrong
        console.log('User exists (invalid credentials)');
        return NextResponse.json({ exists: true });
      } else if (error.message?.includes('User not found') || 
                 error.message?.includes('not found') ||
                 error.message?.includes('Email not confirmed')) {
        // User doesn't exist
        console.log('User does not exist');
        return NextResponse.json({ exists: false });
      } else {
        // Some other error, treat as user doesn't exist for security
        console.log('Other error, treating as user does not exist:', error.message);
        return NextResponse.json({ exists: false });
      }
    }

    // This shouldn't happen with a dummy password, but just in case
    console.log('No error returned, user exists');
    return NextResponse.json({ exists: true });
  } catch (error) {
    console.error('Error checking email existence:', error);
    return NextResponse.json(
      { error: 'Failed to verify email address' },
      { status: 500 }
    );
  }
}
