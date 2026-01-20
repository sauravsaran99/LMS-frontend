import api from "./axios";

export const getBranches = (params?: { page?: number; limit?: number }) =>
  api.get("/branches", { params });

export const createBranch = (data: { name: string; address: string }) =>
  api.post("/branches", data);

export const updateBranch = (id: number, data: { name: string; address: string }) =>
  api.put(`/branches/${id}`, data);

export const updateBranchStatus = (id: number, status: "ACTIVE" | "INACTIVE") =>
  api.patch(`/branches/${id}/status`, { status });
