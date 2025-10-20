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
    }
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Check admin_users table with service role key
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, email, name, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch admin users:', error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: adminUsers?.length || 0,
      users: adminUsers || [],
      message: adminUsers && adminUsers.length > 0
        ? '管理者ユーザーが正常に作成されました'
        : '管理者ユーザーが見つかりません'
    });
  } catch (error) {
    console.error('Test admin error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
