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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('https://formspree.io/f/xpzvnqkz', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
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

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      minLength={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Why do you want to join? *
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      required
                      minLength={10}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Tell us why you're interested in joining Whisper Health"
                    />
                  </div>

                  <input type="hidden" name="_subject" value="New Waitlist Signup" />
                  <input type="hidden" name="_captcha" value="false" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                  </button>
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