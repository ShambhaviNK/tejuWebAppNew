import { NextRequest, NextResponse } from "next/server";

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

    // Here you would typically save to a database
    // For now, we'll log it and you can implement database storage later
    const feedbackData = {
      rating: rating || 0,
      feedbackType: feedbackType || "general",
      feedback: feedback.trim(),
      timestamp: timestamp || new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    console.log("Feedback received:", feedbackData);

    // You can implement database storage here
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('feedback')
    //   .insert([feedbackData]);

    // For now, we'll just return success
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