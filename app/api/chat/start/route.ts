import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Create Supabase client with service role key for server-side operations
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

export async function POST() {
  try {
    const cookieStore = await cookies();
    let sessionToken = cookieStore.get('chat_session')?.value;
    let setCookie = false;

    // Generate new session token if not exists
    if (!sessionToken) {
      sessionToken = randomUUID();
      setCookie = true;
    }

    const supabase = getSupabaseAdmin();

    // Check if conversation already exists for this session
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('session_token', sessionToken)
      .in('status', ['new', 'active'])
      .single();

    if (existing) {
      const res = NextResponse.json({ conversationId: existing.id });
      if (setCookie && sessionToken) {
        res.cookies.set('chat_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return res;
    }

    // Create new conversation
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({
        channel: 'web',
        status: 'new',
        session_token: sessionToken,
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create conversation:', error);
      return NextResponse.json(
        { error: 'Failed to start conversation' },
        { status: 500 }
      );
    }

    // Add welcome message
    await supabase.from('messages').insert({
      conversation_id: created.id,
      role: 'system',
      source: 'web',
      content: 'こんにちは！飲食店撮影PhotoStudioへようこそ。お気軽にご質問ください。',
      content_type: 'text/plain',
      delivered_to_line: false
    });

    const res = NextResponse.json({ conversationId: created.id });
    if (setCookie && sessionToken) {
      res.cookies.set('chat_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  } catch (error) {
    console.error('Start chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
