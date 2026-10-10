import React, { useState } from 'react';
import { HISTORY_RECORDS } from '../data/mockData';

interface HistoryCacheViewProps {
  onRestoreRun: (id: string) => void;
}

export const HistoryCacheView: React.FC<HistoryCacheViewProps> = ({ onRestoreRun }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState(HISTORY_RECORDS);

  const filtered = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#bec8d1]/40">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-[#181c20]">
            History &amp; Semantic Cache Storage
          </h2>
          <p className="font-body-md text-body-md text-[#3f484f]">
            Indexed multi-modal embeddings and verified AST Markdown artifacts across past video
            runs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search run archives, tokens, speakers..."
            className="px-3 py-1.5 rounded-lg border border-[#bec8d1] bg-white text-xs font-mono outline-none focus:ring-1 focus:ring-[#00628c] w-64"
          />
        </div>
      </div>

      {/* Semantic Cache Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6f7881]">Semantic Hit Rate</span>
            <span className="material-symbols-outlined text-[#00628c] text-[18px]">memory</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#00628c]">98.2%</div>
          <span className="text-[11px] text-[#845000]">Zero-cost keyframe deduplication</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6f7881]">Tokens Saved (L1 Cache)</span>
            <span className="material-symbols-outlined text-[#845000] text-[18px]">token</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#845000]">1.42M</div>
          <span className="text-[11px] text-[#6f7881]">Reduced API billing by $480.20</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6f7881]">GPU Compute Eliminated</span>
            <span className="material-symbols-outlined text-[#406279] text-[18px]">bolt</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#406279]">38.6 hrs</div>
          <span className="text-[11px] text-[#6f7881]">Across 4x H100 clusters</span>
        </div>
      </div>

      {/* History Catalog Table */}
      <div className="bg-white rounded-xl border border-[#bec8d1]/60 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 bg-[#f1f4f9] border-b border-[#bec8d1]/40 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#181c20] uppercase tracking-wider">
            Cached Extraction Runs ({filtered.length})
          </span>
          <span className="text-xs font-mono text-[#6f7881]">Storage: 142.8 MB</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#bec8d1]/40 text-[#6f7881] font-mono bg-[#f7f9ff]">
                <th className="py-2.5 px-4 font-medium">Run ID</th>
                <th className="py-2.5 px-4 font-medium">Talk Title &amp; Lecturer</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Tokens / Size</th>
                <th className="py-2.5 px-4 font-medium">Speed</th>
                <th className="py-2.5 px-4 font-medium">Cache Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bec8d1]/30 font-mono">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#f1f4f9]/50 transition-colors">
                  <td className="py-3 px-4 text-[#00628c] font-semibold">{r.id}</td>
                  <td className="py-3 px-4 font-sans max-w-sm">
                    <div className="text-xs font-semibold text-[#181c20]">{r.title}</div>
                    <div className="text-[11px] text-[#6f7881]">{r.speaker}</div>
                  </td>
                  <td className="py-3 px-4 text-[#6f7881]">{r.date}</td>
                  <td className="py-3 px-4 text-[#181c20]">
                    {r.tokens} ({r.fileSize})
                  </td>
                  <td className="py-3 px-4 text-[#845000]">{r.speed}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.cacheHit
                          ? 'bg-[#ffddbb]/40 text-[#845000]'
                          : 'bg-[#e5e8ee] text-[#6f7881]'
                      }`}
                    >
                      {r.cacheHit ? 'KV L1 Hit' : 'Fresh Compute'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onRestoreRun(r.id)}
                      className="px-3 py-1 rounded bg-[#00628c] hover:bg-[#007cb0] text-white font-mono text-[11px] transition-colors"
                    >
                      Open in Studio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
