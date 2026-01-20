import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBranches } from "../../../api/branch.api";
import { createBranchAdmin } from "../../../api/branchAdmin.api";

const CreateBranchAdminModal = ({ onClose, onSuccess }: any) => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    base_branch_id: "",
  });

  useEffect(() => {
    getBranches().then((res) => setBranches(res.data.data));
  }, []);

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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 overflow-hidden">
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

          {/* Branch */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              value={form.base_branch_id}
              onChange={(e) => setForm({ ...form, base_branch_id: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-[#465fff] focus:outline-none focus:ring-2 focus:ring-[#465fff]/20 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-[#0ba5ec] dark:focus:ring-[#0ba5ec]/20 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
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
