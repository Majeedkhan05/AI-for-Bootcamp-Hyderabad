import React, { useState } from 'react';
import { BATCH_JOBS } from '../data/mockData';

export const BatchPipelineView: React.FC = () => {
  const [jobs, setJobs] = useState(BATCH_JOBS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [batchUrls, setBatchUrls] = useState('');

  const handleAddBatch = () => {
    if (!batchUrls.trim()) return;
    const urls = batchUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    const newJobs = urls.map((u, i) => ({
      id: `JOB-${4094 + i}`,
      title: `Batch Ingestion: ${u.substring(0, 32)}...`,
      source: 'Direct Manifest URL',
      duration: '--:--',
      status: 'Queued',
      progress: 0,
      worker: `Node #${(i % 4) + 1} (H100-SXM5)`,
      eta: '~04m 30s',
      tokensProcessed: '0',
    }));

    setJobs([...newJobs, ...jobs]);
    setBatchUrls('');
    setShowAddModal(false);
  };

  return (
    <div className="p-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#bec8d1]/40">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-[#181c20]">
            Batch Ingestion &amp; Worker Queue
          </h2>
          <p className="font-body-md text-body-md text-[#3f484f]">
            High-throughput pipeline orchestrated across 4x NVIDIA H100 SXM5 80GB nodes.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-[#00628c] hover:bg-[#007cb0] text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">playlist_add</span>
          Enqueue Batch URLs
        </button>
      </div>

      {/* Hardware Worker Nodes Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((nodeId) => (
          <div
            key={nodeId}
            className="p-4 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#181c20]">
                Node #{nodeId} (H100)
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-[#845000]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#845000] animate-ping"></span>
                ACTIVE
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-[#6f7881]">
                <span>VRAM Util</span>
                <span className="text-[#181c20] font-medium">
                  {nodeId === 1 ? '68.4' : nodeId === 2 ? '72.1' : nodeId === 3 ? '18.2' : '44.8'}{' '}
                  / 80 GB
                </span>
              </div>
              <div className="w-full bg-[#dfe3e8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00628c] h-full rounded-full"
                  style={{
                    width: `${
                      nodeId === 1 ? '85%' : nodeId === 2 ? '90%' : nodeId === 3 ? '22%' : '56%'
                    }`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#6f7881] pt-1 border-t border-[#bec8d1]/30">
              <span>PCIe: Gen5 x16</span>
              <span>Power: 312W</span>
            </div>
          </div>
        ))}
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-[#bec8d1]/60 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 bg-[#f1f4f9] border-b border-[#bec8d1]/40 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#181c20] uppercase tracking-wider">
            Active &amp; Historical Pipeline Tasks ({jobs.length})
          </span>
          <span className="text-xs font-mono text-[#6f7881]">
            Throughput: 4.2x realtime aggregate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#bec8d1]/40 text-[#6f7881] font-mono bg-[#f7f9ff]">
                <th className="py-2.5 px-4 font-medium">Job ID</th>
                <th className="py-2.5 px-4 font-medium">Video / Stream Manifest</th>
                <th className="py-2.5 px-4 font-medium">Duration</th>
                <th className="py-2.5 px-4 font-medium">Worker Slot</th>
                <th className="py-2.5 px-4 font-medium">Progress / Status</th>
                <th className="py-2.5 px-4 font-medium">Tokens</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bec8d1]/30 font-mono">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#f1f4f9]/50 transition-colors">
                  <td className="py-3 px-4 text-[#00628c] font-semibold">{job.id}</td>
                  <td className="py-3 px-4 font-sans text-[#181c20] font-medium max-w-xs truncate">
                    {job.title}
                  </td>
                  <td className="py-3 px-4 text-[#6f7881]">{job.duration}</td>
                  <td className="py-3 px-4 text-[#406279]">{job.worker}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-[10px]">
                        <span
                          className={`font-semibold ${
                            job.status === 'Completed'
                              ? 'text-[#845000]'
                              : job.status === 'Running'
                              ? 'text-[#00628c]'
                              : 'text-[#6f7881]'
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-[#6f7881]">{job.progress}%</span>
                      </div>
                      <div className="w-full bg-[#dfe3e8] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            job.status === 'Completed'
                              ? 'bg-[#845000]'
                              : job.status === 'Running'
                              ? 'bg-[#00628c]'
                              : 'bg-[#6f7881]'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#181c20]">{job.tokensProcessed}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Inspection opened for ${job.id}`)}
                      className="text-[#00628c] hover:underline px-2 py-1 rounded hover:bg-[#e5e8ee]"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-[#bec8d1]/70 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-2">
              <span className="font-semibold text-sm text-[#181c20]">
                Enqueue Batch Video Extraction
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6f7881] hover:text-[#181c20]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#3f484f]">
              Paste video URLs (one per line). Supported: YouTube, direct MP4, S3 presigned URIs.
            </p>
            <textarea
              value={batchUrls}
              onChange={(e) => setBatchUrls(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=...\nhttps://www.youtube.com/watch?v=..."
              rows={5}
              className="w-full p-3 font-mono text-xs border border-[#bec8d1] rounded-lg bg-[#f7f9ff]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs font-mono text-[#3f484f]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBatch}
                className="px-4 py-1.5 text-xs font-mono font-semibold bg-[#00628c] text-white rounded-lg hover:bg-[#007cb0]"
              >
                Enqueue Jobs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
