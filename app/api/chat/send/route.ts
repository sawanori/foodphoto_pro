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

export async function POST(req: Request) {
  try {
    const { content, conversationId } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('chat_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify conversation belongs to this session
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('session_token', sessionToken)
        .single();

      conversation = data;
    }

    // Create conversation if not exists
    if (!conversation) {
      const { data: created } = await supabase
        .from('conversations')
        .insert({
          channel: 'web',
          status: 'new',
          session_token: sessionToken,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      conversation = created;
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to find or create conversation' },
        { status: 500 }
      );
    }

    // Insert message
    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      source: 'web',
      content: content.trim(),
      content_type: 'text/plain',
      delivered_to_line: false
    });

    if (msgError) {
      console.error('Failed to insert message:', msgError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation.id);

    return NextResponse.json({
      ok: true,
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
