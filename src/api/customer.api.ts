import api from "./axios";
import { Customer } from "../types/customer";

export const searchCustomers = (q: string) => api.get<Customer[]>(`/customers/search?q=${q}`);

export const createCustomer = (payload: {
  name: string;
  phone: string;
  age?: number;
  gender?: string;
  address?: string;
  base_branch_id?: number;
}) => api.post("/customers", payload);

export const getCustomers = () => api.get("/customers");

export const updateCustomer = (id: number, data: any) => api.put(`/customers/${id}`, data);

export const toggleCustomerStatus = (id: number) => api.patch(`/customers/${id}/status`);

/**
 * Get logged-in customer profile
 */
export const getCustomerMe = () => {
  return api.get("/customers/me");
};

/**
 * Get all bookings of logged-in customer
 */
export const getCustomerBookings = () => {
  return api.get("/customers/bookings");
};

/**
 * Get tests for a specific booking (customer-owned)
 */
export const getCustomerBookingTests = (bookingId: number) => {
  return api.get(`/customers/bookings/${bookingId}/tests`);
};

/**
 * Get reports for a specific booking
 */
export const getCustomerBookingReports = (bookingId: number) => {
  return api.get(`/customers/bookings/${bookingId}/reports`);
};

/**
 * Get payments for a booking (by booking number)
 */
export const getCustomerBookingPayments = (bookingNumber: string) => {
  return api.get(`/customers/bookings/${bookingNumber}/payments`);
};
