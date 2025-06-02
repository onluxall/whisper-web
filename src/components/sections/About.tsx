"use client";

import { motion } from "framer-motion";
import { FiClock, FiUsers, FiCode } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useWaitlistCount } from '@/hooks/useWaitlistCount';

interface SheetData {
  developmentProgress: string;
  targetLaunch: string;
}

interface WaitlistCount {
  count: number;
}

export default function About() {
  const [stats, setStats] = useState([
    {
      label: "Development Progress",
      value: "Loading...",
      icon: FiCode,
      description: "Core features implemented"
    },
    {
      label: "Waitlist Signups",
      value: "Loading...",
      icon: FiUsers,
      description: "Join our waitlist"
    },
    {
      label: "Target Launch",
      value: "Loading...",
      icon: FiClock,
      description: "Expected release date"
    }
  ]);

  const { count: waitlistCount, error: waitlistError } = useWaitlistCount();

  // Update stats when waitlist count changes
  useEffect(() => {
    setStats(prevStats => [
      prevStats[0], // Keep development progress
      {
        label: "Waitlist Signups",
        value: waitlistError ? "Join Now" : (waitlistCount?.toString() || "Loading..."),
        icon: FiUsers,
        description: waitlistError ? "Be among the first to try" : "People waiting to join"
      },
      prevStats[2] // Keep target launch
    ]);
  }, [waitlistCount, waitlistError]);

  // Fetch development stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching development stats from /api/sheets...');
        const response = await fetch('/api/sheets');
        console.log('Stats response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
        }
        const data: SheetData = await response.json();
        console.log('Raw development stats data:', data);

        if (!data.developmentProgress || !data.targetLaunch) {
          console.error('Missing required stats data:', data);
          throw new Error('Invalid stats data format');
        }

        // Update stats while preserving waitlist count
        setStats(prevStats => [
          {
            label: "Development Progress",
            value: data.developmentProgress,
            icon: FiCode,
            description: "Core features implemented"
          },
          prevStats[1], // Keep existing waitlist count
          {
            label: "Target Launch",
            value: data.targetLaunch,
            icon: FiClock,
            description: "Expected release date"
          }
        ]);
      } catch (error) {
        console.error('Error fetching development stats:', error);
        // Fallback to default development stats if fetch fails
        setStats(prevStats => [
          {
            label: "Development Progress",
            value: "85%",
            icon: FiCode,
            description: "Core features implemented"
          },
          prevStats[1], // Keep existing waitlist count
          {
            label: "Target Launch",
            value: "Q2 2024",
            icon: FiClock,
            description: "Expected release date"
          }
        ]);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon: Your AI Health Assistant
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're building a revolutionary health assistant that will transform how you manage your wellness journey. Join our waitlist to be among the first to experience it.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Development Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What We're Building
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Core Features
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiCode className="w-5 h-5 text-blue-500" />
                  AI-powered health assistant
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiCode className="w-5 h-5 text-blue-500" />
                  Secure and private
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiCode className="w-5 h-5 text-blue-500" />
                  24/7 availability
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiCode className="w-5 h-5 text-blue-500" />
                  Personalized support
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Coming Soon
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiClock className="w-5 h-5 text-blue-500" />
                  Mobile app
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiClock className="w-5 h-5 text-blue-500" />
                  Advanced insights
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiClock className="w-5 h-5 text-blue-500" />
                  Health tracking
                </li>
                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <FiClock className="w-5 h-5 text-blue-500" />
                  Community features
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 