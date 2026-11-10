import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Bot, 
  Send, 
  Palette, 
  Layout, 
  Globe, 
  Key, 
  Layers,
  RotateCcw
} from 'lucide-react';
import { streamWidgetChat, getApiBaseUrl, clearChatHistory } from '../services/api';
import MarkdownMessage from './MarkdownMessage';

function isColorLight(hex) {
  if (!hex || typeof hex !== 'string') return false;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 160;
}

/**
 * Enterprise Website Chatbot Widget Studio (Dark / Black Theme)
 * Clean split workspace: Left configuration controls, Center live website simulator,
 * Bottom integration code snippets (HTML + React).
 */
export default function WidgetStudio({ business }) {
  const [config, setConfig] = useState({
    title: business.business_name || 'Knowledge Assistant',
    welcomeMessage: business.welcome_message || `Hello. How can I assist you with ${business.business_name || 'our company documentation'} today?`,
    primaryColor: business.primary_color || '#F97316',
    position: 'bottom-right',
    starterPrompt: 'What services or documentation are available?',
  });

  const [activeCodeTab, setActiveCodeTab] = useState('html'); // 'html' | 'react'
  const [copied, setCopied] = useState(false);

  // Live Simulator Chat State
  const [simOpen, setSimOpen] = useState(true);
  const [simMessages, setSimMessages] = useState([]);
  const [simInput, setSimInput] = useState('');
  const [isSimStreaming, setIsSimStreaming] = useState(false);
  const [threadId, setThreadId] = useState(() => `sim_widget_${Date.now()}`);
  const simBottomRef = useRef(null);

  const handleResetSim = async () => {
    if (isSimStreaming) return;
    try {
      await clearChatHistory(threadId);
    } catch {}
    setThreadId(`sim_widget_${Date.now()}`);
    setSimMessages([
      { role: 'assistant', content: config.welcomeMessage }
    ]);
    setSimInput('');
  };

  const colorPresets = [
    { 
      name: 'Orange', 
      hex: '#F97316', 
      description: 'Bold, energetic, and attention-grabbing. Great for creative agencies, sports, and e-commerce.' 
    },
    { name: 'Monochrome Dark', hex: '#09090B', description: 'Understated, minimal, and stealth modern.' },
    { name: 'Slate Gray', hex: '#334155', description: 'Balanced corporate slate for software & B2B SaaS.' },
    { name: 'Deep Navy', hex: '#0F172A', description: 'Authoritative and trustworthy for finance and legal.' },
    { name: 'Emerald', hex: '#047857', description: 'Natural, clean, and optimistic for fintech and health.' },
  ];

  // Initialize messages with welcome message
  useEffect(() => {
    setSimMessages([
      { role: 'assistant', content: config.welcomeMessage }
    ]);
  }, [config.welcomeMessage]);

  useEffect(() => {
    simBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simMessages, isSimStreaming]);

  // Handle Chat in Live Simulation
  const handleSimSend = async (textToSend) => {
    const text = textToSend || simInput;
    if (!text.trim() || isSimStreaming) return;

    setSimInput('');
    setSimMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSimMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    setIsSimStreaming(true);

    try {
      await streamWidgetChat(
        business.public_key,
        text,
        threadId,
        (chunk) => {
          setSimMessages((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            if (last >= 0 && updated[last].role === 'assistant') {
              updated[last] = { ...updated[last], content: updated[last].content + chunk };
            }
            return updated;
          });
        },
        () => setIsSimStreaming(false),
        (err) => {
          setSimMessages((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            if (last >= 0) {
              updated[last] = { 
                role: 'assistant', 
                content: `> [!WARNING]\n> ${err.message || 'Unable to connect to assistant. Please try again.'}` 
              };
            }
            return updated;
          });
          setIsSimStreaming(false);
        }
      );
    } catch {
      setIsSimStreaming(false);
    }
  };

  const baseUrl = getApiBaseUrl();

  const escapeAttr = (str) => (str || '').replace(/"/g, '&quot;');

  const htmlEmbedSnippet = `<!-- Knowra Enterprise Chatbot Widget -->
<script
  src="${window.location.origin}/widget.js"
  data-public-key="${business.public_key}"
  data-api-url="${baseUrl}"
  data-primary-color="${config.primaryColor}"
  data-position="${config.position}"
  data-title="${escapeAttr(config.title)}"
  data-welcome-message="${escapeAttr(config.welcomeMessage)}"
  data-starter-prompt="${escapeAttr(config.starterPrompt)}"
  async
></script>`;

  const reactSnippet = `import { useEffect } from 'react';

export default function KnowraChatbotWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "${window.location.origin}/widget.js";
    script.setAttribute('data-public-key', '${business.public_key}');
    script.setAttribute('data-api-url', '${baseUrl}');
    script.setAttribute('data-primary-color', '${config.primaryColor}');
    script.setAttribute('data-position', '${config.position}');
    script.setAttribute('data-title', ${JSON.stringify(config.title)});
    script.setAttribute('data-welcome-message', ${JSON.stringify(config.welcomeMessage)});
    script.setAttribute('data-starter-prompt', ${JSON.stringify(config.starterPrompt)});
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById('knowra-widget-container')?.remove();
    };
  }, []);

  return null;
}`;

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Website Chatbot Widget Studio
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 font-medium border border-white/[0.08]">
              Embeddable Agent
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Configure branding, positioning, and initial greeting before embedding into your website.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-md bg-[#121214] border border-white/[0.08] flex items-center space-x-2">
            <Key className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-500">Public Key:</span>
            <span className="text-white font-semibold">{business.public_key}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls / Right Live Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Widget Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono pb-2.5 border-b border-white/[0.08] flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-white" />
              <span>Appearance & Copy</span>
            </h4>

            {/* Title / Bot Name */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Widget Title / Assistant Name
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>

            {/* Welcome Message */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Welcome Message
              </label>
              <textarea
                rows={2}
                value={config.welcomeMessage}
                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                className="w-full bg-[#141416] border border-white/[0.1] rounded-md p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
              />
            </div>

            {/* Color Palette Presets */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setConfig({ ...config, primaryColor: c.hex })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      config.primaryColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-sm ring-2 ring-[#F97316]/50'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name}: ${c.description || ''}`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="w-24 bg-[#141416] border border-white/[0.1] rounded-md px-2 py-1 text-xs text-white font-mono uppercase"
                />
              </div>
              {(() => {
                const activeP = colorPresets.find(p => p.hex.toLowerCase() === config.primaryColor.toLowerCase());
                return activeP?.description ? (
                  <p className="text-[11px] text-zinc-400 mt-2 font-sans leading-relaxed">
                    <span className="text-[#F97316] font-semibold">{activeP.name}:</span> {activeP.description}
                  </p>
                ) : null;
              })()}
            </div>

            {/* Position Picker */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5 flex items-center space-x-1.5">
                <Layout className="w-3.5 h-3.5 text-zinc-400" />
                <span>Screen Placement</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, position: 'bottom-right' })}
                  className={`py-1.5 rounded-md text-xs font-mono border transition-all ${
                    config.position === 'bottom-right'
                      ? 'bg-[#F97316] text-black font-bold border-[#F97316] shadow-[0_1px_8px_rgba(249,115,22,0.35)]'
                      : 'bg-[#141416] border-white/[0.08] text-zinc-400 hover:text-white'
                  }`}
                >
                  Bottom Right (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, position: 'bottom-left' })}
                  className={`py-1.5 rounded-md text-xs font-mono border transition-all ${
                    config.position === 'bottom-left'
                      ? 'bg-[#F97316] text-black font-bold border-[#F97316] shadow-[0_1px_8px_rgba(249,115,22,0.35)]'
                      : 'bg-[#141416] border-white/[0.08] text-zinc-400 hover:text-white'
                  }`}
                >
                  Bottom Left
                </button>
              </div>
            </div>

            {/* Suggested Starter Question */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Suggested Starter Prompt
              </label>
              <input
                type="text"
                value={config.starterPrompt}
                onChange={(e) => setConfig({ ...config, starterPrompt: e.target.value })}
                className="w-full bg-[#141416] border border-white/[0.1] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>

          </div>

        </div>

        {/* Right Column: Live Simulated Website Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-white uppercase flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-white" />
              Live Interactive Simulator
            </span>
            <span className="text-zinc-500">
              Updates in real-time
            </span>
          </div>

          {/* Simulated Browser Frame */}
          <div className="rounded-lg border border-white/[0.12] bg-[#0A0A0C] shadow-subtle overflow-hidden relative min-h-[660px] flex flex-col justify-between">
            
            {/* Browser Header Bar */}
            <div className="bg-[#121214] px-3.5 py-2 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="px-2.5 py-0.5 bg-black border border-white/[0.08] rounded text-[10px] font-mono text-zinc-400 flex items-center space-x-1.5 w-60 truncate">
                  <Globe className="w-3 h-3 text-zinc-500" />
                  <span>https://www.{business.business_name?.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span>
                </div>
              </div>
            </div>

            {/* Simulated Website Canvas */}
            <div className="p-6 relative flex-grow bg-black">
              <div className="max-w-md space-y-3 opacity-20">
                <div className="h-3.5 w-24 bg-white/40 rounded" />
                <div className="h-6 w-3/4 bg-white/20 rounded" />
                <div className="h-2.5 w-full bg-white/20 rounded" />
                <div className="h-2.5 w-4/5 bg-white/20 rounded" />
              </div>

              {/* Floating Widget Popup (Inside Simulator - Enlarged & Spacious) */}
              {simOpen && (
                <div
                  className={`absolute bottom-20 ${
                    config.position === 'bottom-left' ? 'left-6' : 'right-6'
                  } w-[360px] sm:w-[420px] h-[520px] sm:h-[540px] bg-[#0E0E10] border border-white/[0.12] rounded-xl shadow-modal flex flex-col overflow-hidden z-20`}
                >
                  {/* Widget Header */}
                  <div 
                    className="px-4 py-3 flex items-center justify-between text-white border-b border-white/[0.08]"
                    style={{ backgroundColor: config.primaryColor === '#09090B' ? '#141416' : config.primaryColor }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs sm:text-[13px] font-semibold font-sans truncate max-w-[240px]">
                        {config.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={handleResetSim}
                        disabled={isSimStreaming}
                        className="p-1 rounded text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors disabled:opacity-40"
                        title="Reset conversation and start fresh"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimOpen(false)}
                        className="p-1 rounded text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors text-xs font-mono"
                        title="Close preview window"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-grow p-4 overflow-y-auto space-y-3 text-[13px] bg-[#0A0A0C]">
                    {simMessages.map((msg, i) => {
                      const isLatestBot = msg.role === 'assistant' && i === simMessages.length - 1;
                      return (
                        <div
                          key={i}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-lg px-3.5 py-2 leading-relaxed text-[13px] ${
                              msg.role === 'user'
                                ? 'bg-[#F97316] text-black font-semibold shadow-subtle'
                                : 'bg-[#141416] border border-white/[0.08] text-[#EDEDED]'
                            }`}
                          >
                            {msg.role === 'user' ? (
                              <p>{msg.content}</p>
                            ) : (
                              <MarkdownMessage
                                content={msg.content}
                                isStreaming={isSimStreaming && isLatestBot}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={simBottomRef} />
                  </div>

                  {/* Starter Prompt Chip */}
                  {config.starterPrompt && (
                    <div className="px-3.5 py-1.5 bg-[#121214] border-t border-white/[0.08]">
                      <button
                        onClick={() => handleSimSend(config.starterPrompt)}
                        disabled={isSimStreaming}
                        className="text-[11px] font-mono text-zinc-400 hover:text-white truncate max-w-full text-left"
                      >
                        💡 "{config.starterPrompt}"
                      </button>
                    </div>
                  )}

                  {/* Input form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSimSend(); }} className="p-2.5 bg-[#0E0E10] border-t border-white/[0.08] flex space-x-2">
                    <input
                      type="text"
                      value={simInput}
                      onChange={(e) => setSimInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-grow bg-[#16161A] border border-white/[0.1] rounded px-3 py-1.5 text-xs sm:text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                    <button
                      type="submit"
                      disabled={isSimStreaming || !simInput.trim()}
                      className="px-3 py-1.5 rounded bg-[#F97316] hover:bg-[#EA580C] text-black text-xs font-semibold disabled:opacity-40 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* Floating Widget Launcher Button */}
              {(() => {
                const isDarkPrimary = config.primaryColor === '#09090B' || config.primaryColor === '#000000' || config.primaryColor === '#111111';
                const launcherBg = isDarkPrimary ? '#FFFFFF' : config.primaryColor;
                const launcherFg = isDarkPrimary ? '#000000' : (isColorLight(config.primaryColor) ? '#000000' : '#FFFFFF');
                return (
                  <button
                    onClick={() => setSimOpen(!simOpen)}
                    style={{ backgroundColor: launcherBg, color: launcherFg }}
                    className={`absolute bottom-6 ${
                      config.position === 'bottom-left' ? 'left-6' : 'right-6'
                    } w-12 h-12 rounded-full shadow-elevated flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-10 cursor-pointer`}
                    title="Toggle Live Chatbot"
                  >
                    <Bot className="w-5 h-5" />
                  </button>
                );
              })()}
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Section: Code Export & Embed Methods */}
      <div className="bg-[#0A0A0C] border border-white/[0.08] rounded-lg p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] mb-3.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white font-mono uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-zinc-400" />
            <span>Embed Integration Code</span>
          </div>

          <div className="flex items-center space-x-1 p-0.5 bg-black rounded-md border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('html')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                activeCodeTab === 'html' ? 'bg-[#F97316] text-black font-bold shadow-subtle' : 'text-zinc-400 hover:text-white'
              }`}
            >
              HTML Script
            </button>
            <button
              onClick={() => setActiveCodeTab('react')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                activeCodeTab === 'react' ? 'bg-[#F97316] text-black font-bold shadow-subtle' : 'text-zinc-400 hover:text-white'
              }`}
            >
              React / Next.js
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-md bg-[#000000] border border-white/[0.08] p-4 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => {
              if (activeCodeTab === 'html') copyCode(htmlEmbedSnippet);
              else copyCode(reactSnippet);
            }}
            className="absolute right-3 top-3 px-2 py-0.5 rounded bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-xs text-white flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <pre className="text-zinc-200 leading-relaxed pt-1">
            {activeCodeTab === 'html' ? htmlEmbedSnippet : reactSnippet}
          </pre>
        </div>
      </div>

    </div>
  );
}
