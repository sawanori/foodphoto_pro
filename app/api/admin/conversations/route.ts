import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    },
    global: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(limit);

    if (filter === 'active') {
      query = query.in('status', ['new', 'active']);
    } else if (filter === 'closed') {
      query = query.eq('status', 'closed');
    }
    // filter === 'all' means no filter

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch conversations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversations: data || [] });
  } catch (error) {
    console.error('Conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
