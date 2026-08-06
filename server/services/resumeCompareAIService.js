const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const compareResumesAI = async (oldAnalysis, newAnalysis) => {
    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest"
        });

        const prompt = `
You are an expert ATS Resume Reviewer.

Compare the OLD resume analysis with the NEW resume analysis.

OLD ANALYSIS:
${oldAnalysis}

----------------------------------------

NEW ANALYSIS:
${newAnalysis}

Generate a professional comparison report.

Return the result in Markdown.

Use exactly these sections:

# Overall Improvement

# ATS Score Difference

# Newly Added Strengths

# Remaining Weaknesses

# Skills Added

# Skills Still Missing

# Final Recommendation

Keep the report concise, professional, and actionable.
`;

        const result = await model.generateContent(prompt);

        return result.response.text;

    } catch (error) {

        console.log(error);
        throw new Error("Failed to compare resumes.");

    }
};

module.exports = {
    compareResumesAI
};