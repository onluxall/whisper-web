"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

type ScrollAnimationProps = {
  children: React.ReactNode;
  animation?: "fadeUp" | "fadeIn" | "scaleUp" | "slideIn" | "stagger";
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
};

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

export default function ScrollAnimation({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.5,
  className = "",
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 