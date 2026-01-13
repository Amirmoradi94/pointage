"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeWithGemini = gradeWithGemini;
const generative_ai_1 = require("@google/generative-ai");
const supabase_1 = require("../lib/supabase");
const apiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter(Boolean);
let roundRobinIndex = 0;
const getClient = () => {
    if (apiKeys.length === 0) {
        throw new Error("No Gemini API keys configured");
    }
    const key = apiKeys[roundRobinIndex % apiKeys.length];
    roundRobinIndex += 1;
    return new generative_ai_1.GoogleGenerativeAI(key);
};
/**
 * Fetch image from URL and convert to base64
 */
async function fetchImageAsBase64(url) {
    try {
        // Extract bucket and path from Supabase URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        const bucket = pathParts[pathParts.indexOf("object") + 2];
        const filePath = pathParts.slice(pathParts.indexOf("object") + 3).join("/");
        const { data, error } = await supabase_1.supabase.storage.from(bucket).download(filePath);
        if (error)
            throw error;
        if (!data)
            throw new Error("No data returned");
        const buffer = Buffer.from(await data.arrayBuffer());
        return buffer.toString("base64");
    }
    catch (error) {
        console.error("[grader] Failed to fetch image:", url, error);
        throw new Error(`Failed to fetch image: ${error}`);
    }
}
/**
 * Build comprehensive grading prompt based on input
 */
function buildGradingPrompt(input) {
    const { strictness, allowAlternativeMethods, partialCreditEnabled, customInstructions } = input.gradingSettings;
    const strictnessInstructions = {
        lenient: "Be lenient in grading. Accept alternative solution methods. Give benefit of doubt when work is partially correct.",
        moderate: "Use balanced grading approach. Give reasonable partial credit for correct methodology even if final answer is wrong.",
        strict: "Be strict in grading. Expect exact answers and precise methodology. Minimal partial credit unless explicitly justified.",
    };
    let prompt = `You are an expert academic grader. Grade this student submission against the provided solution.

**GRADING GUIDELINES:**
- Strictness level: ${strictness.toUpperCase()}
- ${strictnessInstructions[strictness]}
- Alternative methods: ${allowAlternativeMethods ? "ACCEPTED" : "NOT ACCEPTED"}
- Partial credit: ${partialCreditEnabled ? "ENABLED" : "DISABLED"}
${customInstructions ? `- Custom instructions: ${customInstructions}` : ""}

**SUBMISSION DETAILS:**
- Number of pages in submission: ${input.submissionPages.length}
- Number of pages in solution: ${input.solutionPages.length}
- Maximum score: ${input.maxScore}
${input.courseType ? `- Subject area: ${input.courseType}` : ""}

`;
    if (input.rubric) {
        prompt += `**RUBRIC CRITERIA:**
`;
        input.rubric.criteria.forEach((criterion, idx) => {
            prompt += `${idx + 1}. ${criterion.name} (${criterion.maxPoints} points): ${criterion.description}
`;
        });
        prompt += `\nTotal rubric points: ${input.rubric.totalPoints}
`;
    }
    prompt += `
**INSTRUCTIONS:**
1. Compare the student submission images with the solution images page by page.
2. Identify correct answers, incorrect answers, partially correct work, and missing work.
3. For each criterion in the rubric (or overall if no rubric), provide:
   - Score earned
   - Justification for the score
   - Specific feedback on what was done well or what needs improvement
4. Calculate a confidence score (0.0-1.0) based on:
   - Clarity of student's work (readable handwriting, clear diagrams)
   - Completeness of submission
   - Alignment with solution methodology
   - Any ambiguities or unclear sections
5. Flag for human review if:
   - Confidence < 0.75
   - Student used a significantly different method than the solution
   - Handwriting is unclear or illegible
   - Answer is borderline between grade brackets

**OUTPUT FORMAT (respond with valid JSON only):**
{
  "score": <number between 0 and ${input.maxScore}>,
  "confidence": <number between 0.0 and 1.0>,
  "feedback": "<overall feedback string>",
  "criteriaBreakdown": [
    {
      "criterionId": "<id or 'overall'>",
      "criterionName": "<name>",
      "score": <earned points>,
      "maxScore": <max points>,
      "comment": "<specific feedback>"
    }
  ],
  "pageAnnotations": [
    {
      "pageNumber": <number>,
      "annotations": [
        {
          "type": "<correct|incorrect|partial|unclear>",
          "location": "<question number or section>",
          "comment": "<specific observation>"
        }
      ]
    }
  ],
  "flagsForReview": [<list of strings describing why this needs review, or empty array>]
}

Now analyze the submission and provide your grading in the JSON format above.`;
    return prompt;
}
/**
 * Parse Gemini response and extract JSON
 */
function parseGradingResponse(responseText) {
    try {
        // Try to find JSON in the response (might be wrapped in markdown code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate required fields
        if (typeof parsed.score !== "number" || typeof parsed.confidence !== "number") {
            throw new Error("Missing required numeric fields");
        }
        return {
            score: parsed.score,
            confidence: parsed.confidence,
            feedback: parsed.feedback || "No feedback provided",
            criteriaBreakdown: Array.isArray(parsed.criteriaBreakdown)
                ? parsed.criteriaBreakdown
                : [],
            pageAnnotations: Array.isArray(parsed.pageAnnotations) ? parsed.pageAnnotations : [],
            flagsForReview: Array.isArray(parsed.flagsForReview) ? parsed.flagsForReview : [],
        };
    }
    catch (error) {
        console.error("[grader] Failed to parse response:", error);
        throw new Error(`Failed to parse Gemini response: ${error}`);
    }
}
/**
 * Main grading function using Gemini Vision API
 */
async function gradeWithGemini(input) {
    const startTime = Date.now();
    console.log(`[grader] Starting grading for submission ${input.submissionId}`);
    try {
        const client = getClient();
        const model = client.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.2, // Lower temperature for more consistent grading
                maxOutputTokens: 8192,
            },
        });
        // Fetch all images as base64
        console.log("[grader] Fetching submission images...");
        const submissionImageData = await Promise.all(input.submissionPages.map(async (page) => ({
            inlineData: {
                mimeType: "image/png",
                data: await fetchImageAsBase64(page.imageUrl),
            },
        })));
        console.log("[grader] Fetching solution images...");
        const solutionImageData = await Promise.all(input.solutionPages.map(async (page) => ({
            inlineData: {
                mimeType: "image/png",
                data: await fetchImageAsBase64(page.imageUrl),
            },
        })));
        // Build prompt
        const prompt = buildGradingPrompt(input);
        // Prepare content for Gemini
        const contents = [
            { text: prompt },
            { text: "\n\n**STUDENT SUBMISSION PAGES:**" },
            ...submissionImageData,
            { text: "\n\n**SOLUTION/ANSWER KEY PAGES:**" },
            ...solutionImageData,
        ];
        console.log("[grader] Calling Gemini API...");
        const result = await model.generateContent(contents);
        const responseText = result.response.text();
        console.log("[grader] Parsing response...");
        const parsedResult = parseGradingResponse(responseText);
        // Validate and adjust scores
        const finalScore = Math.max(0, Math.min(parsedResult.score || 0, input.maxScore));
        const finalConfidence = Math.max(0, Math.min(parsedResult.confidence || 0, 1));
        // Auto-flag if confidence is low
        const flags = [...(parsedResult.flagsForReview || [])];
        if (finalConfidence < 0.75 && !flags.some((f) => f.toLowerCase().includes("confidence"))) {
            flags.push("Low confidence score (< 0.75)");
        }
        const processingTime = Date.now() - startTime;
        console.log(`[grader] Grading complete: ${finalScore}/${input.maxScore} (confidence: ${finalConfidence.toFixed(2)}) in ${processingTime}ms`);
        return {
            score: finalScore,
            maxScore: input.maxScore,
            confidence: finalConfidence,
            feedback: parsedResult.feedback || "Grading completed successfully.",
            criteriaBreakdown: parsedResult.criteriaBreakdown || [],
            pageAnnotations: parsedResult.pageAnnotations || [],
            flagsForReview: flags,
            modelUsed: "gemini-2.0-flash-exp",
            processingTime,
        };
    }
    catch (error) {
        console.error("[grader] Grading failed:", error);
        // Return a low-confidence fallback result
        return {
            score: 0,
            maxScore: input.maxScore,
            confidence: 0.0,
            feedback: `Automated grading failed: ${error}. Manual review required.`,
            criteriaBreakdown: [],
            pageAnnotations: [],
            flagsForReview: ["grading-error", "requires-manual-review"],
            modelUsed: "gemini-2.0-flash-exp",
            processingTime: Date.now() - startTime,
        };
    }
}
