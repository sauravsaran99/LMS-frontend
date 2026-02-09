import { DashboardSummary } from "../../types/dashboard";

interface Props {
    summary: DashboardSummary;
}

export default function SummaryStatsCard({ summary }: Props) {
    const formatCurrency = (value: string | number): string => {
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Paid</span>
                <span className="font-bold text-gray-800 dark:text-white/95 text-lg">
                    {formatCurrency(summary.total_paid)}
                </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Discount Given</span>
                <span className="font-bold text-gray-800 dark:text-white/95 text-lg">
                    {formatCurrency(summary.discount_given)}
                </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Net Revenue</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                    {formatCurrency(summary.net_revenue)}
                </span>
            </div>
            <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Pending Payments</span>
                <span className="font-bold text-orange-500 dark:text-orange-400 text-lg">
                    {summary.pending_payments}
                </span>
            </div>
        </div>
    );
}
