import React, { useEffect, useState, useRef, useCallback } from "react";
import { BranchComparison } from "../../types/dashboard";
import { getBranchComparison } from "../../api/dashboard.api";
import DashboardCard from "./DashboardCard";

const BranchComparisonTable: React.FC = () => {
    const [branches, setBranches] = useState<BranchComparison[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    const fetchBranches = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const limit = 10;
            const response = await getBranchComparison(page, limit);
            const { rows, count } = response.data;

            setBranches((prev) => {
                // Avoid duplicates if page 1 is re-fetched or strict mode issues
                if (page === 1) return rows;
                return [...prev, ...rows];
            });

            if (branches.length + rows.length >= count || rows.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch branch comparison", error);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, branches.length]);

    useEffect(() => {
        fetchBranches();
    }, [page]);

    const lastBranchElementRef = useCallback((node: HTMLTableRowElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <DashboardCard title="Branch Comparison" className="h-full">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="min-w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1a1f2e] z-10">
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Branch
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
                        {branches.map((branch, index) => {
                            if (branches.length === index + 1) {
                                return (
                                    <tr key={index} ref={lastBranchElementRef}>
                                        <td className="py-3 text-sm text-gray-800 dark:text-white/90 font-medium">
                                            {branch.branch_name}
                                        </td>
                                        <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                            {branch.total_bookings}
                                        </td>
                                        <td className="py-3 text-sm text-right text-gray-800 dark:text-white/90 font-semibold">
                                            {formatCurrency(branch.total_revenue)}
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={index}>
                                        <td className="py-3 text-sm text-gray-800 dark:text-white/90 font-medium">
                                            {branch.branch_name}
                                        </td>
                                        <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                                            {branch.total_bookings}
                                        </td>
                                        <td className="py-3 text-sm text-right text-gray-800 dark:text-white/90 font-semibold">
                                            {formatCurrency(branch.total_revenue)}
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                        {branches.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} className="py-3 text-sm text-center text-gray-400">
                                    No data available
                                </td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={3} className="py-3 text-sm text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default BranchComparisonTable;
