import { useEffect, useState, useRef, useCallback } from "react";
import { getBranches, updateBranchStatus } from "../../../api/branch.api";
import BranchFormModal from "./BranchFormModal";
import Button from "../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../../components/ui/table";
import toast from "react-hot-toast";

const BranchList = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  const fetchBranches = useCallback(
    async (page: number = 1, isInfinite: boolean = false) => {
      try {
        if (isInfinite) {
          setIsLoadingMore(true);
        } else {
          setLoading(true);
        }

        // Fetch with pagination parameters
        const res = await getBranches({ page, limit: ITEMS_PER_PAGE });
        console.log("API Response:", res.data);

        // Handle different API response formats
        let newBranches: any[] = [];
        let shouldHaveMore = false;

        if (Array.isArray(res.data)) {
          // If direct array
          newBranches = res.data;
          shouldHaveMore = false;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          // If nested in data property
          newBranches = res.data.data;
          shouldHaveMore =
            res.data.hasMore !== undefined
              ? res.data.hasMore
              : newBranches.length === ITEMS_PER_PAGE;
        }

        console.log(`Page ${page}: Got ${newBranches.length} branches`);

        if (isInfinite) {
          setBranches((prev) => [...prev, ...newBranches]);
        } else {
          setBranches(newBranches);
        }

        setCurrentPage(page);
        setHasMore(shouldHaveMore);

        console.log(`shouldHaveMore: ${shouldHaveMore}`);
      } catch (error) {
        console.error("Failed to load branches:", error);
        toast.error("Failed to load branches");
      } finally {
        if (isInfinite) {
          setIsLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [ITEMS_PER_PAGE]
  );

  // Initial load
  useEffect(() => {
    fetchBranches(1, false);
  }, [fetchBranches]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log("Observer triggered:", {
          isIntersecting: entry.isIntersecting,
          hasMore,
          isLoadingMore,
          loading,
        });
        if (entry.isIntersecting && hasMore && !isLoadingMore && !loading) {
          console.log("Loading next page:", currentPage + 1);
          fetchBranches(currentPage + 1, true);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "100px",
      }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loading, currentPage, fetchBranches]);

  const toggleStatus = async (branch: any) => {
    console.log("branch", branch);
    try {
      await updateBranchStatus(branch.id, branch.is_active === true ? "INACTIVE" : "ACTIVE");
      toast.success("Branch status updated");
      await fetchBranches(1, false);
    } catch (error) {
      toast.error("Failed to update branch status");
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "ACTIVE";
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branches</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage and view all branch information
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          size="md"
          startIcon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Add Branch
        </Button>
      </div>

      {/* Content Card */}
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 h-8 w-8 mb-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading branches...</p>
              </div>
            </div>
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                No branches found
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Get started by creating your first branch
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Branch Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Address
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch, index) => (
                    <TableRow
                      key={branch.id}
                      className={`border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/30 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-transparent"
                          : "bg-gray-50/50 dark:bg-white/[0.01]"
                      }`}
                    >
                      <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {branch.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {branch.city || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {getStatusBadge(branch.is_active == true ? "ACTIVE" : "INACTIVE")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditing(branch)}
                            className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <svg
                              className="mr-1 h-4 w-4"
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
                          <button
                            onClick={() => toggleStatus(branch)}
                            className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                              branch.is_active == true
                                ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            }`}
                          >
                            {branch.is_active == true ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {isLoadingMore && (
          <div className="flex items-center justify-center py-6 bg-white dark:bg-white/[0.03]">
            <div className="w-6 h-6 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
              Loading more branches...
            </span>
          </div>
        )}

        {/* Observer target for infinite scroll */}
        <div ref={observerTarget} className="h-2" />

        {/* End of list message */}
        {!hasMore && branches.length > 0 && (
          <div className="flex items-center justify-center py-6 bg-white dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">No more branches to load</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {(open || editing) && (
        <BranchFormModal
          initialData={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSuccess={() => {
            fetchBranches(1, false);
            setOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
};

export default BranchList;
