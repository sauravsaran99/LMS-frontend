import api from "./axios";
import { Doctor } from "../types/doctor";

export const getDoctors = (params?: { page?: number; limit?: number }) =>
    api.get<Doctor[]>("/doctors", { params});

export const createDoctor = (payload: {
    name: string;
    specialization?: string;
}) => api.post("/doctors", payload);
