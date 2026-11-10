import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Hero3DBackground from './Hero3DBackground';

/**
 * CinematicHero Component
 * 
 * Full-screen cinematic AI SaaS hero section:
 * - Spans full viewport (100vh on desktop).
 * - Full-screen background playing Knowra's real frontend workflow autonomously.
 * - Left side text & CTA with exact required copy and crystal-clear contrast.
 * - Clean bottom with zero video playing symbols, scrubbers, or clutter.
 */
export default function CinematicHero({ onGetStarted, onSeeHowItWorks }) {
  const handleSeeHowItWorks = () => {
    if (onSeeHowItWorks) {
      onSeeHowItWorks();
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen lg:h-screen w-full flex flex-col justify-center overflow-hidden bg-[#030305]"
    >
      
      {/* 1. FULL-SCREEN BACKGROUND PLAYING REAL FRONTEND (EDGE-TO-EDGE) */}
      <Hero3DBackground />

      {/* 2. FOREGROUND HERO CONTENT (LEFT SIDE FOCUS) */}
      <div className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 flex flex-col justify-center h-full">
        
        <div className="max-w-xl space-y-6">
          
          {/* Eyebrow */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-xs font-mono text-[#F97316] tracking-wider uppercase backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              <span>AI-POWERED BUSINESS KNOWLEDGE</span>
            </div>
          </div>

          {/* Headline - Exact required copy with elegant typography & spacing */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Give your business<br />a voice.
          </h1>

          {/* Description - Exact required copy */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-lg leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Turn your business knowledge into an AI assistant that answers customer questions, lives on your website, and helps you understand what customers need.
          </p>

          {/* Primary & Secondary Action Buttons (Zero video play symbols) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-black bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition-all shadow-[0_4px_25px_rgba(249,115,22,0.45)] hover:shadow-[0_6px_30px_rgba(249,115,22,0.6)] active:scale-[0.98] group cursor-pointer"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleSeeHowItWorks}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-zinc-200 hover:text-white bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/35 rounded-lg transition-all backdrop-blur-md shadow-lg group cursor-pointer"
            >
              <span>See how it works</span>
              <ChevronDown className="w-4 h-4 ml-1.5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
