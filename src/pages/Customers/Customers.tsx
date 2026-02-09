import { useEffect, useState, useRef, useCallback } from "react";
import { searchCustomers, getCustomers } from "../../api/customer.api";
import { Customer } from "../../types/customer";
import { useAuth } from "../../context/AuthContext";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [showMyBranchOnly, setShowMyBranchOnly] = useState(false);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const handleSearch = async () => {
    if (!query.trim()) {
      loadCustomers(1, false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await searchCustomers(query, showMyBranchOnly);
      setCustomers(res.data.data);
      setCustomerHasMore(false); // Disable infinite scroll during search
    } catch {
      toast.error("Failed to search customers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const loadCustomers = useCallback(
    async (page: number = 1, isInfinite: boolean = false) => {
      try {
        if (isInfinite) {
          setCustomerIsLoadingMore(true);
        } else {
          setLoading(true);
        }

        // Use the latest showMyBranchOnly state
        const params = {
          page,
          limit: customerLimit,
          myBranchOnly: showMyBranchOnly
        };

        const res = await getCustomers(params);

        let newCustomers: Customer[] = [];
        if (Array.isArray(res.data)) {
          newCustomers = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          newCustomers = res.data.data;
        }

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
    [customerLimit, showMyBranchOnly]
  );

  // Separate useEffect to handle filter changes specifically
  useEffect(() => {
    // Reset to page 1 and reload when filter changes
    loadCustomers(1, false);
    setQuery(""); // Clear search when switching filters to keep it simple
  }, [showMyBranchOnly, loadCustomers]);


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

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    loadCustomers(1, false);
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
            onClick={handleAddCustomer}
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showMyBranchOnly}
                onChange={(e) => setShowMyBranchOnly(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Show only my branch customers
              </span>
            </label>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                        {c.profile_image ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${c.profile_image}`}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{c.dob ? new Date(c.dob).toLocaleDateString() : 'DOB not set'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {c.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {c.city ? `${c.city}, ${c.state_code || c.state}` : 'Location unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      {c.gender || "Not set"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && !customerIsLoadingMore && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {customerIsLoadingMore && (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                Loading more...
              </span>
            </div>
          )}

          <div ref={customerObserverTarget} className="h-4" />
        </div>

        <CustomerFormModal
          isOpen={isModalOpen}
          initialData={editing || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
          onSuccess={handleFormSuccess}
        />
      </div>
    </>
  );
};

export default Customers;
