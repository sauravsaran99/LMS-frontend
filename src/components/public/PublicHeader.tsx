import { Link } from "react-router-dom";
import { ThemeToggleButton } from "../common/ThemeToggleButton";

const PublicHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className={"py-8 flex justify-start"}>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700">
              <span className="text-white font-bold text-lg">Rx</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 font-medium transition-colors"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 font-medium transition-colors"
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 font-medium transition-colors"
          >
            Pricing
          </a>
          <a
            href="contact"
            className="text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 font-medium transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* Auth Links */}
          <Link
            to="/signin"
            className="hidden sm:inline-block px-4 py-2.5 text-brand-500 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/signin"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 text-white font-medium hover:shadow-lg dark:from-brand-600 dark:to-brand-800 transition-shadow"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
