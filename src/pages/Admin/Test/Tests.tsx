import { useEffect, useState } from "react";
import { getTests, deleteTest } from "../../../api/test.api";
import { Test } from "../../../types/test";
import toast from "react-hot-toast";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import TestFormModal from "./TestFormModal";

const Tests = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const loadTests = async () => {
        try {
            setLoading(true);
            const res = await getTests();
            setTests(res.data);
        } catch {
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTests();
    }, []);

    const handleOpenModal = (test?: Test) => {
        if (test) {
            setEditingTest(test);
        } else {
            setEditingTest(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTest(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this test?")) {
            return;
        }

        try {
            setDeleting(id);
            await deleteTest(id);
            toast.success("Test deleted successfully");
            loadTests();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete test");
        } finally {
            setDeleting(null);
        }
    };


    return (
        <>
            <PageMeta title="Tests" description="Manage test information" />
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Test Master
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and view all available tests
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Test
                        </span>
                    </button>
                </div>

                {/* Tests List */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Available Tests
                        </h2>

                        {loading && !tests.length ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
                            </div>
                        ) : tests.length === 0 ? (
                            <div className="rounded-lg border border-gray-200 border-dashed bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
                                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    No tests found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Add your first test to get started
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Test Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {tests.map((t) => (
                                            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                                {t.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {t.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                        ₹{t.price}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(t)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-400 transition-all hover:bg-purple-200 dark:hover:bg-purple-900/50 active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7.5-1L19.5 3.5M19.5 3.5A2.121 2.121 0 0123 7.5M19.5 3.5L15 8" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        {/* <button
                                                            onClick={() => handleDelete(t.id)}
                                                            disabled={deleting === t.id}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-red-100 dark:bg-red-900/30 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 transition-all hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {deleting === t.id ? (
                                                                <>
                                                                    <span className="w-3 h-3 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin"></span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete
                                                                </>
                                                            )}
                                                        </button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Test Form Modal */}
            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <TestFormModal
                    initialData={editingTest}
                    onClose={handleCloseModal}
                    onSuccess={loadTests}
                />
            </Modal>
        </>
    );
};

export default Tests;
