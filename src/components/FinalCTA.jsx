import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * FinalCTA Component
 * 
 * Required copy:
 * Headline: "Let your knowledge do more."
 * Supporting text: "Build an AI assistant around what your business already knows."
 * Button: "Create your assistant."
 */
export default function FinalCTA({ onGetStarted }) {
  return (
    <section className="py-24 sm:py-32 border-t border-white/[0.08] bg-black relative overflow-hidden">
      
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#F97316]/[0.08] rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Subtle pill */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>DEPLOY IN MINUTES</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Let your knowledge do more.
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Build an AI assistant around what your business already knows.
        </p>

        {/* Primary CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-black bg-[#F97316] hover:bg-[#EA580C] rounded-xl transition-all shadow-[0_4px_30px_rgba(249,115,22,0.45)] hover:shadow-[0_6px_35px_rgba(249,115,22,0.65)] active:scale-[0.98] group cursor-pointer"
          >
            <span>Create your assistant.</span>
            <ArrowRight className="w-4 h-4 ml-2.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            100% Document Grounded
          </span>
          <span className="flex items-center text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            Zero Setup Fees
          </span>
          <span className="flex items-center text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
            1-Line Script Integration
          </span>
        </div>

      </div>
    </section>
  );
}
