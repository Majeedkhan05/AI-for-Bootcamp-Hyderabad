# ExtractVideo.ai — v2.4 Instrumentation

[![Live Development App](https://img.shields.io/badge/Live%20App-Development-00628c?style=for-the-badge&logo=google-cloud&logoColor=white)](https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app)
[![Shared Production App](https://img.shields.io/badge/Live%20App-Shared%20Preview-845000?style=for-the-badge&logo=google-cloud&logoColor=white)](https://ais-pre-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app)
[![Cluster Status](https://img.shields.io/badge/GPU%20Cluster-4x%20H100%20SXM5%20Online-10b981?style=for-the-badge&logo=nvidia&logoColor=white)](https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app)

> **High-spec developer instrumentation for extracting structured technical Markdown, LaTeX math proofs, and code snippets from ML systems lectures and engineering talks.**

---

## 🌐 Live Deployments

- **Development URL**: [https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app](https://ais-dev-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app)
- **Shared Preview URL**: [https://ais-pre-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app](https://ais-pre-srot7ni4oa36ptbhaapcon-290513239528.us-east5.run.app)

---

## ⚡ Overview

**ExtractVideo.ai** bridges high-bandwidth video presentations (GPU architecture lectures, CUDA kernel workshops, distributed systems seminars) and precision developer knowledge bases. Instead of lossy transcripts, it treats video keyframes and synced Whisper audio as an Abstract Syntax Tree (AST), outputting mathematically verified Markdown with runnable CLI snippets and architectural invariants.

---

## 🛠 Features

### 1. Extraction Studio (Two-Column Workspace)
- **Input Pipeline**: Stream manifest ingestion (YouTube, direct MP4, S3 presigned URIs) with KV-cache status indicator.
- **Synchronized Video Player**: High-definition slide viewer with chapter anchors (`[00:12]`, `[14:45]`, `[38:10]`) and OCR bounding box inspection.
- **Voice Activity Detection (VAD) Waveform**: Inline waveform visualizer showing 43 cut silence regions and speech activity intervals.
- **AST Parser Settings**:
  - OCR terminal logs & code extraction (Hopper PTX, PyTorch, CUDA kernels).
  - Chalkboard LaTeX math derivation parser.
  - Timestamp-linked deep dive notes.
  - Filler speech & QA banter filter.
  - Granularity switcher (High-Level, Rigorous, Line-AST).
- **System Prompt & Schema Drawer**: Collapsible and customizable schema with prompt builder modal.

### 2. Multi-Mode Output Workspace
- **Rendered Markdown**: Formatted technical output with centered LaTeX display formulas, syntax-highlighted code blocks with 1-click copy, Technical Deep Dive Bento Grid (Compute, Hardware TMA, Radix Cache), and Implementation Bottleneck alerts with production deployment profiles.
- **Raw Source (.md)**: Full interactive, editable Markdown buffer.
- **Diff View**: Side-by-side comparison between raw Whisper transcript and synthesized AST notes.
- **JSON AST**: Structured syntax tree adhering to the ExtractVideo AST schema.

### 3. Prompt Templates Library
- 14 domain-specific extraction schemas:
  - Principal ML Systems Engineer (v3.2)
  - HPC & Distributed Scale Benchmark Parser (v2.1)
  - Theoretical CS & Math Proof Extractor (v1.9)
  - Database Internals & Storage Engines (v2.8)
- 1-click "Load into Studio" functionality.

### 4. Batch Pipeline & Cluster Queue
- Orchestration across **4x NVIDIA H100 SXM5 80GB** nodes.
- Live VRAM utilization gauges, temperature, PCIe Gen5 bandwidth, and power telemetry.
- Enqueue multiple video URLs with real-time progress indicators.

### 5. Developer API & Webhooks
- Interactive code playground with **cURL**, **Python SDK**, and **TypeScript SDK** examples.
- Signed webhook callbacks with SHA256 HMAC validation (`X-ExtractVideo-Signature`).
- Instant API key generation and test ping emulator.

### 6. Semantic Cache & History
- 98.2% semantic hit rate telemetry (1.42M tokens and 38.6 GPU hours saved).
- Searchable catalog of past extractions with instant "Open in Studio" restoration.

### 7. Command Palette (⌘K)
- Spotlight search across runs, formulas, CUDA kernels, and navigation screens.

---

## 📐 Technology Stack

- **Framework**: React 19 + TypeScript (SPA on Vite)
- **Styling**: Tailwind CSS v4 with custom `Terminal Slate` design tokens
- **Typography**: Geist (Sans), JetBrains Mono (Code & Timestamps), Poppins (Body)
- **Icons**: Material Symbols Outlined + Lucide Icons
- **Animation**: Motion
- **AI Integration**: Google GenAI SDK (`@google/genai`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/extractvideo-ai.git

# Navigate to project directory
cd extractvideo-ai

# Install dependencies
npm install
```

### Local Development

```bash
# Start Vite development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build optimized static bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Apache-2.0 License.
