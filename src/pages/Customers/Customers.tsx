import { useEffect, useState, useRef, useCallback } from "react";
import { searchCustomers, createCustomer, getCustomers } from "../../api/customer.api";
import { Customer } from "../../types/customer";
import { useAuth } from "../../context/AuthContext";
import { getBranches } from "../../api/branch.api";
import toast from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import CustomerFormModal from "./CustomerFormModal";

const Customers = () => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerIsLoadingMore, setCustomerIsLoadingMore] = useState(false);
  const customerObserverTarget = useRef<HTMLDivElement>(null);
  const customerLimit = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Create form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [branchId, setBranchId] = useState<number | "">("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      const res = await searchCustomers(query);
      setCustomers(res.data);
    } catch {
      toast.error("Failed to search customers");
    } finally {
      setLoading(false);
    }
  };

  const validateCreate = () => {
    if (!name.trim()) return "Customer name is required";
    if (!phone.trim()) return "Phone is required";
    if (phone.length < 10) return "Invalid phone number";
    return "";
  };

  const handleCreate = async () => {
    const validationError = validateCreate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        age: age || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
        base_branch_id: isSuperAdmin ? branchId || undefined : undefined,
      });

      // Reset
      setName("");
      setPhone("");
      setAge("");
      setGender("");
      setAddress("");
      setShowForm(false);

      toast.success("Customer created successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = useCallback(
    async (page: number = 1, isInfinite: boolean = false) => {
      try {
        if (isInfinite) {
          setCustomerIsLoadingMore(true);
        } else {
          setLoading(true);
        }
        const res = await getCustomers({ page, limit: customerLimit });
        console.log("Customers API Response:", res.data);

        let newCustomers: Customer[] = [];
        if (Array.isArray(res.data)) {
          newCustomers = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          newCustomers = res.data.data;
        }

        console.log(`Page ${page}: Got ${newCustomers.length} customers`);
        const shouldHaveMore = newCustomers.length === customerLimit;

        if (isInfinite) {
          setCustomers((prev) => [...prev, ...newCustomers]);
        } else {
          setCustomers(newCustomers);
        }

        setCustomerPage(page);
        setCustomerHasMore(shouldHaveMore);
      } catch (error) {
        console.error("Failed to load customers:", error);
        if (!isInfinite) {
          toast.error("Failed to load customers");
        }
      } finally {
        if (isInfinite) {
          setCustomerIsLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [customerLimit]
  );

  useEffect(() => {
    loadCustomers(1, false);
  }, [loadCustomers]);

  // Intersection Observer for customers infinite scroll
  useEffect(() => {
    if (!customerObserverTarget.current || !customerHasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && customerHasMore && !customerIsLoadingMore && !loading) {
          loadCustomers(customerPage + 1, true);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "100px",
      }
    );

    observer.observe(customerObserverTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [customerHasMore, customerIsLoadingMore, loading, customerPage, loadCustomers]);

  useEffect(() => {
    if (isSuperAdmin) {
      getBranches()
        .then((res) => setBranches(res.data))
        .catch(() => setError("Failed to load branches"));
    }
  }, [isSuperAdmin]);

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setIsModalOpen(true);
  };

  // const handleStatusToggle = async (customerId: number) => {
  //     try {
  //         setTogglingId(customerId);
  //         await toggleCustomerStatus(customerId);
  //         // Refresh the customer list
  //         const res = await getCustomers();
  //         setCustomers(res.data);
  //         toast.success("Customer status updated successfully");
  //     } catch (err: any) {
  //         toast.error(err.response?.data?.message || "Failed to toggle customer status");
  //     } finally {
  //         setTogglingId(null);
  //     }
  // };

  const handleEditSuccess = async () => {
    // Reload customers to reflect changes
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err: any) {
      toast.error("Failed to reload customers");
    }
  };

  const getGenderLabel = (gender: string | undefined) => {
    const labels: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };
    return labels[gender || ""] || "-";
  };

  return (
    <>
      <PageMeta title="Customers" description="Manage and search customers" />
      <div className="space-y-6 relative">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and view all customer information
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
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
              Add Customer
            </span>
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Search Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Customers
            </h2>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/50"
              placeholder="Search by name or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Table */}
        {customers.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {c.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {c.age || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                        {getGenderLabel(c.gender)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {c.address || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Edit customer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        {/* <button
                                                    onClick={() => handleStatusToggle(c.id)}
                                                    disabled={togglingId === c.id}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Toggle customer status"
                                                >
                                                    {togglingId === c.id ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Toggle
                                                        </>
                                                    )}
                                                </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Infinite Scroll Loading Indicator */}
            {customerIsLoadingMore && (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Loading more customers...
                </span>
              </div>
            )}

            {/* Observer target for infinite scroll */}
            <div ref={customerObserverTarget} className="h-2" />

            {/* End of list message */}
            {!customerHasMore && customers.length > 0 && (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No more customers to load
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && customers.length === 0 && query && (
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
                d="M20 21l-4.35-4.35m0 0a7 7 0 10-9.9 9.9 7 7 0 009.9-9.9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No customers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Add Customer Form */}
        {showForm && (
          <div className="absolute top-40 left-0 right-0 mx-6 z-50 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Customer
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-green-900/50"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-green-900/50"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-green-900/50"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || "")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/50"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-green-900/50"
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

              <div className={isSuperAdmin ? "lg:col-span-1" : "lg:col-span-2"}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-colors hover:border-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-green-900/50"
                  placeholder="123 Main St, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  "Add Customer"
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        <CustomerFormModal
          isOpen={isModalOpen}
          initialData={editing}
          onClose={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </div>
    </>
  );
};

export default Customers;
