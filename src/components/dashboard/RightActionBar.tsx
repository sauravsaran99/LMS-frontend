import React from "react";

type Props = {
  onOpen: () => void
  inline?: boolean
}

export default function RightActionBar({ onOpen, inline = false }: Props) {
  if (inline) {
    return (
      <div className="inline-action cursor-pointer" title="View All Branches">
        <button
          onClick={onOpen}
          className="flex items-center justify-center w-full h-full rounded-md bg-transparent text-blue-600 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          aria-label="Open branches"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="right-bar cursor-pointer transition-colors" title="View All Branches">
      <button
        onClick={onOpen}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/95 dark:bg-[#071026] text-blue-600 dark:text-blue-300 ring-1 ring-gray-100 dark:ring-transparent shadow-md hover:opacity-95 transition-colors"
        aria-label="Open branches"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
