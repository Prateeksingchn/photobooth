'use client';

import Link from "next/link";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-0.5">
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold">SnapMagic</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#gallery" className="text-sm text-zinc-400 hover:text-white transition-colors">Gallery</a>
          <Link
            href="/photobooth"
            className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Open Studio
          </Link>
        </nav>
      </div>
    </header>
  );
}; 