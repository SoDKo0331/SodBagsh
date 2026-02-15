
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GradeResult {
  success: boolean;
  output: string;
  feedback: string;
  hint: string;
  variables: Array<{ name: string; value: string; type: string }>;
}

export const AiService = {
  async gradeSubmission(
    code: string, 
    language: string, 
    expectedOutput: string,
    context?: string
  ): Promise<GradeResult> {
    const prompt = `
      ACT: Automated Pedagogical Code Judge.
      LANG: ${language}
      EXPECTED_OUTPUT: "${expectedOutput}"
      
      USER_CODE:
      \`\`\`${language}
      ${code}
      \`\`\`

      TASK:
      1. Verify syntax. If invalid, explain the error simply.
      2. Verify logic. If output doesn't match EXACTLY, identify why.
      3. Extract current variable states (names, values, types).
      4. Provide a "Mastery Hint" that guides them to the solution without giving the code.

      RESPONSE FORMAT (STRICT JSON):
      {
        "success": boolean,
        "output": "Actual program output",
        "feedback": "Encouraging Mongolian feedback",
        "hint": "Pedagogical hint in Mongolian",
        "variables": [{"name": "x", "value": "5", "type": "int"}]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Grading Error:", error);
      throw new Error("Grade analysis failed.");
    }
  },

  async askTutor(message: string, code: string, stepTitle: string) {
    const prompt = `You are an expert programming mentor for Mongolian students. 
    Context: Current lesson is "${stepTitle}".
    User's Code: \n${code}\n
    User Question: ${message}
    Guide them using Socratic method. Keep it brief and in Mongolian.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text;
  }
};
