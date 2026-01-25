# Complete Guide: Pushing to GitHub and Deploying to Vercel

## Part 1: Push Changes to GitHub

### Step 1: Check Your Changes

1. **Open Terminal** (press `Command + Space`, type "Terminal", press Enter)

2. **Go to your project folder:**
   ```
   cd "/Users/keithlam/Documents/grocery-share.com"
   ```

3. **See what files you changed:**
   ```
   git status
   ```
   - This shows you which files have been modified
   - Files in red are changed but not saved to Git yet

### Step 2: Add Your Changes

1. **Add specific files** (recommended):
   ```
   git add src/app/page.tsx src/app/mastertable/page.tsx
   ```
   - This adds only the files you want to save

2. **OR add all changes** (if you want to save everything):
   ```
   git add .
   ```
   - The `.` means "all files"

### Step 3: Commit Your Changes

1. **Save your changes with a message:**
   ```
   git commit -m "Description of what you changed"
   ```
   - Example: `git commit -m "Change nav bar to blue"`
   - The message should describe what you did

### Step 4: Push to GitHub

1. **Push your changes:**
   ```
   git push origin main
   ```
   - This sends your changes to GitHub

2. **If it asks for your username:**
   - Type your GitHub username
   - Press Enter

3. **If it asks for a password:**
   - **IMPORTANT:** You cannot use your regular GitHub password
   - You need a "Personal Access Token" (see below)

---

## Part 2: Setting Up GitHub Authentication

### Why You Need This:
GitHub no longer accepts passwords. You need a special token instead.

### How to Create a Personal Access Token:

1. **Go to GitHub in your browser:**
   - Visit: https://github.com/settings/tokens
   - Make sure you're logged into GitHub

2. **Create a new token:**
   - Click "Generate new token"
   - Click "Generate new token (classic)"

3. **Fill in the form:**
   - **Note:** Give it a name like "MacBook Development" or "My Mac"
   - **Expiration:** Choose how long it should last (90 days, 1 year, or no expiration)
   - **Select scopes:** Check the box that says **"repo"**
     - This gives access to your repositories
     - You might see it automatically check some boxes - that's fine

4. **Generate the token:**
   - Scroll down and click "Generate token" (green button at the bottom)

5. **Copy the token:**
   - **IMPORTANT:** Copy the token immediately
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!
   - Save it somewhere safe (like Notes app or a password manager)

6. **Use the token:**
   - When Terminal asks for a password, paste this token instead
   - You won't see anything as you type - that's normal for passwords

### Alternative: Use GitHub CLI (Easier Method)

If you want an easier way, you can install GitHub CLI:

1. **Install GitHub CLI:**
   ```
   brew install gh
   ```
   (You need Homebrew installed first - if you don't have it, use the token method above)

2. **Login:**
   ```
   gh auth login
   ```
   - Follow the prompts
   - It will open your browser to authenticate

3. **After that, you can push without entering credentials:**
   ```
   git push origin main
   ```

---

## Part 3: Deploying to Vercel

### Option A: Vercel is Already Connected (Automatic Deployment)

If your Vercel project is already connected to your GitHub repository:

1. **After you push to GitHub:**
   - Vercel automatically detects the push
   - It starts building your project
   - It deploys the changes automatically

2. **Check your deployment:**
   - Go to: https://vercel.com/dashboard
   - Click on your project
   - You'll see a new deployment starting
   - Wait 1-3 minutes for it to finish
   - When it's done, you'll see "Ready" or "Production"

3. **View your live site:**
   - Click on the deployment
   - Click "Visit" or use the URL shown
   - Your changes should be live!

### Option B: Setting Up Vercel for the First Time

If you haven't connected Vercel yet:

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with your GitHub account (easiest way)

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Find your repository: `keithhokitlam/grocery-share.com`
   - Click "Import"

3. **Configure your project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** Leave as is (or set to `./` if needed)
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `.next` (should be auto-filled)
   - **Install Command:** `npm install` (should be auto-filled)

4. **Environment Variables (if needed):**
   - If your project needs any secret keys or API keys, add them here
   - For this project, you probably don't need any

5. **Deploy:**
   - Click "Deploy"
   - Wait 1-3 minutes
   - When it's done, you'll get a URL like: `https://grocery-share.com`

6. **Automatic deployments:**
   - From now on, every time you push to GitHub, Vercel will automatically deploy
   - You don't need to do anything else!

---

## Complete Workflow Example

Here's the complete process from making a change to seeing it live:

### 1. Make your changes
- Edit files in your code editor
- Save the files

### 2. Test locally
```
cd "/Users/keithlam/Documents/grocery-share.com"
npm run dev
```
- Go to `http://localhost:3000` to see your changes
- Make sure everything looks good

### 3. Push to GitHub
```
cd "/Users/keithlam/Documents/grocery-share.com"
git add .
git commit -m "Description of your changes"
git push origin main
```
- Enter your GitHub username
- Enter your Personal Access Token (when asked for password)

### 4. Wait for Vercel
- Go to https://vercel.com/dashboard
- Watch your project deploy (takes 1-3 minutes)
- Click "Visit" to see your live site

---

## Troubleshooting

### "Permission denied" when pushing:
- Make sure you're using a Personal Access Token, not your password
- Check that the token has "repo" scope selected

### "Repository not found":
- Make sure you're logged into the correct GitHub account
- Check that the repository exists at: https://github.com/keithhokitlam/grocery-share.com

### Vercel deployment fails:
- Check the deployment logs in Vercel dashboard
- Look for error messages (usually in red)
- Common issues:
  - Build errors (check your code)
  - Missing environment variables
  - Wrong build settings

### Changes not showing on Vercel:
- Make sure you pushed to the `main` branch
- Wait a few minutes for the deployment to finish
- Try hard refresh in browser: `Command + Shift + R`
- Check that Vercel is connected to the right GitHub branch

### "Authentication failed":
- Your token might have expired
- Create a new Personal Access Token
- Or use GitHub CLI: `gh auth login`

---

## Quick Reference Commands

```bash
# Go to project folder
cd "/Users/keithlam/Documents/grocery-share.com"

# Check what changed
git status

# Add all changes
git add .

# Save changes
git commit -m "Your message here"

# Push to GitHub
git push origin main

# Check GitHub connection
git remote -v
```

---

## Security Tips

1. **Never share your Personal Access Token**
   - Treat it like a password
   - Don't commit it to your code
   - Don't share it with others

2. **Use tokens with limited scope**
   - Only give the permissions you need
   - For this project, "repo" is enough

3. **Set expiration dates**
   - Don't make tokens that never expire
   - Refresh them periodically

4. **Revoke old tokens**
   - If you think a token is compromised, revoke it
   - Go to: https://github.com/settings/tokens
   - Click on the token and click "Revoke"

---

## Need Help?

If you get stuck:
1. Read the error message carefully
2. Check which step you're on
3. Make sure you completed all previous steps
4. Check the troubleshooting section above

Good luck! 🚀
