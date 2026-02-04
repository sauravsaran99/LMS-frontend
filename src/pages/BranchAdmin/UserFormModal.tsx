import { useState, useEffect } from "react";
import { createBranchUser, updateBranchUser } from "../../api/branchAdmin.api";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";
import { getBranches } from "../../api/branch.api";

interface UserFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: any; // Optional user prop for editing
}

const UserFormModal = ({ onClose, onSuccess, user }: UserFormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"RECEPTIONIST" | "TECHNICIAN">("RECEPTIONIST");
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  const fetchBranches = async (currentPage: number) => {
    console.log("[DEBUG] Fetching branches. Page:", currentPage, "IsFetching:", isFetchingBranches);
    if (isFetchingBranches) return;
    setIsFetchingBranches(true);
    try {
      const { data } = await getBranches({ page: currentPage, limit: 10 });

      // console.log("[DEBUG] API Response Data:", data);

      let newBranches: { id: number; name: string }[] = [];
      if (data.data) {
        newBranches = data.data;
      } else if (data.branches) {
        newBranches = data.branches;
      } else if (Array.isArray(data)) {
        newBranches = data;
      }

      console.log("[DEBUG] New Branches Count:", newBranches.length);

      setBranches((prev) => currentPage === 1 ? newBranches : [...prev, ...newBranches]);
      setHasMore(newBranches.length === 10);
      console.log("[DEBUG] Has More?", newBranches.length === 10);
    } catch (e) {
      console.error("[DEBUG] Failed to fetch branches", e);
    } finally {
      setIsFetchingBranches(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBranches(1);
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.Role?.name || "RECEPTIONIST");
      if (user.UserBranches && Array.isArray(user.UserBranches)) {
        setSelectedBranches(user.UserBranches.map((ub: any) => ub.branch_id));
      }
    }
  }, [user]);

  const loadMoreBranches = () => {
    console.log("[DEBUG] loadMoreBranches triggered. HasMore:", hasMore, "IsFetching:", isFetchingBranches);
    if (hasMore && !isFetchingBranches) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBranches(nextPage);
    }
  };

  const handleBranchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    console.log("[DEBUG] Scroll Event. Dist:", distanceToBottom, "ScrollTop:", scrollTop, "ScrollHeight:", scrollHeight, "ClientHeight:", clientHeight);

    // Increased threshold slightly for reliablity
    if (distanceToBottom <= 10) {
      loadMoreBranches();
    }
  };

  const toggleBranch = (branchId: number) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const submit = async () => {
    if (!name || !email || (!user && !password)) {
      toast.error("All fields required");
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = {
        name,
        email,
        role,
        branchIds: selectedBranches,
      };

      if (password) {
        payload.password = password;
      }

      if (user) {
        await updateBranchUser(user.id, payload);
        toast.success("User updated successfully");
      } else {
        await createBranchUser(payload as any);
        toast.success("User created successfully");
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || `Failed to ${user ? "update" : "create"} user`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-md">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user ? "Update user account details" : "Create a new user account for your branch"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password {user && <span className="text-xs text-gray-400 font-normal">(Leave blank to keep unchanged)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={user ? "Enter new password (optional)" : "Enter password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Role Field */}
          <div>
            <Label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              User Role
            </Label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value as "RECEPTIONIST" | "TECHNICIAN")}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors"
            >
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>

          {/* Branch Selection Field (Only for TECHNICIAN) */}
          {role === "TECHNICIAN" && (
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assign Branches (Optional)
              </Label>
              <div
                className="max-h-40 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                onScroll={handleBranchScroll}
              >
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id={`branch-${branch.id}`}
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => toggleBranch(branch.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <label
                        htmlFor={`branch-${branch.id}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                      >
                        {branch.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No branches available</p>
                )}
                {isFetchingBranches && (
                  <p className="text-xs text-center text-gray-400 py-1">Loading more...</p>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Technician will be assigned to their main branch by default.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="primary"
            onClick={submit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : (user ? "Update User" : "Create User")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default UserFormModal;
