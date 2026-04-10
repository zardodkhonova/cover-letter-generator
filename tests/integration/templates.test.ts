import { describe, expect, it } from "vitest";
import { buildPrompt } from "../../src/lib/ai";

describe("buildPrompt", () => {
  it("includes selected template guidance", () => {
    const prompt = buildPrompt({
      fullName: "Jane",
      jobTitle: "Designer",
      companyName: "Acme",
      jobDescription: "Design role",
      tone: "Professional",
      templateId: "design",
    });
    expect(prompt).toContain("Template profile: Product/UX Design");
  });
});
