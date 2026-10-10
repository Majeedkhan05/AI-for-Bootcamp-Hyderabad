import React, { useState } from 'react';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onSavePrompt: (newPrompt: string) => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  isOpen,
  onClose,
  systemPrompt,
  onSavePrompt,
}) => {
  const [text, setText] = useState(systemPrompt);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-[#bec8d1]/70 overflow-hidden flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f1f4f9] border-b border-[#bec8d1]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00628c]">code_blocks</span>
            <span className="font-semibold text-sm text-[#181c20]">
              Edit System Prompt &amp; Extraction Schema
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-mono text-[11px] font-medium">
              v3.2
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6f7881] hover:text-[#181c20] rounded hover:bg-[#e5e8ee] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs text-[#3f484f] leading-relaxed">
            The system prompt instructs Gemini 1.5 Pro Flash Vision to transcribe blackboard notes,
            OCR slide terminals, synthesize architectural invariants, and emit rigorous AST
            formulations.
          </p>

          <label className="text-[11px] font-mono uppercase tracking-wider text-[#6f7881] font-semibold">
            System Instruction
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-3 font-mono text-xs rounded-lg border border-[#bec8d1] bg-[#f7f9ff] text-[#181c20] focus:ring-2 focus:ring-[#00628c] focus:outline-none leading-relaxed"
          />

          <div className="bg-[#f1f4f9] p-3 rounded-lg border border-[#bec8d1]/50 text-xs text-[#3f484f] flex flex-col gap-1.5">
            <span className="font-semibold font-mono text-[11px] text-[#00628c]">
              Target Output Schema Rules:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#6f7881]">
              <li>Executive Summary: 3 numbered rigorous points with math notation</li>
              <li>Timestamped Breakdown: Interval headers, LaTeX display blocks, raw shell logs</li>
              <li>Technical Invariants: Compute, Hardware TMA, and Cache memory guarantees</li>
              <li>Implementation Constraints: Bottleneck alerts and recommended deploy profile</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#f1f4f9] border-t border-[#bec8d1]/50 flex items-center justify-between">
          <button
            onClick={() =>
              setText(
                'SYSTEM: You are a Principal ML Systems Engineer. Ingest video keyframes + synced Whisper transcription. Output structured Markdown adhering strictly to schema: Executive Summary (3 sentences), Timestamped Breakdown with raw CLI commands, Technical Deep Dive (architecture & memory invariants), and Implementation Bottlenecks/Trade-offs.'
              )
            }
            className="text-xs font-mono text-[#6f7881] hover:text-[#181c20]"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-mono text-[#3f484f] hover:bg-[#e5e8ee] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSavePrompt(text);
                onClose();
              }}
              className="px-4 py-1.5 rounded text-xs font-mono font-semibold bg-[#00628c] text-white hover:bg-[#007cb0] transition-colors shadow-sm"
            >
              Save Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
