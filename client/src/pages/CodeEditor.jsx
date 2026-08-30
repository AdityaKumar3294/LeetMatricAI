import { useEffect, useMemo, useRef, useState } from "react";
import {
    Copy,
    Check,
    Trash2,
    FileCode2,
    Maximize2,
    Minimize2,
} from "lucide-react";

const CodeEditor = ({
    value,
    onChange,
    language = "javascript",
    placeholder = "Write or paste your code here...",
    isDark = false,
    disabled = false,
    onRun,
}) => {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    const [copied, setCopied] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    const lineCount = useMemo(() => {
        return Math.max(1, value.split("\n").length);
    }, [value]);

    const lines = useMemo(() => {
        return Array.from(
            { length: lineCount },
            (_, index) => index + 1
        );
    }, [lineCount]);

    const handleCopy = async () => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Code copy error:", error);
        }
    };

    const handleClear = () => {
        onChange("");
        textareaRef.current?.focus();
    };

    const handleTab = (event) => {
        if (event.key !== "Tab") return;

        event.preventDefault();

        const textarea = textareaRef.current;

        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newValue =
            value.substring(0, start) +
            "    " +
            value.substring(end);

        onChange(newValue);

        requestAnimationFrame(() => {
            textarea.selectionStart = start + 4;
            textarea.selectionEnd = start + 4;
        });
    };

    const handleKeyDown = (event) => {
        handleTab(event);

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "Enter"
        ) {
            event.preventDefault();

            if (onRun && value.trim()) {
                onRun();
            }
        }
    };

    const handleScroll = () => {
        const textarea = textareaRef.current;
        const lineNumbers = lineNumbersRef.current;

        if (!textarea || !lineNumbers) return;

        lineNumbers.scrollTop = textarea.scrollTop;
    };

    useEffect(() => {
        if (!fullscreen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setFullscreen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [fullscreen]);

    const editorHeight = fullscreen
        ? "h-[calc(100vh-150px)]"
        : "h-[500px]";

    return (
        <div
            className={`${
                fullscreen
                    ? "fixed inset-4 z-50"
                    : "relative"
            } flex flex-col rounded-xl overflow-hidden border ${
                isDark
                    ? "bg-[#0b1120] border-slate-700"
                    : "bg-white border-slate-200"
            }`}
        >
            {/* ================================================
                EDITOR HEADER
            ================================================= */}

            <div
                className={`flex items-center justify-between px-4 py-3 border-b ${
                    isDark
                        ? "bg-slate-900 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                }`}
            >
                <div className="flex items-center gap-3">

                    {/* Window dots */}

                    <div className="hidden sm:flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>

                    <div className="h-5 w-px bg-slate-500/30 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <FileCode2
                            size={16}
                            className="text-blue-500"
                        />

                        <span
                            className={`text-xs font-semibold ${
                                isDark
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }`}
                        >
                            main.{getExtension(language)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">

                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!value}
                        title="Copy code"
                        className={`p-2 rounded-lg transition ${
                            isDark
                                ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                                : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                        } disabled:opacity-40`}
                    >
                        {copied ? (
                            <Check
                                size={15}
                                className="text-green-500"
                            />
                        ) : (
                            <Copy size={15} />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={!value}
                        title="Clear code"
                        className={`p-2 rounded-lg transition ${
                            isDark
                                ? "hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                                : "hover:bg-red-50 text-slate-500 hover:text-red-500"
                        } disabled:opacity-40`}
                    >
                        <Trash2 size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFullscreen((previous) => !previous)
                        }
                        title={
                            fullscreen
                                ? "Exit fullscreen"
                                : "Fullscreen"
                        }
                        className={`p-2 rounded-lg transition ${
                            isDark
                                ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                                : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        {fullscreen ? (
                            <Minimize2 size={15} />
                        ) : (
                            <Maximize2 size={15} />
                        )}
                    </button>

                </div>
            </div>

            {/* ================================================
                EDITOR BODY
            ================================================= */}

            <div
                className={`relative flex ${editorHeight} overflow-hidden ${
                    isDark
                        ? "bg-[#0a0f1c]"
                        : "bg-[#fafafa]"
                }`}
            >
                {/* Line numbers */}

                <div
                    ref={lineNumbersRef}
                    className={`w-14 shrink-0 overflow-hidden select-none text-right pr-4 pt-4 font-mono text-[13px] leading-6 border-r ${
                        isDark
                            ? "bg-[#0a0f1c] border-slate-800 text-slate-600"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                >
                    {lines.map((line) => (
                        <div
                            key={line}
                            className="h-6"
                        >
                            {line}
                        </div>
                    ))}
                </div>

                {/* Code area */}

                <div className="relative flex-1 min-w-0">

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        onScroll={handleScroll}
                        spellCheck={false}
                        disabled={disabled}
                        placeholder={placeholder}
                        wrap="off"
                        className={`absolute inset-0 w-full h-full resize-none outline-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 whitespace-pre overflow-auto ${
                            isDark
                                ? "text-slate-200 placeholder:text-slate-700 caret-blue-400"
                                : "text-slate-800 placeholder:text-slate-400 caret-blue-600"
                        }`}
                    />

                </div>
            </div>

            {/* ================================================
                FOOTER
            ================================================= */}

            <div
                className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t text-[11px] ${
                    isDark
                        ? "bg-slate-900 border-slate-700 text-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
            >
                <div className="flex items-center gap-4">

                    <span>
                        {lineCount}{" "}
                        {lineCount === 1
                            ? "line"
                            : "lines"}
                    </span>

                    <span>
                        {value.length} characters
                    </span>

                    <span className="hidden sm:inline">
                        {language.toUpperCase()}
                    </span>

                </div>

                <div className="hidden sm:block">
                    Tab = 4 spaces&nbsp;&nbsp; • &nbsp;&nbsp;
                    Ctrl + Enter = Run
                </div>
            </div>
        </div>
    );
};

function getExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        cpp: "cpp",
        java: "java",
    };

    return extensions[language] || "txt";
}

export default CodeEditor;