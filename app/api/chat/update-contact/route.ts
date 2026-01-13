import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notifyAdminViaLine } from '@/lib/line/adminNotify';

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
  });
}

export async function POST(req: Request) {
  try {
    const { conversationId, name, email } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
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
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('session_token', sessionToken)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Update contact information
    const updateData: any = {};
    if (name !== undefined) updateData.contact_name = name || null;
    if (email !== undefined) updateData.contact_email = email || null;

    const { error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId);

    if (error) {
      console.error('Failed to update contact:', error);
      return NextResponse.json(
        { error: 'Failed to update contact information' },
        { status: 500 }
      );
    }

    // Send LINE notification to admin about contact update
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodphoto-pro.com';
      const adminUrl = `${siteUrl}/admin/chat?conversationId=${conversationId}`;
      const contactInfo = [
        name && `名前: ${name}`,
        email && `メール: ${email}`
      ].filter(Boolean).join(', ');

      await notifyAdminViaLine({
        title: 'チャット連絡先情報登録',
        preview: contactInfo || '連絡先情報が更新されました',
        url: adminUrl
      });
    } catch (lineError) {
      console.error('LINE notification failed:', lineError);
      // Continue even if LINE notification fails
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
