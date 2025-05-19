"use client";

import { motion } from "framer-motion";
import { FiLinkedin, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full py-12 px-4 overflow-hidden"
    >
      {/* Extra milky background with stronger gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/95 to-white/98 dark:from-transparent dark:via-gray-900/95 dark:to-gray-950/98 backdrop-blur-xl" />
      
      {/* Additional milky overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm" />
      
      {/* Decorative elements with reduced opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/3 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/3 dark:bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content with enhanced contrast */}
      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.span 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 dark:text-gray-300 text-sm font-medium"
        >
          © {new Date().getFullYear()} Whisper Health. All rights reserved.
        </motion.span>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-6 items-center justify-center"
        >
          {/* Social Links */}
          <a 
            href="https://www.linkedin.com/in/tymon-podlaszewski-b2a424253/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-lg transition-all duration-200 hover:scale-110"
            aria-label="LinkedIn Profile"
          >
            <FiLinkedin />
          </a>
          <a 
            href="https://www.instagram.com/tymonpodlas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 text-lg transition-all duration-200 hover:scale-110"
            aria-label="Instagram Profile"
          >
            <FiInstagram />
          </a>
          
          {/* Other Links */}
          <div className="h-4 w-px bg-gray-400/50 dark:bg-gray-600/50" />
          
          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-emerald-400 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Privacy Policy
          </a>
          <a 
            href="mailto:hello@whisperhealth.com" 
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-emerald-400 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Contact
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
} 