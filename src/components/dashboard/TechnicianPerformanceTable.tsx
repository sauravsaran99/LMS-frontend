import React from "react";
import { TechnicianPerformance } from "../../types/dashboard";
import DashboardCard from "./DashboardCard";

interface TechnicianPerformanceTableProps {
    data: TechnicianPerformance[];
}

const TechnicianPerformanceTable: React.FC<TechnicianPerformanceTableProps> = ({ data }) => {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    return (
        <DashboardCard title="Technician Performance" className="h-full">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Assigned
                            </th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Completed
                            </th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                %
                            </th>
                            <th className="py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Collection
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.map((tech) => {
                            const completionRate = tech.assigned_bookings > 0
                                ? Math.round((tech.completed_bookings / tech.assigned_bookings) * 100)
                                : 0;

                            return (
                                <tr key={tech.technician_id}>
                                    <td className="py-3 text-sm text-gray-800 dark:text-white/90 font-medium">
                                        {tech.technician_name}
                                    </td>
                                    <td className="py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                                        {tech.assigned_bookings}
                                    </td>
                                    <td className="py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                                        {tech.completed_bookings}
                                    </td>
                                    <td className="py-3 text-sm text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${completionRate >= 80 ? 'bg-green-100 text-green-700' :
                                            completionRate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {completionRate}%
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-right text-gray-800 dark:text-white/90 font-semibold">
                                        {formatCurrency(tech.revenue_collected)}
                                    </td>
                                </tr>
                            );
                        })}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-3 text-sm text-center text-gray-400">
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

export default TechnicianPerformanceTable;
