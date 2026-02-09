import React from "react";
import { PaymentHealth } from "../../types/dashboard";

interface PaymentHealthCardProps {
    data: PaymentHealth;
}

const PaymentHealthCard: React.FC<PaymentHealthCardProps> = ({ data }) => {
    const total = Number(data.Paid) + Number(data.Partial) + Number(data.Pending);

    const getPercentage = (value: number) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Payment Health
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Fully Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-white/90">{data.Paid}</span>
                        <span className="text-xs text-gray-400">({getPercentage(data.Paid)}%)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Partially Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-white/90">{data.Partial}</span>
                        <span className="text-xs text-gray-400">({getPercentage(data.Partial)}%)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-white/90">{data.Pending}</span>
                        <span className="text-xs text-gray-400">({getPercentage(data.Pending)}%)</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div style={{ width: `${getPercentage(data.Paid)}%` }} className="bg-green-500"></div>
                <div style={{ width: `${getPercentage(data.Partial)}%` }} className="bg-yellow-500"></div>
                <div style={{ width: `${getPercentage(data.Pending)}%` }} className="bg-red-500"></div>
            </div>
        </div>
    );
};

export default PaymentHealthCard;
