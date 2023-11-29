import { NextRequest, NextResponse } from "next/server";
import { APIError, ChatCompletion, GPT4VCompletionRequest } from "~~/types/ai";
import errorHandler from "~~/utils/errorHandler";

const openaiKey = process.env.OPENAI_KEY;
if (!openaiKey) throw new Error("Missing Stability API key.");

const systemPrompt = `You are an expert story teller. A user will provide you one or more photos and you will return a video script that narrates through the images in a compelling way.
assign each paragraph to the each photo. Respond in a way to help the user use each paragraph to each photo accordingly.`;

export interface TextRequestBody {
  imageUrls?: string[];
}

export const config = {
  runtime: "edge",
};

// Make sure to set the STABILITY_API_KEY environment variable
const engineId = "stable-diffusion-v1-6";

async function handler(req: NextRequest) {
  const { imageUrls } = (await req.json()) as TextRequestBody;
  console.log("🚀 ~ file: vision.ts:24 ~ handler ~ imageUrls:", imageUrls);
  if (!imageUrls) throw new Error("Missing imageUrl");

  const imageObjects: string | { type: "image_url"; image_url: string }[] = [];

  for (const imageUrl of imageUrls) {
    imageObjects.push({
      type: "image_url",
      image_url: imageUrl,
    });
  }

  const body: GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          "Describe the images in a few sentences. Add excitement and emotion to the story. Be concise and clear. The story should connect seamlessly from one image to the next.",
          ...imageObjects,
        ],
      },
    ],
  };
  console.log("🚀 ~ file: vision.ts:53 ~ handler ~ body:", body);

  let result = null;
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (resp.ok) {
      const json: ChatCompletion = await resp.json();
      result = { ...json, ok: true };
    } else {
      const json: APIError = await resp.json();
      result = { ...json, ok: false };
    }
  } catch (e) {
    console.log(e);
  }

  console.log("🚀 ~ file: vision.ts:81 ~ handler ~ result:", result);
  return NextResponse.json(result);
}

export default errorHandler(handler);
