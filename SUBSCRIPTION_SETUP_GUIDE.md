# Complete Step-by-Step Guide: Subscription Enablement Setup

This guide will walk you through setting up user sign up, email verification, and password reset for your GroceryShare website. Follow each step carefully.

---

## Part 1: Create Supabase Account (Database)

**What is Supabase?** It's a free database service that will store user accounts (emails, passwords, etc.).

### Step 1.1: Sign Up for Supabase

1. **Open your web browser** (Chrome, Safari, etc.)
2. **Go to:** https://supabase.com
3. **Click** the "Start your project" button (usually green, in the top right)
4. **Sign up:**
   - You can use your email, or sign up with GitHub/Google
   - If using email, check your inbox and click the verification link
5. **Log in** to Supabase

### Step 1.2: Create a New Project

1. Once logged in, you'll see a dashboard
2. **Click** "New Project" (usually a button in the top right or center)
3. **Fill in the form:**
   - **Name:** Type `grocery-share` (or any name you like)
   - **Database Password:** 
     - Create a strong password (mix of letters, numbers, symbols)
     - **IMPORTANT:** Write this down somewhere safe! You'll need it later
     - Example: `MySecurePass123!@#`
   - **Region:** Choose the one closest to you (e.g., "US East" if you're in the US)
4. **Click** "Create new project"
5. **Wait 2-3 minutes** - Supabase is setting up your database (you'll see a progress bar)

### Step 1.3: Get Your API Keys

1. After your project is ready, you'll see your project dashboard
2. **Click** the **Settings** icon (looks like a gear ⚙️) in the left sidebar
3. **Click** "API" in the settings menu
4. You'll see several keys. **Copy these three things:**
   - **Project URL** - Looks like: `https://xxxxx.supabase.co`
     - Click the copy icon next to it, or select and copy (Cmd+C on Mac)
   - **anon public** key - A long string starting with `eyJ...`
     - Click the "eye" icon to reveal it, then copy
   - **service_role secret** key - Another long string starting with `eyJ...`
     - Click the "eye" icon to reveal it, then copy
     - **⚠️ KEEP THIS SECRET!** Don't share it publicly

5. **Save these somewhere safe** (Notes app, text file, etc.) - You'll need them in Part 3

### Step 1.4: Create the Users Table

1. In your Supabase dashboard, **click** "Table Editor" in the left sidebar
2. **Click** "New Table" button
3. **Table name:** Type `users` (all lowercase)
4. **Add columns one by one:**
   
   Click "Add Column" for each:
   
   **Column 1:**
   - Name: `id`
   - Type: Select "uuid"
   - Check "Is Primary Key"
   - Default value: Type `gen_random_uuid()`
   
   **Column 2:**
   - Name: `email`
   - Type: Select "text"
   - Check "Is Unique"
   - Uncheck "Is Nullable"
   
   **Column 3:**
   - Name: `password_hash`
   - Type: Select "text"
   - Uncheck "Is Nullable"
   
   **Column 4:**
   - Name: `email_verified`
   - Type: Select "bool" (boolean)
   - Default value: Type `false`
   
   **Column 5:**
   - Name: `verification_token`
   - Type: Select "text"
   - Leave "Is Nullable" checked (this is fine)
   
   **Column 6:**
   - Name: `reset_token`
   - Type: Select "text"
   - Leave "Is Nullable" checked
   
   **Column 7:**
   - Name: `reset_token_expires`
   - Type: Select "timestamptz"
   - Leave "Is Nullable" checked
   
   **Column 8:**
   - Name: `created_at`
   - Type: Select "timestamptz"
   - Default value: Type `now()`
   
   **Column 9:**
   - Name: `updated_at`
   - Type: Select "timestamptz"
   - Default value: Type `now()`

5. **Click** "Save" button at the bottom
6. You should see your `users` table with all the columns!

---

## Part 2: Create Resend Account (Email Service)

**What is Resend?** It's a service that sends emails (verification emails, password reset emails, etc.).

### Step 2.1: Sign Up for Resend

1. **Open your web browser**
2. **Go to:** https://resend.com
3. **Click** "Get Started" or "Sign up"
4. **Sign up** with your email
5. **Check your email** and click the verification link
6. **Log in** to Resend

### Step 2.2: Get Your API Key

1. Once logged in, you'll see the Resend dashboard
2. **Click** "API Keys" in the left sidebar
3. **Click** "Create API Key" button
4. **Fill in:**
   - **Name:** Type `GroceryShare`
   - **Permission:** Select "Full Access" (or "Sending" if available)
5. **Click** "Add" or "Create"
6. **Copy the API key** - It starts with `re_...`
   - **⚠️ IMPORTANT:** You can only see this once! Copy it immediately
   - Save it somewhere safe

### Step 2.3: Domain Setup (For Production - Optional for Now)

**For testing:** You can skip this and use Resend's test domain.

**For production (later):**
1. In Resend dashboard, click "Domains"
2. Click "Add Domain"
3. Enter: `grocery-share.com`
4. Follow the instructions to add DNS records to GoDaddy
5. Wait for verification (can take a few hours)

---

## Part 3: Add Environment Variables to Your Project

**What are environment variables?** They're secret keys stored in a file that your code uses, but they're not shared publicly.

### Step 3.1: Create the .env.local File

1. **Open your code editor** (Cursor/VS Code)
2. **In your project folder** (`grocery-share.com`), look for a file named `.env.local`
   - If it doesn't exist, create a new file
   - **Important:** The file name starts with a dot (`.env.local`)
3. **Open the file** in your editor

### Step 3.2: Add Your Keys

**Copy and paste this into the file, then replace the placeholder values:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace each value:**

1. **NEXT_PUBLIC_SUPABASE_URL:**
   - Replace `your_supabase_project_url_here` with your Supabase Project URL
   - Example: `https://abcdefghijklmnop.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   - Replace `your_anon_key_here` with your Supabase anon public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

3. **SUPABASE_SERVICE_ROLE_KEY:**
   - Replace `your_service_role_key_here` with your Supabase service_role secret key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

4. **RESEND_API_KEY:**
   - Replace `your_resend_api_key_here` with your Resend API key
   - Example: `re_1234567890abcdef...`

5. **NEXT_PUBLIC_APP_URL:**
   - For local testing: Keep as `http://localhost:3000`
   - For production: Change to `https://grocery-share.com`

**Example of what it should look like (with fake values):**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. **Save the file** (Cmd+S on Mac)

**⚠️ Important:** The `.env.local` file is already set to be ignored by Git, so your keys won't be uploaded to GitHub. This keeps them safe!

---

## Part 4: Install Required Packages

**What are packages?** They're code libraries that add features to your project (like database connections, email sending, etc.).

### Step 4.1: Open Terminal

1. **Press** `Command + Space` (on Mac) to open Spotlight
2. **Type:** `Terminal`
3. **Press** Enter
4. Terminal window will open (black window with text)

### Step 4.2: Navigate to Your Project

**Type this command and press Enter:**
```bash
cd "/Users/keithlam/Documents/grocery-share.com"
```

### Step 4.3: Install Packages

**Type this command and press Enter:**
```bash
npm install @supabase/supabase-js resend bcryptjs
```

**Wait for it to finish** (you'll see a lot of text scrolling, then it will stop)

**Then type this command and press Enter:**
```bash
npm install --save-dev @types/bcryptjs
```

**Wait for it to finish**

**You should see:** "added X packages" and "found 0 vulnerabilities"

---

## Part 5: Test Everything

### Step 5.1: Start Your Development Server

**In Terminal, type:**
```bash
npm run dev
```

**Press Enter**

**You should see:** "Ready" and a URL like `http://localhost:3000`

### Step 5.2: Test in Browser

1. **Open your browser**
2. **Go to:** http://localhost:3000
3. **You should see** your login page

### Step 5.3: Test Sign Up

1. **Click** "Don't have an account? Sign up" button
2. **A popup should appear** with email and password fields
3. **Enter:**
   - Email: Your real email address
   - Password: At least 6 characters
   - Confirm Password: Same password
4. **Click** "Sign up"
5. **You should see:** "Account created. Please check your email..."
6. **Check your email** - You should receive a verification email from Resend
7. **Click the verification link** in the email
8. **You should be redirected** to a page saying "Email verified successfully!"

### Step 5.4: Test Login

1. **Go back to** http://localhost:3000
2. **Enter:**
   - Email: The email you just signed up with
   - Password: The password you created
3. **Click** "Sign in"
4. **You should be redirected** to `/mastertable` page

### Step 5.5: Test Forgot Password

1. **Go back to** the login page
2. **Click** "Forgot password?" link
3. **Enter** your email
4. **Click** "Send Reset Link"
5. **Check your email** - You should receive a password reset email
6. **Click the reset link** in the email
7. **Enter a new password** (at least 6 characters)
8. **Click** "Reset Password"
9. **You should see** "Password reset successfully!"
10. **Try logging in** with your new password

---

## Part 6: Deploy to Production

### Step 6.1: Add Environment Variables to Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Click** your `grocery-share.com` project
3. **Click** "Settings" tab
4. **Click** "Environment Variables" in the left sidebar
5. **Add each variable:**
   - Click "Add New"
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase URL
   - **Environment:** Production, Preview, Development (check all)
   - Click "Save"
   
   **Repeat for each:**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to `https://grocery-share.com`)

### Step 6.2: Update Resend Email Domain

1. **In Resend dashboard**, verify your `grocery-share.com` domain
2. **Update the email "from" address** in the code:
   - Change `onboarding@resend.dev` to `noreply@grocery-share.com` (or your verified domain email)

### Step 6.3: Push Your Code

**In Terminal:**
```bash
cd "/Users/keithlam/Documents/grocery-share.com"
git add .
git commit -m "Add subscription enablement: sign up, email verification, password reset"
git push origin main
```

**Vercel will automatically deploy** your changes!

---

## Troubleshooting

### Problem: "Missing Supabase environment variables" error

**Solution:** Make sure your `.env.local` file exists and has all the required variables with correct values.

### Problem: Can't sign up - "Failed to create account"

**Solution:** 
- Check that your Supabase table was created correctly
- Verify your Supabase keys are correct in `.env.local`
- Check Terminal for error messages

### Problem: No verification email received

**Solution:**
- Check your spam folder
- Verify your Resend API key is correct
- Check Resend dashboard for email logs
- Make sure you're using a real email address (not a fake one)

### Problem: "Invalid or expired verification token"

**Solution:**
- Verification tokens expire after 24 hours
- Request a new sign up or use the forgot password flow

### Problem: Can't login after verification

**Solution:**
- Make sure you verified your email (clicked the link)
- Check that your password is correct
- Try the "Forgot password" flow to reset it

---

## What You've Built

✅ Users can sign up with email and password  
✅ Email verification required before login  
✅ Password reset via email link  
✅ Secure password storage (hashed, never plain text)  
✅ Session management (users stay logged in)  
✅ Protected `/mastertable` route (only verified users can access)  
✅ Admin/admin login still works as backup  

---

## Next Steps (Optional)

- Add "Logout" button
- Add user profile page
- Add password strength indicator
- Add "Remember me" checkbox
- Customize email templates with your branding

---

## Need Help?

If you get stuck:
1. Check the error messages in Terminal
2. Check your browser's Developer Console (F12 or right-click → Inspect)
3. Verify all environment variables are set correctly
4. Make sure Supabase table and Resend are set up properly
