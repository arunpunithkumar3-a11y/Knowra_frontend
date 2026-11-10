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
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  Trash2,
  CheckCircle2
} from 'lucide-react';

/**
 * Product Showcase Component
 * 
 * Faithful, interactive representation of Knowra's real product interface:
 * 1. Document Management & Ingestion (1/1 PDF capacity limit, vector chunking)
 * 2. Owner Playground Console (Testing, citation inspector, zero-hallucination)
 * 3. Widget Studio (Live customization, brand colors, floating launcher)
 * 4. Website Embed Integration (1-line script tag, async CDN, React embed)
 * 5. Diagnostic Question Insights (Topic clusters, prescriptive action plans)
 */
export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('documents');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeColor, setActiveColor] = useState('#F97316');

  const tabs = [
    { id: 'documents', label: 'Document Ingestion', icon: UploadCloud, subtitle: '1/1 Capacity PDF Base' },
    { id: 'playground', label: 'Playground & Citations', icon: Bot, subtitle: 'Document-Grounded Testing' },
    { id: 'widget', label: 'Widget Studio', icon: Palette, subtitle: 'Brand & Launcher Design' },
    { id: 'embed', label: 'Website Embed', icon: Code2, subtitle: '1-Line Async Script' },
    { id: 'insights', label: 'Question Insights', icon: BarChart3, subtitle: 'Diagnostic Topic Clusters' },
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="product-showcase" className="py-24 sm:py-32 border-t border-white/[0.08] bg-[#050508] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>REAL PRODUCT INTERFACE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Built for enterprise clarity.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            Explore the actual Knowra interface. From uploading business documentation to deploying a custom widget on your website, every capability is engineered for reliability.
          </p>
        </div>

        {/* Interactive Showcase Shell */}
        <div className="rounded-2xl border border-white/[0.12] bg-[#09090D] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden">
          
          {/* Top Tab Bar */}
          <div className="p-2 sm:p-3 bg-[#0E0E14] border-b border-white/[0.08] flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.14]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F97316]' : 'text-zinc-400'}`} />
                  <div className="text-left">
                    <span className="block font-semibold">{tab.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono hidden sm:block">{tab.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Workspace Canvas */}
          <div className="p-6 sm:p-10 min-h-[460px] bg-gradient-to-b from-[#0A0A0E] to-[#050508] flex flex-col justify-center">
            
            {/* 1. DOCUMENT MANAGEMENT */}
            {activeTab === 'documents' && (
              <div className="max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                      <span>Document Knowledge Base</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                        1/1 Active
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Upload your official corporate manual or SLA policy. Only PDF files (up to 10 pages) are indexed.
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Strict Document Partition</span>
                  </div>
                </div>

                {/* Upload Zone Card */}
                <div className="p-6 border-2 border-dashed border-[#F97316]/40 rounded-xl bg-[#F97316]/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F97316]/20 text-[#F97316] flex items-center justify-center shrink-0">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Acme_Enterprise_Support_Manual.pdf</div>
                      <div className="text-xs font-mono text-zinc-400">2.4 MB • 48 Pages • Extracted to 84 Chunks</div>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 100% Vector Indexed
                  </span>
                </div>

                {/* Real Document Table */}
                <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-black/60 font-mono text-xs">
                  <div className="px-4 py-2.5 bg-[#121218] border-b border-white/[0.06] grid grid-cols-12 text-zinc-400 font-semibold">
                    <div className="col-span-5">Document Name</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2">Pages</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="px-4 py-3.5 grid grid-cols-12 items-center text-zinc-300">
                    <div className="col-span-5 flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-red-400" />
                      <span className="text-white font-sans font-medium">Acme_Enterprise_Support_Manual.pdf</span>
                    </div>
                    <div className="col-span-3 text-emerald-400 flex items-center">
                      <Check className="w-3 h-3 mr-1 stroke-[3]" /> Grounded
                    </div>
                    <div className="col-span-2 text-zinc-400">24 / 24 pages</div>
                    <div className="col-span-2 flex justify-end">
                      <button className="text-zinc-500 hover:text-rose-400 transition-colors p-1" title="Delete Document">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. OWNER PLAYGROUND */}
            {activeTab === 'playground' && (
              <div className="max-w-4xl mx-auto w-full space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-[#F97316]" />
                    <h3 className="text-base font-bold text-white">Owner Playground — Verified Chat Sandbox</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Grounded in Acme_Enterprise_Support_Manual.pdf
                  </span>
                </div>

                {/* Chat Stream Window */}
                <div className="rounded-xl border border-white/[0.1] bg-black/70 p-5 space-y-4 min-h-[260px] text-xs font-sans">
                  <div className="flex justify-end">
                    <div className="max-w-md p-3.5 rounded-2xl rounded-tr-sm bg-[#F97316] text-black font-semibold text-xs leading-relaxed">
                      What is our SLA guarantee for Critical Incident triage under the Enterprise Plan?
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F97316] text-black flex items-center justify-center font-bold shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                    <div className="space-y-2 max-w-xl">
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-[#12121A] border border-white/[0.1] text-zinc-100 leading-relaxed space-y-2">
                        <p>
                          Under the <strong>Enterprise Plan</strong>, Critical Incident triage begins within <strong className="text-[#F97316]">15 minutes</strong> of escalation. Engineering coverage is active 24/7 with continuous milestone alerts delivered via dedicated webhook or phone bridge.
                        </p>
                      </div>

                      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#14141E] border border-white/[0.12] text-xs font-mono text-zinc-300">
                        <FileText className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Source: <strong className="text-white">Acme_Enterprise_Support_Manual.pdf</strong> (Page 14, Section 3.2)</span>
                        <span className="text-emerald-400 font-bold flex items-center pl-1">
                          <Check className="w-3 h-3 mr-0.5 stroke-[3]" /> Verified Citation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0F0F16] border border-white/[0.08] flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Enter prompt to test document retrieval...</span>
                  <div className="w-7 h-7 rounded-lg bg-[#F97316] text-black flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. WIDGET STUDIO */}
            {activeTab === 'widget' && (
              <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fadeIn">
                {/* Left Controls */}
                <div className="md:col-span-6 space-y-4 font-mono text-xs">
                  <div>
                    <h3 className="text-base font-bold text-white font-sans mb-1">Widget Studio Configuration</h3>
                    <p className="text-zinc-400 font-sans text-xs">
                      Customize how the Knowra assistant appears and greets visitors on your website.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-zinc-400 block mb-1.5">Primary Accent Color</span>
                      <div className="flex items-center space-x-2.5">
                        {['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setActiveColor(c)}
                            className={`w-7 h-7 rounded-lg transition-transform ${activeColor === c ? 'scale-110 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-400 block mb-1">Assistant Title</span>
                      <div className="p-2.5 rounded-lg bg-black/80 border border-white/[0.1] text-white font-sans text-xs">
                        Acme Support Assistant
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-400 block mb-1">Welcome Message</span>
                      <div className="p-2.5 rounded-lg bg-black/80 border border-white/[0.1] text-zinc-300 font-sans text-xs leading-relaxed">
                        Hello! How can I assist you with Acme's products, SLAs, or documentation today?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Simulator */}
                <div className="md:col-span-6">
                  <div className="w-full max-w-sm mx-auto rounded-2xl border border-white/[0.14] bg-[#0E0E14] shadow-2xl overflow-hidden text-left flex flex-col">
                    <div 
                      className="px-4 py-3 flex items-center justify-between text-white"
                      style={{ backgroundColor: activeColor }}
                    >
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-black" />
                        <span className="text-xs font-bold text-black font-sans">Acme Support Assistant</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-black/60" />
                    </div>

                    <div className="p-4 space-y-3 min-h-[180px] bg-[#0A0A0E] text-xs font-sans">
                      <div className="p-3 rounded-xl bg-[#14141C] text-zinc-200 border border-white/[0.06] text-xs leading-relaxed">
                        Hello! How can I assist you with Acme's products, SLAs, or documentation today?
                      </div>

                      <div className="pt-2 flex justify-end">
                        <div 
                          className="px-3 py-2 rounded-xl text-black font-bold text-xs"
                          style={{ backgroundColor: activeColor }}
                        >
                          How do I get an API token?
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 border-t border-white/[0.08] bg-[#0A0A0E] flex items-center space-x-2">
                      <div className="flex-grow bg-black/60 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 font-mono">
                        Ask a question...
                      </div>
                      <div 
                        className="p-1.5 rounded-lg text-black"
                        style={{ backgroundColor: activeColor }}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WEBSITE EMBED */}
            {activeTab === 'embed' && (
              <div className="max-w-4xl mx-auto w-full space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Lightweight Website Integration</h3>
                  <p className="text-xs text-zinc-400">
                    Embed Knowra on any website by adding a single lightweight script tag before the closing &lt;/body&gt; tag.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-white/[0.1] font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                    <span>HTML Embed Snippet (Any Webflow, WordPress, Shopify, or Custom Site)</span>
                    <button
                      onClick={() => handleCopy('<script src="https://cdn.knowra.ai/widget.js" data-key="kw_live_849201" async></script>')}
                      className="flex items-center space-x-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-zinc-300 leading-relaxed overflow-x-auto py-2">
                    <span className="text-zinc-600">&lt;!-- Knowra Chatbot Widget --&gt;</span><br />
                    <span className="text-emerald-400">&lt;script</span> <span className="text-[#F97316]">src</span>=<span className="text-zinc-200">&quot;https://cdn.knowra.ai/widget.js&quot;</span> <span className="text-[#F97316]">data-key</span>=<span className="text-zinc-200">&quot;kw_live_849201&quot;</span> <span className="text-[#F97316]">async</span><span className="text-emerald-400">&gt;&lt;/script&gt;</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-zinc-400">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>&lt; 15KB lightweight bundle</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Non-blocking async load</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cross-origin isolated</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CUSTOMER INSIGHTS */}
            {activeTab === 'insights' && (
              <div className="max-w-4xl mx-auto w-full space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-base font-bold text-white">Diagnostic Question Insights</h3>
                    <p className="text-xs text-zinc-400">
                      Aggregates real visitor questions and clusters them into actionable business diagnostics.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
                    42 Inquiries Analyzed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">Topic: Onboarding Milestones</span>
                      <span className="text-[#F97316] font-semibold">High Frequency (18 Inquiries)</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      Visitors repeatedly inquire about the 10-day turnaround and credential prerequisites.
                    </p>
                    <div className="p-2.5 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 text-[11px] font-sans text-orange-200">
                      <strong>Recommended Action:</strong> Publish an onboarding prerequisite checklist on your site to streamline customer setup.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">Topic: Source Grounding & Privacy</span>
                      <span className="text-emerald-400 font-semibold">Core Trust (14 Inquiries)</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      Prospects verify that chatbot answers are synthesized strictly from uploaded documentation.
                    </p>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-sans text-emerald-200">
                      <strong>Recommended Action:</strong> Verified citation badges confirm responses are directly backed by company files.
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
