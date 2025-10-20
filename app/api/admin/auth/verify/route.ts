import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify session
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select('*, admin_users!inner(*)')
      .eq('token', sessionToken)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      // Clear invalid cookie
      cookieStore.delete('admin_session');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.admin_users.email
      }
    });
  } catch (error) {
    console.error('Verify auth error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
