import { ExtractionDocument } from '../types';

export const DEFAULT_EXTRACTION_DOC: ExtractionDocument = {
  id: 'doc-4092',
  filename: 'distributed-kv-cache-optimization.md',
  runNumber: '#4092',
  status: 'COMPLETED (4.2x realtime)',
  speedMultiplier: '4.2x',
  duration: '04m 12s',
  tokenCount: '14,820 tokens',
  tokensIn: '14.8k In',
  tokensOut: '2.3k Out',
  model: 'Gemini 1.5 Pro · Flash Vision',
  fileSize: '6.4 KB',
  wordCount: '1,840 words',
  syncRange: '00:00:00 - 01:14:28',
  videoUrl: 'https://www.youtube.com/watch?v=bO7Fms_CEgo',
  videoTitle: 'Distributed Sharding & FlashAttention-2',
  presenter: 'Dr. Alexei Romanov (Stanford / Meta AI)',
  resolution: '4K',
  fps: '60FPS',
  previewImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCpSsLKC19ZO-Kw1okuFHDHAwLAifx555Ae3E-E2Yq2sImAnlztpOuTdbIi8esecRRQmsmSHG6Kj1Ufb0Tz5u8pcA-CvsCnB6PZkfTtV2Aa2pyZGTehBIK7eaKvazy83WAOTNw_wMrme2EIcUdW3aGxxCauNhJAuED8rdh2HWX7cCwzJA45uncujJdiBB2c3WXi3E-k2XouuNuGpPxUOGPpFDMgYDigVEboQxn3xr9pipblTqAmEWQa5A',
  vadSpeechRegions: '43 Cut Silence Regions',
  executiveSummary: [
    '1. Distributed key-value cache sharding across tensor-parallel ranks reduces per-GPU high-bandwidth memory footprint from O(N·L) to O(N·L/P), enabling 128k context lengths without memory thrashing.',
    '2. PagedAttention eliminates internal memory fragmentation by allocating non-contiguous virtual blocks mapped via hardware page tables, achieving 96.4% GPU memory utilization compared to traditional contiguous allocations.',
    '3. Speculative decoding combined with chunked prefill minimizes time-to-first-token (TTFT) by overlapping compute-bound prompt evaluation with bandwidth-bound token generation loops.',
  ],
  timestampSections: [
    {
      id: 'ts-1',
      timeRange: '00:12 - 04:30',
      title: 'Memory Footprint of Autoregressive Attention & KV-Cache Sizing',
      badge: 'Verified Proof',
      badgeType: 'verified',
      description:
        'During autoregressive decoding, every token generated requires storing key and value projections for all previous tokens in high-bandwidth memory (HBM). Without sharding, cache growth linearly throttles batch size and drives memory bandwidth bottlenecks.',
      equationName: 'KV-CACHE FOOTPRINT EQUATION (LATEX)',
      equationComplexity: 'O(B × S × L × H)',
      equationLatex:
        '$$\\text{Memory}_{\\text{KV}} = 2 \\times n_{\\text{layers}} \\times n_{\\text{heads}} \\times d_{\\text{head}} \\times s_{\\text{seq}} \\times b_{\\text{batch}} \\times \\text{bytes\\_per\\_element}$$',
      codeFilename: 'calc_kv_cache.py',
      codeSnippet: `# Compute FP16 memory requirements across 128k context
python calc_kv_cache.py \\
  --layers 32 \\
  --heads 32 \\
  --dim 128 \\
  --ctx 131072 \\
  --precision fp16`,
      calloutTitle: 'Memory Note:',
      calloutNote:
        'At 128k tokens in FP16, KV cache alone consumes 32.8 GB per sequence batch before activation checkpointing or attention masking is allocated.',
    },
    {
      id: 'ts-2',
      timeRange: '14:45 - 22:18',
      title: 'PagedAttention Kernel Implementation & Virtual Memory Mapping',
      badge: 'CUDA Kernel',
      badgeType: 'cuda',
      description:
        'PagedAttention maps discontinuous physical memory chunks to logically contiguous address ranges using an operating system style page table. Block tables dynamically record key-value block pointers, mitigating fragmentation waste down to below 4%.',
      codeFilename: 'BASH (vLLM PRODUCTION RUNTIME)',
      codeSnippet: `vllm serve meta-llama/Llama-3-70b-Instruct \\
  --tensor-parallel-size 4 \\
  --gpu-memory-utilization 0.95 \\
  --max-model-len 65536`,
    },
    {
      id: 'ts-3',
      timeRange: '38:10 - 52:40',
      title: 'Tensor Parallelism vs Pipeline Parallelism Overhead in FlashAttention-3',
      badge: '14 min segment',
      badgeType: 'hpc',
      description:
        'FlashAttention-3 leverages hardware asynchronous data movement and FP8 precision on Hopper GPUs. In distributed clusters, tensor parallel comms via All-Reduce saturate intra-node NVLink, while pipeline parallelism incurs bubble overhead proportional to (P - 1) / M.',
      equationName: 'PIPELINE BUBBLE EFFICIENCY',
      equationComplexity: 'Bubble = (P - 1) / (K + P - 1)',
      equationLatex:
        '$$\\text{Bubble Fraction} = \\frac{p - 1}{m + p - 1} \\quad \\text{where } m = \\text{microbatches}, \\, p = \\text{stages}$$',
      codeFilename: 'torch_dist_comm_bench.py',
      codeSnippet: `# Validate cross-node NVLink latency barrier
torchrun --nproc_per_node=8 benchmark_allreduce.py \\
  --backend nccl \\
  --tensor-size 4096,4096 \\
  --warmup 20 --iters 100`,
      calloutTitle: 'Hardware Barrier:',
      calloutNote:
        'Scaling TP past 8 degrades compute-to-communication ratio by 4.1x on 400Gbps InfiniBand.',
      isCollapsed: true,
    },
  ],
  deepDiveInvariants: {
    compute: {
      tag: 'COMPUTE',
      title: 'Chunked Prefill Latency Masking',
      description:
        'Micro-batches of prefill tokens are interleaved directly alongside single-token decode sequences to prevent GPU compute under-utilization during steady generation.',
      code: 'max_num_batched_tokens = 2048',
    },
    hardware: {
      tag: 'HARDWARE',
      title: 'Asynchronous FP8 Matrix Mult',
      description:
        'Leverages Hopper Tensor Memory Accelerator (TMA) to transfer tensor tiles directly between global HBM and shared memory without using register files.',
      code: 'cuda::memcpy_async(tma_desc)',
    },
    cache: {
      tag: 'CACHE',
      title: 'Radix Prefix Caching',
      description:
        'Tree-based prefix matching across independent multi-turn sessions yields up to 70% latency elimination by reusing intermediate attention states.',
      code: 'radix_tree_match(prompt_hash)',
    },
  },
  bottlenecks: [
    {
      type: 'amber',
      title: 'CRITICAL BOTTLENECK: NVLink Bandwidth Saturation on All-Reduce',
      description:
        'When scaling tensor parallelism across multi-node InfiniBand instead of intra-node NVLink, TP synchronization degrades by 8.4x. Tensor-parallel degree must remain TP ≤ 8 strictly within single-node DGX boundaries.',
      reference: 'Ref: 42:15',
    },
    {
      type: 'error',
      title: 'NUMA Node Socket Thrashing with Host-to-Device Memory Swapping',
      description:
        'Enabling CPU memory offloading drops end-to-end token generation from 480 tok/s down to 32 tok/s caused by PCIe Gen5 bus saturation. Recommend strict memory pinning via numactl --interleave=all.',
      reference: 'Ref: 59:02',
    },
  ],
  deploymentProfile: {
    tpDegree: 'TP_DEGREE=8 (Intra-Node)',
    blockSize: 'BLOCK_SIZE=16 (FlashInfer)',
    gpuMemUtil: 'GPU_MEM_UTIL=0.92',
    prefixCache: 'PREFIX_CACHE=RADIX_ENABLED',
  },
  rawMarkdown: `# distributed-kv-cache-optimization.md

> Synced: 00:00:00 - 01:14:28 | Tokens: 14.8k In / 2.3k Out | AST Verified

## [01] EXECUTIVE SUMMARY
1. **Distributed key-value cache sharding** across tensor-parallel ranks reduces per-GPU high-bandwidth memory footprint from \`O(N·L)\` to \`O(N·L/P)\`, enabling 128k context lengths without memory thrashing.
2. **PagedAttention eliminates internal memory fragmentation** by allocating non-contiguous virtual blocks mapped via hardware page tables, achieving 96.4% GPU memory utilization compared to traditional contiguous allocations.
3. **Speculative decoding combined with chunked prefill** minimizes time-to-first-token (TTFT) by overlapping compute-bound prompt evaluation with bandwidth-bound token generation loops.

---

## [02] TIMESTAMPED BREAKDOWN & AST FORMULATIONS

### [00:12 - 04:30] Memory Footprint of Autoregressive Attention & KV-Cache Sizing
During autoregressive decoding, every token generated requires storing key and value projections for all previous tokens in high-bandwidth memory (HBM). Without sharding, cache growth linearly throttles batch size and drives memory bandwidth bottlenecks.

$$
\\text{Memory}_{\\text{KV}} = 2 \\times n_{\\text{layers}} \\times n_{\\text{heads}} \\times d_{\\text{head}} \\times s_{\\text{seq}} \\times b_{\\text{batch}} \\times \\text{bytes\\_per\\_element}
$$

\`\`\`python
# Compute FP16 memory requirements across 128k context
python calc_kv_cache.py \\
  --layers 32 \\
  --heads 32 \\
  --dim 128 \\
  --ctx 131072 \\
  --precision fp16
\`\`\`

> **Memory Note:** At 128k tokens in FP16, KV cache alone consumes **32.8 GB** per sequence batch before activation checkpointing or attention masking is allocated.

### [14:45 - 22:18] PagedAttention Kernel Implementation & Virtual Memory Mapping
PagedAttention maps discontinuous physical memory chunks to logically contiguous address ranges using an operating system style page table. Block tables dynamically record key-value block pointers, mitigating fragmentation waste down to below 4%.

\`\`\`bash
vllm serve meta-llama/Llama-3-70b-Instruct \\
  --tensor-parallel-size 4 \\
  --gpu-memory-utilization 0.95 \\
  --max-model-len 65536
\`\`\`

---

## [03] TECHNICAL DEEP DIVE & INVARIANTS (Hopper / H100 Target)
- **Chunked Prefill Latency Masking**: Micro-batches of prefill tokens are interleaved directly alongside single-token decode sequences. (\`max_num_batched_tokens = 2048\`)
- **Asynchronous FP8 Matrix Mult**: Leverages Hopper Tensor Memory Accelerator (TMA) to transfer tensor tiles directly between global HBM and shared memory. (\`cuda::memcpy_async(tma_desc)\`)
- **Radix Prefix Caching**: Tree-based prefix matching yields up to 70% latency elimination. (\`radix_tree_match(prompt_hash)\`)

---

## [04] IMPLEMENTATION BOTTLENECKS & CONSTRAINTS
- **CRITICAL BOTTLENECK**: NVLink Bandwidth Saturation on All-Reduce. [Ref: 42:15]
- **NUMA Node Socket Thrashing**: PCIe Gen5 bus saturation under host offload. Use \`numactl --interleave=all\`. [Ref: 59:02]

### Recommended Deployment Profile
- TP_DEGREE=8 (Intra-Node)
- BLOCK_SIZE=16 (FlashInfer)
- GPU_MEM_UTIL=0.92
- PREFIX_CACHE=RADIX_ENABLED`,
  rawWhisperBaseline: `[00:00:01] Um, hello everyone, welcome to the Stanford ML systems seminar.
[00:00:15] Can everyone hear me in the back? Okay, great.
[00:00:22] Today we're gonna talk about distributed sharding and how we optimize KV cache for FlashAttention-2.
[00:00:45] Uh, so when you do autoregressive decoding, token by token...
[00:01:10] ...you basically store key and value tensors for every layer and head.
[00:02:00] If we do the math, 2 times layers times heads times dim times sequence length times batch size times 2 bytes.
[00:02:30] That blows up crazy fast. For 128k context, it's roughly 32 gigabytes per request!
[00:14:50] So how do we fix the fragmentation? PagedAttention! Like virtual memory in OS.
[00:16:10] vLLM serves this by mapping non-contiguous blocks.
[00:42:00] Watch out for NVLink boundaries though. If you cross nodes with All-Reduce, latency spikes like 8x.`,
};

export const SAMPLE_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Distributed Sharding & FlashAttention-2',
    presenter: 'Dr. Alexei Romanov (Stanford / Meta AI)',
    url: 'https://www.youtube.com/watch?v=bO7Fms_CEgo',
    duration: '01:14:28',
    runNumber: '#4092',
    image: DEFAULT_EXTRACTION_DOC.previewImage,
  },
  {
    id: 'vid-2',
    title: 'Triton GPU Kernel Programming: Fused Cross-Entropy',
    presenter: 'Sarah Lin, Staff Kernel Engineer (OpenAI)',
    url: 'https://www.youtube.com/watch?v=kY67Z3qG1po',
    duration: '00:54:19',
    runNumber: '#4088',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'vid-3',
    title: 'Llama 3 405B Architecture & MegaScale Cluster Run',
    presenter: 'Meta Infrastructure Team',
    url: 'https://www.youtube.com/watch?v=8m9gLd762xQ',
    duration: '01:42:10',
    runNumber: '#4079',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
];

export const PROMPT_TEMPLATES = [
  {
    id: 'tmpl-1',
    version: 'v3.2',
    title: 'Principal ML Systems Engineer',
    category: 'GPU & Systems Architecture',
    description:
      'Optimized for GPU architecture lectures, CUDA kernel optimization, memory hierarchies, and distributed training talks.',
    promptText:
      'SYSTEM: You are a Principal ML Systems Engineer. Ingest video keyframes + synced Whisper transcription. Output structured Markdown adhering strictly to schema: Executive Summary (3 sentences), Timestamped Breakdown with raw CLI commands, Technical Deep Dive (architecture & memory invariants), and Implementation Bottlenecks/Trade-offs.',
    variables: ['keyframes_fps=0.5', 'ocr_engine=tesseract_cuda', 'vad_threshold=-32dB'],
    tokensEstimated: '~14,800 tokens / run',
    activeCount: 142,
  },
  {
    id: 'tmpl-2',
    version: 'v2.1',
    title: 'HPC & Distributed Scale Benchmark Parser',
    category: 'High Performance Computing',
    description:
      'Extracts InfiniBand RDMA benchmarks, NCCL collectives, collective communications, and memory thrashing traces.',
    promptText:
      'SYSTEM: You are an HPC Performance Analyst. Parse network diagrams and slide charts for AllGather, ReduceScatter, and NVLink inter-connect latencies. Format all tables into GitHub-flavored Markdown with gigabyte-per-second precision metrics.',
    variables: ['network_analyzer=true', 'nccl_debug=info'],
    tokensEstimated: '~11,200 tokens / run',
    activeCount: 68,
  },
  {
    id: 'tmpl-3',
    version: 'v1.9',
    title: 'Theoretical CS & Math Proof Extractor',
    category: 'Mathematics & Algorithms',
    description:
      'Translates chalkboard handwritten derivations, asymptotic complexities, lemmas, and proofs directly into LaTeX math blocks.',
    promptText:
      'SYSTEM: You are a Theoretical Computer Scientist. Transcribe mathematical blackboard lectures into pristine LaTeX. Identify definitions, theorems, lemmas, and asymptotic complexity bounds with step-by-step proofs.',
    variables: ['latex_strict=true', 'proof_checker=enabled'],
    tokensEstimated: '~18,400 tokens / run',
    activeCount: 89,
  },
  {
    id: 'tmpl-4',
    version: 'v2.8',
    title: 'Database Internals & Storage Engines',
    category: 'Storage & Distributed Databases',
    description:
      'Captures LSM trees, write-ahead logs, raft consensus states, and B-tree concurrency invariants from technical talks.',
    promptText:
      'SYSTEM: You are a Senior Database Storage Engineer. Extract transaction isolation levels, write amplification tradeoffs, and lock-free concurrency structures.',
    variables: ['schema_version=2.8', 'disk_io_eval=true'],
    tokensEstimated: '~9,800 tokens / run',
    activeCount: 45,
  },
];

export const BATCH_JOBS = [
  {
    id: 'JOB-4093',
    title: 'Stanford CS336: Language Modeling from Scratch',
    source: 'YouTube (direct_sync)',
    duration: '01:28:40',
    status: 'Running',
    progress: 74,
    worker: 'Node #1 (H100-SXM5)',
    eta: '01m 18s',
    tokensProcessed: '19,420',
  },
  {
    id: 'JOB-4092',
    title: 'Distributed Sharding & FlashAttention-2',
    source: 'YouTube (direct_sync)',
    duration: '01:14:28',
    status: 'Completed',
    progress: 100,
    worker: 'Node #2 (H100-SXM5)',
    eta: 'Done',
    tokensProcessed: '14,820',
  },
  {
    id: 'JOB-4091',
    title: 'Triton GPU Kernel Programming: Fused Cross-Entropy',
    source: 'S3 URI: s3://ml-talks/triton-fused.mp4',
    duration: '00:54:19',
    status: 'Completed',
    progress: 100,
    worker: 'Node #3 (H100-SXM5)',
    eta: 'Done',
    tokensProcessed: '11,350',
  },
  {
    id: 'JOB-4090',
    title: 'CUDA Tensor Core Programming on Blackwell B200',
    source: 'YouTube (direct_sync)',
    duration: '02:04:15',
    status: 'Queued',
    progress: 0,
    worker: 'Pending slot',
    eta: '~08m 00s',
    tokensProcessed: '0',
  },
  {
    id: 'JOB-4089',
    title: 'Llama 3 405B Architecture & MegaScale Cluster Run',
    source: 'YouTube (direct_sync)',
    duration: '01:42:10',
    status: 'Completed',
    progress: 100,
    worker: 'Node #4 (H100-SXM5)',
    eta: 'Done',
    tokensProcessed: '22,900',
  },
  {
    id: 'JOB-4088',
    title: 'FlashDecoding++ & Speculative Verification',
    source: 'Direct Upload (mp4)',
    duration: '00:46:12',
    status: 'Completed',
    progress: 100,
    worker: 'Node #1 (H100-SXM5)',
    eta: 'Done',
    tokensProcessed: '9,810',
  },
];

export const HISTORY_RECORDS = [
  {
    id: 'run-4092',
    title: 'Distributed Sharding & FlashAttention-2',
    speaker: 'Dr. Alexei Romanov',
    date: '2026-10-09 21:14',
    duration: '01:14:28',
    tokens: '14.8k tokens',
    speed: '4.2x realtime',
    status: 'Verified AST',
    cacheHit: true,
    fileSize: '6.4 KB',
  },
  {
    id: 'run-4091',
    title: 'Triton GPU Kernel Programming: Fused Cross-Entropy',
    speaker: 'Sarah Lin',
    date: '2026-10-09 18:32',
    duration: '00:54:19',
    tokens: '11.4k tokens',
    speed: '4.8x realtime',
    status: 'Verified AST',
    cacheHit: true,
    fileSize: '5.8 KB',
  },
  {
    id: 'run-4089',
    title: 'Llama 3 405B Architecture & MegaScale Cluster Run',
    speaker: 'Meta Systems',
    date: '2026-10-08 14:05',
    duration: '01:42:10',
    tokens: '22.9k tokens',
    speed: '3.9x realtime',
    status: 'Verified AST',
    cacheHit: false,
    fileSize: '9.2 KB',
  },
  {
    id: 'run-4085',
    title: 'vLLM Internals: Continuous Batching & Chunked Prefill',
    speaker: 'Woosuk Kwon',
    date: '2026-10-07 11:20',
    duration: '01:05:40',
    tokens: '13.1k tokens',
    speed: '4.5x realtime',
    status: 'Verified AST',
    cacheHit: true,
    fileSize: '6.1 KB',
  },
  {
    id: 'run-4078',
    title: 'DeepSpeed ZeRO-3 Memory Partitioning Analysis',
    speaker: 'Samyam Rajbhandari',
    date: '2026-10-06 09:44',
    duration: '00:58:33',
    tokens: '12.0k tokens',
    speed: '4.1x realtime',
    status: 'Verified AST',
    cacheHit: true,
    fileSize: '5.2 KB',
  },
];
