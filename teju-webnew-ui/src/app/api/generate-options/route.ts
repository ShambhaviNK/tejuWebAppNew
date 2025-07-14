export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced cache with TTL and size limits
const cache: Record<string, { data: string; timestamp: number }> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 1000; // Maximum cache entries

// Function to detect and extract user-provided options
function extractUserOptions(text: string): string[] | null {
  // Patterns to match user-provided options
  const optionPatterns = [
    // Pattern 1: "A) option A, B) option B, C) option C, D) option D, E) option E"
    /(?:^|\s)([A-E]\)\s*[^A-E]+)(?:\s*,\s*([A-E]\)\s*[^A-E]+))?(?:\s*,\s*([A-E]\)\s*[^A-E]+))?(?:\s*,\s*([A-E]\)\s*[^A-E]+))?(?:\s*,\s*([A-E]\)\s*[^A-E]+))?/gi,
    // Pattern 2: "Option A is..., Option B is..., Option C is..., Option D is..., Option E is..."
    /(?:^|\s)(?:option\s+([A-E])\s+is\s+[^A-E]+)(?:\s*,\s*(?:option\s+([A-E])\s+is\s+[^A-E]+))?(?:\s*,\s*(?:option\s+([A-E])\s+is\s+[^A-E]+))?(?:\s*,\s*(?:option\s+([A-E])\s+is\s+[^A-E]+))?(?:\s*,\s*(?:option\s+([A-E])\s+is\s+[^A-E]+))?/gi,
    // Pattern 3: "First option is..., Second option is..., Third option is..., Fourth option is..., Fifth option is..."
    /(?:^|\s)(?:first\s+option\s+is\s+[^,]+)(?:\s*,\s*(?:second\s+option\s+is\s+[^,]+))?(?:\s*,\s*(?:third\s+option\s+is\s+[^,]+))?(?:\s*,\s*(?:fourth\s+option\s+is\s+[^,]+))?(?:\s*,\s*(?:fifth\s+option\s+is\s+[^,]+))?/gi,
  ];

  for (const pattern of optionPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length >= 5) {
      // Extract the options from the matches
      const options = matches.slice(1).filter(Boolean);
      if (options.length >= 5) {
        return options.slice(0, 5);
      }
    }
  }

  // Try to find options with more flexible patterns
  const lines = text.split(/[.!?]/).map(line => line.trim()).filter(Boolean);
  const optionLines = lines.filter(line => 
    /^[A-E]\)/.test(line) || 
    /^option\s+[A-E]/i.test(line) ||
    /^(first|second|third|fourth|fifth)\s+option/i.test(line)
  );

  if (optionLines.length >= 5) {
    return optionLines.slice(0, 5);
  }

  return null;
}

// Function to format extracted options consistently
function formatOptions(options: string[]): string {
  return options.map((option, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D, E
    // Clean up the option text
    let cleanOption = option.replace(/^[A-E]\)\s*/, ''); // Remove existing A), B), etc.
    cleanOption = cleanOption.replace(/^option\s+[A-E]\s+/i, ''); // Remove "option A" etc.
    cleanOption = cleanOption.replace(/^(first|second|third|fourth|fifth)\s+option\s+/i, ''); // Remove "first option" etc.
    cleanOption = cleanOption.trim();
    return `${letter}) ${cleanOption}`;
  }).join('\n');
}

// Optimized cache management
function cleanCache() {
  const now = Date.now();
  const keys = Object.keys(cache);
  
  // Remove expired entries
  for (const key of keys) {
    if (now - cache[key].timestamp > CACHE_TTL) {
      delete cache[key];
    }
  }
  
  // If still too many entries, remove oldest
  const remainingKeys = Object.keys(cache);
  if (remainingKeys.length > MAX_CACHE_SIZE) {
    const sortedKeys = remainingKeys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
    const keysToRemove = sortedKeys.slice(0, remainingKeys.length - MAX_CACHE_SIZE);
    for (const key of keysToRemove) {
      delete cache[key];
    }
  }
}

// Simple and fast similarity check (no TensorFlow)
function simpleSimilarity(prompt1: string, prompt2: string): number {
  const words1 = new Set(prompt1.toLowerCase().split(/\s+/));
  const words2 = new Set(prompt2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Fast cache lookup without TensorFlow
function fastCacheLookup(prompt: string): { found: boolean; data: string } {
  cleanCache(); // Clean cache periodically
  
  let bestMatch = { similarity: 0, data: "" };
  
  for (const [key, value] of Object.entries(cache)) {
    const similarity = simpleSimilarity(prompt, key);
    if (similarity > bestMatch.similarity) {
      bestMatch = { similarity, data: value.data };
    }
  }
  
  return {
    found: bestMatch.similarity > 0.9, 
    data: bestMatch.data
  };
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req: NextRequest) {
  const { prompt, regenerate } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // First, check if the user is providing their own options
  const userOptions = extractUserOptions(prompt);
  if (userOptions && userOptions.length >= 3) {
    // Take only the first 3 options, shuffle them, then add "Something else" as the 4th
    const limitedUserOptions = userOptions.slice(0, 3);
    const shuffledUserOptions = shuffleArray(limitedUserOptions);
    shuffledUserOptions.push("Something else");
    const formattedOptions = formatOptions(shuffledUserOptions);
    return NextResponse.json({ 
      options: formattedOptions, 
      cached: false, 
      userProvided: true 
    });
  }

  // Always check cache first (unless explicitly regenerating)
  if (!regenerate) {
    const cacheResult = fastCacheLookup(prompt);
    if (cacheResult.found) {
      return NextResponse.json({ options: cacheResult.data, cached: true });
    } else {
      console.log('No cache hit, will generate new options');
    }
  } else {
    console.log('Regenerate requested, skipping cache check');
  }
  
  try {
    // Optimize prompt for faster generation
    // const optimizedPrompt = prompt.length > 200 ? prompt.substring(0, 200) + "..." : prompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Faster model for speed
      messages: [
        { 
          role: "system", 
          content: "Generate exactly 3 multiple choice options (A, B, C). Keep options concise. Format each option on a separate line:\nA) [option text]\nB) [option text]\nC) [option text]\n\nIf the question is a yes/no question, use these options:\nA) Yes\nB) No\nC) Maybe" 
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 100, // Reduced for speed
      temperature: 0.5, // Lower temperature for more consistent results
      n: 1,
      presence_penalty: 0, // Disable penalties for speed
      frequency_penalty: 0,
    });
    
    const text = completion.choices[0].message?.content || "";
    const temp = text.replace(/\\n/g, "\n");

    // Parse options from the AI response, shuffle, then format
    const lines = temp.split(/\n|\r/).filter((line: string) => line.trim());
    const aiOptions = lines.slice(0, 3).map((line: string) => {
      const match = line.match(/^[A-C]\)\s*(.*)$/);
      return match ? match[1].trim() : line.trim();
    });
    
    // Shuffle only the first 3 options, then add "Something else" as the 4th
    const shuffledAIOptions = shuffleArray(aiOptions);
    shuffledAIOptions.push("Something else");
    const formattedAIOptions = formatOptions(shuffledAIOptions);

    // Store in cache with timestamp (store the formatted/shuffled options)
    cache[prompt] = { data: formattedAIOptions, timestamp: Date.now() };

    return NextResponse.json({ options: formattedAIOptions, cached: false });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}