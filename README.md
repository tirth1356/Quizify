# Autonomous Knowledge Extractor + Quiz Builder

A fully serverless AI web application that extracts key concepts from educational text and generates difficulty-calibrated quiz questions using Google Gemini 2.5 Flash.

## 🚀 Features

- **AI-Powered Knowledge Extraction**: Automatically identifies and organizes key concepts from educational text
- **Adaptive Quiz Generation**: Creates exactly 10 quiz questions tailored to your difficulty preference
- **Intelligent Difficulty Matching**: Questions are carefully calibrated to match your selected difficulty level
- **Self-Validation**: AI performs a built-in quality check to ensure difficulty alignment
- **Dark/Light Mode**: Beautiful UI with automatic dark mode on first visit
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fully Serverless**: No backend server needed—runs entirely on Vercel

## 💡 How It Works

### Architecture

Browser (React UI) → Vercel Serverless Function → Google Gemini API → JSON Response

**Key Point**: The API key is stored securely on the server—never sent to the browser.

## 🛠 Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" (free tier available)
3. Copy the generated key

### 2. Local Development

```bash
cd knowledge-extractor
echo 'GEMINI_API_KEY=<your-key-here>' > .env.local
npm install
npm run dev
```

Visit http://localhost:3000

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Initial commit"
git push origin main
# Then: import repo in Vercel dashboard and set GEMINI_API_KEY env var
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
app/api/process-text/route.ts    # Serverless endpoint (AI processing)
app/components/                  # React components (UI)
app/page.tsx                     # Main page
.env.local                       # Dev environment variables
DEPLOYMENT.md                    # Detailed deployment guide
```

## 🎨 UI Features

- **Color-Coded Difficulty Cards**: Green (easy), Amber (medium), Red (hard)
- **Dark Mode Default**: Automatic dark mode on first visit
- **Responsive Design**: Mobile-first Tailwind CSS
- **Smooth Animations**: Fade-in effects for results

## 🔐 Security

✅ API key never exposed to browser
✅ Serverless functions isolated
✅ Environment variables encrypted by Vercel
✅ HTTPS enforced
✅ No database or user tracking

## 📊 Gemini Single-Prompt Processing

One comprehensive prompt instructs the AI to:
1. Parse text into logical sections
2. Extract key concepts
3. Create topic/subtopic hierarchy
4. Generate 10 difficulty-appropriate questions
5. Self-validate quality and alignment
6. Return strict JSON (no markdown)

## 💰 Cost

- **Gemini API**: Free tier (~1M tokens/month)
- **Vercel**: Free tier (100GB bandwidth)
- **Total**: $0/month

## 🚀 Performance

- First request: ~3-5 seconds (AI processing)
- Subsequent: Same (~3-5 seconds)
- Cold starts: <200ms (Vercel)
- Auto-scaling: Yes

## 📚 Tech Stack

- Frontend: React 19 + TypeScript
- Backend: Next.js 16 serverless
- AI: Google Gemini 2.5 Flash
- Hosting: Vercel
- Styling: Tailwind CSS

## 🔧 Troubleshooting

**"GEMINI_API_KEY is not set"**
- Local: Add key to `.env.local` and restart dev server
- Vercel: Set in Project Settings → Environment Variables

**Quiz generation fails**
- Check API key validity
- Ensure 100+ words of input text
- Check browser Network tab for responses

**Dark mode not working**
- Clear localStorage: `localStorage.clear()`
- Enable JavaScript
- Check browser console (F12)

## 📖 Learn More

- [Google AI Studio](https://aistudio.google.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
