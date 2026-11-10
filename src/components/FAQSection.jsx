import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * FAQSection Component
 * 
 * Truthful, transparent questions and answers addressing real Knowra capabilities:
 * - Document constraints (PDF up to 10 pages)
 * - Grounding accuracy & citations
 * - Website embed simplicity
 * - Brand styling customization
 * - Question clustering insights
 * - Workspace data isolation
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What types of documents can I upload to Knowra?',
      a: 'Knowra currently supports standard corporate PDF documents (up to 10 pages per document). Your document is parsed, sectioned into semantic chunks, and indexed into vector embeddings for accurate citation retrieval.'
    },
    {
      q: 'How does Knowra prevent AI hallucinations and unverified claims?',
      a: 'Knowra enforces strict document grounding. The assistant is constrained exclusively to the facts retrieved from your uploaded PDF. Every answer includes verified citation badges displaying the source file, section, and page number. If an answer cannot be determined from your documents, the assistant transparently informs the visitor.'
    },
    {
      q: 'How hard is it to embed the assistant on our website?',
      a: 'It takes less than one minute. Knowra generates a single lightweight <script> tag that you paste into your website HTML before the closing </body> tag. It works seamlessly with WordPress, Shopify, Webflow, React, Next.js, and standard HTML sites.'
    },
    {
      q: 'Can we customize the look and feel of the chatbot widget?',
      a: 'Yes. In the Widget Studio, you can choose your primary brand color (such as Knowra Orange #F97316, deep navy, slate gray, or emerald), configure your custom assistant title, write custom welcome greetings, set starter prompts, and choose floating placement.'
    },
    {
      q: 'What are Customer Question Insights and how do they work?',
      a: 'Knowra aggregates the questions asked by visitors on your website and automatically clusters them into diagnostic topics. Each cluster provides an inquiry summary and prescriptive business actions, helping you discover documentation gaps and address customer confusion before it impacts sales.'
    },
    {
      q: 'Is our company knowledge partitioned and kept private?',
      a: 'Yes. Each business workspace is provisioned with an isolated domain partition and unique public widget keys. Your corporate documents and customer inquiries are strictly contained within your workspace boundary.'
    }
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 border-t border-white/[0.08] bg-[#050508] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Common questions answered.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            Everything you need to know about setting up your business assistant with Knowra.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#09090D] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base font-semibold text-white tracking-tight">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#F97316] text-black font-bold' : 'text-zinc-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed font-sans border-t border-white/[0.04] pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
