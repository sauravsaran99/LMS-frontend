import api from "./axios";

export const collectSample = (bookingId: number) =>
  api.post(`/technician/bookings/${bookingId}/collect-sample`);

export const markBookingCompleted = (bookingId: number) =>
  api.post(`/technician/bookings/${bookingId}/complete`);

export const getCompletedBookings = () =>
  api.get("/technician/bookings/completed");
