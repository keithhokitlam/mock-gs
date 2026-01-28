# Complete Check-Ins Tracking Setup Guide

This guide will help you set up check-in tracking so you can see how many times each user has logged into grocery-share.com. Follow these steps **in order**.

---

## Step 1: Create the `check_ins` Table in Supabase

### 1.1: Go to Supabase Dashboard
1. Open your web browser
2. Go to: **https://supabase.com/dashboard**
3. Sign in if needed
4. Click on your **grocery-share** project

### 1.2: Open Table Editor
1. In the left sidebar, click on **"Table Editor"**
2. You should see your existing tables (`users`, `subscriptions`)

### 1.3: Create New Table
1. Click the **"New table"** button (usually at the top right or bottom)
2. **Table name:** Type exactly: `check_ins`
   - Make sure it's lowercase
   - Use underscore, not hyphen
3. Click **"Create table"** or **"Save"**

### 1.4: Add Column 1 - `id`
1. Click **"Add column"** button
2. **Name:** Type `id`
3. **Type:** Click the dropdown and select **`uuid`**
4. **Primary key:** Check the box ✅
5. **Is nullable:** Make sure this is **UNCHECKED** ❌ (required field)
6. Scroll down and find **"Default value"**
7. In the default value field, type: `gen_random_uuid()`
8. Click **"Save"**

### 1.5: Add Column 2 - `user_id`
1. Click **"Add column"** button again
2. **Name:** Type `user_id`
3. **Type:** Select **`uuid`**
4. **Is nullable:** Make sure this is **UNCHECKED** ❌ (required field)
5. Click **"Save"**

### 1.6: Add Column 3 - `email`
1. Click **"Add column"** button
2. **Name:** Type `email`
3. **Type:** Select **`text`**
4. **Is nullable:** Make sure this is **UNCHECKED** ❌ (required field)
5. Click **"Save"**

### 1.7: Add Column 4 - `checked_in_at`
1. Click **"Add column"** button
2. **Name:** Type `checked_in_at`
3. **Type:** Select **`timestamptz`** (timestamp with timezone)
4. **Is nullable:** Make sure this is **UNCHECKED** ❌ (required field)
5. Click **"Save"**

### 1.8: Add Column 5 - `created_at`
1. Click **"Add column"** button
2. **Name:** Type `created_at`
3. **Type:** Select **`timestamptz`**
4. **Is nullable:** Make sure this is **UNCHECKED** ❌ (required field)
5. Scroll down to **"Default value"**
6. Type: `now()`
7. Click **"Save"**

### 1.9: Add Foreign Key (Links to users table)
1. Click on the **`user_id`** column you just created
2. Scroll down to find **"Foreign key"** section
3. Click **"Add foreign key"** or the **"+"** button
4. **Foreign table:** Select **`users`** from dropdown
5. **Foreign column:** Select **`id`** from dropdown
6. Click **"Save"**

### 1.10: Enable Row Level Security (RLS)
1. At the top of the table editor, find the **"RLS"** toggle switch
2. Turn it **ON** (toggle should be blue/green)
3. Click **"Add policy"** button
4. **Policy name:** Type `Enable insert for service role`
5. **Allowed operation:** Select **`INSERT`** from dropdown
6. **Policy command for clause:** Select **`WITH CHECK`**
7. **Using expression:** Type `true`
8. **With check expression:** Type `true`
9. Click **"Save"** or **"Create policy"**

### 1.11: Verify Table Structure
Your table should now have these columns in this order:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users.id)
- `email` (text)
- `checked_in_at` (timestamptz)
- `created_at` (timestamptz)

✅ **Step 1 Complete!** Your `check_ins` table is ready.

---

## Step 2: Update Google Sheet Header

### 2.1: Open Your Google Sheet
1. Go to your Google Sheets
2. Open the **"Subscriptions"** sheet (or whatever you named it)

### 2.2: Find the Header Row
1. Look at **Row 1** (the very top row)
2. You should see headers like: User ID, Email, Start Date, End Date, etc.

### 2.3: Add "Check-Ins" Column
1. Find the column **after "Days Remaining"**
2. Click on the column header (the letter at the top, like "I" or "J")
3. **Right-click** and select **"Insert 1 column right"** OR
4. Click **Insert** → **Column right** from the menu
5. In the new empty header cell, type: **`Check-Ins`**

### 2.4: Verify Column Order
Your header row should now be in this exact order:
1. User ID
2. Email
3. Start Date
4. End Date
5. Renewal Date
6. Status
7. Plan Type
8. Days Remaining
9. **Check-Ins** ← New column
10. Created At
11. Updated At

✅ **Step 2 Complete!** Your Google Sheet header is updated.

---

## Step 3: Deploy the Code Changes

### 3.1: Open Terminal
1. Press `Command + Space` (hold both keys)
2. Type: `Terminal`
3. Press Enter
4. A black window will open

### 3.2: Navigate to Your Project
1. In Terminal, copy and paste this command:
   ```bash
   cd "/Users/keithlam/Documents/grocery-share.com"
   ```
2. Press Enter
3. You should see the prompt change to show `grocery-share.com` (this means you're in the right folder)

**Note:** If you see a message about "zsh" or "bash", that's normal - just ignore it and continue.

### 3.3: Check What Changed
1. Type this command (don't type "bash" first, just type the command):
   ```bash
   git status
   ```
2. Press Enter
3. You should see files that were modified (like `src/app/api/auth/login/route.ts` and `src/app/api/sync/subscriptions-to-sheets/route.ts`)
4. If you see "nothing to commit" or "working tree clean", that's okay - the files might already be committed

### 3.4: Add All Changes
1. Type:
   ```bash
   git add .
   ```
2. Press Enter

### 3.5: Commit Changes
1. Type:
   ```bash
   git commit -m "Add check-in tracking to Google Sheets"
   ```
2. Press Enter

### 3.6: Push to GitHub
1. Type:
   ```bash
   git push origin main
   ```
2. Press Enter
3. If it asks for **username:** Enter your GitHub username
4. If it asks for **password:** Paste your GitHub Personal Access Token (not your password)
5. Wait for it to finish (you'll see "Writing objects" and "done")

✅ **Step 3 Complete!** Code is pushed to GitHub.

---

## Step 4: Wait for Vercel Deployment

### 4.1: Check Vercel Dashboard
1. Open your web browser
2. Go to: **https://vercel.com/dashboard**
3. Sign in if needed
4. Click on your **grocery-share.com** project

### 4.2: Watch Deployment
1. You should see a new deployment starting (it says "Building" or "Queued")
2. Wait 2-3 minutes for it to finish
3. When it says **"Ready"** ✅, your changes are live!

✅ **Step 4 Complete!** Your code is deployed.

---

## Step 5: Test the Check-In Tracking

### 5.1: Test Login (Create a Check-In)
1. Go to: **https://grocery-share.com** (or your domain)
2. Log in with a user account (not admin/admin)
3. You should be redirected to `/mastertable`
4. **This login just created a check-in record!**

### 5.2: Verify Check-In in Supabase
1. Go back to Supabase Dashboard
2. Click **"Table Editor"**
3. Click on the **`check_ins`** table
4. You should see at least one row with:
   - Your user_id
   - Your email
   - A timestamp in `checked_in_at`
   - A timestamp in `created_at`

### 5.3: Sync to Google Sheets
1. Go to: **https://grocery-share.com**
2. Log out if you're logged in
3. Log in with: **admin** / **admin**
4. You should be on the `/mastertable` page
5. Look for the blue **"Sync to Google Sheets"** button
6. Click it
7. Wait for the success message

### 5.4: Check Google Sheet
1. Go back to your Google Sheet
2. Look at the **"Check-Ins"** column
3. You should see numbers (like `1`, `2`, `3`, etc.) showing how many times each user has logged in
4. If you just logged in once, you should see `1` in the Check-Ins column for your user

✅ **Step 5 Complete!** Check-in tracking is working!

---

## How It Works

- **Every login** = One check-in record created in Supabase
- **When you sync** = System counts all check-ins per user
- **In Google Sheet** = Shows total login count for each user
- **Multiple subscriptions** = If a user has multiple subscriptions, each row shows the same check-in count (total for that user)

---

## Troubleshooting

### Problem: "Table check_ins does not exist" error
**Solution:**
- Go back to Step 1
- Make sure you created the table with exact name `check_ins` (lowercase, underscore)
- Check that all columns were created correctly

### Problem: Check-Ins column shows 0 or is empty
**Solution:**
1. Make sure you've logged in at least once (Step 5.1)
2. Check Supabase `check_ins` table has records
3. Make sure you clicked "Sync to Google Sheets" after logging in
4. Verify the Google Sheet header has "Check-Ins" column

### Problem: Can't see "Sync to Google Sheets" button
**Solution:**
- Make sure you're logged in as admin/admin
- The button only shows for admin accounts
- Try logging out and logging back in with admin/admin

### Problem: Git push asks for password
**Solution:**
- Use your **GitHub Personal Access Token**, not your GitHub password
- If you don't have one, create it at: https://github.com/settings/tokens
- Select "repo" scope when creating the token

---

## Summary Checklist

Before you're done, make sure you've completed:

- [ ] Created `check_ins` table in Supabase with all 5 columns
- [ ] Set default values for `id` and `created_at`
- [ ] Added foreign key from `user_id` to `users.id`
- [ ] Enabled RLS and added INSERT policy
- [ ] Added "Check-Ins" column header to Google Sheet
- [ ] Committed and pushed code to GitHub
- [ ] Waited for Vercel deployment to finish
- [ ] Tested login (created a check-in)
- [ ] Verified check-in appears in Supabase
- [ ] Synced to Google Sheets
- [ ] Verified Check-Ins column shows numbers

---

**You're all set!** Check-ins will now be tracked automatically every time a user logs in. 🎉
