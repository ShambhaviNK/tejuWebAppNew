import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, feedbackType, feedback, timestamp } = body;

    // Validate required fields
    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    // Prepare feedback data
    const feedbackData = {
      rating: rating || 0,
      feedback_type: feedbackType || "general",
      feedback: feedback.trim(),
      timestamp: timestamp || new Date().toISOString(),
      // Optionally add userAgent and ip if you want to store them
      // user_agent: request.headers.get("user-agent") || "",
      // ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    // Insert into Supabase
    const { error } = await supabase.from("feedback").insert([feedbackData]);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 }
    );
  }
} 