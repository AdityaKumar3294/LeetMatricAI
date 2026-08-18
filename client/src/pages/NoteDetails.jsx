import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    FileText,
    Pin,
    Pencil,
    Trash2,
    Loader2,
    Tag,
    CalendarDays,
    Clock3
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getNoteById,
    togglePinNote,
    deleteNote
} from "../services/noteService";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";


function NoteDetails() {

    const { theme } = useTheme();

    const { noteId } = useParams();

    const navigate = useNavigate();


    // ==========================================
    // State
    // ==========================================

    const [note, setNote] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [pinning, setPinning] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);


    // ==========================================
    // Fetch Note
    // ==========================================

    useEffect(() => {

        const fetchNote = async () => {

            if (!noteId) {

                setError("Invalid note ID.");

                setNote(null);

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                setError("");

                const response =
                    await getNoteById(noteId);

                if (
                    !response ||
                    !response.note
                ) {

                    throw new Error(
                        "Note was not returned by the server."
                    );

                }

                setNote(
                    response.note
                );

            } catch (error) {

                console.error(
                    "Get Note Details Error:",
                    error
                );

                setNote(null);

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load note."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchNote();

    }, [noteId]);


    // ==========================================
    // Toggle Pin
    // ==========================================

    const handleTogglePin = async () => {

        if (
            !note ||
            pinning
        ) {
            return;
        }

        try {

            setPinning(true);

            setError("");

            const response =
                await togglePinNote(
                    note._id
                );

            if (
                !response ||
                !response.note
            ) {

                throw new Error(
                    "Invalid pin response."
                );

            }

            setNote(
                response.note
            );

        } catch (error) {

            console.error(
                "Toggle Pin Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to update pin status."
            );

        } finally {

            setPinning(false);

        }

    };


    // ==========================================
    // Open Edit
    // ==========================================

    const handleEdit = () => {

        navigate(
            `/notes?edit=${note._id}`
        );

    };


    // ==========================================
    // Delete Note
    // ==========================================

    const handleDelete = async () => {

        if (
            !note ||
            deleting
        ) {
            return;
        }

        try {

            setDeleting(true);

            setError("");

            await deleteNote(
                note._id
            );

            setShowDeleteModal(false);

            navigate(
                "/notes",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Delete Note Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to delete note."
            );

            setDeleting(false);

        }

    };


    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "N/A";
        }

        return parsedDate.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    // ==========================================
    // Format Reading Time
    // ==========================================

    const calculateReadingTime = (
        content = ""
    ) => {

        const words =
            content
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;

        if (!words) {
            return "1 min read";
        }

        const minutes =
            Math.max(
                1,
                Math.ceil(words / 200)
            );

        return `${minutes} min read`;

    };


    // ==========================================
    // Close Modal
    // ==========================================

    const closeDeleteModal = () => {

        if (deleting) {
            return;
        }

        setShowDeleteModal(false);

    };


    // ==========================================
    // Loading Screen
    // ==========================================

    if (loading) {

        return (

            <div
                className={`min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="lg:ml-64 min-h-screen">

                    <Navbar />

                    <main
                        className="min-h-[calc(100vh-70px)] flex items-center justify-center p-6"
                    >

                        <div
                            className={`flex flex-col items-center gap-4 rounded-2xl border p-8 shadow-lg ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <Loader2
                                size={34}
                                className="animate-spin text-blue-600"
                            />

                            <div className="text-center">

                                <p className="font-semibold">
                                    Loading note...
                                </p>

                                <p
                                    className={`text-sm mt-1 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Preparing your revision note
                                </p>

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ==========================================
    // Error / Not Found
    // ==========================================

    if (
        error ||
        !note
    ) {

        return (

            <div
                className={`min-h-screen ${
                    theme === "dark"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }`}
            >

                <Sidebar />

                <div className="lg:ml-64 min-h-screen">

                    <Navbar />

                    <main
                        className="min-h-[calc(100vh-70px)] flex items-center justify-center p-6"
                    >

                        <div
                            className={`w-full max-w-md rounded-2xl border p-8 text-center shadow-xl ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div
                                className="w-16 h-16 rounded-2xl bg-red-100 mx-auto flex items-center justify-center mb-5"
                            >

                                <FileText
                                    size={32}
                                    className="text-red-600"
                                />

                            </div>


                            <h2
                                className="text-xl font-bold mb-2"
                            >
                                Unable to Open Note
                            </h2>


                            <p
                                className={`text-sm leading-6 mb-6 ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            >
                                {error ||
                                    "The requested note could not be found."}
                            </p>


                            <div
                                className="flex flex-col sm:flex-row gap-3 justify-center"
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/notes")
                                    }
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition"
                                >

                                    <ArrowLeft
                                        size={18}
                                    />

                                    Back to Notes

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                    className={`px-5 py-3 rounded-xl border-2 font-semibold transition ${
                                        theme === "dark"
                                            ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    Retry
                                </button>

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ==========================================
    // Safe Data
    // ==========================================

    const createdDate =
        formatDate(
            note.createdAt
        );

    const updatedDate =
        formatDate(
            note.updatedAt
        );

    const noteTags =
        Array.isArray(note.tags)
            ? note.tags
            : [];

    const readingTime =
        calculateReadingTime(
            note.content
        );


    // ==========================================
    // Render
    // ==========================================

    return (

        <div
            className={`min-h-screen transition-colors duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            <Sidebar />


            <div
                className="lg:ml-64 min-h-screen"
            >

                <Navbar />


                <main
                    className="px-4 py-5 sm:px-6 lg:p-8"
                >

                    {/* ==========================================
                        BACK
                    ========================================== */}

                    <div
                        className="max-w-5xl mx-auto mb-6"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/notes")
                            }
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
                        >

                            <ArrowLeft
                                size={18}
                            />

                            Back to Notes

                        </button>

                    </div>


                    {/* ==========================================
                        ERROR BANNER
                    ========================================== */}

                    {error && (

                        <div
                            className={`max-w-5xl mx-auto mb-5 rounded-xl border px-4 py-3 text-sm ${
                                theme === "dark"
                                    ? "bg-red-950/30 border-red-800 text-red-400"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >

                            <div className="flex items-start gap-2">

                                <span>
                                    ⚠
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        </div>

                    )}


                    {/* ==========================================
                        NOTE CONTAINER
                    ========================================== */}

                    <article
                        className={`max-w-5xl mx-auto rounded-3xl border shadow-xl overflow-hidden ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        {/* ==========================================
                            HEADER
                        ========================================== */}

                        <header
                            className={`p-6 sm:p-8 lg:p-10 border-b ${
                                theme === "dark"
                                    ? "border-slate-700"
                                    : "border-slate-200"
                            }`}
                        >

                            <div
                                className="flex flex-col gap-7"
                            >

                                {/* Top Row */}

                                <div
                                    className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
                                >

                                    {/* Title Area */}

                                    <div
                                        className="min-w-0 flex-1"
                                    >

                                        <div
                                            className="flex flex-wrap items-center gap-3 mb-5"
                                        >

                                            <div
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    theme === "dark"
                                                        ? "bg-blue-950"
                                                        : "bg-blue-50"
                                                }`}
                                            >

                                                <FileText
                                                    size={25}
                                                    className="text-blue-600"
                                                />

                                            </div>


                                            {note.pinned && (

                                                <span
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold"
                                                >

                                                    <Pin
                                                        size={15}
                                                        className="fill-current"
                                                    />

                                                    Pinned

                                                </span>

                                            )}

                                        </div>


                                        <h1
                                            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight break-words"
                                        >
                                            {note.title ||
                                                "Untitled Note"}
                                        </h1>


                                        <div
                                            className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-5"
                                        >

                                            <span
                                                className="inline-flex items-center gap-2 text-sm text-slate-500"
                                            >

                                                <CalendarDays
                                                    size={16}
                                                />

                                                Created {createdDate}

                                            </span>


                                            <span
                                                className="inline-flex items-center gap-2 text-sm text-slate-500"
                                            >

                                                <Clock3
                                                    size={16}
                                                />

                                                {readingTime}

                                            </span>

                                        </div>

                                    </div>


                                    {/* Actions */}

                                    <div
                                        className="flex flex-wrap gap-3 lg:justify-end"
                                    >

                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                                        >

                                            <Pencil
                                                size={17}
                                            />

                                            Edit

                                        </button>


                                        <button
                                            type="button"
                                            onClick={handleTogglePin}
                                            disabled={pinning}
                                            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                                                note.pinned
                                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                                    : theme === "dark"
                                                        ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                                                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                            }`}
                                        >

                                            {pinning ? (

                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <Pin
                                                    size={17}
                                                    className={
                                                        note.pinned
                                                            ? "fill-current"
                                                            : ""
                                                    }
                                                />

                                            )}

                                            {note.pinned
                                                ? "Unpin"
                                                : "Pin"}

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDeleteModal(
                                                    true
                                                )
                                            }
                                            disabled={deleting}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60"
                                        >

                                            <Trash2
                                                size={17}
                                            />

                                            Delete

                                        </button>

                                    </div>

                                </div>


                                {/* Updated Metadata */}

                                <div
                                    className={`rounded-2xl border p-4 ${
                                        theme === "dark"
                                            ? "bg-slate-800/60 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}
                                >

                                    <div
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                                    >

                                        <div>

                                            <p
                                                className={`text-xs uppercase tracking-wider font-semibold ${
                                                    theme === "dark"
                                                        ? "text-slate-500"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                Last updated
                                            </p>

                                            <p
                                                className={`text-sm mt-1 ${
                                                    theme === "dark"
                                                        ? "text-slate-300"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {updatedDate}
                                            </p>

                                        </div>


                                        <div
                                            className={`text-xs ${
                                                theme === "dark"
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            Keep this note updated for revision.
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </header>


                        {/* ==========================================
                            TOPICS
                        ========================================== */}

                        {noteTags.length > 0 && (

                            <section
                                className={`px-6 sm:px-8 lg:px-10 py-6 border-b ${
                                    theme === "dark"
                                        ? "border-slate-700"
                                        : "border-slate-200"
                                }`}
                            >

                                <div
                                    className="flex items-center gap-2 mb-4"
                                >

                                    <Tag
                                        size={17}
                                        className="text-blue-600"
                                    />

                                    <span className="font-semibold">
                                        Topics
                                    </span>

                                </div>


                                <div
                                    className="flex flex-wrap gap-2"
                                >

                                    {noteTags.map(
                                        (tag, index) => (

                                            <span
                                                key={`${tag}-${index}`}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                                    theme === "dark"
                                                        ? "bg-blue-950 text-blue-300"
                                                        : "bg-blue-50 text-blue-700"
                                                }`}
                                            >
                                                #{tag}
                                            </span>

                                        )
                                    )}

                                </div>

                            </section>

                        )}


                        {/* ==========================================
                            CONTENT
                        ========================================== */}

                        <section
                            className="p-6 sm:p-8 lg:p-10"
                        >

                            <div
                                className={`max-w-none whitespace-pre-wrap break-words text-base sm:text-lg leading-8 ${
                                    theme === "dark"
                                        ? "text-slate-200"
                                        : "text-slate-700"
                                }`}
                            >
                                {note.content ||
                                    "This note has no content."}
                            </div>

                        </section>


                        {/* ==========================================
                            FOOTER
                        ========================================== */}

                        <footer
                            className={`px-6 sm:px-8 lg:px-10 py-5 border-t ${
                                theme === "dark"
                                    ? "border-slate-700 bg-slate-950/30"
                                    : "border-slate-200 bg-slate-50/70"
                            }`}
                        >

                            <div
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            >

                                <p
                                    className={`text-sm ${
                                        theme === "dark"
                                            ? "text-slate-500"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Saved in your personal revision library.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/notes")
                                    }
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                                >

                                    <ArrowLeft
                                        size={16}
                                    />

                                    Back to Notes

                                </button>

                            </div>

                        </footer>

                    </article>


                    {/* ==========================================
                        DELETE CONFIRMATION MODAL
                    ========================================== */}

                    {showDeleteModal && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >

                            {/* Overlay */}

                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={closeDeleteModal}
                            />


                            {/* Modal */}

                            <div
                                className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <div
                                    className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5"
                                >

                                    <Trash2
                                        size={24}
                                        className="text-red-600"
                                    />

                                </div>


                                <h2
                                    className="text-xl font-bold mb-2"
                                >
                                    Delete Note?
                                </h2>


                                <p
                                    className={`text-sm leading-6 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >

                                    Are you sure you want to permanently
                                    delete{" "}

                                    <span
                                        className={`font-semibold ${
                                            theme === "dark"
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {note.title}
                                    </span>
                                    ?

                                </p>


                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            closeDeleteModal
                                        }
                                        disabled={deleting}
                                        className={`w-full px-4 py-3 rounded-xl border-2 font-semibold transition ${
                                            theme === "dark"
                                                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                                                : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={deleting}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition ${
                                            deleting
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >

                                        {deleting ? (

                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                                Deleting...
                                            </>

                                        ) : (

                                            <>
                                                <Trash2
                                                    size={17}
                                                />

                                                Delete Note
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>

    );

}


export default NoteDetails;