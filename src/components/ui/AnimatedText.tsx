"use client";

import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  type?: "heading" | "subheading" | "paragraph";
  animation?: "typing" | "fadeIn" | "slideUp" | "wave";
  className?: string;
  delay?: number;
};

const textVariants = {
  typing: {
    hidden: { 
      width: "0%",
      opacity: 0
    },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        width: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        },
        opacity: {
          duration: 0.15,
          ease: "easeOut"
        }
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  wave: {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: [0, -8, 0],
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  },
};

const textStyles = {
  heading: "text-4xl md:text-5xl font-bold",
  subheading: "text-2xl md:text-3xl font-semibold",
  paragraph: "text-base md:text-lg",
};

export default function AnimatedText({
  text,
  type = "paragraph",
  animation = "fadeIn",
  className = "",
  delay = 0,
}: AnimatedTextProps) {
  const words = text.split(" ");

  if (animation === "wave") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={textVariants.wave}
            initial="hidden"
            animate="visible"
            className={textStyles[type]}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animation === "typing") {
    return (
      <motion.div
        variants={textVariants.typing}
        initial="hidden"
        animate="visible"
        className={`relative inline-block ${textStyles[type]} ${className}`}
      >
        <div className="relative inline-flex items-center">
          <span className="whitespace-nowrap text-current">
            {text}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={textVariants[animation]}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={`${textStyles[type]} ${className}`}
    >
      {text}
    </motion.div>
  );
} 