import React, { useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import { getCompanyRoadmap } from "../services/aiService";

import ReactMarkdown from "react-markdown";

import {
    Building2,
    Search,
    Loader2,
    RefreshCw,
    AlertTriangle,
    Sparkles,
    Target,
    BookOpen,
    CalendarDays,
    Flame,
    Pin,
    BarChart3,
    Lightbulb,
    Rocket,
    ChevronDown,
    ChevronUp
} from "lucide-react";


// ============================================================
// QUICK COMPANY OPTIONS
// ============================================================

const COMPANIES = [
    "Google",
    "Amazon",
    "Microsoft",
    "Meta",
    "Apple",
    "Adobe",
    "Netflix",
    "Uber",
    "Flipkart",
    "TCS",
    "Infosys",
    "Accenture"
];


// ============================================================
// SECTION ICON
// ============================================================

const getSectionIcon = (title = "") => {

    const value = title.toLowerCase();

    if (value.includes("company")) {
        return Building2;
    }

    if (value.includes("current level")) {
        return Target;
    }

    if (value.includes("topics")) {
        return BookOpen;
    }

    if (value.includes("week")) {
        return CalendarDays;
    }

    if (value.includes("pattern")) {
        return Flame;
    }

    if (value.includes("must solve")) {
        return Pin;
    }

    if (value.includes("difficulty")) {
        return BarChart3;
    }

    if (value.includes("interview")) {
        return Lightbulb;
    }

    if (value.includes("motivation")) {
        return Rocket;
    }

    return BookOpen;
};


// ============================================================
// PARSE ROADMAP MARKDOWN
// ============================================================

const parseRoadmapSections = (markdown) => {

    if (
        !markdown ||
        typeof markdown !== "string"
    ) {
        return [];
    }

    const normalized =
        markdown
            .replace(/\r\n/g, "\n")
            .trim();

    const lines =
        normalized.split("\n");

    const sections = [];

    let currentSection = null;

    lines.forEach((line) => {

        const trimmed =
            line.trim();

        // ----------------------------------------------------
        // Detect headings / emoji sections
        // ----------------------------------------------------

        const isHeading =
            /^#{1,3}\s+/.test(trimmed) ||
            /^[🏢🎯📚📅🔥📌📊💡🚀]\s+/.test(trimmed);

        if (isHeading) {

            let title =
                trimmed
                    .replace(/^#{1,3}\s+/, "")
                    .trim();

            if (!title) {
                return;
            }

            if (currentSection) {
                sections.push(currentSection);
            }

            currentSection = {
                title,
                content: []
            };

            return;
        }

        // ----------------------------------------------------
        // Normal content
        // ----------------------------------------------------

        if (currentSection) {

            currentSection.content.push(line);

        } else {

            currentSection = {
                title: "Overview",
                content: [line]
            };

        }

    });

    if (currentSection) {
        sections.push(currentSection);
    }

    return sections
        .map((section) => ({
            ...section,
            content:
                section.content
                    .join("\n")
                    .trim()
        }))
        .filter(
            (section) =>
                section.content
        );
};


// ============================================================
// COMPONENT
// ============================================================

function CompanyRoadmap() {

    const { theme } = useTheme();


    // ========================================================
    // STATE
    // ========================================================

    // Google remains the default highlighted option,
    // but NO roadmap is generated automatically.
    const [selectedCompany, setSelectedCompany] =
        useState("Google");

    const [searchCompany, setSearchCompany] =
        useState("");

    const [roadmap, setRoadmap] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [expandedSections, setExpandedSections] =
        useState({});


    // ========================================================
    // PARSED SECTIONS
    // ========================================================

    const sections = useMemo(
        () =>
            parseRoadmapSections(
                roadmap
            ),
        [roadmap]
    );


    // ========================================================
    // FETCH ROADMAP
    // ========================================================

    const fetchRoadmap = async (
        company = selectedCompany
    ) => {

        try {

            setLoading(true);
            setError(null);

            console.log(
                `🔵 Loading ${company} roadmap...`
            );

            const result =
                await getCompanyRoadmap(
                    company
                );

            console.log(
                "🟢 FULL COMPANY ROADMAP:",
                JSON.stringify(
                    result,
                    null,
                    2
                )
            );

            if (
                !result?.success ||
                !result?.roadmap
            ) {

                throw new Error(
                    result?.message ||
                    "Unable to load company roadmap."
                );
            }

            setSelectedCompany(
                result.company ||
                company
            );

            setRoadmap(
                result.roadmap
            );

            // Open all sections initially
            const parsed =
                parseRoadmapSections(
                    result.roadmap
                );

            const initialExpanded = {};

            parsed.forEach(
                (_, index) => {
                    initialExpanded[index] =
                        true;
                }
            );

            setExpandedSections(
                initialExpanded
            );

        } catch (error) {

            console.error(
                "🔴 COMPANY ROADMAP ERROR:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load company roadmap."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // IMPORTANT:
    // NO useEffect here.
    //
    // The page DOES NOT automatically generate Google's roadmap.
    //
    // Roadmap is generated only when:
    // 1. User clicks a company
    // 2. User searches for a company
    // 3. User clicks Regenerate
    // ========================================================


    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = (event) => {

        event.preventDefault();

        const company =
            searchCompany.trim();

        if (!company) {
            return;
        }

        setSearchCompany("");

        fetchRoadmap(
            company
        );
    };


    // ========================================================
    // COMPANY SELECT
    // ========================================================

    const handleCompanySelect = (
        company
    ) => {

        setSearchCompany("");

        fetchRoadmap(
            company
        );
    };


    // ========================================================
    // TOGGLE SECTION
    // ========================================================

    const toggleSection = (
        index
    ) => {

        setExpandedSections(
            (previous) => ({
                ...previous,
                [index]:
                    !previous[index]
            })
        );
    };


    // ========================================================
    // EXPAND ALL
    // ========================================================

    const expandAll = () => {

        const state = {};

        sections.forEach(
            (_, index) => {
                state[index] = true;
            }
        );

        setExpandedSections(state);
    };


    // ========================================================
    // COLLAPSE ALL
    // ========================================================

    const collapseAll = () => {

        const state = {};

        sections.forEach(
            (_, index) => {
                state[index] = false;
            }
        );

        setExpandedSections(state);
    };


    // ========================================================
    // THEME CLASSES
    // ========================================================

    const pageClass =
        theme === "dark"
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900";

    const cardClass =
        theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200";

    const mutedText =
        theme === "dark"
            ? "text-slate-400"
            : "text-slate-600";


    // ========================================================
    // INITIAL LOADING
    // ========================================================

    if (
        loading &&
        !roadmap
    ) {

        return (

            <div
                className={`flex min-h-screen ${pageClass}`}
            >

                <Sidebar />

                <div className="flex-1 ml-64">

                    <Navbar />

                    <main
                        className="
                            min-h-[80vh]
                            flex
                            items-center
                            justify-center
                            px-6
                        "
                    >

                        <div className="text-center">

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-2xl
                                    bg-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                    mx-auto
                                    mb-6
                                    shadow-xl
                                    shadow-indigo-500/20
                                "
                            >

                                <Sparkles
                                    size={38}
                                    className="text-white"
                                />

                            </div>

                            <Loader2
                                size={35}
                                className="
                                    animate-spin
                                    mx-auto
                                    mb-5
                                    text-indigo-500
                                "
                            />

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    mb-2
                                "
                            >
                                Generating Company Roadmap
                            </h2>

                            <p
                                className={mutedText}
                            >
                                AI is analyzing your
                                LeetCode performance for{" "}
                                <strong>
                                    {selectedCompany}
                                </strong>
                                .
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                    mt-2
                                "
                            >
                                This may take a few moments.
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // ========================================================
    // MAIN
    // ========================================================

    return (

        <div
            className={`flex min-h-screen ${pageClass}`}
        >

            <Sidebar />

            <div className="flex-1 ml-64">

                <Navbar />

                <main
                    className="
                        p-6
                        max-w-7xl
                        mx-auto
                    "
                >

                    {/* ==================================================
                        PAGE HEADER
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-5
                            mb-8
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-2
                                "
                            >

                                <div
                                    className="
                                        p-3
                                        rounded-xl
                                        bg-indigo-600
                                        text-white
                                        shadow-lg
                                        shadow-indigo-500/20
                                    "
                                >

                                    <Building2
                                        size={28}
                                    />

                                </div>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                    "
                                >
                                    Company Roadmap
                                </h1>

                            </div>

                            <p
                                className={mutedText}
                            >
                                AI-powered interview preparation
                                personalized to your LeetCode performance.
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        COMPANY SELECTOR
                    ================================================== */}

                    <div
                        className={`
                            rounded-2xl
                            border
                            p-6
                            mb-8
                            ${cardClass}
                        `}
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mb-4
                            "
                        >

                            <Target
                                size={20}
                                className="text-indigo-500"
                            />

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                "
                            >
                                Select Company
                            </h2>

                        </div>


                        {/* QUICK SELECT */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                                mb-5
                            "
                        >

                            {COMPANIES.map(
                                (company) => (

                                    <button
                                        key={company}
                                        onClick={() =>
                                            handleCompanySelect(
                                                company
                                            )
                                        }
                                        disabled={loading}
                                        className={`
                                            px-4
                                            py-2
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            transition-all
                                            ${
                                                selectedCompany
                                                    .toLowerCase() ===
                                                company.toLowerCase() &&
                                                roadmap
                                                    ? "bg-indigo-600 text-white shadow-md"
                                                    : theme === "dark"
                                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }
                                            ${
                                                loading
                                                    ? "cursor-not-allowed opacity-60"
                                                    : ""
                                            }
                                        `}
                                    >

                                        {company}

                                    </button>

                                )
                            )}

                        </div>


                        {/* CUSTOM COMPANY SEARCH */}

                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                            "
                        >

                            <div
                                className="
                                    relative
                                    flex-1
                                "
                            >

                                <Search
                                    size={19}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    value={
                                        searchCompany
                                    }
                                    onChange={(event) =>
                                        setSearchCompany(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter any company..."
                                    disabled={loading}
                                    className={`
                                        w-full
                                        pl-11
                                        pr-4
                                        py-3
                                        rounded-xl
                                        border
                                        outline-none
                                        focus:ring-2
                                        focus:ring-indigo-500
                                        ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white"
                                                : "bg-slate-50 border-slate-200 text-slate-900"
                                        }
                                    `}
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !searchCompany.trim()
                                }
                                className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    text-white
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >

                                {loading ? (

                                    <Loader2
                                        size={18}
                                        className="
                                            animate-spin
                                        "
                                    />

                                ) : (

                                    <Search
                                        size={18}
                                    />

                                )}

                                Search

                            </button>

                        </form>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-red-300
                                bg-red-50
                                text-red-700
                                p-5
                                mb-8
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <AlertTriangle
                                    size={22}
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                            <button
                                onClick={() =>
                                    fetchRoadmap(
                                        selectedCompany
                                    )
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-lg
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    font-semibold
                                "
                            >

                                <RefreshCw
                                    size={17}
                                />

                                Retry

                            </button>

                        </div>
                    )}


                    {/* ==================================================
                        EMPTY STATE
                    ================================================== */}

                    {!roadmap &&
                        !loading &&
                        !error && (

                            <div
                                className={`
                                    rounded-2xl
                                    border
                                    p-12
                                    text-center
                                    ${cardClass}
                                `}
                            >

                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-2xl
                                        bg-indigo-500/10
                                        flex
                                        items-center
                                        justify-center
                                        mx-auto
                                        mb-6
                                    "
                                >

                                    <Building2
                                        size={38}
                                        className="text-indigo-500"
                                    />

                                </div>


                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        mb-3
                                    "
                                >
                                    Choose a Company
                                </h2>


                                <p
                                    className={`
                                        max-w-xl
                                        mx-auto
                                        leading-7
                                        ${mutedText}
                                    `}
                                >
                                    Select a company above to generate
                                    a personalized interview preparation
                                    roadmap based on your current
                                    LeetCode performance.
                                </p>


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        mt-5
                                        text-sm
                                        text-indigo-500
                                        font-medium
                                    "
                                >

                                    <Sparkles
                                        size={17}
                                    />

                                    AI will generate your roadmap
                                    after you select a company.

                                </div>

                            </div>

                        )}


                    {/* ==================================================
                        ROADMAP
                    ================================================== */}

                    {roadmap && (

                        <div
                            className="space-y-6"
                        >

                            {/* ==================================================
                                ROADMAP HEADER
                            ================================================== */}

                            <div
                                className={`
                                    rounded-2xl
                                    border
                                    p-6
                                    ${cardClass}
                                `}
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                        gap-5
                                    "
                                >

                                    <div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                mb-2
                                            "
                                        >

                                            <div
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-xl
                                                    bg-indigo-500/10
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >

                                                <Building2
                                                    size={22}
                                                    className="text-indigo-500"
                                                />

                                            </div>

                                            <h2
                                                className="
                                                    text-2xl
                                                    font-bold
                                                "
                                            >
                                                {selectedCompany}
                                            </h2>

                                        </div>

                                        <p
                                            className={mutedText}
                                        >
                                            Personalized interview
                                            preparation roadmap.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >

                                        <button
                                            onClick={
                                                expandAll
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                text-sm
                                                font-semibold
                                                bg-indigo-500/10
                                                text-indigo-500
                                                hover:bg-indigo-500/20
                                            "
                                        >
                                            Expand All
                                        </button>


                                        <button
                                            onClick={
                                                collapseAll
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                text-sm
                                                font-semibold
                                                bg-slate-500/10
                                                text-slate-500
                                                hover:bg-slate-500/20
                                            "
                                        >
                                            Collapse All
                                        </button>


                                        <button
                                            onClick={() =>
                                                fetchRoadmap(
                                                    selectedCompany
                                                )
                                            }
                                            disabled={loading}
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-indigo-600
                                                hover:bg-indigo-700
                                                disabled:opacity-50
                                                text-white
                                                font-semibold
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            {loading ? (

                                                <Loader2
                                                    size={17}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                            ) : (

                                                <RefreshCw
                                                    size={17}
                                                />

                                            )}

                                            Regenerate

                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* ==================================================
                                SECTION CARDS
                            ================================================== */}

                            {sections.length > 0 ? (

                                sections.map(
                                    (
                                        section,
                                        index
                                    ) => {

                                        const Icon =
                                            getSectionIcon(
                                                section.title
                                            );

                                        const expanded =
                                            expandedSections[
                                                index
                                            ] !== false;

                                        const isWeek =
                                            section.title
                                                .toLowerCase()
                                                .includes(
                                                    "week"
                                                );

                                        return (

                                            <div
                                                key={index}
                                                className={`
                                                    rounded-2xl
                                                    border
                                                    overflow-hidden
                                                    transition-all
                                                    duration-300
                                                    ${cardClass}
                                                `}
                                            >

                                                {/* SECTION HEADER */}

                                                <button
                                                    onClick={() =>
                                                        toggleSection(
                                                            index
                                                        )
                                                    }
                                                    className="
                                                        w-full
                                                        px-6
                                                        py-5
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                        text-left
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                w-12
                                                                h-12
                                                                rounded-xl
                                                                flex
                                                                items-center
                                                                justify-center
                                                                ${
                                                                    isWeek
                                                                        ? "bg-emerald-500/10"
                                                                        : "bg-indigo-500/10"
                                                                }
                                                            `}
                                                        >

                                                            <Icon
                                                                size={23}
                                                                className={
                                                                    isWeek
                                                                        ? "text-emerald-500"
                                                                        : "text-indigo-500"
                                                                }
                                                            />

                                                        </div>


                                                        <div>

                                                            <h3
                                                                className="
                                                                    text-lg
                                                                    font-bold
                                                                "
                                                            >
                                                                {section.title}
                                                            </h3>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-500
                                                                    mt-1
                                                                "
                                                            >
                                                                {isWeek
                                                                    ? "Weekly preparation target"
                                                                    : "AI-generated preparation guidance"}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div>

                                                        {expanded ? (

                                                            <ChevronUp
                                                                size={21}
                                                                className="
                                                                    text-slate-400
                                                                "
                                                            />

                                                        ) : (

                                                            <ChevronDown
                                                                size={21}
                                                                className="
                                                                    text-slate-400
                                                                "
                                                            />

                                                        )}

                                                    </div>

                                                </button>


                                                {/* CONTENT */}

                                                {expanded && (

                                                    <div
                                                        className={`
                                                            px-6
                                                            pb-7
                                                            pt-1
                                                            border-t
                                                            ${
                                                                theme === "dark"
                                                                    ? "border-slate-800"
                                                                    : "border-slate-200"
                                                            }
                                                        `}
                                                    >

                                                        <div
                                                            className={`
                                                                roadmap-content
                                                                leading-7
                                                                ${
                                                                    theme === "dark"
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }
                                                            `}
                                                        >

                                                            <ReactMarkdown
                                                                components={{

                                                                    h1: ({
                                                                        children
                                                                    }) => (

                                                                        <h3
                                                                            className="
                                                                                text-xl
                                                                                font-bold
                                                                                text-indigo-500
                                                                                mt-5
                                                                                mb-3
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </h3>

                                                                    ),

                                                                    h2: ({
                                                                        children
                                                                    }) => (

                                                                        <h3
                                                                            className="
                                                                                text-xl
                                                                                font-bold
                                                                                text-indigo-500
                                                                                mt-5
                                                                                mb-3
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </h3>

                                                                    ),

                                                                    h3: ({
                                                                        children
                                                                    }) => (

                                                                        <h4
                                                                            className="
                                                                                text-lg
                                                                                font-bold
                                                                                text-indigo-500
                                                                                mt-5
                                                                                mb-3
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </h4>

                                                                    ),

                                                                    p: ({
                                                                        children
                                                                    }) => (

                                                                        <p
                                                                            className="
                                                                                mb-4
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </p>

                                                                    ),

                                                                    ul: ({
                                                                        children
                                                                    }) => (

                                                                        <ul
                                                                            className="
                                                                                list-disc
                                                                                pl-6
                                                                                mb-5
                                                                                space-y-2
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </ul>

                                                                    ),

                                                                    ol: ({
                                                                        children
                                                                    }) => (

                                                                        <ol
                                                                            className="
                                                                                list-decimal
                                                                                pl-6
                                                                                mb-5
                                                                                space-y-2
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </ol>

                                                                    ),

                                                                    li: ({
                                                                        children
                                                                    }) => (

                                                                        <li>
                                                                            {children}
                                                                        </li>

                                                                    ),

                                                                    strong: ({
                                                                        children
                                                                    }) => (

                                                                        <strong
                                                                            className="
                                                                                font-semibold
                                                                                text-indigo-500
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </strong>

                                                                    ),

                                                                    em: ({
                                                                        children
                                                                    }) => (

                                                                        <em
                                                                            className="
                                                                                text-slate-500
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </em>

                                                                    ),

                                                                    hr: () => (

                                                                        <hr
                                                                            className={`
                                                                                my-6
                                                                                ${
                                                                                    theme === "dark"
                                                                                        ? "border-slate-800"
                                                                                        : "border-slate-200"
                                                                                }
                                                                            `}
                                                                        />

                                                                    ),

                                                                    code: ({
                                                                        children
                                                                    }) => (

                                                                        <code
                                                                            className="
                                                                                px-1.5
                                                                                py-0.5
                                                                                rounded
                                                                                bg-slate-800
                                                                                text-indigo-300
                                                                                text-sm
                                                                            "
                                                                        >
                                                                            {children}
                                                                        </code>

                                                                    ),

                                                                    pre: ({
                                                                        children
                                                                    }) => (

                                                                        <pre
                                                                            className={`
                                                                                overflow-x-auto
                                                                                rounded-xl
                                                                                p-4
                                                                                mb-5
                                                                                text-sm
                                                                                ${
                                                                                    theme === "dark"
                                                                                        ? "bg-slate-950"
                                                                                        : "bg-slate-100"
                                                                                }
                                                                            `}
                                                                        >
                                                                            {children}
                                                                        </pre>

                                                                    )

                                                                }}
                                                            >
                                                                {
                                                                    section.content
                                                                }
                                                            </ReactMarkdown>

                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                        );
                                    }
                                )

                            ) : (

                                <div
                                    className={`
                                        rounded-2xl
                                        border
                                        p-8
                                        ${cardClass}
                                    `}
                                >

                                    <ReactMarkdown>
                                        {roadmap}
                                    </ReactMarkdown>

                                </div>

                            )}


                            {/* ==================================================
                                FOOTER
                            ================================================== */}

                            <div
                                className="
                                    text-center
                                    py-8
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <Sparkles
                                    size={16}
                                    className="
                                        inline
                                        mr-2
                                    "
                                />

                                Roadmap generated dynamically
                                using your current LeetCode performance.

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}


export default CompanyRoadmap;