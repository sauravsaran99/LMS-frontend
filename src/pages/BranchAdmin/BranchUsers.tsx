import { useEffect, useState } from "react";
import { getBranchUsers, toggleUserStatus } from "../../api/branchAdmin.api";
import UserFormModal from "./UserFormModal";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

const BranchUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const loadUsers = async () => {
    const res = await getBranchUsers();
    setUsers(res.data.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user: any) => {
    await toggleUserStatus(user.id);
    toast.success("User status updated");
    loadUsers();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Branch Users</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your branch staff members
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          + Add User
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {u.Role?.name === "RECEPTIONIST" ? "Receptionist" : "Technician"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${u.is_active == true
                          ? "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                      >
                        {u.is_active == true ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(u)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        {u.is_active == false ? "Activate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No users found. Create your first user to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <UserFormModal
          onClose={() => setOpen(false)}
          onSuccess={loadUsers}
          user={editingUser}
        />
      )}
    </div>
  );
};

export default BranchUsers;
