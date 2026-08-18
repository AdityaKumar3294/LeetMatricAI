import api from "./api";


// ==========================================
// Create Note
// ==========================================

export const createNote = async (noteData) => {

    const response =
        await api.post(
            "/notes/create",
            noteData
        );

    return response.data;

};


// ==========================================
// Get All Notes
// ==========================================

export const getAllNotes = async () => {

    const response =
        await api.get(
            "/notes/all"
        );

    return response.data;

};


// ==========================================
// Update Note
// ==========================================

export const updateNote = async (
    noteId,
    noteData
) => {

    const response =
        await api.put(
            `/notes/update/${noteId}`,
            noteData
        );

    return response.data;

};


// ==========================================
// Delete Note
// ==========================================

export const deleteNote = async (
    noteId
) => {

    const response =
        await api.delete(
            `/notes/delete/${noteId}`
        );

    return response.data;

};


// ==========================================
// Toggle Pin
// ==========================================

export const togglePinNote = async (
    noteId
) => {

    const response =
        await api.patch(
            `/notes/pin/${noteId}`
        );

    return response.data;

};


// ==========================================
// Search Notes
// ==========================================

export const searchNotes = async (
    keyword
) => {

    const response =
        await api.get(
            `/notes/search?keyword=${encodeURIComponent(
                keyword
            )}`
        );

    return response.data;

};