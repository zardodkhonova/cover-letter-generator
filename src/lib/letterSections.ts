/** Split full letter into opening / body / closing for section editors */
export function splitLetterIntoSections(full: string): {
  opening: string;
  body: string;
  closing: string;
} {
  const blocks = full
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (blocks.length === 0) {
    return { opening: "", body: "", closing: "" };
  }
  if (blocks.length === 1) {
    return { opening: blocks[0], body: "", closing: "" };
  }
  if (blocks.length === 2) {
    return { opening: blocks[0], body: "", closing: blocks[1] };
  }
  const opening = blocks[0];
  const closing = blocks[blocks.length - 1];
  const body = blocks.slice(1, -1).join("\n\n");
  return { opening, body, closing };
}

export function joinSections(opening: string, body: string, closing: string): string {
  return [opening, body, closing].filter((s) => s.trim().length > 0).join("\n\n");
}
