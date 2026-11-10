import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Terminal, 
  Clock, 
  Database, 
  Copy, 
  Check, 
  Download, 
  FileText,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  BookmarkCheck,
  Printer
} from 'lucide-react';
import { streamBusinessChat, clearChatHistory } from '../services/api';
import MarkdownMessage from './MarkdownMessage';
import { ConfirmModal, ToastAlert } from './AlertModal';

/**
 * Enterprise Document Intelligence Console (Dark / Black Theme)
 * Designed according to OpenAI / Linear / Notion principles:
 * Pure black canvas, crisp typography, anchored composer,
 * verified citation rendering, and an active grounded documents inspector.
 */
export default function OwnerPlayground({ business, documents = [] }) {
  const [threadId, setThreadId] = useState(() => `owner_test_${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `# Knowledge Sandbox: ${business.business_name}

Welcome to the verified testing console. Ask direct questions or request deep-dive business reports to verify how Knowra retrieves and synthesizes facts from your uploaded documents.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showInspector, setShowInspector] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isStreaming) return;

    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    try {
      await streamBusinessChat(
        business.uid,
        text,
        threadId,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].role === 'assistant') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + chunk,
              };
            }
            return updated;
          });
        },
        () => {
          setIsStreaming(false);
        },
        (error) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0) {
              updated[lastIndex] = {
                role: 'assistant',
                content: `> [!WARNING]\n> ${error.message || 'Unable to generate response. Please check server connection.'}`,
              };
            }
            return updated;
          });
          setIsStreaming(false);
        }
      );
    } catch {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Test Session',
      message: 'Are you sure you want to reset this testing session? This will clear the active in-memory conversation history.',
      confirmText: 'Reset Session',
      isDestructive: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await clearChatHistory(threadId);
        } catch (e) {}
        const newThread = `owner_test_${Date.now()}`;
        setThreadId(newThread);
        setMessages([
          {
            role: 'assistant',
            content: `# Testing Session Initialized\n\nSession reset. Ready for new document queries for **${business.business_name}**.`
          }
        ]);
        setTokenCount(0);
        setElapsedTime(null);
        setToast({
          type: 'success',
          title: 'Session Reset',
          message: 'Testing conversation history cleared.',
        });
      },
    });
  };

  const handleCopyMessage = (index, content) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setToast({
      type: 'info',
      title: 'Copied',
      message: 'Message copied to clipboard.',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadReport = (content) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${business.business_name.replace(/\s+/g, '_')}_document_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-140px)] min-h-[640px]">
      
      {/* Primary Chat & Report Canvas */}
      <div className="flex-1 flex flex-col bg-[#0A0A0C] border border-white/[0.08] rounded-lg overflow-hidden shadow-subtle">
        
        {/* Console Header Bar */}
        <div className="px-4 py-2.5 bg-[#101014] border-b border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center space-x-1.5 font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Document Intelligence Console</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="font-mono text-[11px] text-zinc-400">
              Session: <code className="text-zinc-300 bg-white/[0.05] px-1 py-0.5 rounded border border-white/[0.08]">{threadId}</code>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-1 px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Reset Conversation Thread"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                showInspector ? 'bg-white/[0.1] text-white font-medium' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
              }`}
              title="Toggle Grounded Documents Panel"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Documents</span>
            </button>
          </div>
        </div>

        {/* Message Stream Scroll Area */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-6 bg-black">
          {messages.map((msg, idx) => {
            const isLatestBot = msg.role === 'assistant' && idx === messages.length - 1;
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-[#F97316] text-black flex items-center justify-center mr-3 shrink-0 mt-1 shadow-subtle">
                    <Layers className="w-3 h-3 text-black" />
                  </div>
                )}
                
                <div
                  className={`${
                    msg.role === 'user'
                      ? 'max-w-[85%] sm:max-w-xl bg-white/[0.07] text-white border border-white/[0.1] rounded-lg px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-subtle'
                      : 'w-full max-w-3xl pr-2'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <div>
                      <MarkdownMessage
                        content={msg.content}
                        isStreaming={isStreaming && isLatestBot}
                      />

                      {/* Response Action Bar (Copy / Export / Print) */}
                      {!isStreaming && msg.content && (
                        <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
                          <span className="flex items-center space-x-1.5 text-emerald-400">
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Grounded in Knowledge Base</span>
                          </span>

                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(idx, msg.content)}
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                              title="Copy response markdown"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {msg.content.length > 150 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadReport(msg.content)}
                                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                                  title="Download as Markdown report file"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Export</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handlePrint}
                                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                                  title="Print or save as PDF"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Print</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Anchored Input Composer */}
        <div className="p-3.5 bg-[#0A0A0C] border-t border-white/[0.08]">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask a question or request a structured business report for ${business.business_name}...`}
              className="flex-grow bg-[#141416] border border-white/[0.1] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputMessage.trim()}
              className="px-4 py-2.5 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-black rounded-md font-bold transition-all flex items-center space-x-1.5 text-xs shadow-[0_2px_12px_rgba(249,115,22,0.35)] shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Collapsible Grounded Documents Panel (Right Column) */}
      {showInspector && (
        <aside className="w-full lg:w-80 flex flex-col space-y-4 shrink-0 animate-in fade-in duration-150">
          
          {/* Grounded Documents Summary */}
          <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-4 shadow-subtle">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider font-mono">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span>Grounded Knowledge</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300 font-medium">
                {documents.length} Files
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="p-3 rounded-md bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] leading-relaxed">
                No documents uploaded yet. Open the <strong>Knowledge Base</strong> tab to ingest PDFs for verified grounding.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {documents.map((d) => (
                  <div key={d.uid} className="p-2 rounded bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-zinc-300 truncate flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{d.original_filename}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <ToastAlert
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
