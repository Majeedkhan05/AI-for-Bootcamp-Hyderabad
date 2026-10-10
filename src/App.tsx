import React, { useState } from 'react';
import { ActiveTab, ExtractionDocument, ExtractionSettings } from './types';
import { DEFAULT_EXTRACTION_DOC, SAMPLE_VIDEOS, HISTORY_RECORDS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TelemetrySubheader } from './components/TelemetrySubheader';
import { ExtractionStudio } from './components/ExtractionStudio';
import { PromptTemplatesView } from './components/PromptTemplatesView';
import { BatchPipelineView } from './components/BatchPipelineView';
import { ApiWebhooksView } from './components/ApiWebhooksView';
import { HistoryCacheView } from './components/HistoryCacheView';
import { CommandPaletteModal } from './components/CommandPaletteModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [document, setDocument] = useState<ExtractionDocument>(DEFAULT_EXTRACTION_DOC);
  const [settings, setSettings] = useState<ExtractionSettings>({
    extractOCR: true,
    parseLatex: true,
    timestampNotes: true,
    filterFiller: true,
    granularity: 'Rigorous',
    systemPrompt:
      'SYSTEM: You are a Principal ML Systems Engineer. Ingest video keyframes + synced Whisper transcription. Output structured Markdown adhering strictly to schema: Executive Summary (3 sentences), Timestamped Breakdown with raw CLI commands, Technical Deep Dive (architecture & memory invariants), and Implementation Bottlenecks/Trade-offs.',
  });

  const [clusterStatus, setClusterStatus] = useState<'online' | 'busy' | 'reheating'>('online');
  const [vramUsed, setVramUsed] = useState(64.2);
  const totalVram = 320;
  const [latencyMs, setLatencyMs] = useState(42);
  const [fps, setFps] = useState(60);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Command Palette ⌘K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extraction Execution Simulation with VRAM & Telemetry reactivity
  const handleRunExtraction = () => {
    if (isExtracting) return;
    setIsExtracting(true);
    setClusterStatus('busy');
    setVramUsed(184.6);
    setLatencyMs(86);

    setTimeout(() => {
      setVramUsed(242.0);
      setLatencyMs(112);
    }, 1200);

    setTimeout(() => {
      setIsExtracting(false);
      setClusterStatus('online');
      setVramUsed(64.2);
      setLatencyMs(42);
      setFps(60);

      // Refresh run timestamp & tokens
      const newTokens = (14820 + Math.floor(Math.random() * 450)).toLocaleString();
      setDocument((prev) => ({
        ...prev,
        runNumber: `#${Math.floor(4093 + Math.random() * 50)}`,
        status: 'COMPLETED (4.2x realtime)',
        tokenCount: `${newTokens} tokens`,
      }));
    }, 2800);
  };

  const handleReRunCache = () => {
    setClusterStatus('reheating');
    setVramUsed(96.0);
    setTimeout(() => {
      setClusterStatus('online');
      setVramUsed(64.2);
      alert('L1 Semantic Cache Re-verified: 0 cache misses, 100% keyframe alignment.');
    }, 800);
  };

  const handleSelectVideoFromPalette = (videoId: string) => {
    const target = SAMPLE_VIDEOS.find((v) => v.id === videoId);
    if (!target) return;
    setDocument((prev) => ({
      ...prev,
      videoTitle: target.title,
      presenter: target.presenter,
      videoUrl: target.url,
      runNumber: target.runNumber,
      previewImage: target.image,
      filename: `${target.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`,
    }));
    setActiveTab('studio');
  };

  const handleRestoreFromHistory = (id: string) => {
    const rec = HISTORY_RECORDS.find((r) => r.id === id);
    if (rec) {
      setDocument((prev) => ({
        ...prev,
        videoTitle: rec.title,
        presenter: rec.speaker,
        duration: rec.duration,
        tokenCount: rec.tokens,
        fileSize: rec.fileSize,
      }));
    }
    setActiveTab('studio');
  };

  const handleApplyTemplate = (tmplText: string) => {
    setSettings((prev) => ({ ...prev, systemPrompt: tmplText }));
    setActiveTab('studio');
  };

  return (
    <div className="bg-[#f7f9ff] min-h-screen text-[#181c20] font-sans antialiased selection:bg-[#007cb0] selection:text-[#fcfcff]">
      {/* Fixed Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        clusterStatus={clusterStatus}
      />

      {/* Fixed Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vramUsed={vramUsed}
        totalVram={totalVram}
        latencyMs={latencyMs}
        fps={fps}
      />

      {/* Main Content Area (offset by fixed header and sidebar) */}
      <div className="pl-64 pt-14 min-h-screen flex flex-col">
        {/* Top Persistent Telemetry Subheader */}
        <TelemetrySubheader document={document} isExtracting={isExtracting} />

        {/* View Routing */}
        <main className="flex-1 w-full bg-[#f7f9ff]">
          {activeTab === 'studio' && (
            <ExtractionStudio
              document={document}
              setDocument={setDocument}
              settings={settings}
              setSettings={setSettings}
              onRunExtraction={handleRunExtraction}
              isExtracting={isExtracting}
              onReRunCache={handleReRunCache}
            />
          )}

          {activeTab === 'prompts' && (
            <PromptTemplatesView onApplyTemplate={handleApplyTemplate} />
          )}

          {activeTab === 'batch' && <BatchPipelineView />}

          {activeTab === 'api' && <ApiWebhooksView />}

          {activeTab === 'history' && (
            <HistoryCacheView onRestoreRun={handleRestoreFromHistory} />
          )}
        </main>
      </div>

      {/* Command Palette Modal (⌘K) */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVideo={handleSelectVideoFromPalette}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
