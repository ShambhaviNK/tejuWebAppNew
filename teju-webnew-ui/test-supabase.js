// Test script to verify Supabase connection
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Environment Variables:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (supabaseAnonKey) {
  console.log('Key length:', supabaseAnonKey.length, 'characters');
  console.log('Key starts with eyJ:', supabaseAnonKey.startsWith('eyJ') ? '✅ Yes' : '❌ No');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing environment variables. Please check your .env.local file.');
  process.exit(1);
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.log('\n❌ Invalid URL format. Should be: https://your-project-id.supabase.co');
  process.exit(1);
}

// Validate key format
if (!supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.length < 100) {
  console.log('\n❌ Invalid key format. Key appears to be truncated or invalid.');
  console.log('Please copy the complete anon key from your Supabase dashboard.');
  process.exit(1);
}

console.log('\n✅ Environment variables look good!');

// Test connection
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Connection successful! (Table might be empty)');
      } else if (error.message.includes('relation "users" does not exist')) {
        console.log('❌ Table "users" does not exist in your database.');
        console.log('Please create the users table following the setup guide.');
      } else {
        console.log('❌ Database error:', error.message);
        console.log('Error code:', error.code);
      }
    } else {
      console.log('✅ Connection successful!');
    }
    
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
}

testConnection(); 