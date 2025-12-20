# Quizify

Quizify is a serverless AI-powered web application that converts long educational text into structured knowledge and quiz questions automatically.

The entire application runs as a single frontend deployment using serverless functions. No separate backend server or database is required.

---
## Live Demo

Vercel Deployment Link:  
[https://quizify067.vercel.app](https://quizify067.vercel.app/)

---

## What This App Does

- Takes a long educational text as input (chapter, notes, article)
- Extracts key concepts and definitions
- Organizes concepts into topics and subtopics
- Generates quiz questions based on the content
- Assigns difficulty levels (easy, medium, hard)
- Allows the user to choose the type of questions:
  - Easy only
  - Medium only
  - Hard only
  - Mixed
- Displays results with difficulty-based color hover effects
- Supports dark and light mode (dark mode by default)

---

## How It Works (High Level)

1. The user pastes educational text into the web app
2. The user selects the desired question difficulty
3. The frontend sends the request to a serverless API route
4. The serverless function calls the LLaMA API
5. The AI processes the text using an internal multi-step reasoning pipeline
6. A structured JSON response is generated
7. The frontend renders concepts, hierarchy, and quiz questions

---

## AI Model Used

- **LLaMA API**
- The AI is responsible for:
  - Text segmentation
  - Concept extraction
  - Hierarchy generation
  - Quiz creation
  - Difficulty classification
  - Internal consistency validation

All AI calls are executed on the server side using serverless API routes.

---

## Serverless Architecture

- Built using **Next.js (App Router)**
- Backend logic runs as **serverless API routes**
- Frontend and backend exist in the same project
- No database or persistent storage
- API keys are stored securely using environment variables
- Deployed as a single application on Vercel

---

## How the API Response Is Generated

- The serverless API route sends a structured prompt to the LLaMA API
- The AI performs all reasoning steps in one request
- The response is returned as strict JSON
- The frontend parses the JSON and displays the output visually

---

## Notes

- This project is intentionally stateless
- Focus is on AI reasoning and content generation
- Designed for fast, reliable demos and hackathon use
