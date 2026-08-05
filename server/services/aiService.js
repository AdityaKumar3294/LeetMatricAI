const ai = require("../config/gemini");

// Generate AI Analysis
const generateAIAnalysis = async (profileData) => {
    try {

        const prompt = `
You are an expert DSA mentor.

Analyze this LeetCode profile.

Username: ${profileData.username}
Total Solved: ${profileData.totalSolved}
Easy: ${profileData.easySolved}
Medium: ${profileData.mediumSolved}
Hard: ${profileData.hardSolved}
Ranking: ${profileData.ranking}

Give the response in this format:

Strengths:
Weaknesses:
Study Plan:
Interview Readiness:
Motivational Tip:
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("AI Analysis Failed");

    }
};

const generateStudyPlan = async (profileData) => {

    try {

        const prompt = `
You are an expert DSA mentor.

Create a personalized 30-day LeetCode study plan.

Student Profile:

Username: ${profileData.username}

Total Solved: ${profileData.totalSolved}

Easy: ${profileData.easySolved}

Medium: ${profileData.mediumSolved}

Hard: ${profileData.hardSolved}

Ranking: ${profileData.ranking}

Return the response in this format:

📅 Weekly Plan

Week 1:
...

Week 2:
...

Week 3:
...

Week 4:
...

Daily Goal:

Revision Strategy:

Interview Readiness:

Motivational Tip:
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("Study Plan Failed");

    }

};

module.exports = {
    generateAIAnalysis,
    generateStudyPlan
};