# Complete Mac Setup Guide for Your Project

## What This Guide Does
This guide will help you set up your project on your new MacBook so you can:
- Work on your code
- Save changes to GitHub
- Run your project

---

## Step 1: Install Git (The Tool That Talks to GitHub)

### What is Git?
Git is a tool that helps you save your code to GitHub (like a cloud backup for your code).

### How to Install Git:

**Option A: Using Terminal (Recommended)**
1. **Open Terminal** (the app where you type commands):
   - Press `Command + Space` (hold both keys together)
   - Type "Terminal" and press Enter
   - A black window will open - this is Terminal

2. **Install Git**:
   - Copy and paste this command into Terminal:
     ```
     xcode-select --install
     ```
   - Press Enter
   - A pop-up window will appear asking if you want to install "Command Line Developer Tools"
   - Click "Install"
   - Wait for it to finish (this might take 10-20 minutes)
   - When it's done, you'll see a message saying "The software was installed"

**Option B: Install Xcode (Alternative)**
- Open the App Store on your Mac
- Search for "Xcode"
- Click "Get" or "Install"
- This is a bigger download but includes Git

### Verify Git is Installed:
1. In Terminal, type this and press Enter:
   ```
   git --version
   ```
2. If you see something like "git version 2.x.x", it worked! ✅
3. If you see an error, wait a bit longer for the installation to finish, then try again

---

## Step 2: Tell Git Who You Are

### Why This is Needed:
GitHub needs to know who is making changes to your code.

### How to Do It:

1. **Open Terminal** (if not already open)

2. **Set Your Name**:
   - Type this command (replace "Your Name" with your actual name):
     ```
     git config --global user.name "Your Name"
     ```
   - Press Enter
   - Example: `git config --global user.name "Keith Lam"`

3. **Set Your Email**:
   - Type this command (replace with your GitHub email):
     ```
     git config --global user.email "your.email@example.com"
     ```
   - Press Enter
   - **Important**: Use the same email address you use for your GitHub account
   - Example: `git config --global user.email "keith@example.com"`

4. **Check That It Worked**:
   - Type: `git config --global user.name`
   - Press Enter - it should show your name
   - Type: `git config --global user.email`
   - Press Enter - it should show your email

---

## Step 3: Install Node.js (The Tool That Runs Your Project)

### What is Node.js?
Node.js lets you run your project on your computer. Your project needs it to work.

### How to Install Node.js:

**Option A: Download from Website (Easiest)**
1. Open your web browser (Safari, Chrome, etc.)
2. Go to: https://nodejs.org/
3. You'll see two big green buttons
4. Click the one that says "LTS" (it stands for "Long Term Support" - the stable version)
5. The file will download (it's called something like "node-v20.x.x.pkg")
6. Find the downloaded file in your Downloads folder
7. Double-click it to open
8. Follow the installation wizard:
   - Click "Continue" on each screen
   - When it asks for your password, enter your Mac password
   - Click "Install Software"
   - Wait for it to finish
   - Click "Close" when done

**Option B: Using Homebrew (If you have it)**
- If you don't know what Homebrew is, use Option A instead
- Open Terminal and type: `brew install node`
- Press Enter

### Verify Node.js is Installed:
1. Open Terminal
2. Type: `node --version`
3. Press Enter
4. You should see something like "v20.x.x" - this means it worked! ✅
5. Also type: `npm --version`
6. Press Enter
7. You should see something like "10.x.x" - this also worked! ✅

---

## Step 4: Navigate to Your Project Folder

### What This Means:
You need to tell Terminal where your project is located on your computer.

### How to Do It:

1. **Open Terminal** (if not already open)

2. **Go to Your Project Folder**:
   - Type this command exactly:
     ```
     cd "/Users/keithlam/Documents/mock-gs"
     ```
   - Press Enter
   - The `cd` command means "change directory" (go to a folder)
   - You won't see anything happen, but you're now "inside" your project folder

3. **Verify You're in the Right Place**:
   - Type: `pwd`
   - Press Enter
   - It should show: `/Users/keithlam/Documents/mock-gs`
   - If it does, you're in the right place! ✅

**Alternative: Drag and Drop Method (Easier!)**
1. Type `cd ` (with a space after "cd")
2. Open Finder
3. Go to Documents folder
4. Find the "mock-gs" folder
5. Drag the "mock-gs" folder into the Terminal window
6. Press Enter

---

## Step 5: Install Your Project's Dependencies

### What Are Dependencies?
These are extra pieces of code your project needs to work. Think of them like ingredients for a recipe.

### How to Do It:

1. **Make Sure You're in Your Project Folder** (from Step 4)

2. **Install Everything**:
   - Type: `npm install`
   - Press Enter
   - This will take a few minutes (maybe 2-5 minutes)
   - You'll see lots of text scrolling by - that's normal!
   - Wait until you see your prompt again (the `$` or `%` at the end)
   - When it's done, you should see something like "added 500 packages" or similar

3. **If You See Errors**:
   - If you see red text with "ERROR", try these:
     - Make sure you completed Step 3 (Node.js is installed)
     - Try typing `npm install` again
     - If it still doesn't work, let me know what the error says

---

## Step 6: Test Your Connection to GitHub

### What This Does:
This checks if your computer can talk to GitHub and see your code.

### How to Do It:

1. **Make Sure You're in Your Project Folder** (from Step 4)

2. **Check Your GitHub Connection**:
   - Type: `git remote -v`
   - Press Enter
   - You should see:
     ```
     origin  https://github.com/keithhokitlam/mock-gs.git (fetch)
     origin  https://github.com/keithhokitlam/mock-gs.git (push)
     ```
   - This means your project knows where to find GitHub! ✅

3. **Get the Latest Code from GitHub**:
   - Type: `git fetch origin`
   - Press Enter
   - This downloads information about your code (but doesn't change anything yet)
   - If it works, you won't see any errors

4. **Check Your Project Status**:
   - Type: `git status`
   - Press Enter
   - This shows you if your local files match what's on GitHub
   - You might see "Your branch is up to date" or a list of files that changed

---

## Step 7: Test Running Your Project

### What This Does:
This starts your project so you can see it in your web browser.

### How to Do It:

1. **Make Sure You're in Your Project Folder** (from Step 4)

2. **Start Your Project**:
   - Type: `npm run dev`
   - Press Enter
   - You'll see text scrolling, and then you should see something like:
     ```
     ▲ Next.js 16.1.3
     - Local:        http://localhost:3000
     ```
   - This means your project is running! ✅

3. **View Your Project**:
   - Open your web browser
   - Go to: `http://localhost:3000`
   - You should see your project!

4. **Stop Your Project**:
   - Go back to Terminal
   - Press `Control + C` (hold Control and press C)
   - This stops the project from running

---

## Common Commands You'll Use

Here are the commands you'll use most often:

### To Work on Your Project:
- `cd "/Users/keithlam/Documents/mock-gs"` - Go to your project folder
- `npm run dev` - Start your project
- `Control + C` - Stop your project

### To Save Changes to GitHub:
- `git status` - See what files you changed
- `git add .` - Prepare all your changes to be saved
- `git commit -m "Description of what you changed"` - Save changes locally
- `git push` - Send your changes to GitHub

### Example of Saving Changes:
```
git add .
git commit -m "Updated the homepage"
git push
```

---

## Troubleshooting

### "Command not found" Error:
- This means the tool isn't installed yet
- Go back to the step that installs that tool
- Make sure the installation finished completely

### "Permission denied" Error:
- You might need to enter your Mac password
- Type it when prompted (you won't see the characters as you type - that's normal!)

### "Already exists" or "Already installed":
- That's okay! It means you already have it
- You can skip that step

### Can't Find Terminal:
- Press `Command + Space`
- Type "Terminal"
- Press Enter

### Can't Find Your Project:
- Open Finder (the blue face icon in your dock)
- Go to Documents folder
- Look for "mock-gs" folder

---

## What Was Already Fixed

I already updated some settings in your project to work better on Mac:
- ✅ Updated Git settings for Mac (file permissions, case sensitivity, etc.)
- ✅ Your GitHub connection is already set up
- ✅ Your project structure is ready for Mac

---

## Need Help?

If you get stuck:
1. Read the error message carefully
2. Check which step you're on
3. Make sure you completed all previous steps
4. Try the troubleshooting section above

Good luck! 🚀
