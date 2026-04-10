import { describe, expect, it } from "vitest";
import { joinSections, splitLetterIntoSections } from "../../src/lib/letterSections";

describe("letter section helpers", () => {
  it("splits text into opening/body/closing", () => {
    const src = "Hello\n\nMain one\n\nMain two\n\nBye";
    const out = splitLetterIntoSections(src);
    expect(out.opening).toBe("Hello");
    expect(out.body).toContain("Main one");
    expect(out.closing).toBe("Bye");
  });

  it("joins sections with double newline", () => {
    expect(joinSections("a", "b", "c")).toBe("a\n\nb\n\nc");
  });
});
