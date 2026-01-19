import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-md space-y-4">
              {/* <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link> */}
              <div className={"py-8 flex justify-start"}>
                <Link to="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700">
                    <span className="text-white font-bold text-lg">Rx</span>
                  </div>
                </Link>
              </div>
              <h2 className="text-3xl font-bold text-center text-white tracking-tight">
                Smart. Secure. Reliable.
              </h2>
              <p className="text-center text-base leading-relaxed text-gray-300 dark:text-white/70 font-light">
                An all-in-one platform to manage lab operations, patient records, test reports, and
                staff — built for speed and accuracy.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
