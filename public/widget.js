/**
 * Knowra AI Embeddable Web Widget
 * Lightweight, zero-dependency floating chatbot widget for any website.
 * Fully synchronized with Knowra Widget Studio configuration, enterprise dark styling,
 * Markdown formatting, and robust SSE stream JSON delta parsing.
 */
(function () {
  'use strict';

  // Prevent multiple instantiations
  if (window.__knowra_widget_initialized) {
    return;
  }
  window.__knowra_widget_initialized = true;

  // Find the current script tag and extract data attributes
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].getAttribute('data-public-key')) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  const publicKey = currentScript ? currentScript.getAttribute('data-public-key') : null;
  const apiUrl = (currentScript?.getAttribute('data-api-url') || 'https://knowra-ai.onrender.com').replace(/\/+$/, '');
  const customPrimaryColor = currentScript?.getAttribute('data-primary-color');
  const position = currentScript?.getAttribute('data-position') || 'bottom-right';
  const customTitle = currentScript?.getAttribute('data-title');
  const customWelcomeMessage = currentScript?.getAttribute('data-welcome-message');
  const customStarterPrompt = currentScript?.getAttribute('data-starter-prompt');

  if (!publicKey) {
    console.error('[Knowra AI Widget]: Missing data-public-key attribute on script tag.');
    return;
  }

  // Active configuration state (defaults matching Widget Studio)
  let activeTitle = customTitle || 'Knowledge Assistant';
  let activeWelcome = customWelcomeMessage || 'Hello. How can I assist you today?';
  let activeStarter = customStarterPrompt || '';
  let activeColor = customPrimaryColor || '#F97316';

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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderAlertBox(title, message, type = 'error') {
    const isWarning = type === 'warning';
    const isInfo = type === 'info';

    let borderColor = '#EF4444'; // Red
    let bg = 'rgba(239, 68, 68, 0.08)';
    let badgeBg = 'rgba(239, 68, 68, 0.2)';
    let badgeColor = '#FCA5A5';
    let iconSvg = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';

    if (isWarning) {
      borderColor = '#F59E0B'; // Amber
      bg = 'rgba(245, 158, 11, 0.08)';
      badgeBg = 'rgba(245, 158, 11, 0.2)';
      badgeColor = '#FCD34D';
      iconSvg = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
    } else if (isInfo) {
      borderColor = '#38BDF8'; // Sky
      bg = 'rgba(56, 189, 248, 0.08)';
      badgeBg = 'rgba(56, 189, 248, 0.2)';
      badgeColor = '#7DD3FC';
      iconSvg = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
    }

    return `
      <div style="border-left: 3px solid ${borderColor}; background: ${bg}; border-radius: 6px; padding: 10px 12px; margin: 3px 0; font-family: inherit;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            ${iconSvg}
          </svg>
          <span style="font-weight: 600; font-size: 11.5px; color: #FFFFFF; font-family: inherit;">${escapeHtml(title)}</span>
          <span style="margin-left: auto; font-size: 9px; font-weight: 600; text-transform: uppercase; font-family: ui-monospace, monospace; padding: 1px 5px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${borderColor}40;">${type}</span>
        </div>
        <div style="color: #D4D4D8; font-size: 11.5px; line-height: 1.45; word-break: break-word;">${escapeHtml(message)}</div>
      </div>
    `;
  }

  /**
   * Safe, zero-dependency Markdown renderer matching Knowra's MarkdownMessage component
   * including GitHub-style Alert callouts (> [!NOTE], > [!TIP], > [!WARNING], etc.)
   */
  function renderMarkdown(content) {
    if (!content) return '';
    let text = content;

    // Auto-close open code fence or bold during active streaming
    const codeCount = (text.match(/```/g) || []).length;
    if (codeCount % 2 !== 0) text += '\n```';
    const boldCount = (text.match(/\*\*/g) || []).length;
    if (boldCount % 2 !== 0) text += '**';

    // 1. Code blocks ```lang\ncode\n```
    const codeBlocks = [];
    text = text.replace(/```(?:([a-zA-Z0-9_-]+)?\n)?([\s\S]*?)```/g, function(_, lang, code) {
      const idx = codeBlocks.length;
      codeBlocks.push(
        `<pre style="background: #000000; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 10px 12px; margin: 8px 0; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; line-height: 1.5;"><code style="color: #E4E4E7;">${escapeHtml(code.trimEnd())}</code></pre>`
      );
      return `%%%KNOWRA_CODEBLOCK_${idx}%%%`;
    });

    // 2. Verified Citations [Source: ...]
    text = text.replace(/\[Source:\s*([^\]]+)\]/g, function(_, src) {
      return `<div style="display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #D4D4D8; margin: 4px 0;"><span style="color:#FFFFFF; font-weight:600;">Verified Source:</span> <span>${escapeHtml(src)}</span></div>`;
    });

    // 3. GitHub-style Markdown Alerts (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION])
    const alertBlocks = [];
    text = text.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n>)?\s*([^\n]*(?:\n>[^\n]*)*)/gim, function(_, typeStr, body) {
      const type = typeStr.toUpperCase();
      const cleanedBody = (body || '').replace(/^\s*>\s?/gm, '').trim();

      const theme = {
        NOTE: { border: '#38BDF8', bg: 'rgba(56, 189, 248, 0.08)', titleColor: '#7DD3FC', badgeBg: 'rgba(56, 189, 248, 0.2)', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' },
        TIP: { border: '#34D399', bg: 'rgba(52, 211, 153, 0.08)', titleColor: '#6EE7B7', badgeBg: 'rgba(52, 211, 153, 0.2)', icon: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>' },
        IMPORTANT: { border: '#A855F7', bg: 'rgba(168, 85, 247, 0.08)', titleColor: '#C084FC', badgeBg: 'rgba(168, 85, 247, 0.2)', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
        WARNING: { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', titleColor: '#FCD34D', badgeBg: 'rgba(245, 158, 11, 0.2)', icon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
        CAUTION: { border: '#F43F5E', bg: 'rgba(244, 63, 94, 0.08)', titleColor: '#FDA4AF', badgeBg: 'rgba(244, 63, 94, 0.2)', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
      }[type] || { border: '#71717A', bg: 'rgba(255, 255, 255, 0.04)', titleColor: '#FFFFFF', badgeBg: 'rgba(255, 255, 255, 0.1)', icon: '<circle cx="12" cy="12" r="10"/>' };

      const idx = alertBlocks.length;
      alertBlocks.push(`
        <div style="border-left: 3px solid ${theme.border}; background: ${theme.bg}; border-radius: 6px; padding: 10px 14px; margin: 8px 0; font-family: inherit;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${theme.border}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">${theme.icon}</svg>
            <span style="font-weight: 700; font-size: 11px; text-transform: uppercase; font-family: ui-monospace, monospace; color: ${theme.titleColor}; letter-spacing: 0.04em;">${type}</span>
            <span style="margin-left: auto; font-size: 9px; font-weight: 600; text-transform: uppercase; font-family: ui-monospace, monospace; padding: 1px 5px; border-radius: 4px; background: ${theme.badgeBg}; color: ${theme.titleColor};">ALERT</span>
          </div>
          <div style="color: #E4E4E7; font-size: 12.5px; line-height: 1.55;">${escapeHtml(cleanedBody)}</div>
        </div>
      `);
      return `%%%KNOWRA_ALERTBLOCK_${idx}%%%`;
    });

    // 4. Escape HTML
    text = escapeHtml(text);

    // 5. Inline code
    text = text.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); padding: 1px 5px; border-radius: 3px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #F4F4F5;">$1</code>');

    // 6. Bold & Italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #FFFFFF; font-weight: 600;">$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 7. Headings
    text = text.replace(/^### (.*$)/gim, '<h4 style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin: 8px 0 3px 0;">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin: 10px 0 4px 0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 2px;">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin: 12px 0 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 3px;">$1</h2>');

    // 8. Standard Blockquotes (non-alert)
    text = text.replace(/^>\s?(.*$)/gim, '<blockquote style="border-left: 2px solid #52525B; padding-left: 10px; margin: 6px 0; color: #A1A1AA;">$1</blockquote>');

    // 9. Lists
    text = text.replace(/^(?:[-*]\s+)(.*)$/gim, '<li style="margin-left: 16px; margin-bottom: 3px;">$1</li>');

    // 10. Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #60A5FA; text-decoration: underline;">$1</a>');

    // 11. Paragraphs / Line Breaks
    text = text.replace(/\n\n/g, '<div style="height: 8px;"></div>');
    text = text.replace(/\n/g, '<br/>');

    // Restore Alert Blocks
    text = text.replace(/%%%KNOWRA_ALERTBLOCK_(\d+)%%%/g, function(_, idx) {
      return alertBlocks[Number(idx)] || '';
    });

    // Restore Code Blocks
    text = text.replace(/%%%KNOWRA_CODEBLOCK_(\d+)%%%/g, function(_, idx) {
      return codeBlocks[Number(idx)] || '';
    });

    return text;
  }

  // Inject Scoped Styles for widget
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #knowra-widget-container * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #knowra-widget-messages::-webkit-scrollbar {
      width: 5px;
    }
    #knowra-widget-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #knowra-widget-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }
    #knowra-widget-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    @keyframes knowra-pulse-anim {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.85); }
    }
    @keyframes knowra-window-enter {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(styleEl);

  // Create Container
  const container = document.createElement('div');
  container.id = 'knowra-widget-container';
  container.style.position = 'fixed';
  container.style.zIndex = '999999';
  container.style.bottom = '24px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  const isLeft = position.includes('left');
  container.style[isLeft ? 'left' : 'right'] = '24px';
  container.style.alignItems = isLeft ? 'flex-start' : 'flex-end';

  // Launcher Button Styling
  const button = document.createElement('button');
  button.id = 'knowra-widget-launcher';
  button.type = 'button';
  button.style.width = '52px';
  button.style.height = '52px';
  button.style.borderRadius = '26px';
  button.style.border = 'none';
  button.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
  button.title = activeTitle;

  function updateLauncherColors() {
    const isDarkPrimary = activeColor === '#09090B' || activeColor === '#000000' || activeColor === '#111111';
    const bg = isDarkPrimary ? '#F97316' : activeColor;
    const fg = isDarkPrimary ? '#000000' : (isColorLight(activeColor) ? '#000000' : '#FFFFFF');

    button.style.backgroundColor = bg;
    button.style.color = fg;
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/>
        <path d="M20 14h2"/>
        <path d="M15 13v2"/>
        <path d="M9 13v2"/>
      </svg>
    `;
  }
  updateLauncherColors();

  button.onmouseenter = () => { button.style.transform = 'scale(1.06)'; };
  button.onmouseleave = () => { button.style.transform = 'scale(1)'; };

  // Chat Window (Enterprise Dark Theme - Spacious & Responsive)
  const chatWindow = document.createElement('div');
  chatWindow.id = 'knowra-widget-window';
  chatWindow.style.display = 'none';
  chatWindow.style.width = '420px';
  chatWindow.style.height = '620px';
  chatWindow.style.maxWidth = 'calc(100vw - 32px)';
  chatWindow.style.maxHeight = 'calc(100vh - 80px)';
  chatWindow.style.backgroundColor = '#0E0E10';
  chatWindow.style.color = '#EDEDED';
  chatWindow.style.borderRadius = '12px';
  chatWindow.style.border = '1px solid rgba(255, 255, 255, 0.12)';
  chatWindow.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.marginBottom = '12px';
  chatWindow.style.animation = 'knowra-window-enter 0.15s ease-out';

  // Window Header
  const header = document.createElement('div');
  header.style.padding = '14px 16px';
  header.style.backgroundColor = (activeColor === '#09090B' || activeColor === '#000000' || activeColor === '#111111') ? '#141416' : activeColor;
  header.style.color = '#FFFFFF';
  header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';

  const headerLeft = document.createElement('div');
  headerLeft.style.display = 'flex';
  headerLeft.style.alignItems = 'center';
  headerLeft.style.gap = '8px';
  headerLeft.style.overflow = 'hidden';

  const statusDot = document.createElement('div');
  statusDot.style.width = '8px';
  statusDot.style.height = '8px';
  statusDot.style.borderRadius = '50%';
  statusDot.style.backgroundColor = '#34D399';
  statusDot.style.boxShadow = '0 0 6px rgba(52, 211, 153, 0.6)';
  statusDot.style.flexShrink = '0';

  const titleSpan = document.createElement('span');
  titleSpan.style.fontWeight = '600';
  titleSpan.style.fontSize = '13.5px';
  titleSpan.style.color = '#FFFFFF';
  titleSpan.style.whiteSpace = 'nowrap';
  titleSpan.style.overflow = 'hidden';
  titleSpan.style.textOverflow = 'ellipsis';
  titleSpan.innerText = activeTitle;

  headerLeft.appendChild(statusDot);
  headerLeft.appendChild(titleSpan);

  const headerActions = document.createElement('div');
  headerActions.style.display = 'flex';
  headerActions.style.alignItems = 'center';
  headerActions.style.gap = '4px';

  const resetBtn = document.createElement('button');
  resetBtn.id = 'knowra-reset-btn';
  resetBtn.type = 'button';
  resetBtn.style.background = 'none';
  resetBtn.style.border = 'none';
  resetBtn.style.color = 'rgba(255, 255, 255, 0.7)';
  resetBtn.style.cursor = 'pointer';
  resetBtn.style.padding = '4px';
  resetBtn.style.display = 'flex';
  resetBtn.style.alignItems = 'center';
  resetBtn.style.justifyContent = 'center';
  resetBtn.style.borderRadius = '4px';
  resetBtn.style.transition = 'color 0.15s ease, background-color 0.15s ease';
  resetBtn.title = 'Reset conversation and start fresh';
  resetBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  `;
  resetBtn.onmouseenter = () => { resetBtn.style.color = '#FFFFFF'; resetBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; };
  resetBtn.onmouseleave = () => { resetBtn.style.color = 'rgba(255, 255, 255, 0.7)'; resetBtn.style.backgroundColor = 'transparent'; };

  const closeButton = document.createElement('button');
  closeButton.id = 'knowra-close-btn';
  closeButton.type = 'button';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '14px';
  closeButton.style.lineHeight = '1';
  closeButton.style.padding = '4px';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.borderRadius = '4px';
  closeButton.style.transition = 'color 0.15s ease, background-color 0.15s ease';
  closeButton.innerText = '✕';
  closeButton.onmouseenter = () => { closeButton.style.color = '#FFFFFF'; closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; };
  closeButton.onmouseleave = () => { closeButton.style.color = 'rgba(255, 255, 255, 0.7)'; closeButton.style.backgroundColor = 'transparent'; };

  headerActions.appendChild(resetBtn);
  headerActions.appendChild(closeButton);
  header.appendChild(headerLeft);
  header.appendChild(headerActions);

  // Messages Area
  const messageList = document.createElement('div');
  messageList.id = 'knowra-widget-messages';
  messageList.style.flexGrow = '1';
  messageList.style.padding = '16px';
  messageList.style.overflowY = 'auto';
  messageList.style.display = 'flex';
  messageList.style.flexDirection = 'column';
  messageList.style.gap = '12px';
  messageList.style.fontSize = '13.5px';
  messageList.style.backgroundColor = '#0A0A0C';

  // Starter Prompt Chip
  const starterContainer = document.createElement('div');
  starterContainer.style.padding = '8px 14px';
  starterContainer.style.backgroundColor = '#121214';
  starterContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.08)';
  starterContainer.style.display = activeStarter ? 'flex' : 'none';
  starterContainer.style.alignItems = 'center';

  const starterBtn = document.createElement('button');
  starterBtn.type = 'button';
  starterBtn.style.background = 'none';
  starterBtn.style.border = 'none';
  starterBtn.style.color = '#A1A1AA';
  starterBtn.style.fontSize = '12px';
  starterBtn.style.cursor = 'pointer';
  starterBtn.style.textAlign = 'left';
  starterBtn.style.padding = '0';
  starterBtn.style.maxWidth = '100%';
  starterBtn.style.overflow = 'hidden';
  starterBtn.style.textOverflow = 'ellipsis';
  starterBtn.style.whiteSpace = 'nowrap';
  starterBtn.style.transition = 'color 0.15s ease';
  starterBtn.innerText = `💡 "${activeStarter}"`;
  starterBtn.onmouseenter = () => { starterBtn.style.color = '#FFFFFF'; };
  starterBtn.onmouseleave = () => { starterBtn.style.color = '#A1A1AA'; };

  starterContainer.appendChild(starterBtn);

  // Input Area
  const inputContainer = document.createElement('form');
  inputContainer.style.padding = '10px 12px';
  inputContainer.style.backgroundColor = '#0E0E10';
  inputContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.08)';
  inputContainer.style.display = 'flex';
  inputContainer.style.gap = '8px';
  inputContainer.style.alignItems = 'center';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Ask a question...';
  inputField.style.flexGrow = '1';
  inputField.style.backgroundColor = '#16161A';
  inputField.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  inputField.style.borderRadius = '6px';
  inputField.style.padding = '8px 12px';
  inputField.style.color = '#FFFFFF';
  inputField.style.fontSize = '13px';
  inputField.style.outline = 'none';

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.style.backgroundColor = '#F97316';
  sendButton.style.color = '#000000';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '6px';
  sendButton.style.padding = '8px 12px';
  sendButton.style.cursor = 'pointer';
  sendButton.style.display = 'flex';
  sendButton.style.alignItems = 'center';
  sendButton.style.justifyContent = 'center';
  sendButton.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
  sendButton.style.transition = 'background-color 0.15s ease, opacity 0.15s ease';
  sendButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  `;

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);

  chatWindow.appendChild(header);
  chatWindow.appendChild(messageList);
  chatWindow.appendChild(starterContainer);
  chatWindow.appendChild(inputContainer);

  container.appendChild(chatWindow);
  container.appendChild(button);
  document.body.appendChild(container);

  // Widget Logic & State
  let isOpen = false;
  let threadId = 'widget_' + Math.random().toString(36).substring(2, 12);
  let isSending = false;

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      if (messageList.children.length === 0) {
        loadInitialInfo();
      }
      setTimeout(() => inputField.focus(), 50);
    }
  }

  async function resetConversation() {
    if (isSending) return;
    const oldThread = threadId;
    threadId = 'widget_' + Math.random().toString(36).substring(2, 12);
    try {
      fetch(`${apiUrl}/api/v1/history/${oldThread}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

    messageList.innerHTML = '';
    addMessage('assistant', activeWelcome);
    if (activeStarter) {
      starterContainer.style.display = 'flex';
    }
    inputField.value = '';
    inputField.focus();
  }

  button.onclick = toggleChat;
  closeButton.onclick = toggleChat;
  resetBtn.onclick = resetConversation;

  async function loadInitialInfo() {
    try {
      const res = await fetch(`${apiUrl}/api/v1/widget/info/${publicKey}`);
      if (res.ok) {
        const data = await res.json();
        // If not explicitly set on the script tag, adopt business info
        if (!customTitle && data.business_name) {
          activeTitle = data.business_name;
          titleSpan.innerText = activeTitle;
          button.title = activeTitle;
        }
        if (!customWelcomeMessage && data.welcome_message) {
          activeWelcome = data.welcome_message;
        }
        if (!customPrimaryColor && data.primary_color) {
          activeColor = data.primary_color;
          header.style.backgroundColor = (activeColor === '#09090B' || activeColor === '#000000' || activeColor === '#111111') ? '#141416' : activeColor;
          updateLauncherColors();
        }
      }
    } catch (e) {
      console.warn('[Knowra Widget] Using local configuration defaults:', e);
    }

    if (messageList.children.length === 0) {
      addMessage('assistant', activeWelcome);
    }
  }

  function addMessage(role, text) {
    const msgWrapper = document.createElement('div');
    msgWrapper.style.display = 'flex';
    msgWrapper.style.width = '100%';
    msgWrapper.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';

    const msg = document.createElement('div');
    msg.style.maxWidth = '90%';
    msg.style.padding = '10px 14px';
    msg.style.borderRadius = '8px';
    msg.style.lineHeight = '1.6';
    msg.style.fontSize = '13.5px';
    msg.style.wordBreak = 'break-word';

    if (role === 'user') {
      msg.style.backgroundColor = '#F97316';
      msg.style.color = '#000000';
      msg.style.fontWeight = '600';
      msg.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
      msg.innerText = text;
    } else {
      msg.style.backgroundColor = '#141416';
      msg.style.color = '#EDEDED';
      msg.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      msg.innerHTML = renderMarkdown(text);
    }

    msgWrapper.appendChild(msg);
    messageList.appendChild(msgWrapper);
    messageList.scrollTop = messageList.scrollHeight;
    return msg;
  }

  async function sendMessage(query) {
    if (!query || isSending) return;

    // Hide starter prompt after first message
    starterContainer.style.display = 'none';

    addMessage('user', query);

    // Initial assistant loading placeholder
    const botMsg = addMessage('assistant', '');
    botMsg.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 6px; color: #A1A1AA; font-size: 11px;">
        <span style="width: 5px; height: 5px; border-radius: 50%; background: #FFFFFF; display: inline-block; animation: knowra-pulse-anim 1s infinite;"></span>
        <span>Synthesizing answer...</span>
      </span>
    `;

    isSending = true;
    sendButton.disabled = true;
    sendButton.style.opacity = '0.5';

    try {
      const res = await fetch(`${apiUrl}/api/v1/widget/${publicKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, thread_id: threadId })
      });

      if (!res.ok) {
        let errDetail = 'Unable to connect to knowledge assistant.';
        try {
          const errJson = await res.json();
          errDetail = errJson.detail || errJson.message || errDetail;
        } catch {}
        const msgStr = typeof errDetail === 'string' ? errDetail : JSON.stringify(errDetail);
        botMsg.innerHTML = renderAlertBox('Connection Error', msgStr, 'error');
        return;
      }

      // Handle non-streaming JSON response if content-type is application/json
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        const text = data.content || data.delta || data.message || data.response || data.answer || JSON.stringify(data);
        botMsg.innerHTML = renderMarkdown(text);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let responseText = '';
      let buffer = '';

      function handleSSELine(rawLine) {
        const line = rawLine.trimEnd();
        if (!line) return;

        let payload = null;
        if (line.startsWith('data: ')) {
          payload = line.substring(6);
        } else if (line.startsWith('data:')) {
          payload = line.substring(5);
        } else if (line.startsWith('event: error')) {
          throw new Error('Streaming error from server');
        } else if (line.startsWith('{') && line.endsWith('}')) {
          // Plain JSON line
          payload = line;
        } else {
          return;
        }

        if (payload === '[DONE]') {
          return;
        }

        // Parse structured JSON SSE delta
        if (payload.startsWith('{')) {
          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === 'done') {
              return;
            }
            if (parsed.type === 'error' || parsed.error) {
              throw new Error(parsed.error || 'Server error occurred.');
            }

            // Extract textual content from any schema format
            const chunk = parsed.content !== undefined 
              ? parsed.content 
              : (parsed.delta !== undefined 
                ? parsed.delta 
                : (parsed.text !== undefined 
                  ? parsed.text 
                  : (parsed.answer !== undefined 
                    ? parsed.answer 
                    : (parsed.response !== undefined 
                      ? parsed.response 
                      : (parsed.message !== undefined ? parsed.message : '')))));

            if (chunk) {
              responseText += chunk;
              botMsg.innerHTML = renderMarkdown(responseText);
              messageList.scrollTop = messageList.scrollHeight;
            }
            return;
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) {
              throw e;
            }
            // Fall through to plain text if JSON.parse fails
          }
        }

        // Plain text fallback
        if (payload) {
          responseText += payload;
          botMsg.innerHTML = renderMarkdown(responseText);
          messageList.scrollTop = messageList.scrollHeight;
        }
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          handleSSELine(line);
        }
      }

      if (buffer.trim()) {
        handleSSELine(buffer.trim());
      }

      if (!responseText) {
        botMsg.innerHTML = renderAlertBox('Empty Response', 'Received empty response from assistant.', 'warning');
      }
    } catch (err) {
      botMsg.innerHTML = renderAlertBox('Assistant Notice', err.message || 'Error receiving response.', 'error');
    } finally {
      isSending = false;
      sendButton.disabled = false;
      sendButton.style.opacity = '1';
    }
  }

  starterBtn.onclick = () => {
    sendMessage(activeStarter);
  };

  inputContainer.onsubmit = async (e) => {
    e.preventDefault();
    const query = inputField.value.trim();
    if (!query) return;
    inputField.value = '';
    await sendMessage(query);
  };
})();
