const ai = require("../config/gemini");

const analyzeResume = async (resumeText) => {
    try {

        const prompt = `
You are an expert ATS Resume Reviewer.

Analyze the following resume.

Return the result ONLY in Markdown.

Resume:

${resumeText}

Give the response in this exact format.

# ATS Score
Score: __/100

# Strengths
- ...

# Weaknesses
- ...

# Missing Technical Skills
- ...

# Grammar Issues
- ...

# Formatting Suggestions
- ...

# Project Review
- ...

# Interview Readiness
- ...

# Company Readiness
Mention suitable companies.

# Final Verdict
One paragraph.
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log("Gemini Resume Error:");
        console.log(error);

        throw new Error("Resume Analysis Failed");
    }
};

module.exports = {
    analyzeResume
};