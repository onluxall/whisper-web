"use client";

import { motion } from "framer-motion";
import ScrollAnimation from "../ui/ScrollAnimation";
import ParallaxSection from "../ui/ParallaxSection";
import AnimatedText from "../ui/AnimatedText";
import { FiShield, FiClock, FiUser } from "react-icons/fi";

const features = [
  {
    title: "Secure & Private",
    description: "Your conversations are encrypted and completely confidential",
    icon: <FiShield className="w-full h-full" />,
  },
  {
    title: "24/7 Support",
    description: "Get help whenever you need it, day or night",
    icon: <FiClock className="w-full h-full" />,
  },
  {
    title: "Personalized Care",
    description: "AI-powered conversations tailored to your needs",
    icon: <FiUser className="w-full h-full" />,
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Background gradients with subtle animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/70 via-transparent to-transparent dark:from-emerald-900/20 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-emerald-200/60 via-transparent to-transparent dark:from-teal-900/20 animate-pulse-slow [animation-delay:0.5s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-cyan-200/50 via-transparent to-transparent dark:from-blue-900/20 animate-pulse-slow [animation-delay:1s]" />
        {/* Add a gradient overlay for smooth transition to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black opacity-90" />
      </div>

      {/* Subtle parallax background elements */}
      <ParallaxSection speed={0.2} direction="up" className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
      </ParallaxSection>
      <ParallaxSection speed={0.15} direction="down" className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
      </ParallaxSection>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation animation="fadeUp" threshold={0.2} className="mb-6">
            <AnimatedText
              text="Start Your Journey"
              type="heading"
              animation="typing"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
              delay={0.2}
            />
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={0.3} threshold={0.2} className="mb-8">
            <AnimatedText
              text="AI-powered mental health support, available 24/7"
              type="subheading"
              animation="slideUp"
              className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            />
          </ScrollAnimation>

          <ScrollAnimation animation="scaleUp" delay={0.4} threshold={0.2} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="btn-primary group relative overflow-hidden"
            >
              <span className="relative z-10">Sign Up Free</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              href="#about"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="btn-secondary group relative overflow-hidden"
            >
              <span className="relative z-10">How It Works</span>
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={0.5} threshold={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 rounded-xl bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm border border-blue-100/50 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className="w-12 h-12 mb-4 mx-auto text-blue-500 dark:text-emerald-400"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-700 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
} 