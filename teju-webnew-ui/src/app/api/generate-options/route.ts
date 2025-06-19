export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { Tensor } from '@tensorflow/tfjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Simple in-memory cache (lives as long as the serverless instance is alive)
const cache: Record<string, string> = {};

function cosineSimilarity(
  tensorA: Tensor,
  tensorB: Tensor
) {
  const dotProduct = tensorA.dot(tensorB.transpose());
  const normA = tensorA.norm();
  const normB = tensorB.norm();
  return dotProduct.div(normA.mul(normB));
}

async function similarityOnAllKeys(prompt: string, cache: { [x: string]: unknown }) {
  const tf = await import('@tensorflow/tfjs');
  const use = await import('@tensorflow-models/universal-sentence-encoder');
  let cos_sim = 0;
  let answer = "";
  for(const key in cache) {
    const model = await use.load();
    const sentences = [key, prompt];
    const embeddings = await model.embed(sentences);
    const emb1 = tf.slice(embeddings as unknown as Tensor, [0, 0], [1, 512]);
    const emb2 = tf.slice(embeddings as unknown as Tensor, [1, 0], [1, 512]);
    const sim = cosineSimilarity(emb1, emb2) as Tensor;
    const result = await sim.data();
    if(result[0] > cos_sim) {
        cos_sim = result[0];
        answer = cache[key] as string;
    }
  }
  return { cos_sim, answer };
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const { cos_sim, answer } = await similarityOnAllKeys(prompt, cache);
  if(cos_sim > 0.85) {
    return NextResponse.json({ options: answer, cached: true });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are an expert at generating high-quality multiple choice options. For any question provided, generate exactly four distinct, well-thought-out multiple-choice options that are relevant and meaningful. Each option must start with A), B), C), or D), and each must be on a new line. Make the options clear, concise, and directly related to the question. Do not include explanations or answers, only the options." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
      n: 1,
    });
    const text = completion.choices[0].message?.content || "";
    const temp = text.replace(/\\n/g, "\n");
    cache[prompt] = temp; // Store in cache
    return NextResponse.json({ options: temp, cached: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}