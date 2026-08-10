import API from "./api";

export const loginUser = async (loginData) => {
    const response = await API.post("/auth/login", loginData);
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await API.post("/auth/register", registerData);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await API.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return response.data;
};