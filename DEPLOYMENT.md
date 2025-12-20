
### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add a new variable:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** (paste your actual Gemini API key)
   - Make sure the variable is set for "Production" environment
   - Click "Add"

4. **Deploy:**
   - Click "Deploy"
   - Wait for the deployment to complete (~2 minutes)
   - Your app will be live at `https://<your-project>.vercel.app`

#### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
vercel

# When prompted, enter your Gemini API key in the environment variables
```

## How the Serverless Architecture Works


```
knowledge-extractor/
├── app/
│   ├── api/
│   │   └── process-text/
│   │       └── route.ts              # Serverless endpoint - Gemini integration
│   ├── components/
│   │   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   │   └── DifficultySelector.tsx    # Difficulty level buttons
│   ├── page.tsx                      # Main UI component
│   ├── layout.tsx                    # Root layout with dark mode setup
│   └── globals.css                   # Tailwind styles
├── .env.local                         # Local dev env vars (git-ignored)
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind CSS config
└── DEPLOYMENT.md                     # This file
```

