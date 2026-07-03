import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rating, name, phone, staffExperience, comments } = data;

    // Validate required fields
    if (!rating || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("GOOGLE_SCRIPT_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error: Google Script URL not configured" },
        { status: 500 }
      );
    }

    // Forward data to Google Apps Script (which writes to Google Sheets)
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, name, phone, staffExperience, comments }),
    });

    if (!response.ok) {
      throw new Error(`Google Script responded with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return NextResponse.json({ success: true, message: "Feedback saved successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
