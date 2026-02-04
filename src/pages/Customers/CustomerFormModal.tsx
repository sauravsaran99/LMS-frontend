import { useEffect, useState, useRef } from "react";
import { createCustomer, updateCustomer } from "../../api/customer.api";
import { Modal } from "../../components/ui/modal";
import toast from "react-hot-toast";
import { Customer } from "../../types/customer";
import { getPincodeData } from "../../utils/pincodeData";
import { getBranches } from "../../api/branch.api";
import { useAuth } from "../../context/AuthContext";

interface CustomerFormModalProps {
  initialData?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (customer: Customer) => void;
}

const CustomerFormModal = ({ initialData, isOpen, onClose, onSuccess }: CustomerFormModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [stateCode, setStateCode] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [branches, setBranches] = useState<any[]>([]);
  const [branchId, setBranchId] = useState<number | "">(initialData?.base_branch_id || "");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setDob(initialData.dob || "");
      setGender(initialData.gender || "");
      setAddress(initialData.address || "");
      setPincode(initialData.pincode || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setCountry(initialData.country || "India");
      setStateCode(initialData.state_code || "");
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      setImagePreview(initialData.profile_image ? `${baseUrl}${initialData.profile_image}` : "");
      setBranchId(initialData.base_branch_id || "");
    } else {
      setName("");
      setPhone("");
      setDob("");
      setGender("");
      setAddress("");
      setPincode("");
      setCity("");
      setState("");
      setCountry("India");
      setStateCode("");
      setProfileImage(null);
      setImagePreview("");
      setBranchId("");
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isSuperAdmin && isOpen) {
      getBranches()
        .then((res) => setBranches(res.data))
        .catch(() => toast.error("Failed to load branches"));
    }
  }, [isSuperAdmin, isOpen]);

  const handlePincodeChange = (value: string) => {
    const trimmedValue = value.trim();
    console.log("Pincode changed:", trimmedValue);
    setPincode(trimmedValue);
    if (trimmedValue.length === 6) {
      console.log("Fetching data for pincode:", trimmedValue);
      const data = getPincodeData(trimmedValue);
      console.log("Pincode data found:", data);
      if (data) {
        setCity(data.city);
        setState(data.state);
        setStateCode(data.state_code);
        toast.success(`Auto-filled for ${data.city}`);
      } else {
        toast.error("Pincode details not found in local database");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      if (dob) formData.append("dob", dob);
      if (gender) formData.append("gender", gender);
      if (address) formData.append("address", address.trim());
      if (pincode) formData.append("pincode", pincode);
      if (city) formData.append("city", city);
      if (state) formData.append("state", state);
      if (country) formData.append("country", country);
      if (stateCode) formData.append("state_code", stateCode);
      if (profileImage) formData.append("profile_image", profileImage);
      if (isSuperAdmin && branchId) formData.append("base_branch_id", String(branchId));

      let response;
      if (isEditMode) {
        response = await updateCustomer(initialData.id, formData);
        toast.success("Customer updated successfully");
      } else {
        response = await createCustomer(formData);
        toast.success("Customer created successfully");
      }

      onSuccess?.(response.data.customer);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} customer`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {isEditMode ? "Update customer information below" : "Enter customer details below"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] text-gray-500 mt-1 block">Upload</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500 mt-2">Max size: 2MB (JPEG, PNG)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
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

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pincode
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                placeholder="400001"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                placeholder="Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                placeholder="Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            {/* State Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State Code
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                placeholder="MH"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {isSuperAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/50"
                  value={branchId}
                  onChange={(e) => setBranchId(Number(e.target.value) || "")}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="123 Main St"
              rows={2}
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
              isEditMode ? "Save Changes" : "Create Customer"
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
