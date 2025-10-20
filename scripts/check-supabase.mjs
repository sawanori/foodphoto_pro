import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function checkTables() {
  console.log('🔍 Checking Supabase connection and tables...\n');

  try {
    // Check conversations table
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);

    if (convError) {
      console.error('❌ conversations table error:', convError.message);
      console.log('\n⚠️  The conversations table does not exist or is not accessible.');
      console.log('Please apply migrations to Supabase.\n');
      return false;
    }

    console.log('✅ conversations table exists');

    // Check messages table
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (msgError) {
      console.error('❌ messages table error:', msgError.message);
      return false;
    }

    console.log('✅ messages table exists');

    // Check profiles table
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profError) {
      console.error('❌ profiles table error:', profError.message);
      return false;
    }

    console.log('✅ profiles table exists');

    // Count existing conversations
    const { count: convCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Existing conversations: ${convCount || 0}`);

    // Count existing messages
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Existing messages: ${msgCount || 0}`);

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

checkTables().then((success) => {
  if (success) {
    console.log('\n✅ Supabase is properly configured!');
    process.exit(0);
  } else {
    console.log('\n❌ Supabase configuration incomplete.');
    console.log('\nTo fix this, apply the migrations:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Run the SQL from: supabase/migrations/001_create_chat_tables.sql');
    console.log('3. Run the SQL from: supabase/migrations/002_create_admin_tables.sql');
    process.exit(1);
  }
});
