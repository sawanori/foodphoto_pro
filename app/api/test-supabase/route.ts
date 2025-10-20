import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      hasApiKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      useMock: process.env.NEXT_PUBLIC_USE_MOCK === 'true'
    };

    // Test 1: Check conversations table
    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .limit(1);

      if (convError) {
        results.conversations = { error: convError.message, code: convError.code };
      } else {
        results.conversations = {
          exists: true,
          count: conversations?.length || 0,
          message: 'Table accessible'
        };
      }
    } catch (error) {
      results.conversations = { error: String(error) };
    }

    // Test 2: Check messages table
    try {
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (msgError) {
        results.messages = { error: msgError.message, code: msgError.code };
      } else {
        results.messages = {
          exists: true,
          count: messages?.length || 0,
          message: 'Table accessible'
        };
      }
    } catch (error) {
      results.messages = { error: String(error) };
    }

    // Test 3: Check profiles table
    try {
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('user_id')
        .limit(1);

      if (profError) {
        results.profiles = { error: profError.message, code: profError.code };
      } else {
        results.profiles = {
          exists: true,
          count: profiles?.length || 0,
          message: 'Table accessible'
        };
      }
    } catch (error) {
      results.profiles = { error: String(error) };
    }

    // Test 4: Check admin_users table
    try {
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, is_active')
        .limit(5);

      if (adminError) {
        results.admin_users = { error: adminError.message, code: adminError.code };
      } else {
        results.admin_users = {
          exists: true,
          count: adminUsers?.length || 0,
          users: adminUsers?.map(u => ({ email: u.email, is_active: u.is_active })) || [],
          message: 'Table accessible'
        };
      }
    } catch (error) {
      results.admin_users = { error: String(error) };
    }

    // Test 5: Check admin_sessions table
    try {
      const { data: sessions, error: sessError } = await supabase
        .from('admin_sessions')
        .select('id')
        .limit(1);

      if (sessError) {
        results.admin_sessions = { error: sessError.message, code: sessError.code };
      } else {
        results.admin_sessions = {
          exists: true,
          count: sessions?.length || 0,
          message: 'Table accessible'
        };
      }
    } catch (error) {
      results.admin_sessions = { error: String(error) };
    }

    // Overall status
    const hasErrors = [
      results.conversations,
      results.messages,
      results.profiles,
      results.admin_users,
      results.admin_sessions
    ].some((r: any) => r?.error);

    results.status = hasErrors ? 'ERRORS_DETECTED' : 'ALL_TABLES_OK';

    return NextResponse.json(results, {
      status: hasErrors ? 500 : 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Test failed',
        message: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
