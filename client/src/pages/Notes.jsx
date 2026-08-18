import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Plus,
    FileText,
    Pin,
    Tag,
    BookOpen,
    StickyNote,
    X,
    Save,
    Loader2,
    Pencil,
    Trash2,
    ArrowUpDown,
} from "lucide-react";

import {
    createNote,
    getAllNotes,
    updateNote,
    togglePinNote,
    deleteNote,
    searchNotes,
} from "../services/noteService";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useTheme } from "../context/ThemeContext";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";


function Notes() {

    const { theme } = useTheme();

    const navigate = useNavigate();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    // =========================================================
    // CREATE NOTE STATE
    // =========================================================

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [noteTitle, setNoteTitle] =
        useState("");

    const [noteContent, setNoteContent] =
        useState("");

    const [noteTags, setNoteTags] =
        useState("");

    const [notePinned, setNotePinned] =
        useState(false);

    const [savingNote, setSavingNote] =
        useState(false);


    // =========================================================
    // NOTES STATE
    // =========================================================

    const [allNotes, setAllNotes] =
        useState([]);

    const [notes, setNotes] =
        useState([]);

    const [notesLoading, setNotesLoading] =
        useState(true);

    const [notesError, setNotesError] =
        useState("");

    const [noteError, setNoteError] =
        useState("");

    const [noteSuccess, setNoteSuccess] =
        useState("");


    // =========================================================
    // SEARCH STATE
    // =========================================================

    const [searchQuery, setSearchQuery] =
        useState("");

    const [searchLoading, setSearchLoading] =
        useState(false);


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [selectedTopic, setSelectedTopic] =
        useState("all");

    const [showPinnedOnly, setShowPinnedOnly] =
        useState(false);


    // =========================================================
    // SORT STATE
    // =========================================================

    const [sortBy, setSortBy] =
        useState("newest");


    // =========================================================
    // EDIT NOTE STATE
    // =========================================================

    const [editingNote, setEditingNote] =
        useState(null);

    const [editTitle, setEditTitle] =
        useState("");

    const [editContent, setEditContent] =
        useState("");

    const [editTags, setEditTags] =
        useState("");

    const [updatingNote, setUpdatingNote] =
        useState(false);


    // =========================================================
    // DELETE NOTE STATE
    // =========================================================

    const [noteToDelete, setNoteToDelete] =
        useState(null);

    const [deletingNote, setDeletingNote] =
        useState(null);


    // =========================================================
    // PIN STATE
    // =========================================================

    const [pinningNote, setPinningNote] =
        useState(null);


    // =========================================================
    // AVAILABLE TOPICS
    // =========================================================

    const availableTopics = useMemo(() => {

        return [
            ...new Set(
                allNotes
                    .flatMap(
                        (note) =>
                            note.tags || []
                    )
                    .map(
                        (tag) =>
                            tag
                                .trim()
                                .toLowerCase()
                    )
                    .filter(Boolean)
            ),
        ].sort();

    }, [allNotes]);


    // =========================================================
    // OPEN CREATE MODAL
    // =========================================================

    const openCreateModal = () => {

        setNoteError("");

        setNoteSuccess("");

        setShowCreateModal(true);

    };


    // =========================================================
    // CLOSE CREATE MODAL
    // =========================================================

    const closeCreateModal = () => {

        if (savingNote) {
            return;
        }

        setShowCreateModal(false);

        setNoteError("");

    };


    // =========================================================
    // RESET CREATE FORM
    // =========================================================

    const resetNoteForm = () => {

        setNoteTitle("");

        setNoteContent("");

        setNoteTags("");

        setNotePinned(false);

        setNoteError("");

    };


    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditNote = (note) => {

        if (!note) {
            return;
        }

        setEditingNote(note);

        setEditTitle(
            note.title || ""
        );

        setEditContent(
            note.content || ""
        );

        setEditTags(
            Array.isArray(note.tags)
                ? note.tags.join(", ")
                : ""
        );

        setNoteError("");

        setNoteSuccess("");

    };


    // =========================================================
    // CLOSE EDIT MODAL
    // =========================================================

    const closeEditNote = () => {

        if (updatingNote) {
            return;
        }

        setEditingNote(null);

        setEditTitle("");

        setEditContent("");

        setEditTags("");

        setNoteError("");

    };


    // =========================================================
    // FETCH ALL NOTES
    // =========================================================

    const fetchAllNotes = async () => {

        const response =
            await getAllNotes();

        const fetchedNotes =
            response?.notes || [];

        setAllNotes(
            fetchedNotes
        );

        return fetchedNotes;

    };


    // =========================================================
    // LOAD NOTES
    // =========================================================

    const fetchNotes = async () => {

        try {

            setNotesLoading(true);

            setNotesError("");

            const fetchedNotes =
                await fetchAllNotes();

            setNotes(
                fetchedNotes
            );

        } catch (error) {

            console.error(
                "Get Notes Error:",
                error
            );

            setNotesError(
                error.response?.data?.message ||
                "Unable to load notes."
            );

        } finally {

            setNotesLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchNotes();

    }, []);


    // =========================================================
    // OPEN EDIT FROM QUERY PARAMETER
    // =========================================================

    useEffect(() => {

        const editNoteId =
            searchParams.get("edit");

        if (!editNoteId) {
            return;
        }

        const noteToEdit =
            allNotes.find(
                (note) =>
                    note._id === editNoteId
            );

        if (!noteToEdit) {
            return;
        }

        openEditNote(
            noteToEdit
        );

        setSearchParams(
            {},
            {
                replace: true,
            }
        );

    }, [
        searchParams,
        allNotes,
        setSearchParams,
    ]);


    // =========================================================
    // SEARCH NOTES
    // =========================================================

    const performSearch = async (
        keyword
    ) => {

        try {

            setSearchLoading(true);

            setNotesError("");

            const response =
                await searchNotes(
                    keyword
                );

            setNotes(
                response?.notes || []
            );

        } catch (error) {

            console.error(
                "Search Notes Error:",
                error
            );

            setNotes([]);

            setNotesError(
                error.response?.data?.message ||
                "Unable to search notes."
            );

        } finally {

            setSearchLoading(false);

        }

    };


    // =========================================================
    // LIVE SEARCH
    // =========================================================

    useEffect(() => {

        const trimmedQuery =
            searchQuery.trim();

        if (!trimmedQuery) {

            setSearchLoading(false);

            setNotes(
                allNotes
            );

            return;

        }

        const timer =
            setTimeout(() => {

                performSearch(
                    trimmedQuery
                );

            }, 400);

        return () => {

            clearTimeout(
                timer
            );

        };

    }, [
        searchQuery,
        allNotes,
    ]);


    // =========================================================
    // REFRESH NOTES
    // =========================================================

    const refreshCurrentNotes = async () => {

        try {

            setNotesError("");

            const response =
                await getAllNotes();

            const fetchedNotes =
                response?.notes || [];

            setAllNotes(
                fetchedNotes
            );

            const trimmedQuery =
                searchQuery.trim();

            if (!trimmedQuery) {

                setNotes(
                    fetchedNotes
                );

                return;

            }

            const searchResponse =
                await searchNotes(
                    trimmedQuery
                );

            setNotes(
                searchResponse?.notes || []
            );

        } catch (error) {

            console.error(
                "Refresh Notes Error:",
                error
            );

            setNotesError(
                error.response?.data?.message ||
                "Unable to refresh notes."
            );

        }

    };


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const clearSearch = () => {

        setSearchQuery("");

        setNotesError("");

    };


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setSearchQuery("");

        setSelectedTopic("all");

        setShowPinnedOnly(false);

        setSortBy("newest");

        setNotesError("");

    };


    // =========================================================
    // FILTER NOTES
    // =========================================================

    const filteredNotes = useMemo(() => {

        return notes.filter(
            (note) => {

                const matchesTopic =
                    selectedTopic === "all"
                        ? true
                        : (note.tags || []).some(
                            (tag) =>
                                tag
                                    .trim()
                                    .toLowerCase() ===
                                selectedTopic
                        );

                const matchesPinned =
                    showPinnedOnly
                        ? note.pinned === true
                        : true;

                return (
                    matchesTopic &&
                    matchesPinned
                );

            }
        );

    }, [
        notes,
        selectedTopic,
        showPinnedOnly,
    ]);


    // =========================================================
    // SORT NOTES
    // =========================================================

    const sortedNotes = useMemo(() => {

        return [...filteredNotes].sort(
            (a, b) => {

                switch (sortBy) {

                    case "newest":

                        return (
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                        );


                    case "oldest":

                        return (
                            new Date(
                                a.createdAt
                            ) -
                            new Date(
                                b.createdAt
                            )
                        );


                    case "az":

                        return (
                            (a.title || "")
                                .localeCompare(
                                    b.title || ""
                                )
                        );


                    case "za":

                        return (
                            (b.title || "")
                                .localeCompare(
                                    a.title || ""
                                )
                        );


                    case "pinned":

                        if (
                            a.pinned ===
                            b.pinned
                        ) {

                            return (
                                new Date(
                                    b.createdAt
                                ) -
                                new Date(
                                    a.createdAt
                                )
                            );

                        }

                        return a.pinned
                            ? -1
                            : 1;


                    default:

                        return 0;

                }

            }
        );

    }, [
        filteredNotes,
        sortBy,
    ]);


    // =========================================================
    // SORT LABEL
    // =========================================================

    const getSortLabel = () => {

        switch (sortBy) {

            case "newest":
                return "Newest First";

            case "oldest":
                return "Oldest First";

            case "az":
                return "Title A → Z";

            case "za":
                return "Title Z → A";

            case "pinned":
                return "Pinned First";

            default:
                return "Newest First";

        }

    };


    // =========================================================
    // CREATE NOTE
    // =========================================================

    const handleCreateNote = async () => {

        const title =
            noteTitle.trim();

        const content =
            noteContent.trim();

        if (!title) {

            setNoteError(
                "Please enter a note title."
            );

            return;

        }

        if (!content) {

            setNoteError(
                "Please enter note content."
            );

            return;

        }

        try {

            setSavingNote(true);

            setNoteError("");

            setNoteSuccess("");

            const tags =
                noteTags
                    .split(",")
                    .map(
                        (tag) =>
                            tag.trim()
                    )
                    .filter(Boolean);

            await createNote({

                title,

                content,

                tags,

                pinned:
                    notePinned,

            });

            await refreshCurrentNotes();

            resetNoteForm();

            setShowCreateModal(
                false
            );

            setNoteSuccess(
                "Note created successfully."
            );

        } catch (error) {

            console.error(
                "Create Note Error:",
                error
            );

            setNoteError(
                error.response?.data?.message ||
                "Unable to create note."
            );

        } finally {

            setSavingNote(false);

        }

    };


    // =========================================================
    // UPDATE NOTE
    // =========================================================

    const handleUpdateNote = async () => {

        if (!editingNote) {
            return;
        }

        const title =
            editTitle.trim();

        const content =
            editContent.trim();

        if (!title) {

            setNoteError(
                "Please enter a note title."
            );

            return;

        }

        if (!content) {

            setNoteError(
                "Please enter note content."
            );

            return;

        }

        try {

            setUpdatingNote(true);

            setNoteError("");

            setNoteSuccess("");

            const tags =
                editTags
                    .split(",")
                    .map(
                        (tag) =>
                            tag.trim()
                    )
                    .filter(Boolean);

            const response =
                await updateNote(
                    editingNote._id,
                    {
                        title,
                        content,
                        tags,
                    }
                );

            const updatedNote =
                response?.note;

            if (!updatedNote) {

                throw new Error(
                    "Updated note was not returned."
                );

            }

            setAllNotes(
                (currentNotes) =>
                    currentNotes.map(
                        (note) =>
                            note._id ===
                            editingNote._id
                                ? updatedNote
                                : note
                    )
            );

            setNotes(
                (currentNotes) =>
                    currentNotes.map(
                        (note) =>
                            note._id ===
                            editingNote._id
                                ? updatedNote
                                : note
                    )
            );

            setEditingNote(null);

            setEditTitle("");

            setEditContent("");

            setEditTags("");

            setNoteSuccess(
                response.message ||
                "Note updated successfully."
            );

        } catch (error) {

            console.error(
                "Update Note Error:",
                error
            );

            setNoteError(
                error.response?.data?.message ||
                "Unable to update note."
            );

        } finally {

            setUpdatingNote(false);

        }

    };


    // =========================================================
    // TOGGLE PIN
    // =========================================================

    const handleTogglePin = async (
        event,
        note
    ) => {

        event.stopPropagation();

        if (pinningNote) {
            return;
        }

        try {

            setPinningNote(
                note._id
            );

            setNoteError("");

            setNoteSuccess("");

            const response =
                await togglePinNote(
                    note._id
                );

            const updatedNote =
                response?.note;

            if (!updatedNote) {

                throw new Error(
                    "Updated note was not returned."
                );

            }

            setNotes(
                (currentNotes) =>
                    currentNotes.map(
                        (currentNote) =>
                            currentNote._id ===
                            note._id
                                ? updatedNote
                                : currentNote
                    )
            );

            setAllNotes(
                (currentNotes) =>
                    currentNotes.map(
                        (currentNote) =>
                            currentNote._id ===
                            note._id
                                ? updatedNote
                                : currentNote
                    )
            );

            setNoteSuccess(
                response.message ||
                (
                    updatedNote.pinned
                        ? "Note pinned successfully."
                        : "Note unpinned successfully."
                )
            );

        } catch (error) {

            console.error(
                "Toggle Pin Error:",
                error
            );

            setNoteError(
                error.response?.data?.message ||
                "Unable to update note pin status."
            );

        } finally {

            setPinningNote(null);

        }

    };


    // =========================================================
    // CONFIRM DELETE
    // =========================================================

    const confirmDeleteNote = (
        event,
        note
    ) => {

        event.stopPropagation();

        setNoteToDelete(
            note
        );

        setNoteError("");

        setNoteSuccess("");

    };


    // =========================================================
    // CLOSE DELETE MODAL
    // =========================================================

    const closeDeleteModal = () => {

        if (deletingNote) {
            return;
        }

        setNoteToDelete(null);

    };


    // =========================================================
    // DELETE NOTE
    // =========================================================

    const handleDeleteNote = async () => {

        if (!noteToDelete) {
            return;
        }

        try {

            setDeletingNote(
                noteToDelete._id
            );

            setNoteError("");

            setNoteSuccess("");

            await deleteNote(
                noteToDelete._id
            );

            const deletedId =
                noteToDelete._id;

            setNotes(
                (currentNotes) =>
                    currentNotes.filter(
                        (note) =>
                            note._id !==
                            deletedId
                    )
            );

            setAllNotes(
                (currentNotes) =>
                    currentNotes.filter(
                        (note) =>
                            note._id !==
                            deletedId
                    )
            );

            setNoteSuccess(
                "Note deleted successfully."
            );

            setNoteToDelete(null);

        } catch (error) {

            console.error(
                "Delete Note Error:",
                error
            );

            setNoteError(
                error.response?.data?.message ||
                "Unable to delete note."
            );

        } finally {

            setDeletingNote(null);

        }

    };


    // =========================================================
    // OPEN NOTE DETAILS
    // =========================================================

    const openNoteDetails = (
        noteId
    ) => {

        if (!noteId) {
            return;
        }

        navigate(
            `/notes/${noteId}`
        );

    };


    // =========================================================
    // CARD KEYBOARD NAVIGATION
    // =========================================================

    const handleCardKeyDown = (
        event,
        noteId
    ) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openNoteDetails(
                noteId
            );

        }

    };


    // =========================================================
    // CLOSE MODALS WITH ESCAPE
    // =========================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            if (savingNote) {
                return;
            }

            if (updatingNote) {
                return;
            }

            if (deletingNote) {
                return;
            }

            if (noteToDelete) {

                closeDeleteModal();

                return;

            }

            if (editingNote) {

                closeEditNote();

                return;

            }

            if (showCreateModal) {

                closeCreateModal();

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [
        showCreateModal,
        editingNote,
        noteToDelete,
        savingNote,
        updatingNote,
        deletingNote,
    ]);


    // =========================================================
    // BODY SCROLL LOCK
    // =========================================================

    useEffect(() => {

        const modalOpen =
            showCreateModal ||
            Boolean(editingNote) ||
            Boolean(noteToDelete);

        if (!modalOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow =
            "hidden";

        return () => {

            document.body.style.overflow =
                "";

        };

    }, [
        showCreateModal,
        editingNote,
        noteToDelete,
    ]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className={`min-h-screen transition-colors duration-300 ${
                theme === "dark"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >

            <Sidebar />

            <div className="lg:ml-64 min-h-screen">

                <Navbar />

                <main
                    className="px-4 py-5 sm:px-6 lg:p-6"
                >

                    {/* =====================================================
                        HEADER
                    ===================================================== */}

                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8"
                    >

                        <div>

                            <div
                                className="flex items-center gap-3 mb-2"
                            >

                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                        theme === "dark"
                                            ? "bg-blue-950"
                                            : "bg-blue-50"
                                    }`}
                                >

                                    <StickyNote
                                        size={24}
                                        className="text-blue-600"
                                    />

                                </div>

                                <h1
                                    className="text-2xl sm:text-3xl font-bold"
                                >
                                    Notes & Revision
                                </h1>

                            </div>

                            <p
                                className={`text-sm sm:text-base ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            >
                                Save DSA concepts, patterns, interview
                                notes, and important revision points.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={
                                openCreateModal
                            }
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                        >

                            <Plus size={19} />

                            Create Note

                        </button>

                    </div>


                    {/* =====================================================
                        SUCCESS MESSAGE
                    ===================================================== */}

                    {noteSuccess && (

                        <div
                            className={`mb-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                theme === "dark"
                                    ? "bg-green-950/30 border-green-800 text-green-400"
                                    : "bg-green-50 border-green-200 text-green-700"
                            }`}
                        >

                            <div
                                className="flex items-center gap-3"
                            >

                                <span
                                    className="w-7 h-7 rounded-full flex items-center justify-center bg-green-100 text-green-700"
                                >
                                    ✓
                                </span>

                                <span>
                                    {noteSuccess}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setNoteSuccess("")
                                }
                                className="text-lg opacity-60 hover:opacity-100"
                                aria-label="Dismiss success message"
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =====================================================
                        SEARCH & FILTER
                    ===================================================== */}

                    <div
                        className={`rounded-2xl border p-4 sm:p-5 shadow-md mb-8 ${
                            theme === "dark"
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }`}
                    >

                        <div
                            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3"
                        >

                            {/* SEARCH */}

                            <div className="relative">

                                <Search
                                    size={19}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search notes..."
                                    className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition ${
                                        theme === "dark"
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                    }`}
                                />

                                {searchQuery && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearSearch
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        aria-label="Clear search"
                                    >

                                        <X size={18} />

                                    </button>

                                )}

                            </div>


                            {/* TOPIC */}

                            <div className="relative">

                                <Tag
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />

                                <select
                                    value={selectedTopic}
                                    onChange={(event) =>
                                        setSelectedTopic(
                                            event.target.value
                                        )
                                    }
                                    className={`appearance-none w-full pl-10 pr-10 py-3 rounded-xl border font-semibold outline-none cursor-pointer ${
                                        theme === "dark"
                                            ? "border-slate-700 bg-slate-800 text-slate-300 focus:border-blue-500"
                                            : "border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-500"
                                    }`}
                                >

                                    <option value="all">
                                        All Topics
                                    </option>

                                    {availableTopics.map(
                                        (topic) => (

                                            <option
                                                key={topic}
                                                value={topic}
                                            >
                                                {topic}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PINNED */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPinnedOnly(
                                        (current) =>
                                            !current
                                    )
                                }
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold transition-all duration-200 ${
                                    showPinnedOnly
                                        ? "bg-yellow-500 border-yellow-500 text-white shadow-md"
                                        : theme === "dark"
                                            ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                            >

                                <Pin
                                    size={18}
                                    className={
                                        showPinnedOnly
                                            ? "fill-current"
                                            : ""
                                    }
                                />

                                {showPinnedOnly
                                    ? "Pinned Only"
                                    : "Pinned"}

                            </button>


                            {/* SORT */}

                            <div className="relative">

                                <ArrowUpDown
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(
                                            event.target.value
                                        )
                                    }
                                    className={`appearance-none w-full pl-10 pr-10 py-3 rounded-xl border font-semibold outline-none cursor-pointer ${
                                        theme === "dark"
                                            ? "border-slate-700 bg-slate-800 text-slate-300 focus:border-blue-500"
                                            : "border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-500"
                                    }`}
                                >

                                    <option value="newest">
                                        Newest First
                                    </option>

                                    <option value="oldest">
                                        Oldest First
                                    </option>

                                    <option value="az">
                                        Title A → Z
                                    </option>

                                    <option value="za">
                                        Title Z → A
                                    </option>

                                    <option value="pinned">
                                        Pinned First
                                    </option>

                                </select>

                            </div>

                        </div>


                        {searchLoading && (

                            <div
                                className="mt-3 flex items-center gap-2 text-sm text-slate-500"
                            >

                                <Loader2
                                    size={15}
                                    className="animate-spin"
                                />

                                Searching notes...

                            </div>

                        )}


                        {/* ACTIVE FILTERS */}

                        {(searchQuery.trim() ||
                            selectedTopic !== "all" ||
                            showPinnedOnly ||
                            sortBy !== "newest") && (

                            <div
                                className="flex flex-wrap items-center gap-2 mt-4"
                            >

                                <span
                                    className="text-xs font-semibold text-slate-500"
                                >
                                    Active:
                                </span>

                                {searchQuery.trim() && (

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            theme === "dark"
                                                ? "bg-blue-950 text-blue-300"
                                                : "bg-blue-50 text-blue-700"
                                        }`}
                                    >
                                        Search: {searchQuery}
                                    </span>

                                )}

                                {selectedTopic !== "all" && (

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            theme === "dark"
                                                ? "bg-purple-950 text-purple-300"
                                                : "bg-purple-50 text-purple-700"
                                        }`}
                                    >
                                        Topic: {selectedTopic}
                                    </span>

                                )}

                                {showPinnedOnly && (

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            theme === "dark"
                                                ? "bg-yellow-950 text-yellow-300"
                                                : "bg-yellow-50 text-yellow-700"
                                        }`}
                                    >
                                        📌 Pinned
                                    </span>

                                )}

                                {sortBy !== "newest" && (

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            theme === "dark"
                                                ? "bg-slate-800 text-slate-300"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        ↕ {getSortLabel()}
                                    </span>

                                )}

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Clear filters
                                </button>

                            </div>

                        )}

                        <div
                            className="mt-3 text-xs text-slate-500"
                        >
                            Sorted by:{" "}
                            <span className="font-semibold">
                                {getSortLabel()}
                            </span>
                        </div>

                    </div>


                    {/* =====================================================
                        NOTES HEADER
                    ===================================================== */}

                    <div
                        className="flex items-center justify-between mb-5"
                    >

                        <div
                            className="flex items-center gap-3"
                        >

                            <BookOpen
                                size={21}
                                className="text-blue-600"
                            />

                            <h2
                                className="text-lg sm:text-xl font-bold"
                            >
                                My Notes
                            </h2>

                        </div>

                        <span
                            className="text-sm text-slate-500"
                        >

                            {searchQuery.trim() ||
                            selectedTopic !== "all" ||
                            showPinnedOnly

                                ? `${sortedNotes.length} ${
                                    sortedNotes.length === 1
                                        ? "Result"
                                        : "Results"
                                }`

                                : `${sortedNotes.length} ${
                                    sortedNotes.length === 1
                                        ? "Note"
                                        : "Notes"
                                }`
                            }

                        </span>

                    </div>


                    {/* =====================================================
                        ERROR
                    ===================================================== */}

                    {notesError && (

                        <div
                            className={`mb-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                theme === "dark"
                                    ? "bg-red-950/30 border-red-800 text-red-400"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >

                            <div
                                className="flex items-start gap-2"
                            >

                                <span>
                                    ⚠
                                </span>

                                <span>
                                    {notesError}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setNotesError("")
                                }
                                className="text-lg opacity-60 hover:opacity-100"
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =====================================================
                        LOADING
                    ===================================================== */}

                    {notesLoading ||
                    searchLoading ? (

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >

                            {[1, 2, 3].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className={`rounded-2xl border p-5 animate-pulse ${
                                            theme === "dark"
                                                ? "bg-slate-900 border-slate-700"
                                                : "bg-white border-slate-200"
                                        }`}
                                    >

                                        <div
                                            className="flex items-center justify-between mb-5"
                                        >

                                            <div
                                                className="flex-1 space-y-2"
                                            >

                                                <div
                                                    className={`h-5 rounded w-36 ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div
                                                    className={`h-3 rounded w-24 ${
                                                        theme === "dark"
                                                            ? "bg-slate-700"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                            </div>

                                            <div
                                                className={`w-9 h-9 rounded-lg ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                        </div>

                                        <div
                                            className="space-y-2 mb-5"
                                        >

                                            <div
                                                className={`h-3 rounded w-full ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                            <div
                                                className={`h-3 rounded w-5/6 ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                            <div
                                                className={`h-3 rounded w-2/3 ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                        </div>

                                        <div
                                            className="flex gap-2"
                                        >

                                            <div
                                                className={`h-6 w-20 rounded-full ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                            <div
                                                className={`h-6 w-16 rounded-full ${
                                                    theme === "dark"
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}
                                            />

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : filteredNotes.length === 0 ? (

                        /* =================================================
                           EMPTY STATE
                        ================================================= */

                        <div
                            className={`rounded-2xl border shadow-md ${
                                theme === "dark"
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}
                        >

                            <div
                                className="flex flex-col items-center justify-center text-center py-16 px-6"
                            >

                                <div
                                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${
                                        theme === "dark"
                                            ? "bg-slate-800"
                                            : "bg-slate-100"
                                    }`}
                                >

                                    {searchQuery.trim() ||
                                    selectedTopic !== "all" ||
                                    showPinnedOnly ? (

                                        <Search
                                            size={36}
                                            className="text-slate-400"
                                        />

                                    ) : (

                                        <FileText
                                            size={36}
                                            className="text-blue-600"
                                        />

                                    )}

                                </div>

                                <h3
                                    className="text-xl font-bold mb-2"
                                >

                                    {searchQuery.trim() ||
                                    selectedTopic !== "all" ||
                                    showPinnedOnly

                                        ? "No Matching Notes"
                                        : "No Notes Yet"}

                                </h3>

                                <p
                                    className={`max-w-md leading-6 mb-6 ${
                                        theme === "dark"
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                >

                                    {searchQuery.trim() ||
                                    selectedTopic !== "all" ||
                                    showPinnedOnly

                                        ? "No notes match the current search, topic, or pinned filter."

                                        : "Start building your personal DSA knowledge base. Save important concepts, algorithms, patterns, and interview tips for revision."}

                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        searchQuery.trim() ||
                                        selectedTopic !== "all" ||
                                        showPinnedOnly
                                            ? clearFilters
                                            : openCreateModal
                                    }
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                >

                                    {searchQuery.trim() ||
                                    selectedTopic !== "all" ||
                                    showPinnedOnly ? (

                                        "Clear Filters"

                                    ) : (

                                        <>
                                            <Plus size={18} />
                                            Create Your First Note
                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    ) : (

                        /* =================================================
                           NOTES GRID
                        ================================================= */

                        <div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                        >

                            {sortedNotes.map(
                                (note) => (

                                    <div
                                        key={note._id}
                                        onClick={() =>
                                            openNoteDetails(
                                                note._id
                                            )
                                        }
                                        onKeyDown={(event) =>
                                            handleCardKeyDown(
                                                event,
                                                note._id
                                            )
                                        }
                                        role="button"
                                        tabIndex={0}
                                        className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            theme === "dark"
                                                ? "bg-slate-900 border-slate-700 hover:border-blue-600"
                                                : "bg-white border-slate-200 hover:border-blue-400"
                                        }`}
                                    >

                                        {/* CARD HEADER */}

                                        <div
                                            className="flex items-start justify-between gap-3 mb-4"
                                        >

                                            <div
                                                className="min-w-0"
                                            >

                                                <div
                                                    className="flex items-center gap-2"
                                                >

                                                    {note.pinned && (

                                                        <Pin
                                                            size={16}
                                                            className="text-yellow-500 fill-yellow-400 flex-shrink-0"
                                                        />

                                                    )}

                                                    <h3
                                                        className="font-bold text-lg truncate transition-colors group-hover:text-blue-500"
                                                    >
                                                        {note.title}
                                                    </h3>

                                                </div>

                                                <p
                                                    className="text-xs text-slate-500 mt-1"
                                                >

                                                    {note.createdAt
                                                        ? new Date(
                                                            note.createdAt
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                        : "Unknown date"}

                                                </p>

                                            </div>

                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                                                    theme === "dark"
                                                        ? "bg-slate-800 group-hover:bg-blue-950"
                                                        : "bg-slate-100 group-hover:bg-blue-50"
                                                }`}
                                            >

                                                <FileText
                                                    size={18}
                                                    className="text-blue-500 transition-transform duration-200 group-hover:scale-110"
                                                />

                                            </div>

                                        </div>


                                        {/* CONTENT */}

                                        <p
                                            className={`text-sm leading-6 line-clamp-4 ${
                                                theme === "dark"
                                                    ? "text-slate-300"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {note.content}
                                        </p>


                                        {/* TAGS */}

                                        {note.tags?.length > 0 && (

                                            <div
                                                className="flex flex-wrap gap-2 mt-5"
                                            >

                                                {note.tags.map(
                                                    (
                                                        tag,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={`${tag}-${index}`}
                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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

                                        )}


                                        {/* ACTIONS */}

                                        <div
                                            className="grid grid-cols-3 gap-2 mt-5"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    openEditNote(
                                                        note
                                                    );

                                                }}
                                                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-semibold transition ${
                                                    theme === "dark"
                                                        ? "bg-slate-800 text-blue-400 hover:bg-slate-700"
                                                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                }`}
                                            >

                                                <Pencil
                                                    size={15}
                                                />

                                                <span>
                                                    Edit
                                                </span>

                                            </button>


                                            {/* PIN */}

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleTogglePin(
                                                        event,
                                                        note
                                                    )
                                                }
                                                disabled={
                                                    pinningNote ===
                                                    note._id
                                                }
                                                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-semibold transition ${
                                                    note.pinned
                                                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                                        : theme === "dark"
                                                            ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                                                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                                }`}
                                            >

                                                {pinningNote === note._id ? (

                                                    <Loader2
                                                        size={15}
                                                        className="animate-spin"
                                                    />

                                                ) : (

                                                    <Pin
                                                        size={15}
                                                        className={
                                                            note.pinned
                                                                ? "fill-current"
                                                                : ""
                                                        }
                                                    />

                                                )}

                                                <span>
                                                    {note.pinned
                                                        ? "Pinned"
                                                        : "Pin"}
                                                </span>

                                            </button>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    confirmDeleteNote(
                                                        event,
                                                        note
                                                    )
                                                }
                                                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                                            >

                                                <Trash2
                                                    size={15}
                                                />

                                                <span>
                                                    Delete
                                                </span>

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =====================================================
                        CREATE NOTE MODAL
                    ===================================================== */}

                    {showCreateModal && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        >

                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={
                                    closeCreateModal
                                }
                            />

                            <div
                                className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 shadow-2xl ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <div
                                    className="flex items-start justify-between gap-4 mb-6"
                                >

                                    <div
                                        className="flex items-center gap-3"
                                    >

                                        <div
                                            className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                                                theme === "dark"
                                                    ? "bg-blue-950"
                                                    : "bg-blue-50"
                                            }`}
                                        >

                                            <StickyNote
                                                size={21}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <div>

                                            <h2
                                                className="text-xl font-bold"
                                            >
                                                Create New Note
                                            </h2>

                                            <p
                                                className={`text-sm mt-1 ${
                                                    theme === "dark"
                                                        ? "text-slate-400"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                Save something useful for your
                                                next revision.
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeCreateModal
                                        }
                                        disabled={
                                            savingNote
                                        }
                                        className={`p-2 rounded-lg flex-shrink-0 transition ${
                                            theme === "dark"
                                                ? "hover:bg-slate-800"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >

                                        <X size={20} />

                                    </button>

                                </div>


                                {noteError && (

                                    <div
                                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                                            theme === "dark"
                                                ? "bg-red-950/30 border-red-800 text-red-400"
                                                : "bg-red-50 border-red-200 text-red-700"
                                        }`}
                                    >
                                        ⚠ {noteError}
                                    </div>

                                )}


                                {/* TITLE */}

                                <div className="mb-5">

                                    <label
                                        className="block text-sm font-semibold mb-2"
                                    >
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={noteTitle}
                                        onChange={(event) =>
                                            setNoteTitle(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. Binary Search Patterns"
                                        className={`w-full px-4 py-3 rounded-xl border outline-none ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                        }`}
                                    />

                                </div>


                                {/* TAGS */}

                                <div className="mb-5">

                                    <label
                                        className="flex items-center gap-2 text-sm font-semibold mb-2"
                                    >

                                        <Tag size={16} />

                                        Tags

                                    </label>

                                    <input
                                        type="text"
                                        value={noteTags}
                                        onChange={(event) =>
                                            setNoteTags(
                                                event.target.value
                                            )
                                        }
                                        placeholder="binary-search, arrays, dsa"
                                        className={`w-full px-4 py-3 rounded-xl border outline-none ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                        }`}
                                    />

                                    <p
                                        className="text-xs text-slate-500 mt-2"
                                    >
                                        Separate multiple tags with commas.
                                    </p>

                                </div>


                                {/* CONTENT */}

                                <div className="mb-5">

                                    <label
                                        className="block text-sm font-semibold mb-2"
                                    >
                                        Content
                                    </label>

                                    <textarea
                                        value={noteContent}
                                        onChange={(event) =>
                                            setNoteContent(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Write your DSA concept, algorithm, pattern, interview tip, or revision notes..."
                                        rows={10}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none resize-y ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                                        }`}
                                    />

                                </div>


                                {/* PIN */}

                                <label
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer mb-6 ${
                                        theme === "dark"
                                            ? "bg-slate-800 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            notePinned
                                        }
                                        onChange={(event) =>
                                            setNotePinned(
                                                event.target.checked
                                            )
                                        }
                                        className="w-4 h-4"
                                    />

                                    <div>

                                        <p
                                            className="font-semibold"
                                        >
                                            Pin this note
                                        </p>

                                        <p
                                            className="text-xs text-slate-500"
                                        >
                                            Keep this note easy to find.
                                        </p>

                                    </div>

                                </label>


                                {/* BUTTONS */}

                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            closeCreateModal
                                        }
                                        disabled={
                                            savingNote
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border-2 font-semibold ${
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
                                            handleCreateNote
                                        }
                                        disabled={
                                            savingNote
                                        }
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white ${
                                            savingNote
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >

                                        {savingNote ? (

                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Saving...
                                            </>

                                        ) : (

                                            <>
                                                <Save
                                                    size={18}
                                                />
                                                Save Note
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        EDIT NOTE MODAL
                    ===================================================== */}

                    {editingNote && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        >

                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={
                                    closeEditNote
                                }
                            />

                            <div
                                className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 shadow-2xl ${
                                    theme === "dark"
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }`}
                            >

                                <div
                                    className="flex items-start justify-between gap-4 mb-6"
                                >

                                    <div
                                        className="flex items-center gap-3"
                                    >

                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                theme === "dark"
                                                    ? "bg-blue-950"
                                                    : "bg-blue-50"
                                            }`}
                                        >

                                            <Pencil
                                                size={20}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <div>

                                            <h2
                                                className="text-xl font-bold"
                                            >
                                                Edit Note
                                            </h2>

                                            <p
                                                className={`text-sm mt-1 ${
                                                    theme === "dark"
                                                        ? "text-slate-400"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                Update your revision note.
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeEditNote
                                        }
                                        disabled={
                                            updatingNote
                                        }
                                        className={`p-2 rounded-lg ${
                                            theme === "dark"
                                                ? "hover:bg-slate-800"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >

                                        <X size={20} />

                                    </button>

                                </div>


                                {noteError && (

                                    <div
                                        className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                                            theme === "dark"
                                                ? "bg-red-950/30 border-red-800 text-red-400"
                                                : "bg-red-50 border-red-200 text-red-700"
                                        }`}
                                    >
                                        ⚠ {noteError}
                                    </div>

                                )}


                                <div className="mb-5">

                                    <label
                                        className="block text-sm font-semibold mb-2"
                                    >
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(event) =>
                                            setEditTitle(
                                                event.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border outline-none ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                        }`}
                                    />

                                </div>


                                <div className="mb-5">

                                    <label
                                        className="block text-sm font-semibold mb-2"
                                    >
                                        Tags
                                    </label>

                                    <input
                                        type="text"
                                        value={editTags}
                                        onChange={(event) =>
                                            setEditTags(
                                                event.target.value
                                            )
                                        }
                                        placeholder="arrays, dsa, binary-search"
                                        className={`w-full px-4 py-3 rounded-xl border outline-none ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                        }`}
                                    />

                                </div>


                                <div className="mb-6">

                                    <label
                                        className="block text-sm font-semibold mb-2"
                                    >
                                        Content
                                    </label>

                                    <textarea
                                        value={editContent}
                                        onChange={(event) =>
                                            setEditContent(
                                                event.target.value
                                            )
                                        }
                                        rows={10}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none resize-y ${
                                            theme === "dark"
                                                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                        }`}
                                    />

                                </div>


                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            closeEditNote
                                        }
                                        disabled={
                                            updatingNote
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border-2 font-semibold ${
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
                                            handleUpdateNote
                                        }
                                        disabled={
                                            updatingNote
                                        }
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white ${
                                            updatingNote
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >

                                        {updatingNote ? (

                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Updating...
                                            </>

                                        ) : (

                                            <>
                                                <Save
                                                    size={18}
                                                />
                                                Update Note
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        DELETE NOTE MODAL
                    ===================================================== */}

                    {noteToDelete && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >

                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={
                                    closeDeleteModal
                                }
                            />

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

                                    Are you sure you want to delete{" "}

                                    <span
                                        className={`font-semibold ${
                                            theme === "dark"
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {noteToDelete.title}
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
                                        disabled={
                                            Boolean(
                                                deletingNote
                                            )
                                        }
                                        className={`w-full px-4 py-3 rounded-xl border-2 font-semibold ${
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
                                            handleDeleteNote
                                        }
                                        disabled={
                                            Boolean(
                                                deletingNote
                                            )
                                        }
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white ${
                                            deletingNote
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >

                                        {deletingNote ? (

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


export default Notes;