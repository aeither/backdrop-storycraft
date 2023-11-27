import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { APIError, ChatCompletion, GPT4VCompletionRequest } from "~~/types/ai";
import errorHandler from "~~/utils/errorHandler";

const openaiKey = process.env.OPENAI_KEY;
if (!openaiKey) throw new Error("Missing Stability API key.");

const openai = new OpenAI({
  apiKey: openaiKey,
});

const systemPrompt = `You are an expert story teller. A user will provide you one or more photos and you will return a video script that narrates through the images in a compelling way.
assign each paragraph to the each photo. Respond in a way to help the user use each paragraph to each photo accordingly.`;

export interface TextRequestBody {
  text?: string;
}

export const config = {
  runtime: "edge",
};

// Make sure to set the STABILITY_API_KEY environment variable
const engineId = "stable-diffusion-v1-6";
async function handler(req: NextRequest) {
  const jsonBody = await req.json();
  const { text } = jsonBody as TextRequestBody;

  if (!text) {
    throw new Error("Missing text");
  }

  let mp3Based64;
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    if (mp3.ok) {
      mp3Based64 = Buffer.from(await mp3.arrayBuffer()).toString("base64");
    } else {
      mp3Based64 = { ok: false };
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.json({ data: mp3Based64 });
}

export default errorHandler(handler);
