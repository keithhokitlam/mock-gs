# Set Up GitHub Authentication (No More Password Prompts!)

## Option 1: Use SSH Keys (Recommended - Best Long-term Solution)

SSH keys let you push to GitHub without entering credentials every time.

### Step 1: Check if you already have SSH keys

```bash
ls -la ~/.ssh
```

Look for files named `id_rsa` and `id_rsa.pub` (or `id_ed25519` and `id_ed25519.pub`).

### Step 2: Generate SSH key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

- Press Enter to accept the default file location
- Press Enter twice to skip the passphrase (or set one if you want extra security)
- This creates two files: `~/.ssh/id_ed25519` (private) and `~/.ssh/id_ed25519.pub` (public)

### Step 3: Copy your public key

```bash
cat ~/.ssh/id_ed25519.pub
```

- This will show your public key (starts with `ssh-ed25519`)
- **Copy the entire output** (it's one long line)

### Step 4: Add SSH key to GitHub

1. Go to **https://github.com/settings/keys**
2. Click **New SSH key**
3. **Title:** Give it a name like "MacBook Air"
4. **Key:** Paste your public key (the one you copied)
5. Click **Add SSH key**
6. Enter your GitHub password to confirm

### Step 5: Change your Git remote from HTTPS to SSH

```bash
cd "/Users/keithlam/Documents/grocery-share.com"
git remote -v
```

You'll see something like:
```
origin  https://github.com/keithhokitlam/grocery-share.com.git (fetch)
origin  https://github.com/keithhokitlam/grocery-share.com.git (push)
```

Change it to SSH:
```bash
git remote set-url origin git@github.com:keithhokitlam/grocery-share.com.git
```

Verify it changed:
```bash
git remote -v
```

Should now show:
```
origin  git@github.com:keithhokitlam/grocery-share.com.git (fetch)
origin  git@github.com:keithhokitlam/grocery-share.com.git (push)
```

### Step 6: Test it

```bash
git push origin main
```

You should **NOT** be asked for username/password! ✅

---

## Option 2: Use Git Credential Helper (Quick Fix)

This stores your credentials so you only enter them once.

### Step 1: Enable credential helper

```bash
git config --global credential.helper osxkeychain
```

This stores your credentials in macOS Keychain.

### Step 2: Push once (enter credentials this time)

```bash
cd "/Users/keithlam/Documents/grocery-share.com"
git push origin main
```

- Enter your GitHub username
- Enter your Personal Access Token (when asked for password)

### Step 3: Future pushes

From now on, `git push` won't ask for credentials - they're stored in Keychain! ✅

**Note:** If you change your GitHub password or token, you'll need to update it in Keychain:
- Open **Keychain Access** app
- Search for "github.com"
- Delete the old entry
- Push again to save new credentials

---

## Option 3: Use GitHub CLI (Alternative)

GitHub CLI handles authentication automatically.

### Step 1: Install GitHub CLI

```bash
brew install gh
```

(If you don't have Homebrew, install it first: https://brew.sh)

### Step 2: Login

```bash
gh auth login
```

- Choose **GitHub.com**
- Choose **HTTPS**
- Choose **Yes** to authenticate Git with GitHub
- Choose **Login with a web browser**
- Copy the code and press Enter
- It will open your browser - authorize it
- Done!

### Step 3: Test

```bash
cd "/Users/keithlam/Documents/grocery-share.com"
git push origin main
```

No credentials needed! ✅

---

## Which Option Should You Choose?

| Option | Best For | Pros | Cons |
|--------|----------|------|------|
| **SSH Keys** | Long-term use, most secure | Most secure, works everywhere, no prompts | Takes 5 minutes to set up |
| **Credential Helper** | Quick fix, already using HTTPS | Fast setup, works immediately | Stored in Keychain (less secure) |
| **GitHub CLI** | If you use GitHub features | Handles everything automatically | Requires Homebrew installation |

**Recommendation:** Use **SSH Keys** (Option 1) - it's the standard way developers authenticate with GitHub.

---

## Troubleshooting

### SSH: "Permission denied (publickey)"
- Make sure you added your **public** key (`id_ed25519.pub`) to GitHub, not the private one
- Check that your remote URL uses `git@github.com`, not `https://github.com`
- Try: `ssh -T git@github.com` to test your connection

### Credential Helper: Still asking for password
- Make sure you ran: `git config --global credential.helper osxkeychain`
- Try deleting the old credential from Keychain Access and push again

### GitHub CLI: "command not found"
- Make sure you installed it: `brew install gh`
- If you don't have Homebrew, use Option 1 (SSH) or Option 2 (Credential Helper) instead

---

## Quick Reference

**Check your current remote URL:**
```bash
git remote -v
```

**Change to SSH:**
```bash
git remote set-url origin git@github.com:keithhokitlam/grocery-share.com.git
```

**Change back to HTTPS:**
```bash
git remote set-url origin https://github.com/keithhokitlam/grocery-share.com.git
```

**Enable credential caching:**
```bash
git config --global credential.helper osxkeychain
```
