import React, { useState } from 'react';
import { PROMPT_TEMPLATES } from '../data/mockData';

interface PromptTemplatesViewProps {
  onApplyTemplate: (promptText: string) => void;
}

export const PromptTemplatesView: React.FC<PromptTemplatesViewProps> = ({ onApplyTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#bec8d1]/40">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-[#181c20]">
            AST Parser Prompt Templates
          </h2>
          <p className="font-body-md text-body-md text-[#3f484f]">
            Domain-specific system instructions and JSON/Markdown schemas for video knowledge
            synthesis.
          </p>
        </div>
        <button
          onClick={() => alert('New schema template builder opened')}
          className="px-4 py-2 rounded-lg bg-[#00628c] hover:bg-[#007cb0] text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Prompt Template
        </button>
      </div>

      {/* Grid of Templates & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-mono font-semibold uppercase text-[#6f7881] px-1">
            Available Synthesizer Schemas (14)
          </div>

          {PROMPT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-white border-[#00628c] shadow-md ring-1 ring-[#00628c]'
                  : 'bg-[#f1f4f9] hover:bg-white border-[#bec8d1]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-mono text-[11px] font-semibold">
                  {tmpl.version}
                </span>
                <span className="text-[11px] font-mono text-[#845000]">
                  {tmpl.tokensEstimated}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#181c20]">{tmpl.title}</h3>
              <p className="text-xs text-[#3f484f] leading-relaxed line-clamp-2">
                {tmpl.description}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#6f7881] pt-1 border-t border-[#bec8d1]/30">
                <span>Category: {tmpl.category}</span>
                <span>{tmpl.activeCount} runs</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Details */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#bec8d1]/60 p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#181c20]">
                  {selectedTemplate.title}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-mono text-xs font-semibold">
                  {selectedTemplate.version}
                </span>
              </div>
              <span className="text-xs text-[#6f7881]">{selectedTemplate.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedTemplate.promptText, selectedTemplate.id)}
                className="px-3 py-1.5 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] font-mono text-xs text-[#181c20] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId === selectedTemplate.id ? 'check' : 'content_copy'}
                </span>
                {copiedId === selectedTemplate.id ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => onApplyTemplate(selectedTemplate.promptText)}
                className="px-4 py-1.5 rounded bg-[#007cb0] hover:bg-[#00628c] text-white font-mono text-xs font-semibold transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
                Load into Studio
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6f7881] font-semibold block mb-1.5">
              System Prompt &amp; AST Structure
            </label>
            <div className="p-4 rounded-lg bg-[#f7f9ff] border border-[#bec8d1] font-mono text-xs text-[#181c20] leading-relaxed whitespace-pre-wrap">
              {selectedTemplate.promptText}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6f7881] font-semibold block mb-1.5">
              Runtime Variable Injections
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.variables.map((v, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-[#dfe3e8] text-[#406279] font-mono text-xs border border-[#bec8d1]/60"
                >
                  ${`{${v}}`}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#f1f4f9] rounded-lg p-4 border border-[#bec8d1]/40 flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-[#845000]">
              Evaluation Metrics for this Schema
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2 rounded border border-[#bec8d1]/30">
                <div className="text-base font-bold text-[#00628c]">99.4%</div>
                <div className="text-[10px] font-mono text-[#6f7881]">LaTeX Syntactic Valid</div>
              </div>
              <div className="bg-white p-2 rounded border border-[#bec8d1]/30">
                <div className="text-base font-bold text-[#845000]">0.02s</div>
                <div className="text-[10px] font-mono text-[#6f7881]">AST Drift</div>
              </div>
              <div className="bg-white p-2 rounded border border-[#bec8d1]/30">
                <div className="text-base font-bold text-[#406279]">14.8k</div>
                <div className="text-[10px] font-mono text-[#6f7881]">Average Tokens</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
