# Fix Vercel Auto-Deploy from GitHub

If your GitHub is linked to Vercel but pushes don't trigger deployments, follow these steps.

---

## Step 1: Check Your Production Branch

Your project uses **`main`** as the main branch. Vercel must be set to deploy from `main`.

### In Vercel:
1. Go to **https://vercel.com/dashboard**
2. Click your **grocery-share.com** project
3. Go to **Settings** (top tab)
4. Click **Git** in the left sidebar
5. Under **Production Branch**, make sure it says **`main`**
6. If it says `master` or something else, change it to **`main`**
7. Click **Save**

---

## Step 2: Check the GitHub Webhook

GitHub tells Vercel about new commits via a **webhook**. If it's missing, no deployments run.

### In GitHub:
1. Go to **https://github.com/keithhokitlam/grocery-share.com**
2. Click **Settings** (repository settings, not your profile)
3. In the left sidebar, click **Webhooks**
4. Look for a webhook whose URL contains **`vercel.com`**
   - Example: `https://api.vercel.com/v1/integrations/deploy/...`

### If you see a Vercel webhook:
- Check that the **Recent Deliveries** show successful (green checkmark) responses
- If they're red/failed, the webhook may be misconfigured — try removing and reconnecting (Step 4)

### If you do NOT see a Vercel webhook:
- The link between GitHub and Vercel is broken
- **Fix:** Reconnect the Git integration (Step 4)

---

## Step 3: Check Vercel GitHub App Permissions

Vercel uses a GitHub App to access your repos. It needs access to **grocery-share.com**.

### In GitHub:
1. Go to **https://github.com/settings/installations**
2. Find **Vercel** in the list
3. Click **Configure**
4. Under **Repository access**:
   - Either **All repositories** is selected, or
   - **Only select repositories** is selected **and** **grocery-share.com** is in the list
5. If **grocery-share.com** is not included, add it
6. Click **Save**

---

## Step 4: Reconnect the Git Integration (Most Reliable Fix)

Reconnecting often fixes webhook and permission issues.

### In Vercel:
1. Go to **https://vercel.com/dashboard**
2. Click your **grocery-share.com** project
3. Go to **Settings** → **Git**
4. Under **Connected Git Repository**:
   - Note which repo is connected (should be `keithhokitlam/grocery-share.com`)
5. Click **Disconnect** (or **Disconnect Repository**)
6. Confirm
7. Click **Connect Git Repository**
8. Choose **GitHub**
9. If asked, authorize Vercel
10. Select **keithhokitlam/grocery-share.com**
11. Leave **Root Directory** blank (or `./`) unless you use a subfolder
12. **Production Branch:** set to **`main`**
13. Click **Connect**

This creates a new webhook in GitHub and re-establishes the link.

### Verify:
1. Make a small change (e.g. add a comment in `src/app/page.tsx`)
2. Commit and push:
   ```bash
   cd "/Users/keithlam/Documents/grocery-share.com"
   git add .
   git commit -m "Test: trigger Vercel deploy"
   git push origin main
   ```
3. In Vercel → **Deployments**, you should see a new deployment start within a minute.

---

## Step 5: Confirm You're Pushing to `main`

Auto-deploy only runs for the branch Vercel uses as Production (usually `main`).

### In Terminal:
```bash
cd "/Users/keithlam/Documents/grocery-share.com"
git branch
```

You should see `* main`. If you're on another branch, Vercel may not auto-deploy that branch.

### When pushing:
```bash
git push origin main
```

Always push to **`main`** if that's your production branch in Vercel.

---

## Step 6: Check Vercel Project ↔ Repo Link

1. In Vercel dashboard, open your **grocery-share.com** project
2. **Settings** → **Git**
3. Confirm:
   - **GitHub** is connected
   - Repository: **keithhokitlam/grocery-share.com**
   - Production Branch: **main**

If the repo or branch is wrong, fix it there or reconnect (Step 4).

---

## Quick Checklist

- [ ] Vercel **Production Branch** = **`main`**
- [ ] GitHub repo **Settings → Webhooks** has a Vercel webhook
- [ ] **GitHub → Settings → Applications → Vercel** has access to **grocery-share.com**
- [ ] You push with `git push origin main`
- [ ] You’ve tried **disconnecting and reconnecting** the Git repo in Vercel

---

## Still Not Working?

1. **Redeploy manually** (to confirm the project itself works):
   - Vercel project → **Deployments**
   - Click the **⋮** on the latest deployment
   - **Redeploy**

2. **Check deployment logs**:
   - Open a deployment
   - Look at **Building** and **Logs** for errors

3. **Vercel status**:
   - Check **https://www.vercel-status.com/** for outages

4. **Create a new Vercel project** (last resort):
   - **Add New** → **Project**
   - Import **keithhokitlam/grocery-share.com** again
   - Set Production Branch to **main**
   - Deploy once, then push a commit and see if auto-deploy works

---

## Summary

Most “no auto-deploy” issues are fixed by:

1. Setting **Production Branch** to **`main`** in Vercel  
2. **Disconnecting and reconnecting** the Git repository in Vercel  
3. Ensuring the **Vercel** GitHub App has access to **grocery-share.com**  
4. Pushing to **`main`** with `git push origin main`

Start with **Step 4 (Reconnect Git)** and **Step 1 (Production Branch)**, then push a test commit.
