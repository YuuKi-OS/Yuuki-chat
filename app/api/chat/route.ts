import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
const HF_MODELS: Record<string, string> = {
  "yuuki-v0.1": "YuuKi-OS/Yuuki-v0.1",
  "yuuki-3.7": "YuuKi-OS/Yuuki-3.7",
  "yuuki-best": "YuuKi-OS/Yuuki-best",
};
=======
const YUUKI_API_URL = "https://opceanai-yuuki-api.hf.space/generate";
>>>>>>> fe68380 (uwu)

const VALID_MODELS = ["yuuki-best", "yuuki-3.7", "yuuki-v0.1"];

/**
 * Calls the Yuuki API hosted on HuggingFace Spaces.
 * Open platform — no token required.
 */
async function callYuukiAPI(
  messages: { role: string; content: string }[],
  model: string
) {
  // Build a prompt from the message history
  const prompt = messages
    .map((m) => {
      if (m.role === "system") return `System: ${m.content}`;
      if (m.role === "user") return `User: ${m.content}`;
      if (m.role === "assistant") return `Assistant: ${m.content}`;
      return m.content;
    })
    .join("\n") + "\nAssistant:";

  const response = await fetch(YUUKI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      max_new_tokens: 512,
      temperature: 0.7,
      model,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Yuuki API error (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();

<<<<<<< HEAD
/**
 * Calls HuggingFace Inference API via the new router.huggingface.co endpoint.
 * Uses the OpenAI-compatible chat completions format.
 */
async function callHuggingFace(
  token: string,
  model: string,
  messages: { role: string; content: string }[]
) {
  const modelId = HF_MODELS[model] || HF_MODELS["yuuki-best"];
  const url = `https://router.huggingface.co/hf-inference/models/${modelId}/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HuggingFace error (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content =
    data.choices?.[0]?.message?.content?.trim() || "No response generated.";
=======
  // Handle various response formats from the HF Space
  let generatedText = "";

  if (typeof data === "string") {
    generatedText = data.trim();
  } else if (data?.generated_text) {
    generatedText = data.generated_text.trim();
  } else if (data?.response) {
    generatedText = data.response.trim();
  } else if (data?.output) {
    generatedText = data.output.trim();
  } else if (Array.isArray(data) && data[0]?.generated_text) {
    generatedText = data[0].generated_text.trim();
  } else {
    generatedText = JSON.stringify(data);
  }

  // Clean up conversational artifacts
  const cutoffs = ["User:", "System:", "\nUser", "\nSystem"];
  for (const cutoff of cutoffs) {
    const idx = generatedText.indexOf(cutoff);
    if (idx > 0) generatedText = generatedText.substring(0, idx).trim();
  }
>>>>>>> fe68380 (uwu)

  return {
    content,
    id: data.id || `chatcmpl-${Date.now()}`,
    model,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      );
    }

    const modelKey = model || "yuuki-best";
    if (!VALID_MODELS.includes(modelKey)) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const result = await callYuukiAPI(messages, modelKey);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
