import api from "./api";


// ======================================
// Search Users
// ======================================

export const searchUsers = async (query) => {

    const response = await api.get(
        `/friends/search?query=${encodeURIComponent(query)}`
    );

    return response.data;

};


// ======================================
// Get Friends
// ======================================

export const getFriends = async () => {

    const response = await api.get("/friends");

    return response.data;

};


// ======================================
// Add Friend
// ======================================

export const addFriend = async (leetcodeUsername) => {

    const response = await api.post("/friends/add", {
        leetcodeUsername
    });

    return response.data;

};


// ======================================
// Remove Friend
// ======================================

export const removeFriend = async (friendId) => {

    const response = await api.delete(
        `/friends/remove/${friendId}`
    );

    return response.data;

};


// ======================================
// Compare Friend
// ======================================

export const compareFriend = async (friendId) => {

    const response = await api.get(
        `/friends/compare/${friendId}`
    );

    return response.data;

};


// ======================================
// AI Compare Friend
// ======================================

export const aiCompareFriend = async (friendId) => {

    const response = await api.get(
        `/friends/compare-ai/${friendId}`
    );

    return response.data;

};

// ======================================
// Get Public User Profile
// ======================================

export const getPublicProfile = async (userId) => {

    const response = await api.get(
        `/friends/profile/${userId}`
    );

    return response.data;

};