import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  Cpu, 
  Palette, 
  Code2, 
  BarChart3, 
  Check, 
  Copy, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Bot
} from 'lucide-react';

/**
 * Product Workflow Component (Section 4: Only Show Real Capabilities)
 * 
 * Accurately demonstrates Knowra's real 6-step flow:
 * 1. Create a business workspace.
 * 2. Upload business documents.
 * 3. Process documents for chatbot use.
 * 4. Test and configure chatbot widget.
 * 5. Embed widget on website.
 * 6. View customer-question insights.
 * 
 * Minimal, concise, truthful, zero ungrounded buzzwords.
 */
export default function ProductWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Create Workspace',
      shortDesc: 'Set up an isolated domain for your company with custom access keys.',
      icon: Building2,
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Upload Documents',
      shortDesc: 'Upload corporate PDF guides, onboarding manuals, and policies.',
      icon: UploadCloud,
    },
    {
      id: 'step-3',
      number: '03',
      title: 'Process Documents',
      shortDesc: 'Content is parsed and indexed into vector embeddings for citation retrieval.',
      icon: Cpu,
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Configure Widget',
      shortDesc: 'Customize greetings and brand colors; verify citations in the sandbox.',
      icon: Palette,
    },
    {
      id: 'step-5',
      number: '05',
      title: 'Embed on Website',
      shortDesc: 'Copy a single lightweight script tag to deploy the live assistant.',
      icon: Code2,
    },
    {
      id: 'step-6',
      number: '06',
      title: 'View Customer Insights',
      shortDesc: 'Analyze aggregated visitor questions grouped into diagnostic topic clusters.',
      icon: BarChart3,
    },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText('<script src="https://cdn.knowra.ai/widget.js" data-key="biz_pub_849201" async></script>');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-white/[0.08] bg-[#050508] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>Product Steps</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            Turn business documents into an embedded website AI chatbot in six transparent steps.
          </p>
        </div>

        {/* 6-Step Interactive Grid & Live Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Step Selector List (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 group cursor-pointer ${
                    isActive
                      ? 'bg-[#0E0E12] border-[#F97316]/40 shadow-[0_2px_12px_rgba(249,115,22,0.15)]'
                      : 'bg-black/40 border-white/[0.06] hover:bg-[#0A0A0E] hover:border-white/[0.12]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isActive ? 'bg-[#F97316] text-black font-bold' : 'bg-white/[0.05] text-zinc-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#F97316]' : 'text-zinc-500'}`}>
                        {s.number}
                      </span>
                      <h3 className={`text-xs sm:text-sm font-semibold tracking-tight ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {s.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Feature Visualizer (Right 7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/[0.12] bg-[#0C0C10] p-6 shadow-2xl min-h-[460px] flex flex-col justify-between">
              
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs font-mono">
                <span className="text-zinc-400">
                  Step {steps[activeStep].number} • <strong className="text-white">{steps[activeStep].title}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px]">
                  Verified Interface
                </span>
              </div>

              {/* Dynamic Step Mockup */}
              <div className="py-6 flex-grow flex items-center justify-center">
                
                {/* Step 1: Create Workspace */}
                {activeStep === 0 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-3.5 shadow-lg">
                    <div className="flex items-center space-x-2.5 pb-2 border-b border-white/[0.08]">
                      <div className="w-7 h-7 rounded bg-[#F97316] text-black flex items-center justify-center font-bold">
                        <Building2 className="w-3.5 h-3.5 text-black" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Create Business Workspace</div>
                        <div className="text-[10px] font-mono text-zinc-400">Isolated documentation boundary</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-400 text-[11px]">Workspace Name</span>
                        <div className="p-2 rounded bg-black/60 border border-white/[0.08] text-white font-medium">
                          Northstar Analytics
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400 text-[11px]">Company Website URL</span>
                        <div className="p-2 rounded bg-black/60 border border-white/[0.08] text-zinc-300 font-mono text-[11px]">
                          https://northstar-analytics.com
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <div className="px-3.5 py-1.5 rounded-md bg-[#F97316] text-black font-bold text-xs">
                        Create Workspace
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Upload Documents */}
                {activeStep === 1 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-4 shadow-lg text-center">
                    <div className="p-6 border-2 border-dashed border-white/[0.15] rounded-lg bg-black/40 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mx-auto">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-white">
                        Standard_Onboarding_Handbook.pdf
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        1.2 MB • Ready for vectorization
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
                      <span>Workspace Capacity: <strong className="text-white">1/1 Document</strong></span>
                      <span className="text-emerald-400 flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1" /> Validated PDF
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 3: Process & Vector Index */}
                {activeStep === 2 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-3.5 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-[#F97316]" />
                        <span className="text-xs font-semibold text-white">Vector Ingestion Pipeline</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% Indexed</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-black/60 border border-white/[0.08] flex items-center justify-between">
                        <span className="text-zinc-400">Extracted Chunks:</span>
                        <span className="text-white font-semibold">48 semantic sections</span>
                      </div>
                      <div className="p-2.5 rounded bg-black/60 border border-white/[0.08] flex items-center justify-between">
                        <span className="text-zinc-400">Source Grounding:</span>
                        <span className="text-emerald-400 font-semibold">Strict (Zero Hallucination)</span>
                      </div>
                      <div className="p-2.5 rounded bg-black/60 border border-white/[0.08] flex items-center justify-between">
                        <span className="text-zinc-400">Citation Anchors:</span>
                        <span className="text-white font-semibold">Verified Line References</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Configure & Test Widget */}
                {activeStep === 3 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-3.5 shadow-lg text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <span className="text-xs font-semibold text-white">Widget Studio Customization</span>
                      <span className="text-[10px] font-mono text-zinc-400">Bottom-Right</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-zinc-400 text-[11px]">Primary Brand Color</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="w-6 h-6 rounded-full bg-[#F97316] ring-2 ring-white/60" />
                          <span className="font-mono text-xs text-white">#F97316 (Orange Accent)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-400 text-[11px]">Welcome Greeting</span>
                        <div className="p-2 rounded bg-black/60 border border-white/[0.08] text-zinc-200 text-[11px]">
                          Hello! How can I assist you with Northstar Analytics today?
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Embed on Website */}
                {activeStep === 4 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-3 shadow-lg text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-white">
                        <Code2 className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>HTML Embed Snippet</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">&lt;script&gt; Tag</span>
                    </div>

                    <div className="relative p-3 rounded-lg bg-black border border-white/[0.08] font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                      <span className="text-zinc-500">&lt;!-- Knowra Chatbot --&gt;</span><br />
                      <span className="text-emerald-400">&lt;script</span> <span className="text-[#F97316]">src</span>=<span className="text-zinc-200">&quot;https://cdn.knowra.ai/widget.js&quot;</span> <span className="text-[#F97316]">data-key</span>=<span className="text-zinc-200">&quot;biz_pub_849201&quot;</span> <span className="text-[#F97316]">async</span><span className="text-emerald-400">&gt;&lt;/script&gt;</span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="w-full py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white flex items-center justify-center space-x-1.5 transition-colors border border-white/[0.08]"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Embed Code'}</span>
                    </button>
                  </div>
                )}

                {/* Step 6: Review Question Insights */}
                {activeStep === 5 && (
                  <div className="w-full max-w-md bg-[#121218] border border-white/[0.1] rounded-xl p-5 space-y-3 shadow-lg text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-white">
                        <BarChart3 className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Diagnostic Topic Clusters</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Synthesized</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded bg-black/60 border border-white/[0.08] space-y-1">
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>Topic 1: Onboarding Milestones</span>
                          <span className="text-[10px] font-mono text-[#F97316]">High Frequency</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Inquiries repeatedly explore standard 10-day turnaround and credential prerequisites.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-black/60 border border-white/[0.08] space-y-1">
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>Topic 2: Document Coverage Boundaries</span>
                          <span className="text-[10px] font-mono text-zinc-400">Targeted</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Questions probe edge cases outside platform scope, correctly gated by grounded documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Nav indicators */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono text-zinc-500">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="hover:text-white transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex items-center space-x-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        activeStep === i ? 'bg-[#F97316]' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="hover:text-white transition-colors"
                >
                  Next →
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
