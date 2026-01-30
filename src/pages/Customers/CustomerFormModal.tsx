import { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../../api/customer.api"; // Updated import
import { Modal } from "../../components/ui/modal";
import toast from "react-hot-toast";

import { Customer } from "../../types/customer";

interface CustomerFormModalProps {
  initialData?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (customer: Customer) => void;
}

const CustomerFormModal = ({ initialData, isOpen, onClose, onSuccess }: CustomerFormModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialData; // Determine mode based on initialData

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setAge(initialData.age || "");
      setGender(initialData.gender || "");
      setAddress(initialData.address || "");
    } else {
      // Reset form for create mode
      setName("");
      setPhone("");
      setAge("");
      setGender("");
      setAddress("");
    }
  }, [initialData, isOpen]); // Added isOpen to reset when opening fresh

  const validateForm = () => {
    if (!name.trim()) return "Customer name is required";
    if (!phone.trim()) return "Phone is required";
    if (phone.length < 10) return "Invalid phone number";
    return "";
  };

  const submit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        age: age || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
      };

      let response;
      if (isEditMode) {
        response = await updateCustomer(initialData.id, payload);
        toast.success("Customer updated successfully");
      } else {
        response = await createCustomer(payload);
        toast.success("Customer created successfully");
      }

      onSuccess?.(response.data.customer); // Pass back the customer data
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {isEditMode ? "Update customer information below" : "Enter customer details below"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || "")}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/50"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="123 Main St, City"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerFormModal;
