import api from "./api";

export const getXPHistory = async () => {

    const response = await api.get("/xp/history");

    return response.data;

};