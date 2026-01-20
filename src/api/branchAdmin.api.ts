import api from "./axios";

export const getBranchUsers = () => api.get("/branch-admin/users");

export const createBranchUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "RECEPTIONIST" | "TECHNICIAN";
}) => api.post("/branch-admin/users", data);

export const toggleUserStatus = (id: number) => api.patch(`/branch-admin/users/${id}/status`);

export const getBranchAdmins = () => api.get("/branch-admin");

export const createBranchAdmin = (data: any) => api.post("/branch-admin", data);
