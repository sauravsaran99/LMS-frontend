import React from "react";
import { BookingFunnelItem } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface BookingStatusFunnelProps {
    data: BookingFunnelItem[];
}

const BookingStatusFunnel: React.FC<BookingStatusFunnelProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((item) => item.count), 1);

    return (
        <DashboardCard title="Booking Status Funnel">
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.status} className="group">
                        <div className="mb-1 flex justify-between">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {item.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs font-semibold text-gray-800 dark:text-white/90">
                                {item.count}
                            </span>
                        </div>
                        <div className="relative h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                className="absolute left-0 top-0 h-full rounded-full bg-brand-500 transition-all duration-300"
                                style={{ width: `${(item.count / maxValue) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">
                Monitor bottlenecks from Creation to Completion.
            </p>
        </DashboardCard>
    );
};

export default BookingStatusFunnel;
