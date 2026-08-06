const ai = require("../config/gemini");
const companyData = require("../data/companyData");

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

// Generate Company Roadmap
const generateCompanyRoadmap = async (profileData, company) => {

    try {

        // Get company information
        const info = companyData[company] || {
            difficulty: "★★★★☆",
            focus: ["DSA", "Problem Solving"],
            interviewStyle: "General Software Engineering",
            recommendedProblems: []
        };

        const prompt = `
You are a Senior DSA Mentor and ${company} Interviewer.

Create a personalized roadmap for cracking ${company}.

=========================
COMPANY INFORMATION
=========================

Company: ${company}

Difficulty: ${info.difficulty}

Interview Style:
${info.interviewStyle}

Focus Topics:
${info.focus.join(", ")}

Recommended Problems:
${info.recommendedProblems.join(", ")}

=========================
STUDENT PROFILE
=========================

Username: ${profileData.username}

Total Solved: ${profileData.totalSolved}

Easy: ${profileData.easySolved}

Medium: ${profileData.mediumSolved}

Hard: ${profileData.hardSolved}

Ranking: ${profileData.ranking}

=========================
INSTRUCTIONS
=========================

Use the company information above.

Personalize everything.

Mention why those topics are important specifically for ${company}.

Recommend weekly goals.

Suggest suitable difficulty distribution.

Suggest interview preparation strategy.

Return ONLY markdown.

Use this structure:

🏢 Company

🎯 Current Level

📚 Topics to Master

📅 Week 1

📅 Week 2

📅 Week 3

📅 Week 4

🔥 Important Patterns

📌 Must Solve Problems

📊 Difficulty Distribution

💡 Interview Tips

🚀 Motivation
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log("Gemini Error:");
        console.log(error);

        throw new Error("Company Roadmap Failed");
    }

};

// ==============================
// Generate Interview Questions
// ==============================
const generateInterviewQuestions = async (profileData, company) => {

    try {

        const prompt = `
You are an ex-Google Software Engineer and DSA interviewer.

Generate the TOP 20 REAL LeetCode interview questions that are frequently asked in ${company} interviews.

Student Profile:

Username: ${profileData.username}
Solved: ${profileData.totalSolved}
Easy: ${profileData.easySolved}
Medium: ${profileData.mediumSolved}
Hard: ${profileData.hardSolved}
Ranking: ${profileData.ranking}

Rules:

- Only use REAL LeetCode problems.
- Mention the official LeetCode problem title.
- Mention the LeetCode problem number.
- Mention the topic.
- Mention the difficulty.
- Give one short interview hint.
- Do NOT provide solutions.
- Do NOT repeat questions.
- Return exactly 20 questions.

Return in this format:

🏢 Company:
${company}

Question 1

LeetCode:
Two Sum (#1)

Topic:
Array, Hash Map

Difficulty:
Easy

Hint:
Store visited numbers in a hash map.

------------------------

Question 2

LeetCode:
Word Ladder (#127)

Topic:
Graph, BFS

Difficulty:
Hard

Hint:
Treat each word as a graph node.

...

Continue until Question 20.
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log("Gemini Error:");
        console.log(error);

        throw new Error("Interview Questions Failed");
    }

};

// ==============================
// Analyze Resume
// ==============================
const analyzeResume = async (resumeText) => {

    try {

        const prompt = `
You are a Senior Technical Recruiter, ATS Expert, and Software Engineering Hiring Manager.

Analyze the following resume.

Return ONLY markdown.

Resume:

${resumeText}

============================

Return exactly in this format:

# ATS Score
Score: xx/100

# Strengths

- ...
- ...

# Weaknesses

- ...
- ...

# Missing Skills

- ...

# Grammar Issues

- ...

# Formatting Suggestions

- ...

# Project Review

- ...

# Resume Improvement Tips

- ...

# Company Readiness

Google:
...

Amazon:
...

Microsoft:
...

# Final Verdict

...
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log(error);

        throw new Error("Resume Analysis Failed");

    }

};

module.exports = {
    generateAIAnalysis,
    generateStudyPlan,
    generateCompanyRoadmap,
    generateInterviewQuestions,
    analyzeResume
};