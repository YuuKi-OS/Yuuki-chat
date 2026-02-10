import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      key: apiKey,
      maxResults: "5",
      type: "video",
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `YouTube error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const data = await response.json();

    const videos = (data.items || []).map(
      (item: {
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          channelTitle: string;
          thumbnails: { medium: { url: string } };
        };
      }) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
      })
    );

    return NextResponse.json({ videos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
