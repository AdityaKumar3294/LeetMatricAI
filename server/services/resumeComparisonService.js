const ai = require("../config/gemini");

const compareResumeAnalysis = async (oldAnalysis, newAnalysis) => {
    try {

        const prompt = `
You are an expert ATS Resume Reviewer.

Compare these two resume analyses.

====================
OLD RESUME
====================

${oldAnalysis}

====================
NEW RESUME
====================

${newAnalysis}

Instructions:

Compare both resumes professionally.

Return ONLY markdown.

Use this structure:

# Overall Winner

# ATS Improvement

# Improved Skills

# Removed Weaknesses

# Remaining Weaknesses

# Project Comparison

# Interview Readiness

# Final Suggestions
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.log(error);
        throw new Error("Resume Comparison Failed");
    }
};

module.exports = {
    compareResumeAnalysis,
};