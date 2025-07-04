# Quick Setup Guide - Fix Database Error

## 🚨 Issue: "Database error occurred"

The error occurs because the `users` table doesn't exist in your Supabase database. Here's how to fix it:

## ✅ Step 1: Access Your Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (`ugcefuqodhczyblckcbm`)

## ✅ Step 2: Create the Users Table

### Option A: Using SQL Editor (Recommended)

1. **Open SQL Editor**: Click "SQL Editor" in the left sidebar
2. **Create New Query**: Click "New Query"
3. **Copy and Paste**: Copy the entire contents of `setup-database.sql`
4. **Run Query**: Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)

### Option B: Using Table Editor

1. **Open Table Editor**: Click "Table Editor" in the left sidebar
2. **Create New Table**: Click "New Table"
3. **Table Name**: `users`
4. **Enable RLS**: ✅ Check "Enable Row Level Security"
5. **Add Columns**:

   | Column Name | Type | Default Value | Primary Key | Unique | Nullable |
   |-------------|------|---------------|-------------|--------|----------|
   | id | uuid | gen_random_uuid() | ✅ | ❌ | ❌ |
   | name | text | - | ❌ | ❌ | ❌ |
   | email | text | - | ❌ | ✅ | ❌ |
   | password | text | - | ❌ | ❌ | ❌ |
   | created_at | timestamptz | now() | ❌ | ❌ | ❌ |
   | updated_at | timestamptz | now() | ❌ | ❌ | ❌ |

6. **Save Table**: Click "Save"

## ✅ Step 3: Verify the Setup

1. **Check Table**: Go to "Table Editor" → "users" table
2. **Run Test**: In your terminal, run:
   ```bash
   node test-supabase.js
   ```
3. **Expected Output**: Should show "✅ Connection successful!"

## ✅ Step 4: Test Your Application

1. **Start Server**: `npm run dev`
2. **Go to Auth Page**: Navigate to `/auth`
3. **Create Account**: Try signing up with a new account
4. **Check Database**: Verify the user appears in your Supabase dashboard

## 🔧 Troubleshooting

### If you still get errors:

1. **Check Table Exists**:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'users';
   ```

2. **Check Table Structure**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

3. **Reset Table** (if needed):
   ```sql
   DROP TABLE IF EXISTS users CASCADE;
   -- Then run the setup script again
   ```

### Common Issues:

- **Permission Denied**: Make sure you're using the correct API keys
- **Table Already Exists**: The script uses `CREATE TABLE IF NOT EXISTS`
- **RLS Policy Issues**: The script creates a permissive policy for testing

## 🎉 Success!

Once you see "✅ Connection successful!" in the test script, your database is ready and the "Database error occurred" issue should be resolved!

---

**Need More Help?**
- Check the full [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Review the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Check Supabase logs in the dashboard 