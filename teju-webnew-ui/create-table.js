// Script to create the users table in Supabase
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTable() {
  try {
    console.log('🏗️ Creating users table...');
    
    // SQL to create the table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    // Enable RLS
    const enableRLSSQL = `
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    `;
    
    // Create policy
    const createPolicySQL = `
      CREATE POLICY "Allow all operations" ON users
      FOR ALL USING (true);
    `;
    
    // Create trigger function
    const createTriggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    
    // Create trigger
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `;
    
    console.log('📝 Executing SQL statements...');
    
    // Execute SQL statements using rpc (if available) or direct SQL
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (tableError) {
      console.log('⚠️ Could not create table via RPC, you need to create it manually');
      console.log('Please follow the instructions in QUICK_SETUP.md');
      console.log('Or run the SQL in setup-database.sql in your Supabase SQL Editor');
      return;
    }
    
    console.log('✅ Table created successfully!');
    
    // Test the table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Table test failed:', error.message);
    } else {
      console.log('✅ Table test successful!');
      console.log('🎉 Your database is ready!');
    }
    
  } catch (error) {
    console.log('❌ Error creating table:', error.message);
    console.log('Please create the table manually using the Supabase dashboard');
  }
}

createTable(); 