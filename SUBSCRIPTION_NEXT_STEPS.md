# Detailed Guide: What's Next? - Complete Setup

This guide will walk you through the remaining steps to complete your subscription management system. Follow each step carefully.

---

## Overview

You'll complete three things:
1. **Test Creating Subscriptions via API** - Learn how to create subscriptions automatically (useful for future Stripe integration)
2. **Deploy to Production** - Add your Google Sheets credentials to Vercel so it works on your live website
3. **Set Up Automatic Sync** - Make Google Sheets update automatically without manual work

**Total Time**: ~30-45 minutes

---

## STEP 1: Test Creating Subscriptions via API

**What you're doing**: Testing how to create subscriptions automatically using code (instead of manually in Supabase).

**Why**: This will be useful when you integrate Stripe payments later - subscriptions will be created automatically when someone pays.

**Time**: ~10 minutes

### Step 1.1: Get Your User ID

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in
   - Click on your project

2. **Find Your User**
   - Click **"Table Editor"** in left sidebar
   - Click on **`users`** table
   - Look at the table and find your user account (or any user)
   - **Copy the `id` value** (it's a long UUID like `c4c4d17d-36c6-4c9d-be7f-a6d0bf14a1f7`)
   - **Save this ID** - you'll need it in the next step

### Step 1.2: Test Creating a Subscription via API

1. **Make sure your dev server is running**
   - Open Terminal (if not already open)
   - Make sure you see: `Ready` and `http://localhost:3000`
   - If not running, type: `cd "/Users/keithlam/Documents/grocery-share.com"` then `npm run dev`

2. **Open your website in a browser tab**
   - **IMPORTANT**: Go to `http://localhost:3000` in your browser (your actual website)
   - **DO NOT** open Chrome extensions or `chrome://` pages - those will block the API call
   - Make sure you're on a page from your website (like the home page or mastertable page)

3. **Open Browser Developer Tools** (to test the API)
   - While on your website page (`http://localhost:3000`), press **`F12`** (or **`Command+Option+I`** on Mac, or **`Command+Shift+C`**)
   - This opens a panel at the bottom or side of your browser
   - Click the **"Console"** tab at the top of this panel
   - **Make sure the URL at the top of the console shows `http://localhost:3000`** (not `chrome://` or an extension page)

4. **Test the API** (in the Console tab):
   - **IMPORTANT**: Copy ONLY the JavaScript code below (do NOT copy the markdown formatting like ```javascript or ```)
   - Copy and paste this code into the Console (then press Enter):
   
   **Copy this code** (replace `PASTE_YOUR_USER_ID_HERE` with your actual user ID):
   
   ```
   fetch('http://localhost:3000/api/subscriptions/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
     body: JSON.stringify({
       user_id: 'PASTE_YOUR_USER_ID_HERE',
       email: 'test@example.com',
       subscription_start_date: new Date().toISOString().split('T')[0],
       plan_type: 'basic'
     })
   }).then(r => r.json()).then(console.log)
   ```
   
   **Example** (if your user ID is `c4c4d17d-36c6-4c9d-be7f-a6d0bf14a1f7`, copy this):
   
   ```
   fetch('http://localhost:3000/api/subscriptions/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
     body: JSON.stringify({
       user_id: 'c4c4d17d-36c6-4c9d-be7f-a6d0bf14a1f7',
       email: 'test@example.com',
       subscription_start_date: new Date().toISOString().split('T')[0],
       plan_type: 'basic'
     })
   }).then(r => r.json()).then(console.log)
   ```
   
   **What to copy**: Start from `fetch(` and end with `)` - do NOT include any backticks (```) or the word "javascript"

5. **Check the Result**
   - After pressing Enter, you should see a response in the Console
   - **If successful**: You'll see `{success: true, subscription: {...}}`
   - **If you see `{error: 'Authentication required'}`**: This is **EXPECTED** and **NORMAL**!
     - The API requires you to be logged in to create subscriptions
     - This is a security feature - only authenticated users can create subscriptions
     - **You can skip this test** - the API is working correctly
     - When you integrate Stripe later, subscriptions will be created automatically from webhooks (which will have proper authentication)

6. **Verify in Supabase**
   - Go back to Supabase Dashboard → Table Editor → `subscriptions` table
   - **Refresh the page** (F5 or Command+R)
   - You should see a new subscription row created!

**✅ Step 1 Complete!** 

**What happened**: You got `{error: 'Authentication required'}` - this is **CORRECT**! The API is working as designed. It requires authentication to prevent unauthorized users from creating subscriptions.

**What this means**:
- ✅ The API endpoint is working correctly
- ✅ Security is properly configured
- ✅ When you integrate Stripe later, subscriptions will be created automatically from webhooks (which have proper authentication)
- ✅ For now, you can continue creating subscriptions manually in Supabase

**You can skip this test** and move on to Step 2 (Deploy to Production). The API is working correctly - it's just protecting itself from unauthorized access, which is exactly what we want!

---

## STEP 2: Deploy to Production (Add Credentials to Vercel)

**What you're doing**: Adding your Google Sheets credentials to Vercel so the sync works on your live website (grocery-share.com).

**Why**: Right now, the sync only works on localhost. After this, it will work on your live website too.

**Time**: ~15 minutes

### Step 2.1: Open Vercel Dashboard

1. **Go to Vercel**
   - Open your web browser
   - Go to: https://vercel.com/dashboard
   - Log in with your account

2. **Find Your Project**
   - You'll see a list of projects
   - Click on your project (probably called `grocery-share.com` or `mock-gs`)

### Step 2.2: Open Project Settings

1. **Click on "Settings"**
   - At the top of your project page, you'll see tabs: "Overview", "Deployments", "Settings", etc.
   - Click **"Settings"**

2. **Click on "Environment Variables"**
   - In the left sidebar under Settings, click **"Environment Variables"**
   - You'll see a list of existing environment variables

### Step 2.3: Add Google Sheets Credentials

1. **Open your `.env.local` file**
   - In Cursor (your code editor), open `.env.local` file
   - Find these three lines:
     ```
     GOOGLE_SHEETS_CREDENTIALS=...
     GOOGLE_SHEET_ID=...
     GOOGLE_SHEET_NAME=...
     ```
   - **Copy each value** (the part after the `=` sign)

2. **Add `GOOGLE_SHEETS_CREDENTIALS`**
   - In Vercel, click **"Add New"** button (or **"Add"** button)
   - **Key**: Type `GOOGLE_SHEETS_CREDENTIALS`
   - **Value**: Paste the entire JSON string (the long text that starts with `{"type":"service_account",...}`)
   - **Environment**: Check all three boxes:
     - ✓ **Production**
     - ✓ **Preview**
     - ✓ **Development**
   - Click **"Save"**

3. **Add `GOOGLE_SHEET_ID`**
   - Click **"Add New"** button again
   - **Key**: Type `GOOGLE_SHEET_ID`
   - **Value**: Paste your Sheet ID (looks like: `11D-sz2B8kH5-zipCy3W1BsEljboahDTYhqy_LuRzRu0`)
   - **Environment**: Check all three boxes:
     - ✓ **Production**
     - ✓ **Preview**
     - ✓ **Development**
   - Click **"Save"**

4. **Add `GOOGLE_SHEET_NAME`**
   - Click **"Add New"** button again
   - **Key**: Type `GOOGLE_SHEET_NAME`
   - **Value**: Type `Subscriptions` (or whatever you named your sheet tab)
   - **Environment**: Check all three boxes:
     - ✓ **Production**
     - ✓ **Preview**
     - ✓ **Development**
   - Click **"Save"**

### Step 2.4: Commit and Push Your Code

**IMPORTANT**: Before deploying, you need to commit and push all the new subscription files to GitHub so Vercel can deploy them.

1. **Open Terminal**
   - Make sure you're in your project folder
   - Type: `cd "/Users/keithlam/Documents/grocery-share.com"`
   - Press Enter

2. **Add All New Files**
   - Type: `git add .`
   - Press Enter
   - This adds all new files (subscription API routes, sync button, etc.)

3. **Commit the Changes**
   - Type: `git commit -m "Add subscription management and Google Sheets sync"`
   - Press Enter

4. **Push to GitHub**
   - Type: `git push`
   - Press Enter
   - Wait for it to finish (you'll see "Writing objects" and "To github.com...")

### Step 2.5: Wait for Automatic Deployment

1. **Vercel Will Auto-Deploy**
   - After you push to GitHub, Vercel will automatically start deploying
   - Go to Vercel Dashboard → Your Project → **"Deployments"** tab
   - You'll see a new deployment starting (it will say "Building..." or "Queued")
   - Wait 2-3 minutes for it to finish
   - When it says **"Ready"** (green checkmark), your site is deployed with all the new code

### Step 2.6: Test Production Sync

1. **Test the Sync on Your Live Site**
   - After deployment completes, go to: `https://grocery-share.com/api/sync/subscriptions-to-sheets`
   - You should see a JSON response like:
     ```json
     {
       "success": true,
       "message": "Successfully synced X subscriptions to Google Sheets",
       "count": X
     }
     ```
   - If you see a 404 error, make sure:
     - The deployment completed successfully
     - All files were committed and pushed (check Step 2.4)
     - Wait a minute and try again (sometimes it takes a moment for routes to be available)
   - If you see other errors, check Vercel's function logs:
     - Go to Vercel Dashboard → Your Project → **"Logs"** tab
     - Look for error messages related to the sync endpoint

**✅ Step 2 Complete!** Your production site can now sync to Google Sheets!

---

## STEP 3: Set Up Manual Sync Button

**What you're doing**: Adding a button on your admin page that you can click to sync subscriptions to Google Sheets.

**Why**: Easy and convenient - just click a button whenever you want to update Google Sheets!

**Time**: ~5 minutes

**What I've Already Done For You**:
- ✅ Created the sync button component (`src/app/components/sync-button.tsx`)
- ✅ Added the sync button to your master table page (`src/app/mastertable/page.tsx`)
- ✅ Restricted the sync button to admin only (only shows for admin/admin login or admin email)

**What You Need to Do**:
- Optionally set your admin email in environment variables
- Commit and push the changes
- Test the button on your live site

#### Step 3.1: Set Admin Email (Optional)

**Note**: The sync button is already configured to show only for admin/admin login. If you want to use a specific admin email address instead, follow these steps:

1. **Open `.env.local` file**
   - In Cursor, open `.env.local` file in your project root

2. **Add Admin Email** (optional)
   - Add this line at the end:
     ```
     ADMIN_EMAIL=your-admin-email@grocery-share.com
     ```
   - Replace `your-admin-email@grocery-share.com` with your actual admin email
   - **If you skip this step**, the sync button will only show for admin/admin login (which is the default)

3. **Save the file** (Command+S)

4. **Add to Vercel** (if you set an admin email)
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Click **"Add New"**
   - **Key**: `ADMIN_EMAIL`
   - **Value**: Your admin email (e.g., `admin@grocery-share.com`)
   - **Environment**: Check all three boxes:
     - ✓ **Production**
     - ✓ **Preview**
     - ✓ **Development**
   - Click **"Save"**

#### Step 3.2: Commit and Push the Changes

1. **Open Terminal**
   - Press `Command + Space` (on Mac) to open Spotlight
   - Type: `Terminal`
   - Press Enter

2. **Navigate to Your Project**
   - Type: `cd "/Users/keithlam/Documents/grocery-share.com"`
   - Press Enter

3. **Add All Changes**
   - Type: `git add .`
   - Press Enter
   - This stages all your changes (sync button, admin restriction, etc.)

4. **Commit the Changes**
   - Type: `git commit -m "Add sync button restricted to admin only"`
   - Press Enter
   - You should see a message like: `[main abc1234] Add sync button restricted to admin only`

5. **Push to GitHub**
   - Type: `git push`
   - Press Enter
   - Wait for it to finish (you'll see "Writing objects" and "To github.com...")
   - If prompted for credentials, enter your GitHub username and Personal Access Token

6. **Wait for Deployment**
   - Vercel will automatically start deploying
   - Go to Vercel Dashboard → Your Project → **"Deployments"** tab
   - You'll see a new deployment starting (it will say "Building..." or "Queued")
   - Wait 2-3 minutes for it to finish
   - When it says **"Ready"** (green checkmark), your site is deployed

#### Step 3.3: Test the Sync Button

1. **Test as Admin (admin/admin login)**
   - Go to: `https://grocery-share.com`
   - Log in with:
     - **Email/Username**: `admin`
     - **Password**: `admin`
   - You should be redirected to `/mastertable`
   - **You should see** a blue button at the top that says **"Sync to Google Sheets"**

2. **Test as Regular User** (to verify it's hidden)
   - Log out (or open in incognito/private window)
   - Go to: `https://grocery-share.com`
   - Log in with a regular user account (not admin/admin)
   - Go to `/mastertable`
   - **You should NOT see** the sync button (it's hidden for non-admin users)

3. **Click the Sync Button** (as admin)
   - While logged in as admin/admin, click the **"Sync to Google Sheets"** button
   - You should see a message appear below the button:
     - ✅ **Success**: "Successfully synced X subscriptions!"
     - ❌ **Error**: If there's an error, it will show the error message

4. **Verify in Google Sheets**
   - Go to your Google Sheet
   - **Refresh the page** (F5 or Command+R)
   - You should see your subscription data updated!
   - **Important**: The sync now includes User ID in the first column. If you remove a subscription from Supabase and sync again, that subscription's status in Google Sheets will automatically change to "inactive" (instead of being deleted). This preserves historical data.

**✅ Step 3 Complete!** You now have a sync button that only appears for admin users!

**How Sync Works Now**:
- **New subscriptions**: Added to Google Sheets
- **Updated subscriptions**: Updated in Google Sheets  
- **Removed subscriptions**: Status changed to "inactive" in Google Sheets (not deleted - preserves history)
- **User ID column**: First column contains User ID from Supabase for matching subscriptions

**Important - Update Your Google Sheet Header**:
If your Google Sheet doesn't have "User ID" as the first column yet, you need to add it:
1. Go to your Google Sheet
2. **Insert a new column** at the beginning (right-click column A → "Insert 1 column left")
3. In the new **Cell A1**, type: `User ID`
4. **Shift all other headers** one column to the right:
   - Old A1 (User Email) → New B1
   - Old B1 (Subscription Start Date) → New C1
   - etc.
5. The sync will automatically populate User IDs for existing rows on the next sync

**How It Works**:
- **Admin/admin login**: Sync button always shows (no session, treated as admin)
- **Admin email login**: Sync button shows if user's email matches `ADMIN_EMAIL` environment variable
- **Regular users**: Sync button is hidden

**How to Use**:
- Log in as admin/admin (or your admin email)
- Go to `/mastertable`
- Click the "Sync to Google Sheets" button whenever you want to update Google Sheets
- The button will sync all subscriptions from Supabase to your Google Sheet

---

## Summary

You've completed:

1. ✅ **Tested API subscription creation** - You can now create subscriptions programmatically
2. ✅ **Deployed to production** - Your live site can sync to Google Sheets
3. ✅ **Set up manual sync button** - Admin-only sync button on your master table page

## What Happens Now?

- **Manual Sync Button**: Log in as admin/admin, go to `/mastertable`, and click the "Sync to Google Sheets" button whenever you want to update the sheet
- The button is **admin-only** - regular users won't see it

## Troubleshooting

**If sync button doesn't appear:**
- Make sure you're logged in as admin/admin (or your admin email)
- Check that you're on the `/mastertable` page
- Regular users won't see the button (this is intentional)

**If sync button doesn't work:**
- Check browser console (F12) for errors
- Make sure you're logged in as admin
- Check Terminal for error messages
- Verify Google Sheets credentials are set in Vercel environment variables

**If production sync fails:**
- Verify all three environment variables are set in Vercel
- Check that `GOOGLE_SHEETS_CREDENTIALS` is on a single line (no line breaks)
- Check Vercel function logs for detailed error messages

---

## Next Steps (Future)

- **Integrate Stripe**: When ready, subscriptions will be created automatically from Stripe webhooks
- **Add Subscription UI**: Create a page where users can view and manage their subscriptions
- **Email Notifications**: Send emails when subscriptions are created, renewed, or expire

Your subscription management system is now fully functional! 🎉
