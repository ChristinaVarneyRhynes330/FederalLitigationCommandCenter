# Litigation Command Center

A comprehensive, enterprise-grade legal dashboard for litigation management with AI-powered assistants, evidence tracking, and case management tools.

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Gemini API key from [Google AI Studio](https://aistudio.google.com/api-keys)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Litigation Command Center"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Build Command: `vite build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variable:**
   - In Project Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyAR8otilLUAz9mPJkUY8kj8bmtUbeSsBf70`
   - Apply to: **Production**, **Preview**, and **Development**

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `your-project.vercel.app`

### Step 3: Automatic Deployments

Once connected, every push to `main` branch will automatically deploy to Vercel! 🎉

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys! ✨
```

---

## 🔧 Local Development

### Install Dependencies
```bash
npm install
```

### Add API Key (Local)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📦 Features

- **Dashboard**: Docket clock with case tracking
- **Evidence Vault**: Bates-stamped exhibit management
- **AI Legal Team**: 8 specialized AI assistants (Strategist, Drafter, Clerk, Negotiator, Examiner, Analyst, Judge Simulator, Emergency Triage)
- **Logistics**: Deposition scheduling and witness management
- **Hearing Mode**: Virtual courtroom presentation
- **Finance**: Budget tracking and billing
- **Law Library**: Legal research with AI assistance
- **Discovery Manager**: Document production tracking
- **Trial Binder**: Organized exhibit presentation

---

## 🎨 Design System

**Night Winter Palette:**
- Rose Gold Brand: `#9F5166`
- Deep Navy (Rhino): `#2e386b`
- Muted Teal (Viridian): `#408f86`
- Bright Teal Accent (Java): `#24bca3`
- Light Mint (Humming Bird): `#e0fbf8`

---

## 🔐 Security Note

**NEVER commit your `.env` file to GitHub!** The `.gitignore` file protects your API key locally. For production, always use Vercel's Environment Variables dashboard.

---

## 📱 Responsive Design

Fully optimized for:
- Desktop (1920px+)
- Laptop (1280px)
- Tablet (768px)
- Mobile (375px)

---

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS 4.0** for styling
- **Gemini 2.0 Flash** AI integration
- **Recharts** for data visualization
- **Lucide React** for icons

---

## 📄 License

Personal use only.

---

## 🆘 Troubleshooting

### Build fails on Vercel?
- Check that `package.json`, `vite.config.ts`, and `tsconfig.json` exist
- Verify `VITE_GEMINI_API_KEY` is set in Vercel Environment Variables

### API not working?
- Verify API key is correct
- Check Gemini API quota at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Open browser console for error messages

### Blank page after deploy?
- Check Vercel build logs for errors
- Ensure all imports use correct paths (case-sensitive!)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## 🎯 Current Project Status

✅ **Completed:**
- Full React migration from HTML
- Complete Gemini API integration
- Professional "corporate luxury" design overhaul
- Night Winter color palette implementation
- GitHub + Vercel deployment setup
- Environment variable configuration

🔜 **Next Steps:**
- Add Supabase for cloud storage (multi-device access)
- Real-time collaboration features
- Document upload and OCR processing
- Calendar integration for deadlines

---

Built with ⚖️ by a litigator, for litigators.
