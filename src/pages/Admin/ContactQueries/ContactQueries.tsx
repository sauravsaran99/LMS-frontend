import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { getContactQueries } from "../../../api/admin";
import ContactQueryDetailsModal from "./ContactQueryDetailsModal";

export default function ContactQueries() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        setLoading(true);
        const response = await getContactQueries();
        if (response && response.success) {
            setQueries(response.data);
        }
        setLoading(false);
    };

    const handleViewDetails = (query: any) => {
        setSelectedQuery(query);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuery(null);
    };

    return (
        <div>
            <PageHeader title="Contact Queries" subtitle="View messages from the contact form" />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                                </tr>
                            ) : queries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No contact queries received yet.
                                    </td>
                                </tr>
                            ) : (
                                queries.map((query: any) => (
                                    <tr key={query.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {query.first_name} {query.last_name}
                                            </div>
                                            <div className="text-gray-500 text-xs">{query.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{query.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={query.message}>
                                            {query.message}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(query.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${query.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                query.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {query.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewDetails(query)}
                                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50 rounded-lg transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ContactQueryDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                query={selectedQuery}
            />
        </div>
    );
}
