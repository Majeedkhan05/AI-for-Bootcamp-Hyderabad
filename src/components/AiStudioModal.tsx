import React, { useState } from 'react';
import { ExtractionDocument } from '../types';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ExtractionDocument;
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    model: 'models/gemini-1.5-pro',
    system_instruction: {
      parts: [
        {
          text: 'SYSTEM: You are a Principal ML Systems Engineer. Ingest video keyframes + synced Whisper transcription. Output structured Markdown adhering strictly to schema: Executive Summary (3 sentences), Timestamped Breakdown with raw CLI commands, Technical Deep Dive (architecture & memory invariants), and Implementation Bottlenecks/Trade-offs.',
        },
      ],
    },
    generation_config: {
      temperature: 0.1,
      top_p: 0.95,
      response_mime_type: 'text/markdown',
    },
    contents: [
      {
        role: 'user',
        parts: [
          { text: `Video stream: ${document.videoUrl}` },
          { text: `Video title: ${document.videoTitle}` },
          { text: `Output target: ${document.filename}` },
        ],
      },
    ],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-[#bec8d1]/70 overflow-hidden flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f1f4f9] border-b border-[#bec8d1]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00628c]">send</span>
            <span className="font-semibold text-sm text-[#181c20]">
              Google AI Studio Export Payload
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#dfe3e8] text-[#845000] font-mono text-[11px] font-medium">
              Gemini Format
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
            Ready-to-run prompt package formatted for Google AI Studio or direct cURL calls against
            the Gemini 1.5 Pro / Flash API.
          </p>

          <div className="relative">
            <pre className="p-4 bg-[#181c20] text-[#87ceff] font-mono text-xs rounded-lg overflow-x-auto max-h-72 border border-[#bec8d1]/40">
              {JSON.stringify(exportPayload, null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#2d3135] hover:bg-[#3f484f] text-white font-mono text-xs flex items-center gap-1 transition-colors border border-white/20"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#6f7881] pt-1">
            <span>Model: Gemini 1.5 Pro · Flash Vision</span>
            <span>Schema: AST-PARSER v3.2</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f1f4f9] border-t border-[#bec8d1]/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-mono text-[#3f484f] hover:bg-[#e5e8ee]"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-1.5 rounded text-xs font-mono font-semibold bg-[#00628c] text-white hover:bg-[#007cb0] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            <span>{copied ? 'Copied to Clipboard' : 'Copy Payload'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
