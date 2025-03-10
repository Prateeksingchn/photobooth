'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedStatProps {
  number: number;
  label: string;
  decimal?: boolean;
}

export const AnimatedStat = ({ number, label, decimal = false }: AnimatedStatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= number) {
        current = number;
        clearInterval(timer);
      }
      setCount(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, number]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
        {decimal ? count.toFixed(1) : Math.round(count)}
      </div>
      <div className="text-sm text-zinc-400">{label}</div>
    </motion.div>
  );
}; 