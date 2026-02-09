import api from "./axios";

export interface BranchTestPrice {
    id: number;
    branch_id: number;
    test_id: number;
    price: number;
    Branch?: {
        id: number;
        name: string;
    };
}

export const setBranchPrice = (data: { branch_id: number; test_id: number; price: number }) =>
    api.post<BranchTestPrice>("/branch-test-prices", data);

export const getBranchPricesByTest = (testId: number) =>
    api.get<BranchTestPrice[]>(`/branch-test-prices/test/${testId}`);

export const deleteBranchPrice = (id: number) =>
    api.delete(`/branch-test-prices/${id}`);
