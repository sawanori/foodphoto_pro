import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

import { notifyAdminViaLine } from '@/lib/line/adminNotify';

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

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify conversation exists
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
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

    // Send LINE notification to admin
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodphoto-pro.com';
      const adminUrl = `${siteUrl}/admin/chat?conversationId=${conversation.id}`;

      await notifyAdminViaLine({
        title: '新しいチャットメッセージ',
        preview: content.trim().slice(0, 100),
        url: adminUrl
      });
    } catch (lineError) {
      console.error('LINE notification failed:', lineError);
      // Continue even if LINE notification fails
    }

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
