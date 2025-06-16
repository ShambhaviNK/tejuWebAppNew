import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache (lives as long as the serverless instance is alive)
const cache: Record<string, string> = {};

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
  // Check cache first
  if (cache[prompt]) {
    return NextResponse.json({ options: cache[prompt], cached: true });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant. For any question provided, generate exactly four distinct multiple-choice options. Each option must start with A), B), C), or D), and each must be on a new line. Do not include explanations or answers, only the options." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
      n: 1,
    });
    const text = completion.choices[0].message?.content || "";
    cache[prompt] = text; // Store in cache
    return NextResponse.json({ options: text, cached: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 