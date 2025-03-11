'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Permanent_Marker } from "next/font/google";

const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
});

const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative pt-[280px] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020817] w-full", className)}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-[#06b6d4] via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#06b6d4] [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#06b6d4] opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#06b6d4] blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-[#06b6d4]"
        ></motion.div>
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950"></div>
      </div>

      {children}
    </div>
  );
};

export const Hero = () => {
  return (
    <LampContainer>
      <div className="relative h-auto py-10 z-50 flex flex-col items-center px-5 max-w-5xl mx-auto -mt-[120px]">
        {/* Main Content */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.1]"
          >
            Turn moments into
            <br />
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
              memories instantly
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Step into our virtual photo booth and create picture-perfect memories. 
            Add fun filters, strike a pose, and share your photos instantly with friends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="pt-4"
          >
            <Link
              href="/photobooth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:opacity-90 transition-opacity"
            >
              <span>Open SnapBooth</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Polaroid Strip Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
          className="mt-20 flex gap-8 justify-center"
        >
          {/* Polaroid 1 */}
          <motion.div
            initial={{ rotate: -6 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="bg-white p-2 shadow-xl w-[220px]"
            style={{ transform: "rotate(-6deg)" }}
          >
            <div className="aspect-[3/4] bg-gray-100 mb-3">
              <img 
                src="https://i.pinimg.com/474x/83/23/1e/83231e060e6c0a3a5162bc03945063c4.jpg" 
                alt="Portrait 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`text-center text-sm text-gray-600 ${marker.className} -rotate-2`}>
              Perfect Moments
            </div>
          </motion.div>

          {/* Polaroid 2 */}
          <motion.div
            initial={{ rotate: 0, y: -10 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -10 }}
            className="bg-white p-2 shadow-xl w-[220px]"
          >
            <div className="aspect-[3/4] bg-gray-100 mb-3">
              <img 
                src="https://i.pinimg.com/474x/69/61/6f/69616fb2175f240d6c7a00e4ec4ba153.jpg" 
                alt="Portrait 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`text-center text-sm text-gray-600 ${marker.className} rotate-1`}>
              Instant Magic
            </div>
          </motion.div>

          {/* Polaroid 3 */}
          <motion.div
            initial={{ rotate: 6 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="bg-white p-2 shadow-xl w-[220px]"
            style={{ transform: "rotate(6deg)" }}
          >
            <div className="aspect-[3/4] bg-gray-100 mb-3">
              <img 
                src="https://i.pinimg.com/474x/ec/ba/65/ecba65e04311b8f3e4f77f4e07b49b78.jpg" 
                alt="Portrait 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`text-center text-sm text-gray-600 ${marker.className} -rotate-1`}>
              Stunning Filters
            </div>
          </motion.div>
        </motion.div>
      </div>
    </LampContainer>
  );
};
