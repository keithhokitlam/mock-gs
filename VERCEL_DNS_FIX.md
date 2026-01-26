# Fix Vercel Domain Configuration to See DNS Records

## The Problem
Vercel is showing domain settings but not the DNS records you need to add to GoDaddy. This happens when the domains aren't properly connected to your deployment.

## Solution: Configure Both Domains Correctly

### Step 1: Fix `www.grocery-share.com` (This one looks correct)

1. In Vercel Dashboard → Settings → Domains
2. Find **`www.grocery-share.com`**
3. Make sure:
   - ✅ **"Connect to an environment"** is selected (Production)
   - ✅ It's connected to **Production** environment
4. Click **"Save"** if you made changes

### Step 2: Fix `grocery-share.com` (Root Domain)

1. In the same Domains page, find **`grocery-share.com`**
2. Change the configuration:
   - ✅ Select **"Connect to an environment"** (NOT "Redirect to Another Domain")
   - ✅ Select **Production** environment
   - ❌ Uncheck "Redirect to Another Domain"
3. Click **"Save"**

### Step 3: View DNS Records

After saving, Vercel should show you the DNS records needed. If not:

1. **Click on each domain name** (`grocery-share.com` or `www.grocery-share.com`)
2. Look for a section that says:
   - **"DNS Configuration"** or
   - **"Configure DNS"** or
   - **"DNS Records"**
3. You should see something like:

**For `grocery-share.com` (root domain):**
- Type: **A Record**
- Name: `@` (or blank)
- Value: IP addresses (e.g., `76.76.21.21`, `76.76.21.22`)

**For `www.grocery-share.com`:**
- Type: **CNAME Record**
- Name: `www`
- Value: Something like `cname.vercel-dns.com` or `[your-project].vercel.app`

### Step 4: If DNS Records Still Don't Show

Try this:

1. **Remove both domains:**
   - Click **"Remove"** on both `grocery-share.com` and `www.grocery-share.com`
   - Confirm removal

2. **Re-add them one at a time:**
   - Click **"Add Domain"** or **"Add"**
   - Enter `www.grocery-share.com` first
   - Select **Production** environment
   - Click **Add**
   - **Now you should see DNS records for www**

   - Then add `grocery-share.com`
   - Select **Production** environment
   - Click **Add**
   - **Now you should see DNS records for root domain**

3. **Copy the DNS records** Vercel shows you

### Step 5: Add DNS Records to GoDaddy

Once you see the DNS records in Vercel:

1. **For `grocery-share.com`:**
   - Go to GoDaddy → My Products → Your Domain → DNS
   - Add **A Record**:
     - Name: `@` (or leave blank)
     - Value: [IP address from Vercel]
     - If Vercel shows multiple IPs, add multiple A records (one per IP)

2. **For `www.grocery-share.com`:**
   - In GoDaddy DNS, add **CNAME Record**:
     - Name: `www`
     - Value: [CNAME value from Vercel]

3. **Save** in GoDaddy

4. **Wait 5-15 minutes** for DNS propagation

5. **Check Vercel Dashboard** - status should change to "Valid Configuration"

---

## Alternative: Check Vercel Project Settings

If you still don't see DNS records:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Domains**
3. Look for a **"DNS"** tab or **"Configuration"** section
4. Some Vercel projects show DNS records in a different location

---

## Still Can't Find DNS Records?

If Vercel isn't showing DNS records after following the above:

1. **Check if your project is deployed:**
   - Go to **Deployments** tab
   - Make sure you have at least one successful deployment

2. **Try the Vercel CLI:**
   ```bash
   vercel domains ls
   vercel domains inspect grocery-share.com
   ```

3. **Contact Vercel Support:**
   - They can help you get the correct DNS records
   - Or verify if there's an issue with your domain setup

---

## Quick Checklist

- [ ] Both domains set to "Connect to an environment" (Production)
- [ ] Not set to "Redirect to Another Domain"
- [ ] Clicked on domain names to see DNS details
- [ ] If needed, removed and re-added domains
- [ ] Copied DNS records from Vercel
- [ ] Added A record for root domain in GoDaddy
- [ ] Added CNAME record for www in GoDaddy
- [ ] Waited 5-15 minutes
- [ ] Checked Vercel - status should be "Valid Configuration"
