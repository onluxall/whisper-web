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

const panelVariants = {
  hidden: { x: '100%', opacity: 0.8, scale: 0.98 },
  visible: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 32 } },
  exit: { x: '100%', opacity: 0.8, scale: 0.98, transition: { duration: 0.22 } },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, navLinks, signupCount }) => (
  <>
    {/* Overlay */}
    <AnimatePresence>
      {open && (
        <Motion.div
          key="mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] md:hidden mobile-menu-overlay"
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
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 right-0 h-screen w-4/5 max-w-xs bg-white/20 dark:bg-gray-900/30 shadow-2xl z-50 flex flex-col md:hidden mobile-menu border border-white/40 dark:border-gray-700/40 backdrop-blur-lg"
          style={{ willChange: 'transform' }}
          aria-label="Mobile menu"
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight">Whisper Health</span>
            <Motion.button
              onClick={onClose}
              className="text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Close menu"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <FiX className="h-7 w-7" />
            </Motion.button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-0 mt-6 w-full">
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.href}>
                <Motion.a
                  href={link.href}
                  className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl w-4/5 text-center transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800 focus:bg-blue-100 dark:focus:bg-gray-800 active:scale-95 cursor-pointer"
                  whileHover={{ scale: 1.04, backgroundColor: "#e0f2fe" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                >
                  {link.label}
                  {link.showCount && signupCount !== null && (
                    <span className="ml-2 inline-flex items-center gap-1 text-base text-blue-600 dark:text-emerald-400">
                      <FiUsers className="w-4 h-4" />
                      {signupCount}
                    </span>
                  )}
                </Motion.a>
                {/* Divider except after last item */}
                {idx < navLinks.length - 1 && (
                  <div className="w-3/4 mx-auto h-px bg-gradient-to-r from-blue-100 via-gray-200 to-emerald-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 opacity-70" />
                )}
              </React.Fragment>
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