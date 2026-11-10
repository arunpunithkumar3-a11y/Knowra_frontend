import React, { useState } from 'react';
import { 
  UploadCloud, 
  Bot, 
  Globe, 
  Check, 
  FileText, 
  ShieldCheck, 
  Code2, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';

/**
 * HowItWorks Component
 * 
 * Presenting the three exact steps requested:
 * 1. Add your knowledge.
 * 2. Create and test your assistant.
 * 3. Connect it to your website and understand customer questions.
 */
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Add your knowledge.',
      short: 'Upload your business documentation',
      description: 'Upload your company PDF handbook, operations manual, or product specs. Knowra partitions your data into an isolated workspace and indexes the contents for strict semantic retrieval.',
      details: [
        'Supports standard PDF business documents (up to 10 pages)',
        'Automatic semantic section chunking and embedding generation',
        'Isolated tenant domain: your data is never mixed or exposed'
      ],
      icon: UploadCloud,
      badge: 'Step 1 • Ingestion'
    },
    {
      step: '02',
      title: 'Create and test your assistant.',
      short: 'Brand customization and sandbox verification',
      description: 'Configure your assistant in the Widget Studio. Select your brand accent color, customize welcome greetings, and test questions in the Owner Playground to verify citations before going live.',
      details: [
        'Live brand color customization (#F97316 orange, dark slate, deep navy, and more)',
        'Real-time responses with exact page and line citation badges',
        'Strict zero-hallucination guardrails: facts come only from your document'
      ],
      icon: Bot,
      badge: 'Step 2 • Configuration'
    },
    {
      step: '03',
      title: 'Connect it to your website and understand customer questions.',
      short: '1-line embed script and diagnostic analytics',
      description: 'Paste a single lightweight script tag into your website. As visitors ask questions, Knowra answers accurately with citations and groups inquiries into diagnostic topic clusters.',
      details: [
        'Single non-blocking <script> tag for Webflow, Shopify, WordPress, or custom sites',
        'Floating bottom-right launcher with responsive modal expander',
        'Automatic inquiry clustering to uncover customer friction and missing answers'
      ],
      icon: Globe,
      badge: 'Step 3 • Deployment & Insights'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 border-t border-white/[0.08] bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>THREE SIMPLE STEPS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            How it works
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            From company document to an intelligent on-site assistant in three straightforward steps.
          </p>
        </div>

        {/* 3 Step Editorial Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E0E14] border-[#F97316]/50 shadow-[0_12px_36px_rgba(249,115,22,0.15)] ring-1 ring-[#F97316]/30'
                    : 'bg-[#08080C] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#0B0B10]'
                }`}
              >
                <div className="space-y-6">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F97316]">
                      {s.step}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
                      {s.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#F97316] text-black font-bold' : 'bg-white/[0.06] text-zinc-300'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Short */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs font-mono text-[#F97316]">
                      {s.short}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {s.description}
                  </p>

                  {/* Bullet details */}
                  <ul className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono text-zinc-300">
                    {s.details.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Step {s.step} of 03</span>
                  <span className={`flex items-center transition-colors ${isSelected ? 'text-[#F97316] font-semibold' : 'text-zinc-500'}`}>
                    {isSelected ? 'Active Step' : 'Click to highlight'} <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
