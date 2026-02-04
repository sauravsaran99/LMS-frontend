import { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../components/ui/modal';
import { getBranches } from '../../../api/branch.api';
import { getBranchPricesByTest, setBranchPrice, deleteBranchPrice, BranchTestPrice } from '../../../api/branchTestPrice.api';
import { Test } from '../../../types/test';
import toast from 'react-hot-toast';

interface BranchPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    test: Test;
}

const BranchPriceModal = ({ isOpen, onClose, test }: BranchPriceModalProps) => {
    const [branches, setBranches] = useState<any[]>([]);
    const [branchPrices, setBranchPrices] = useState<BranchTestPrice[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [newPrice, setNewPrice] = useState<string>('');

    // Infinite scroll state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial Load - Prices only
    const loadPrices = async () => {
        try {
            setLoading(true);
            const pricesRes = await getBranchPricesByTest(test.id);
            setBranchPrices(pricesRes.data);
        } catch (error) {
            toast.error("Failed to load branch prices");
        } finally {
            setLoading(false);
        }
    };

    // Branch Fetching Logic
    const fetchBranches = async (currentPage: number) => {
        if (isFetchingBranches) return;
        setIsFetchingBranches(true);
        try {
            const { data } = await getBranches({ page: currentPage, limit: 10 });

            let newBranches: any[] = [];
            if (data.data) {
                newBranches = data.data;
            } else if (data.branches) {
                newBranches = data.branches;
            } else if (Array.isArray(data)) {
                newBranches = data;
            }

            setBranches((prev) => currentPage === 1 ? newBranches : [...prev, ...newBranches]);
            setHasMore(newBranches.length === 10);
        } catch (e) {
            console.error("Failed to fetch branches", e);
        } finally {
            setIsFetchingBranches(false);
        }
    };

    const loadMoreBranches = () => {
        if (hasMore && !isFetchingBranches) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchBranches(nextPage);
        }
    };

    const handleBranchScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceToBottom <= 10) {
            loadMoreBranches();
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadPrices();
            setPage(1);
            setBranches([]);
            setHasMore(true);
            fetchBranches(1);
            setSelectedBranchId('');
            setNewPrice('');
            setIsDropdownOpen(false);
        }
    }, [isOpen, test.id]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleAddOrUpdate = async () => {
        if (!selectedBranchId || !newPrice) {
            toast.error("Please select a branch and enter a price");
            return;
        }

        try {
            await setBranchPrice({
                branch_id: Number(selectedBranchId),
                test_id: test.id,
                price: Number(newPrice)
            });
            toast.success("Branch price updated");
            loadPrices();
            setSelectedBranchId('');
            setNewPrice('');
        } catch (error) {
            toast.error("Failed to update branch price");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBranchPrice(id);
            toast.success("Branch price removed");
            loadPrices();
        } catch (error) {
            toast.error("Failed to remove branch price");
        }
    };

    const selectedBranchName = branches.find(b => b.id.toString() === selectedBranchId)?.name || "Select Branch";

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Branch Prices for {test.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Default Price: ₹{test.price}</p>
                </div>

                <div className="space-y-4">
                    {/* Add New Branch Price */}
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add/Update Branch Price</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            {/* Custom Dropdown for Branches */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-left focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="truncate">{selectedBranchName}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                        onScroll={handleBranchScroll}
                                    >
                                        {branches.length > 0 ? (
                                            branches.map(b => (
                                                <div
                                                    key={b.id}
                                                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    onClick={() => {
                                                        setSelectedBranchId(b.id.toString());
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {b.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500 text-center">No branches found</div>
                                        )}

                                        {isFetchingBranches && (
                                            <div className="px-4 py-2 text-xs text-gray-400 text-center animate-pulse">Loading more...</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <input
                                type="number"
                                placeholder="Price"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                            <button
                                onClick={handleAddOrUpdate}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                Save Price
                            </button>
                        </div>
                    </div>

                    {/* Existing Branch Prices */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Branch</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">Branch Price</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {branchPrices.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">No branch-specific prices set.</td>
                                    </tr>
                                ) : (
                                    branchPrices.map(bp => (
                                        <tr key={bp.id}>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white">{bp.Branch?.name}</td>
                                            <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">₹{bp.price}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDelete(bp.id)}
                                                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default BranchPriceModal;
