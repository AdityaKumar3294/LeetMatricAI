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

// ==============================
// Explain Code
// ==============================
const explainCode = async (code, language) => {

    try {

        const prompt = `
You are a Senior Software Engineer and Programming Mentor.

Explain the following ${language} code in a beginner-friendly yet professional way.

Rules:

- Explain the overall purpose of the code.
- Explain each important block step-by-step.
- Explain important algorithms used.
- Explain important data structures used.
- Mention the time complexity.
- Mention the space complexity.
- Suggest possible improvements if any.
- Keep the explanation simple and easy to understand.
- Return ONLY markdown.

Format:

# Code Summary

...

# Step-by-Step Explanation

1.
2.
3.

# Algorithm Used

...

# Data Structures Used

...

# Time Complexity

...

# Space Complexity

...

# Possible Improvements

...
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `${prompt}\n\n${code}`,
        });

        return response.text;

    } catch (error) {

        console.log(error);

        throw new Error("Code Explanation Failed");

    }

};

// ==============================
// Find Bugs in Code
// ==============================
const findBugs = async (code, language) => {
    try {

        const prompt = `
You are a Senior Software Engineer and Code Reviewer.

Analyze the following ${language} code.

Find all possible:

- Syntax Errors
- Logical Errors
- Runtime Errors
- Edge Cases
- Bad Coding Practices
- Security Issues (if any)

Do NOT rewrite the entire code.

Return ONLY markdown.

Format:

🐞 Bug 1
Description:

Reason:

Possible Fix:

-------------------

🐞 Bug 2

...

At the end write:

⭐ Overall Code Quality (out of 10)
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `${prompt}\n\n${code}`
        });

        return response.text;

    } catch (error) {
        console.log(error);
        throw new Error("Bug Analysis Failed");
    }
};

// ==============================
// Optimize Code
// ==============================
const optimizeCode = async (code, language) => {

    try {

        const prompt = `
You are a Senior Software Engineer at Google.

Analyze the following ${language} code.

Your task:

1. Identify inefficient code.
2. Suggest performance improvements.
3. Improve readability.
4. Apply coding best practices.
5. Rewrite the code in an optimized way.
6. Compare the original and optimized complexities.

Return ONLY markdown.

Format:

# Code Review

## Problems
- ...

## Optimizations
- ...

## Optimized Code

\`\`\`${language}
...
\`\`\`

## Complexity Comparison

Original Time:
...

Optimized Time:
...

Original Space:
...

Optimized Space:
...
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `${prompt}\n\n${code}`
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("Code Optimization Failed");

    }

};

// ==============================
// Analyze Time & Space Complexity
// ==============================
const analyzeComplexity = async (code, language) => {

    try {

        const prompt = `
You are an expert Data Structures & Algorithms mentor.

Analyze the following ${language} code.

Your tasks:

1. Explain what the algorithm does.
2. Determine the Time Complexity.
3. Explain WHY the time complexity is that value.
4. Determine the Space Complexity.
5. Explain WHY the space complexity is that value.
6. Identify the dominant operations.
7. Suggest whether the complexity can be improved.
8. If optimization is possible, briefly explain how (do NOT rewrite the full code).

Return ONLY markdown.

Format exactly like this:

# Algorithm Summary

...

# Time Complexity

O(...)

Reason:
...

# Space Complexity

O(...)

Reason:
...

# Dominant Operations

- ...

# Can It Be Optimized?

Yes/No

Explanation:
...

# Interview Tip

...
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `${prompt}\n\n${code}`,
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("Complexity Analysis Failed");

    }

};

// ==============================
// Convert Code Between Languages
// ==============================
const convertCode = async (code, sourceLanguage, targetLanguage) => {

    try {

        const prompt = `
You are a Senior Software Engineer.

Convert the following code from ${sourceLanguage} to ${targetLanguage}.

Rules:

- Preserve the original logic.
- Do NOT change the algorithm.
- Use best coding practices.
- Keep meaningful variable names.
- Preserve comments whenever possible.
- Return ONLY the converted code.
- Do NOT add explanations.
- Do NOT wrap the code in markdown.

Code:

${code}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("Code Conversion Failed");

    }

};

const generateCodeFromProblem = async (problem, language) => {
    try {

        const prompt = `
You are a Senior Software Engineer at Google.

Generate the best optimized ${language} solution.

Problem Statement:
${problem}

IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap inside \`\`\`.

JSON format:

{
    "approach":"",
    "algorithm":"",
    "code":"",
    "timeComplexity":"",
    "spaceComplexity":""
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt
        });

        let text = response.text.trim();

        // Remove markdown if Gemini accidentally adds it
        text = text.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

        return JSON.parse(text);

    } catch (error) {

        console.log(error);
        throw new Error("Code Generation Failed");

    }
};

// ==============================
// AI Coding Assistant Chat
// ==============================
const codingAssistantChat = async (message) => {
    try {

        const prompt = `
You are an Expert Software Engineer, DSA Mentor, Competitive Programmer, and Technical Interviewer.

Your job is to help students with:

- Data Structures
- Algorithms
- Competitive Programming
- LeetCode
- System Design
- Java
- C++
- Python
- JavaScript
- Node.js
- Express
- React
- MongoDB
- SQL
- Debugging
- Interview Preparation

Student Question:

${message}

Rules:

- Answer clearly.
- Give examples when useful.
- Use markdown.
- If code is needed, provide clean production-quality code.
- Explain the logic.
- Keep the answer beginner-friendly but technically correct.
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.log(error);
        throw new Error("AI Chat Failed");

    }
};

module.exports = {
    generateAIAnalysis,
    generateStudyPlan,
    generateCompanyRoadmap,
    generateInterviewQuestions,
    analyzeResume,
    findBugs,
    explainCode,
    optimizeCode,
    analyzeComplexity,
    convertCode,
    generateCodeFromProblem,
    codingAssistantChat
};