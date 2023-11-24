export interface StabilityAITextToImageResult {
  artifacts: { base64: string }[];
  message?: string;
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
