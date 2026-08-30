import { useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import {
    Bot,
    Send,
    Sparkles,
    Code2,
    Bug,
    Zap,
    Clock3,
    Trash2,
    Loader2,
    Copy,
    Check,
    MessageSquare,
    ArrowRight,
    Wand2,
    Languages,
    FileCode2,
    Braces,
    Terminal,
    Lightbulb,
    RotateCcw,
    RefreshCw,
    Eraser,
    Maximize2,
    Minimize2,
    User,
    AlertCircle,
    ChevronRight,
    Command,
    Play,
    X,
    PanelLeft,
    Circle,
    CheckCircle2,
} from "lucide-react";

import {
    codingAssistantChat,
    explainCode,
    findBugs,
    optimizeCode,
    analyzeComplexity,
    convertCode,
    generateCodeFromProblem,
} from "../services/aiService";


// ============================================================
// LANGUAGES
// ============================================================

const languages = [
    {
        value: "javascript",
        label: "JavaScript",
        short: "JS",
    },
    {
        value: "python",
        label: "Python",
        short: "PY",
    },
    {
        value: "cpp",
        label: "C++",
        short: "C++",
    },
    {
        value: "java",
        label: "Java",
        short: "JAVA",
    },
];


// ============================================================
// TOOLS
// ============================================================

const tools = [
    {
        id: "chat",
        label: "AI Chat",
        description: "Ask anything",
        icon: MessageSquare,
    },
    {
        id: "explain",
        label: "Explain",
        description: "Understand code",
        icon: Code2,
    },
    {
        id: "bugs",
        label: "Find Bugs",
        description: "Debug code",
        icon: Bug,
    },
    {
        id: "optimize",
        label: "Optimize",
        description: "Improve code",
        icon: Zap,
    },
    {
        id: "complexity",
        label: "Complexity",
        description: "Analyze Big-O",
        icon: Clock3,
    },
    {
        id: "convert",
        label: "Convert",
        description: "Change language",
        icon: Languages,
    },
    {
        id: "generate",
        label: "Generate",
        description: "Problem → Code",
        icon: Wand2,
    },
];


// ============================================================
// SUGGESTED PROMPTS
// ============================================================

const suggestedPrompts = [
    {
        icon: "💡",
        title: "Explain an algorithm",
        text: "Explain binary search with an example and dry run.",
    },
    {
        icon: "🐞",
        title: "Debug my code",
        text: "How do I find and fix a segmentation fault in C++?",
    },
    {
        icon: "⚡",
        title: "Optimize a solution",
        text: "How can I optimize my two pointer solution?",
    },
    {
        icon: "🎯",
        title: "Prepare for interviews",
        text: "Give me a DSA interview preparation strategy.",
    },
];


// ============================================================
// HELPERS
// ============================================================

// ============================================================
// NORMALIZE AI RESPONSES
// Supports every backend response shape used by this page.
// ============================================================
const getResponseText = (response) => {
    if (!response) {
        return "";
    }

    if (typeof response === "string") {
        return response.trim();
    }

    // Some services may return JSON as a string.
    if (typeof response === "object") {
        const candidates = [
            response.reply,
            response.explanation,
            response.analysis,
            response.convertedCode,
            response.output,
            response.response,
            response.result,
            response.message,
            response.data?.reply,
            response.data?.explanation,
            response.data?.analysis,
            response.data?.convertedCode,
            response.data?.output,
            response.data?.response,
            response.data?.result,
            response.data?.message,
        ];

        const value = candidates.find(
            (item) =>
                typeof item === "string" &&
                item.trim().length > 0
        );

        return value?.trim() || "";
    }

    return "";
};


// ============================================================
// NORMALIZE GENERATED CODE RESPONSE
// ============================================================
const getGeneratedSolution = (response) => {
    if (response == null) return null;

    const isObject = (v) => v !== null && typeof v === 'object';

    const parseJson = (v) => {
        if (typeof v !== 'string') return v;
        const cleaned = v.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
        if (!cleaned) return '';
        try { return JSON.parse(cleaned); } catch { return v; }
    };

    const normalize = (v, depth = 0) => {
        if (depth > 10 || v == null) return null;

        if (typeof v === 'string') {
            const parsed = parseJson(v);
            if (parsed !== v) return normalize(parsed, depth + 1);
            return v.trim() ? { approach: 'Not provided', algorithm: 'Not provided', code: v.trim(), timeComplexity: 'Not provided', spaceComplexity: 'Not provided' } : null;
        }

        if (!isObject(v)) return null;

        const directCode = [v.code, v.solutionCode, v.sourceCode, v.answer];
        for (const candidate of directCode) {
            if (typeof candidate === 'string' && candidate.trim()) {
                const parsed = parseJson(candidate);
                if (parsed !== candidate && isObject(parsed)) {
                    const nested = normalize(parsed, depth + 1);
                    if (nested?.code) return { ...nested, approach: v.approach || nested.approach, algorithm: v.algorithm || nested.algorithm, timeComplexity: v.timeComplexity || nested.timeComplexity, spaceComplexity: v.spaceComplexity || nested.spaceComplexity };
                }
                return { approach: v.approach || v.solutionApproach || 'Not provided', algorithm: v.algorithm || v.steps || 'Not provided', code: candidate.trim(), timeComplexity: v.timeComplexity || v.time_complexity || 'Not provided', spaceComplexity: v.spaceComplexity || v.space_complexity || 'Not provided' };
            }
        }

        const wrappers = ['generatedCode','solution','result','data','response','output','content'];
        for (const key of wrappers) {
            if (!(key in v)) continue;
            const nested = normalize(parseJson(v[key]), depth + 1);
            if (nested?.code) return { approach: v.approach || nested.approach || 'Not provided', algorithm: v.algorithm || nested.algorithm || 'Not provided', code: nested.code, timeComplexity: v.timeComplexity || nested.timeComplexity || 'Not provided', spaceComplexity: v.spaceComplexity || nested.spaceComplexity || 'Not provided' };
        }

        for (const [key, value] of Object.entries(v)) {
            if (['success','message','status','timestamp'].includes(key)) continue;
            const nested = normalize(value, depth + 1);
            if (nested?.code) return nested;
        }
        return null;
    };

    return normalize(response);
};


// ============================================================
// CLEAN GENERATED CODE FENCES
// ============================================================
const cleanGeneratedCode = (code) => {
    if (!code) {
        return "";
    }

    return String(code)
        .replace(/^```[a-zA-Z0-9_+#.-]*\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
};


const getLanguageLabel = (language) => {
    return (
        languages.find(
            (item) => item.value === language
        )?.label || language
    );
};


const getLanguageShort = (language) => {
    return (
        languages.find(
            (item) => item.value === language
        )?.short || "CODE"
    );
};


const getErrorMessage = (error) => {
    const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message ||
        (typeof error === "string" ? error : "") ||
        "Unable to connect with the AI assistant.";

    const lower = String(message).toLowerCase();

    if (
        lower.includes("429") ||
        lower.includes("quota") ||
        lower.includes("rate limit") ||
        lower.includes("too many requests")
    ) {
        return {
            title: "AI quota reached",
            message:
                "The AI service quota has been reached temporarily. Please wait for the quota to reset and try again.",
            type: "quota",
        };
    }

    if (
        lower.includes("503") ||
        lower.includes("unavailable") ||
        lower.includes("high demand")
    ) {
        return {
            title: "AI service is busy",
            message:
                "Gemini is temporarily experiencing high demand. Please try again in a little while.",
            type: "busy",
        };
    }

    if (
        lower.includes("network") ||
        lower.includes("failed to fetch") ||
        lower.includes("connection")
    ) {
        return {
            title: "Connection problem",
            message:
                "We couldn't connect to the AI service. Check your backend/server connection and try again.",
            type: "network",
        };
    }

    return {
        title: "AI request failed",
        message: String(message),
        type: "error",
    };
};


// ============================================================
// MARKDOWN RENDERER
// ============================================================

function MarkdownContent({
    content,
    isDark,
}) {
    if (!content) {
        return null;
    }

    const lines = String(content).split("\n");

    const elements = [];

    let codeBuffer = [];
    let insideCode = false;
    let codeLanguage = "";
    let codeStartIndex = 0;

    const renderInline = (text) => {
        const parts = [];

        const regex =
            /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;

        let lastIndex = 0;
        let match;

        while (
            (match = regex.exec(text)) !== null
        ) {
            if (match.index > lastIndex) {
                parts.push(
                    <span
                        key={`text-${match.index}`}
                    >
                        {text.slice(
                            lastIndex,
                            match.index
                        )}
                    </span>
                );
            }

            const token = match[0];

            if (token.startsWith("`")) {
                parts.push(
                    <code
                        key={`inline-${match.index}`}
                        className={`px-1.5 py-0.5 rounded-md font-mono text-xs ${
                            isDark
                                ? "bg-slate-950 text-blue-300"
                                : "bg-blue-50 text-blue-700"
                        }`}
                    >
                        {token.slice(1, -1)}
                    </code>
                );
            } else if (
                token.startsWith("**")
            ) {
                parts.push(
                    <strong
                        key={`bold-${match.index}`}
                    >
                        {token.slice(2, -2)}
                    </strong>
                );
            } else if (
                token.startsWith("*")
            ) {
                parts.push(
                    <em
                        key={`italic-${match.index}`}
                    >
                        {token.slice(1, -1)}
                    </em>
                );
            }

            lastIndex =
                match.index + token.length;
        }

        if (lastIndex < text.length) {
            parts.push(
                <span
                    key={`tail-${lastIndex}`}
                >
                    {text.slice(lastIndex)}
                </span>
            );
        }

        return parts.length > 0
            ? parts
            : text;
    };


    lines.forEach((line, index) => {
        const trimmed = line.trim();

        if (
            trimmed.startsWith("```") &&
            !insideCode
        ) {
            insideCode = true;

            codeLanguage = trimmed
                .replace("```", "")
                .trim();

            codeBuffer = [];
            codeStartIndex = index;

            return;
        }

        if (
            trimmed === "```" &&
            insideCode
        ) {
            insideCode = false;

            elements.push(
                <CodeBlock
                    key={`code-${codeStartIndex}`}
                    code={codeBuffer.join("\n")}
                    language={codeLanguage}
                    isDark={isDark}
                />
            );

            codeBuffer = [];

            return;
        }

        if (insideCode) {
            codeBuffer.push(line);
            return;
        }

        if (!trimmed) {
            elements.push(
                <div
                    key={`space-${index}`}
                    className="h-2"
                />
            );

            return;
        }

        if (trimmed.startsWith("### ")) {
            elements.push(
                <h4
                    key={index}
                    className="text-sm font-bold mt-5 mb-2"
                >
                    {renderInline(
                        trimmed.substring(4)
                    )}
                </h4>
            );

            return;
        }

        if (trimmed.startsWith("## ")) {
            elements.push(
                <h3
                    key={index}
                    className="text-base font-bold mt-6 mb-2"
                >
                    {renderInline(
                        trimmed.substring(3)
                    )}
                </h3>
            );

            return;
        }

        if (trimmed.startsWith("# ")) {
            elements.push(
                <h2
                    key={index}
                    className="text-lg font-bold mt-6 mb-3"
                >
                    {renderInline(
                        trimmed.substring(2)
                    )}
                </h2>
            );

            return;
        }

        if (
            trimmed.startsWith("- ") ||
            trimmed.startsWith("* ")
        ) {
            elements.push(
                <div
                    key={index}
                    className="flex gap-3 ml-1 my-1.5"
                >
                    <span className="text-blue-500 mt-0.5">
                        •
                    </span>

                    <span>
                        {renderInline(
                            trimmed.substring(2)
                        )}
                    </span>
                </div>
            );

            return;
        }

        const numbered =
            trimmed.match(
                /^(\d+)\.\s+(.*)$/
            );

        if (numbered) {
            elements.push(
                <div
                    key={index}
                    className="flex gap-3 ml-1 my-1.5"
                >
                    <span className="font-semibold text-blue-500 min-w-5">
                        {numbered[1]}.
                    </span>

                    <span>
                        {renderInline(
                            numbered[2]
                        )}
                    </span>
                </div>
            );

            return;
        }

        if (trimmed.startsWith("> ")) {
            elements.push(
                <div
                    key={index}
                    className={`border-l-2 border-blue-500 pl-4 my-3 italic ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    {renderInline(
                        trimmed.substring(2)
                    )}
                </div>
            );

            return;
        }

        elements.push(
            <p
                key={index}
                className="leading-7 my-1.5"
            >
                {renderInline(trimmed)}
            </p>
        );
    });


    if (
        insideCode &&
        codeBuffer.length > 0
    ) {
        elements.push(
            <CodeBlock
                key="unfinished-code"
                code={codeBuffer.join("\n")}
                language={codeLanguage}
                isDark={isDark}
            />
        );
    }

    return (
        <div className="text-sm leading-6">
            {elements}
        </div>
    );
}


// ============================================================
// CODE BLOCK
// ============================================================

function CodeBlock({
    code,
    language,
    isDark,
}) {
    const [copied, setCopied] =
        useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                code
            );

            setCopied(true);

            setTimeout(
                () => setCopied(false),
                1500
            );
        } catch (error) {
            console.error(
                "Code copy error:",
                error
            );
        }
    };

    return (
        <div
            className={`my-4 rounded-xl overflow-hidden border ${
                isDark
                    ? "bg-[#080d18] border-slate-700"
                    : "bg-slate-950 border-slate-800"
            }`}
        >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Terminal
                        size={14}
                        className="text-blue-400"
                    />

                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        {language || "code"}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                    {copied ? (
                        <>
                            <Check size={13} />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy size={13} />
                            Copy
                        </>
                    )}
                </button>
            </div>

            <pre className="p-4 overflow-x-auto text-[13px] text-slate-200 font-mono leading-6">
                <code>{code}</code>
            </pre>
        </div>
    );
}


// ============================================================
// CODE EDITOR
// ============================================================

function WorkspaceCodeEditor({
    code,
    setCode,
    language,
    isDark,
}) {
    const textareaRef =
        useRef(null);

    const lineNumbersRef =
        useRef(null);

    const lineCount =
        Math.max(
            code.split("\n").length,
            1
        );

    const lineNumbers = Array.from(
        {
            length: lineCount,
        },
        (_, index) => index + 1
    );


    const handleKeyDown = (
        event
    ) => {
        if (event.key !== "Tab") {
            return;
        }

        event.preventDefault();

        const textarea =
            textareaRef.current;

        if (!textarea) {
            return;
        }

        const start =
            textarea.selectionStart;

        const end =
            textarea.selectionEnd;

        const updated =
            code.substring(0, start) +
            "    " +
            code.substring(end);

        setCode(updated);

        requestAnimationFrame(() => {
            textarea.selectionStart =
                textarea.selectionEnd =
                    start + 4;
        });
    };


    const handleScroll = (
        event
    ) => {
        if (
            lineNumbersRef.current
        ) {
            lineNumbersRef.current.scrollTop =
                event.currentTarget.scrollTop;
        }
    };


    return (
        <div
            className={`relative flex h-[500px] overflow-hidden rounded-xl border ${
                isDark
                    ? "bg-[#080d18] border-slate-700"
                    : "bg-slate-950 border-slate-800"
            }`}
        >
            {/* LINE NUMBERS */}

            <div
                ref={lineNumbersRef}
                className="w-12 shrink-0 overflow-hidden border-r border-slate-800 bg-slate-950/70 py-4 text-right font-mono text-xs leading-6 text-slate-600 select-none"
            >
                {lineNumbers.map(
                    (number) => (
                        <div
                            key={number}
                            className="pr-3 h-6"
                        >
                            {number}
                        </div>
                    )
                )}
            </div>


            {/* EDITOR */}

            <textarea
                ref={textareaRef}
                value={code}
                onChange={(event) =>
                    setCode(
                        event.target.value
                    )
                }
                onKeyDown={
                    handleKeyDown
                }
                onScroll={
                    handleScroll
                }
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder={`Paste your ${getLanguageLabel(
                    language
                )} code here...

Example:

function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }
}`}
                className="flex-1 min-w-0 resize-none bg-transparent p-4 text-[13px] leading-6 font-mono text-slate-200 outline-none placeholder:text-slate-600"
            />
        </div>
    );
}


// ============================================================
// ERROR CARD
// ============================================================

function ErrorCard({
    error,
    isDark,
    onRetry,
    onDismiss,
}) {
    return (
        <div className="h-full min-h-[400px] flex items-center justify-center p-6">
            <div
                className={`w-full max-w-md rounded-2xl border p-7 text-center ${
                    isDark
                        ? "bg-slate-950 border-red-500/20"
                        : "bg-red-50 border-red-200"
                }`}
            >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    {error.type ===
                    "quota" ? (
                        <Clock3
                            size={26}
                            className="text-red-500"
                        />
                    ) : (
                        <AlertCircle
                            size={26}
                            className="text-red-500"
                        />
                    )}
                </div>

                <h3 className="font-bold mb-2">
                    {error.title}
                </h3>

                <p
                    className={`text-sm leading-6 ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-600"
                    }`}
                >
                    {error.message}
                </p>

                <div className="flex justify-center gap-2 mt-5">
                    {onRetry && (
                        <button
                            onClick={
                                onRetry
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                        >
                            <RefreshCw
                                size={14}
                            />
                            Retry
                        </button>
                    )}

                    <button
                        onClick={
                            onDismiss
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                            isDark
                                ? "border-slate-700 hover:bg-slate-800"
                                : "border-slate-200 hover:bg-white"
                        }`}
                    >
                        <X size={14} />
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}


// ============================================================
// EMPTY RESULT
// ============================================================

function EmptyResult({
    activeTool,
    activeToolData,
    isDark,
}) {
    const content = {
        explain: {
            icon: Code2,
            title: "Understand your code",
            description:
                "Paste your code and AI will explain what it does, how it works, and the important concepts behind it.",
        },

        bugs: {
            icon: Bug,
            title: "Find problems in your code",
            description:
                "AI will look for syntax issues, logical errors, runtime problems and tricky edge cases.",
        },

        optimize: {
            icon: Zap,
            title: "Make your solution better",
            description:
                "Get optimization suggestions along with improved code and complexity analysis.",
        },

        complexity: {
            icon: Clock3,
            title: "Analyze Big-O complexity",
            description:
                "Understand the time and space complexity of your solution step by step.",
        },

        convert: {
            icon: Languages,
            title: "Convert between languages",
            description:
                "Choose a source and target language and convert your code while preserving its logic.",
        },
    };

    const data =
        content[activeTool] || {
            icon: Lightbulb,
            title: "Ready to help",
            description:
                `Paste your code and use ${
                    activeToolData?.label ||
                    "the AI tool"
                } to get started.`,
        };

    const Icon = data.icon;

    return (
        <div className="h-full min-h-[400px] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
                    <Icon
                        size={28}
                        className="text-blue-500"
                    />
                </div>

                <h3 className="text-lg font-bold mb-2">
                    {data.title}
                </h3>

                <p
                    className={`text-sm leading-6 ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    {data.description}
                </p>
            </div>
        </div>
    );
}


// ============================================================
// GENERATE EMPTY STATE
// ============================================================

function GenerateEmptyState({
    isDark,
}) {
    return (
        <div className="h-full min-h-[400px] flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 animate-pulse" />

                    <div className="relative w-full h-full rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Wand2
                            size={28}
                            className="text-blue-500"
                        />
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-2">
                    Your solution will appear here
                </h3>

                <p
                    className={`text-sm leading-6 ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Describe a programming
                    problem and AI will
                    generate the approach,
                    algorithm, code, and
                    complexity analysis.
                </p>
            </div>
        </div>
    );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function AICodingAssistant() {
    const { theme } =
        useTheme();

    const isDark =
        theme === "dark";


    // ========================================================
    // STATE
    // ========================================================

    const [activeTool, setActiveTool] =
        useState("chat");

    const [language, setLanguage] =
        useState("javascript");

    const [targetLanguage, setTargetLanguage] =
        useState("python");

    const [code, setCode] =
        useState("");

    const [problem, setProblem] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [result, setResult] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [copied, setCopied] =
        useState(false);

    const [editorFullscreen, setEditorFullscreen] =
        useState(false);

    const [mobileToolOpen, setMobileToolOpen] =
        useState(false);

    const chatEndRef =
        useRef(null);


    // ========================================================
    // DERIVED
    // ========================================================

    const activeToolData =
        useMemo(
            () =>
                tools.find(
                    (item) =>
                        item.id ===
                        activeTool
                ),
            [activeTool]
        );

    const ActiveToolIcon =
        activeToolData?.icon ||
        MessageSquare;


    // ========================================================
    // AUTO SCROLL CHAT
    // ========================================================

    useEffect(() => {
        chatEndRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [
        messages,
        loading,
    ]);


    // ========================================================
    // THEME
    // ========================================================

    const pageBg = isDark
        ? "bg-[#070b14] text-white"
        : "bg-slate-50 text-slate-900";

    const cardBg = isDark
        ? "bg-slate-900 border-slate-700"
        : "bg-white border-slate-200";

    const mutedText = isDark
        ? "text-slate-400"
        : "text-slate-500";

    const inputBg = isDark
        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
        : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";


    // ========================================================
    // TOOL CHANGE
    // ========================================================

    const handleToolChange = (
        tool
    ) => {
        setActiveTool(tool);

        setError(null);

        setResult("");

        setCopied(false);

        setMobileToolOpen(false);
    };


    // ========================================================
    // CHAT
    // ========================================================

    const handleSendMessage = async (
        customMessage = null
    ) => {
        const trimmed = (
            customMessage ??
            message
        ).trim();

        if (
            !trimmed ||
            loading
        ) {
            return;
        }

        const userMessage = {
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages(
            (previous) => [
                ...previous,
                userMessage,
            ]
        );

        setMessage("");

        setLoading(true);

        setError(null);

        try {
            const response =
                await codingAssistantChat(
                    trimmed
                );

            const aiContent =
                getResponseText(
                    response
                );

            if (!aiContent) {
                throw new Error(
                    "The AI did not return a response."
                );
            }

            setMessages(
                (previous) => [
                    ...previous,
                    {
                        role: "assistant",
                        content:
                            aiContent,
                        timestamp:
                            new Date(),
                    },
                ]
            );
        } catch (err) {
            console.error(
                "AI CHAT ERROR:",
                err
            );

            const parsedError =
                getErrorMessage(err);

            setMessages(
                (previous) => [
                    ...previous,
                    {
                        role: "assistant",
                        content:
                            `**${parsedError.title}**\n\n${parsedError.message}`,
                        error: true,
                        timestamp:
                            new Date(),
                    },
                ]
            );
        } finally {
            setLoading(false);
        }
    };


    // ========================================================
    // CHAT KEYBOARD
    // ========================================================

    const handleChatKeyDown = (
        event
    ) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            handleSendMessage();
        }
    };


    // ========================================================
    // CODE TOOL
    // ========================================================

    const handleCodeTool = async () => {
        if (!code.trim() || loading) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult("");
        setCopied(false);

        try {
            let response;

            switch (activeTool) {
                case "explain":
                    response = await explainCode(
                        code,
                        language
                    );
                    break;

                case "bugs":
                    response = await findBugs(
                        code,
                        language
                    );
                    break;

                case "optimize":
                    response = await optimizeCode(
                        code,
                        language
                    );
                    break;

                case "complexity":
                    response = await analyzeComplexity(
                        code,
                        language
                    );
                    break;

                case "convert":
                    if (language === targetLanguage) {
                        throw new Error(
                            "Source and target languages must be different."
                        );
                    }

                    response = await convertCode(
                        code,
                        language,
                        targetLanguage
                    );
                    break;

                default:
                    throw new Error(
                        `Unsupported AI coding tool: ${activeTool}`
                    );
            }

            console.log(
                "🟢 AI CODE TOOL: Backend result:",
                response
            );

            const text = getResponseText(response);

            if (!text) {
                throw new Error(
                    "The AI did not return a response."
                );
            }

            setResult(text);

            console.log(
                "🟢 AI CODE TOOL: Successfully extracted AI response."
            );
        } catch (err) {
            console.error(
                "AI CODE TOOL ERROR:",
                err
            );

            setError(
                getErrorMessage(err)
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // GENERATE CODE
    // ========================================================

    const handleGenerateCode = async () => {
        if (!problem.trim() || loading) return;

        setLoading(true);
        setError(null);
        setResult('');
        setCopied(false);

        try {
            console.log('🔵 FRONTEND: Generating code from problem...');
            const response = await generateCodeFromProblem(problem.trim(), language);
            console.log('🟢 CODE GENERATION: Backend result:', response);
            try { console.log('🟢 CODE GENERATION: Backend JSON:', JSON.stringify(response, null, 2)); } catch {}

            const solution = getGeneratedSolution(response);
            console.log('🟢 CODE GENERATION: Normalized solution:', solution);

            if (solution?.code?.trim()) {
                const cleanedCode = cleanGeneratedCode(solution.code);
                const generated = `# Approach\n\n${solution.approach || 'Not provided'}\n\n# Algorithm\n\n${solution.algorithm || 'Not provided'}\n\n# Generated Code\n\n\`\`\`${language}\n${cleanedCode}\n\`\`\`\n\n# Time Complexity\n\n${solution.timeComplexity || 'Not provided'}\n\n# Space Complexity\n\n${solution.spaceComplexity || 'Not provided'}`;
                setResult(generated.trim());
                console.log('🟢 CODE GENERATION: Successfully extracted generated solution.');
                return;
            }

            const text = getResponseText(response);
            if (text) {
                setResult(`# Generated Solution\n\n${text}`);
                console.log('🟢 CODE GENERATION: Using plain text fallback response.');
                return;
            }

            throw new Error('The AI returned a response, but no generated code was found.');
        } catch (err) {
            console.error('CODE GENERATION ERROR:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // COPY RESULT
    // ========================================================

    const handleCopyResult =
        async () => {
            if (!result) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    result
                );

                setCopied(true);

                setTimeout(
                    () =>
                        setCopied(
                            false
                        ),
                    1500
                );
            } catch (err) {
                console.error(
                    "COPY RESULT ERROR:",
                    err
                );
            }
        };


    // ========================================================
    // CLEAR
    // ========================================================

    const clearWorkspace = () => {
        setCode("");

        setProblem("");

        setResult("");

        setError(null);

        setCopied(false);
    };


    const clearChat = () => {
        setMessages([]);

        setError(null);
    };


    const handleReset = () => {
        if (
            activeTool ===
            "chat"
        ) {
            clearChat();
        } else {
            clearWorkspace();
        }
    };


    // ========================================================
    // RETRY
    // ========================================================

    const retryCurrentAction =
        () => {
            if (
                activeTool ===
                "chat"
            ) {
                const lastUserMessage =
                    [
                        ...messages,
                    ]
                        .reverse()
                        .find(
                            (item) =>
                                item.role ===
                                "user"
                        );

                if (
                    lastUserMessage
                ) {
                    handleSendMessage(
                        lastUserMessage.content
                    );
                }

                return;
            }

            if (
                activeTool ===
                "generate"
            ) {
                handleGenerateCode();

                return;
            }

            handleCodeTool();
        };


    // ========================================================
    // COPY CHAT
    // ========================================================

    const copyChatMessage =
        async (
            content
        ) => {
            try {
                await navigator.clipboard.writeText(
                    content
                );
            } catch (err) {
                console.error(
                    "CHAT COPY ERROR:",
                    err
                );
            }
        };


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className={`flex min-h-screen transition-colors duration-300 ${pageBg}`}
        >
            <Sidebar />

            <div className="flex-1 ml-64 min-w-0">
                <Navbar />

                <main className="p-4 sm:p-5 lg:p-6 max-w-[1900px] mx-auto">

                    {/* ==================================================
                        PAGE HEADER
                    ================================================== */}

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">

                        <div className="flex items-center gap-4">

                            <div className="relative shrink-0">

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">

                                    <Bot
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-green-500 border-4 border-slate-950" />

                            </div>

                            <div>

                                <div className="flex flex-wrap items-center gap-3">

                                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                                        AI Coding Assistant
                                    </h1>

                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-500/10 text-green-500 border border-green-500/10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />

                                        AI Ready
                                    </span>

                                </div>

                                <p
                                    className={`mt-1 text-sm ${mutedText}`}
                                >
                                    Your personal AI-powered coding mentor.
                                </p>

                            </div>

                        </div>


                        <div className="flex items-center gap-2">

                            <div
                                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${cardBg}`}
                            >
                                <Command
                                    size={13}
                                />

                                <span
                                    className={
                                        mutedText
                                    }
                                >
                                    AI Workspace
                                </span>
                            </div>

                            <button
                                onClick={
                                    handleReset
                                }
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${cardBg} ${
                                    isDark
                                        ? "hover:bg-slate-800"
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                <RotateCcw
                                    size={15}
                                />

                                Reset
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        TOOL NAVIGATION
                    ================================================== */}

                    <div
                        className={`border rounded-2xl p-2 mb-6 shadow-sm ${cardBg}`}
                    >

                        {/* Mobile */}

                        <button
                            onClick={() =>
                                setMobileToolOpen(
                                    (
                                        previous
                                    ) =>
                                        !previous
                                )
                            }
                            className={`lg:hidden w-full flex items-center justify-between p-3 rounded-xl ${
                                isDark
                                    ? "bg-slate-800"
                                    : "bg-slate-50"
                            }`}
                        >

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">

                                    <ActiveToolIcon
                                        size={17}
                                        className="text-white"
                                    />

                                </div>

                                <div className="text-left">

                                    <div className="text-sm font-semibold">
                                        {
                                            activeToolData?.label
                                        }
                                    </div>

                                    <div
                                        className={`text-[11px] ${mutedText}`}
                                    >
                                        {
                                            activeToolData?.description
                                        }
                                    </div>

                                </div>

                            </div>

                            <ChevronRight
                                size={18}
                                className={`transition-transform ${
                                    mobileToolOpen
                                        ? "rotate-90"
                                        : ""
                                }`}
                            />

                        </button>


                        {/* Desktop */}

                        <div
                            className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 ${
                                mobileToolOpen
                                    ? "mt-2"
                                    : "hidden lg:grid"
                            }`}
                        >

                            {tools.map(
                                (
                                    tool
                                ) => {
                                    const Icon =
                                        tool.icon;

                                    const active =
                                        activeTool ===
                                        tool.id;

                                    return (
                                        <button
                                            key={
                                                tool.id
                                            }
                                            onClick={() =>
                                                handleToolChange(
                                                    tool.id
                                                )
                                            }
                                            className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-all ${
                                                active
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                    : isDark
                                                    ? "hover:bg-slate-800 text-slate-300"
                                                    : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                        >

                                            <div
                                                className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${
                                                    active
                                                        ? "bg-white/15"
                                                        : isDark
                                                        ? "bg-slate-800"
                                                        : "bg-slate-100"
                                                }`}
                                            >
                                                <Icon
                                                    size={
                                                        16
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0">

                                                <div className="text-sm font-semibold truncate">
                                                    {
                                                        tool.label
                                                    }
                                                </div>

                                                <div
                                                    className={`text-[10px] truncate ${
                                                        active
                                                            ? "text-blue-100"
                                                            : mutedText
                                                    }`}
                                                >
                                                    {
                                                        tool.description
                                                    }
                                                </div>

                                            </div>

                                            {active && (
                                                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white" />
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        ACTIVE TOOL TITLE
                    ================================================== */}

                    <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-3">

                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    isDark
                                        ? "bg-blue-500/10"
                                        : "bg-blue-50"
                                }`}
                            >

                                <ActiveToolIcon
                                    size={19}
                                    className="text-blue-500"
                                />

                            </div>

                            <div>

                                <h2 className="text-lg font-bold">
                                    {
                                        activeToolData?.label
                                    }
                                </h2>

                                <p
                                    className={`text-xs ${mutedText}`}
                                >
                                    {
                                        activeToolData?.description
                                    }
                                </p>

                            </div>

                        </div>

                        {activeTool !==
                            "chat" && (
                            <div
                                className={`hidden sm:flex items-center gap-2 text-xs ${mutedText}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />

                                Powered by AI
                            </div>
                        )}

                    </div>


                    {/* ==================================================
                        CHAT
                    ================================================== */}

                    {activeTool ===
                        "chat" && (
                        <div
                            className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}
                        >

                            {/* Chat Header */}

                            <div
                                className={`px-4 sm:px-5 py-4 border-b flex items-center justify-between ${
                                    isDark
                                        ? "border-slate-700"
                                        : "border-slate-200"
                                }`}
                            >

                                <div className="flex items-center gap-3">

                                    <div className="relative">

                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                            <Sparkles
                                                size={18}
                                                className="text-white"
                                            />
                                        </div>

                                        <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />

                                    </div>

                                    <div>

                                        <div className="font-semibold">
                                            LeetMatric AI
                                        </div>

                                        <div
                                            className={`text-xs ${mutedText}`}
                                        >
                                            DSA Mentor • Coding Assistant
                                        </div>

                                    </div>

                                </div>

                                {messages.length >
                                    0 && (
                                    <button
                                        onClick={
                                            clearChat
                                        }
                                        className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition ${
                                            isDark
                                                ? "hover:bg-slate-800"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >
                                        <Trash2
                                            size={
                                                14
                                            }
                                        />

                                        <span className="hidden sm:inline">
                                            Clear
                                        </span>
                                    </button>
                                )}

                            </div>


                            {/* Messages */}

                            <div className="h-[560px] overflow-y-auto p-4 sm:p-6">

                                {messages.length ===
                                0 ? (
                                    <div className="min-h-full flex items-center justify-center">

                                        <div className="max-w-2xl w-full text-center">

                                            <div className="relative inline-flex mb-5">

                                                <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center">
                                                    <Bot
                                                        size={
                                                            38
                                                        }
                                                        className="text-blue-500"
                                                    />
                                                </div>

                                                <div className="absolute -right-2 -bottom-2 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center border-4 border-slate-900">
                                                    <Sparkles
                                                        size={
                                                            15
                                                        }
                                                        className="text-white"
                                                    />
                                                </div>

                                            </div>

                                            <h3 className="text-2xl font-bold mb-2">
                                                What are you building today?
                                            </h3>

                                            <p
                                                className={`text-sm max-w-lg mx-auto leading-6 ${mutedText}`}
                                            >
                                                Ask LeetMatric AI about DSA,
                                                algorithms, debugging,
                                                interview preparation,
                                                programming concepts, or
                                                development.
                                            </p>


                                            <div className="grid sm:grid-cols-2 gap-3 mt-7 text-left">

                                                {suggestedPrompts.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <button
                                                            key={
                                                                item.text
                                                            }
                                                            onClick={() =>
                                                                handleSendMessage(
                                                                    item.text
                                                                )
                                                            }
                                                            className={`group p-4 rounded-xl border text-sm transition text-left ${
                                                                isDark
                                                                    ? "border-slate-700 hover:border-blue-500/40 hover:bg-slate-800"
                                                                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                                                            }`}
                                                        >

                                                            <div className="flex items-start gap-3">

                                                                <span className="text-xl">
                                                                    {
                                                                        item.icon
                                                                    }
                                                                </span>

                                                                <div className="flex-1">

                                                                    <div className="font-semibold mb-1">
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </div>

                                                                    <div
                                                                        className={`text-xs leading-5 ${mutedText}`}
                                                                    >
                                                                        {
                                                                            item.text
                                                                        }
                                                                    </div>

                                                                </div>

                                                                <ArrowRight
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="opacity-0 group-hover:opacity-100 text-blue-500 transition"
                                                                />

                                                            </div>

                                                        </button>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                ) : (
                                    <div className="max-w-4xl mx-auto space-y-7">

                                        {messages.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const isUser =
                                                    item.role ===
                                                    "user";

                                                return (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className={`flex gap-3 ${
                                                            isUser
                                                                ? "justify-end"
                                                                : "justify-start"
                                                        }`}
                                                    >

                                                        {!isUser && (
                                                            <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center">
                                                                <Bot
                                                                    size={
                                                                        17
                                                                    }
                                                                    className="text-white"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="max-w-[88%]">

                                                            <div
                                                                className={`flex items-center gap-2 text-[11px] mb-1.5 ${mutedText}`}
                                                            >
                                                                {isUser ? (
                                                                    <>
                                                                        You
                                                                        <User
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        LeetMatric AI
                                                                        <Sparkles
                                                                            size={
                                                                                11
                                                                            }
                                                                            className="text-blue-500"
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div
                                                                className={`rounded-2xl px-4 py-3 ${
                                                                    isUser
                                                                        ? "bg-blue-600 text-white rounded-br-md"
                                                                        : item.error
                                                                        ? "bg-red-500/10 border border-red-500/20 text-red-500 rounded-bl-md"
                                                                        : isDark
                                                                        ? "bg-slate-800 text-slate-200 rounded-bl-md"
                                                                        : "bg-slate-100 text-slate-800 rounded-bl-md"
                                                                }`}
                                                            >

                                                                {isUser ? (
                                                                    <div className="text-sm whitespace-pre-wrap leading-6">
                                                                        {
                                                                            item.content
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <MarkdownContent
                                                                        content={
                                                                            item.content
                                                                        }
                                                                        isDark={
                                                                            isDark
                                                                        }
                                                                    />
                                                                )}

                                                            </div>

                                                            {!item.error && (
                                                                <button
                                                                    onClick={() =>
                                                                        copyChatMessage(
                                                                            item.content
                                                                        )
                                                                    }
                                                                    className={`mt-2 flex items-center gap-1 text-[11px] ${mutedText} hover:text-blue-500 transition`}
                                                                >
                                                                    <Copy
                                                                        size={
                                                                            12
                                                                        }
                                                                    />

                                                                    Copy
                                                                </button>
                                                            )}

                                                        </div>

                                                        {isUser && (
                                                            <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-700 flex items-center justify-center">
                                                                <User
                                                                    size={
                                                                        17
                                                                    }
                                                                    className="text-white"
                                                                />
                                                            </div>
                                                        )}

                                                    </div>
                                                );
                                            }
                                        )}

                                        {loading && (
                                            <div className="flex gap-3">

                                                <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center">
                                                    <Bot
                                                        size={
                                                            17
                                                        }
                                                        className="text-white"
                                                    />
                                                </div>

                                                <div
                                                    className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                                                        isDark
                                                            ? "bg-slate-800"
                                                            : "bg-slate-100"
                                                    }`}
                                                >

                                                    <div className="flex items-center gap-2">

                                                        <span className="flex gap-1">

                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />

                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                                                                style={{
                                                                    animationDelay:
                                                                        "120ms",
                                                                }}
                                                            />

                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                                                                style={{
                                                                    animationDelay:
                                                                        "240ms",
                                                                }}
                                                            />

                                                        </span>

                                                        <span
                                                            className={`text-xs ${mutedText}`}
                                                        >
                                                            AI is thinking...
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>
                                        )}

                                        <div ref={chatEndRef} />

                                    </div>
                                )}

                            </div>


                            {/* Chat Input */}

                            <div
                                className={`p-4 border-t ${
                                    isDark
                                        ? "border-slate-700"
                                        : "border-slate-200"
                                }`}
                            >

                                <div className="max-w-4xl mx-auto">

                                    <div
                                        className={`flex items-end gap-2 p-2 rounded-2xl border ${
                                            isDark
                                                ? "bg-slate-950 border-slate-700"
                                                : "bg-slate-50 border-slate-200"
                                        }`}
                                    >

                                        <textarea
                                            value={
                                                message
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setMessage(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            onKeyDown={
                                                handleChatKeyDown
                                            }
                                            rows={
                                                2
                                            }
                                            placeholder="Ask LeetMatric AI anything about coding..."
                                            className="flex-1 min-w-0 resize-none bg-transparent px-3 py-2 text-sm outline-none"
                                        />

                                        <button
                                            onClick={
                                                handleSendMessage
                                            }
                                            disabled={
                                                !message.trim() ||
                                                loading
                                            }
                                            className="w-11 h-11 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition"
                                        >
                                            {loading ? (
                                                <Loader2
                                                    size={
                                                        18
                                                    }
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Send
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}
                                        </button>

                                    </div>

                                    <div className="flex items-center justify-between mt-2 px-1">

                                        <p
                                            className={`text-[11px] ${mutedText}`}
                                        >
                                            Enter to send • Shift + Enter for new line
                                        </p>

                                        <span
                                            className={`hidden sm:block text-[11px] ${mutedText}`}
                                        >
                                            AI may make mistakes
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        CODE TOOLS
                    ================================================== */}

                    {[
                        "explain",
                        "bugs",
                        "optimize",
                        "complexity",
                        "convert",
                    ].includes(
                        activeTool
                    ) && (
                        <div
                            className={`relative grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6 ${
                                editorFullscreen
                                    ? "xl:fixed xl:inset-0 xl:z-50 xl:p-6 xl:bg-slate-950"
                                    : ""
                            }`}
                        >

                            {/* LEFT */}

                            <div
                                className={`border rounded-2xl overflow-hidden ${cardBg} ${
                                    editorFullscreen
                                        ? "xl:h-full"
                                        : ""
                                }`}
                            >

                                {/* Editor header */}

                                <div
                                    className={`px-4 sm:px-5 py-4 border-b ${
                                        isDark
                                            ? "border-slate-700"
                                            : "border-slate-200"
                                    }`}
                                >

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="flex items-center gap-2">

                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <FileCode2
                                                    size={
                                                        17
                                                    }
                                                    className="text-blue-500"
                                                />
                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-sm">
                                                    Your Code
                                                </h3>

                                                <p
                                                    className={`text-[10px] ${mutedText}`}
                                                >
                                                    Write or paste your solution
                                                </p>

                                            </div>

                                        </div>


                                        <div className="flex items-center gap-2">

                                            <span
                                                className={`hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold ${
                                                    isDark
                                                        ? "bg-slate-800 text-slate-400"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                <Circle
                                                    size={
                                                        7
                                                    }
                                                    fill="currentColor"
                                                />

                                                {
                                                    getLanguageShort(
                                                        language
                                                    )
                                                }
                                            </span>

                                            <select
                                                value={
                                                    language
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setLanguage(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg border outline-none text-xs font-medium ${inputBg}`}
                                            >
                                                {languages.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <option
                                                            key={
                                                                item.value
                                                            }
                                                            value={
                                                                item.value
                                                            }
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <button
                                                onClick={() =>
                                                    setEditorFullscreen(
                                                        (
                                                            previous
                                                        ) =>
                                                            !previous
                                                    )
                                                }
                                                className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-lg ${
                                                    isDark
                                                        ? "hover:bg-slate-800"
                                                        : "hover:bg-slate-100"
                                                }`}
                                                title="Toggle fullscreen"
                                            >
                                                {editorFullscreen ? (
                                                    <Minimize2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                ) : (
                                                    <Maximize2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                </div>


                                {/* Convert */}

                                {activeTool ===
                                    "convert" && (
                                    <div
                                        className={`px-4 sm:px-5 py-3 border-b ${
                                            isDark
                                                ? "border-slate-700 bg-slate-950/50"
                                                : "border-slate-200 bg-slate-50"
                                        }`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <span
                                                className={`text-xs font-medium ${mutedText}`}
                                            >
                                                Convert to
                                            </span>

                                            <ArrowRight
                                                size={
                                                    15
                                                }
                                                className="text-blue-500"
                                            />

                                            <select
                                                value={
                                                    targetLanguage
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setTargetLanguage(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg border outline-none text-xs ${inputBg}`}
                                            >
                                                {languages
                                                    .filter(
                                                        (
                                                            item
                                                        ) =>
                                                            item.value !==
                                                            language
                                                    )
                                                    .map(
                                                        (
                                                            item
                                                        ) => (
                                                            <option
                                                                key={
                                                                    item.value
                                                                }
                                                                value={
                                                                    item.value
                                                                }
                                                            >
                                                                {
                                                                    item.label
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                            </select>

                                        </div>

                                    </div>
                                )}


                                {/* Editor */}

                                <div className="p-4">

                                    <WorkspaceCodeEditor
                                        code={
                                            code
                                        }
                                        setCode={
                                            setCode
                                        }
                                        language={
                                            language
                                        }
                                        isDark={
                                            isDark
                                        }
                                    />

                                </div>


                                {/* Editor stats */}

                                <div
                                    className={`px-4 sm:px-5 pb-4 flex items-center justify-between text-[11px] ${mutedText}`}
                                >

                                    <div className="flex items-center gap-3">

                                        <span>
                                            {
                                                code.length
                                            }{" "}
                                            characters
                                        </span>

                                        <span>
                                            {
                                                code.split(
                                                    "\n"
                                                )
                                                    .length
                                            }{" "}
                                            lines
                                        </span>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setCode(
                                                ""
                                            )
                                        }
                                        disabled={
                                            !code
                                        }
                                        className="flex items-center gap-1.5 hover:text-red-500 disabled:opacity-30 transition"
                                    >
                                        <Eraser
                                            size={
                                                13
                                            }
                                        />

                                        Clear
                                    </button>

                                </div>


                                {/* Action */}

                                <div className="px-4 sm:px-5 pb-5">

                                    <button
                                        onClick={
                                            handleCodeTool
                                        }
                                        disabled={
                                            !code.trim() ||
                                            loading
                                        }
                                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-lg shadow-blue-600/10"
                                    >

                                        {loading ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        17
                                                    }
                                                    className="animate-spin"
                                                />

                                                AI is analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Play
                                                    size={
                                                        16
                                                    }
                                                    fill="currentColor"
                                                />

                                                {activeTool ===
                                                "convert"
                                                    ? "Convert Code"
                                                    : `Run ${activeToolData?.label || "Analysis"}`}
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* RIGHT RESULT */}

                            <div
                                className={`border rounded-2xl overflow-hidden ${cardBg}`}
                            >

                                <div
                                    className={`px-4 sm:px-5 py-4 border-b flex items-center justify-between ${
                                        isDark
                                            ? "border-slate-700"
                                            : "border-slate-200"
                                    }`}
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">

                                            <Sparkles
                                                size={
                                                    16
                                                }
                                                className="text-blue-500"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-sm">
                                                AI Result
                                            </h3>

                                            <p
                                                className={`text-[10px] ${mutedText}`}
                                            >
                                                AI-generated analysis
                                            </p>

                                        </div>

                                    </div>


                                    {result && (
                                        <button
                                            onClick={
                                                handleCopyResult
                                            }
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition ${
                                                isDark
                                                    ? "hover:bg-slate-800"
                                                    : "hover:bg-slate-100"
                                            }`}
                                        >

                                            {copied ? (
                                                <>
                                                    <Check
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Copy
                                                </>
                                            )}

                                        </button>
                                    )}

                                </div>


                                <div className="h-[620px] overflow-y-auto p-5">

                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">

                                            <div className="text-center">

                                                <div className="relative w-16 h-16 mx-auto mb-5">

                                                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 animate-pulse" />

                                                    <div className="relative w-full h-full rounded-2xl flex items-center justify-center">

                                                        <Sparkles
                                                            size={
                                                                27
                                                            }
                                                            className="text-blue-500"
                                                        />

                                                    </div>

                                                </div>

                                                <h3 className="font-semibold mb-1">
                                                    AI is working...
                                                </h3>

                                                <p
                                                    className={`text-sm ${mutedText}`}
                                                >
                                                    Analyzing your{" "}
                                                    {
                                                        getLanguageLabel(
                                                            language
                                                        )
                                                    }{" "}
                                                    code.
                                                </p>

                                            </div>

                                        </div>
                                    ) : error ? (
                                        <ErrorCard
                                            error={
                                                error
                                            }
                                            isDark={
                                                isDark
                                            }
                                            onRetry={
                                                retryCurrentAction
                                            }
                                            onDismiss={() =>
                                                setError(
                                                    null
                                                )
                                            }
                                        />
                                    ) : result ? (
                                        <MarkdownContent
                                            content={
                                                result
                                            }
                                            isDark={
                                                isDark
                                            }
                                        />
                                    ) : (
                                        <EmptyResult
                                            activeTool={
                                                activeTool
                                            }
                                            activeToolData={
                                                activeToolData
                                            }
                                            isDark={
                                                isDark
                                            }
                                        />
                                    )}

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        GENERATE
                    ================================================== */}

                    {activeTool ===
                        "generate" && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">

                            {/* Problem */}

                            <div
                                className={`border rounded-2xl overflow-hidden ${cardBg}`}
                            >

                                <div
                                    className={`px-4 sm:px-5 py-4 border-b ${
                                        isDark
                                            ? "border-slate-700"
                                            : "border-slate-200"
                                    }`}
                                >

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="flex items-center gap-3">

                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">

                                                <Braces
                                                    size={
                                                        17
                                                    }
                                                    className="text-blue-500"
                                                />

                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-sm">
                                                    Problem Statement
                                                </h3>

                                                <p
                                                    className={`text-[10px] ${mutedText}`}
                                                >
                                                    Describe what you want to solve
                                                </p>

                                            </div>

                                        </div>


                                        <select
                                            value={
                                                language
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setLanguage(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={`px-3 py-2 rounded-lg border outline-none text-xs ${inputBg}`}
                                        >

                                            {languages.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item.value
                                                        }
                                                        value={
                                                            item.value
                                                        }
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                <div className="p-4">

                                    <textarea
                                        value={
                                            problem
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setProblem(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder={`Paste your coding problem here...

Example:

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`}
                                        className={`w-full h-[500px] resize-none rounded-xl border p-5 text-sm leading-7 outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                                    />

                                </div>


                                <div
                                    className={`px-4 sm:px-5 pb-4 flex items-center justify-between text-[11px] ${mutedText}`}
                                >

                                    <span>
                                        {
                                            problem.length
                                        }{" "}
                                        characters
                                    </span>

                                    <button
                                        onClick={() =>
                                            setProblem(
                                                ""
                                            )
                                        }
                                        disabled={
                                            !problem
                                        }
                                        className="flex items-center gap-1.5 hover:text-red-500 disabled:opacity-30 transition"
                                    >

                                        <Eraser
                                            size={
                                                13
                                            }
                                        />

                                        Clear

                                    </button>

                                </div>


                                <div className="px-4 sm:px-5 pb-5">

                                    <button
                                        onClick={
                                            handleGenerateCode
                                        }
                                        disabled={
                                            !problem.trim() ||
                                            loading
                                        }
                                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-lg shadow-blue-600/10"
                                    >

                                        {loading ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        17
                                                    }
                                                    className="animate-spin"
                                                />

                                                Generating Solution...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2
                                                    size={
                                                        17
                                                    }
                                                />

                                                Generate Solution
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Generated Result */}

                            <div
                                className={`border rounded-2xl overflow-hidden ${cardBg}`}
                            >

                                <div
                                    className={`px-4 sm:px-5 py-4 border-b flex items-center justify-between ${
                                        isDark
                                            ? "border-slate-700"
                                            : "border-slate-200"
                                    }`}
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">

                                            <Sparkles
                                                size={
                                                    16
                                                }
                                                className="text-blue-500"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-sm">
                                                Generated Solution
                                            </h3>

                                            <p
                                                className={`text-[10px] ${mutedText}`}
                                            >
                                                Approach → Algorithm → Code
                                            </p>

                                        </div>

                                    </div>


                                    {result && (
                                        <button
                                            onClick={
                                                handleCopyResult
                                            }
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition ${
                                                isDark
                                                    ? "hover:bg-slate-800"
                                                    : "hover:bg-slate-100"
                                            }`}
                                        >

                                            {copied ? (
                                                <>
                                                    <Check
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Copy
                                                </>
                                            )}

                                        </button>
                                    )}

                                </div>


                                <div className="h-[620px] overflow-y-auto p-5">

                                    {loading ? (
                                        <div className="h-full flex items-center justify-center">

                                            <div className="text-center">

                                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">

                                                    <Loader2
                                                        size={
                                                            28
                                                        }
                                                        className="animate-spin text-blue-500"
                                                    />

                                                </div>

                                                <h3 className="font-semibold">
                                                    Generating your solution...
                                                </h3>

                                                <p
                                                    className={`text-sm mt-1 ${mutedText}`}
                                                >
                                                    Building an optimized{" "}
                                                    {
                                                        getLanguageLabel(
                                                            language
                                                        )
                                                    }{" "}
                                                    solution.
                                                </p>

                                            </div>

                                        </div>
                                    ) : error ? (
                                        <ErrorCard
                                            error={
                                                error
                                            }
                                            isDark={
                                                isDark
                                            }
                                            onRetry={
                                                retryCurrentAction
                                            }
                                            onDismiss={() =>
                                                setError(
                                                    null
                                                )
                                            }
                                        />
                                    ) : result ? (
                                        <MarkdownContent
                                            content={
                                                result
                                            }
                                            isDark={
                                                isDark
                                            }
                                        />
                                    ) : (
                                        <GenerateEmptyState
                                            isDark={
                                                isDark
                                            }
                                        />
                                    )}

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ==================================================
                        FEATURE CARDS
                    ================================================== */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                        <InfoCard
                            icon={
                                <Code2
                                    size={
                                        19
                                    }
                                />
                            }
                            title="Understand"
                            description="Break down difficult algorithms and code into simple explanations."
                            isDark={
                                isDark
                            }
                            iconClass="text-blue-500"
                        />

                        <InfoCard
                            icon={
                                <Bug
                                    size={
                                        19
                                    }
                                />
                            }
                            title="Debug"
                            description="Find syntax, logical, runtime and edge-case issues in your solutions."
                            isDark={
                                isDark
                            }
                            iconClass="text-red-500"
                        />

                        <InfoCard
                            icon={
                                <Zap
                                    size={
                                        19
                                    }
                                />
                            }
                            title="Improve"
                            description="Optimize your solutions and understand their time and space complexity."
                            isDark={
                                isDark
                            }
                            iconClass="text-green-500"
                        />

                    </div>

                </main>
            </div>
        </div>
    );
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
    icon,
    title,
    description,
    isDark,
    iconClass,
}) {
    return (
        <div
            className={`border rounded-2xl p-5 transition ${
                isDark
                    ? "bg-slate-900 border-slate-700 hover:border-slate-600"
                    : "bg-white border-slate-200 hover:border-slate-300"
            }`}
        >

            <div className="flex items-center gap-3 mb-3">

                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDark
                            ? "bg-slate-800"
                            : "bg-slate-50"
                    } ${iconClass}`}
                >
                    {icon}
                </div>

                <h3 className="font-semibold">
                    {title}
                </h3>

            </div>

            <p
                className={`text-sm leading-6 ${
                    isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                }`}
            >
                {description}
            </p>

        </div>
    );
}


export default AICodingAssistant;