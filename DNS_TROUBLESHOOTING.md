# DNS Troubleshooting: Invalid Configuration

## Quick Fix Steps

### Step 1: Check Vercel Dashboard
1. Go to **https://vercel.com/dashboard**
2. Click your **grocery-share.com** project
3. Go to **Settings** → **Domains**
4. Click on each domain (`grocery-share.com` and `www.grocery-share.com`)
5. **Copy the exact DNS records** Vercel shows you need

### Step 2: Verify GoDaddy DNS Records

**For `grocery-share.com` (root domain):**
- Should have an **A Record**
- **Name/Host:** `@` (or leave blank/empty)
- **Value/Points to:** Should be the IP address(es) Vercel provided
- **TTL:** 600 or 3600

**For `www.grocery-share.com`:**
- Should have a **CNAME Record**
- **Name/Host:** `www`
- **Value/Points to:** Should be the CNAME value Vercel provided (e.g., `cname.vercel-dns.com` or similar)
- **TTL:** 600 or 3600

### Step 3: Common Mistakes to Check

❌ **Wrong record type:**
- Root domain (`grocery-share.com`) should be **A Record**, NOT CNAME
- `www` should be **CNAME**, NOT A Record

❌ **Wrong Name/Host:**
- Root domain: Use `@` or leave blank (NOT `grocery-share.com`)
- www: Use exactly `www` (NOT `www.grocery-share.com`)

❌ **Wrong Value:**
- A Record: Must be IP addresses (numbers like `76.76.21.21`), NOT a domain
- CNAME: Must be a domain (like `cname.vercel-dns.com`), NOT an IP

❌ **Extra spaces or typos:**
- Copy-paste the exact values from Vercel
- No trailing dots or spaces

❌ **Conflicting records:**
- Delete any old A or CNAME records pointing to other values
- Only keep the Vercel records

### Step 4: Update Records in GoDaddy

1. **Go to GoDaddy DNS Management:**
   - https://www.godaddy.com → My Products → Your Domain → DNS

2. **For Root Domain (`grocery-share.com`):**
   - Find or create **A Record**
   - **Name:** `@` (or blank)
   - **Value:** [IP address from Vercel]
   - If Vercel gave multiple IPs, create multiple A records (one per IP)

3. **For www:**
   - Find or create **CNAME Record**
   - **Name:** `www`
   - **Value:** [CNAME value from Vercel]

4. **Delete conflicting records:**
   - Remove any A/CNAME records that don't match Vercel's requirements
   - Remove any records pointing to old hosting/IPs

5. **Save changes**

### Step 5: Wait and Verify

1. **Wait 5-15 minutes** for DNS propagation
2. **Check Vercel Dashboard:**
   - Settings → Domains
   - Status should change from "Invalid Configuration" to "Valid Configuration"
3. **If still invalid after 15 minutes:**
   - Double-check you copied the exact values from Vercel
   - Verify no typos or extra spaces
   - Make sure you're editing the correct domain in GoDaddy

### Step 6: Verify DNS Records (Advanced)

You can check if your DNS records are correct using command line:

```bash
# Check A record for root domain
dig grocery-share.com A

# Check CNAME for www
dig www.grocery-share.com CNAME
```

Or use online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

Enter your domain and check if the records match what Vercel expects.

---

## Still Not Working?

1. **Screenshot your GoDaddy DNS records** and compare with Vercel's requirements
2. **Contact Vercel support** - they can help verify the configuration
3. **Try removing and re-adding the domain** in Vercel (Settings → Domains → Remove, then add again)

---

## Example: What It Should Look Like

**In GoDaddy DNS:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 600 |
| A | @ | 76.76.21.22 | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

*(Note: Your actual IPs and CNAME will be different - use what Vercel shows you)*
