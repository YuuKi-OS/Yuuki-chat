import { NextRequest, NextResponse } from "next/server";

const HF_MODELS: Record<string, string> = {
  "yuuki-v0.1":
    "https://router.huggingface.co/models/YuuKi-OS/Yuuki-v0.1":
    "https://router.huggingface.co/models/YuuKi-OS/Yuuki-3.7":
    "https://router.huggingface.co/models/YuuKi-OS/Yuuki-best",
};

const YUUKI_API_MODELS: Record<string, string> = {
  "yuuki-v0.1": "yuuki-v0.1",
  "yuuki-3.7": "yuuki-3.7",
  "yuuki-best": "yuuki-best",
};

/**
 * Calls the Yuuki API (yuuki-api.vercel.app) with a yk- token.
 * This is an OpenAI-compatible endpoint.
 */
async function callYuukiApi(
  token: string,
  model: string,
  messages: { role: string; content: string }[]
) {
  const modelId = YUUKI_API_MODELS[model] || "yuuki-best";

  const response = await fetch("https://yuuki-api.vercel.app/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Yuuki API error (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content =
    data.choices?.[0]?.message?.content || data.content || "No response";
  return { content, id: data.id || `chatcmpl-${Date.now()}`, model: modelId };
}

/**
 * Calls HuggingFace Inference API directly with an hf_ token.
 */
async function callHuggingFace(
  token: string,
  model: string,
  messages: { role: string; content: string }[]
) {
  const modelUrl = HF_MODELS[model] || HF_MODELS["yuuki-best"];

  const prompt =
    messages
      .map((m) => {
        if (m.role === "system") return `System: ${m.content}`;
        if (m.role === "user") return `User: ${m.content}`;
        if (m.role === "assistant") return `Assistant: ${m.content}`;
        return m.content;
      })
      .join("\n") + "\nAssistant:";

  const response = await fetch(modelUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HuggingFace error (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  let generatedText = "";

  if (Array.isArray(data) && data[0]?.generated_text) {
    generatedText = data[0].generated_text.trim();
  } else if (typeof data === "string") {
    generatedText = data.trim();
  } else if (data?.generated_text) {
    generatedText = data.generated_text.trim();
  } else {
    generatedText = JSON.stringify(data);
  }

  // Clean up artifacts
  const cutoffs = ["User:", "System:", "\nUser", "\nSystem"];
  for (const cutoff of cutoffs) {
    const idx = generatedText.indexOf(cutoff);
    if (idx > 0) generatedText = generatedText.substring(0, idx).trim();
  }

  return {
    content:
      generatedText ||
      "I received your message but couldn't generate a response. Please try again.",
    id: `chatcmpl-${Date.now()}`,
    model,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model, token, tokenSource } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      );
    }

    const modelKey = model || "yuuki-best";
    if (!HF_MODELS[modelKey]) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    let result;

    if (tokenSource === "demo") {
      // Demo mode: use server-side HF_DEMO_TOKEN directly against HuggingFace
      const demoToken = process.env.HF_DEMO_TOKEN;
      if (!demoToken) {
        return NextResponse.json(
          { error: "Demo token not configured on server" },
          { status: 500 }
        );
      }
      result = await callHuggingFace(demoToken, modelKey, messages);
    } else if (tokenSource === "yuuki-api") {
      // Yuuki API: yk- tokens go to yuuki-api.vercel.app
      if (!token) {
        return NextResponse.json(
          { error: "No API token provided" },
          { status: 401 }
        );
      }
      result = await callYuukiApi(token, modelKey, messages);
    } else if (tokenSource === "huggingface") {
      // HuggingFace: hf_ tokens go directly to HF Inference API
      if (!token) {
        return NextResponse.json(
          { error: "No API token provided" },
          { status: 401 }
        );
      }
      result = await callHuggingFace(token, modelKey, messages);
    } else {
      return NextResponse.json(
        { error: "Invalid token source" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
