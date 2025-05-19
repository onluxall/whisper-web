"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ParallaxSectionProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
};

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const getTransform = () => {
    switch (direction) {
      case "up":
        return useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
      case "down":
        return useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
      case "left":
        return useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
      case "right":
        return useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
      default:
        return useTransform(scrollYProgress, [0, 1], [0, 0]);
    }
  };

  const y = direction === "up" || direction === "down" ? getTransform() : 0;
  const x = direction === "left" || direction === "right" ? getTransform() : 0;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y, x }}
        className="w-full h-full"
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
} 