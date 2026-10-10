import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  vramUsed: number;
  totalVram: number;
  latencyMs: number;
  fps: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  vramUsed,
  totalVram,
  latencyMs,
  fps,
}) => {
  const percentage = Math.min(100, Math.round((vramUsed / totalVram) * 100));

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#ffffff] border-r border-[#bec8d1]/40 z-40 flex flex-col justify-between p-space-sm">
      <div className="space-y-space-md">
        <div className="px-space-sm py-space-xs text-[#6f7881] font-label-xs text-label-xs tracking-wider uppercase">
          Telemetry &amp; Ingestion
        </div>

        <nav className="space-y-1">
          {/* Studio Canvas */}
          <button
            onClick={() => setActiveTab('studio')}
            className={`w-full flex items-center justify-between px-space-sm py-2 rounded transition-colors text-left ${
              activeTab === 'studio'
                ? 'bg-[#e5e8ee] text-[#00628c] font-medium border border-[#bec8d1]'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span className="font-body-sm text-body-sm">Studio Canvas</span>
            </div>
            <span className="font-code-sm text-code-sm text-[#00628c] font-semibold">LIVE</span>
          </button>

          {/* Parser Prompts */}
          <button
            onClick={() => setActiveTab('prompts')}
            className={`w-full flex items-center justify-between px-space-sm py-2 rounded transition-colors text-left ${
              activeTab === 'prompts'
                ? 'bg-[#e5e8ee] text-[#00628c] font-medium border border-[#bec8d1]'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px]">code_blocks</span>
              <span className="font-body-sm text-body-sm">Parser Prompts</span>
            </div>
            <span className="font-code-sm text-code-sm text-[#6f7881]">14</span>
          </button>

          {/* Queue & Tasks */}
          <button
            onClick={() => setActiveTab('batch')}
            className={`w-full flex items-center justify-between px-space-sm py-2 rounded transition-colors text-left ${
              activeTab === 'batch'
                ? 'bg-[#e5e8ee] text-[#00628c] font-medium border border-[#bec8d1]'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px]">reorder</span>
              <span className="font-body-sm text-body-sm">Queue &amp; Tasks</span>
            </div>
            <span className="font-code-sm text-code-sm text-[#845000]">8 idle</span>
          </button>

          {/* Endpoints */}
          <button
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center justify-between px-space-sm py-2 rounded transition-colors text-left ${
              activeTab === 'api'
                ? 'bg-[#e5e8ee] text-[#00628c] font-medium border border-[#bec8d1]'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px]">webhook</span>
              <span className="font-body-sm text-body-sm">Endpoints</span>
            </div>
            <span className="font-code-sm text-code-sm text-[#6f7881]">v2.4</span>
          </button>

          {/* Semantic Cache */}
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between px-space-sm py-2 rounded transition-colors text-left ${
              activeTab === 'history'
                ? 'bg-[#e5e8ee] text-[#00628c] font-medium border border-[#bec8d1]'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px]">memory</span>
              <span className="font-body-sm text-body-sm">Semantic Cache</span>
            </div>
            <span className="font-code-sm text-code-sm text-[#6f7881]">98.2%</span>
          </button>
        </nav>
      </div>

      {/* Cluster Hardware Telemetry Card */}
      <div className="p-space-sm rounded bg-[#f1f4f9] border border-[#bec8d1]/40 space-y-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-xs text-label-xs text-[#6f7881]">INFERENCE CLUSTER</span>
          <span className="font-code-sm text-code-sm text-[#845000] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#845000] animate-pulse"></span>
            ONLINE
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between font-code-sm text-code-sm">
            <span className="text-[#3f484f]">VRAM Util:</span>
            <span className="text-[#181c20] font-medium">
              {vramUsed.toFixed(1)} / {totalVram} GB
            </span>
          </div>
          <div className="w-full bg-[#dfe3e8] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#00628c] h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-space-xs text-[10px] font-code-sm text-[#6f7881] flex items-center justify-between">
          <span>LATENCY: {latencyMs}ms</span>
          <span>FRAME: {fps}FPS</span>
        </div>
      </div>
    </aside>
  );
};
