import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBranchAdmins } from "../../../api/branchAdmin.api";
import CreateBranchAdminModal from "./CreateBranchAdminModal";
import PageMeta from "../../../components/common/PageMeta";

const BranchAdmins = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getBranchAdmins();
      setAdmins(res.data.data);
    } catch {
      toast.error("Failed to load branch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageMeta title="Branch Admins" description="Manage branch administrators" />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branch Admins</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and view all branch administrators
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gradient-to-r from-[#465fff] to-[#2a31d8] hover:from-[#2a31d8] hover:to-[#1a1fb8] px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg active:scale-95"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Branch Admin
            </span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : admins.length > 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#465fff] to-[#0ba5ec] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {admin.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {admin.Branch.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 border-dashed bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No branch admins found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get started by creating your first branch admin
            </p>
          </div>
        )}

        {/* Create Modal */}
        {open && <CreateBranchAdminModal onClose={() => setOpen(false)} onSuccess={load} />}
      </div>
    </>
  );
};

export default BranchAdmins;
