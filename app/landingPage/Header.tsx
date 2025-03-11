'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2"
        >
          <div className="relative h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
              S
            </span>
          </div>
          <span className="text-lg font-semibold text-white">
            SnapBooth
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/features" 
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/gallery" 
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/photobooth"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            Open Studio
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};