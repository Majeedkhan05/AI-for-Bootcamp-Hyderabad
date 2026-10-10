import React, { useState, useEffect } from 'react';
import {
  ExtractionDocument,
  ExtractionSettings,
  OutputViewMode,
  GranularityLevel,
} from '../types';
import { VideoPlayerModal } from './VideoPlayerModal';
import { SystemPromptModal } from './SystemPromptModal';
import { AiStudioModal } from './AiStudioModal';
import { SAMPLE_VIDEOS } from '../data/mockData';

interface ExtractionStudioProps {
  document: ExtractionDocument;
  setDocument: React.Dispatch<React.SetStateAction<ExtractionDocument>>;
  settings: ExtractionSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExtractionSettings>>;
  onRunExtraction: () => void;
  isExtracting: boolean;
  onReRunCache: () => void;
}

export const ExtractionStudio: React.FC<ExtractionStudioProps> = ({
  document,
  setDocument,
  settings,
  setSettings,
  onRunExtraction,
  isExtracting,
  onReRunCache,
}) => {
  const [viewMode, setViewMode] = useState<OutputViewMode>('rendered');
  const [copyToast, setCopyToast] = useState(false);
  const [codeCopiedToast, setCodeCopiedToast] = useState<string | null>(null);
  const [promptDrawerOpen, setPromptDrawerOpen] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isAiStudioModalOpen, setIsAiStudioModalOpen] = useState(false);
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState(document.videoUrl);

  // Sync url input with document
  useEffect(() => {
    setVideoUrlInput(document.videoUrl);
  }, [document.videoUrl]);

  // Keyboard shortcut ⌘ + Enter or Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onRunExtraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRunExtraction]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(document.rawMarkdown);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const handleCopyCode = (snippet: string, name: string) => {
    navigator.clipboard.writeText(snippet);
    setCodeCopiedToast(name);
    setTimeout(() => setCodeCopiedToast(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([document.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportConfig = () => {
    const config = {
      pipeline: 'extractvideo-v2.4',
      settings,
      target_model: document.model,
      output: document.filename,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'extraction-pipeline-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectPresetVideo = (vId: string) => {
    const target = SAMPLE_VIDEOS.find((v) => v.id === vId);
    if (!target) return;

    if (target.id === 'vid-1') {
      // restore default
      setVideoUrlInput(target.url);
      setDocument((prev) => ({
        ...prev,
        videoUrl: target.url,
        videoTitle: target.title,
        presenter: target.presenter,
        runNumber: target.runNumber,
      }));
    } else {
      setVideoUrlInput(target.url);
      setDocument((prev) => ({
        ...prev,
        videoUrl: target.url,
        videoTitle: target.title,
        presenter: target.presenter,
        runNumber: target.runNumber,
        filename: `${target.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`,
        previewImage: target.image,
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 w-full min-h-[calc(100vh-8.5rem)]">
      {/* ============================================================== */}
      {/* LEFT PANE: Ingestion Pipeline & Parameters (Col span 4)        */}
      {/* ============================================================== */}
      <div className="xl:col-span-4 bg-[#ffffff] p-space-md flex flex-col gap-space-md border-r border-[#bec8d1]/30">
        {/* Input Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm font-semibold text-[#181c20]">
              Video Pipeline Input
            </span>
            <span
              className="material-symbols-outlined text-[16px] text-[#6f7881] cursor-pointer hover:text-[#181c20]"
              title="Ingests video keyframes, audio waveform, and slide OCR metadata"
            >
              info
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#e5e8ee] px-space-xs py-0.5 rounded text-[#845000] font-code-sm text-code-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#845000]"></span>
            <span>KV-Cached L1</span>
          </div>
        </div>

        {/* URL Ingestion Box & Presets */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between font-label-xs text-label-xs text-[#6f7881] uppercase tracking-wider">
            <span>Source Stream URL</span>
            <span className="text-[#406279] font-code-sm lowercase">manifest: direct_sync</span>
          </div>

          <div className="relative flex items-center bg-[#f1f4f9] rounded p-1 shadow-inner focus-within:ring-1 focus-within:ring-[#00628c]">
            <span className="px-space-xs py-0.5 bg-[#dfe3e8] rounded text-[#00628c] font-code-sm text-code-sm flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[14px]">smart_display</span>
              YT
            </span>
            <input
              aria-label="Video URL input"
              className="bg-transparent border-0 outline-none w-full px-space-sm font-code-sm text-code-sm text-[#181c20] truncate"
              type="text"
              value={videoUrlInput}
              onChange={(e) => {
                setVideoUrlInput(e.target.value);
                setDocument((prev) => ({ ...prev, videoUrl: e.target.value }));
              }}
              placeholder="Enter YouTube URL or direct MP4..."
            />
            {videoUrlInput && (
              <button
                onClick={() => {
                  setVideoUrlInput('');
                  setDocument((prev) => ({ ...prev, videoUrl: '' }));
                }}
                aria-label="Clear field"
                className="p-1 text-[#6f7881] hover:text-[#181c20] rounded"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pt-0.5">
            <span className="text-[10px] text-[#6f7881] shrink-0 font-mono">Sample:</span>
            {SAMPLE_VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectPresetVideo(v.id)}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap transition-colors ${
                  document.videoTitle === v.title
                    ? 'bg-[#007cb0] text-white font-medium'
                    : 'bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#3f484f]'
                }`}
              >
                {v.title.split(':')[0].substring(0, 20)}...
              </button>
            ))}
          </div>
        </div>

        {/* Video Metadata / Slide Preview Card */}
        <div className="flex flex-col rounded bg-[#f1f4f9] overflow-hidden shadow-sm border border-[#bec8d1]/40">
          <div className="relative w-full aspect-video bg-[#dfe3e8] overflow-hidden group">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              src={document.previewImage}
              alt="Lecture slide thumbnail preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#d7dae0] via-transparent to-black/40"></div>

            {/* Badges on Preview */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="bg-[#ffffff]/90 backdrop-blur px-2 py-0.5 rounded text-[#00628c] font-code-sm text-code-sm font-semibold">
                [01:14:28]
              </span>
              <span className="bg-[#ffffff]/80 backdrop-blur px-1.5 py-0.5 rounded text-[#845000] font-code-sm text-code-sm font-semibold">
                4K 60FPS
              </span>
            </div>

            <div className="absolute top-2 right-2">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-[#ffffff]/80 p-1 rounded text-[#181c20] cursor-pointer hover:text-[#00628c] hover:bg-white transition-colors flex items-center shadow-sm"
                title="Open Synchronized Video Player"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex flex-col">
              <span className="font-headline-sm text-headline-sm text-[#181c20] font-semibold drop-shadow-sm truncate">
                {document.videoTitle}
              </span>
              <span className="font-body-sm text-body-sm text-[#3f484f] drop-shadow-sm truncate">
                {document.presenter}
              </span>
            </div>
          </div>

          {/* Audio Waveform Visualizer Section */}
          <div className="p-space-sm bg-[#f1f4f9] flex flex-col gap-1">
            <div className="flex items-center justify-between font-label-xs text-label-xs text-[#6f7881]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#845000]">
                  graphic_eq
                </span>
                VAD SPEECH ACTIVITY
              </span>
              <span className="font-code-sm text-code-sm text-[#181c20]">
                {document.vadSpeechRegions}
              </span>
            </div>

            {/* Interactive Waveform SVG */}
            <div
              className="w-full h-8 bg-[#ffffff] rounded p-1 flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-[#00628c] transition-all"
              onClick={() => setIsVideoModalOpen(true)}
              title="Click to scrub audio waveform"
            >
              <svg className="w-full h-full text-[#00628c]" fill="none" viewBox="0 0 320 28">
                {/* Silence zones */}
                <rect fill="currentColor" fillOpacity="0.08" height="26" rx="1" width="18" x="52" y="1" />
                <rect fill="currentColor" fillOpacity="0.08" height="26" rx="1" width="14" x="144" y="1" />
                <rect fill="currentColor" fillOpacity="0.08" height="26" rx="1" width="22" x="238" y="1" />
                {/* Waveform bars */}
                <path
                  d="M4 14v4M8 11v8M12 7v14M16 4v20M20 9v11M24 12v6M28 8v12M32 5v18M36 10v9M40 7v15M44 11v8M48 13v3M52 14v1M56 14v0M60 14v0M64 14v1M68 14v0M72 10v9M76 6v16M80 4v20M84 7v14M88 11v7M92 8v12M96 6v17M100 9v11M104 12v5M108 8v13M112 5v18M116 11v7M120 7v14M124 9v11M128 4v20M132 8v12M136 12v5M140 13v2M144 14v0M148 14v0M152 14v0M156 14v1M160 8v12M164 4v20M168 6v17M172 9v11M176 11v7M180 5v18M184 7v14M188 10v9M192 6v16M196 4v20M200 8v12M204 11v7M208 7v14M212 9v11M216 5v18M220 8v13M224 10v9M228 12v5M232 13v3M236 14v1M240 14v0M244 14v0M248 14v0M252 14v0M256 14v1M260 9v11M264 6v16M268 4v20M272 8v13M276 10v9M280 5v18M284 7v15M288 11v7M292 8v12M296 6v17M300 9v11M304 12v5M308 8v13M312 5v18M316 11v7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Developer Parsing Toggles */}
        <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col gap-space-sm shadow-sm border border-[#bec8d1]/40">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm font-medium text-[#181c20]">
              Extraction Settings
            </span>
            <span className="font-code-sm text-code-sm text-[#00628c] font-semibold">
              AST-PARSER v2
            </span>
          </div>

          <div className="space-y-space-xs">
            {/* Toggle 1: OCR terminal logs */}
            <label className="flex items-center justify-between p-2 rounded bg-[#dfe3e8]/30 hover:bg-[#dfe3e8]/60 transition-colors cursor-pointer">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-body-md text-body-md text-[#181c20] truncate font-medium">
                  Extract OCR terminal logs &amp; code
                </span>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  Hopper PTX, PyTorch, CUDA kernels
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  aria-label="Extract OCR terminal logs and code"
                  checked={settings.extractOCR}
                  onChange={(e) => setSettings({ ...settings, extractOCR: e.target.checked })}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-9 h-5 bg-[#dfe3e8] peer-checked:bg-[#00628c] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d7dae0] peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </div>
            </label>

            {/* Toggle 2: Parse LaTeX math */}
            <label className="flex items-center justify-between p-2 rounded bg-[#dfe3e8]/30 hover:bg-[#dfe3e8]/60 transition-colors cursor-pointer">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-body-md text-body-md text-[#181c20] truncate font-medium">
                  Parse LaTeX math &amp; proofs
                </span>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  Converts chalkboard equations
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  aria-label="Parse LaTeX math and proofs"
                  checked={settings.parseLatex}
                  onChange={(e) => setSettings({ ...settings, parseLatex: e.target.checked })}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-9 h-5 bg-[#dfe3e8] peer-checked:bg-[#00628c] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d7dae0] peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </div>
            </label>

            {/* Toggle 3: Timestamp-linked deep dive notes */}
            <label className="flex items-center justify-between p-2 rounded bg-[#dfe3e8]/30 hover:bg-[#dfe3e8]/60 transition-colors cursor-pointer">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-body-md text-body-md text-[#181c20] truncate font-medium">
                  Timestamp-linked deep dive notes
                </span>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  Scrub synchronization anchor points
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  aria-label="Timestamp-linked deep dive notes"
                  checked={settings.timestampNotes}
                  onChange={(e) => setSettings({ ...settings, timestampNotes: e.target.checked })}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-9 h-5 bg-[#dfe3e8] peer-checked:bg-[#00628c] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d7dae0] peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </div>
            </label>

            {/* Toggle 4: Filter filler speech */}
            <label className="flex items-center justify-between p-2 rounded bg-[#dfe3e8]/30 hover:bg-[#dfe3e8]/60 transition-colors cursor-pointer">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-body-md text-body-md text-[#181c20] truncate font-medium">
                  Filter filler speech &amp; QA banter
                </span>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  Removes pauses, mic checks, chatter
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  aria-label="Filter filler speech and QA banter"
                  checked={settings.filterFiller}
                  onChange={(e) => setSettings({ ...settings, filterFiller: e.target.checked })}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-9 h-5 bg-[#dfe3e8] peer-checked:bg-[#00628c] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#d7dae0] peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </div>
            </label>
          </div>

          {/* Summary Granularity Segmented Control */}
          <div className="pt-2 flex flex-col gap-1.5">
            <div className="flex justify-between items-center font-label-xs text-label-xs text-[#6f7881]">
              <span>EXTRACTION GRANULARITY</span>
              <span className="text-[#406279] font-code-sm">
                LEVEL{' '}
                {settings.granularity === 'High-Level'
                  ? '1'
                  : settings.granularity === 'Rigorous'
                  ? '2'
                  : '3'}{' '}
                of 3
              </span>
            </div>
            <div className="grid grid-cols-3 bg-[#dfe3e8] p-1 rounded gap-1 text-center font-code-sm text-code-sm">
              {(['High-Level', 'Rigorous', 'Line-AST'] as GranularityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSettings({ ...settings, granularity: level })}
                  className={`py-1 rounded transition-colors ${
                    settings.granularity === level
                      ? 'bg-[#f1f4f9] text-[#00628c] font-semibold shadow-sm'
                      : 'text-[#6f7881] hover:text-[#181c20]'
                  }`}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Card: System Prompt */}
        <div className="rounded bg-[#f1f4f9] p-space-sm flex flex-col gap-space-xs shadow-sm border border-[#bec8d1]/40">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setPromptDrawerOpen(!promptDrawerOpen)}
          >
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px] text-[#6f7881] group-hover:text-[#00628c] transition-colors">
                code_blocks
              </span>
              <span className="font-body-sm text-body-sm text-[#181c20] font-medium">
                System Prompt &amp; Extraction Schema
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-code-sm text-code-sm font-semibold">
                v3.2
              </span>
              <span
                className={`material-symbols-outlined text-[16px] text-[#6f7881] transition-transform ${
                  promptDrawerOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </div>
          </div>

          {promptDrawerOpen && (
            <div className="pt-2 flex flex-col gap-2 animate-in fade-in">
              <div className="bg-[#ffffff] p-2.5 rounded font-code-sm text-code-sm text-[#3f484f] overflow-x-auto leading-relaxed border-l-2 border-[#00628c] shadow-xs">
                <span className="text-[#406279] font-bold">SYSTEM:</span>{' '}
                {settings.systemPrompt.replace(/^SYSTEM:\s*/, '')}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsPromptModalOpen(true)}
                  className="text-[#00628c] hover:text-[#406279] font-code-sm text-code-sm flex items-center gap-1 py-1 px-2 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Edit Prompt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action CTAs */}
        <div className="flex flex-col gap-space-xs mt-auto pt-space-sm">
          <button
            onClick={onRunExtraction}
            disabled={isExtracting}
            className={`w-full bg-[#007cb0] text-[#fcfcff] hover:bg-[#00628c] transition-all duration-200 py-2.5 px-space-md rounded font-body-md text-body-md font-semibold flex items-center justify-center gap-space-sm shadow-md hover:shadow-[#007cb0]/20 cursor-pointer ${
              isExtracting ? 'opacity-80 cursor-wait' : ''
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isExtracting ? 'animate-spin' : ''
              }`}
            >
              {isExtracting ? 'hourglass_top' : 'auto_awesome'}
            </span>
            <span>{isExtracting ? 'Extracting via Gemini Flash...' : 'Extract Knowledge'}</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#fcfcff]/20 text-[#fcfcff] font-code-sm text-code-sm ml-1">
              ⌘ + Enter
            </kbd>
          </button>

          <div className="grid grid-cols-2 gap-space-xs">
            <button
              onClick={onReRunCache}
              className="py-1.5 px-2 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#3f484f] hover:text-[#181c20] font-code-sm text-code-sm transition-colors flex items-center justify-center gap-1 border border-[#bec8d1]/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">cached</span>
              <span>Re-run L1 Cache</span>
            </button>
            <button
              onClick={handleExportConfig}
              className="py-1.5 px-2 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#3f484f] hover:text-[#181c20] font-code-sm text-code-sm transition-colors flex items-center justify-center gap-1 border border-[#bec8d1]/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Export Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT PANE: Structured Output Workspace (Col span 8)          */}
      {/* ============================================================== */}
      <div className="xl:col-span-8 bg-[#d7dae0]/50 p-space-md xl:p-space-lg flex flex-col gap-space-md overflow-y-auto">
        {/* Workspace Action Toolbar */}
        <div className="bg-[#f1f4f9] p-space-sm rounded flex flex-wrap items-center justify-between gap-space-sm shadow-sm border border-[#bec8d1]/40">
          {/* View Mode Segment Tabs */}
          <div className="flex items-center bg-[#ffffff] p-1 rounded gap-1 border border-[#bec8d1]/40">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-space-md py-1 rounded font-code-sm text-code-sm font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'rendered'
                  ? 'bg-[#e5e8ee] text-[#00628c] shadow-xs'
                  : 'text-[#6f7881] hover:text-[#181c20]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">markdown</span>
              Rendered Markdown
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-space-md py-1 rounded font-code-sm text-code-sm transition-colors ${
                viewMode === 'raw'
                  ? 'bg-[#e5e8ee] text-[#00628c] font-medium shadow-xs'
                  : 'text-[#6f7881] hover:text-[#181c20]'
              }`}
              type="button"
            >
              Raw Source (.md)
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`px-space-md py-1 rounded font-code-sm text-code-sm transition-colors ${
                viewMode === 'diff'
                  ? 'bg-[#e5e8ee] text-[#00628c] font-medium shadow-xs'
                  : 'text-[#6f7881] hover:text-[#181c20]'
              }`}
              type="button"
            >
              Diff View
            </button>
            <button
              onClick={() => setViewMode('ast')}
              className={`px-space-md py-1 rounded font-code-sm text-code-sm transition-colors ${
                viewMode === 'ast'
                  ? 'bg-[#e5e8ee] text-[#00628c] font-medium shadow-xs'
                  : 'text-[#6f7881] hover:text-[#181c20]'
              }`}
              type="button"
            >
              JSON AST
            </button>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              onClick={handleCopyMarkdown}
              className="px-space-sm py-1 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#181c20] font-code-sm text-code-sm flex items-center gap-1 transition-colors relative border border-[#bec8d1]/50 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-[#00628c]">
                content_copy
              </span>
              <span>Copy Markdown</span>
              {copyToast && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#dfe3e8] text-[#845000] px-2 py-0.5 rounded text-[11px] font-code-sm pointer-events-none shadow-md border border-[#bec8d1]">
                  Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAiStudioModalOpen(true)}
              className="px-space-sm py-1 rounded bg-[#406279]/15 hover:bg-[#406279]/25 text-[#406279] font-code-sm text-code-sm flex items-center gap-1 transition-colors border border-[#406279]/30 font-medium"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>AI Studio</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="p-1 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#3f484f] hover:text-[#181c20] border border-[#bec8d1]/50"
              title="Download .md file"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>

            <button
              onClick={() => {
                alert('Exported markdown bundle to Obsidian / Notion vault format.');
              }}
              className="p-1 rounded bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#3f484f] hover:text-[#181c20] border border-[#bec8d1]/50"
              title="Export to Obsidian"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW MODE 1: Rendered Markdown                                 */}
        {/* ============================================================== */}
        {viewMode === 'rendered' && (
          <article className="bg-[#ffffff] rounded p-space-lg lg:p-space-xl flex flex-col gap-space-xl shadow-md border border-[#bec8d1]/40">
            {/* Document Titlebar Meta */}
            <header className="flex flex-col gap-space-xs pb-space-md bg-[#f1f4f9]/40 -mx-space-lg lg:-mx-space-xl -mt-space-lg lg:-mt-space-xl p-space-md lg:p-space-lg rounded-t border-b border-[#bec8d1]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[#00628c] text-[22px]">
                    description
                  </span>
                  <h1 className="font-headline-lg text-headline-lg font-semibold text-[#181c20]">
                    {document.filename}
                  </h1>
                </div>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  {document.fileSize} · {document.wordCount}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm font-code-sm text-code-sm text-[#6f7881]">
                <span className="flex items-center gap-1 text-[#845000] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  AST Verified
                </span>
                <span>•</span>
                <span>
                  Tokens: {document.tokensIn} / {document.tokensOut}
                </span>
                <span>•</span>
                <span className="text-[#00628c] font-medium">Synced: {document.syncRange}</span>
              </div>
            </header>

            {/* SECTION 1: Executive Summary */}
            <section className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-[#00628c] font-label-xs text-label-xs tracking-wider uppercase font-semibold">
                <span className="material-symbols-outlined text-[15px]">summarize</span>
                <span>[01] Executive Summary</span>
              </div>

              <div className="rounded bg-[#f1f4f9] p-space-md relative overflow-hidden shadow-sm border border-[#bec8d1]/40">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00628c]"></div>
                <div className="space-y-space-xs font-body-lg text-body-lg text-[#181c20] leading-relaxed pl-space-xs">
                  {document.executiveSummary.map((point, i) => (
                    <p key={i}>
                      {i === 0 && (
                        <>
                          <strong className="text-[#00628c] font-medium">
                            1. Distributed key-value cache sharding
                          </strong>{' '}
                          across tensor-parallel ranks reduces per-GPU high-bandwidth memory
                          footprint from{' '}
                          <code className="font-code-sm text-code-sm bg-[#dfe3e8] px-1.5 py-0.5 rounded text-[#406279] font-mono">
                            O(N·L)
                          </code>{' '}
                          to{' '}
                          <code className="font-code-sm text-code-sm bg-[#dfe3e8] px-1.5 py-0.5 rounded text-[#406279] font-mono">
                            O(N·L/P)
                          </code>
                          , enabling 128k context lengths without memory thrashing.
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <strong className="text-[#00628c] font-medium">
                            2. PagedAttention eliminates internal memory fragmentation
                          </strong>{' '}
                          by allocating non-contiguous virtual blocks mapped via hardware page
                          tables, achieving{' '}
                          <span className="text-[#845000] font-semibold">96.4%</span> GPU memory
                          utilization compared to traditional contiguous allocations.
                        </>
                      )}
                      {i === 2 && (
                        <>
                          <strong className="text-[#00628c] font-medium">
                            3. Speculative decoding combined with chunked prefill
                          </strong>{' '}
                          minimizes time-to-first-token (TTFT) by overlapping compute-bound prompt
                          evaluation with bandwidth-bound token generation loops.
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: Timestamped Breakdown */}
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-[#00628c] font-label-xs text-label-xs tracking-wider uppercase font-semibold">
                  <span className="material-symbols-outlined text-[15px]">timeline</span>
                  <span>[02] Timestamped Breakdown &amp; AST Formulations</span>
                </div>
                <span className="font-code-sm text-code-sm text-[#6f7881]">
                  {document.timestampSections.length} Major Intervals
                </span>
              </div>

              <div className="flex flex-col gap-space-md">
                {/* Timestamp Item 1 */}
                <div
                  className={`rounded bg-[#f1f4f9] p-space-md flex flex-col gap-space-sm shadow-sm border border-[#bec8d1]/40 transition-all ${
                    highlightedTimestamp === '00:12 - 04:30' ? 'ring-2 ring-[#00628c]' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <span
                        onClick={() => {
                          setHighlightedTimestamp('00:12 - 04:30');
                          setIsVideoModalOpen(true);
                        }}
                        className="px-space-sm py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-code-sm text-code-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#007cb0] hover:text-[#fcfcff] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                        [00:12 - 04:30]
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-semibold text-[#181c20]">
                        Memory Footprint of Autoregressive Attention &amp; KV-Cache Sizing
                      </h3>
                    </div>
                    <span className="font-code-sm text-code-sm text-[#845000] font-semibold">
                      Verified Proof
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-[#3f484f] leading-relaxed">
                    During autoregressive decoding, every token generated requires storing key and
                    value projections for all previous tokens in high-bandwidth memory (HBM).
                    Without sharding, cache growth linearly throttles batch size and drives memory
                    bandwidth bottlenecks.
                  </p>

                  {/* LaTeX Block */}
                  <div className="bg-[#ffffff] p-space-md rounded flex flex-col gap-space-xs shadow-inner border border-[#bec8d1]/40">
                    <div className="flex items-center justify-between font-label-xs text-label-xs text-[#6f7881]">
                      <span>KV-CACHE FOOTPRINT EQUATION (LATEX)</span>
                      <span className="text-[#406279] font-code-sm font-semibold">
                        O(B × S × L × H)
                      </span>
                    </div>
                    <div className="font-code-md text-code-md text-[#00628c] overflow-x-auto py-2 text-center tracking-wide font-mono font-medium">
                      $$\text&#123;Memory&#125;_\text&#123;KV&#125; = 2 \times n_\text&#123;layers&#125;
                      \times n_\text&#123;heads&#125; \times d_\text&#123;head&#125; \times
                      s_\text&#123;seq&#125; \times b_\text&#123;batch&#125; \times
                      \text&#123;bytes\_per\_element&#125;$$
                    </div>
                  </div>

                  {/* Executable Code Box */}
                  <div className="rounded bg-[#ffffff] overflow-hidden shadow-inner border border-[#bec8d1]/50">
                    <div className="bg-[#e5e8ee] px-space-sm py-1 flex items-center justify-between border-b border-[#bec8d1]/40">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ba1a1a]"></span>
                        <span className="h-2 w-2 rounded-full bg-[#6f7881]"></span>
                        <span className="h-2 w-2 rounded-full bg-[#845000]"></span>
                        <span className="font-code-sm text-code-sm text-[#6f7881] ml-2 font-mono">
                          calc_kv_cache.py
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            `python calc_kv_cache.py \\\n  --layers 32 \\\n  --heads 32 \\\n  --dim 128 \\\n  --ctx 131072 \\\n  --precision fp16`,
                            'calc_kv_cache.py'
                          )
                        }
                        className="text-[#6f7881] hover:text-[#181c20] font-code-sm text-code-sm flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {codeCopiedToast === 'calc_kv_cache.py' ? 'check' : 'content_copy'}
                        </span>
                        <span>
                          {codeCopiedToast === 'calc_kv_cache.py' ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>
                    <pre className="p-space-sm font-code-sm text-code-sm text-[#3f484f] overflow-x-auto leading-relaxed">
                      <code>
                        <span className="text-[#6f7881]">
                          # Compute FP16 memory requirements across 128k context
                        </span>
                        {'\n'}python calc_kv_cache.py \{'\n'} --layers 32 \{'\n'} --heads 32 \{'\n'}{' '}
                        --dim 128 \{'\n'} --ctx 131072 \{'\n'} --precision fp16
                      </code>
                    </pre>
                  </div>

                  {/* Inset Callout Note */}
                  <div className="rounded bg-[#dfe3e8]/50 p-space-sm flex items-start gap-space-xs border border-[#bec8d1]/40">
                    <span className="material-symbols-outlined text-[#00628c] text-[18px] shrink-0 mt-0.5">
                      lightbulb
                    </span>
                    <span className="font-body-sm text-body-sm text-[#181c20]">
                      <strong className="text-[#00628c] font-medium">Memory Note:</strong> At 128k
                      tokens in FP16, KV cache alone consumes{' '}
                      <strong className="text-[#406279] font-mono">32.8 GB</strong> per sequence
                      batch before activation checkpointing or attention masking is allocated.
                    </span>
                  </div>
                </div>

                {/* Timestamp Item 2 */}
                <div
                  className={`rounded bg-[#f1f4f9] p-space-md flex flex-col gap-space-sm shadow-sm border border-[#bec8d1]/40 transition-all ${
                    highlightedTimestamp === '14:45 - 22:18' ? 'ring-2 ring-[#00628c]' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <span
                        onClick={() => {
                          setHighlightedTimestamp('14:45 - 22:18');
                          setIsVideoModalOpen(true);
                        }}
                        className="px-space-sm py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-code-sm text-code-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#007cb0] hover:text-[#fcfcff] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                        [14:45 - 22:18]
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-semibold text-[#181c20]">
                        PagedAttention Kernel Implementation &amp; Virtual Memory Mapping
                      </h3>
                    </div>
                    <span className="font-code-sm text-code-sm text-[#406279] font-semibold">
                      CUDA Kernel
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-[#3f484f] leading-relaxed">
                    PagedAttention maps discontinuous physical memory chunks to logically contiguous
                    address ranges using an operating system style page table. Block tables dynamically
                    record key-value block pointers, mitigating fragmentation waste down to below 4%.
                  </p>

                  {/* Shell Command Snippet */}
                  <div className="rounded bg-[#ffffff] overflow-hidden shadow-inner border border-[#bec8d1]/50">
                    <div className="bg-[#e5e8ee] px-space-sm py-1 flex items-center justify-between border-b border-[#bec8d1]/40">
                      <span className="font-code-sm text-code-sm text-[#6f7881] font-mono">
                        BASH (vLLM PRODUCTION RUNTIME)
                      </span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            `vllm serve meta-llama/Llama-3-70b-Instruct \\\n  --tensor-parallel-size 4 \\\n  --gpu-memory-utilization 0.95 \\\n  --max-model-len 65536`,
                            'vllm'
                          )
                        }
                        className="material-symbols-outlined text-[#6f7881] text-[16px] cursor-pointer hover:text-[#181c20]"
                      >
                        {codeCopiedToast === 'vllm' ? 'check' : 'content_copy'}
                      </button>
                    </div>
                    <pre className="p-space-sm font-code-sm text-code-sm text-[#845000] overflow-x-auto leading-relaxed">
                      <code>
                        vllm serve meta-llama/Llama-3-70b-Instruct \{'\n'} --tensor-parallel-size 4{' '}
                        \{'\n'} --gpu-memory-utilization 0.95 \{'\n'} --max-model-len 65536
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Timestamp Item 3 (Interactive Collapsible Accordion) */}
                <div className="rounded bg-[#f1f4f9] border border-[#bec8d1]/40 overflow-hidden shadow-sm transition-all">
                  <div
                    onClick={() => setAccordionOpen(!accordionOpen)}
                    className="p-space-sm flex items-center justify-between cursor-pointer hover:bg-[#e5e8ee] transition-colors"
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="px-space-sm py-0.5 rounded bg-[#dfe3e8] text-[#6f7881] font-code-sm text-code-sm font-medium">
                        [38:10 - 52:40]
                      </span>
                      <span className="font-body-md text-body-md text-[#181c20] font-medium truncate">
                        Tensor Parallelism vs Pipeline Parallelism Overhead in FlashAttention-3
                      </span>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <span className="font-code-sm text-code-sm text-[#6f7881]">14 min segment</span>
                      <span
                        className={`material-symbols-outlined text-[#6f7881] text-[18px] transition-transform ${
                          accordionOpen ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>

                  {accordionOpen && (
                    <div className="p-space-md border-t border-[#bec8d1]/40 flex flex-col gap-space-sm bg-white animate-in fade-in">
                      <p className="font-body-md text-body-md text-[#3f484f] leading-relaxed">
                        FlashAttention-3 leverages hardware asynchronous data movement and FP8 precision
                        on Hopper GPUs. In distributed clusters, tensor parallel comms via All-Reduce
                        saturate intra-node NVLink, while pipeline parallelism incurs bubble overhead
                        proportional to (P - 1) / M.
                      </p>

                      <div className="bg-[#f1f4f9] p-space-sm rounded font-mono text-xs text-[#00628c] text-center border border-[#bec8d1]/40">
                        $$\text&#123;Bubble Fraction&#125; = \frac&#123;p - 1&#125;&#123;m + p - 1&#125;
                        \quad \text&#123;where &#125; m = \text&#123;microbatches&#125;, \, p =
                        \text&#123;stages&#125;$$
                      </div>

                      <div className="rounded bg-[#f1f4f9] overflow-hidden border border-[#bec8d1]/40">
                        <div className="bg-[#e5e8ee] px-space-sm py-1 flex items-center justify-between text-[11px] font-mono text-[#6f7881]">
                          <span>torch_dist_comm_bench.py</span>
                          <span
                            onClick={() =>
                              handleCopyCode(
                                `torchrun --nproc_per_node=8 benchmark_allreduce.py \\\n  --backend nccl \\\n  --tensor-size 4096,4096 \\\n  --warmup 20 --iters 100`,
                                'torchrun'
                              )
                            }
                            className="cursor-pointer hover:text-[#181c20]"
                          >
                            Copy
                          </span>
                        </div>
                        <pre className="p-space-sm font-code-sm text-code-sm text-[#3f484f] overflow-x-auto">
                          <code>
                            # Validate cross-node NVLink latency barrier{'\n'}torchrun
                            --nproc_per_node=8 benchmark_allreduce.py \{'\n'} --backend nccl \{'\n'}{' '}
                            --tensor-size 4096,4096 \{'\n'} --warmup 20 --iters 100
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 3: Technical Deep Dive Bento Grid */}
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-[#00628c] font-label-xs text-label-xs tracking-wider uppercase font-semibold">
                  <span className="material-symbols-outlined text-[15px]">architecture</span>
                  <span>[03] Technical Deep Dive &amp; Invariants</span>
                </div>
                <span className="font-code-sm text-code-sm text-[#6f7881]">Hopper / H100 Target</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Bento Card A: COMPUTE */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col justify-between gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform border border-[#bec8d1]/40">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[#00628c] text-[20px]">
                        layers
                      </span>
                      <span className="font-code-sm text-code-sm text-[#406279] font-medium">
                        COMPUTE
                      </span>
                    </div>
                    <h4 className="font-body-md text-body-md font-semibold text-[#181c20]">
                      {document.deepDiveInvariants.compute.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-[#3f484f] leading-relaxed">
                      {document.deepDiveInvariants.compute.description}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] font-code-sm text-code-sm text-[#00628c] border border-[#bec8d1]/30">
                    <code>{document.deepDiveInvariants.compute.code}</code>
                  </div>
                </div>

                {/* Bento Card B: HARDWARE */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col justify-between gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform border border-[#bec8d1]/40">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[#845000] text-[20px]">
                        memory
                      </span>
                      <span className="font-code-sm text-code-sm text-[#845000] font-medium">
                        HARDWARE
                      </span>
                    </div>
                    <h4 className="font-body-md text-body-md font-semibold text-[#181c20]">
                      {document.deepDiveInvariants.hardware.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-[#3f484f] leading-relaxed">
                      {document.deepDiveInvariants.hardware.description}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] font-code-sm text-code-sm text-[#845000] border border-[#bec8d1]/30">
                    <code>{document.deepDiveInvariants.hardware.code}</code>
                  </div>
                </div>

                {/* Bento Card C: CACHE */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col justify-between gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform border border-[#bec8d1]/40">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[#406279] text-[20px]">
                        account_tree
                      </span>
                      <span className="font-code-sm text-code-sm text-[#406279] font-medium">
                        CACHE
                      </span>
                    </div>
                    <h4 className="font-body-md text-body-md font-semibold text-[#181c20]">
                      {document.deepDiveInvariants.cache.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-[#3f484f] leading-relaxed">
                      {document.deepDiveInvariants.cache.description}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] font-code-sm text-code-sm text-[#406279] border border-[#bec8d1]/30">
                    <code>{document.deepDiveInvariants.cache.code}</code>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Bottlenecks & Critical Architecture Notes */}
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-[#00628c] font-label-xs text-label-xs tracking-wider uppercase font-semibold">
                  <span className="material-symbols-outlined text-[15px]">warning</span>
                  <span>[04] Implementation Bottlenecks &amp; Constraints</span>
                </div>
                <span className="font-code-sm text-code-sm text-[#ba1a1a] font-semibold">
                  2 Production Alerts
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                {/* Amber Warning Callout */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col gap-1 relative overflow-hidden shadow-sm border border-[#bec8d1]/40">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                  <div className="flex items-center gap-space-xs text-amber-600 pl-space-xs">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span className="font-body-md text-body-md font-semibold">
                      CRITICAL BOTTLENECK: NVLink Bandwidth Saturation on All-Reduce
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#3f484f] leading-relaxed pl-space-xs">
                    When scaling tensor parallelism across multi-node InfiniBand instead of intra-node
                    NVLink, TP synchronization degrades by{' '}
                    <strong className="text-amber-700">8.4x</strong>. Tensor-parallel degree must remain{' '}
                    <code className="font-code-sm text-code-sm bg-[#dfe3e8] px-1 py-0.5 rounded text-amber-800 font-mono">
                      TP ≤ 8
                    </code>{' '}
                    strictly within single-node DGX boundaries.{' '}
                    <span className="text-[#00628c] font-code-sm text-code-sm">[Ref: 42:15]</span>
                  </p>
                </div>

                {/* Rose / Red Caution Callout */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col gap-1 relative overflow-hidden shadow-sm border border-[#bec8d1]/40">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ba1a1a]"></div>
                  <div className="flex items-center gap-space-xs text-[#ba1a1a] pl-space-xs">
                    <span className="material-symbols-outlined text-[18px]">report_problem</span>
                    <span className="font-body-md text-body-md font-semibold">
                      NUMA Node Socket Thrashing with Host-to-Device Memory Swapping
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#3f484f] leading-relaxed pl-space-xs">
                    Enabling CPU memory offloading drops end-to-end token generation from 480 tok/s down
                    to 32 tok/s caused by PCIe Gen5 bus saturation. Recommend strict memory pinning via{' '}
                    <code className="font-code-sm text-code-sm bg-[#dfe3e8] px-1 py-0.5 rounded text-[#ba1a1a] font-mono">
                      numactl --interleave=all
                    </code>
                    .{' '}
                    <span className="text-[#00628c] font-code-sm text-code-sm">[Ref: 59:02]</span>
                  </p>
                </div>

                {/* Cyan Info Box (Recommended Production Configuration) */}
                <div className="rounded bg-[#f1f4f9] p-space-md flex flex-col gap-space-xs relative overflow-hidden shadow-sm border border-[#bec8d1]/40">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00628c]"></div>
                  <div className="flex items-center gap-space-xs text-[#00628c] pl-space-xs">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    <span className="font-body-md text-body-md font-semibold">
                      Recommended Production Deployment Profile
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs pl-space-xs pt-1 font-code-sm text-code-sm text-[#181c20]">
                    <div className="flex items-center gap-2 bg-[#dfe3e8]/40 p-2 rounded border border-[#bec8d1]/30">
                      <span className="material-symbols-outlined text-[14px] text-[#845000]">
                        check
                      </span>
                      <span>{document.deploymentProfile.tpDegree}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#dfe3e8]/40 p-2 rounded border border-[#bec8d1]/30">
                      <span className="material-symbols-outlined text-[14px] text-[#845000]">
                        check
                      </span>
                      <span>{document.deploymentProfile.blockSize}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#dfe3e8]/40 p-2 rounded border border-[#bec8d1]/30">
                      <span className="material-symbols-outlined text-[14px] text-[#845000]">
                        check
                      </span>
                      <span>{document.deploymentProfile.gpuMemUtil}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#dfe3e8]/40 p-2 rounded border border-[#bec8d1]/30">
                      <span className="material-symbols-outlined text-[14px] text-[#845000]">
                        check
                      </span>
                      <span>{document.deploymentProfile.prefixCache}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 2: Raw Source (.md)                                  */}
        {/* ============================================================== */}
        {viewMode === 'raw' && (
          <div className="bg-[#ffffff] rounded p-space-lg flex flex-col gap-3 shadow-md border border-[#bec8d1]/40">
            <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-2">
              <span className="text-xs font-mono font-bold text-[#181c20]">
                RAW MARKDOWN BUFFER: {document.filename}
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="text-xs font-mono text-[#00628c] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Copy All
              </button>
            </div>
            <textarea
              value={document.rawMarkdown}
              onChange={(e) => setDocument({ ...document, rawMarkdown: e.target.value })}
              rows={28}
              className="w-full font-mono text-xs bg-[#f7f9ff] text-[#181c20] p-4 rounded-lg border border-[#bec8d1] focus:outline-none focus:ring-2 focus:ring-[#00628c] leading-relaxed resize-y"
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 3: Diff View (Whisper vs AST Synthesized)             */}
        {/* ============================================================== */}
        {viewMode === 'diff' && (
          <div className="bg-[#ffffff] rounded p-space-lg flex flex-col gap-4 shadow-md border border-[#bec8d1]/40">
            <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00628c]">difference</span>
                <span className="text-xs font-mono font-bold text-[#181c20]">
                  AST SYNTHESIS DIFF (RAW WHISPER vs STRUCTURED SPEC)
                </span>
              </div>
              <span className="text-xs font-mono text-[#845000] bg-[#ffddbb]/40 px-2 py-0.5 rounded">
                Filler removed: 84.6% · Code injected: +100%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Raw transcription with filler highlighted in red */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-[#ba1a1a] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  Raw Ingested Whisper Transcripts
                </span>
                <pre className="p-3 bg-[#ffdad6]/20 border border-[#ffdad6] text-xs font-mono text-[#3f484f] rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {document.rawWhisperBaseline}
                </pre>
              </div>

              {/* Right: Synthesized AST Markdown */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-[#00628c] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00628c]"></span>
                  Synthesized AST Normalized Notes
                </span>
                <pre className="p-3 bg-[#c8e6ff]/20 border border-[#c8e6ff] text-xs font-mono text-[#181c20] rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {document.rawMarkdown.slice(0, 750)}
                  {'\n'}... [Truncated for preview comparison]
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW MODE 4: JSON AST Syntax Tree                              */}
        {/* ============================================================== */}
        {viewMode === 'ast' && (
          <div className="bg-[#ffffff] rounded p-space-lg flex flex-col gap-3 shadow-md border border-[#bec8d1]/40">
            <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00628c]">data_object</span>
                <span className="text-xs font-mono font-bold text-[#181c20]">
                  AST SYNTAX NODES TREE (JSON SCHEMA v2.4)
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(document, null, 2));
                  alert('AST JSON copied to clipboard');
                }}
                className="text-xs font-mono text-[#00628c] hover:underline"
              >
                Copy AST JSON
              </button>
            </div>
            <pre className="p-4 bg-[#181c20] text-[#87ceff] font-mono text-xs rounded-lg overflow-x-auto max-h-[600px] border border-[#bec8d1]/40 leading-relaxed">
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* Sub-modals                                                     */}
      {/* ============================================================== */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoTitle={document.videoTitle}
        presenter={document.presenter}
        previewImage={document.previewImage}
        timestampSections={document.timestampSections}
        onSelectTimestamp={(ts) => {
          setHighlightedTimestamp(ts);
          setIsVideoModalOpen(false);
        }}
      />

      <SystemPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        systemPrompt={settings.systemPrompt}
        onSavePrompt={(p) => setSettings({ ...settings, systemPrompt: p })}
      />

      <AiStudioModal
        isOpen={isAiStudioModalOpen}
        onClose={() => setIsAiStudioModalOpen(false)}
        document={document}
      />
    </div>
  );
};
