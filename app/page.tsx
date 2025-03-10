'use client';

import { useState, useEffect } from "react";
import { Header } from "./landingPage/Header";
import { Hero } from "./landingPage/Hero";
import { Features } from "./landingPage/Features";
import { Gallery } from "./landingPage/Gallery";
import { Footer } from "./landingPage/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Header />
      <Hero />
      <Features />
      <Gallery />
      <Footer />
    </main>
  );
}
