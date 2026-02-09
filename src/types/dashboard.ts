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
  payment_health: PaymentHealth;
  booking_funnel: BookingFunnelItem[];
  top_tests: TopTest[];
  technician_performance: TechnicianPerformance[];
  branch_comparison?: BranchComparison[];
}

export interface PaymentHealth {
  Paid: number;
  Partial: number;
  Pending: number;
}

export interface BookingFunnelItem {
  status: string;
  count: number;
}

export interface TopTest {
  test_name: string;
  bookings_count: number;
  revenue: string | number;
}

export interface TechnicianPerformance {
  technician_id: number;
  technician_name: string;
  assigned_bookings: number;
  completed_bookings: number;
  revenue_generated: string | number;
  revenue_collected: string | number;
}

export interface BranchComparison {
  branch_id?: number | string;
  branch_name: string;
  total_bookings: number;
  total_revenue: string | number;
}
