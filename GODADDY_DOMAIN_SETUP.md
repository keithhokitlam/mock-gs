# Connect GoDaddy Domain to Vercel

This guide will help you connect your domain purchased from GoDaddy to your Vercel deployment.

---

## Step 1: Add Domain in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your **grocery-share.com** project

2. **Open Domain Settings:**
   - Click on the **Settings** tab (top navigation)
   - Click **Domains** in the left sidebar

3. **Add Your Domain:**
   - In the "Domains" section, you'll see a text input field
   - Enter your domain name (e.g., `yourdomain.com` or `www.yourdomain.com`)
   - Click **Add** or **Add Domain**

4. **Vercel Will Show DNS Configuration:**
   - After adding, Vercel will display the DNS records you need
   - You'll see something like:
     - **A Record** or **CNAME Record**
     - **Name:** `@` or `www` or `@`
     - **Value:** A Vercel IP address or CNAME value

---

## Step 2: Get DNS Records from Vercel

Vercel will show you one of these options:

### Option A: A Record (for root domain like `yourdomain.com`)
- **Type:** A
- **Name:** `@` (or leave blank)
- **Value:** An IP address like `76.76.21.21` (Vercel will provide the exact IPs)
- **TTL:** 3600 (or default)

### Option B: CNAME Record (for subdomain like `www.yourdomain.com`)
- **Type:** CNAME
- **Name:** `www` (or the subdomain you want)
- **Value:** Something like `cname.vercel-dns.com` (Vercel will provide the exact value)
- **TTL:** 3600 (or default)

**Note:** Vercel may provide multiple A records (usually 2-4 IP addresses). Add all of them.

---

## Step 3: Update DNS in GoDaddy

1. **Log into GoDaddy:**
   - Go to: https://www.godaddy.com
   - Sign in to your account

2. **Go to Domain Management:**
   - Click on your account name (top right)
   - Click **My Products**
   - Find your domain and click **DNS** (or **Manage DNS**)

3. **Edit DNS Records:**
   - You'll see a list of existing DNS records
   - Look for existing A records or CNAME records for your domain

4. **For Root Domain (`yourdomain.com`):**
   - Find the **A Record** with **Name:** `@` (or blank)
   - Click the **pencil icon** to edit, or delete it and create a new one
   - **Type:** A
   - **Name:** `@` (or leave blank)
   - **Value:** Enter the IP address(es) Vercel provided
   - **TTL:** 600 (or 1 hour)
   - **Save**
   - If Vercel gave you multiple A records, add each one separately

5. **For WWW Subdomain (`www.yourdomain.com`):**
   - Find the **CNAME Record** with **Name:** `www`
   - Click the **pencil icon** to edit, or delete it and create a new one
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** Enter the CNAME value Vercel provided (e.g., `cname.vercel-dns.com`)
   - **TTL:** 600 (or 1 hour)
   - **Save**

6. **Remove Conflicting Records:**
   - If there are old A records pointing to other IPs, delete them
   - Make sure you only have the Vercel records

---

## Step 4: Wait for DNS Propagation

DNS changes can take time to propagate:

- **Usually:** 5 minutes to 1 hour
- **Sometimes:** Up to 24-48 hours (rare)
- **Check status:** Vercel dashboard will show "Valid Configuration" when it's working

### Check Status in Vercel:
1. Go back to **Vercel Dashboard** → **Settings** → **Domains**
2. You'll see your domain listed
3. It will show:
   - ⏳ **Pending** (waiting for DNS)
   - ✅ **Valid Configuration** (working!)
   - ❌ **Invalid Configuration** (check your DNS settings)

---

## Step 5: Verify It's Working

1. **Wait 5-10 minutes** after updating DNS
2. **Check Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Your domain should show **"Valid Configuration"**
3. **Test in Browser:**
   - Try visiting `http://yourdomain.com` (may take a few minutes)
   - Try visiting `https://yourdomain.com` (Vercel provides SSL automatically)

---

## Common Issues & Solutions

### Issue: "Invalid Configuration" in Vercel

**Solution:**
- Double-check the DNS records in GoDaddy match exactly what Vercel provided
- Make sure you removed old conflicting records
- Wait a bit longer (DNS can be slow)

### Issue: Domain Not Loading

**Solution:**
- Wait 10-30 minutes for DNS propagation
- Clear your browser cache
- Try in an incognito/private window
- Check if Vercel shows "Valid Configuration"

### Issue: Only `www` Works, Root Domain Doesn't (or vice versa)

**Solution:**
- Make sure you added both:
  - **A Record** for `@` (root domain)
  - **CNAME Record** for `www` (subdomain)
- Or configure redirects in Vercel (Settings → Domains → Configure)

### Issue: SSL Certificate Not Working

**Solution:**
- Vercel automatically provisions SSL certificates
- Wait 5-10 minutes after DNS is valid
- If it's still not working after 24 hours, contact Vercel support

---

## Quick Checklist

- [ ] Added domain in Vercel (Settings → Domains)
- [ ] Copied DNS records from Vercel
- [ ] Updated A record in GoDaddy for root domain (`@`)
- [ ] Updated CNAME record in GoDaddy for `www` (if using)
- [ ] Removed old conflicting DNS records
- [ ] Waited 5-10 minutes for propagation
- [ ] Verified "Valid Configuration" in Vercel
- [ ] Tested domain in browser

---

## Additional: Redirect www to Root (or vice versa)

If you want `www.yourdomain.com` to redirect to `yourdomain.com` (or the reverse):

1. In Vercel: **Settings** → **Domains**
2. Click on your domain
3. Configure redirects as needed
4. Vercel will handle the redirect automatically

---

## Summary

1. **Add domain in Vercel** → Get DNS records
2. **Update DNS in GoDaddy** → Add A/CNAME records
3. **Wait for propagation** → 5 minutes to 1 hour
4. **Verify in Vercel** → Should show "Valid Configuration"
5. **Test in browser** → Your site should be live!

Your site will automatically get SSL (HTTPS) from Vercel, and future deployments will work on your custom domain.
