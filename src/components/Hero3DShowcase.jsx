import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Bot, 
  Check, 
  Copy, 
  FileText, 
  Sparkles, 
  Send,
  Layers,
  Code2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';

/**
 * 3D Autonomous Product Showcase Hero Component
 * 
 * Modern 3D SaaS Landing Page:
 * - Two-column desktop layout (headline & CTAs on the left, self-playing 3D scene on the right).
 * - Autonomous looping animation (not manual):
 *     Stage 1 (0s - 3.5s):   Document upload & vector indexing progress.
 *     Stage 2 (3.5s - 7.5s): Widget generation & 1-line embed script creation.
 *     Stage 3 (7.5s - 15s):  Widget appears in bottom-right corner of business website,
 *                            expands, customer asks question, and AI answers with citations.
 * - Interactive 3D perspective tilt on mouse movement.
 * - Zero video player controls (no play/pause, no scrubber, no .mp4 chrome).
 */
export default function Hero3DShowcase({ onGetStarted, onSignIn }) {
  const [currentTime, setCurrentTime] = useState(0); // 0 to 15s
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const TOTAL_CYCLE = 15; // 15 seconds full loop

  // Continuous autonomous animation clock (updates every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        if (next >= TOTAL_CYCLE) return 0;
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 3D Parallax tilt on mouse hover
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Autonomous Sequence Phases:
  // Phase 1: 0s - 3.5s -> Document Upload & Indexing
  // Phase 2: 3.5s - 7.5s -> Widget Generation & Embed Code
  // Phase 3: 7.5s - 15.0s -> Live Chatbot on Website
  const currentStage = currentTime < 3.5 ? 1 : currentTime < 7.5 ? 2 : 3;

  // Stage 1 sub-states
  const docIndexProgress = Math.min(100, Math.floor((currentTime / 2.8) * 100));

  // Stage 3 sub-states
  const isWidgetExpanded = currentTime >= 8.2;
  const showUserQuestion = currentTime >= 9.6;
  const isAiTyping = currentTime >= 10.0 && currentTime < 11.2;
  const showAiAnswer = currentTime >= 11.2;

  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* TWO-COLUMN HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ================= LEFT COLUMN: MESSAGING & CTAS ================= */}
        <div className="lg:col-span-5 text-left space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Customer Support, Reimagined</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.14]">
            Your business knowledge. One intelligent conversation.
          </h1>

          {/* Product Description */}
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-lg">
            Turn your company documents into an intelligent AI chatbot widget for your website. Upload your guides, customize your widget, and deliver instant answers to your visitors.
          </p>

          {/* Primary Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold text-black bg-[#F97316] hover:bg-[#EA580C] rounded-md transition-all shadow-[0_2px_16px_rgba(249,115,22,0.4)] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
          </div>

          {/* 3 Core Highlights */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/[0.08] text-zinc-400 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>1-line embed script</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Grounded in your PDFs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Custom brand colors</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: 3D AUTONOMOUS PRODUCT VISUALIZATION ================= */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="w-full relative transition-transform duration-300 ease-out select-none"
            style={{
              perspective: '1200px',
              transform: isHovered
                ? `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`
                : 'rotateY(0deg) rotateX(0deg)'
            }}
          >
            
            {/* FLOATING TOP BADGE: Active Automation Status */}
            <div className="absolute -top-3.5 left-4 sm:left-6 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#121218]/95 border border-white/[0.14] shadow-2xl backdrop-blur-md text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">
                {currentStage === 1 && 'Step 1: Ingesting & Grounding Knowledge'}
                {currentStage === 2 && 'Step 2: Generating Embeddable Widget'}
                {currentStage === 3 && 'Step 3: Live Widget on Business Site'}
              </span>
            </div>

            {/* MAIN BUSINESS WEBSITE MOCKUP SHELL */}
            <div className="rounded-xl border border-white/[0.14] bg-[#0A0A0E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden">
              
              {/* Browser Window Chrome */}
              <div className="px-4 py-2.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>

                {/* URL Bar */}
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
                  <span className="text-emerald-400">https://</span>
                  <span className="text-zinc-200">acme-corp.com</span>
                </div>

                <div className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>3D Live</span>
                </div>
              </div>

              {/* Sample Business Website Canvas */}
              <div className="relative min-h-[390px] sm:min-h-[430px] p-6 sm:p-8 bg-[#07070A] flex flex-col justify-between overflow-hidden">
                
                {/* Mock Website Navigation */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] opacity-75">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded bg-[#F97316] text-black font-extrabold text-[10px] flex items-center justify-center">A</div>
                    <span className="text-xs font-bold text-white tracking-wider">ACME CORP</span>
                  </div>
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-zinc-400">
                    <span className="text-zinc-200">Solutions</span>
                    <span>Pricing</span>
                    <span>Documentation</span>
                  </div>
                </div>

                {/* Mock Website Hero Content */}
                <div className="my-auto py-3 max-w-sm space-y-2.5 opacity-60">
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-white/[0.05] border border-white/[0.08]">
                    Next-Gen Cloud Platform
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    Scale your infrastructure without friction.
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Deploy applications globally with sub-millisecond response and automated scaling.
                  </p>
                  <div className="pt-1 flex items-center space-x-2">
                    <div className="px-3 py-1 rounded bg-white/20 text-white text-[10px] font-medium">Explore Solutions</div>
                    <div className="px-3 py-1 rounded border border-white/10 text-zinc-400 text-[10px]">Documentation</div>
                  </div>
                </div>

                {/* ================= STAGE 1 OVERLAY: DOCUMENT UPLOAD & INDEXING ================= */}
                {currentStage === 1 && (
                  <div className="absolute inset-x-6 top-16 bottom-16 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-full max-w-sm p-4 rounded-xl bg-[#0F0F16]/95 border border-white/[0.14] shadow-2xl backdrop-blur-md space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">Acme_Handbook.pdf</div>
                            <div className="text-[10px] font-mono text-zinc-400">1.4 MB • 24 Pages</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-emerald-400">{docIndexProgress}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/[0.08]">
                        <div 
                          className="h-full bg-emerald-400 rounded-full transition-all duration-150"
                          style={{ width: `${docIndexProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span>{docIndexProgress < 100 ? 'Embedding vector citations...' : 'Ready for chatbot deployment'}</span>
                        {docIndexProgress >= 100 && (
                          <span className="text-emerald-400 flex items-center font-semibold">
                            <Check className="w-3 h-3 mr-0.5" /> Indexed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STAGE 2 OVERLAY: WIDGET GENERATION & CODE ================= */}
                {currentStage === 2 && (
                  <div className="absolute inset-x-6 top-16 bottom-16 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-full max-w-md p-4 rounded-xl bg-[#0F0F16]/95 border border-white/[0.14] shadow-2xl backdrop-blur-md space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white">
                            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-xs font-semibold text-white">Chatbot Widget Configured</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                          <Check className="w-3 h-3 mr-1" /> Ready
                        </span>
                      </div>

                      {/* Code Snippet Box */}
                      <div className="p-2.5 rounded-lg bg-black border border-white/[0.08] font-mono text-[11px] text-zinc-300 space-y-1">
                        <div className="text-[9px] text-zinc-500">// Paste into your website &lt;head&gt;</div>
                        <div className="text-emerald-400">
                          &lt;script src=&quot;https://cdn.knowra.ai/widget.js&quot; data-key=&quot;acme_demo&quot; async&gt;&lt;/script&gt;
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                        <div className="flex items-center space-x-2">
                          <span>Theme: <strong className="text-white">Dark</strong></span>
                          <span>•</span>
                          <span>Position: <strong className="text-white">Bottom Right</strong></span>
                        </div>
                        <span className="text-zinc-300">Deploying to site...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STAGE 3: LIVE CHATBOT WIDGET IN BOTTOM-RIGHT CORNER ================= */}
                <div 
                  className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end z-20 transition-all duration-500 ${
                    currentStage === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  
                  {/* EXPANDED CHAT PANEL */}
                  {isWidgetExpanded && (
                    <div className="w-[320px] sm:w-[360px] rounded-2xl bg-[#0F0F16] border border-white/[0.16] shadow-[0_20px_50px_rgba(0,0,0,0.9)] mb-3 overflow-hidden text-left flex flex-col animate-fadeIn">
                      
                      {/* Widget Header */}
                      <div className="px-4 py-3 bg-[#171722] border-b border-white/[0.08] flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#F97316] text-black flex items-center justify-center">
                            <Bot className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-semibold text-white">Acme Assistant</div>
                            <div className="text-[10px] font-mono text-emerald-400 flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                              Online • Ready
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">Knowra AI</div>
                      </div>

                      {/* Chat Messages Body */}
                      <div className="p-3.5 space-y-3 max-h-[260px] text-xs font-sans">
                        
                        {/* Initial Greeting */}
                        <div className="flex flex-col items-start animate-fadeIn">
                          <div className="p-3 rounded-xl bg-[#191924] text-zinc-200 border border-white/[0.06] text-xs leading-relaxed">
                            Hello! I am your Acme assistant. How can I help you today?
                          </div>
                        </div>

                        {/* Customer Question */}
                        {showUserQuestion && (
                          <div className="flex flex-col items-end animate-fadeIn">
                            <div className="p-3 rounded-xl bg-[#F97316] text-black font-semibold text-xs leading-relaxed shadow-sm">
                              What are your business hours and refund terms?
                            </div>
                          </div>
                        )}

                        {/* AI Typing Indicator */}
                        {isAiTyping && (
                          <div className="flex items-center space-x-1.5 p-2 bg-[#191924] rounded-lg w-16 border border-white/[0.06] animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        )}

                        {/* AI Grounded Answer with Citation */}
                        {showAiAnswer && (
                          <div className="flex flex-col items-start animate-fadeIn space-y-1">
                            <div className="p-2.5 rounded-xl bg-[#191924] text-zinc-200 border border-white/[0.06] text-[11px] leading-relaxed">
                              We are open Monday through Friday, 9:00 AM – 6:00 PM EST. Full refunds are processed within 14 days of purchase.
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400 flex items-center pl-1">
                              <FileText className="w-2.5 h-2.5 mr-1" />
                              Source: Acme_Handbook.pdf • Page 4
                            </span>
                          </div>
                        )}

                      </div>

                      {/* Mock Input Bar */}
                      <div className="p-2 border-t border-white/[0.08] bg-[#12121A] flex items-center space-x-1.5 opacity-75">
                        <div className="flex-grow bg-black/60 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-zinc-400">
                          {showAiAnswer ? 'Ask another question...' : 'Listening...'}
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#F97316] text-black">
                          <Send className="w-3 h-3 text-black" />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* FLOATING LAUNCHER BUTTON IN BOTTOM-RIGHT */}
                  <div className="w-12 h-12 rounded-full bg-[#F97316] text-black flex items-center justify-center shadow-[0_8px_25px_rgba(249,115,22,0.45)] relative">
                    <Bot className="w-5 h-5 text-black" />
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
                  </div>

                </div>

              </div>

              {/* Bottom Autonomous Timeline Progress Bar */}
              <div className="px-4 py-2 bg-[#101016] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center space-x-1 sm:space-x-3 text-[11px]">
                  <span className={`px-2 py-0.5 rounded transition-colors ${currentStage === 1 ? 'bg-white/10 text-white font-semibold' : 'text-zinc-600'}`}>
                    1. Ingest PDF
                  </span>
                  <ChevronRight className="w-3 h-3 text-zinc-700 hidden sm:inline" />
                  <span className={`px-2 py-0.5 rounded transition-colors ${currentStage === 2 ? 'bg-white/10 text-white font-semibold' : 'text-zinc-600'}`}>
                    2. Generate Widget
                  </span>
                  <ChevronRight className="w-3 h-3 text-zinc-700 hidden sm:inline" />
                  <span className={`px-2 py-0.5 rounded transition-colors ${currentStage === 3 ? 'bg-white/10 text-white font-semibold' : 'text-zinc-600'}`}>
                    3. Live Chatbot
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F97316] transition-all duration-100 rounded-full"
                      style={{ width: `${(currentTime / TOTAL_CYCLE) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500">Auto-Loop</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
