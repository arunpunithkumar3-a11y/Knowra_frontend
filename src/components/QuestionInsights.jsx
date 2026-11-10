import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  RefreshCw, 
  AlertCircle, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Lightbulb, 
  Filter, 
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { getTotalQuestions, analyzeQuestionClusters, normalizeClusterInsights } from '../services/api';
import ErrorBoundary from './ErrorBoundary';

/**
 * Enterprise Question Intelligence Studio (Dark / Black Theme)
 * Diagnoses customer friction, clusters inquiries into strategic topics,
 * and formulates executive-level root cause solutions.
 */
function QuestionInsightsContent({ business }) {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Range selection state
  const [startIdx, setStartIdx] = useState(1);
  const [endIdx, setEndIdx] = useState(25);
  
  // Analysis results: Array<{ topic: string, insight: string }>
  const [clusterResults, setClusterResults] = useState(null);
  const [lastAnalyzedRange, setLastAnalyzedRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // Fetch Total Questions Count
  const fetchTotalQuestions = async () => {
    setLoadingCount(true);
    setError('');
    try {
      const count = await getTotalQuestions(business.uid);
      setTotalQuestions(count);
      if (count > 0) {
        setStartIdx(1);
        setEndIdx(Math.min(count, 50));
      }
    } catch (err) {
      console.warn('Failed to fetch total questions:', err);
      setError(err.message || 'Failed to retrieve question count.');
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    fetchTotalQuestions();
  }, [business.uid]);

  // Quick Preset Handlers
  const applyPreset = (count) => {
    if (totalQuestions === 0) return;
    const targetEnd = Math.min(totalQuestions, count);
    setStartIdx(1);
    setEndIdx(targetEnd);
  };

  // Run Clustering Analysis
  const handleRunAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (totalQuestions === 0) {
      setError('No customer questions recorded yet. Test your chatbot in the Playground or via the Widget to log questions.');
      return;
    }

    const start = parseInt(startIdx, 10);
    const end = parseInt(endIdx, 10);

    if (isNaN(start) || start < 1) {
      setError('Start index must be at least 1.');
      return;
    }
    if (isNaN(end) || end < start) {
      setError('End index must be greater than or equal to Start index.');
      return;
    }
    const rangeSize = end - start + 1;
    if (rangeSize > 100) {
      setError(`Batch range cannot exceed 100 questions per request (selected: ${rangeSize}).`);
      return;
    }
    if (end > totalQuestions) {
      setError(`End index (${end}) exceeds total recorded questions (${totalQuestions}).`);
      return;
    }

    setAnalyzing(true);
    setError('');
    setSuccessMsg('');

    try {
      const results = await analyzeQuestionClusters(business.uid, start, end);
      const normalized = normalizeClusterInsights(results);
      setClusterResults(normalized);
      setLastAnalyzedRange({ start, end, total: rangeSize });
      setSuccessMsg(`Successfully synthesized ${rangeSize} queries across ${normalized.length} strategic topic clusters.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Clustering error:', err);
      setError(err.message || 'Failed to complete question clustering analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Copy individual card insight
  const handleCopyInsight = (topic, text) => {
    const textStr = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`### ${topic}\n${textStr}`);
    }
    setCopiedKey(topic);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export full report as Markdown
  const handleExportMarkdown = () => {
    const list = normalizeClusterInsights(clusterResults);
    if (!list.length) return;
    let md = `# Executive Question Intelligence & Root Cause Analysis\n\n`;
    md += `**Organization:** ${business.business_name || 'Business Workspace'}\n`;
    md += `**Generated:** ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    if (lastAnalyzedRange) {
      md += `**Scope:** Customer Queries #${lastAnalyzedRange.start} through #${lastAnalyzedRange.end} (${lastAnalyzedRange.total} total queries)\n\n`;
    }
    md += `## Strategic Topics & Prescriptive Business Actions\n\n`;
    
    list.forEach(({ topic, insight }, idx) => {
      const safeInsight = typeof insight === 'string' ? insight : JSON.stringify(insight, null, 2);
      md += `### ${idx + 1}. ${topic}\n\n`;
      md += `${safeInsight}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(business.business_name || 'knowra').replace(/\s+/g, '_')}_topic_insights_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Defensively normalized topics list
  const normalizedTopics = useMemo(() => {
    return normalizeClusterInsights(clusterResults);
  }, [clusterResults]);

  // Filter topics based on search query
  const filteredTopics = normalizedTopics.filter(({ topic, insight }) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const t = String(topic || '').toLowerCase();
    const i = String(insight || '').toLowerCase();
    return t.includes(query) || i.includes(query);
  });

  const rangeCount = Math.max(0, (parseInt(endIdx, 10) || 0) - (parseInt(startIdx, 10) || 0) + 1);

  return (
    <div className="space-y-5 font-sans">
      
      {/* Top Banner / Feature Overview */}
      <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-base font-bold text-white tracking-tight">
              Customer Question Insights
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 font-medium border border-white/[0.08]">
              Diagnostic Clustering
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Synthesize real customer inquiries into thematic topic clusters. Diagnose information gaps, quantify churn risk, and generate prescriptive fixes.
          </p>
        </div>

        {/* Total Questions Counter */}
        <div className="flex items-center space-x-3 bg-[#121214] border border-white/[0.08] rounded-md px-3.5 py-2 shrink-0">
          <div className="w-8 h-8 rounded bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white font-mono">
                {loadingCount ? '...' : totalQuestions}
              </span>
              <button
                onClick={fetchTotalQuestions}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Refresh Total Questions"
              >
                <RefreshCw className={`w-3 h-3 ${loadingCount ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Total Logged Queries
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel: Batch Configuration */}
      <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
            Analysis Batch Range
          </span>

          {/* Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono">
            <span className="text-zinc-500 mr-1">Presets:</span>
            {[10, 25, 50, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyPreset(preset)}
                disabled={totalQuestions === 0 || analyzing}
                className="px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-40 transition-colors"
              >
                Top {preset}
              </button>
            ))}
            {totalQuestions > 0 && totalQuestions <= 100 && (
              <button
                type="button"
                onClick={() => applyPreset(totalQuestions)}
                disabled={analyzing}
                className="px-2 py-0.5 rounded bg-[#F97316] text-black font-bold text-[11px] shadow-subtle"
              >
                All ({totalQuestions})
              </button>
            )}
          </div>
        </div>

        {/* Inputs & Action Form */}
        <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          
          <div className="sm:col-span-3">
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Start Query # (Min: 1)
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(1, totalQuestions)}
              value={startIdx}
              onChange={(e) => setStartIdx(e.target.value)}
              disabled={analyzing || totalQuestions === 0}
              className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              End Query # (Max: {totalQuestions || 0})
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(1, totalQuestions)}
              value={endIdx}
              onChange={(e) => setEndIdx(e.target.value)}
              disabled={analyzing || totalQuestions === 0}
              className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <div className={`w-full py-1.5 px-3 rounded-md border text-xs font-mono flex items-center justify-between ${
              rangeCount > 100 || rangeCount < 1
                ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                : 'bg-[#141416] border-white/[0.08] text-zinc-300'
            }`}>
              <span>Batch Scope:</span>
              <span className="font-semibold text-white">{rangeCount} queries</span>
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={analyzing || totalQuestions === 0 || rangeCount > 100 || rangeCount < 1}
              className="w-full py-1.5 px-3.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-black text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 shadow-[0_2px_12px_rgba(249,115,22,0.35)] cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Run Cluster Analysis</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Notifications */}
        {error && (
          <div className="p-3 rounded-md bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-md bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {analyzing ? (
        <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-16 text-center space-y-2.5 shadow-subtle">
          <RefreshCw className="w-6 h-6 animate-spin text-white mx-auto" />
          <h4 className="text-sm font-semibold text-white">Analyzing Question Clusters</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
            Evaluating friction points, diagnosing root causes, and prescribing actionable fixes...
          </p>
        </div>
      ) : clusterResults ? (
        <div className="space-y-4">
          
          {/* Results Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-3.5 shadow-subtle">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="font-semibold text-white">
                {normalizedTopics.length} Topics Discovered
              </span>
              {lastAnalyzedRange && (
                <span className="text-zinc-500">
                  (Queries #{lastAnalyzedRange.start} – #{lastAnalyzedRange.end})
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#141416] border border-white/[0.1] rounded-md pl-7 pr-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 w-44 sm:w-56"
                />
              </div>

              <button
                onClick={handleExportMarkdown}
                disabled={normalizedTopics.length === 0}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-md border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-40 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Download Markdown Report"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Topic Cards Grid */}
          {normalizedTopics.length === 0 ? (
            <div className="text-center py-10 bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-6 text-zinc-400 text-xs">
              <Layers className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
              <p className="font-semibold text-white mb-1">No Topic Clusters Formed</p>
              <p>The analysis completed, but no distinct topic clusters could be formulated for this range.</p>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-10 bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-6 text-zinc-400 text-xs">
              <Filter className="w-4 h-4 text-zinc-500 mx-auto mb-1.5" />
              <p>No topic clusters match "{searchQuery}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map(({ topic, insight }, idx) => {
                const isCopied = copiedKey === topic;
                const safeTopic = String(topic || `Topic ${idx + 1}`);
                const safeInsight = typeof insight === 'string' ? insight : JSON.stringify(insight);
                return (
                  <div
                    key={`${safeTopic}-${idx}`}
                    className="bg-[#0C0C0E] border border-white/[0.08] hover:border-white/[0.22] rounded-lg p-4 shadow-subtle transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Topic Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded bg-white/[0.08] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-semibold text-white">
                            {safeTopic}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleCopyInsight(safeTopic, safeInsight)}
                          className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0 cursor-pointer"
                          title="Copy Topic Insight"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Strategic Insight Text */}
                      <div className="p-3 rounded-md bg-[#141416] border border-white/[0.06] text-xs text-[#D4D4D8] leading-relaxed font-normal">
                        <p>{safeInsight}</p>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <Lightbulb className="w-3 h-3 text-white" />
                        <span>Prescriptive Action</span>
                      </span>
                      <span className="text-emerald-400 font-medium">Grounded</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#08080A] border border-dashed border-white/[0.1] rounded-lg p-10 text-center space-y-2.5">
          <div className="w-9 h-9 rounded-md bg-white/[0.06] border border-white/[0.1] text-white flex items-center justify-center mx-auto shadow-subtle">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-white">No Intelligence Generated Yet</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {totalQuestions > 0
                ? `You have ${totalQuestions} customer queries logged. Click "Run Cluster Analysis" above to formulate strategic findings.`
                : `Questions asked via the Owner Playground or the embedded website widget are automatically logged here for topic clustering.`}
            </p>
          </div>
          {totalQuestions > 0 && (
            <button
              onClick={handleRunAnalysis}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-black text-xs font-bold font-mono transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)] cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analyze Top Questions</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export default function QuestionInsights(props) {
  return (
    <ErrorBoundary>
      <QuestionInsightsContent {...props} />
    </ErrorBoundary>
  );
}
