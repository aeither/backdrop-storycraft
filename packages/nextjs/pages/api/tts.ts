import { NextRequest, NextResponse } from "next/server";
import { APIError, ChatCompletion, GPT4VCompletionRequest } from "~~/types/ai";
import errorHandler from "~~/utils/errorHandler";

const elevenlabKey = process.env.ELEVENLABS_KEY;

export interface TextRequestBody {
  text?: string;
}

export const config = {
  runtime: "edge",
};
async function handler(req: NextRequest) {
  const { text } = (await req.json()) as TextRequestBody;
  if (!text) throw new Error("Missing text");
  if (!elevenlabKey) throw new Error("Missing Stability API key.");

  let data;
  const options = {
    method: "POST",
    headers: {
      "xi-api-key": elevenlabKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model_id: "eleven_monolingual_v1", text: text }),
  };

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/VR6AewLTigWG4xSOukaG", options);
    if (!response.ok) {
      console.error(`Server responded with status ${response.status}`);
      return;
    }
    data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json(data);
}

export default errorHandler(handler);

// .blob .createObjectURL, .data
// if (! elevenlabsRes.ok) {
//     throw new Error(`ElevenLabs API Error (${elevenlabsRes.status})`);
//   }
//   const data = (await elevenlabsRes.arrayBuffer()) as any;

//   return { audio: data };
