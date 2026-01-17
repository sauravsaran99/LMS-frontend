import { useEffect, useState } from "react";
import { createTest, updateTest } from "../../../api/test.api";
import toast from "react-hot-toast";

interface Props {
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const TestFormModal = ({ initialData, onClose, onSuccess }: Props) => {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "");
      setPrice(initialData.price || "");
      setStatus(initialData.status || "ACTIVE");
    }
  }, [initialData]);

  const validate = () => {
    setError("");
    if (!name.trim()) {
      setError("Test name is required");
      return false;
    }
    if (!category.trim()) {
      setError("Category is required");
      return false;
    }
    if (price === "" || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEdit) {
        await updateTest(initialData.id, {
          name: name.trim(),
          price: Number(price),
          status,
        });
        toast.success("Test updated successfully");
      } else {
        await createTest({
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
        });
        toast.success("Test created successfully");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setCategory("");
    setPrice("");
    setStatus("ACTIVE");
    setError("");
    onClose();
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
          <svg
            className="w-6 h-6 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEdit ? "Edit Test" : "Add New Test"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {isEdit
              ? "Update test information"
              : "Create a new test entry"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6 dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
        {/* Test Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Test Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-900/50"
            placeholder="e.g., Blood Test, X-Ray"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-900/50"
            placeholder="e.g., Pathology"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              ₹
            </span>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-900/50"
              placeholder="500"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Status (Only for Edit) */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-900/50"
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClose}
          disabled={loading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {isEdit ? "Updating..." : "Creating..."}
            </span>
          ) : isEdit ? (
            "Update Test"
          ) : (
            "Create Test"
          )}
        </button>
      </div>
    </div>
  );
};

export default TestFormModal;
