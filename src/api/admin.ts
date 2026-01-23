import axios from "./axios";

// Blog Admin APIs
export const getAllBlogsAdmin = async () => {
    try {
        const response = await axios.get("/blogs"); // Reusing public endpoint for now, or fetch all if pagination needed
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return null;
    }
};

export const createBlog = async (data: any) => {
    try {
        const response = await axios.post("/blogs", data);
        return response.data;
    } catch (error) {
        console.error("Error creating blog:", error);
        return null;
    }
};

export const updateBlog = async (id: number, data: any) => {
    try {
        const response = await axios.put(`/blogs/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating blog:", error);
        return null;
    }
};

export const deleteBlog = async (id: number) => {
    try {
        const response = await axios.delete(`/blogs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting blog:", error);
        return null;
    }
};

// Contact Admin APIs
export const getContactQueries = async () => {
    try {
        const response = await axios.get("/contacts");
        return response.data;
    } catch (error) {
        console.error("Error fetching contact queries:", error);
        return null;
    }
};
