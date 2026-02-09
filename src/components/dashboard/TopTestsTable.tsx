import React from "react";
import { TopTest } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface TopTestsTableProps {
    data: TopTest[];
}

const TopTestsTable: React.FC<TopTestsTableProps> = ({ data }) => {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    return (
        <DashboardCard title="Top 5 Tests (by Revenue)">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Test Name
                            </th>
                            <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Bookings
                            </th>
                            <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Revenue
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.map((test, index) => (
                            <tr key={index}>
                                <td className="py-3 text-sm text-gray-800 dark:text-white/90 font-medium">
                                    {test.test_name}
                                </td>
                                <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                    {test.bookings_count}
                                </td>
                                <td className="py-3 text-sm text-right text-gray-800 dark:text-white/90 font-semibold">
                                    {formatCurrency(test.revenue)}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-3 text-sm text-center text-gray-400">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default TopTestsTable;
