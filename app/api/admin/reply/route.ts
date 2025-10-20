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

export async function POST(req: Request) {
  try {
    const { conversationId, content } = await req.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      );
    }

    // For now, we'll use the service role key to insert messages
    // In production, you should verify the user's authentication
    const supabase = getSupabaseAdmin();

    // Insert the reply message
    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'agent',
      source: 'admin',
      content: content.trim(),
      content_type: 'text/plain',
      delivered_to_line: false,
      // In production, set created_by to the authenticated user's ID
      created_by: null,
    });

    if (msgError) {
      console.error('Failed to insert reply:', msgError);
      return NextResponse.json(
        { error: 'Failed to send reply' },
        { status: 500 }
      );
    }

    // Update conversation last_message_at and potentially assign to current user
    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        // In production, set assigned_to to the authenticated user's ID
      })
      .eq('id', conversationId);

    if (convError) {
      console.error('Failed to update conversation:', convError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
