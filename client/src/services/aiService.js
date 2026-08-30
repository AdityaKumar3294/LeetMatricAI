import API from "./api";

// ==========================================
// AI Performance Analysis
// ==========================================
export const getAIAnalysis = async () => {
    try {
        console.log(
            "🔵 FRONTEND: Sending GET request to /ai/analysis..."
        );

        const response = await API.get("/ai/analysis");

        return response.data;

    } catch (error) {
        console.error(
            "🔴 AI ANALYSIS ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to connect to the server."
            }
        );
    }
};

// ============================================================
// EXPORT STUDY PLAN PDF
// GET /api/ai/study-plan/pdf
// ============================================================

export const exportStudyPlanPDF = async () => {

    try {

        console.log(
            "🔵 FRONTEND: Exporting study plan PDF..."
        );

        const response = await API.get(
            "/ai/study-plan/pdf",
            {
                responseType: "blob"
            }
        );

        console.log(
            "🟢 FRONTEND: Study plan PDF received successfully"
        );


        // =====================================================
        // CREATE PDF BLOB
        // =====================================================

        const blob = new Blob(
            [response.data],
            {
                type: "application/pdf"
            }
        );


        // =====================================================
        // CREATE DOWNLOAD URL
        // =====================================================

        const url =
            window.URL.createObjectURL(blob);


        // =====================================================
        // CREATE TEMPORARY DOWNLOAD LINK
        // =====================================================

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "LeetMatricAI_Study_Plan.pdf";

        document.body.appendChild(link);

        link.click();


        // =====================================================
        // CLEANUP
        // =====================================================

        link.remove();

        window.URL.revokeObjectURL(url);


        return {
            success: true
        };

    } catch (error) {

        console.error(
            "🔴 STUDY PLAN PDF EXPORT ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message:
                    "Failed to export study plan PDF."
            }
        );
    }
};


// ============================================================
// GET SAVED STUDY PLAN
// GET /api/ai/study-plan
// ============================================================

export const getStudyPlan = async () => {
    try {
        console.log(
            "🔵 FRONTEND: Fetching saved study plan..."
        );

        const response = await API.get(
            "/ai/study-plan"
        );

        console.log(
            "🟢 FRONTEND: Study plan fetched successfully"
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 GET STUDY PLAN ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to fetch study plan."
            }
        );
    }
};


// ============================================================
// GENERATE NEW STUDY PLAN
// POST /api/ai/study-plan/generate
// ============================================================

export const generateStudyPlan = async () => {
    try {
        console.log(
            "🔵 FRONTEND: Generating new study plan..."
        );

        const response = await API.post(
            "/ai/study-plan/generate",
            {}
        );

        console.log(
            "🟢 FRONTEND: Study plan generated successfully"
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 GENERATE STUDY PLAN ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to generate study plan."
            }
        );
    }
};


// ============================================================
// COMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/complete
// ============================================================

export const completeStudyPlanDay = async (day) => {
    try {
        console.log(
            `🔵 FRONTEND: Completing study plan Day ${day}...`
        );

        const response = await API.post(
            `/ai/study-plan/day/${day}/complete`,
            {}
        );

        console.log(
            `🟢 FRONTEND: Day ${day} completed successfully`,
            response.data
        );

        return response.data;

    } catch (error) {
        console.error(
            `🔴 COMPLETE DAY ${day} ERROR:`,
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: `Failed to complete Day ${day}.`
            }
        );
    }
};


// ============================================================
// UNCOMPLETE STUDY PLAN DAY
// POST /api/ai/study-plan/day/:day/uncomplete
// ============================================================

export const uncompleteStudyPlanDay = async (day) => {
    try {
        console.log(
            `🔵 FRONTEND: Uncompleting study plan Day ${day}...`
        );

        const response = await API.post(
            `/ai/study-plan/day/${day}/uncomplete`,
            {}
        );

        console.log(
            `🟢 FRONTEND: Day ${day} marked incomplete`,
            response.data
        );

        return response.data;

    } catch (error) {
        console.error(
            `🔴 UNCOMPLETE DAY ${day} ERROR:`,
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: `Failed to mark Day ${day} incomplete.`
            }
        );
    }
};


// ==========================================
// COMPANY ROADMAP
// ==========================================
// GET /api/ai/company-roadmap/:company
// ==========================================
export const getCompanyRoadmap = async (company) => {
    try {
        console.log(
            `🔵 FRONTEND: Fetching roadmap for ${company}...`
        );

        const response = await API.get(
            `/ai/company-roadmap/${encodeURIComponent(company)}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 COMPANY ROADMAP ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to fetch company roadmap."
            }
        );
    }
};


// ==========================================
// INTERVIEW QUESTIONS
// ==========================================
// GET /api/ai/interview-questions/:company
// ==========================================
export const getInterviewQuestions = async (company) => {
    try {
        console.log(
            `🔵 FRONTEND: Fetching interview questions for ${company}...`
        );

        const response = await API.get(
            `/ai/interview-questions/${encodeURIComponent(company)}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 INTERVIEW QUESTIONS ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to fetch interview questions."
            }
        );
    }
};


// ==========================================
// EXPLAIN CODE
// ==========================================
// POST /api/ai/explain
// ==========================================
export const explainCode = async (
    code,
    language = "javascript"
) => {
    try {
        console.log(
            "🔵 FRONTEND: Sending code for explanation..."
        );

        const response = await API.post(
            "/ai/explain",
            {
                code,
                language
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 EXPLAIN CODE ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to explain code."
            }
        );
    }
};


// ==========================================
// FIND BUGS
// ==========================================
// POST /api/ai/find-bugs
// ==========================================
export const findBugs = async (
    code,
    language = "javascript"
) => {
    try {
        console.log(
            "🔵 FRONTEND: Sending code for bug analysis..."
        );

        const response = await API.post(
            "/ai/find-bugs",
            {
                code,
                language
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 FIND BUGS ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to analyze code bugs."
            }
        );
    }
};


// ==========================================
// OPTIMIZE CODE
// ==========================================
// POST /api/ai/optimize
// ==========================================
export const optimizeCode = async (
    code,
    language = "javascript"
) => {
    try {
        console.log(
            "🔵 FRONTEND: Sending code for optimization..."
        );

        const response = await API.post(
            "/ai/optimize",
            {
                code,
                language
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 OPTIMIZE CODE ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to optimize code."
            }
        );
    }
};


// ==========================================
// TIME & SPACE COMPLEXITY
// ==========================================
// POST /api/ai/complexity
// ==========================================
export const analyzeComplexity = async (
    code,
    language = "javascript"
) => {
    try {
        console.log(
            "🔵 FRONTEND: Sending code for complexity analysis..."
        );

        const response = await API.post(
            "/ai/complexity",
            {
                code,
                language
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 COMPLEXITY ANALYSIS ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to analyze complexity."
            }
        );
    }
};

// ==========================================
// PYTHON CODE FORMATTER
// ==========================================
const formatPythonCode = (code) => {
    const lines = code.split("\n");

    let indentLevel = 0;
    const formatted = [];

    for (let rawLine of lines) {
        let line = rawLine.trim();

        // Preserve empty lines
        if (!line) {
            formatted.push("");
            continue;
        }

        // ------------------------------------------
        // Decrease indentation before these lines
        // ------------------------------------------
        if (
            line.startsWith("elif ") ||
            line.startsWith("else:") ||
            line.startsWith("except") ||
            line.startsWith("finally:")
        ) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // ------------------------------------------
        // Handle closing indentation
        // ------------------------------------------
        if (
            line.startsWith("return ") ||
            line.startsWith("raise ") ||
            line.startsWith("break") ||
            line.startsWith("continue")
        ) {
            // Keep current indentation
        }

        // ------------------------------------------
        // Add indentation
        // ------------------------------------------
        formatted.push(
            "    ".repeat(indentLevel) + line
        );

        // ------------------------------------------
        // Increase indentation after blocks
        // ------------------------------------------
        if (line.endsWith(":")) {
            indentLevel++;
        }
    }

    return formatted.join("\n").trim();
};


// ==========================================
// CONVERT CODE
// ==========================================
export const convertCode = async (
    code,
    sourceLanguage,
    targetLanguage
) => {
    try {
        console.log(
            `🔵 FRONTEND: Converting ${sourceLanguage} → ${targetLanguage}...`
        );

        const response = await API.post(
            "/ai/convert",
            {
                code,
                sourceLanguage,
                targetLanguage
            }
        );

        console.log(
            "🟢 FRONTEND: Conversion backend result:",
            response.data
        );

        const data = response.data;

        let convertedCode =
            typeof data === "string"
                ? data
                : data?.convertedCode ??
                  data?.response ??
                  data?.output ??
                  data?.result ??
                  data?.data?.convertedCode ??
                  "";

        if (
            typeof convertedCode !== "string" ||
            !convertedCode.trim()
        ) {
            throw new Error(
                "Backend returned an empty converted code response."
            );
        }

        // ==========================================
        // CLEAN GEMINI MARKDOWN
        // ==========================================

        convertedCode = convertedCode
            .replace(/^```[a-zA-Z0-9_+-]*\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // ==========================================
        // PYTHON INDENTATION NORMALIZATION
        // ==========================================

        if (
            targetLanguage.toLowerCase() === "python" ||
            targetLanguage.toLowerCase() === "py"
        ) {
            convertedCode = formatPythonCode(convertedCode);
        }

        console.log(
            "🟢 CODE CONVERSION: Successfully extracted converted code."
        );

        return {
            success: true,
            convertedCode,
            response: convertedCode,
            output: convertedCode
        };

    } catch (error) {
        console.error(
            "🔴 CODE CONVERSION ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message:
                    error.message ||
                    "Failed to convert code."
            }
        );
    }
};

// ==========================================
// GENERATE CODE FROM PROBLEM
// ==========================================
// POST /api/ai/generate-code
// ==========================================
export const generateCodeFromProblem = async (
    problem,
    language = "javascript"
) => {
    try {
        console.log(
            "🔵 FRONTEND: Generating code from problem..."
        );

        const response = await API.post(
            "/ai/generate-code",
            {
                problem,
                language
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 CODE GENERATION ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to generate code."
            }
        );
    }
};


// ==========================================
// AI CODING ASSISTANT
// ==========================================
// POST /api/ai/chat
// ==========================================

export const codingAssistantChat = async (message) => {
    try {
        console.log(
            "🔵 FRONTEND: Sending message to AI Coding Assistant..."
        );

        const response = await API.post("/ai/chat", {
            message,
        });

        console.log(
            "🟢 FRONTEND: Received backend result:",
            response.data
        );

        const data = response.data;

        // ==========================================
        // Normalize backend response
        // ==========================================

        const aiResponse =
            typeof data === "string"
                ? data
                : data?.reply ??
                  data?.response ??
                  data?.output ??
                  data?.message ??
                  data?.answer ??
                  data?.content ??
                  data?.text ??
                  data?.data?.reply ??
                  data?.data?.response ??
                  data?.data?.output ??
                  data?.data?.message ??
                  data?.data?.answer ??
                  data?.data?.content ??
                  data?.data?.text ??
                  "";

        // ==========================================
        // Validate AI response
        // ==========================================

        if (
            typeof aiResponse !== "string" ||
            !aiResponse.trim()
        ) {
            console.error(
                "🔴 AI CHAT: Backend returned an object but no AI text was found:",
                data
            );

            throw new Error(
                "Backend returned an empty AI response."
            );
        }

        console.log(
            "🟢 AI CHAT: Successfully extracted AI response."
        );

        // ==========================================
        // Return normalized response
        // ==========================================

        return {
            success: true,
            response: aiResponse.trim(),
            output: aiResponse.trim(),
            reply: aiResponse.trim(),
        };

    } catch (error) {
        console.error(
            "🔴 AI CHAT ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message:
                    error.message ||
                    "Failed to get AI response."
            }
        );
    }
};

// ==========================================
// AI HISTORY
// ==========================================
// GET /api/ai/history
// ==========================================
export const getAIHistory = async () => {
    try {
        console.log(
            "🔵 FRONTEND: Fetching AI history..."
        );

        const response = await API.get(
            "/ai/history"
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 AI HISTORY ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to fetch AI history."
            }
        );
    }
};


// ==========================================
// DELETE AI HISTORY ITEM
// ==========================================
// DELETE /api/ai/history/:id
// ==========================================
export const deleteAIHistoryItem = async (
    id
) => {
    try {
        console.log(
            `🔵 FRONTEND: Deleting AI history item ${id}...`
        );

        const response = await API.delete(
            `/ai/history/${id}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 DELETE AI HISTORY ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to delete AI history item."
            }
        );
    }
};


// ==========================================
// CLEAR AI HISTORY
// ==========================================
// DELETE /api/ai/history
// ==========================================
export const clearAIHistory = async () => {
    try {
        console.log(
            "🔵 FRONTEND: Clearing AI history..."
        );

        const response = await API.delete(
            "/ai/history"
        );

        return response.data;

    } catch (error) {
        console.error(
            "🔴 CLEAR AI HISTORY ERROR:",
            error
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to clear AI history."
            }
        );
    }
};