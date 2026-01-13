export interface GradingPromptOptions {
  assignmentTitle: string;
  rubricSummary?: string;
  strictness?: "lenient" | "moderate" | "strict";
  customInstructions?: string;
  maxScore?: number;
}

export const buildGradingPrompt = ({
  assignmentTitle,
  rubricSummary,
  strictness = "moderate",
  customInstructions,
  maxScore = 100,
}: GradingPromptOptions) => {
  return [
    `You are grading a student submission for "${assignmentTitle}".`,
    `Maximum score: ${maxScore}. Strictness: ${strictness}.`,
    rubricSummary ? `Rubric: ${rubricSummary}` : "Use general academic grading best practices.",
    customInstructions ? `Custom instructions: ${customInstructions}` : "",
    "Return a JSON object with: score, maxScore, feedback, flagsForReview (array of strings).",
  ]
    .filter(Boolean)
    .join("\n");
};
