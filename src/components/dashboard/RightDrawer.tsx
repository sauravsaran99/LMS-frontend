import React, { useEffect, useState, useRef, useCallback } from "react";
import RightActionBar from "./RightActionBar";
import { getBranchComparison } from "../../api/dashboard.api";
import { BranchComparison } from "../../types/dashboard";

type Props = {
  open: boolean
  onClose: () => void
  onSelectBranch?: (branch: BranchComparison) => void
}

export default function RightDrawer({ open, onClose, onSelectBranch }: Props) {
  const [branches, setBranches] = useState<BranchComparison[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const fetchBranches = useCallback(async () => {
    if ((loading && page > 1) || !hasMore) return; // Allow initial load even if 'loading' might be technically false/true, but debounce properly.
    // actually better: if loading return.
    if (loading) return;

    setLoading(true);
    try {
      const limit = 10;
      const response = await getBranchComparison(page, limit);
      const { rows, count } = response.data;

      setBranches((prev) => {
        if (page === 1) return rows;
        return [...prev, ...rows];
      });

      if (branches.length + rows.length >= count || rows.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, branches.length]);

  useEffect(() => {
    if (open) {
      fetchBranches();
    }
  }, [page, open]);

  // Reset when closed or opened? Maybe keep state.
  // Ideally reset if necessary, but keeping state serves as cache effectively.

  const lastBranchElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className={`right-drawer ${open ? "open" : ""}`}>
      {/* attach a small action button to the left edge of the drawer when open */}
      <div className={`drawer-attached ${open ? 'open' : ''}`}>
        <RightActionBar onOpen={onClose} inline />
      </div>
      <div className="drawer-header rounded-l-2xl shadow-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-between p-5">
        <div>
          <h3 className="font-extrabold text-xl tracking-tight">All Branches</h3>
          <p className="text-sm opacity-90 mt-0.5">{branches.length} branches • Insights & revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-2 bg-white/12 hover:bg-white/20 rounded-full transition-colors shadow-sm backdrop-blur"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="drawer-content p-5 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-white/60 to-white/40 dark:from-[#061024]/60 dark:to-[#061224]/40 backdrop-blur-md">
        <div className="space-y-4">
          {branches.map((branch, index) => {
            const isLast = branches.length === index + 1;
            return (
              <div
                key={index}
                ref={isLast ? lastBranchElementRef : null}
                onClick={() => {
                  if (onSelectBranch) {
                    onSelectBranch(branch);
                    onClose();
                  }
                }}
                className="branch-item group relative p-4 rounded-2xl bg-white dark:bg-[#0b1220] border border-transparent shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-tr-lg rounded-br-lg" />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{branch.branch_name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{branch?.city || ''}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 text-xs bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                      <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"/></svg>
                      {branch.total_bookings} Bookings
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
                  <div className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {formatCurrency(branch.total_revenue)}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 mask-circle" />
            </div>
          )}

          {!loading && branches.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No branches found.</p>
          )}

          {!hasMore && branches.length > 0 && (
            <p className="text-center text-xs text-gray-400 py-2">No more branches</p>
          )}
        </div>
      </div>
    </div>
  )
}
