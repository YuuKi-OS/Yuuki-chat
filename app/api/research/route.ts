import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Tavily API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Tavily error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      answer: data.answer || "",
      results: (data.results || []).map(
        (r: { title: string; url: string; content: string; score: number }) => ({
          title: r.title,
          url: r.url,
          content: r.content,
          score: r.score,
        })
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
