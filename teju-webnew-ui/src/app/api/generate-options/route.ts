export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { Tensor } from '@tensorflow/tfjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//
// Simple in-memory cache (lives as long as the serverless instance is alive)
const cache: Record<string, string> = {};

// Function to detect and extract user-provided options
function extractUserOptions(text: string): string[] | null {
  // Patterns to match user-provided options
  const optionPatterns = [
    // Pattern 1: "A) option A, B) option B, C) option C, D) option D"
    /(?:^|\s)([A-D]\)\s*[^A-D]+)(?:\s*,\s*([A-D]\)\s*[^A-D]+))?(?:\s*,\s*([A-D]\)\s*[^A-D]+))?(?:\s*,\s*([A-D]\)\s*[^A-D]+))?/gi,
    // Pattern 2: "Option A is..., Option B is..., Option C is..., Option D is..."
    /(?:^|\s)(?:option\s+([A-D])\s+is\s+[^A-D]+)(?:\s*,\s*(?:option\s+([A-D])\s+is\s+[^A-D]+))?(?:\s*,\s*(?:option\s+([A-D])\s+is\s+[^A-D]+))?(?:\s*,\s*(?:option\s+([A-D])\s+is\s+[^A-D]+))?/gi,
    // Pattern 3: "First option is..., Second option is..., Third option is..., Fourth option is..."
    /(?:^|\s)(?:first\s+option\s+is\s+[^,]+)(?:\s*,\s*(?:second\s+option\s+is\s+[^,]+))?(?:\s*,\s*(?:third\s+option\s+is\s+[^,]+))?(?:\s*,\s*(?:fourth\s+option\s+is\s+[^,]+))?/gi,
  ];

  for (const pattern of optionPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length >= 4) {
      // Extract the options from the matches
      const options = matches.slice(1).filter(Boolean);
      if (options.length >= 4) {
        return options.slice(0, 4);
      }
    }
  }

  // Try to find options with more flexible patterns
  const lines = text.split(/[.!?]/).map(line => line.trim()).filter(Boolean);
  const optionLines = lines.filter(line => 
    /^[A-D]\)/.test(line) || 
    /^option\s+[A-D]/i.test(line) ||
    /^(first|second|third|fourth)\s+option/i.test(line)
  );

  if (optionLines.length >= 4) {
    return optionLines.slice(0, 4);
  }

  return null;
}

// Function to format extracted options consistently
function formatOptions(options: string[]): string {
  return options.map((option, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    // Clean up the option text
    let cleanOption = option.replace(/^[A-D]\)\s*/, ''); // Remove existing A), B), etc.
    cleanOption = cleanOption.replace(/^option\s+[A-D]\s+/i, ''); // Remove "option A" etc.
    cleanOption = cleanOption.replace(/^(first|second|third|fourth)\s+option\s+/i, ''); // Remove "first option" etc.
    cleanOption = cleanOption.trim();
    return `${letter}) ${cleanOption}`;
  }).join('\n');
}

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
  const { prompt, regenerate } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // First, check if the user is providing their own options
  const userOptions = extractUserOptions(prompt);
  if (userOptions && userOptions.length >= 4) {
    const formattedOptions = formatOptions(userOptions);
    return NextResponse.json({ 
      options: formattedOptions, 
      cached: false, 
      userProvided: true 
    });
  }

  // If regenerating, skip cache check and generate new options
  if (!regenerate) {
    const { cos_sim, answer } = await similarityOnAllKeys(prompt, cache);
    if(cos_sim > 0.95) {
      return NextResponse.json({ options: answer, cached: true });
    }
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