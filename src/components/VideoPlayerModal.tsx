import React, { useState } from 'react';
import { TimestampSection } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  presenter: string;
  previewImage: string;
  timestampSections: TimestampSection[];
  onSelectTimestamp: (ts: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  presenter,
  previewImage,
  timestampSections,
  onSelectTimestamp,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(72); // seconds (01:12)
  const totalDuration = 4468; // 01:14:28 in seconds
  const [showOcrBox, setShowOcrBox] = useState(true);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${h > 0 ? `${h.toString().padStart(2, '0')}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#bec8d1]/60 flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#f1f4f9] border-b border-[#bec8d1]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00628c]">smart_display</span>
            <span className="font-semibold text-sm text-[#181c20] truncate">{videoTitle}</span>
            <span className="text-xs text-[#6f7881]">({presenter})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6f7881] hover:text-[#181c20] rounded hover:bg-[#e5e8ee] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Canvas Display */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          <img
            src={previewImage}
            alt="Slide playback"
            className="w-full h-full object-contain"
          />

          {/* OCR Bounding Box overlay */}
          {showOcrBox && (
            <div className="absolute top-[22%] left-[28%] w-[44%] h-[38%] border border-[#00628c] bg-[#00628c]/10 pointer-events-none rounded transition-all">
              <span className="absolute -top-5 left-0 bg-[#00628c] text-white text-[9px] font-mono px-1 py-0.5 rounded">
                OCR DETECT: Hopper TMA Async Pipeline
              </span>
            </div>
          )}

          {/* Controls overlay on bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
            {/* Scrubber track */}
            <div className="relative w-full h-2 bg-white/20 rounded cursor-pointer group/track">
              <div
                className="h-full bg-[#00628c] rounded relative"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 hover:text-[#c8e6ff] transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <span>
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
                <button
                  onClick={() => setShowOcrBox(!showOcrBox)}
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    showOcrBox
                      ? 'bg-[#007cb0] border-transparent text-white'
                      : 'border-white/40 text-white/70'
                  }`}
                >
                  OCR Boxes: {showOcrBox ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/70">4K 60FPS · H.265 Direct Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Synced Chapters Bar */}
        <div className="p-3 bg-[#f1f4f9] border-t border-[#bec8d1]/40 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-semibold text-[#6f7881] uppercase tracking-wider">
            Jump to Synced AST Anchors
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {timestampSections.map((ts, idx) => (
              <button
                key={ts.id}
                onClick={() => {
                  onSelectTimestamp(ts.timeRange);
                  if (idx === 0) setCurrentTime(72);
                  if (idx === 1) setCurrentTime(890);
                  if (idx === 2) setCurrentTime(2310);
                }}
                className="text-left p-2 rounded bg-white hover:bg-[#e5e8ee] border border-[#bec8d1]/60 transition-colors flex flex-col gap-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00628c]">
                    [{ts.timeRange}]
                  </span>
                  <span className="text-[10px] font-mono text-[#845000]">{ts.badge}</span>
                </div>
                <span className="text-xs text-[#181c20] truncate">{ts.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
