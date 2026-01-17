import { useState } from "react";
import { createBranchUser } from "../../api/branchAdmin.api";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

interface UserFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UserFormModal = ({ onClose, onSuccess }: UserFormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"RECEPTIONIST" | "TECHNICIAN">("RECEPTIONIST");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !password) {
      toast.error("All fields required");
      return;
    }

    try {
      setIsLoading(true);
      await createBranchUser({ name, email, password, role });
      toast.success("User created successfully");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create user");
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
            Add New User
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new user account for your branch
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
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
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
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="primary"
            onClick={submit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create User"}
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
