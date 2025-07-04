# Supabase Setup Guide for Teju Web

This guide will walk you through setting up Supabase to store user account details in a database for your Teju Web application.

## 🚀 Step 1: Create a Supabase Account

1. **Visit Supabase**: Go to [https://supabase.com](https://supabase.com)
2. **Sign Up**: Create a new account or sign in with GitHub
3. **Create New Project**: Click "New Project"

## 🏗️ Step 2: Create a New Project

1. **Project Details**:
   - **Name**: `teju-web` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free tier

2. **Wait for Setup**: This may take 1-2 minutes

## 📊 Step 3: Create the Database Table

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Table Editor**: In your Supabase dashboard, click "Table Editor"
2. **Create New Table**: Click "New Table"
3. **Table Configuration**:
   ```
   Table Name: users
   Enable Row Level Security (RLS): ✅ Checked
   ```

4. **Add Columns**:
   ```
   Column Name: id
   Type: uuid
   Default Value: gen_random_uuid()
   Primary Key: ✅ Checked
   ```

   ```
   Column Name: name
   Type: text
   Is Nullable: ❌ Unchecked
   ```

   ```
   Column Name: email
   Type: text
   Is Nullable: ❌ Unchecked
   Unique: ✅ Checked
   ```

   ```
   Column Name: password
   Type: text
   Is Nullable: ❌ Unchecked
   ```

   ```
   Column Name: created_at
   Type: timestamptz
   Default Value: now()
   ```

   ```
   Column Name: updated_at
   Type: timestamptz
   Default Value: now()
   ```

5. **Save Table**: Click "Save"

### Option B: Using SQL Editor

1. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
2. **Create New Query**: Click "New Query"
3. **Run this SQL**:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now)
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔑 Step 4: Get Your API Keys

1. **Go to Settings**: In your Supabase dashboard, click "Settings" (gear icon)
2. **API Section**: Click "API" in the sidebar
3. **Copy Keys**: You'll need two values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## ⚙️ Step 5: Configure Environment Variables

1. **Create `.env.local`**: In your project root, create or update `.env.local`:

```env
# Existing OpenAI key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. **Replace Values**: 
   - Replace `your-project-id` with your actual project ID
   - Replace `your_anon_key_here` with your actual anon key

## 🔒 Step 6: Set Up Row Level Security (Optional but Recommended)

For better security, you can create more restrictive policies:

```sql
-- Drop the permissive policy
DROP POLICY "Allow all operations" ON users;

-- Create more restrictive policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

## 🧪 Step 7: Test the Setup

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Sign Up**: 
   - Go to `/auth`
   - Create a new account
   - Check your Supabase dashboard → Table Editor → users table

3. **Test Sign In**:
   - Sign out and sign back in
   - Verify the authentication works

## 📊 Step 8: Monitor Your Database

### View Data in Supabase Dashboard:
1. **Table Editor**: View all users
2. **Logs**: Monitor API calls and errors
3. **Authentication**: Track user sessions (if using Supabase Auth)

### Useful Queries:
```sql
-- View all users (without passwords)
SELECT id, name, email, created_at FROM users;

-- Count total users
SELECT COUNT(*) FROM users;

-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';
```

## 🚀 Step 9: Production Deployment

### For Vercel Deployment:
1. **Add Environment Variables**: In your Vercel dashboard, add the same environment variables
2. **Redeploy**: Your app will automatically use the database

### Environment Variables for Production:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Database error occurred"**:
   - Check your environment variables
   - Verify your Supabase URL and key
   - Check the Supabase dashboard for errors

2. **"User already exists"**:
   - Check the users table in Supabase
   - Verify email uniqueness constraint

3. **"Invalid email or password"**:
   - Check if the user exists in the database
   - Verify password hashing is working

### Debug Steps:
1. **Check Supabase Logs**: Dashboard → Logs
2. **Verify Table Structure**: Table Editor → users table
3. **Test API Directly**: Use Supabase's API testing tools

## 📈 Next Steps

### Optional Enhancements:
1. **Email Verification**: Add email confirmation
2. **Password Reset**: Implement password recovery
3. **User Profiles**: Add more user data fields
4. **Activity Logging**: Track user interactions
5. **Backup Strategy**: Set up database backups

### Security Considerations:
1. **Rate Limiting**: Implement API rate limiting
2. **Input Validation**: Add server-side validation
3. **HTTPS Only**: Ensure all connections use HTTPS
4. **Regular Updates**: Keep dependencies updated

## 🎉 Success!

Your Teju Web application now has a proper database backend with Supabase! Users can create accounts, sign in, and their data will be securely stored in the cloud.

---

**Need Help?**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Next.js Documentation](https://nextjs.org/docs) 