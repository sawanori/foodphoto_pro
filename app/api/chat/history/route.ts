import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
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
    },
    global: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('chat_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ items: [], conversationId: null });
    }

    const supabase = getSupabaseAdmin();

    // Get the conversation for this session
    let query = supabase
      .from('conversations')
      .select('id')
      .eq('session_token', sessionToken);

    // If conversationId is provided, also filter by it
    if (conversationId) {
      query = query.eq('id', conversationId);
    }

    const { data: conversation } = await query.single();

    if (!conversation) {
      return NextResponse.json({ items: [], conversationId: null });
    }

    // Get messages for this conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, conversation_id, role, source, content, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      items: messages || [],
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
