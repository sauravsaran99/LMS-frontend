import React from "react";
import PageBreadcrumb from "./PageBreadCrumb";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="mb-6">
            <PageBreadcrumb pageTitle={title} />
            {subtitle && (
                <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
            )}
        </div>
    );
};

export default PageHeader;
