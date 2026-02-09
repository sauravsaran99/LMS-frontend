import api from "./axios"; // your existing axios instance

/**
 * GET /dashboard
 * Role-based:
 *  - SUPER_ADMIN → pan india
 *  - BRANCH_ADMIN → own branch
 */
export const getDashboard = async (branchId?: number | string, period?: string) => {
  let url = "/dashboard";
  const params = new URLSearchParams();

  if (branchId) params.append("branchId", String(branchId));
  if (period) params.append("period", period);

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  return api.get(url);
};

export const getBranchComparison = async (page: number, limit: number) => {
  return api.get(`/dashboard/branch-comparison?page=${page}&limit=${limit}`);
};
