"use client";

import { motion as Motion } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX, FiUsers, FiMonitor } from "react-icons/fi";
import { useTheme } from "../providers/ThemeProvider";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Join Waitlist", href: "#waitlist", showCount: true },
];

export default function Navbar() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [signupCount, setSignupCount] = useState<number | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Fetch signup count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/waitlist/count');
        const data = await response.json();
        if (data.count !== undefined) {
          setSignupCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching signup count:', error);
      }
    };

    fetchCount();
    // Refresh count every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-button")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  return (
    <Motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Motion.a 
            href="#" 
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Whisper Health
          </Motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex items-center space-x-2">
                <Motion.a
                  href={link.href}
                  className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </Motion.a>
                {link.showCount && signupCount !== null && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <FiUsers className="w-3.5 h-3.5" />
                    <span>{signupCount}</span>
                  </Motion.div>
                )}
              </div>
            ))}

            {/* Theme Toggle */}
            <div className="relative">
              <Motion.button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.5 }}
                aria-label="Change theme"
              >
                <Motion.div
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
                  animate={{
                    x: theme === 'dark' ? 20 : theme === 'system' ? 10 : 0,
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-yellow-500 dark:text-blue-300"
                  >
                    {theme === 'light' ? (
                      <FiSun className="w-2.5 h-2.5" />
                    ) : theme === 'dark' ? (
                      <FiMoon className="w-2.5 h-2.5" />
                    ) : (
                      <FiMonitor className="w-2.5 h-2.5" />
                    )}
                  </Motion.div>
                </Motion.div>
              </Motion.button>

              {/* Theme Menu */}
              {showThemeMenu && (
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiSun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiMoon className="w-4 h-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiMonitor className="w-4 h-4" />
                    System
                  </button>
                </Motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Improved spacing and touch targets */}
          <div className="md:hidden flex items-center space-x-6">
            {/* Theme Toggle for Mobile */}
            <div className="relative">
              <Motion.button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Motion.div
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center"
                  animate={{
                    x: theme === 'dark' ? 20 : theme === 'system' ? 10 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {theme === 'light' ? (
                    <FiSun className="w-3 h-3 text-yellow-500" />
                  ) : theme === 'dark' ? (
                    <FiMoon className="w-3 h-3 text-blue-300" />
                  ) : (
                    <FiMonitor className="w-3 h-3 text-gray-500" />
                  )}
                </Motion.div>
              </Motion.button>
            </div>

            <Motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button p-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </Motion.div>
            </Motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-lg py-4 transition-all duration-300 ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-3 sm:px-6">
          {navLinks.map((link) => (
            <Motion.a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.showCount && signupCount !== null && (
                  <span className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                    <FiUsers className="w-4 h-4" />
                    <span className="font-medium">{signupCount}</span>
                  </span>
                )}
              </div>
            </Motion.a>
          ))}
        </div>
      </Motion.div>
    </Motion.nav>
  );
} 