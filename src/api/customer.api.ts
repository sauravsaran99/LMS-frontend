import api from "./axios";
import { Customer } from "../types/customer";

export const searchCustomers = (q: string) =>
    api.get<Customer[]>(`/customers/search?q=${q}`);

export const createCustomer = (payload: {
    name: string;
    phone: string;
    age?: number;
    gender?: string;
    address?: string;
    base_branch_id?: number;
}) => api.post("/customers", payload);

export const getCustomers = () => api.get("/customers");

export const updateCustomer = (id: number, data: any) =>
  api.put(`/customers/${id}`, data);

export const toggleCustomerStatus = (id: number) =>
  api.patch(`/customers/${id}/status`);