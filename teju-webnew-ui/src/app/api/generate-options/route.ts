import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
var cos_sim = 0;
var answer = "";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache (lives as long as the serverless instance is alive)
const cache: Record<string, string> = {};

interface SpeechResult {
  alternatives?: { transcript: string }[];
}

interface OpenAIChatResult {
  alternatives?: { transcript: string }[];
}

function cosineSimilarity(tensorA: { dot: (arg0: any) => any; norm: () => any; }, tensorB: { transpose: () => any; norm: () => any; }) {
        const dotProduct = tensorA.dot(tensorB.transpose());
        const normA = tensorA.norm();
        const normB = tensorB.norm();
        return dotProduct.div(normA.mul(normB));
}

async function similarityOnAllKeys(prompt: string, cache: { [x: string]: any; }) {
  for(const key in cache) {
    console.log("AAAAAA key: ", key);
    console.log("BBBBBB prompt: ", prompt);
    console.log("CCCCCC cache[key]: ", cache[key]);
    const model = await use.load();
    const sentences = [key, prompt];
    const embeddings = await model.embed(sentences);

    const emb1 = embeddings.slice([0, 0], [1, 512]);
    const emb2 = embeddings.slice([1, 0], [1, 512]);

    const sim = cosineSimilarity(emb1, emb2);
    const result = await sim.data();
    console.log('Cosine similarity:', result[0]);
    if(result[0] > cos_sim) {
        cos_sim = result[0];
        answer = cache[key];
    }
}
}
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // // Check cache first
  // if (cache[prompt]) {
  await similarityOnAllKeys(prompt, cache);
  console.log("HIIHIHIHIHIIHIHIHIHIHIHIIII: cos_sim: ", cos_sim);
  if(cos_sim > 0.5) {
    console.log("HEEEEEEEEEEEEELp");
    return NextResponse.json({ options: answer, cached: true });
  }
  // }
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