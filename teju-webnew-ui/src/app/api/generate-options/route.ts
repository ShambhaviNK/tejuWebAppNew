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
    const optimizedPrompt = prompt.length > 200 ? prompt.substring(0, 200) + "..." : prompt;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Faster model for speed
      messages: [
        { 
          role: "system", 
          content: "Generate exactly 4 multiple choice options (A, B, C, D). Keep options concise. Format: A) option B) option C) option D) option" 
        },
        { role: "user", content: optimizedPrompt },
      ],
      max_tokens: 100, // Reduced for speed
      temperature: 0.5, // Lower temperature for more consistent results
      n: 1,
      presence_penalty: 0, // Disable penalties for speed
      frequency_penalty: 0,
    });
    
    const text = completion.choices[0].message?.content || "";
    const temp = text.replace(/\\n/g, "\n");
    
    // Store in cache with timestamp
    cache[prompt] = { data: temp, timestamp: Date.now() };
    
    return NextResponse.json({ options: temp, cached: false });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}