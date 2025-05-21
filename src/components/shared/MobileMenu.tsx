import { AnimatePresence, motion as Motion } from "framer-motion";
import { FiX, FiUsers } from "react-icons/fi";
import React from "react";

interface NavLink {
  label: string;
  href: string;
  showCount?: boolean;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  signupCount: number | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, navLinks, signupCount }) => (
  <>
    {/* Overlay */}
    <AnimatePresence>
      {open && (
        <Motion.div
          key="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden mobile-menu-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>

    {/* Slide-in Panel */}
    <AnimatePresence>
      {open && (
        <Motion.aside
          key="mobile-menu-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col md:hidden mobile-menu"
          style={{ willChange: 'transform' }}
          aria-label="Mobile menu"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Menu</span>
            <button
              onClick={onClose}
              className="text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Close menu"
            >
              <FiX className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-6 mt-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 w-4/5 text-center transition-colors"
                onClick={onClose}
              >
                {link.label}
                {link.showCount && signupCount !== null && (
                  <span className="ml-2 inline-flex items-center gap-1 text-base text-blue-600 dark:text-emerald-400">
                    <FiUsers className="w-4 h-4" />
                    {signupCount}
                  </span>
                )}
              </a>
            ))}
          </nav>
          <div className="flex-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Whisper Health</span>
          </div>
        </Motion.aside>
      )}
    </AnimatePresence>
  </>
);

export default MobileMenu; 