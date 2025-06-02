"use client";

import { useState } from "react";
import { FiMail, FiCheckCircle, FiUser, FiPhone, FiMessageSquare, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import ScrollAnimation from "../ui/ScrollAnimation";
import { useWaitlistCount } from '@/hooks/useWaitlistCount';

console.log("useState:", typeof useState);
console.log("FiMail:", typeof FiMail);
console.log("FiCheckCircle:", typeof FiCheckCircle);
console.log("FiUser:", typeof FiUser);
console.log("FiPhone:", typeof FiPhone);
console.log("FiMessageSquare:", typeof FiMessageSquare);

interface FormData {
  name: string;
  email: string;
  phone?: string;
  reason: string;
}

// Define possible form states
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const reasons = [
  "I'm looking for mental health support",
  "I'm a mental health professional",
  "I'm interested in AI and mental health",
  "I want to help shape the future of mental healthcare",
  "I'm a researcher in mental health",
  "I'm a healthcare provider",
  "I'm curious about the technology",
  "Other"
];

export default function Waitlist() {
  const [status, setStatus] = useState<FormStatus>('idle'); // Combined status state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Keep error message separate
  const { count: signupCount, error: countError } = useWaitlistCount();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting'); // Set status to submitting
    setErrorMessage(null); // Clear any previous error message

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim() || '',
        reason: formData.get('reason')?.toString().trim()
      };

      // Validate required fields
      if (!data.name || data.name.length < 2) {
        throw new Error('Please enter a valid name (minimum 2 characters)');
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!data.reason) {
        throw new Error('Please select a reason for joining');
      }

      console.log('Submitting form data:', data);

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);
      
      if (response.ok) {
        console.log('Form submitted successfully:', responseData);
        // Reset the form
        const form = e.currentTarget;
        if (form) {
          form.reset();
        } else {
          console.error('Form element is null, cannot reset.');
        }
        setStatus('success'); // Set status to success
      } else {
        console.error('Form submission failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData: responseData
        });
        const message = responseData.error || responseData.details || 'Failed to submit form. Please try again.';
        setErrorMessage(message); // Set the error message
        setStatus('error'); // Set status to error
      }
    } catch (err) {
      console.error('Form submission error:', err);
      const message = err instanceof Error ? err.message : 'Failed to submit form. Please try again.';
      setErrorMessage(message); // Set the error message
      setStatus('error'); // Set status to error
    } finally {
      // Note: status is already set to 'success' or 'error' above
      // No need to set submitting to false here as status handles it.
    }
  };

  return (
    <section id="waitlist" className="relative py-32 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-emerald-500/5 to-teal-500/5 dark:from-blue-500/10 dark:via-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollAnimation animation="fadeUp" threshold={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Join the Waitlist
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Be among the first to experience Whisper Health. Fill out the form below to get early access and exclusive benefits.
            </p>
          </ScrollAnimation>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Form card */}
          <ScrollAnimation animation="fadeUp" threshold={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-8">
                  {countError ? (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      Error: {countError}
                    </div>
                  ) : signupCount !== null ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 rounded-full text-blue-600 dark:text-blue-300 text-sm font-medium"
                    >
                      <FiUsers className="w-4 h-4" />
                      <span>{signupCount} people waiting</span>
                    </motion.div>
                  ) : (
                    <div className="text-sm text-gray-500">Loading count...</div>
                  )}
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      minLength={2}
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiPhone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="Your phone number (optional)"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiMessageSquare className="h-5 w-5" />
                    </div>
                    <select
                      id="reason"
                      name="reason"
                      required
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="">Select your reason for interest</option>
                      {reasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <input type="hidden" name="_subject" value="New Waitlist Signup" />
                  <input type="hidden" name="_captcha" value="false" />

                  {/* Display Error Message */}
                  {status === 'error' && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMessage}
                      </div>
                    </motion.div>
                  )}

                  {/* Display Success Message */}
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 text-sm text-center bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800"
                    >
                      <FiCheckCircle className="text-xl flex-shrink-0" />
                      <span>Thank you for joining our waitlist! We'll be in touch soon.</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'submitting'}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-600 dark:from-emerald-600 dark:via-teal-500 dark:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Join Waitlist"
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </ScrollAnimation>

          {/* Benefits section */}
          <ScrollAnimation animation="fadeUp" delay={0.2} threshold={0.2}>
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Join the Waitlist?
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Early Access",
                    description: "Be among the first to experience our AI-powered mental health support platform.",
                    icon: <FiTrendingUp className="w-6 h-6" />,
                  },
                  {
                    title: "Exclusive Benefits",
                    description: "Get special perks and features when we launch.",
                    icon: <FiHeart className="w-6 h-6" />,
                  },
                  {
                    title: "Shape the Future",
                    description: "Help us build a better mental health support system for everyone.",
                    icon: <FiMessageSquare className="w-6 h-6" />,
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="text-blue-500 dark:text-emerald-400 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
} 