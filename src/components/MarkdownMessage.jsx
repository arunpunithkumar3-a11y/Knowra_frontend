import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, FileText, Terminal, BookmarkCheck, Info, Lightbulb, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

function extractText(children) {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children.props && children.props.children) return extractText(children.props.children);
  return '';
}

/**
 * Enterprise-Grade Markdown & Executive Business Document Renderer
 * Optimized for black / dark theme (Linear / Stripe / Vercel):
 * Crisp white headings, GFM tables with subtle hairline borders,
 * verified source citation chips, and publication-ready formatting.
 */
function MarkdownMessage({ content, isStreaming = false }) {
  if (!content) {
    if (isStreaming) {
      return (
        <span className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Synthesizing document intelligence...</span>
        </span>
      );
    }
    return null;
  }

  // Auto-close unclosed markdown blocks during active streaming
  let processedContent = content;
  if (isStreaming) {
    const codeBlockCount = (content.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
      processedContent = content + '\n```';
    } else {
      const boldCount = (content.match(/\*\*/g) || []).length;
      if (boldCount % 2 !== 0) {
        processedContent = content + '**';
      }
    }
  }

  return (
    <div className="printable-report text-[#EDEDED] text-[13.5px] sm:text-[14px] leading-relaxed break-words font-sans space-y-2.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1: Document or Report Title
          h1: ({ node, children, ...props }) => (
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-6 mb-3.5 pb-2.5 border-b border-white/[0.1] first:mt-0"
              {...props}
            >
              {children}
            </h1>
          ),
          // H2: Major Section Heading (Executive Summary, Key Findings, etc.)
          h2: ({ node, children, ...props }) => (
            <h2
              className="text-base sm:text-lg font-semibold tracking-tight text-white mt-5 mb-2 pb-1.5 border-b border-white/[0.08] first:mt-0"
              {...props}
            >
              {children}
            </h2>
          ),
          // H3: Subheading
          h3: ({ node, children, ...props }) => (
            <h3
              className="text-sm sm:text-base font-semibold text-white mt-4 mb-1.5"
              {...props}
            >
              {children}
            </h3>
          ),
          // H4: Subsection
          h4: ({ node, children, ...props }) => (
            <h4
              className="text-xs sm:text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mt-3 mb-1"
              {...props}
            >
              {children}
            </h4>
          ),
          // Paragraph
          p: ({ node, children, ...props }) => {
            const textContent = extractText(children).trim();
            // Handle standalone citation blocks
            if (/^\[Source:\s*[^\]]+\]$/.test(textContent)) {
              const sourceName = textContent.replace(/^\[Source:\s*|\s*\]$/g, '');
              return (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.12] text-xs font-mono text-[#D4D4D8] my-1 shadow-subtle">
                  <BookmarkCheck className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="font-semibold text-white">Verified Source:</span>
                  <span className="truncate max-w-xs">{sourceName}</span>
                </div>
              );
            }
            return (
              <p className="my-2 text-[#D4D4D8] leading-relaxed font-normal" {...props}>
                {children}
              </p>
            );
          },
          // Unordered List
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-[#D4D4D8] marker:text-zinc-500" {...props}>
              {children}
            </ul>
          ),
          // Ordered List
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-[#D4D4D8] marker:font-mono marker:text-xs marker:text-zinc-400" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          // Blockquote (Callout / Document excerpt & GitHub-style Alerts)
          blockquote: ({ node, children, ...props }) => {
            const rawText = extractText(children).trim();
            const alertMatch = rawText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

            if (alertMatch) {
              const alertType = alertMatch[1].toUpperCase();
              const alertThemes = {
                NOTE: {
                  border: 'border-l-4 border-sky-500',
                  bg: 'bg-sky-500/[0.08]',
                  badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                  titleColor: 'text-sky-300',
                  icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
                },
                TIP: {
                  border: 'border-l-4 border-emerald-500',
                  bg: 'bg-emerald-500/[0.08]',
                  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  titleColor: 'text-emerald-300',
                  icon: <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />,
                },
                IMPORTANT: {
                  border: 'border-l-4 border-purple-500',
                  bg: 'bg-purple-500/[0.08]',
                  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  titleColor: 'text-purple-300',
                  icon: <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />,
                },
                WARNING: {
                  border: 'border-l-4 border-amber-500',
                  bg: 'bg-amber-500/[0.08]',
                  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  titleColor: 'text-amber-300',
                  icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
                },
                CAUTION: {
                  border: 'border-l-4 border-rose-500',
                  bg: 'bg-rose-500/[0.08]',
                  badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  titleColor: 'text-rose-300',
                  icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
                },
              };

              const currentTheme = alertThemes[alertType] || alertThemes.NOTE;
              const cleanContent = rawText.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');

              return (
                <blockquote
                  className={`not-italic my-3 p-3.5 rounded-r-lg border-y border-r border-white/[0.08] ${currentTheme.border} ${currentTheme.bg} shadow-subtle`}
                  {...props}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    {currentTheme.icon}
                    <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${currentTheme.titleColor}`}>
                      {alertType}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${currentTheme.badge}`}>
                      Alert
                    </span>
                  </div>
                  <div className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed font-sans font-normal">
                    {cleanContent}
                  </div>
                </blockquote>
              );
            }

            return (
              <blockquote
                className="border-l-2 border-white/60 pl-3.5 py-2 my-3 bg-white/[0.04] rounded-r-md text-zinc-300 text-xs sm:text-[13px] leading-relaxed italic"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // GFM Tables
          table: ({ node, children, ...props }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-white/[0.1] bg-[#0A0A0A] shadow-subtle">
              <table className="min-w-full divide-y divide-white/[0.08] text-left text-xs font-sans" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-[#141414] text-white" {...props}>
              {children}
            </thead>
          ),
          th: ({ node, children, ...props }) => (
            <th
              className="px-3.5 py-2.5 font-semibold text-white text-[11px] uppercase tracking-wider font-mono border-b border-white/[0.08]"
              {...props}
            >
              {children}
            </th>
          ),
          tbody: ({ node, children, ...props }) => (
            <tbody className="divide-y divide-white/[0.05] bg-[#0A0A0A]" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="hover:bg-white/[0.03] transition-colors" {...props}>
              {children}
            </tr>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-3.5 py-2.5 text-[#D4D4D8] text-xs leading-normal" {...props}>
              {children}
            </td>
          ),
          // Horizontal Rule
          hr: ({ node, ...props }) => (
            <hr className="my-5 border-t border-white/[0.08]" {...props} />
          ),
          // Links
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/40 underline-offset-2 text-white font-medium hover:decoration-white transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          // Strong & Em
          strong: ({ node, children, ...props }) => (
            <strong className="font-semibold text-white" {...props}>
              {children}
            </strong>
          ),
          em: ({ node, children, ...props }) => (
            <em className="italic text-zinc-400" {...props}>
              {children}
            </em>
          ),
          // Code Blocks and Inline Code
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (inline) {
              if (/^Source:\s*/.test(codeString)) {
                return (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 mx-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[11px] font-mono text-[#D4D4D8]">
                    <FileText className="w-3 h-3 text-white" />
                    <span>{codeString}</span>
                  </span>
                );
              }
              return (
                <code
                  className="px-1.5 py-0.5 mx-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-white font-mono text-[12px]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlockComponent language={language} code={codeString} />;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>

      {/* Streaming Blinking Cursor */}
      {isStreaming && (
        <span
          className="inline-block w-1.5 h-4 ml-1 bg-white align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function CodeBlockComponent({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg border border-white/[0.1] bg-[#0A0A0A] text-zinc-100 overflow-hidden shadow-subtle">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#141414] border-b border-white/[0.08] text-[11px] font-mono text-zinc-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="uppercase font-semibold tracking-wider text-white">
            {language || 'code'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-[11px] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default React.memo(MarkdownMessage);
