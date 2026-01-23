import axios from "./axios";

export const getBlogs = async () => {
    try {
        const response = await axios.get("/blogs");
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return null;
    }
};

export const submitContactQuery = async (data: any) => {
    try {
        const response = await axios.post("/contacts", data);
        return response.data;
    } catch (error) {
        console.error("Error submitting contact query:", error);
        return null;
    }
};
