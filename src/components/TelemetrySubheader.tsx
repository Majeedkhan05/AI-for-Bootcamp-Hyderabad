import React from 'react';
import { ExtractionDocument } from '../types';

interface TelemetrySubheaderProps {
  document: ExtractionDocument;
  isExtracting: boolean;
}

export const TelemetrySubheader: React.FC<TelemetrySubheaderProps> = ({
  document,
  isExtracting,
}) => {
  return (
    <section className="w-full bg-[#f1f4f9] px-margin-desktop py-space-sm shadow-sm border-b border-[#bec8d1]/30">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        {/* Breadcrumb & status */}
        <div className="flex items-center gap-space-sm min-w-0">
          <span className="material-symbols-outlined text-[#00628c] text-[18px]">terminal</span>
          <div className="flex items-center gap-1.5 font-code-sm text-code-sm text-[#6f7881] truncate">
            <span>Projects</span>
            <span className="text-[#bec8d1]">/</span>
            <span className="text-[#181c20] truncate font-medium">{document.videoTitle}</span>
            <span className="text-[#bec8d1]">/</span>
            <span className="text-[#406279] font-medium">{document.filename}</span>
          </div>

          <span className="px-space-xs py-0.5 rounded bg-[#dfe3e8] text-[#845000] font-code-sm text-code-sm font-medium flex items-center gap-1 shadow-sm shrink-0">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-[#845000] ${
                isExtracting ? 'animate-ping' : 'animate-pulse'
              }`}
            ></span>
            {isExtracting ? 'RUNNING PIPELINE (Streaming)' : document.status}
          </span>
        </div>

        {/* Runtime telemetry metrics */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs bg-[#dfe3e8]/60 px-space-sm py-1 rounded">
            <span className="material-symbols-outlined text-[15px] text-[#6f7881]">timer</span>
            <span className="font-code-sm text-code-sm text-[#181c20]">{document.duration}</span>
          </div>

          <div className="flex items-center gap-space-xs bg-[#dfe3e8]/60 px-space-sm py-1 rounded">
            <span className="material-symbols-outlined text-[15px] text-[#6f7881]">token</span>
            <span className="font-code-sm text-code-sm text-[#181c20]">{document.tokenCount}</span>
          </div>

          <div className="hidden sm:flex items-center gap-space-xs bg-[#007cb0]/15 text-[#00628c] px-space-sm py-1 rounded border border-[#007cb0]/25">
            <span className="material-symbols-outlined text-[15px] text-[#00628c]">model_training</span>
            <span className="font-code-sm text-code-sm font-medium">{document.model}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
