import api from "./axios"; // your existing axios instance

/**
 * GET /dashboard
 * Role-based:
 *  - SUPER_ADMIN → pan india
 *  - BRANCH_ADMIN → own branch
 */
export const getDashboard = async () => {
  return api.get("/dashboard");
};
