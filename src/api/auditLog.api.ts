import api from "./axios";

export const getAuditLogs = (params: {
  page?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  action?: string;
  entity?: string;
  user_id?: number;
}) => {
  return api.get("/audit-logs", { params });
};
