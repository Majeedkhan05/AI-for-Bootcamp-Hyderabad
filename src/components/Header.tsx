import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  clusterStatus: 'online' | 'busy' | 'reheating';
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  clusterStatus,
}) => {
  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('prod-ml-infra / videos');
  const [showNotifications, setShowNotifications] = useState(false);

  const projects = [
    'prod-ml-infra / videos',
    'stanford-cs336-systems',
    'arxiv-lectures-archive',
    'cuda-optimization-h100',
  ];

  const notifications = [
    { id: 1, title: 'AST Verification Passed', desc: 'extraction_run_#4092.md verified against 128k context schema', time: '2m ago', unread: true },
    { id: 2, title: 'Cluster Worker Swapped', desc: 'Node #2 assigned to Whisper VAD chunking', time: '14m ago', unread: false },
    { id: 3, title: 'Cache Invalidation Saved', desc: '98.2% semantic cache hit prevented 14.8k tokens', time: '1h ago', unread: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#bec8d1]/40">
      <div className="h-14 w-full px-margin-desktop flex items-center justify-between gap-space-lg">
        {/* Left branding and project dropdown */}
        <div className="flex items-center gap-space-md">
          <div
            className="flex items-center gap-space-sm cursor-pointer select-none"
            onClick={() => setActiveTab('studio')}
          >
            <img
              alt="Video Knowledge Extractor Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WL4knBZ3EczYA0JP3audGig5n50SRl2Cz--BQ9CAiN3mvzqGSuYQC5hJbZMF53NqymK51V9hYAKLTAzgWNs2c9nqg1CKEazgZ0ZryCv1u0ycoP3FhuM1GEedCSlXPWnC05HkLTP1AbDJNk9SQIX_YpLIxrS_XP49QJip2zxrK4Cbqa5pqjAfwEqqj-0Oo3r71F81zxCdIE7PNrwz9Pdcj6E1MnZrojbyI28GCRr2EmIJFnVJwJce05WJI"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-[#181c20]">
                ExtractVideo<span className="text-[#00628c]">.ai</span>
              </span>
              <span className="font-label-xs text-label-xs text-[#6f7881]">
                v2.4 INSTRUMENTATION
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-[#bec8d1]/60 mx-space-xs hidden sm:block"></div>

          {/* Project Directory Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setProjectOpen(!projectOpen)}
              className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-[#f1f4f9] border border-[#bec8d1]/50 text-[#3f484f] hover:text-[#181c20] cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00628c]">folder_open</span>
              <span className="font-code-sm text-code-sm text-[#181c20] font-medium">
                {selectedProject}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#6f7881]">unfold_more</span>
            </button>

            {projectOpen && (
              <div className="absolute top-full mt-1 left-0 w-64 bg-white rounded-md shadow-lg border border-[#bec8d1]/60 py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-mono text-[#6f7881] font-semibold border-b border-[#bec8d1]/30">
                  Switch Active Project
                </div>
                {projects.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedProject(p);
                      setProjectOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-[#f1f4f9] ${
                      selectedProject === p ? 'text-[#00628c] font-semibold bg-[#e5e8ee]/40' : 'text-[#3f484f]'
                    }`}
                  >
                    <span>{p}</span>
                    {selectedProject === p && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="hidden xl:flex items-center gap-space-xs">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-space-md py-1.5 rounded transition-colors text-xs font-mono ${
              activeTab === 'studio'
                ? 'bg-[#e5e8ee] text-[#00628c] font-semibold border border-[#bec8d1]/70'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            Extraction Studio
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-space-md py-1.5 rounded transition-colors text-xs font-mono ${
              activeTab === 'prompts'
                ? 'bg-[#e5e8ee] text-[#00628c] font-semibold border border-[#bec8d1]/70'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            Prompt Templates
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-space-md py-1.5 rounded transition-colors text-xs font-mono ${
              activeTab === 'batch'
                ? 'bg-[#e5e8ee] text-[#00628c] font-semibold border border-[#bec8d1]/70'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            Batch Pipeline
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-space-md py-1.5 rounded transition-colors text-xs font-mono ${
              activeTab === 'api'
                ? 'bg-[#e5e8ee] text-[#00628c] font-semibold border border-[#bec8d1]/70'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            API & Webhooks
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-space-md py-1.5 rounded transition-colors text-xs font-mono ${
              activeTab === 'history'
                ? 'bg-[#e5e8ee] text-[#00628c] font-semibold border border-[#bec8d1]/70'
                : 'text-[#3f484f] hover:bg-[#ebeef4] hover:text-[#181c20] border border-transparent'
            }`}
          >
            History & Cache
          </button>
        </nav>

        {/* Right Controls: Cluster status, search, notifications, profile */}
        <div className="flex items-center gap-space-md">
          {/* Cluster Status Pill */}
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-[#f1f4f9] border border-[#bec8d1]/50">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  clusterStatus === 'online' ? 'bg-[#845000]' : 'bg-[#007cb0]'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  clusterStatus === 'online' ? 'bg-[#845000]' : 'bg-[#007cb0]'
                }`}
              ></span>
            </span>
            <span className="font-code-sm text-code-sm text-[#845000] font-medium hidden sm:inline">
              GPU Worker Ready: 4x H100
            </span>
            <span className="font-code-sm text-code-sm text-[#845000] font-medium sm:hidden">
              4x H100
            </span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-space-sm px-space-sm py-1 rounded bg-[#f1f4f9] border border-[#bec8d1]/50 hover:border-[#6f7881] text-[#3f484f] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px] text-[#6f7881]">search</span>
            <span className="font-body-sm text-body-sm text-[#3f484f]">Search docs</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#dfe3e8] font-code-sm text-code-sm text-[#6f7881] border border-[#bec8d1]/40">
              ⌘K
            </kbd>
          </button>

          {/* Notifications and Profile */}
          <div className="flex items-center gap-space-sm relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-1.5 rounded hover:bg-[#ebeef4] text-[#3f484f] hover:text-[#181c20] transition-colors relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#00628c] rounded-full"></span>
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#bec8d1]/70 p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#bec8d1]/40">
                  <span className="text-xs font-semibold font-mono text-[#181c20]">
                    Inference & AST Alerts
                  </span>
                  <span className="text-[10px] text-[#00628c] cursor-pointer hover:underline">
                    Mark read
                  </span>
                </div>
                <div className="divide-y divide-[#bec8d1]/30 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#181c20]">{n.title}</span>
                        <span className="text-[10px] text-[#6f7881] font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#3f484f] mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-space-xs pl-space-xs border-l border-[#bec8d1]/50">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#bec8d1]/60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCywSMOcf-hOqf5uOCfiD1FYhnfgmpb8I_0NPhbjf6tJEAMNpUkrifFGxAqvxf0LIjvLAegtrh8J-kYZ9OHsd-CN-fJjBxQmrBboWWsII1BVwbZrYstcauNh9xjCWZb5tn8xxauiVAQI-59dAkyJNoKY_N41hlqVR6qKAY6bPJvvOfr-tuWCF0gn9M4nLgd0RIUk2HMbgC4MFlRgB1nkarIijf1S0vYDMH2dTSDo91sBcVyR-2SpNc2Ow"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-label-md text-label-md text-[#181c20] leading-tight font-medium">
                  dr.chen@infra
                </span>
                <span className="font-label-xs text-label-xs text-[#6f7881]">
                  Principal Researcher
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
