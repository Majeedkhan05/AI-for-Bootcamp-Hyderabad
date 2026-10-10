import React, { useState } from 'react';

export const ApiWebhooksView: React.FC = () => {
  const [activeSdk, setActiveSdk] = useState<'curl' | 'python' | 'ts'>('curl');
  const [apiKey, setApiKey] = useState('ev_live_948f21e0ba394c8e9d22');
  const [webhookUrl, setWebhookUrl] = useState('https://internal.ml-infra.corp/webhooks/video-ast');
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const curlSnippet = `curl -X POST https://api.extractvideo.ai/v2/extract \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "video_url": "https://www.youtube.com/watch?v=bO7Fms_CEgo",
    "parser_template": "principal-ml-systems-v3.2",
    "extract_ocr": true,
    "parse_latex": true,
    "granularity": "rigorous",
    "webhook_url": "${webhookUrl}"
  }'`;

  const pythonSnippet = `from extractvideo import ExtractVideoClient

client = ExtractVideoClient(api_key="${apiKey}")

run = client.extractions.create(
    video_url="https://www.youtube.com/watch?v=bO7Fms_CEgo",
    template="principal-ml-systems-v3.2",
    extract_ocr=True,
    parse_latex=True,
    granularity="rigorous"
)

print(f"Extraction started: {run.id} (status: {run.status})")
notes = run.wait_until_complete()
print(notes.executive_summary)`;

  const tsSnippet = `import { ExtractVideo } from '@extractvideo/sdk';

const ev = new ExtractVideo({ apiKey: '${apiKey}' });

const run = await ev.extractions.create({
  videoUrl: 'https://www.youtube.com/watch?v=bO7Fms_CEgo',
  template: 'principal-ml-systems-v3.2',
  extractOcr: true,
  parseLatex: true,
  granularity: 'rigorous'
});

console.log('Run AST completed:', run.astDocument);`;

  const handleTestPing = () => {
    setPingStatus('Sending HMAC signed test ping to webhook...');
    setTimeout(() => {
      setPingStatus('HTTP 200 OK — Delivery latency: 38ms (ast_event: ping_test)');
      setTimeout(() => setPingStatus(null), 4000);
    }, 700);
  };

  return (
    <div className="p-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#bec8d1]/40">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-[#181c20]">
            Developer API &amp; Webhook Endpoints
          </h2>
          <p className="font-body-md text-body-md text-[#3f484f]">
            Programmatically trigger video knowledge extraction, stream Whisper ASTs, and receive
            verified Markdown callbacks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#6f7881]">API Version:</span>
          <span className="px-2 py-0.5 rounded bg-[#dfe3e8] text-[#00628c] font-mono text-xs font-bold">
            v2.4
          </span>
        </div>
      </div>

      {/* API Key & Webhook Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Key Box */}
        <div className="p-5 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-[#6f7881]">
              Live Ingestion API Key
            </span>
            <button
              onClick={() => {
                setApiKey(`ev_live_${Math.random().toString(36).substring(2, 12)}`);
                alert('Generated new token');
              }}
              className="text-xs font-mono text-[#00628c] hover:underline"
            >
              Roll Key
            </button>
          </div>
          <div className="flex items-center bg-[#f1f4f9] rounded-lg p-2 border border-[#bec8d1]">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="w-full bg-transparent font-mono text-xs text-[#181c20] outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                alert('Copied API Key');
              }}
              className="px-2 py-1 text-xs font-mono bg-[#e5e8ee] hover:bg-[#dfe3e8] text-[#181c20] rounded"
            >
              Copy
            </button>
          </div>
          <p className="text-[11px] text-[#6f7881]">
            Send key in Bearer Authorization header. Rate limit: 25 concurrent streams / 5,000 req/min.
          </p>
        </div>

        {/* Webhook Endpoint Box */}
        <div className="p-5 rounded-xl bg-white border border-[#bec8d1]/60 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-[#6f7881]">
              Delivery Webhook URL
            </span>
            <button
              onClick={handleTestPing}
              className="text-xs font-mono text-[#00628c] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">send</span>
              Test Ping
            </button>
          </div>
          <div className="flex items-center bg-[#f1f4f9] rounded-lg p-2 border border-[#bec8d1]">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-[#181c20] outline-none"
            />
          </div>
          {pingStatus ? (
            <div className="text-[11px] font-mono text-[#845000] font-semibold animate-in fade-in">
              {pingStatus}
            </div>
          ) : (
            <p className="text-[11px] text-[#6f7881]">
              Webhook signatures are signed via SHA256 HMAC in{' '}
              <code className="text-[#00628c]">X-ExtractVideo-Signature</code>.
            </p>
          )}
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="bg-white rounded-xl border border-[#bec8d1]/60 p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#bec8d1]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00628c]">terminal</span>
            <span className="font-semibold text-sm text-[#181c20]">
              Trigger Asynchronous Video Extraction (REST / SDK)
            </span>
          </div>

          <div className="flex items-center bg-[#f1f4f9] p-1 rounded border border-[#bec8d1]/40 font-mono text-xs">
            <button
              onClick={() => setActiveSdk('curl')}
              className={`px-3 py-1 rounded transition-colors ${
                activeSdk === 'curl' ? 'bg-[#00628c] text-white font-semibold' : 'text-[#6f7881]'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveSdk('python')}
              className={`px-3 py-1 rounded transition-colors ${
                activeSdk === 'python' ? 'bg-[#00628c] text-white font-semibold' : 'text-[#6f7881]'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveSdk('ts')}
              className={`px-3 py-1 rounded transition-colors ${
                activeSdk === 'ts' ? 'bg-[#00628c] text-white font-semibold' : 'text-[#6f7881]'
              }`}
            >
              TypeScript
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-[#181c20] text-[#87ceff] font-mono text-xs rounded-lg overflow-x-auto leading-relaxed border border-[#bec8d1]/40">
            {activeSdk === 'curl'
              ? curlSnippet
              : activeSdk === 'python'
              ? pythonSnippet
              : tsSnippet}
          </pre>
          <button
            onClick={() => {
              const code =
                activeSdk === 'curl'
                  ? curlSnippet
                  : activeSdk === 'python'
                  ? pythonSnippet
                  : tsSnippet;
              navigator.clipboard.writeText(code);
              alert('Code copied to clipboard');
            }}
            className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#2d3135] hover:bg-[#3f484f] text-white font-mono text-xs flex items-center gap-1 transition-colors border border-white/20"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            Copy Snippet
          </button>
        </div>
      </div>
    </div>
  );
};
