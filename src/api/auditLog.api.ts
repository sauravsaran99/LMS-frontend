import api from "./axios";

export const getAuditLogs = (params: {
  from_date?: string;
  to_date?: string;
  action?: string;
  entity?: string;
  user_id?: number;
}) => {
  return api.get("/audit-logs", { params });
};
