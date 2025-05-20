"use client";

import { FiMail, FiLinkedin, FiHeart } from "react-icons/fi";
import ScrollAnimation from "../ui/ScrollAnimation";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-3xl relative">
        <div className="text-center mb-10 md:mb-12">
          <ScrollAnimation animation="fadeUp" threshold={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact for Investors & Collaborators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Are you interested in investing or collaborating with Whisper Health? Reach out directly:
            </p>
          </ScrollAnimation>
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-center md:gap-8">
          <a
            href="mailto:t.podlaszewski@outlook.com"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 text-lg md:text-xl font-medium transition hover:bg-blue-50 dark:hover:bg-gray-800 w-full md:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiMail className="w-7 h-7" />
            <span className="truncate">t.podlaszewski@outlook.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/tymon-podlaszewski-b2a424253/"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 text-lg md:text-xl font-medium transition hover:bg-blue-50 dark:hover:bg-gray-800 w-full md:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiLinkedin className="w-7 h-7" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.gofundme.com/f/whisper-health-ai-support-for-mental-wellness"
            className="flex items-center justify-center gap-3 px-6 py-5 bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 text-lg md:text-xl font-medium transition hover:bg-blue-50 dark:hover:bg-gray-800 w-full md:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiHeart className="w-7 h-7" />
            <span>GoFundMe</span>
          </a>
        </div>
      </div>
    </section>
  );
} 