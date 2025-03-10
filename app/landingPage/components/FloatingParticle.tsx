'use client';

import { motion } from "framer-motion";

interface FloatingParticleProps {
  delay?: number;
}

export const FloatingParticle = ({ delay = 0 }: FloatingParticleProps) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -20,
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
    />
  );
}; 