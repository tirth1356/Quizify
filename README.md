# 🎓 Quizify by Team Velocity

**Turn educational content into structured knowledge and quizzes!**  

Quizify is a smart web app that converts your educational text into organized concepts and generates quizzes automatically. It’s perfect for students, teachers, or anyone who wants to learn efficiently.  

✨ Hosted live: [Quizify on Vercel](https://quizify067.vercel.app)  
🎥 Tutorial video: *Ready to watch!*  

---

## 🔹 Features

- 🧠 **Concept Extraction** – Breaks down large educational content into structured concepts.  
- ❓ **Quiz Generation** – Generates multiple-choice and practice questions from your content.  
- ⚡ **AI Powered** – Uses the Groq API (powered by LLaMA 3.1) for understanding and processing text.  
- 🎨 **Human-Friendly UI** – Clean, intuitive, and visually attractive interface for easy interaction.  
- 💻 **Responsive Design** – Works beautifully on mobile, tablet, and desktop.  

---

## 🛠 How It Works

1. You paste or upload educational content.  
2. The app sends the content to the **Groq API**, which processes it and extracts key concepts.  
3. Concepts are visualized in a **heatmap** or **hierarchy tree**.  
4. You can generate quizzes based on difficulty levels (Easy, Medium, Hard, or Mixed).  
5. Results appear instantly, ready to practice or share!  

All AI processing happens **serverless**, so you don’t need to manage a backend – only the frontend is hosted, but it communicates seamlessly with the Groq API.  

---

## 📁 File Structure

Quizify/
├─ app/
│ ├─ components/
│ │ ├─ ConceptHeatmap.tsx
│ │ ├─ DifficultySelector.tsx
│ │ └─ HierarchyTree.tsx
│ ├─ page.tsx
│ └─ layout.tsx
├─ public/
├─ styles/
│ └─ globals.css
├─ package.json
├─ tsconfig.json
└─ README.md


---

## ❤️ Team

Made with ❤️ by **Tirth Patel & Divy Mevada**  

Check out the source on GitHub: [View on GitHub](https://github.com/tirth1356/Quizify)  

---

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS  
- **AI Processing:** Groq API (LLaMA 3.1)  
- **Deployment:** Vercel  
- **Languages:** TypeScript & JavaScript  
- **State Management:** React Hooks  

---

## 🌟 Why Quizify?

- Saves time converting notes into quizzes.  
- Makes learning interactive and visual.  
- Lightweight, serverless, and responsive.  
- Great for self-study or classroom use!  

---

Enjoy learning smarter with Quizify! 🎉
