import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Palette, 
  Code2, 
  BarChart3, 
  FileText, 
  Check, 
  Bot, 
  Sparkles, 
  Globe, 
  Copy, 
  Layers, 
  ArrowRight,
  Lock,
  Cpu
} from 'lucide-react';

/**
 * FeaturesSection Component
 * 
 * Varied editorial layouts highlighting Knowra's real capabilities:
 * - Feature 1: Strict Document Grounding & Citations (Asymmetric spotlight)
 * - Feature 2: Widget Studio & Visual Customizer (Interactive split)
 * - Feature 3: 1-Line Embed Script Tag (Code architecture card)
 * - Feature 4: Customer Question Diagnostics & Topic Clustering (Analytical view)
 * 
 * Concise, truthful, business-focused copy with zero backend buzzwords.
 */
export default function FeaturesSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('<script src="https://cdn.knowra.ai/widget.js" data-key="kw_live_849201" async></script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="features" className="py-24 sm:py-32 border-t border-white/[0.08] bg-[#030306] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>ENTERPRISE FEATURES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Engineered for trust and precision.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            No fictional capabilities or vague promises. Here is how Knowra delivers verifiable AI customer conversations for your business website.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL LAYOUT 1: STRICT DOCUMENT GROUNDING & CITATIONS                 */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#09090D] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-2xl">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Document Grounding</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Every answer backed by your documents. Zero guesswork.
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Generic AI models invent answers when unsure. Knowra’s assistant is strictly confined to the knowledge contained within your uploaded corporate PDF. If a fact isn't in your files, the assistant says so plainly.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm font-mono text-zinc-300 pt-2">
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Line and page citations anchored directly to source PDFs</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero hallucination guardrail protects your business reputation</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant verification before answers are delivered to visitors</span>
              </li>
            </ul>
          </div>

          {/* Visual Showcase: Real Citation Badge */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/[0.12] bg-[#111118] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs font-mono text-zinc-400">
                <span className="flex items-center text-white font-medium">
                  <Bot className="w-4 h-4 mr-2 text-[#F97316]" />
                  Knowra Verified Output
                </span>
                <span className="text-emerald-400 flex items-center">
                  <Check className="w-3 h-3 mr-1 stroke-[3]" /> Verified Citation
                </span>
              </div>

              {/* Real Response Bubble */}
              <div className="p-4 rounded-xl bg-black/70 border border-white/[0.08] text-xs font-sans text-zinc-200 leading-relaxed space-y-2">
                <p>
                  "Customer onboarding requires <strong>10 business days</strong> from receipt of verified server credentials. Critical incident triage is guaranteed within <strong>15 minutes</strong> with 24/7 technical escalations."
                </p>
              </div>

              {/* Citation Anchor Pill */}
              <div className="p-3 rounded-xl bg-[#161622] border border-[#F97316]/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2.5 text-zinc-200">
                  <FileText className="w-4 h-4 text-[#F97316]" />
                  <span>Source: <strong>Acme_Operations_Manual.pdf</strong> (Page 14)</span>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">Match Score: 100%</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL LAYOUT 2 & 3: WIDGET STUDIO & 1-LINE EMBED SCRIPT TAG           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Widget Studio Card (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/[0.1] bg-[#09090D] p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
                <Palette className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Widget Studio Customizer</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Designed to match your business aesthetic.
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                No generic chatbot appearance. Pick your primary brand color, customize the greeting, adjust title typography, and preview the bottom-right floating launcher in real time before publishing.
              </p>
            </div>

            {/* Visual Color Pill Array */}
            <div className="p-5 rounded-2xl bg-[#121218] border border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Color Preset:</span>
                <span className="text-[#F97316] font-semibold">#F97316 (Knowra Orange)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-md bg-[#F97316] ring-2 ring-white/60 shadow-[0_0_12px_rgba(249,115,22,0.6)]" />
                <span className="w-6 h-6 rounded-md bg-[#09090B] ring-1 ring-white/20" />
                <span className="w-6 h-6 rounded-md bg-[#334155] ring-1 ring-white/20" />
                <span className="w-6 h-6 rounded-md bg-[#0F172A] ring-1 ring-white/20" />
                <span className="w-6 h-6 rounded-md bg-[#047857] ring-1 ring-white/20" />
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/[0.06]">
                <span>Floating Position: Bottom Right</span>
                <span className="text-emerald-400">Responsive Expand Modal</span>
              </div>
            </div>
          </div>

          {/* 1-Line Embed Script Tag Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-white/[0.1] bg-[#09090D] p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single Script Tag</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                One line of code. Instant live deployment.
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Paste the lightweight Knowra script tag into your website's HTML, Shopify theme, WordPress site, or Webflow project. Loads asynchronously with zero bundle drag.
              </p>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-2xl bg-black border border-white/[0.1] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                <span>Embed Snippet</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 text-zinc-300 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-zinc-300 overflow-x-auto py-1 text-[11px] leading-relaxed">
                <span className="text-emerald-400">&lt;script</span> <span className="text-[#F97316]">src</span>=<span className="text-zinc-200">&quot;https://cdn.knowra.ai/widget.js&quot;</span> <span className="text-[#F97316]">data-key</span>=<span className="text-zinc-200">&quot;kw_live_849201&quot;</span> <span className="text-[#F97316]">async</span><span className="text-emerald-400">&gt;&lt;/script&gt;</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL LAYOUT 4: QUESTION INSIGHTS & TOPIC CLUSTERING                 */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#09090D] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-2xl">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
              <BarChart3 className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Customer Intelligence</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn customer questions into business strategy.
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Knowra doesn’t just answer questions—it analyzes what visitors are asking. Inquiries are automatically grouped into diagnostic topic clusters with concrete business recommendations so you know exactly where your documentation or product needs improvement.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-zinc-400">
              <span>• Diagnostic clustering</span>
              <span>• Inquiry frequency ranking</span>
              <span>• Prescriptive action plans</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#121218] border border-white/[0.1] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white">Cluster 01: Onboarding Milestones & Pre-requisites</span>
                <span className="px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] font-bold text-[10px]">High Inquiries</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Visitors frequently inquire about the estimated 10-day onboarding timeline and which system credentials or data dictionaries are required upfront.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-sans text-orange-200">
                <strong>Prescriptive Action:</strong> Publish the onboarding prerequisite checklist directly on your documentation landing page to streamline customer setup expectations.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#121218] border border-white/[0.1] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white">Cluster 02: Data Privacy & Strict Source Grounding</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">Core Trust</span>
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Prospects inquire whether answers are strictly synthesized from uploaded corporate PDFs without pulling external unverified information.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-sans text-emerald-200">
                <strong>Prescriptive Action:</strong> Highlight verified citation badges in public responses to reassure customers that answers are strictly grounded in company files.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
