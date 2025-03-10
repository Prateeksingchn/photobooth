'use client';

import { motion } from "framer-motion";
import { Share2, Sparkles } from "lucide-react";

export const PhotoStripFeatures = () => {
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