/** Simulated network + AI latency */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export type MockParams = {
  fullName: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  tone: string;
};

function toneParagraph(tone: string): string {
  switch (tone) {
    case "Friendly":
      return "I genuinely enjoy collaborating across teams and turning fuzzy ideas into something people can use. I bring curiosity, empathy, and a bias toward shipping small wins that compound.";
    case "Bold":
      return "I lead with ownership: I set direction, unblock others, and deliver outcomes—not slide decks. I'm looking for a team that moves fast and rewards initiative.";
    default:
      return "My background aligns with the scope of this role: structured execution, stakeholder communication, and consistent delivery in high-expectation environments.";
  }
}

/**
 * Returns a multi-paragraph cover letter (mock) for typing / editing flows.
 */
export async function mockGenerateCoverLetter(params: MockParams): Promise<string> {
  await delay(1600 + Math.random() * 600);
  const { fullName, companyName, jobTitle, jobDescription, tone } = params;
  const jd =
    jobDescription.trim().slice(0, 280) + (jobDescription.trim().length > 280 ? "…" : "");

  return [
    `Dear Hiring Manager,`,
    `I am writing to express my interest in the ${jobTitle} position at ${companyName}. Your mission resonates with how I like to build—thoughtfully, with users in mind, and with measurable impact.`,
    toneParagraph(tone),
    `Relevant context from my experience includes: ${jd || "a track record of shipping quality work and collaborating with cross-functional partners."}`,
    `I would value the opportunity to discuss how I can contribute to ${companyName}'s next chapter. Thank you for your time and consideration.`,
    `Warm regards,\n${fullName}`,
  ].join("\n\n");
}

/** Mock transform for toolbar actions */
export async function mockTransformSelection(
  selected: string,
  mode: "improve" | "shorten" | "expand"
): Promise<string> {
  await delay(500);
  const t = selected.trim();
  if (!t) return "";
  if (mode === "shorten") {
    const words = t.split(/\s+/).slice(0, Math.max(3, Math.floor(t.split(/\s+/).length * 0.6)));
    return words.join(" ") + ".";
  }
  if (mode === "expand") {
    return `${t} In practice, this translated into clearer communication, faster iteration cycles, and stronger alignment across stakeholders.`;
  }
  return `${t.replace(/\.$/, "")}—refined for clarity, confidence, and a crisp, professional tone.`;
}

/** Inline suggestion when user selects text in review step */
export async function mockInlineSuggestion(selected: string): Promise<string> {
  await delay(450);
  if (!selected.trim()) return "";
  return `Suggested: ${selected.trim()} — framed with stronger outcome language and a concise tie-in to the role.`;
}
