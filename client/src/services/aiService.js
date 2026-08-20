import API from './api'; 

export const getAIAnalysis = async () => {
    try {
        console.log("🔵 FRONTEND STEP 3: Axios is sending the GET request to /ai/analysis...");
        const response = await API.get('/ai/analysis');
        return response.data; 
    } catch (error) {
        console.error("🔴 AXIOS ERROR:", error);
        throw error.response?.data || { success: false, message: "Failed to connect to the server." };
    }
};