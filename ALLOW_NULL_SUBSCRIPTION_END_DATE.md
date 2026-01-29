# Allow NULL Values for subscription_end_date Column

## Problem
The `subscription_end_date` column in the `subscriptions` table currently has a NOT NULL constraint, which prevents setting it to NULL for indefinite subscriptions.

## Solution: Modify Column to Allow NULL

### Option 1: Using Supabase UI (Easiest)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Click on the `subscriptions` table

3. **Modify the Column**
   - Find the `subscription_end_date` column in the table
   - Click on the column header or the column name
   - In the column settings panel, **check the box for "Is Nullable"** (this allows NULL values)
   - Click "Save" or "Update Column"

4. **Verify**
   - Try editing a subscription row in Supabase
   - You should now be able to clear/delete the `subscription_end_date` value
   - The field should accept NULL/empty values

### Option 2: Using SQL Editor (Alternative)

1. **Open SQL Editor**
   - In Supabase Dashboard, click on "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Run This SQL Command**
   ```sql
   ALTER TABLE subscriptions 
   ALTER COLUMN subscription_end_date DROP NOT NULL;
   ```

3. **Verify**
   - Run this query to confirm the change:
   ```sql
   SELECT column_name, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'subscriptions' 
   AND column_name = 'subscription_end_date';
   ```
   - You should see `is_nullable = 'YES'`

4. **Test**
   - Try updating a subscription row in the Table Editor
   - Clear the `subscription_end_date` field
   - It should save successfully without errors

## After Making This Change

Once you've allowed NULL values for `subscription_end_date`:

- ✅ You can set `subscription_end_date` to NULL for indefinite subscriptions
- ✅ The application code already handles NULL values correctly:
  - Login allows access when `subscription_end_date` is NULL
  - Pages show "Unlimited" for days remaining when NULL
  - Sync to Google Sheets shows "Unlimited" when NULL
- ✅ Subscriptions with NULL `subscription_end_date` are treated as active indefinitely

## Notes

- This change only affects the database schema - no code changes needed
- Existing subscriptions with dates will continue to work normally
- You can now create indefinite subscriptions by leaving `subscription_end_date` empty/null
