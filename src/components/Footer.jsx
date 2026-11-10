import React from 'react';
import { Layers } from 'lucide-react';

/**
 * Enterprise Monochromatic Footer
 * Clean, compact footer bar.
 */
export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-white/[0.08] py-8 bg-[#020204] text-zinc-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-[#F97316] text-black flex items-center justify-center font-bold shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
            <Layers className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-semibold text-white font-sans text-sm">Knowra</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-sans text-xs">Document-Grounded AI Chatbot for Business Websites</span>
        </div>

        <div className="flex items-center space-x-6 text-zinc-500 text-[11px]">
          <span>© {new Date().getFullYear()} Knowra. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
