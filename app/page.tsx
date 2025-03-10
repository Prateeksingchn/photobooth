'use client';

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Camera, Share2, Sparkles, Download, Image, Clock, ChevronRight, Star, Zap, Heart, Film, Polaroid } from "lucide-react";
import { cn } from "@/lib/utils";

// Separate the floating elements generation from render
const generateFloatingElements = () => 
  Array.from({ length: 20 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

// Add this utility function for optimized image loading
const optimizedImages = [
  'https://i.pinimg.com/474x/d2/44/1d/d2441dcdc4c0fa8e17b0804228f21c97.jpg',
  'https://i.pinimg.com/474x/d7/b1/bd/d7b1bd86a753940f7a2ee28d3ed7e7c3.jpg',
  'https://i.pinimg.com/474x/ff/ed/d7/ffedd701013bf09fd0b7dddd2f0221b9.jpg',
  'https://i.pinimg.com/474x/7c/89/5c/7c895c79f21d2565d45a6c6163c032d7.jpg',
].map(src => ({
  src,
  placeholder: src.replace('.jpg', '-blur.jpg'), // Add blur placeholders
}));

export default function Home() {
  // Use state to handle client-side only content
  const [mounted, setMounted] = useState(false);
  const [floatingElements] = useState(() => generateFloatingElements());
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      title: "Stunning Filters",
      description: "Transform your photos with our collection of professional-grade filters",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Instant Sharing",
      description: "Share your memories to social media with a single tap",
      icon: <Share2 className="w-6 h-6 text-white" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Quick Capture",
      description: "Take perfect photos with zero lag and instant preview",
      icon: <Camera className="w-6 h-6 text-white" />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Easy Download",
      description: "Save your photos in high resolution with one click",
      icon: <Download className="w-6 h-6 text-white" />,
      color: "from-rose-500 to-pink-600",
    },
  ];

  // Gallery samples
  const samples = [1, 2, 3, 4, 5, 6];

  // Staggered animation for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Sample images for the film strip
  const sampleImages = [
    'https://i.pinimg.com/474x/d2/44/1d/d2441dcdc4c0fa8e17b0804228f21c97.jpg',
    'https://i.pinimg.com/474x/d2/44/1d/d2441dcdc4c0fa8e17b0804228f21c97.jpg',
    'https://i.pinimg.com/474x/75/03/5b/75035b7654a7401e3e00eea2fd93da27.jpg',
    'https://i.pinimg.com/474x/5e/11/9c/5e119cc6b03c21617dd969db6990b2a9.jpg',
    // Add more sample images
  ];

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate features every 3 seconds
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Simplified Header */}
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
          
          {/* Navigation Links */}
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

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen pt-16 flex items-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-3 py-1 text-xs font-medium bg-white/10 rounded-full border border-white/20">
                  ✨ Your Virtual Photo Studio
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Create 
                <span className="relative mx-3 inline-block">
                  Magical
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 opacity-30 blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
                <br />
                Moments
              </h1>

              <p className="text-lg text-zinc-400 mb-8 max-w-md">
                Transform your browser into a professional photo booth. 
                Capture and share stunning photos instantly.
              </p>

              {/* Simplified Stats */}
              <div className="grid grid-cols-3 gap-8 mb-10 max-w-sm">
                <AnimatedStat number={50} label="K Photos" />
                <AnimatedStat number={10} label="K Users" />
                <AnimatedStat number={4.9} label="Rating" decimal />
              </div>

              {/* Enhanced CTA */}
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/photobooth"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-lg font-medium hover:bg-white/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Start Capturing
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column - Photo Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative lg:h-[600px]"
            >
              {/* Main Polaroid */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 aspect-[4/5]"
                animate={{ rotate: [-2, 2] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="w-full h-full bg-white p-3 rounded-lg shadow-2xl">
                  <div className="w-full h-[85%] bg-zinc-100 rounded overflow-hidden">
                    <motion.img
                      src={optimizedImages[currentImageIndex].src}
                      alt="Photo preview"
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center px-1">
                    <span className="text-zinc-600 text-xs">Just Now</span>
                    <Heart className="w-4 h-4 text-pink-500" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Mini Photos */}
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-32 aspect-square"
                  style={{
                    top: `${20 + index * 30}%`,
                    left: index % 2 ? '15%' : '70%',
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: index * 0.5,
                    repeat: Infinity,
                  }}
                >
                  <div className="w-full h-full bg-white p-2 rounded-lg shadow-lg rotate-3">
                    <img
                      src={optimizedImages[(currentImageIndex + index + 1) % optimizedImages.length].src}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </motion.div>
              ))}

              {/* Film Strip Decoration */}
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-8"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="space-y-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full aspect-square bg-zinc-800 rounded-sm opacity-50" />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </section>

      {/* Features Section with Photo Strip Design */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Capture the Magic</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Everything you need for the perfect photo booth experience
            </p>
          </motion.div>

          <PhotoStripFeatures />
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="py-20 relative bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            A <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Seamless Experience</span>
          </motion.h3>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Quick Setup</h4>
              <p className="text-gray-600">Ready to go in seconds. No complicated configuration needed.</p>
            </motion.div>
            
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Perfect Photos</h4>
              <p className="text-gray-600">Automatic lighting and focus adjustments for studio-quality results.</p>
            </motion.div>
            
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fun Filters</h4>
              <p className="text-gray-600">Express yourself with our collection of creative filters and effects.</p>
            </motion.div>
            
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Easy Sharing</h4>
              <p className="text-gray-600">Share directly to your favorite social platforms with one tap.</p>
            </motion.div>
            
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Instant Download</h4>
              <p className="text-gray-600">Save your photos in high resolution with a single click.</p>
            </motion.div>
            
            <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Photo Gallery</h4>
              <p className="text-gray-600">Browse all your photos in our beautifully designed gallery view.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className="py-20 relative bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Gallery</span> of Memories
            </h3>
            <p className="text-gray-600">See what others have created with SnapBooth. Join the community and start capturing your moments today.</p>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {samples.map((sample, index) => (
              <motion.div
                key={sample}
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(/api/placeholder/${400 + index * 10}/${400 + index * 10})` }} 
                />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link 
              href="/photobooth" 
              className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="w-5 h-5" />
              <span className="relative z-10">Start Capturing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="p-12 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Capture Your Moments?</h3>
              <p className="text-white/80 text-lg mb-8">Join thousands of users who are already creating memories with SnapBooth.</p>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/photobooth" 
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium bg-white text-purple-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <Camera className="w-5 h-5" />
                  <span>Try Photo Booth</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                SnapBooth
              </h1>
            </div>
            
            <div className="text-sm text-gray-500">
              Built with Next.js 15 and TailwindCSS | Made with ❤️ by Prateek
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating Action Button for mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 md:hidden"
      >
        <Link
          href="/photobooth"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Camera className="w-6 h-6" />
        </Link>
      </motion.div>
      
      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </main>
  );
}

// Move components that use client-side features to separate components
const FloatingParticle = ({ delay = 0 }) => {
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

// Separate the AnimatedStat component
const AnimatedStat = ({ number, label, decimal = false }) => {
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
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
};

const TestimonialSlider = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Photographer",
      content: "The best photo booth app I've ever used. The filters are amazing!",
      avatar: "/path/to/avatar1.jpg",
    },
    // Add more testimonials...
  ];

  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Add testimonial slider content */}
        </motion.div>
      </div>
    </section>
  );
};

// Add more new components as needed...

// Add these new components
const PhotoStripFeatures = () => {
  const features = [
    {
      title: "Professional Filters",
      description: "Transform your photos with our collection of stunning filters",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "Instant Sharing",
      description: "Share your memories directly to social media",
      icon: <Share2 className="w-6 h-6" />,
    },
    // Add more features...
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-8 rounded-xl bg-zinc-900 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-zinc-400">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};