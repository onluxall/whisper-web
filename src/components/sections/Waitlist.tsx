"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiCheckCircle, FiUser, FiPhone, FiMessageSquare, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import ScrollAnimation from "../ui/ScrollAnimation";

console.log("useState:", typeof useState);
console.log("useForm:", typeof useForm);
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

const reasons = [
  "Personal mental health support",
  "Professional interest",
  "Research purposes",
  "Other",
];

export default function Waitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupCount, setSignupCount] = useState<number | null>(null);
  const [countError, setCountError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  // Fetch signup count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        setCountError(null);
        console.log('Fetching waitlist count...');
        const response = await fetch('/api/waitlist/count');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch count');
        }
        const data = await response.json();
        console.log('Waitlist count response:', data);
        
        if (data.count !== undefined) {
          console.log('Setting count to:', data.count);
          setSignupCount(data.count);
        } else {
          throw new Error('Count is undefined in response');
        }
      } catch (error) {
        console.error('Error fetching signup count:', error);
        setCountError(error instanceof Error ? error.message : 'Failed to fetch count');
        setSignupCount(null);
      }
    };

    fetchCount();
    // Refresh count every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Add a debug log for render
  console.log('Current signup count:', signupCount);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3500);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Form submission error:', err);
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      disabled={isSubmitting || submitted}
                    />
                    {errors.name && (
                      <span className="text-red-500 dark:text-red-400 text-sm mt-1 block">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      disabled={isSubmitting || submitted}
                    />
                    {errors.email && (
                      <span className="text-red-500 dark:text-red-400 text-sm mt-1 block">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Phone Field (Optional) */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiPhone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone number (optional)"
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      {...register("phone", {
                        pattern: { value: /^[+\d\s\-()]*$/, message: "Enter a valid phone number (e.g. +1 (555) 123-4567)" } })}
                      disabled={isSubmitting || submitted}
                    />
                    {errors.phone && (
                      <span className="text-red-500 dark:text-red-400 text-sm mt-1 block">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Reason Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400 transition-colors">
                      <FiMessageSquare className="h-5 w-5" />
                    </div>
                    <select
                      className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-400 outline-none bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white appearance-none transition-all duration-200"
                      {...register("reason", {
                        required: "Please select a reason",
                      })}
                      disabled={isSubmitting || submitted}
                    >
                      <option value="">Select your reason for interest</option>
                      {reasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    {errors.reason && (
                      <span className="text-red-500 dark:text-red-400 text-sm mt-1 block">{errors.reason.message}</span>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                      {error}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-600 dark:from-emerald-600 dark:via-teal-500 dark:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting || submitted}
                  >
                    {isSubmitting ? (
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

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-6 text-blue-500 dark:text-emerald-400 font-medium justify-center"
                  >
                    <FiCheckCircle className="text-2xl" /> Thank you! We'll be in touch soon.
                  </motion.div>
                )}
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