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
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 ${metric.color} rounded-xl`}
            >
              <IconComponent className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex flex-col justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
                <h4
                  className={`mt-2 font-bold text-title-sm dark:text-white/90 ${metric.valueColor}`}
                >
                  {metric.value}
                </h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
