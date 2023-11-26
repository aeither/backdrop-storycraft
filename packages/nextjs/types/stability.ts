export interface StabilityAITextToImageResult {
  artifacts: { base64: string }[];
  message?: string;
}

interface File {
  type: "image" | "audio" | "any";
  src: string;
}

export interface TextToImageResponse {
  files: File[];
}

export type MessageContent = {
  role?: string;
  text?: string;
  files?: MessageFile[];
  html?: string;
  _sessionId?: string;
};

export type MessageFileType = "image" | "audio" | "any";

export type MessageFile = { src?: string; name?: string; type?: MessageFileType };
