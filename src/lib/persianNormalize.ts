import { normalizeText } from "./normalize";

export function persianNormalize(input: string): string {
  return normalizeText(input)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[^\u0600-\u06FF0-9A-Za-z\s]/g, "")
    .toLowerCase();
}

