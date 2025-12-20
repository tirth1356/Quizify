import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, difficulty } = body;

  if (!text || !difficulty) {
    return NextResponse.json(
      { error: 'Missing text or difficulty' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing GROQ_API_KEY env variable' },
      { status: 500 }
    );
  }

  const prompt = `You are an autonomous knowledge extractor and quiz builder.\n\nYou must reply ONLY with a pure, valid JSON object, without any markdown, comments, explanations, or code wrapping. Do NOT prefix or suffix your output, do not use code blocks.\n\nTask: Given the EDUCATIONAL_TEXT and DIFFICULTY below, perform ALL steps using a SINGLE JSON return: clean input, split into sections, extract concepts (with definitions and importance 1-5), organize topic/subtopic hierarchy, generate 10-15 multiple-choice questions (A-D options, only one correct, each marked easy/medium/hard, each mapped to related concepts), and a self-check.\n\nReturn exactly this JSON shape (no markdown):\n{\n  "concepts": [{"name": "", "definition": "", "importance": 1}],\n  "topicHierarchy": [{"topic": "", "subtopics": [{"subtopic": "", "concepts": [""]}]}],\n  "quiz": [{"question": "", "options": ["", "", "", ""], "answer": "A", "difficulty": "easy", "relatedConcepts": [""]}],\n  "selfCheck": "pass"\n}\n\nEDUCATIONAL_TEXT: ${text}\nDIFFICULTY: ${difficulty}`;

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an autonomous knowledge extractor and quiz builder.',
        },
        {
          role: 'user',
          content: prompt,
        }
      ],
      max_tokens: 4096,
      temperature: 0.34
    }),
  });

  if (!groqRes.ok) {
    const text = await groqRes.text();
    return NextResponse.json(
      { error: 'Groq API error', details: text },
      { status: 502 }
    );
  }
  const ret = await groqRes.json();

  // Best effort: groq returns { choices: [{ message: { content } }]}
  let json;
  let content = ret.choices[0].message.content || '';
  // Defensive: Extract first JSON curly block if wrapped in markdown/text
  try {
    // Remove triple backticks and markdown if present
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '').trim();
    }
    // Try to extract first {...} JSON block
    const firstCurly = content.indexOf('{');
    const lastCurly = content.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1) {
      content = content.substring(firstCurly, lastCurly + 1);
    }
    json = JSON.parse(content);
  } catch (e) {
    return NextResponse.json(
      { error: 'AI output was not valid JSON', raw: content?.slice(0, 2000) },
      { status: 500 }
    );
  }
  return NextResponse.json(json);
}

