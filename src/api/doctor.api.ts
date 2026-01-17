import api from "./axios";
import { Doctor } from "../types/doctor";

export const getDoctors = () =>
    api.get<Doctor[]>("/doctors");

export const createDoctor = (payload: {
    name: string;
    specialization?: string;
}) => api.post("/doctors", payload);
