<img width="311" height="65" alt="image" src="https://github.com/user-attachments/assets/9ea078f1-943f-4606-b066-472845234c3e" />


**Turn educational content into structured knowledge and quizzes!**  

Quizify is a smart web app that converts your educational text into organized concepts and generates quizzes automatically. It’s perfect for students, teachers, or anyone who wants to learn efficiently.  

✨ Hosted live: [Quizify on Vercel](https://quizify067.vercel.app)  
🎥 Tutorial video: [*Ready to watch!* ](https://youtu.be/fihg7uMRoX8) 
---
## FLOWCHART
<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/40474af5-2acb-4cbe-afd6-39e929ddade1" /> 



---

## 🔹 Features

- 🧠 **Concept & Question Extraction** – Breaks down your educational content into key concepts and stores them like a structured map for easy reference.
- 📊 **Hierarchical Topic Ranking** – Organizes topics and subtopics in a clear hierarchy, helping you see the big picture and drill down into details.
- ❓ **Smart Quiz Generation** – Automatically creates 3–15 questions per topic, with selectable difficulty levels: Easy, Medium, Hard, or Mixed.
- 📈 **Weak Point Analysis** – After completing a quiz, highlights the concepts you need to focus on for improvement.
- ⚡ Fast & Serverless – Generates responses quickly (1.3–8 seconds) on a fully serverless website, no lag, just instant results.
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

Quizify/ <br>
├─ app/ <br>
│ ├─ components/ <br>
│ │ ├─ ConceptHeatmap.tsx <br>
│ │ ├─ DifficultySelector.tsx <br>
│ │ └─ HierarchyTree.tsx <br>
│ ├─ page.tsx <br>
│ └─ layout.tsx <br>
├─ public/ <br>
├─ styles/ <br>
│ └─ globals.css <br>
├─ package.json <br>
├─ tsconfig.json <br>
└─ README.md <br>


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
---

## ❤️ Team

Made with ❤️ by **Tirth Patel & Divy Mevada**  
Enjoy learning smarter with Quizify! 🎉
