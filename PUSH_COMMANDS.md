# Terminal Commands: Push to GitHub and Vercel

## Step 1: Open Terminal and go to your project

```bash
cd "/Users/keithlam/Documents/mock-gs"
```

---

## Step 2: Check what changed (optional)

```bash
git status
```

This shows which files you modified.

---

## Step 3: Add your changes

**Add only the nav bar files:**
```bash
git add src/app/page.tsx src/app/mastertable/page.tsx
```

**OR add everything that changed:**
```bash
git add .
```

---

## Step 4: Commit with a message

```bash
git commit -m "Change nav bar to blue"
```

(You can change the message between the quotes.)

---

## Step 5: Push to GitHub

```bash
git push origin main
```

- If it asks for **username**: enter your GitHub username  
- If it asks for **password**: paste your **Personal Access Token** (not your GitHub password)

---

## Step 6: Vercel (automatic)

If Vercel is connected to your GitHub repo:

1. **Vercel deploys automatically** when you push to `main`
2. Go to **https://vercel.com/dashboard**
3. Open your **mock-gs** project
4. Check **Deployments** — a new deployment should appear within 1–2 minutes
5. When it says **Ready**, your live site is updated

---

## All commands in one block (copy & paste)

```bash
cd "/Users/keithlam/Documents/mock-gs"
git add .
git commit -m "Change nav bar to blue"
git push origin main
```

Run these one at a time, or paste the whole block. When prompted, use your GitHub username and Personal Access Token.

---

## If you get "Permission denied" or "Authentication failed"

You need a **GitHub Personal Access Token**:

1. Go to **https://github.com/settings/tokens**
2. **Generate new token** → **Generate new token (classic)**
3. Name it (e.g. "MacBook")
4. Check **repo**
5. **Generate token** → copy it
6. When Terminal asks for a password, **paste the token** (you won’t see it as you type)

---

## Summary

| Step | Command |
|------|---------|
| 1. Go to project | `cd "/Users/keithlam/Documents/mock-gs"` |
| 2. Add changes | `git add .` |
| 3. Commit | `git commit -m "Change nav bar to blue"` |
| 4. Push to GitHub | `git push origin main` |
| 5. Vercel | Auto-deploys from GitHub (check dashboard) |
