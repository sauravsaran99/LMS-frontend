import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { DashboardSummary } from "../../types/dashboard";

interface EcommerceMetricsProps {
  summary: DashboardSummary;
}

export default function EcommerceMetrics({ summary }: EcommerceMetricsProps) {
  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const metrics = [
    {
      label: "Total Bookings",
      value: summary.total_bookings,
      icon: BoxIconLine,
      color: "bg-blue-100 dark:bg-blue-900",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Completed Bookings",
      value: summary.completed_bookings,
      icon: GroupIcon,
      color: "bg-green-100 dark:bg-green-900",
      valueColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Paid",
      value: formatCurrency(summary.total_paid),
      icon: BoxIconLine,
      color: "bg-emerald-100 dark:bg-emerald-900",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Discount Given",
      value: formatCurrency(summary.discount_given),
      icon: ArrowDownIcon,
      color: "bg-orange-100 dark:bg-orange-900",
      valueColor: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Net Revenue",
      value: formatCurrency(summary.net_revenue),
      icon: GroupIcon,
      color: "bg-purple-100 dark:bg-purple-900",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Pending Payments",
      value: summary.pending_payments,
      icon: ArrowUpIcon,
      color: "bg-red-100 dark:bg-red-900",
      valueColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="group relative rounded-3xl border border-transparent bg-white p-6 dark:bg-[#0b1220] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Subtle Gradient background opacity */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none ${metric.color.replace('bg-', 'bg-')}`} />

            <div className="flex items-start gap-5 relative z-10">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-inner border border-white/20 ${metric.color}`}>
                <IconComponent className={`size-7 ${metric.valueColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{metric.label}</p>
                <h4 className={`mt-1 font-black text-2xl dark:text-white/95 tracking-tight ${metric.valueColor}`}>
                  {metric.value}
                </h4>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl ${metric.color.replace('bg-', 'bg-')}`} />
          </div>
        );
      })}
    </div>
  );
}
