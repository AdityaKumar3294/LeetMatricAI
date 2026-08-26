const ai = require("../config/gemini");
const companyData = require("../data/companyData");

// ==============================
// Generate AI Performance Analysis
// ==============================
const generateAIAnalysis = async (profileData) => {
    try {
        const prompt = `
You are an expert DSA mentor, competitive programming coach,
technical interviewer, and placement preparation advisor.

Analyze the following LeetMatricAI student performance profile.

=========================
STUDENT PROFILE
=========================

Username:
${profileData.username || "Not available"}

=========================
LEETCODE PERFORMANCE
=========================

Total Problems Solved:
${profileData.totalSolved}

Easy Problems:
${profileData.easySolved}

Medium Problems:
${profileData.mediumSolved}

Hard Problems:
${profileData.hardSolved}

LeetCode Ranking:
${profileData.ranking || 0}

LeetCode Reputation:
${profileData.reputation || 0}

=========================
GAMIFICATION
=========================

Total XP:
${profileData.xp || 0}

Current Streak:
${profileData.streak || 0} days

XP from Easy:
${profileData.xpBreakdown?.easy || 0}

XP from Medium:
${profileData.xpBreakdown?.medium || 0}

XP from Hard:
${profileData.xpBreakdown?.hard || 0}

XP from Streak:
${profileData.xpBreakdown?.streak || 0}

XP from Badges:
${profileData.xpBreakdown?.badges || 0}

=========================
ACTIVITY
=========================

Last Active:
${profileData.lastActive || "Not available"}

Last LeetCode Sync:
${profileData.lastSynced || "Not available"}

=========================
ANALYSIS INSTRUCTIONS
=========================

Analyze the student's ACTUAL performance.

Do NOT invent statistics.

Do NOT simply repeat the provided numbers.

Determine:

1. Overall DSA performance.
2. Appropriate performance level.
3. Difficulty distribution.
4. Strengths.
5. Weaknesses.
6. Practice consistency.
7. Interview readiness.
8. Areas requiring improvement.
9. Personalized recommendations.
10. Immediate action plan.

Pay special attention to:

- Easy vs Medium vs Hard distribution.
- Medium problem mastery.
- Hard problem exposure.
- Practice consistency.
- Interview preparation.
- Overall problem-solving maturity.

=========================
SCORING
=========================

Calculate an overallScore from 0 to 100.

The score should consider:

- Total problems solved.
- Medium problem experience.
- Hard problem experience.
- Difficulty balance.
- Consistency.
- Interview readiness.

Do not give an artificially high score simply because
the student has solved many Easy problems.

Also calculate interviewReadiness.score from 0 to 100.

=========================
IMPORTANT
=========================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap the response in:

\`\`\`json

Do NOT add explanations before or after the JSON.

Use exactly this structure:

{
    "overallScore": 0,
    "performanceLevel": "Beginner",
    "overallAssessment": "",

    "difficultyAnalysis": {
        "easy": "",
        "medium": "",
        "hard": ""
    },

    "strengths": [
        "",
        "",
        ""
    ],

    "weaknesses": [
        "",
        "",
        ""
    ],

    "consistency": "",

    "interviewReadiness": {
        "score": 0,
        "status": "",
        "analysis": ""
    },

    "recommendations": [
        "",
        "",
        "",
        ""
    ],

    "actionPlan": [
        "",
        "",
        "",
        ""
    ],

    "motivationalTip": ""
}

=========================
FIELD REQUIREMENTS
=========================

overallScore:
Integer from 0 to 100.

performanceLevel:
Must be exactly one of:

"Beginner"
"Intermediate"
"Advanced"

overallAssessment:
2-4 sentences.

difficultyAnalysis:
Explain the student's Easy, Medium and Hard performance.

strengths:
Exactly 3 meaningful strengths.

weaknesses:
Exactly 3 meaningful weaknesses.

consistency:
Analyze streak and practice consistency.

interviewReadiness.score:
Integer from 0 to 100.

interviewReadiness.status:
Short human-readable status.

interviewReadiness.analysis:
2-4 sentences.

recommendations:
Exactly 4 personalized recommendations.

actionPlan:
Exactly 4 practical immediate actions.

motivationalTip:
Short personalized motivational message.

Remember:

Return ONLY valid JSON.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash", 
            contents: prompt,
            generationConfig: {
                responseMimeType: "application/json", 
            }
        });

        let text = response.text.trim();

        // ==========================================
        // Remove accidental markdown code fences
        // ==========================================
        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // ==========================================
        // Parse Gemini JSON response
        // ==========================================
        const analysis = JSON.parse(text);

        // ==========================================
        // Basic validation
        // ==========================================
        if (
            typeof analysis.overallScore !== "number" ||
            typeof analysis.performanceLevel !== "string" ||
            typeof analysis.overallAssessment !== "string"
        ) {
            throw new Error("Invalid AI analysis structure");
        }

        if (
            !analysis.difficultyAnalysis ||
            typeof analysis.difficultyAnalysis.easy !== "string" ||
            typeof analysis.difficultyAnalysis.medium !== "string" ||
            typeof analysis.difficultyAnalysis.hard !== "string"
        ) {
            throw new Error("Invalid difficulty analysis structure");
        }

        if (
            !Array.isArray(analysis.strengths) ||
            !Array.isArray(analysis.weaknesses) ||
            !Array.isArray(analysis.recommendations) ||
            !Array.isArray(analysis.actionPlan)
        ) {
            throw new Error("Invalid AI analysis arrays");
        }

        if (
            !analysis.interviewReadiness ||
            typeof analysis.interviewReadiness.score !== "number" ||
            typeof analysis.interviewReadiness.status !== "string" ||
            typeof analysis.interviewReadiness.analysis !== "string"
        ) {
            throw new Error("Invalid interview readiness structure");
        }

        if (typeof analysis.consistency !== "string") {
            throw new Error("Invalid consistency analysis");
        }

        if (typeof analysis.motivationalTip !== "string") {
            throw new Error("Invalid motivational tip");
        }

        // ==========================================
        // Clamp scores between 0 and 100
        // ==========================================
        analysis.overallScore = Math.min(
            100,
            Math.max(0, Math.round(analysis.overallScore))
        );

        analysis.interviewReadiness.score = Math.min(
            100,
            Math.max(0, Math.round(analysis.interviewReadiness.score))
        );

        return analysis;

    } catch (error) {
        console.error("=================================");
        console.error("GEMINI STRUCTURED AI ANALYSIS ERROR");
        console.error("=================================");
        console.error("Message:", error?.message);
        console.error("Status:", error?.status);
        console.error("Code:", error?.code);
        console.error("Details:", error?.details);
        console.error("Full Error:", error);
        throw new Error("AI Analysis Failed");
    }
};

// ==============================
// Generate Personalized Study Plan
// ==============================
const generateStudyPlan = async (profileData) => {
    try {
        const prompt = `
You are an expert DSA mentor, competitive programming coach,
technical interviewer, and placement preparation advisor.

Your task is to create a highly personalized 30-day LeetCode
and DSA study plan for the student.

Do NOT create a generic roadmap.

The plan MUST be based on the student's actual performance data.

==================================================
STUDENT PROFILE
==================================================

Username:
${profileData.username || "Not available"}

Total Problems Solved:
${profileData.totalSolved || 0}

Easy Problems:
${profileData.easySolved || 0}

Medium Problems:
${profileData.mediumSolved || 0}

Hard Problems:
${profileData.hardSolved || 0}

LeetCode Ranking:
${profileData.ranking || 0}

LeetCode Reputation:
${profileData.reputation || 0}

==================================================
GAMIFICATION & CONSISTENCY
==================================================

Total XP:
${profileData.xp || 0}

Current Streak:
${profileData.streak || 0} days

XP from Easy:
${profileData.xpBreakdown?.easy || 0}

XP from Medium:
${profileData.xpBreakdown?.medium || 0}

XP from Hard:
${profileData.xpBreakdown?.hard || 0}

XP from Streak:
${profileData.xpBreakdown?.streak || 0}

XP from Badges:
${profileData.xpBreakdown?.badges || 0}

Last Active:
${profileData.lastActive || "Not available"}

Last LeetCode Sync:
${profileData.lastSynced || "Not available"}

==================================================
YOUR ANALYSIS TASK
==================================================

First understand the student's current level from the
actual numbers.

Pay special attention to:

1. Total problem-solving experience.
2. Easy / Medium / Hard distribution.
3. Medium problem mastery.
4. Hard problem exposure.
5. Whether the student is over-dependent on Easy problems.
6. Practice consistency and streak.
7. Interview preparation readiness.
8. Areas that should receive the most attention during
   the next 30 days.

Do NOT invent statistics.

Do NOT claim that the student is weak in a topic unless
there is enough evidence.

Do NOT assume that every student has the same weaknesses.

==================================================
PLAN REQUIREMENTS
==================================================

Create a practical 30-day plan.

The plan should progressively increase difficulty.

The plan should generally follow this progression:

Week 1:
Foundation + identify and strengthen weak areas.

Week 2:
Medium problem mastery and pattern recognition.

Week 3:
Advanced DSA + selected Hard problems where appropriate.

Week 4:
Interview-oriented problem solving, revision,
mock practice, and weak-area reinforcement.

However, you MUST modify this progression according to
the student's actual profile.

For example:

- If Easy problems dominate, increase Medium practice.
- If Medium performance is strong, introduce more Hard problems.
- If Hard exposure is very low, introduce Hard problems gradually.
- If total solved count is low, focus more on fundamentals.
- If the student appears experienced, prioritize interview patterns,
  timed practice, and advanced problems.
- If the streak is low, include consistency-building goals.

==================================================
DAILY PLAN
==================================================

Create a day-by-day plan for all 30 days.

Every day must contain:

- Day number
- Main topic/pattern
- Learning objective
- Recommended problem count
- Recommended difficulty
- Practice activity
- Short daily goal

Avoid unrealistic workloads.

The student should be able to complete the plan alongside
college/classes and normal responsibilities.

Include lighter revision/rest days where appropriate.

==================================================
IMPORTANT DSA PATTERNS
==================================================

Select topics based on the student's current level.

Possible topics include:

Arrays
Strings
Hashing
Two Pointers
Sliding Window
Binary Search
Stack
Queue
Linked List
Recursion
Backtracking
Trees
Binary Search Tree
Heap / Priority Queue
Greedy
Graphs
BFS
DFS
Dynamic Programming
Intervals
Bit Manipulation
Prefix Sum
Monotonic Stack

Do not force all topics into the plan.

Prioritize the most useful topics for the student's level.

==================================================
INTERVIEW PREPARATION
==================================================

Include interview-oriented preparation.

Cover:

- Pattern recognition
- Timed problem solving
- Explaining solutions
- Complexity analysis
- Mock interviews
- Revision of previously solved problems
- Medium/Hard interview problems where appropriate

==================================================
OUTPUT FORMAT
==================================================

Return ONLY markdown.

Do NOT return JSON.

Do NOT wrap the entire response inside a markdown code block.

Use exactly this general structure:

# 🎯 Personalized 30-Day DSA Study Plan

## 📊 Current Assessment

Explain the student's current level and the most important
areas of focus.

## 🎯 30-Day Objectives

List 3-5 measurable goals for the next 30 days.

## 📅 Week 1 — Foundation & Weak Areas

### Day 1
**Topic:** ...
**Objective:** ...
**Problems:** ...
**Difficulty:** ...
**Practice:** ...
**Daily Goal:** ...

Continue through Day 7.

## 📅 Week 2 — Medium Problem Mastery

Continue through Day 14.

## 📅 Week 3 — Advanced DSA

Continue through Day 21.

## 📅 Week 4 — Interview Preparation & Revision

Continue through Day 30.

## 🔄 Revision Strategy

Explain how the student should revise.

## ⏱️ Daily Study Routine

Give a realistic daily study structure.

## 💼 Interview Readiness

Explain how this 30-day plan improves interview readiness.

## 🎯 Expected Outcome

Explain what the student should realistically achieve
after completing the 30 days.

## 🔥 Final Motivation

Give a short personalized motivational message.

==================================================
IMPORTANT RULES
==================================================

- Do not invent LeetCode statistics.
- Do not repeat the student's statistics unnecessarily.
- Do not give the same plan to every student.
- Personalization is mandatory.
- Keep the plan practical.
- Prefer quality over excessive problem counts.
- Encourage solving problems independently before looking
  at solutions.
- Encourage revisiting failed and previously solved problems.
- Include time complexity analysis as part of practice.
- Focus on interview-relevant DSA patterns.
- Never guarantee interview selection or placement.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        const studyPlan = response.text?.trim();

        if (!studyPlan) {
            throw new Error("Gemini returned an empty study plan");
        }

        return studyPlan;

    } catch (error) {
        console.error("Gemini Study Plan Error:", error);
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
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
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.log(error);
        throw new Error("AI Chat Failed");
    }
};

// ==============================
// AI Friend Comparison
// ==============================
const generateFriendComparison = async (
    yourProfile,
    friendProfile
) => {
    try {
        const prompt = `
You are an expert DSA mentor.

Compare these two LeetCode profiles.

PROFILE 1
Username: ${yourProfile.leetcodeUsername}
Total Solved: ${yourProfile.totalSolved}
Easy: ${yourProfile.easySolved}
Medium: ${yourProfile.mediumSolved}
Hard: ${yourProfile.hardSolved}
Ranking: ${yourProfile.ranking}

----------------------------

PROFILE 2
Username: ${friendProfile.leetcodeUsername}
Total Solved: ${friendProfile.totalSolved}
Easy: ${friendProfile.easySolved}
Medium: ${friendProfile.mediumSolved}
Hard: ${friendProfile.hardSolved}
Ranking: ${friendProfile.ranking}

----------------------------

Return ONLY markdown.

Format:

# Overall Comparison

# Strengths of Profile 1

# Strengths of Profile 2

# Weaknesses

# Who is Interview Ready?

# Personalized Advice for Profile 1

# Personalized Advice for Profile 2

# Final Verdict
`;

        // ==========================================
        // Retry Gemini on temporary 503 errors
        // ==========================================
        const maxRetries = 3;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Gemini Friend Comparison Attempt ${attempt}/${maxRetries}`);

                const response = await ai.models.generateContent({
                    model: "gemini-3.6-flash", 
                    contents: prompt
                });

                return response.text;
            } catch (error) {
                lastError = error;

                const status =
                    error?.status ||
                    error?.response?.status ||
                    error?.code;

                console.log(`Gemini attempt ${attempt} failed:`, error.message);

                // Retry only transient errors
                if (
                    status !== 503 &&
                    status !== 429 &&
                    status !== 500
                ) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying Gemini in ${delay / 1000}s...`);

                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;

    } catch (error) {
        console.log("Gemini Friend Comparison Error:", error);
        throw new Error("AI Friend Comparison temporarily unavailable. Please try again.");
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
    codingAssistantChat,
    generateFriendComparison
};