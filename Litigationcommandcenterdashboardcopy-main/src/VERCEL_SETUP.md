# 🎯 Vercel Dashboard Setup Guide

## Visual Walkthrough for Adding Environment Variables

---

## Step 1: Navigate to Your Project

**After importing your GitHub repo:**

```
Vercel Dashboard
├── Your Projects
│   └── FSCLitigationCommandCenter [Select This]
```

**You should see:**
```
┌─────────────────────────────────────────┐
│  FSCLitigationCommandCenter             │
│  ─────────────────────────────          │
│  [Overview] [Deployments] [Settings]    │
└─────────────────────────────────────────┘
```

---

## Step 2: Go to Environment Variables

**Click:** Settings → Environment Variables

```
Settings Menu
├── General
├── Domains  
├── Environment Variables  ← CLICK HERE
├── Git
└── Functions
```

---

## Step 3: Add Your API Key

**You'll see:**
```
┌──────────────────────────────────────────────┐
│  Environment Variables                        │
│  ──────────────────────                       │
│  Add a new variable below                     │
│                                               │
│  Name:   [________________]                   │
│  Value:  [________________]                   │
│                                               │
│  Environments:                                │
│  □ Production  □ Preview  □ Development       │
│                                               │
│  [Add]                                        │
└──────────────────────────────────────────────┘
```

**Fill in:**
```
Name:   VITE_GEMINI_API_KEY
Value:  AIzaSyAR8otilLUAz9mPJkUY8kj8bmtUbeSsBf70

Environments:
☑ Production  ☑ Preview  ☑ Development

[Add] ← CLICK
```

---

## Step 4: Verify It Was Added

**You should now see:**
```
┌──────────────────────────────────────────────┐
│  Environment Variables (1)                    │
│  ──────────────────────                       │
│                                               │
│  VITE_GEMINI_API_KEY                          │
│  AIza••••••••••••••••••••••••f70              │
│  Production, Preview, Development             │
│  [Edit] [Remove]                              │
│                                               │
└──────────────────────────────────────────────┘
```

✅ **Success!** The value is hidden for security.

---

## Step 5: Redeploy (If Already Deployed)

**If you already deployed before adding the env variable:**

1. **Go to:** Deployments tab
2. **Find:** Latest deployment
3. **Click:** Three dots (⋯) → "Redeploy"
4. **Confirm:** "Redeploy"

**Why?** Environment variables only apply to NEW deployments.

---

## 🎯 Alternative: Add During Initial Setup

**When first importing from GitHub:**

```
┌──────────────────────────────────────────────┐
│  Configure Project                            │
│  ──────────────────────                       │
│  Framework Preset: Vite                       │
│  Root Directory: ./                           │
│  Build Command: vite build                    │
│  Output Directory: dist                       │
│                                               │
│  ▼ Environment Variables (Optional)           │
│    Name:  VITE_GEMINI_API_KEY                │
│    Value: AIzaSyAR8otilLUAz9mPJkUY8kj8bmtUbe │
│                                               │
│    Environments:                              │
│    ☑ Production ☑ Preview ☑ Development      │
│                                               │
│  [Deploy]                                     │
└──────────────────────────────────────────────┘
```

**This way, the API key is configured BEFORE first deployment!**

---

## 🔍 Troubleshooting

### ❌ "Environment variable not found in build"

**Problem:** Added variable AFTER deployment

**Solution:**
1. Go to Deployments
2. Click ⋯ on latest deployment
3. Click "Redeploy"
4. Wait for new build to complete

---

### ❌ "API key is required" error in production

**Problem:** Variable name doesn't match code

**Check:**
- Name MUST be exactly: `VITE_GEMINI_API_KEY` (case-sensitive!)
- Prefix MUST be `VITE_` (required for Vite environment variables)

**Fix:**
1. Go to Settings → Environment Variables
2. Remove wrong variable
3. Add new variable with correct name
4. Redeploy

---

### ❌ Variable shows in code

**Problem:** Trying to use environment variable incorrectly

**Correct usage in React/TypeScript:**
```typescript
// ✅ CORRECT
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

// ❌ WRONG
const apiKey = process.env.VITE_GEMINI_API_KEY  // This is Node.js, not Vite!
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use `VITE_` prefix for client-side variables
- Add to all three environments (Production, Preview, Development)
- Keep API keys in Vercel dashboard, not in code
- Use `.gitignore` to protect `.env` file locally

### ❌ DON'T:
- Commit `.env` to GitHub
- Share API keys in public repos
- Hard-code API keys in source files
- Use `process.env` (that's Node.js, not Vite)

---

## 📊 Environment Variable Types

| Prefix | Where Available | Example |
|--------|----------------|---------|
| `VITE_` | Client-side (browser) | `VITE_GEMINI_API_KEY` |
| No prefix | Server-side only | `DATABASE_URL` |

**For your app:** Use `VITE_` because Gemini API calls happen in the browser.

---

## 🎯 Final Checklist

Before deploying, verify:

- [ ] Environment variable name is EXACTLY `VITE_GEMINI_API_KEY`
- [ ] Value is your actual Gemini API key (starts with `AIza`)
- [ ] All three checkboxes are selected:
  - [ ] Production
  - [ ] Preview
  - [ ] Development
- [ ] Variable is saved (shows in the list)
- [ ] If already deployed, you've triggered a redeploy

---

## 🚀 Expected Build Output

**After adding environment variable and deploying:**

```
Running "vercel build"
Vercel CLI 49.1.2

Installing dependencies...
✓ Packages installed

Running "npm run build"
✓ TypeScript compiled
✓ Vite build complete

dist/index.html                   0.45 kB
dist/assets/index-xyz.css        45.67 kB
dist/assets/index-abc.js        234.56 kB

✅ Build Completed
🚀 Deployment Ready

Preview: https://fsc-litigation-xyz.vercel.app
```

**Check the logs - should NOT see:**
- ❌ "API key is required"
- ❌ "Environment variable not found"
- ❌ Any authentication errors

---

## ✅ Verification

**Test your deployed app:**

1. Visit your production URL
2. Open browser console (F12)
3. Type: `import.meta.env.VITE_GEMINI_API_KEY`
4. Should NOT be `undefined`

**Or just:**
1. Open Settings in your app
2. API key field should be pre-filled ✨
3. Try asking an AI assistant a question
4. Should get a response (not an error)

---

## 🎉 Done!

Your environment variable is configured and your app has secure access to the Gemini API.

**Remember:** 
- Local development: Uses `.env` file
- Vercel deployment: Uses dashboard environment variables
- Both work automatically with `import.meta.env.VITE_GEMINI_API_KEY`

**No code changes needed!** The same code works in both environments. 🎯
