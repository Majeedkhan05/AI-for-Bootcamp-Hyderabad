import React, { useState } from 'react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      'https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-[#bec8d1]/70 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#f1f4f9] border-b border-[#bec8d1]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 fill-[#181c20]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="font-semibold text-sm text-[#181c20]">
              README.md &amp; Connected GitHub Repository
            </span>
            <span className="px-2 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-mono text-[11px] font-bold">
              v2.4
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6f7881] hover:text-[#181c20] rounded hover:bg-[#e5e8ee] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#3f484f] leading-relaxed">
          {/* Deployed App Badge & Quick Link */}
          <div className="p-4 rounded-xl bg-[#f1f4f9] border border-[#bec8d1]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-mono font-bold text-xs text-[#00628c]">
                Live Cloud Run Deployed URL
              </span>
              <a
                href="https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-[#181c20] underline hover:text-[#00628c] break-all"
              >
                https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app
              </a>
              <span className="text-[10px] text-[#6f7881]">
                Shared Preview:{' '}
                <a
                  href="https://ais-pre-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-[#00628c]"
                >
                  ais-pre-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded bg-white hover:bg-[#e5e8ee] border border-[#bec8d1]/60 font-mono text-[11px] text-[#181c20] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
              <a
                href="https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-[#00628c] hover:bg-[#007cb0] text-white font-mono text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                <span>Open App</span>
              </a>
            </div>
          </div>

          {/* Quick Overview */}
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-[#181c20] mb-1">
              ExtractVideo.ai — v2.4 Instrumentation
            </h3>
            <p className="text-xs text-[#3f484f]">
              High-spec developer instrumentation for extracting structured technical Markdown,
              LaTeX math proofs, and code snippets from ML systems lectures and engineering talks.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#f7f9ff] rounded-lg border border-[#bec8d1]/40 flex flex-col gap-1">
              <span className="font-mono font-bold text-[11px] text-[#00628c]">
                Studio Workspace
              </span>
              <p className="text-[11px] text-[#6f7881]">
                VAD speech waveform with 43 silence regions, synchronized video scrubbing, and
                slide OCR.
              </p>
            </div>
            <div className="p-3 bg-[#f7f9ff] rounded-lg border border-[#bec8d1]/40 flex flex-col gap-1">
              <span className="font-mono font-bold text-[#845000] text-[11px]">
                Multi-View AST Formulations
              </span>
              <p className="text-[11px] text-[#6f7881]">
                Rendered Markdown, Raw Source, Diff View (Whisper vs AST), and JSON syntax tree.
              </p>
            </div>
            <div className="p-3 bg-[#f7f9ff] rounded-lg border border-[#bec8d1]/40 flex flex-col gap-1">
              <span className="font-mono font-bold text-[#406279] text-[11px]">
                H100 Batch Cluster
              </span>
              <p className="text-[11px] text-[#6f7881]">
                Orchestrates across 4x NVIDIA H100 SXM5 80GB nodes with VRAM utilization gauges.
              </p>
            </div>
            <div className="p-3 bg-[#f7f9ff] rounded-lg border border-[#bec8d1]/40 flex flex-col gap-1">
              <span className="font-mono font-bold text-[#00628c] text-[11px]">
                Developer APIs &amp; Webhooks
              </span>
              <p className="text-[11px] text-[#6f7881]">
                Interactive cURL, Python, and TypeScript SDK playgrounds with HMAC signatures.
              </p>
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div>
            <span className="font-mono font-bold text-[11px] text-[#6f7881] uppercase block mb-1">
              Local Development Setup
            </span>
            <pre className="p-3 bg-[#181c20] text-[#87ceff] font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed border border-[#bec8d1]/40">
              {`# Clone & run locally
git clone https://github.com/your-username/extractvideo-ai.git
cd extractvideo-ai
npm install
npm run dev

# Starts on http://localhost:3000`}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#f1f4f9] border-t border-[#bec8d1]/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#6f7881]">
            README.md file created at project root (/)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded text-xs font-mono text-[#3f484f] hover:bg-[#e5e8ee]"
            >
              Close
            </button>
            <a
              href="https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded text-xs font-mono font-semibold bg-[#00628c] text-white hover:bg-[#007cb0] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Visit Deployed App</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
