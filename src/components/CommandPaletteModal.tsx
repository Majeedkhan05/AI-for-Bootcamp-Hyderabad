import React, { useState } from 'react';
import { SAMPLE_VIDEOS, PROMPT_TEMPLATES, HISTORY_RECORDS } from '../data/mockData';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (videoId: string) => void;
  onSelectTab: (tab: any) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectVideo,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-[#bec8d1]/70 overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-[#bec8d1]/50 gap-3">
          <span className="material-symbols-outlined text-[#00628c]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search extraction runs, formulas, CUDA kernels, schemas..."
            className="w-full text-sm outline-none text-[#181c20] placeholder-[#6f7881]"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#dfe3e8] font-mono text-xs text-[#6f7881]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Section: Video Runs */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase text-[#6f7881]">
              Knowledge Extraction Runs
            </div>
            <div className="space-y-1 mt-1">
              {SAMPLE_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    onSelectVideo(v.id);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#f1f4f9] flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#00628c] text-[18px]">
                      description
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[#181c20] group-hover:text-[#00628c]">
                        {v.title}
                      </div>
                      <div className="text-[11px] text-[#6f7881]">{v.presenter}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#845000] bg-[#ffddbb]/40 px-1.5 py-0.5 rounded">
                    {v.runNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Navigation */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase text-[#6f7881]">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <button
                onClick={() => {
                  onSelectTab('studio');
                  onClose();
                }}
                className="text-left px-3 py-1.5 rounded hover:bg-[#f1f4f9] text-xs font-mono text-[#3f484f] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                Studio Canvas
              </button>
              <button
                onClick={() => {
                  onSelectTab('prompts');
                  onClose();
                }}
                className="text-left px-3 py-1.5 rounded hover:bg-[#f1f4f9] text-xs font-mono text-[#3f484f] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">code_blocks</span>
                Parser Prompts (14)
              </button>
              <button
                onClick={() => {
                  onSelectTab('batch');
                  onClose();
                }}
                className="text-left px-3 py-1.5 rounded hover:bg-[#f1f4f9] text-xs font-mono text-[#3f484f] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">reorder</span>
                Batch Pipeline
              </button>
              <button
                onClick={() => {
                  onSelectTab('api');
                  onClose();
                }}
                className="text-left px-3 py-1.5 rounded hover:bg-[#f1f4f9] text-xs font-mono text-[#3f484f] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">webhook</span>
                API &amp; Webhooks
              </button>
              <button
                onClick={() => {
                  window.open('https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app', '_blank');
                  onClose();
                }}
                className="text-left px-3 py-1.5 rounded hover:bg-[#f1f4f9] text-xs font-mono text-[#00628c] font-semibold flex items-center gap-2 col-span-2 border border-[#00628c]/20 bg-[#00628c]/5"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Open Deployed App &amp; Project README
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
