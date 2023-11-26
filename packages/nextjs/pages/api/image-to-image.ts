import { NextRequest, NextResponse } from "next/server";
import { StabilityAITextToImageResult } from "~~/types/stability";
import errorHandler from "~~/utils/errorHandler";

export const config = {
  runtime: "edge",
};

// Note: The current engine ID "stable-diffusion-v1-6" does not support image-to-image conversion at this time.

// const engineId = "stable-diffusion-v1-6";
const engineId = "stable-diffusion-xl-1024-v1-0";
const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey = process.env.STABILITY_API_KEY;

if (!apiKey) throw new Error("Missing Stability API key.");

// You can use an example image here: https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png
async function handler(req: NextRequest) {
  // Files are stored inside a form using Deep Chat request FormData format:
  // https://deepchat.dev/docs/connect
  //   const reqFormData = await req.formData();
  //   const file = reqFormData.get("files") as Blob;
  const { imageUrl, prompt } = await req.json();
  console.log("🚀 ~ file: image-to-image.ts:25 ~ handler ~ imageUrl:", imageUrl);
  const response = await fetch(imageUrl);
  const imageData = await response.blob();

  // const imageData = await getBase64("https://i.imgur.com/irlLOUx.png");
  const imageFile = new File([imageData], "image.png", { type: "image/png" });
  if (!imageFile) throw "Error text from message1 undefined";

  const imageToImageFormData = new FormData();

  imageToImageFormData.append("init_image", imageFile, "image.png");
  imageToImageFormData.append("init_image_mode", "IMAGE_STRENGTH");
  imageToImageFormData.append("image_strength", "0.35");
  imageToImageFormData.append("text_prompts[0][text]", prompt);
  imageToImageFormData.append("text_prompts[0][weight]", "1");
  // imageToImageFormData.append("width", "1024");
  // imageToImageFormData.append("height", "1024");
  imageToImageFormData.append("cfg_scale", "7");
  imageToImageFormData.append("samples", "1");
  imageToImageFormData.append("steps", "30");

  const result = await fetch(`${apiHost}/v1/generation/${engineId}/image-to-image`, {
    // Be careful not to overwrite Content-Type headers as the Boundary header will not be automatically set
    headers: { Authorization: `Bearer ${apiKey}` },
    method: "POST",
    body: imageToImageFormData as unknown as string, // This gets rid of the type error for fetch
  });

  const stabilityAIResult = (await result.json()) as StabilityAITextToImageResult;
  if (stabilityAIResult.message) throw stabilityAIResult.message;
  // Sends response back to Deep Chat using the Response format:
  // https://deepchat.dev/docs/connect/#Response
  return NextResponse.json({
    type: "image",
    src: `data:image/png;base64,${stabilityAIResult.artifacts[0].base64}`,
  });
}

export default errorHandler(handler);
