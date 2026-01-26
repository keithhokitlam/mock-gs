# Supabase & Resend Setup Guide

## Step 1: Create Supabase Account & Project

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Click "Start your project" or "Sign up"

2. **Create Account:**
   - Sign up with your email or use GitHub/Google
   - Verify your email if needed

3. **Create New Project:**
   - Click "New Project"
   - Fill in:
     - **Name:** `grocery-share`
     - **Database Password:** Create a strong password (save it somewhere safe!)
     - **Region:** Choose closest to you (e.g., "US East" or "US West")
   - Click "Create new project"
   - Wait 2-3 minutes for setup to complete

4. **Get API Keys:**
   - In your project dashboard, click **Settings** (gear icon in left sidebar)
   - Click **API** in the settings menu
   - You'll see:
     - **Project URL** - Copy this (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key - Copy this (starts with `eyJ...`)
     - **service_role secret** key - Copy this (starts with `eyJ...`) - **KEEP THIS SECRET!**

5. **Create Users Table:**
   - In Supabase dashboard, click **Table Editor** in left sidebar
   - Click **New Table**
   - **Name:** `users`
   - Click **Add Column** for each:
     - `id`: Type: `uuid`, Primary key: Yes, Default value: `gen_random_uuid()`
     - `email`: Type: `text`, Unique: Yes, Nullable: No
     - `password_hash`: Type: `text`, Nullable: No
     - `email_verified`: Type: `bool`, Default value: `false`
     - `verification_token`: Type: `text`, Nullable: Yes
     - `reset_token`: Type: `text`, Nullable: Yes
     - `reset_token_expires`: Type: `timestamptz`, Nullable: Yes
     - `created_at`: Type: `timestamptz`, Default value: `now()`
     - `updated_at`: Type: `timestamptz`, Default value: `now()`
   - Click **Save**

---

## Step 2: Setup Resend Account

1. **Go to Resend:**
   - Visit: https://resend.com
   - Click "Get Started" or "Sign up"

2. **Create Account:**
   - Sign up with your email
   - Verify your email if needed

3. **Get API Key:**
   - In Resend dashboard, click **API Keys** in left sidebar
   - Click **Create API Key**
   - **Name:** `GroceryShare`
   - **Permission:** Full Access (or just Sending access)
   - Click **Add**
   - **Copy the API key** (starts with `re_...`) - You won't see it again!

4. **Domain Setup (For Production):**
   - Go to **Domains** in Resend dashboard
   - Click **Add Domain**
   - Enter: `grocery-share.com`
   - Follow instructions to add DNS records to GoDaddy
   - Wait for verification (can take a few hours)
   - **For testing:** You can use Resend's test domain without verification

---

## Step 3: Add Environment Variables

1. **Create `.env.local` file:**
   - In your project root: `/Users/keithlam/Documents/grocery-share.com/`
   - Create a new file named `.env.local`

2. **Add these lines (replace with your actual values):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   RESEND_API_KEY=your_resend_api_key_here
   NEXT_PUBLIC_APP_URL=https://grocery-share.com
   ```

3. **Replace the values:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service_role secret key
   - `RESEND_API_KEY`: Your Resend API key
   - `NEXT_PUBLIC_APP_URL`: Your website URL (use `http://localhost:3000` for local testing)

4. **Save the file**

**Important:** The `.env.local` file is already in `.gitignore`, so it won't be committed to GitHub. This keeps your keys safe!

---

## Step 4: Install Packages

Run these commands in Terminal:

```bash
cd "/Users/keithlam/Documents/grocery-share.com"
npm install @supabase/supabase-js resend bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## Next Steps

After completing these setup steps, the code implementation will handle the rest:
- API routes for authentication
- UI components for sign up and password reset
- Email templates
- Session management
