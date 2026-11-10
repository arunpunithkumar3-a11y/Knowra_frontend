import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  UploadCloud, 
  Cpu, 
  Palette, 
  MessageSquare, 
  Globe, 
  Check, 
  FileText, 
  CheckCircle2, 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight,
  Lock,
  Terminal,
  Activity,
  Sliders,
  Play,
  Pause
} from 'lucide-react';

/**
 * HeroBackgroundVideo Component
 * 
 * Delivers a FULL-WIDTH, FULL-HEIGHT edge-to-edge cinematic background video experience.
 * Covers the entire hero section behind all foreground copy and navigation.
 * 
 * Demonstrates the 6 stages of Knowra's chatbot creation lifecycle:
 * 0. Create Business Workspace
 * 1. Upload Business Documents
 * 2. Process Documents for Chatbot Use (Vector Grounding)
 * 3. Configure Chatbot Widget
 * 4. Visitor Q&A with Strict Grounded Citations
 * 5. Finished Chatbot on Business Website
 * 
 * Composed so:
 * - Left side remains quiet & dark behind the headline.
 * - Center & right side reveals the rich application interface.
 * - Transitions smoothly between stages with continuous coordinated animations.
 */
export default function HeroBackgroundVideo({ 
  currentStage = 0, 
  onStageChange,
  isPaused = false
}) {
  const [stage, setStage] = useState(currentStage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [stageProgress, setStageProgress] = useState(0); // 0 to 100 within current stage
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Sync external stage changes
  useEffect(() => {
    if (currentStage !== undefined && currentStage !== stage) {
      setStage(currentStage);
      setStageProgress(0);
    }
  }, [currentStage]);

  // Reduced motion preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Coordinated animated stage progress & continuous looping (5 seconds per stage)
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const STAGE_DURATION_MS = 5000;
    const UPDATE_INTERVAL_MS = 50;
    const stepIncrement = (UPDATE_INTERVAL_MS / STAGE_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + stepIncrement;
      });
    }, UPDATE_INTERVAL_MS);

    timerRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextStage = (stage + 1) % 6;
        setStage(nextStage);
        setStageProgress(0);
        if (onStageChange) onStageChange(nextStage);
        setIsTransitioning(false);
      }, 450);
    }, STAGE_DURATION_MS);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [stage, prefersReducedMotion, isPaused, onStageChange]);

  const stagesMeta = [
    { num: '01', title: 'Provision Workspace', sub: 'Isolated Domain Partition' },
    { num: '02', title: 'Upload Documents', sub: 'PDF Corpus Ingestion' },
    { num: '03', title: 'Process Documents', sub: 'Semantic Vector Grounding' },
    { num: '04', title: 'Configure Widget', sub: 'Brand & Studio Styling' },
    { num: '05', title: 'Visitor Q&A', sub: 'Strict Grounded Citations' },
    { num: '06', title: 'Live on Website', sub: 'Production Deployment' }
  ];

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#050508] z-0"
      aria-hidden="true"
    >
      {/* 1. ACTUAL HTML5 BACKGROUND VIDEO ELEMENT (plays if an mp4 asset exists) */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-40' : 'hidden'
        }`}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>

      {/* 2. ATMOSPHERIC ENGINEERING GRID & AMBIENT ENERGY PARTICLES */}
      <div 
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px'
        }}
      />

      {/* Dynamic Ambient Volumetric Orange Lighting */}
      <div className="absolute -top-20 right-[15%] w-[850px] h-[650px] bg-[#F97316]/[0.10] rounded-full blur-[180px] transform-gpu pointer-events-none" />
      <div className="absolute bottom-10 right-[35%] w-[700px] h-[450px] bg-orange-600/[0.06] rounded-full blur-[170px] transform-gpu pointer-events-none" />
      <div className="absolute top-1/2 left-[5%] w-[500px] h-[400px] bg-white/[0.02] rounded-full blur-[160px] transform-gpu pointer-events-none" />

      {/* 3. FULL-WIDTH APPLICATION TELEMETRY BAR (Edge to Edge underneath Navbar) */}
      <div className="absolute top-14 inset-x-0 h-10 border-b border-white/[0.06] bg-black/40 backdrop-blur-sm px-6 lg:px-12 flex items-center justify-between text-[11px] font-mono z-10">
        <div className="flex items-center space-x-3 text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-semibold">ENGINE ONLINE</span>
          </div>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 hidden sm:inline">Workspace: Acme Enterprise</span>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="text-[#F97316] font-semibold">{stagesMeta[stage].title}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-zinc-400">
            <span>Grounding Policy:</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Document-Verified
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-500">Cycle:</span>
            <span className="text-white font-bold">{stagesMeta[stage].num}/06</span>
          </div>
        </div>
      </div>

      {/* 4. FULL-SCREEN APPLICATION BACKGROUND CANVAS (TRANSITIONS THROUGH 6 STAGES) */}
      <div 
        className={`absolute inset-0 pt-24 pb-8 px-4 sm:px-8 lg:px-12 w-full h-full flex flex-col transition-all duration-700 ease-out transform-gpu ${
          isTransitioning ? 'opacity-30 scale-[0.995]' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative w-full h-full flex items-center">

          {/* ========================================================================= */}
          {/* SCENE 0: CREATE WORKSPACE                                                 */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            {/* Center-Right Wide Expansive Application Layout */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left spacer so foreground headline has calm breathing room */}
              <div className="hidden lg:block lg:col-span-5" />

              {/* Right Expansive UI (Col 7) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Header card */}
                <div className="p-6 rounded-2xl bg-[#0D0D12]/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316] text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        <Building2 className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Stage 01</span>
                          <span className="text-zinc-500 font-mono text-xs">•</span>
                          <span className="text-xs font-mono text-emerald-400">Ready</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Provision Business Workspace
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 font-mono text-xs">
                      acme-solutions.com
                    </span>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-zinc-300 font-mono">Organization Name</span>
                      <div className="p-3 rounded-xl bg-black/80 border border-[#F97316]/60 text-white font-semibold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        <span>Acme Enterprise Solutions</span>
                        <span className="w-1.5 h-3.5 bg-[#F97316] animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-zinc-300 font-mono">Website Domain</span>
                      <div className="p-3 rounded-xl bg-black/80 border border-white/[0.12] text-zinc-300 font-mono text-xs">
                        https://acme-solutions.com
                      </div>
                    </div>
                  </div>

                  {/* Telemetry rows */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
                        Grounding Isolation
                      </span>
                      <span className="text-emerald-400 font-semibold">Strict Document Partition</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="flex items-center">
                        <Code2 className="w-4 h-4 mr-2 text-[#F97316]" />
                        Public Widget Key
                      </span>
                      <span className="text-white font-semibold">kw_live_849201</span>
                    </div>
                  </div>

                  {/* Status trigger */}
                  <div className="pt-1 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                      Tenant boundary provisioned. Ready for documents.
                    </span>
                    <div className="px-4 py-2 rounded-lg bg-[#F97316] text-black font-bold text-xs flex items-center space-x-1.5 shadow-[0_2px_15px_rgba(249,115,22,0.4)]">
                      <span>Active</span>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 1: UPLOAD DOCUMENTS                                                 */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="hidden lg:block lg:col-span-5" />

              <div className="lg:col-span-7 space-y-5">
                
                <div className="p-6 rounded-2xl bg-[#0D0D12]/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] flex items-center justify-center font-bold">
                        <UploadCloud className="w-5 h-5 text-[#F97316]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Stage 02</span>
                          <span className="text-zinc-500 font-mono text-xs">•</span>
                          <span className="text-xs font-mono text-emerald-400">Ingestion Active</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Upload Business Documentation
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                      PDF Ingestion
                    </span>
                  </div>

                  {/* Drag drop banner */}
                  <div className="p-4 border-2 border-dashed border-[#F97316]/50 rounded-xl bg-[#F97316]/[0.04] flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Ingesting Business Guides & Handbooks</div>
                      <div className="text-[11px] font-mono text-zinc-400">PDF structure, tables, and sections preserved</div>
                    </div>
                  </div>

                  {/* Upload items */}
                  <div className="space-y-2.5 font-mono text-xs">
                    
                    <div className="p-3.5 rounded-xl bg-black/80 border border-white/[0.1] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-400 font-bold text-[10px]">PDF</span>
                          <span className="text-white font-sans font-semibold text-xs">Acme_Enterprise_Operations_Manual.pdf</span>
                          <span className="text-zinc-500 text-[11px]">2.4 MB • 48 Pages</span>
                        </div>
                        <span className="text-emerald-400 font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100%
                        </span>
                      </div>
                      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#F97316] h-full rounded-full w-full shadow-[0_0_10px_#F97316]" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/80 border border-white/[0.1] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-400 font-bold text-[10px]">PDF</span>
                          <span className="text-white font-sans font-semibold text-xs">Customer_Support_SLA_and_Security.pdf</span>
                          <span className="text-zinc-500 text-[11px]">1.2 MB • 24 Pages</span>
                        </div>
                        <span className="text-emerald-400 font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100%
                        </span>
                      </div>
                      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#F97316] h-full rounded-full w-full shadow-[0_0_10px_#F97316]" />
                      </div>
                    </div>

                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Corpus Extracted: <strong className="text-white font-bold">72 Pages Total</strong></span>
                    <span className="text-[#F97316] font-bold flex items-center">
                      Ready for Vector Indexing <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 2: PROCESS DOCUMENTS FOR CHATBOT USE                                */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="hidden lg:block lg:col-span-5" />

              <div className="lg:col-span-7 space-y-5">
                
                <div className="p-6 rounded-2xl bg-[#0D0D12]/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] flex items-center justify-center font-bold">
                        <Cpu className="w-5 h-5 text-[#F97316] animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Stage 03</span>
                          <span className="text-zinc-500 font-mono text-xs">•</span>
                          <span className="text-xs font-mono text-emerald-400">100% Vector Indexed</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Process Documents for Chatbot Use
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                      Zero Hallucination
                    </span>
                  </div>

                  {/* Processing stream */}
                  <div className="space-y-2.5 font-mono text-xs">
                    
                    <div className="p-3 rounded-xl bg-black/80 border border-white/[0.08] flex items-center justify-between">
                      <span className="text-zinc-300">Semantic Section Decomposition</span>
                      <span className="text-white font-semibold flex items-center">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> 84 Sections Extracted
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/80 border border-white/[0.08] flex items-center justify-between">
                      <span className="text-zinc-300">Vector Embeddings Generation</span>
                      <span className="text-emerald-400 font-semibold flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Fully Embedded & Indexed
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/80 border border-white/[0.08] flex items-center justify-between">
                      <span className="text-zinc-300">Strict Document Grounding Verification</span>
                      <span className="text-emerald-400 font-semibold flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Guardrails Active
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/80 border border-white/[0.08] flex items-center justify-between">
                      <span className="text-zinc-300">Citation Anchors Mapping</span>
                      <span className="text-white font-semibold">Exact Line & Page References</span>
                    </div>

                  </div>

                  {/* Verification Banner */}
                  <div className="p-3.5 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-zinc-200 font-sans font-medium">Chatbot grounded strictly in company documentation.</span>
                    </div>
                    <span className="font-mono text-[#F97316] font-bold">100% Ready</span>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 3: CONFIGURE CHATBOT WIDGET                                         */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="hidden lg:block lg:col-span-5" />

              <div className="lg:col-span-7 space-y-5">
                
                <div className="p-6 rounded-2xl bg-[#0D0D12]/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316] text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        <Palette className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Stage 04</span>
                          <span className="text-zinc-500 font-mono text-xs">•</span>
                          <span className="text-xs font-mono text-zinc-300">Widget Studio</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Configure Chatbot Widget
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 font-mono text-xs">
                      Brand Customizer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Controls */}
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <span className="text-zinc-400 block mb-1">Brand Accent Color</span>
                        <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/80 border border-white/[0.1]">
                          <span className="w-6 h-6 rounded-md bg-[#F97316] ring-2 ring-white/60 inline-block shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
                          <span className="text-white font-semibold">#F97316 (Knowra Orange)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-400 block mb-1">Widget Position</span>
                        <div className="p-2.5 rounded-xl bg-black/80 border border-white/[0.1] text-zinc-200">
                          Bottom Right (Floating)
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-400 block mb-1">Assistant Title</span>
                        <div className="p-2.5 rounded-xl bg-black/80 border border-white/[0.1] text-white font-bold font-sans">
                          Acme Support AI
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="p-4 rounded-xl bg-[#09090D] border border-white/[0.14] space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Studio Preview</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-[#F97316] text-black flex items-center justify-center font-bold">
                            <Bot className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-sans">Acme Support AI</div>
                            <div className="text-[10px] font-mono text-emerald-400">Strict Document Grounding</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.04] text-xs font-sans text-zinc-200 leading-relaxed border border-white/[0.06]">
                          Hello! How can I assist you with Acme's products, SLAs, or documentation today?
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-zinc-500">Live Launcher</span>
                        <div className="w-8 h-8 rounded-full bg-[#F97316] text-black flex items-center justify-center shadow-[0_2px_12px_rgba(249,115,22,0.5)]">
                          <MessageSquare className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 4: VISITOR QUESTION & ANSWER                                        */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="hidden lg:block lg:col-span-5" />

              <div className="lg:col-span-7 space-y-5">
                
                <div className="p-6 rounded-2xl bg-[#0D0D12]/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] flex items-center justify-center font-bold">
                        <MessageSquare className="w-5 h-5 text-[#F97316]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Stage 05</span>
                          <span className="text-zinc-500 font-mono text-xs">•</span>
                          <span className="text-xs font-mono text-emerald-400">Visitor Interaction</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Visitor Question & Grounded Answer
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                      Verified Citation
                    </span>
                  </div>

                  {/* Visitor Question Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-md p-3.5 rounded-2xl rounded-tr-sm bg-[#F97316] text-black text-xs font-bold leading-relaxed shadow-[0_4px_20px_rgba(249,115,22,0.35)]">
                      What are your standard onboarding timelines and SLA response guarantees?
                    </div>
                  </div>

                  {/* AI Grounded Answer Bubble */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-[#F97316]" />
                    </div>
                    
                    <div className="space-y-2.5 max-w-lg">
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-[#14141B] border border-white/[0.1] text-xs text-zinc-100 leading-relaxed space-y-2 shadow-lg font-sans">
                        <p>
                          According to Acme's Standard Onboarding Documentation, customer onboarding takes approximately <strong className="text-[#F97316] font-bold">10 business days</strong> following receipt of complete system credentials.
                        </p>
                        <p>
                          Under our Enterprise Tier, critical incident response is guaranteed within <strong className="text-[#F97316] font-bold">15 minutes</strong> with 24/7 engineering coverage.
                        </p>
                      </div>

                      {/* Verified Citation Pill */}
                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/90 border border-white/[0.12] text-xs font-mono text-zinc-300 shadow-sm">
                        <FileText className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Source: <strong className="text-white">Acme_Operations_Manual.pdf</strong> (Section 2.4)</span>
                        <span className="text-emerald-400 font-bold flex items-center pl-1">
                          <Check className="w-3.5 h-3.5 mr-0.5 stroke-[3]" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="p-3 rounded-xl bg-black/80 border border-white/[0.1] flex items-center justify-between text-xs text-zinc-400 font-sans">
                    <span>Ask a question about Acme documentation...</span>
                    <div className="w-7 h-7 rounded-lg bg-white/[0.08] text-zinc-300 flex items-center justify-center">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 5: FINISHED CHATBOT ON BUSINESS WEBSITE                             */}
          {/* ========================================================================= */}
          <div 
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ${
              stage === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="hidden lg:block lg:col-span-5" />

              <div className="lg:col-span-7 space-y-4">
                
                {/* Website Browser Chrome */}
                <div className="rounded-2xl border border-white/[0.14] bg-[#0A0A0E]/95 shadow-2xl overflow-hidden backdrop-blur-md">
                  
                  {/* Browser Bar */}
                  <div className="px-4 py-2.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>

                    <div className="px-3.5 py-1 rounded-md bg-black/70 border border-white/[0.08] text-xs font-mono text-zinc-300 flex items-center space-x-1.5">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>https://acme-solutions.com</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                      Stage 06 • Live
                    </span>
                  </div>

                  {/* Simulated Client Website Canvas */}
                  <div className="p-6 bg-[#07070A] space-y-4 relative min-h-[320px] flex flex-col justify-between">
                    
                    {/* Website Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] opacity-75">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                        <span className="text-xs font-bold text-white tracking-wider">ACME GLOBAL SOLUTIONS</span>
                      </div>
                      <div className="flex space-x-4 text-xs text-zinc-400 font-mono">
                        <span>Solutions</span>
                        <span>Docs</span>
                        <span>Support</span>
                      </div>
                    </div>

                    {/* Website Hero */}
                    <div className="space-y-2 opacity-70 max-w-sm">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                        Enterprise Infrastructure
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        Powering Enterprise Operations with Strict SLA Guarantees
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Comprehensive freight logistics and multi-region transit infrastructure for global enterprises.
                      </p>
                    </div>

                    {/* Finished Embedded Widget Live in Corner */}
                    <div className="pt-2 flex justify-end">
                      <div className="w-72 rounded-2xl border border-white/[0.18] bg-[#101016] shadow-2xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-[#F97316] text-black flex items-center justify-center font-bold shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                              <Bot className="w-3.5 h-3.5 text-black" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-white block">Acme Support AI</span>
                              <span className="text-[9px] text-emerald-400 font-mono">Live on acme-solutions.com</span>
                            </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>

                        <div className="text-[11px] text-zinc-200 bg-white/[0.05] p-2.5 rounded-xl border border-white/[0.08] leading-relaxed">
                          Ready to answer visitor questions using verified business documents with exact citations.
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                          <span>1-Line Script Embedded</span>
                          <span className="text-[#F97316] font-bold">Production Live</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 5. CINEMATIC GRADIENTS & READABILITY OVERLAYS ================= */}
      {/* 
        Carefully weighted dark gradients:
        - Deep dark mask across the left ~45% to keep hero headline and CTA buttons crystal-clear.
        - Open transparent right side so the high-fidelity UI sequence shines through.
        - Top fade under navbar and bottom fade transitioning smoothly into "How It Works".
      */}
      
      {/* 5a. Base Ambient Tint */}
      <div className="absolute inset-0 bg-black/35 z-10 pointer-events-none" />

      {/* 5b. Left Dark Gradient for Headline Clarity */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent/30 z-10 pointer-events-none" />

      {/* 5c. Top Edge Fade for Navbar Blending */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* 5d. Bottom Edge Fade for Transition into How It Works */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />

    </div>
  );
}