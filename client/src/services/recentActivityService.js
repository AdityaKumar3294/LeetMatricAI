import api from "./api";

export const getRecentActivities = async () => {
    const response = await api.get("/recent-activity");
    return response.data;
};