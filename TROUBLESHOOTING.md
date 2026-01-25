# Troubleshooting: localhost:3000 Not Showing Anything

## Step 1: Check if the Dev Server is Actually Running

### What to Look For:
When you run `npm run dev`, you should see something like this in Terminal:

```
▲ Next.js 16.1.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

### If You DON'T See This:
- The server might not have started
- There might be an error message
- Look for red text in Terminal

### What to Do:
1. **Make sure you're in the right folder:**
   - Type: `pwd`
   - Should show: `/Users/keithlam/Documents/grocery-share.com`

2. **Try starting the server again:**
   - Type: `npm run dev`
   - Press Enter
   - Wait 10-20 seconds
   - Look for the "Ready" message

---

## Step 2: Check for Error Messages

### Common Errors and Solutions:

#### Error: "Port 3000 is already in use"
**What it means:** Something else is using port 3000

**Solution:**
1. Stop the current server (press `Control + C` in Terminal)
2. Try a different port:
   ```
   npm run dev -- -p 3001
   ```
3. Then go to: `http://localhost:3001` instead

#### Error: "Cannot find module" or "Module not found"
**What it means:** Dependencies aren't installed properly

**Solution:**
1. Stop the server (`Control + C`)
2. Delete node_modules and reinstall:
   ```
   rm -rf node_modules
   npm install
   ```
3. Then try `npm run dev` again

#### Error: "EADDRINUSE" or "Address already in use"
**What it means:** Port 3000 is busy

**Solution:**
- Use a different port (see above)
- Or find what's using port 3000 and stop it

---

## Step 3: Check Your Browser

### Make Sure You're Using the Right Address:
- ✅ Correct: `http://localhost:3000`
- ❌ Wrong: `https://localhost:3000` (don't use https)
- ❌ Wrong: `localhost:3000` (missing http://)
- ❌ Wrong: `http://127.0.0.1:3000` (might work, but try localhost first)

### Try These:
1. **Clear your browser cache:**
   - Press `Command + Shift + R` (hard refresh)
   - Or close and reopen the browser tab

2. **Try a different browser:**
   - If using Safari, try Chrome
   - If using Chrome, try Safari

3. **Check if the page is loading:**
   - Look at the browser's address bar
   - Does it show "localhost:3000"?
   - Is there a loading spinner?

---

## Step 4: Check Terminal Output

### What You Should See When It Works:
```
▲ Next.js 16.1.3
- Local:        http://localhost:3000

✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 500ms
```

### If You See Errors:
- Copy the error message
- Look for red text
- The error will tell you what's wrong

---

## Step 5: Verify Everything is Installed

### Check Node.js:
```
node --version
```
Should show: `v20.x.x` or `v18.x.x` or similar

### Check npm:
```
npm --version
```
Should show: `10.x.x` or `9.x.x` or similar

### Check if dependencies are installed:
```
ls node_modules
```
Should show a long list of folders (not an error)

---

## Step 6: Try a Fresh Start

If nothing else works, try this complete reset:

1. **Stop the server:**
   - Press `Control + C` in Terminal

2. **Go to your project folder:**
   ```
   cd "/Users/keithlam/Documents/grocery-share.com"
   ```

3. **Clean everything:**
   ```
   rm -rf node_modules
   rm -rf .next
   ```

4. **Reinstall:**
   ```
   npm install
   ```

5. **Start fresh:**
   ```
   npm run dev
   ```

6. **Wait for "Ready" message, then open browser**

---

## Step 7: Check What's Actually Happening

### While the server is running, check:

1. **Is Terminal showing any activity?**
   - When you open `localhost:3000` in browser
   - Terminal should show new lines appearing
   - This means the browser is talking to the server

2. **What does the browser show?**
   - Blank white page?
   - Error message?
   - "This site can't be reached"?
   - Loading forever?

3. **Check browser console:**
   - Press `F12` or `Command + Option + I`
   - Click "Console" tab
   - Look for red error messages
   - Copy any errors you see

---

## Quick Checklist

Before asking for help, check:

- [ ] Did you run `npm install` first?
- [ ] Are you in the correct folder (`/Users/keithlam/Documents/grocery-share.com`)?
- [ ] Is the server showing "Ready" in Terminal?
- [ ] Are you using `http://localhost:3000` (not https)?
- [ ] Did you wait 10-20 seconds after starting the server?
- [ ] Is there any red error text in Terminal?
- [ ] Did you try a hard refresh (`Command + Shift + R`)?

---

## Still Not Working?

If none of this helps, please tell me:
1. What you see in Terminal when you run `npm run dev`
2. What you see in your browser (blank page? error? something else?)
3. Any error messages (copy them exactly)
4. What step you're stuck on
