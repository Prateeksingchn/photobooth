'use client';

import { motion } from "framer-motion";
import { Camera, Download, Share2, Grid2X2, Image, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Grid2X2 className="w-5 h-5" />,
    title: "Photo Strip",
    description: "Classic 4-shot photo booth sequence",
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: "Polaroid Style",
    description: "Iconic instant photo format",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Vintage Filters",
    description: "Retro-inspired photo effects",
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Live Preview",
    description: "Real-time filter preview",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Quick Share",
    description: "Instant social sharing",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "Download",
    description: "Save in high quality",
  }
];

export const Features = () => {
  return (
    <section className="py-16 bg-[#4D5B75] relative overflow-hidden">
      {/* Enhanced gradient background overlay - darker */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] to-[#4D5B75] opacity-95" />
      
      {/* More visible dot pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(255, 255, 255, 0.35) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '24px 24px',
          opacity: '0.9'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-white">
            Capture memories in
            <span className="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent ml-2">
              classic style
            </span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-4 rounded-xl border border-[#5E6C86]/60 bg-[#5E6C86]/40 hover:bg-[#5E6C86]/60 transition-all backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-medium">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-200">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />
    </section>
  );
}; 