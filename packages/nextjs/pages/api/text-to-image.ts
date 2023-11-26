import { NextRequest, NextResponse } from "next/server";
import { StabilityAITextToImageResult } from "~~/types/stability";
import errorHandler from "~~/utils/errorHandler";

export interface TextRequestBody {
  text?: string;
}

export const config = {
  runtime: "edge",
};

// Make sure to set the STABILITY_API_KEY environment variable
const engineId = "stable-diffusion-v1-6";

async function handler(req: NextRequest) {
  const { text } = (await req.json()) as TextRequestBody;
  console.log("🚀 ~ file: text-to-image.ts:18 ~ handler ~ text:", text);

  if (!text) throw "No Text Provided";

  const descriptionBody = { text_prompts: [{ text }] };

  const result = await fetch(`https://api.stability.ai/v1/generation/${engineId}/text-to-image`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(descriptionBody),
  });

  const stabilityAIResult = (await result.json()) as StabilityAITextToImageResult;
  if (stabilityAIResult.message) throw stabilityAIResult.message;

  console.log("🚀 ~ file: text-to-image.ts:18 ~ handler ~ text:", stabilityAIResult.message);
  return NextResponse.json({
    files: [{ type: "image", src: `data:image/png;base64,${stabilityAIResult.artifacts[0].base64}` }],
  });
}

export default errorHandler(handler);
