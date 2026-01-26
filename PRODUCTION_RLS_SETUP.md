# Production RLS (Row Level Security) Setup Guide

## Why Enable RLS?

Even though your API routes use the service role key (which bypasses RLS), enabling RLS is a security best practice because:
- It protects against accidental exposure of the anon key
- It prevents direct client-side access to sensitive data
- It's a defense-in-depth security measure
- It's required for Supabase best practices

## Step-by-Step: Enable RLS and Create Policies

### Step 1: Enable RLS on the `users` Table

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Table Editor:**
   - Click "Table Editor" in the left sidebar
   - Click on the `users` table

3. **Enable RLS:**
   - Click the "Policies" tab (or "RLS" tab)
   - Toggle "Enable Row Level Security" to **ON**
   - You'll see a warning - click "Enable" to confirm

### Step 2: Create Policies

Since all your database operations happen through API routes using the service role key, you need policies that:
- **Block all direct client access** (using anon key)
- **Allow service role access** (your API routes)

#### Policy 1: Block All Anon Access (Most Restrictive)

1. **Click "New Policy"**
2. **Choose:** "Create a policy from scratch"
3. **Policy Name:** `Block all anon access`
4. **Allowed Operation:** Select "SELECT", "INSERT", "UPDATE", "DELETE" (or "All operations")
5. **Policy Definition:**
   ```sql
   false
   ```
   This blocks ALL operations for anon users (which is what you want)
6. **Target Roles:** Select "anon" and "authenticated"
7. **Click "Save"**

#### Policy 2: Allow Service Role (Optional - Usually Not Needed)

**Note:** Service role key bypasses RLS by default, so you typically don't need this policy. But if you want to be explicit:

1. **Click "New Policy"**
2. **Choose:** "Create a policy from scratch"
3. **Policy Name:** `Allow service role`
4. **Allowed Operation:** "All operations"
5. **Policy Definition:**
   ```sql
   auth.role() = 'service_role'
   ```
6. **Target Roles:** Select "service_role"
7. **Click "Save"**

### Step 3: Test Your Application

After enabling RLS:

1. **Test Sign Up:**
   - Go to your app
   - Try signing up with a new email
   - Should work (API routes use service role)

2. **Test Login:**
   - Try logging in
   - Should work

3. **Test Password Reset:**
   - Try forgot password flow
   - Should work

4. **Test Email Verification:**
   - Click verification link
   - Should work

**All should work because your API routes use the service role key, which bypasses RLS.**

## Alternative: Simpler Policy (If Above Doesn't Work)

If you want a simpler approach, you can create one policy that blocks everything:

1. **Policy Name:** `Deny all public access`
2. **Allowed Operation:** "All operations"
3. **Policy Definition:**
   ```sql
   false
   ```
4. **Target Roles:** "anon", "authenticated"
5. **Click "Save"**

This effectively blocks all client-side access while allowing service role (your API routes) to work.

## Verify RLS is Working

1. **Try accessing the table directly (should fail):**
   - In Supabase dashboard, go to "SQL Editor"
   - Run this query (using anon key context - which you can't easily test, but trust that RLS is blocking it):
   ```sql
   SELECT * FROM users;
   ```
   - This should be blocked for anon users

2. **Your API routes should still work:**
   - All your `/api/auth/*` routes use the service role key
   - They bypass RLS automatically
   - Test all your authentication flows

## Important Notes

- **Service Role Key:** Your API routes use `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. This is correct and expected.
- **Anon Key:** The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is exposed in your client-side code, but since you're not using it to query the `users` table directly, RLS will block any accidental usage.
- **Security:** Even with RLS enabled, keep your service role key secret! Never commit it to Git or expose it in client-side code.

## Troubleshooting

### "Permission denied" errors in API routes

- **Check:** Make sure your API routes are using `supabaseServer` (service role), not `supabase` (anon key)
- **Verify:** Check your `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` set correctly

### Can't query users table

- **This is expected!** Direct queries using anon key should be blocked
- **Solution:** All database operations should go through your API routes

### Policies not working

- **Check:** Make sure RLS is enabled (toggle should be ON)
- **Verify:** Policies are saved and active
- **Test:** Try creating a test policy with `true` to see if policies work at all

## Summary

✅ **Enable RLS** on the `users` table  
✅ **Create a policy** that blocks all anon/authenticated access (`false`)  
✅ **Your API routes will still work** (they use service role key)  
✅ **Client-side access is blocked** (security improvement)  

This provides defense-in-depth security while maintaining full functionality of your application.
