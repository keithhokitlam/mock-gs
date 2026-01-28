# Step-by-Step Instructions: Subscription Management Setup

I've completed all the code for you! Now you need to do these manual setup steps. Follow them in order.

---

## ✅ What I've Already Done (Code)

- ✅ Installed `googleapis` package
- ✅ Created Google Sheets helper (`src/lib/google-sheets.ts`)
- ✅ Created sync API route (`src/app/api/sync/subscriptions-to-sheets/route.ts`)
- ✅ Created subscription API routes (create, renew, list, update-status)
- ✅ Updated `.env.local.example` with Google Sheets variables

---

## 📋 What You Need to Do (Manual Setup)

Follow these steps in order:

---

### STEP 1: Create Subscriptions Table in Supabase

**Time: ~10 minutes**

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in
   - Click on your project

2. **Create the Table**
   - Click **"Table Editor"** in left sidebar
   - Click **"New Table"** button
   - **Table name**: Type `subscriptions` (all lowercase)
   - Click **"Save"**

3. **Add These Columns** (click "Add Column" for each):

   **Column 1: id**
   - Name: `id`
   - Type: **uuid**
   - ✓ Check "Is Primary Key"
   - Default value: `gen_random_uuid()`
   - Click "Save"

   **Column 2: user_id**
   - Name: `user_id`
   - Type: **uuid**
   - ✓ Leave "Is Nullable" checked
   - Click "Save"

   **Column 3: email**
   - Name: `email`
   - Type: **text**
   - ✗ Uncheck "Is Nullable" (required)
   - Click "Save"

   **Column 4: subscription_start_date**
   - Name: `subscription_start_date`
   - Type: **date**
   - ✗ Uncheck "Is Nullable" (required)
   - Click "Save"

   **Column 5: subscription_end_date**
   - Name: `subscription_end_date`
   - Type: **date**
   - ✗ Uncheck "Is Nullable" (required)
   - Click "Save"

   **Column 6: renewal_date**
   - Name: `renewal_date`
   - Type: **date**
   - ✓ Leave "Is Nullable" checked
   - Click "Save"

   **Column 7: status**
   - Name: `status`
   - Type: **text**
   - ✗ Uncheck "Is Nullable" (required)
   - Default value: `active`
   - Click "Save"

   **Column 8: plan_type**
   - Name: `plan_type`
   - Type: **text**
   - ✓ Leave "Is Nullable" checked
   - Click "Save"

   **Column 9: stripe_customer_id**
   - Name: `stripe_customer_id`
   - Type: **text**
   - ✓ Leave "Is Nullable" checked
   - Click "Save"

   **Column 10: stripe_subscription_id**
   - Name: `stripe_subscription_id`
   - Type: **text**
   - ✓ Leave "Is Nullable" checked
   - Click "Save"

   **Column 11: created_at**
   - Name: `created_at`
   - Type: **timestamptz**
   - ✓ Leave "Is Nullable" checked
   - Default value: `now()`
   - Click "Save"

   **Column 12: updated_at**
   - Name: `updated_at`
   - Type: **timestamptz**
   - ✓ Leave "Is Nullable" checked
   - Default value: `now()`
   - Click "Save"

4. **Set Up Foreign Key** (connects to your existing `users` table):
   - **IMPORTANT**: Make sure you're clicking on the **`user_id` column**, NOT the `id` column
   - Click on the **`user_id` column** (not `id`)
   - Find **"Foreign Key"** or **"Relationships"** section
   - Click **"Add Foreign Key"** or **"Add Relationship"**
   - **Referenced table**: Select `users`
   - **Referenced column**: Select `id`
   - Click **"Save"**
   
   **If you accidentally set the foreign key on the `id` column:**
   - Go to the **"Database"** section in left sidebar (or "SQL Editor")
   - Or go to Table Editor → `subscriptions` table → click on `id` column
   - Look for existing foreign keys/relationships
   - **Remove any foreign key on the `id` column** (the `id` column should NOT have a foreign key)
   - Then add the foreign key to the **`user_id` column** as described above

5. **Set Up Row Level Security (RLS)**:
   - Click the **"Policies"** tab
   - Toggle **"Enable Row Level Security"** to **ON**
   - Click **"New Policy"**
   - **Policy Name**: Type `Block all anon access`
   - **Policy Command for clause** (this is the "Allowed Operation"): 
     - Click the radio button for **"ALL"** (this controls all operations: SELECT, INSERT, UPDATE, DELETE)
   - **Target Roles to clause**: 
     - Check the boxes for **"anon"** and **"authenticated"** (both should be selected)
   - **SQL Code Editor** (the editable parts):
     - You'll see a locked SQL section that says "USE OPTIONS ABOVE TO EDIT"
     - **Look for the comment lines** inside the `using (` and `with check (` blocks
     - **Line 7** (inside `using (`): Click directly on the comment text `-- Provide a SQL expression for the using statement`
     - **Delete the comment** and type: `false`
     - It should now read: `using (false)`
     - **Line 9** (inside `with check (`): Click directly on the comment text `-- Provide a SQL expression for the with check statement`
     - **Delete the comment** and type: `false`
     - It should now read: `with check (false)`
     - **Note**: You can only edit the comment lines (lines 7 and 9), not the main SQL structure above
   - Click **"Save policy"** button (green button at bottom)
   
   **If you still can't edit the comment lines:**
   - Try clicking directly on the comment text (the gray text starting with `--`)
   - Make sure you're clicking inside the `using (` block, not on the locked section above
   - You should see a cursor appear when you click on the comment line

**✅ Step 1 Complete!** Your subscriptions table is ready.

---

### STEP 2: Create Google Sheet

**Time: ~5 minutes**

1. **Create New Sheet**
   - Go to: https://sheets.google.com
   - Click **"Blank"** to create new spreadsheet
   - Rename it: `GroceryShare Subscriptions`

2. **Set Up Header Row** (Row 1):
   - **Cell A1**: `User Email`
   - **Cell B1**: `Subscription Start Date`
   - **Cell C1**: `Subscription End Date`
   - **Cell D1**: `Renewal Date`
   - **Cell E1**: `Status`
   - **Cell F1**: `Plan Type`
   - **Cell G1**: `Days Remaining`
   - **Cell H1**: `Created At`
   - **Cell I1**: `Updated At`
   - **Make Row 1 bold** (select row 1, click B button)

3. **Get Your Sheet ID**:
   - Look at the URL in your browser
   - It looks like: `https://docs.google.com/spreadsheets/d/1kx7wArkJ5VDSwNuKDKizUMp1exnxfub-aI6xszqCZxs/edit`
   - The long string between `/d/` and `/edit` is your **Sheet ID**
   - **Copy this Sheet ID** and save it (you'll need it in Step 5)

4. **Note the Sheet Name**:
   - Look at the bottom tabs (usually says "Sheet1")
   - Remember this name (or rename it to "Subscriptions" if you want)

**✅ Step 2 Complete!** Your Google Sheet is ready.

---

### STEP 3: Set Up Google Cloud & Get API Access

**Time: ~15 minutes**

1. **Go to Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown at the top
   - Click **"New Project"**
   - **Project name**: `GroceryShare Subscriptions` (or any name)
   - Click **"Create"**
   - Wait for it to create, then make sure it's selected

3. **Enable Google Sheets API**
   - In the search bar at top, type: `Google Sheets API`
   - Click on **"Google Sheets API"** from results
   - Click blue **"Enable"** button
   - Wait for it to enable

4. **Create Service Account**
   - In left sidebar, click **"APIs & Services"**
   - Click **"Credentials"**
   - Click **"+ CREATE CREDENTIALS"** button
   - Select **"Service account"**
   - **Service account name**: `grocery-share-sheets`
   - Click **"Create and Continue"**
   - Click **"Continue"** or **"Done"** (skip optional steps)

5. **Create and Download API Key**
   - Click on your service account name (the one you just created)
   - Click **"Keys"** tab
   - Click **"Add Key"** → **"Create new key"**
   - **Key type**: Select **"JSON"**
   - Click **"Create"**
   - **A file will download** (usually to your Downloads folder)
   - **⚠️ IMPORTANT**: This file contains secret credentials. Don't share it!

6. **Get Service Account Email**
   - Still on the service account page, look at the top
   - You'll see **"Service account email"** (looks like: `grocery-share-sheets@your-project-id.iam.gserviceaccount.com`)
   - **Copy this email address** - you'll need it next

7. **Share Google Sheet with Service Account**
   - Go back to your Google Sheet (from Step 2)
   - Click **"Share"** button (top right, blue button)
   - In "Add people and groups" field, **paste the service account email**
   - **Permission**: Change to **"Editor"** (so it can write data)
   - **Uncheck** "Notify people"
   - Click **"Share"**
   - Click **"Done"**

**✅ Step 3 Complete!** Google Cloud setup is done.

---

### STEP 4: Add Credentials to Your Project

**Time: ~10 minutes**

1. **Open the Downloaded JSON File**
   - Find the JSON file you downloaded in Step 3.5 (usually in Downloads folder)
   - **Right-click** on the file
   - Select **"Open With"** → **"TextEdit"** (or any text editor)
   - You'll see JSON text like:
     ```json
     {
       "type": "service_account",
       "project_id": "...",
       "private_key_id": "...",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
       ...
     }
     ```
   - **Select All** (Command+A) and **Copy** (Command+C) the entire contents

2. **Add to .env.local File**
   - In Cursor (your code editor), open `.env.local` file in your project root
   - Add these new lines at the end:

   ```
   GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SHEET_NAME=Sheet1
   ```

   **Important**: 
   - Replace `{"type":"service_account",...}` with the **actual JSON content** you copied (paste it all on one line)
   - Replace `your_sheet_id_here` with the Sheet ID you copied in Step 2.3
   - Replace `Sheet1` with your actual sheet tab name (if you renamed it)

   **Example of what it should look like**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://apertlcgxvqerfrwhnuc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   RESEND_API_KEY=re_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"grocery-share-123456","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"grocery-share-sheets@grocery-share-123456.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/grocery-share-sheets%40grocery-share-123456.iam.gserviceaccount.com"}
   GOOGLE_SHEET_ID=1kx7wArkJ5VDSwNuKDKizUMp1exnxfub-aI6xszqCZxs
   GOOGLE_SHEET_NAME=Sheet1
   ```

3. **Save the file** (Command+S)

**✅ Step 4 Complete!** Credentials are configured.

---

### STEP 5: Test on Localhost

**Time: ~10 minutes**

1. **Start Your Development Server**
   - Open Terminal (Command+Space, type "Terminal", press Enter)
   - Type: `cd "/Users/keithlam/Documents/grocery-share.com"`
   - Press Enter
   - Type: `npm run dev`
   - Press Enter
   - Wait until you see: `Ready` and `http://localhost:3000`
   - **Leave this terminal window open**

2. **Get a User ID from Your Users Table**
   - Go to Supabase Dashboard → Table Editor → `users` table
   - Look at the table and find a user (or create a test user if needed)
   - **Copy the `id` value** (it's a long UUID)
   - **Save this ID** - you'll need it next

3. **Fix the `id` Column Default Value (if needed)**
   - Go to Supabase Dashboard → Table Editor → `subscriptions` table
   - Click on the **`id` column** (the column header)
   - Look for **"Default value"** field
   - It should say: `gen_random_uuid()`
   - **If it's empty or different:**
     - Click in the "Default value" field
     - Type: `gen_random_uuid()`
     - Click **"Save"** on the column
   - This ensures the ID auto-generates when you create a new row

4. **Create a Test Subscription**
   - Go to Supabase Dashboard → Table Editor → `subscriptions` table
   - Click **"Insert row"** or **"New row"** button
   - Fill in:
     - **id**: **Leave this EMPTY** (it should auto-generate, but if it still errors, see workaround below)
     - **user_id**: Paste the user ID you copied above (this is the user's ID from the users table)
     - **email**: Use the same email as the user you selected
     - **subscription_start_date**: Today's date (click calendar, select today)
     - **subscription_end_date**: One year from today (click calendar, select date 1 year from now)
     - **status**: `active`
     - **renewal_date**: Leave empty
     - **plan_type**: Leave empty
     - **stripe_customer_id**: Leave empty
     - **stripe_subscription_id**: Leave empty
   - Click **"Save"**
   
   **If you still get the "null value in column id" error:**
   - The default value might not be working in the UI
   - **Workaround**: Manually generate a UUID:
     1. Go to: https://www.uuidgenerator.net/
     2. Click **"Generate UUID"** button
     3. Copy the UUID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
     4. Paste it into the **`id`** field in Supabase
     5. Then fill in the rest of the fields
     6. Click **"Save"**
   
   **Important Notes:**
   - **DO NOT** put the user_id in the `id` field - they are different!
   - The `id` field is for the subscription's unique ID (each subscription gets its own unique ID)
   - The `user_id` field is for linking to the user (paste the user's ID here)

4. **Test the Sync**
   - Open a new browser tab
   - Go to: `http://localhost:3000/api/sync/subscriptions-to-sheets`
   - You should see a JSON response like:
     ```json
     {
       "success": true,
       "message": "Successfully synced 1 subscriptions to Google Sheets",
       "count": 1
     }
     ```
   - If you see an error, check the Terminal window for details

5. **Check Your Google Sheet**
   - Go back to your Google Sheet
   - **Refresh the page** (F5 or Command+R)
   - You should see your test subscription data in **Row 2** (Row 1 has headers)
   - The data should match what you entered in Supabase

**✅ Step 5 Complete!** If you see the data in Google Sheets, everything is working! 🎉

---

## 🎯 What's Next?

Once testing works on localhost:

1. **Test Creating Subscriptions via API** (optional):
   - You can use the API routes to create subscriptions programmatically
   - See the API routes in `src/app/api/subscriptions/` for details

2. **Deploy to Production**:
   - Add the same environment variables to Vercel
   - The sync will work the same way in production

3. **Set Up Automatic Sync** (optional):
   - You can set up a Vercel Cron job to sync periodically
   - Or add a manual sync button in your admin interface

---

## 🆘 Troubleshooting

**If sync doesn't work:**
- Check Terminal for error messages
- Verify Google Sheet is shared with service account email (Step 3.7)
- Verify JSON credentials are correct in `.env.local` (Step 4)
- Verify Sheet ID is correct (Step 4)
- Make sure Google Sheets API is enabled in Google Cloud Console (Step 3.3)

**If you see "Permission denied":**
- Make sure you shared the Google Sheet with the service account email
- Make sure you gave "Editor" permission (not just "Viewer")

**If you see "Invalid credentials":**
- Check that the JSON in `GOOGLE_SHEETS_CREDENTIALS` is all on one line
- Make sure there are no extra spaces or line breaks in the JSON

---

## 📝 Summary

You've set up:
- ✅ Subscriptions table in Supabase
- ✅ Google Sheet for viewing subscriptions
- ✅ Google Cloud API access
- ✅ Credentials configured
- ✅ Sync functionality tested

The system is ready to use! Subscriptions created in Supabase can now be synced to Google Sheets automatically.
