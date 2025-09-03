import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET handler to fetch all events
export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch events");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST handler to create a new event
export async function POST(request: Request) {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized - No session found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const eventData = await request.json();

    // Prepare the event data for the FastAPI backend
    const eventWithUser = {
      ...eventData,
      user_id: session?.data?.session?.user?.id,
      registered: 0,
    };

    // Call the FastAPI backend to create the event
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.session?.access_token}`,
        },
        body: JSON.stringify(eventWithUser),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("API Error:", error);
      throw new Error(
        `Failed to create event: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating event:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
