import React, { useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Trash2 
} from 'lucide-react';

/**
 * Enterprise Toast Alert Notification (Floating, top-right / top-center)
 */
export function ToastAlert({ 
  type = 'error', 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 4500 
}) {
  useEffect(() => {
    if (!autoClose || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  const config = {
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-[#140D0E]',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
      defaultTitle: 'Operation Failed',
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-[#15120A]',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
      defaultTitle: 'Attention Required',
    },
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-[#0B1510]',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
      defaultTitle: 'Success',
    },
    info: {
      border: 'border-sky-500/40',
      bg: 'bg-[#0C121A]',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />,
      defaultTitle: 'Information',
    },
  }[type] || config.error;

  return (
    <div className="fixed top-5 right-5 z-[99999] max-w-sm w-full animate-in slide-in-from-top-3 fade-in duration-200">
      <div className={`rounded-lg border ${config.border} ${config.bg} p-3.5 shadow-2xl backdrop-blur-md flex items-start space-x-3`}>
        {config.icon}
        <div className="flex-grow min-w-0 pr-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold text-white tracking-tight">
              {title || config.defaultTitle}
            </span>
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${config.badgeBg}`}>
              {type}
            </span>
          </div>
          {message && (
            <p className="text-xs text-zinc-300 leading-relaxed break-words font-sans">
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Enterprise Confirmation / Decision Alert Modal
 * Clean dark theme dialog replacing primitive window.confirm(...)
 */
export function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#101012] border border-white/[0.12] rounded-xl max-w-md w-full shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-3.5 mb-4">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
          }`}>
            {isDestructive ? <Trash2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <div className="flex-grow min-w-0 pt-0.5">
            <h3 className="text-sm font-semibold text-white tracking-tight mb-1">
              {title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-[#F97316] hover:bg-[#EA580C] text-black font-bold shadow-[0_2px_12px_rgba(249,115,22,0.35)]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
