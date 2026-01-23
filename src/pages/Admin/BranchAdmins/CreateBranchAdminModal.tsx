import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { getBranches } from "../../../api/branch.api";
import { createBranchAdmin } from "../../../api/branchAdmin.api";

const CreateBranchAdminModal = ({ onClose, onSuccess }: any) => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Custom dropdown & infinite scroll state
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    base_branch_id: "",
  });

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
    } catch (e: any) {
      console.error("Failed to fetch branches", e);
    } finally {
      setIsFetchingBranches(false);
    }
  };

  useEffect(() => {
    fetchBranches(1);

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadMoreBranches = () => {
    if (hasMore && !isFetchingBranches) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBranches(nextPage);
    }
  };

  const handleBranchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      loadMoreBranches();
    }
  };

  const handleSelectBranch = (branch: any) => {
    setForm({ ...form, base_branch_id: branch.id });
    setIsOpen(false);
  };

  const getSelectedBranchName = () => {
    const branch = branches.find(b => b.id === Number(form.base_branch_id));
    return branch ? branch.name : "Select Branch";
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.base_branch_id) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);
      await createBranchAdmin({
        ...form,
        base_branch_id: Number(form.base_branch_id),
      });
      toast.success("Branch Admin created successfully");
      setForm({ name: "", email: "", password: "", base_branch_id: "" });
      onClose();
      onSuccess();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create branch admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#465fff] to-[#0ba5ec]">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Branch Admin
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Add a new administrator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-[#465fff] focus:outline-none focus:ring-2 focus:ring-[#465fff]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-[#0ba5ec] dark:focus:ring-[#0ba5ec]/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-[#465fff] focus:outline-none focus:ring-2 focus:ring-[#465fff]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-[#0ba5ec] dark:focus:ring-[#0ba5ec]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-[#465fff] focus:outline-none focus:ring-2 focus:ring-[#465fff]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-[#0ba5ec] dark:focus:ring-[#0ba5ec]/20"
            />
          </div>

          {/* Branch (Custom Dropdown) */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Branch <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-[#465fff] focus:outline-none focus:ring-2 focus:ring-[#465fff]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-[#0ba5ec] dark:focus:ring-[#0ba5ec]/20 flex justify-between items-center"
            >
              <span className={form.base_branch_id ? "text-gray-900 dark:text-white" : "text-gray-500"}>
                {getSelectedBranchName()}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div
                className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 max-h-48 overflow-y-auto"
                onScroll={handleBranchScroll}
              >
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBranch(b)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${Number(form.base_branch_id) === b.id
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                        }`}
                    >
                      {b.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500 text-center">No branches found</div>
                )}
                {isFetchingBranches && (
                  <div className="px-4 py-2 text-xs text-center text-gray-400">Loading more...</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3 justify-end bg-gray-50 dark:bg-gray-800/30">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-[#465fff] to-[#2a31d8] hover:from-[#2a31d8] hover:to-[#1a1fb8] px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBranchAdminModal;
