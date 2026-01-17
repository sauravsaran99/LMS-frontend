import { useState } from "react";
import { createBranch, updateBranch } from "../../../api/branch.api";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import toast from "react-hot-toast";

const BranchFormModal = ({ initialData, onClose, onSuccess }: any) => {
  const [name, setName] = useState(initialData?.name || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialData);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Branch name is required");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateBranch(initialData.id, { name: name.trim(), city: city.trim() });
        toast.success("Branch updated successfully");
      } else {
        await createBranch({ name: name.trim(), city: city.trim() });
        toast.success("Branch created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
      <div className="overflow-y-auto p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Branch" : "Add New Branch"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update branch information"
              : "Create a new branch for your organization"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Branch Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter branch name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              placeholder="Enter branch city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={submit}
            disabled={loading || !name.trim()}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {loading ? "Saving..." : isEdit ? "Update Branch" : "Create Branch"}
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outline"
            size="md"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BranchFormModal;
