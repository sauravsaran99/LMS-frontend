export interface DashboardSummary {
  total_bookings: number;
  completed_bookings: string | number;
  total_paid: string;
  discount_given: string;
  net_revenue: string;
  pending_payments: string | number;
}

export interface ChartData {
  dates: string[];
  bookings: number[];
  revenue: number[];
}

export interface RecentBooking {
  booking_number: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  final_amount: string;
  customer_name: string;
  tests: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  chart: ChartData;
  recent_bookings: RecentBooking[];
}
