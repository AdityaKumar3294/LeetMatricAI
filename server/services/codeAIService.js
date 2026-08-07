// LeetMatricAI/server/services/codeAIService.js
const ai = require("../config/gemini");

const explainCode = async (code, language) => {
    try {

        const prompt = `
You are a Senior Software Engineer.

Explain the following ${language} code.

Rules:
- Explain in simple English.
- Explain what each major block does.
- Mention the algorithm used.
- Mention where it is useful.
- Mention Time Complexity.
- Mention Space Complexity.
- Do NOT rewrite the code.
- Return Markdown only.

Code:

${code}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.log(error);
        throw new Error("Code Explanation Failed");
    }
};

// Function to find bugs in the code
const findBugs = async (code, language) => {
    try {

        const prompt = `
You are a Senior Software Engineer and Code Reviewer.

Analyze the following ${language} code.

Rules:
- Find syntax errors (if any).
- Find logical errors.
- Find runtime issues.
- Mention edge cases that may fail.
- Suggest improvements.
- Do NOT rewrite the complete code.
- Return Markdown only.

Code:

${code}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.log(error);
        throw new Error("Bug Analysis Failed");
    }
};

module.exports = {
    explainCode,
    findBugs,
};