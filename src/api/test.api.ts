import api from "./axios";
import { Test } from "../types/test";

export const getTests = () =>
    api.get<Test[]>("/tests");

export const createTest = (payload: {
    name: string;
    category: string;
    price: number;
}) => api.post("/tests", payload);

export const updateTest = (
  id: number,
  data: {
    name: string;
    price: number;
    status?: "ACTIVE" | "INACTIVE";
  }
) => api.put(`/tests/${id}`, data);

export const deleteTest = (id: number) =>
  api.delete(`/tests/${id}`);