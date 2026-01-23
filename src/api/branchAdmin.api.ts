import api from "./axios";

export const getBranchUsers = () => api.get("/branch-admin/users");

export const createBranchUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "RECEPTIONIST" | "TECHNICIAN";
  branchIds?: number[];
}) => api.post("/branch-admin/users", data);

export const updateBranchUser = (id: number, data: any) =>
  api.put(`/branch-admin/users/${id}`, data);

export const toggleUserStatus = (id: number) => api.patch(`/branch-admin/users/${id}/status`);

export const getBranchAdmins = () => api.get("/branch-admin");

export const createBranchAdmin = (data: any) => api.post("/branch-admin", data);
