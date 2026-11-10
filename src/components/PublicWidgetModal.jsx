import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, RotateCcw, Layers } from 'lucide-react';
import { streamWidgetChat, getWidgetInfo, clearChatHistory } from '../services/api';
import MarkdownMessage from './MarkdownMessage';

/**
 * Public Chatbot Widget Test Modal (Dark / Black Theme)
 */
export default function PublicWidgetModal({ publicKey, onClose }) {
  const [info, setInfo] = useState({
    business_name: 'Knowledge Assistant',
    welcome_message: 'Hello. How can I assist you today?',
    primary_color: '#F97316'
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [threadId, setThreadId] = useState(() => `widget_thread_${Date.now()}`);
  const bottomRef = useRef(null);

  const handleReset = async () => {
    if (isStreaming) return;
    try {
      await clearChatHistory(threadId);
    } catch (e) {}
    setThreadId(`widget_thread_${Date.now()}`);
    setMessages([
      { role: 'assistant', content: info.welcome_message || 'Hello. How can I assist you today?' }
    ]);
    setInput('');
  };

  useEffect(() => {
    async function loadInfo() {
      try {
        const data = await getWidgetInfo(publicKey);
        if (data) {
          setInfo(data);
          setMessages([{ role: 'assistant', content: data.welcome_message || 'Hello. How can I assist you today?' }]);
        }
      } catch (e) {
        setMessages([{ role: 'assistant', content: `Welcome. Grounded knowledge assistant active for key: \`${publicKey}\`. Feel free to ask any question.` }]);
      }
    }
    loadInfo();
  }, [publicKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    try {
      await streamWidgetChat(
        publicKey,
        userText,
        threadId,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            if (last >= 0 && updated[last].role === 'assistant') {
              updated[last] = { ...updated[last], content: updated[last].content + chunk };
            }
            return updated;
          });
        },
        () => setIsStreaming(false),
        (err) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            if (last >= 0) {
              updated[last] = { 
                role: 'assistant', 
                content: `> [!WARNING]\n> ${err.message || 'Unable to retrieve answer. Please try again.'}` 
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0C0C0E] border border-white/[0.12] rounded-xl max-w-xl sm:max-w-2xl w-full h-[680px] max-h-[90vh] shadow-modal flex flex-col overflow-hidden relative">
        
        {/* Widget Header */}
        <div className="px-5 py-3.5 bg-[#111114] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] text-black flex items-center justify-center shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
              <Layers className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                {info.business_name}
              </h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block animate-pulse" />
                Live • Grounded Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={handleReset}
              disabled={isStreaming}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-40"
              title="Reset conversation and start fresh"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-black">
          {messages.map((m, i) => {
            const isLatestBot = m.role === 'assistant' && i === messages.length - 1;
            return (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#F97316] text-black font-semibold shadow-subtle'
                      : 'bg-[#141416] border border-white/[0.08] text-white'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <MarkdownMessage
                      content={m.content}
                      isStreaming={isStreaming && isLatestBot}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3.5 bg-[#0C0C0E] border-t border-white/[0.08] flex space-x-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-grow bg-[#141416] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-4 py-2.5 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-black font-bold rounded-lg text-sm shadow-[0_2px_12px_rgba(249,115,22,0.35)] transition-all flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
