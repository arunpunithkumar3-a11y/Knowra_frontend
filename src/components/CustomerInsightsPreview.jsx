import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Lightbulb, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText,
  HelpCircle,
  Layers
} from 'lucide-react';

/**
 * Customer Insights Preview Component (Section 5)
 * 
 * Accurately models the application's actual QuestionInsights interface:
 * - Diagnostic topic clustering
 * - Synthesized inquiry analysis
 * - Prescriptive business action recommendations
 * - Strictly identified as "Interactive Preview • Illustrative Sample Data"
 * - Zero fake performance percentages, zero fake customer counts, zero fake revenue claims.
 */
export default function CustomerInsightsPreview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);

  // Realistic sample topic clusters strictly illustrative of real QuestionInsights output
  const sampleClusters = [
    {
      id: 'cluster-1',
      category: 'onboarding',
      topic: 'Onboarding Milestones & Pre-requisites',
      inquirySummary: 'Visitors frequently ask about the estimated 10-day onboarding timeline and which system credentials or data dictionaries are required upfront.',
      prescriptiveAction: 'Publish the onboarding prerequisite checklist directly on your documentation landing page to streamline customer setup expectations.',
      frequencyTag: 'High Inquiries'
    },
    {
      id: 'cluster-2',
      category: 'security',
      topic: 'Data Privacy & Strict Source Grounding',
      inquirySummary: 'Prospects inquire whether answers are strictly synthesized from uploaded corporate PDFs without pulling external unverified information.',
      prescriptiveAction: 'Highlight verified citation badges in public responses to reassure customers that answers are strictly grounded in company files.',
      frequencyTag: 'Core Inquiries'
    },
    {
      id: 'cluster-3',
      category: 'connectors',
      topic: 'Data Setup & Connector Configuration',
      inquirySummary: 'Users ask whether external data connectors can be configured independently or if technical engineering onboarding is mandatory.',
      prescriptiveAction: 'Clarify self-service connector requirements versus guided onboarding in your reference PDF.',
      frequencyTag: 'Technical Inquiries'
    },
    {
      id: 'cluster-4',
      category: 'scope',
      topic: 'Service Scope & Feature Boundaries',
      inquirySummary: 'Visitors test boundary questions about custom development and bespoke services outside the standard product tier.',
      prescriptiveAction: 'Document explicit service boundaries and tier limits in your uploaded documentation to prevent expectation mismatches.',
      frequencyTag: 'Boundary Inquiries'
    }
  ];

  const filteredClusters = useMemo(() => {
    return sampleClusters.filter((c) => {
      const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
        c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.inquirySummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.prescriptiveAction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleCopyInsight = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="insights" className="py-20 sm:py-28 border-t border-white/[0.08] bg-black relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>Interactive Preview • Illustrative Sample Data</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Customer Question Insights
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            Knowra aggregates inquiries asked by visitors on your website and groups them into diagnostic topic clusters with actionable recommendations.
          </p>
        </div>

        {/* Console Container */}
        <div className="rounded-xl border border-white/[0.1] bg-[#0A0A0E] p-5 sm:p-7 shadow-2xl space-y-6">
          
          {/* Controls Bar: Search & Category Chips */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#F97316] text-black font-bold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                All Topics ({sampleClusters.length})
              </button>
              <button
                onClick={() => setActiveCategory('onboarding')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeCategory === 'onboarding'
                    ? 'bg-[#F97316] text-black font-bold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                Onboarding
              </button>
              <button
                onClick={() => setActiveCategory('security')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeCategory === 'security'
                    ? 'bg-[#F97316] text-black font-bold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                Data Privacy
              </button>
              <button
                onClick={() => setActiveCategory('scope')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeCategory === 'scope'
                    ? 'bg-[#F97316] text-black font-bold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                Service Scope
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter sample topics..."
                className="w-full bg-[#121216] border border-white/[0.1] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F97316]/50"
              />
            </div>

          </div>

          {/* Diagnostic Topic Cluster Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClusters.map((cluster, idx) => {
              const isCopied = copiedKey === cluster.id;
              return (
                <div
                  key={cluster.id}
                  className="rounded-xl bg-[#0F0F14] border border-white/[0.08] hover:border-white/[0.18] p-5 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-md bg-white/[0.06] text-[#F97316] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-white/[0.08]">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                            {cluster.topic}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {cluster.frequencyTag}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyInsight(cluster.id, `${cluster.topic}: ${cluster.prescriptiveAction}`)}
                        className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
                        title="Copy topic insight"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Inquiry Pattern Summary */}
                    <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-sans">
                      <span className="text-zinc-500 block text-[10px] font-mono uppercase tracking-wider mb-1">
                        Visitor Inquiry Pattern
                      </span>
                      <p>{cluster.inquirySummary}</p>
                    </div>

                    {/* Prescriptive Recommendation */}
                    <div className="p-3 rounded-lg bg-[#14141A] border border-[#F97316]/20 text-xs text-zinc-200 leading-relaxed font-sans">
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F97316] font-semibold mb-1">
                        <Lightbulb className="w-3 h-3 text-[#F97316]" />
                        <span>Recommended Documentation Action</span>
                      </div>
                      <p>{cluster.prescriptiveAction}</p>
                    </div>

                  </div>

                  {/* Grounding metadata */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Diagnostic Topic Clustering</span>
                    <span className="text-emerald-400 font-medium">Verified Grounding</span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-xs font-mono text-zinc-500">
            Questions logged from public website widgets are synthesized in your private Knowra workspace.
          </div>

        </div>

      </div>
    </section>
  );
}
