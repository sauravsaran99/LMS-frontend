import React, { ReactNode } from "react";

interface DashboardCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
}

export default function DashboardCard({
    children,
    className = "",
    title,
    subtitle,
    action,
}: DashboardCardProps) {
    return (
        <div
            className={`relative rounded-3xl shadow-xl border border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
        >
            {/* Stronger colorful gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-400 to-purple-500 opacity-90" />

            {/* Card background: subtle glassy gradient depending on theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 dark:from-[#061024]/60 dark:to-[#071224]/40 pointer-events-none" />

            {(title || action) && (
                <div className="relative px-6 pt-6 pb-2 flex items-center justify-between">
                    <div>
                        {title && (
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white/95 tracking-tight flex items-center gap-2">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div className="relative z-10">{action}</div>}
                </div>
            )}
            <div className="relative p-6">{children}</div>
        </div>
    );
}
