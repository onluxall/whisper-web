"use client";

import { useState, useEffect } from "react";
import { FiMail, FiCheckCircle, FiUser, FiPhone, FiMessageSquare, FiUsers, FiTrendingUp, FiHeart, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import ScrollAnimation from "../ui/ScrollAnimation";

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
  const [signupCount, setSignupCount] = useState<number | null>(null);
  const [countError, setCountError] = useState<string | null>(null);

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
        
        // Refresh the count after successful submission
        const countResponse = await fetch('/api/waitlist/count');
        if (countResponse.ok) {
          const countData = await countResponse.json();
          setSignupCount(countData.count);
        }
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
    <section id="waitlist" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700/50">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                Join the Waitlist
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
                Be among the first to experience our revolutionary AI health assistant. Sign up now to get early access and exclusive benefits.
              </p>
              
              <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>

              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-red-600 dark:text-red-400"
                >
                  {errorMessage}
                </motion.p>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <p className="text-sm text-green-800 dark:text-green-400">
                    Thank you for joining our waitlist! We'll be in touch soon.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
                Why Join the Waitlist?
              </h3>
              
              <div className="space-y-6 md:space-y-8">
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4 md:gap-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 