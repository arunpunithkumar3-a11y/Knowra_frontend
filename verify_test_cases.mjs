import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const testCases = [
  {
    id: 1,
    title: 'Long business report with multiple heading levels',
    content: `# Enterprise Architecture & Infrastructure Audit\n\n## Executive Summary\nThis report reviews distributed systems reliability.\n\n### Key Performance Indicators\n- **Response Time:** 210ms\n- **Availability:** 99.98%\n\n#### Compute Sizing\n- 8 worker nodes across us-east-1`,
    assertions: (html) => {
      if (!html.includes('<h1') || !html.includes('<h2') || !html.includes('<h3') || !html.includes('<h4')) {
        throw new Error('Missing heading levels (h1, h2, h3, h4)');
      }
      if (!html.includes('<ul') || !html.includes('<li')) {
        throw new Error('Missing list elements');
      }
    }
  },
  {
    id: 2,
    title: 'Short factual question and answer',
    content: `Knowra combines **document intelligence** with **verified citations** for enterprise knowledge.`,
    assertions: (html) => {
      if (!html.includes('<strong>document intelligence</strong>')) {
        throw new Error('Bold formatting not rendered');
      }
    }
  },
  {
    id: 3,
    title: 'Nested bullet points',
    content: `* Data Governance\n  * Access Control\n    * RBAC enforcement\n    * Audit logging\n  * Encryption\n    * AES-256`,
    assertions: (html) => {
      const ulCount = (html.match(/<ul/g) || []).length;
      if (ulCount < 3) {
        throw new Error(`Expected at least 3 nested <ul> tags, found ${ulCount}`);
      }
    }
  },
  {
    id: 4,
    title: 'Table with multiple columns and proper alignment',
    content: `| Document | Pages | Chunks | Status |\n| :--- | :---: | :---: | ---: |\n| policy.pdf | 12 | 64 | Indexed |\n| specs.pdf | 4 | 18 | Indexed |`,
    assertions: (html) => {
      if (!html.includes('<table') || !html.includes('<thead') || !html.includes('<tbody') || !html.includes('<th') || !html.includes('<td')) {
        throw new Error('Table tags (table, thead, tbody, th, td) not rendered properly');
      }
    }
  },
  {
    id: 5,
    title: 'Citations and source references',
    content: `The token lifecycle is capped at 15 minutes.\n\n[Source: security_spec.pdf]`,
    assertions: (html) => {
      if (!html.includes('security_spec.pdf')) {
        throw new Error('Citation text missing');
      }
    }
  },
  {
    id: 6,
    title: 'Lengthy document summary',
    content: `## Annual Financial Summary\n\nOperating expenses decreased by 14% through automated inference caching and quantization.\n\nGross retention stands at 96.5% with net expansion of 122%. Support query volume shifted towards self-serve resolution via grounded widgets.`,
    assertions: (html) => {
      const pCount = (html.match(/<p/g) || []).length;
      if (pCount < 2) {
        throw new Error(`Expected multiple paragraphs, found ${pCount}`);
      }
    }
  },
  {
    id: 7,
    title: 'Report containing conflicting or missing source information',
    content: `# Policy Gap Analysis\n\n## Verified Findings\nDomestic per-diem is capped at $200.\n\n## Missing Information\n> The uploaded documents contain no guidance on international per-diem.\n\n## Conflicting Source Data\n- \`policy_v1.pdf\` cites $150, but \`memo_v2.pdf\` specifies $200.`,
    assertions: (html) => {
      if (!html.includes('<blockquote') || !html.includes('<code>')) {
        throw new Error('Blockquote or code excerpt missing in conflicting report');
      }
    }
  },
  {
    id: 8,
    title: 'Progressive streaming with incomplete markdown',
    content: `Generating code snippet:\n\`\`\`typescript\ninterface DocumentContext {\n  id: string;\n  score: number;\n`,
    assertions: (html) => {
      // Should render without throwing
      if (!html.includes('DocumentContext')) {
        throw new Error('Streaming code content missing');
      }
    }
  }
];

console.log('=== RUNNING REPORT PRESENTATION SUITE ===');
let passed = 0;

for (const tc of testCases) {
  try {
    let content = tc.content;
    // Handle streaming unclosed code block if odd number of ```
    const codeCount = (content.match(/```/g) || []).length;
    if (codeCount % 2 !== 0) {
      content += '\n```';
    }

    const html = renderToString(
      React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, content)
    );
    tc.assertions(html);
    console.log(`[PASS] Case ${tc.id}: ${tc.title}`);
    passed++;
  } catch (e) {
    console.error(`[FAIL] Case ${tc.id}: ${tc.title} - ${e.message}`);
  }
}

console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);
if (passed === testCases.length) {
  console.log('ALL REPORT VERIFICATION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  process.exit(1);
}
