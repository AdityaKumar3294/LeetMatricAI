import API from "./api";

export const syncLeetCode = async () => {

    const response = await API.post("/leetcode/sync");

    return response.data;

};