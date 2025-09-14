export function persianNormalize(str: string): string {
  return str
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "")
    .trim();
}
