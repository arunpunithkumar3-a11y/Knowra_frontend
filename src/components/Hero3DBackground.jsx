import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Check,
  Bot,
  Send,
  MessageSquare,
  Code2,
  Palette,
  Layers,
  ShieldCheck,
  Globe,
  Copy,
} from 'lucide-react';

/**
 * Hero3DBackground — Clean VS Code-style IDE window
 *
 * 4 stages showing the real Knowra workflow:
 *   0 → Knowledge Base   : Upload & index your PDF
 *   1 → Widget Studio    : Create & configure your chatbot widget
 *   2 → Test Chatbot     : Verified chat conversation with citation
 *   3 → Go Live          : One-line embed script + live confirmation
 *
 * Rules:
 *   - No arrow cursors, no bottom scrubber, no player controls
 *   - pointer-events-none on root (purely decorative)
 *   - Left gradient preserved for headline readability
 */

/* Sidebar nav definition: which stage activates each item */
const NAV = [
  { group: 'Intelligence', items: [
    { label: 'Knowledge Base', icon: FileText,      stage: 0 },
    { label: 'Playground',     icon: MessageSquare,  stage: 2 },
  ]},
  { group: 'Deployment', items: [
    { label: 'Widget Studio',  icon: Palette,        stage: 1 },
    { label: 'Go Live',        icon: Globe,          stage: 3 },
  ]},
];

/* ─── Stage 0 ─── Upload & Index */
function StageKnowledgeBase() {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white tracking-tight">Knowledge Base</h4>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
            1 / 1 Active
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">Upload your PDF — we index it for verified answers.</p>
      </div>

      {/* Drag-drop zone */}
      <div className="p-4 border-2 border-dashed border-[#F97316]/50 rounded-xl bg-[#F97316]/[0.07] space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5 text-[#F97316]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Acme_Support_Manual.pdf</div>
            <div className="text-[11px] font-mono text-zinc-400">2.4 MB · 24 pages</div>
          </div>
        </div>

        {/* Progress bar — full / complete */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-300">Indexing vectors…</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> 100% Indexed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/80 border border-white/[0.07] overflow-hidden">
            <div className="h-full rounded-full bg-[#F97316] w-full shadow-[0_0_10px_#F97316]" />
          </div>
        </div>
      </div>

      {/* Indexed file row */}
      <div className="rounded-xl border border-white/[0.1] bg-[#12121A] px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <FileText className="w-4 h-4 text-red-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">Acme_Support_Manual.pdf</div>
            <div className="text-[10px] font-mono text-zinc-400">84 vector chunks · grounded</div>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
          Active
        </span>
      </div>
    </div>
  );
}

/* ─── Stage 1 ─── Widget Studio (creation form + live widget preview) */
function StageWidgetStudio() {
  const colors = [
    { hex: '#F97316', label: 'Orange' },
    { hex: '#6366f1', label: 'Indigo' },
    { hex: '#10b981', label: 'Emerald' },
    { hex: '#0ea5e9', label: 'Sky' },
  ];

  return (
    <div className="space-y-3 animate-fadeIn h-full flex flex-col">
      {/* Header */}
      <div className="pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white tracking-tight">Widget Studio</h4>
          <span className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Preview
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">Configure your chatbot — preview updates instantly.</p>
      </div>

      {/* Two-column: Form + Widget Preview */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">

        {/* Left: Form fields */}
        <div className="space-y-2.5 text-xs font-mono">
          {/* Widget name */}
          <div>
            <label className="text-zinc-400 text-[10px] block mb-1">Widget Name</label>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/[0.12] text-white font-sans font-bold text-[11px]">
              Acme Support Assistant
            </div>
          </div>

          {/* Brand color */}
          <div>
            <label className="text-zinc-400 text-[10px] block mb-1">Brand Color</label>
            <div className="flex items-center space-x-1.5">
              {colors.map((c) => (
                <div
                  key={c.hex}
                  className="relative w-5 h-5 rounded"
                  style={{ backgroundColor: c.hex }}
                >
                  {c.hex === '#F97316' && (
                    <div className="absolute inset-0 rounded ring-2 ring-white ring-offset-1 ring-offset-black" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-1 text-[10px] text-white font-bold">#F97316 · Orange</div>
          </div>

          {/* Welcome message */}
          <div>
            <label className="text-zinc-400 text-[10px] block mb-1">Welcome Message</label>
            <div className="px-2.5 py-2 rounded-lg bg-black/80 border border-white/[0.12] text-zinc-100 font-sans text-[10px] leading-relaxed">
              👋 Hi! Ask me anything about Acme's products or support.
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="text-zinc-400 text-[10px] block mb-1">Position</label>
            <div className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-[#F97316]/40 text-[#F97316] font-bold text-[10px]">
              Bottom-Right ✓
            </div>
          </div>

          {/* Create button */}
          <button
            type="button"
            tabIndex={-1}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-[#F97316] text-black font-bold text-[11px] shadow-[0_2px_14px_rgba(249,115,22,0.5)] flex items-center justify-center space-x-1.5"
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Create Widget</span>
          </button>
        </div>

        {/* Right: Live widget preview */}
        <div className="relative rounded-xl border border-white/[0.12] bg-[#111118] overflow-hidden flex flex-col">
          {/* Preview header */}
          <div className="px-2.5 py-2 border-b border-white/[0.08] bg-[#0E0E16] flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center">
              <Bot className="w-2.5 h-2.5 text-[#F97316]" />
            </div>
            <span className="text-[10px] font-bold text-white">Acme Support Assistant</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
            {/* Welcome bubble */}
            <div className="flex items-start space-x-1.5">
              <div className="w-5 h-5 rounded-md bg-[#F97316] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
                <Bot className="w-3 h-3 text-black" />
              </div>
              <div className="px-2.5 py-2 rounded-xl rounded-tl-sm bg-[#1A1A26] border border-white/[0.1] text-[10px] text-zinc-100 leading-relaxed max-w-[85%]">
                👋 Hi! Ask me anything about Acme's products or support.
              </div>
            </div>

            {/* Visitor message */}
            <div className="flex justify-end">
              <div className="px-2.5 py-1.5 rounded-xl rounded-tr-sm bg-[#F97316] text-black font-bold text-[10px] leading-relaxed max-w-[80%]">
                What's your return policy?
              </div>
            </div>

            {/* Bot reply */}
            <div className="flex items-start space-x-1.5">
              <div className="w-5 h-5 rounded-md bg-[#F97316] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
                <Bot className="w-3 h-3 text-black" />
              </div>
              <div className="px-2.5 py-2 rounded-xl rounded-tl-sm bg-[#1A1A26] border border-white/[0.1] text-[10px] text-zinc-100 leading-relaxed max-w-[85%]">
                Returns are accepted within <span className="text-[#F97316] font-bold">30 days</span> of purchase with original receipt.
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="px-2.5 py-2 border-t border-white/[0.08] flex items-center space-x-1.5">
            <div className="flex-1 px-2 py-1 rounded-lg bg-black/80 border border-white/[0.1] text-[10px] text-zinc-500 font-mono">
              Type a message…
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#F97316] flex items-center justify-center shadow-[0_2px_8px_rgba(249,115,22,0.45)]">
              <Send className="w-3 h-3 text-black" />
            </div>
          </div>

          {/* Floating launcher badge */}
          <div className="absolute bottom-2 right-2 flex flex-col items-end space-y-1">
            <div className="text-[9px] font-mono text-zinc-500">Website Launcher</div>
            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center shadow-[0_4px_16px_rgba(249,115,22,0.7)]">
              <MessageSquare className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Stage 2 ─── Test Chatbot */
function StageTestChatbot() {
  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white tracking-tight">Test Your Chatbot</h4>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
            Grounded
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">Chat and verify answers against your uploaded document.</p>
      </div>

      {/* Visitor question */}
      <div className="flex justify-end">
        <div className="max-w-[80%] px-3 py-2.5 rounded-2xl rounded-tr-sm bg-[#F97316] text-black font-bold text-xs leading-relaxed shadow">
          What's the SLA for Critical Incident triage?
        </div>
      </div>

      {/* Bot answer */}
      <div className="flex items-start space-x-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center shrink-0 mt-0.5 shadow">
          <Bot className="w-4 h-4 text-black" />
        </div>
        <div className="space-y-2 min-w-0 flex-1">
          <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-[#161624] border border-white/[0.12] text-zinc-100 text-xs leading-relaxed">
            Under the <strong>Enterprise Plan</strong>, Critical Incidents are triaged within{' '}
            <strong className="text-[#F97316]">15 minutes</strong> with 24/7 engineering coverage.
          </div>

          {/* Citation */}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-black border border-white/[0.12] text-[10px] font-mono text-zinc-300">
            <FileText className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
            <span>Acme_Support_Manual.pdf · Page 14</span>
            <span className="text-emerald-400 font-bold flex items-center pl-1">
              <Check className="w-3 h-3 stroke-[3] mr-0.5" /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Composer bar */}
      <div className="px-3 py-2 rounded-xl bg-black/80 border border-white/[0.08] flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>Ask about your documentation…</span>
        <div className="w-5 h-5 rounded bg-[#F97316] flex items-center justify-center">
          <Send className="w-3 h-3 text-black" />
        </div>
      </div>
    </div>
  );
}

/* ─── Stage 3 ─── Go Live */
function StageGoLive() {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white tracking-tight">Go Live</h4>
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Widget Active</span>
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">Paste one line of code — your AI assistant is live.</p>
      </div>

      {/* Embed script block */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-zinc-400 flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Embed Script</span>
          </span>
          <div className="flex items-center space-x-1 text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] cursor-default">
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/[0.1] font-mono text-[10px] leading-relaxed text-emerald-300 overflow-hidden">
          <span className="text-zinc-500">{'<'}script</span>
          {' '}
          <span className="text-sky-400">src</span>
          <span className="text-zinc-500">=</span>
          <span className="text-amber-300">"https://cdn.knowra.ai/widget.js"</span>
          <br />
          {'        '}
          <span className="text-sky-400">data-widget-id</span>
          <span className="text-zinc-500">=</span>
          <span className="text-amber-300">"kw_acme_849201"</span>
          <span className="text-zinc-500">{'>'}{'<'}/script{'>'}</span>
        </div>
      </div>

      {/* Live confirmation */}
      <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/25 flex items-start space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-300">Live on acme-solutions.com</div>
          <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
            Serving grounded answers · 42 conversations today
          </div>
        </div>
      </div>

      {/* Insight teaser */}
      <div className="rounded-xl border border-white/[0.08] bg-black/60 px-3 py-2.5 flex items-center justify-between text-xs font-mono">
        <div className="text-zinc-300">
          Top question: <span className="text-white font-bold">"Onboarding timeline?"</span>
        </div>
        <span className="text-[#F97316] font-bold">18 asks</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Hero3DBackground({ currentStage = 0, onStageChange }) {
  const [stage, setStage] = useState(currentStage);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);

  const STAGE_DURATION_MS = 4200;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (currentStage !== undefined && currentStage !== stage) setStage(currentStage);
  }, [currentStage]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setStage((prev) => {
        const next = (prev + 1) % 4;
        if (onStageChange) onStageChange(next);
        return next;
      });
    }, STAGE_DURATION_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, onStageChange]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#020204] pointer-events-none"
      aria-hidden="true"
    >
      {/* Atmospheric grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 90% 85% at 75% 50%, black 25%, transparent 85%)',
        }}
      />

      {/* Ambient glows */}
      <div className="absolute top-1/4 right-[8%] w-[700px] h-[600px] bg-[#F97316]/[0.15] rounded-full blur-[140px] transform-gpu" />
      <div className="absolute bottom-10 right-[22%] w-[600px] h-[500px] bg-orange-600/[0.10] rounded-full blur-[160px] transform-gpu" />
      <div className="absolute top-1/3 left-[38%] w-[450px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[130px] transform-gpu" />

      {/* IDE window wrapper */}
      <div
        className="absolute inset-0 pt-16 pb-8 px-4 sm:px-8 lg:px-12 flex items-center justify-end z-0"
        style={{ perspective: '1400px' }}
      >
        {/* Floating IDE shell */}
        <div
          className="w-full lg:w-[60%] max-w-2xl transform-gpu transition-all duration-500 ease-out"
          style={{
            transform: `rotateY(${tilt.x * 0.6 - 5}deg) rotateX(${-tilt.y * 0.6 + 2}deg) translateZ(0px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative rounded-2xl bg-[#0E0E14] border border-white/[0.16] shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden">

            {/* Window chrome */}
            <div className="px-4 py-3 bg-[#151520] border-b border-white/[0.1] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <div className="pl-2 flex items-center space-x-2 text-xs font-mono">
                  <Layers className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="text-white font-semibold">Knowra Workspace</span>
                  <span className="text-zinc-500">/</span>
                  <span className="text-zinc-300">Acme Enterprise</span>
                </div>
              </div>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </span>
            </div>

            {/* Sidebar + Canvas */}
            <div className="grid grid-cols-12 min-h-[420px] bg-[#0A0A10]">

              {/* Sidebar */}
              <div className="hidden sm:flex sm:col-span-4 border-r border-white/[0.08] bg-[#101017] flex-col p-3.5 space-y-4 font-sans text-xs">

                {/* Org card */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/[0.08] flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
                    <Layers className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="truncate">
                    <div className="text-white font-bold text-xs truncate">Acme Enterprise</div>
                    <div className="text-[10px] font-mono text-zinc-400">kw_live_849201</div>
                  </div>
                </div>

                {/* Nav groups */}
                {NAV.map(({ group, items }) => (
                  <div key={group} className="space-y-1">
                    <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      {group}
                    </div>
                    {items.map(({ label, icon: Icon, stage: s }) => {
                      const active = stage === s;
                      return (
                        <div
                          key={label}
                          className={`px-2.5 py-2 rounded-lg flex items-center space-x-2.5 transition-all duration-300 ${
                            active
                              ? 'bg-[#F97316]/20 text-[#F97316] font-bold border-l-2 border-[#F97316]'
                              : 'text-zinc-400'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#F97316]' : 'text-zinc-500'}`} />
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Spacer then grounding badge */}
                <div className="mt-auto">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/25 text-[10px] font-mono text-emerald-200 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero Hallucination</span>
                    </div>
                    <div className="text-zinc-400 leading-relaxed">
                      Answers strictly cited from your uploaded documents.
                    </div>
                  </div>
                </div>
              </div>

              {/* Main canvas */}
              <div className="col-span-12 sm:col-span-8 p-5 sm:p-6 bg-[#0C0C12] flex flex-col">
                {stage === 0 && <StageKnowledgeBase />}
                {stage === 1 && <StageWidgetStudio />}
                {stage === 2 && <StageTestChatbot />}
                {stage === 3 && <StageGoLive />}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── Gradient overlays ─── */}
      {/* Left: protect headline */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[48%] bg-gradient-to-r from-black via-black/85 to-transparent z-10 pointer-events-none" />
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
