import api from "./api";

// ======================================
// Get Leaderboard
// ======================================

export const getLeaderboard = async () => {

    const response = await api.get("/leaderboard");

    return response.data;

};