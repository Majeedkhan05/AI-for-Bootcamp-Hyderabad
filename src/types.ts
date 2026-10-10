export type ActiveTab = 'studio' | 'prompts' | 'batch' | 'api' | 'history';

export type OutputViewMode = 'rendered' | 'raw' | 'diff' | 'ast';

export type GranularityLevel = 'High-Level' | 'Rigorous' | 'Line-AST';

export interface TimestampSection {
  id: string;
  timeRange: string;
  title: string;
  badge: string;
  badgeType: 'verified' | 'cuda' | 'hpc';
  description: string;
  equationName?: string;
  equationLatex?: string;
  equationComplexity?: string;
  codeFilename?: string;
  codeSnippet?: string;
  codeType?: string;
  calloutTitle?: string;
  calloutNote?: string;
  isCollapsed?: boolean;
}

export interface DeepDiveInvariants {
  compute: {
    tag: string;
    title: string;
    description: string;
    code: string;
  };
  hardware: {
    tag: string;
    title: string;
    description: string;
    code: string;
  };
  cache: {
    tag: string;
    title: string;
    description: string;
    code: string;
  };
}

export interface BottleneckAlert {
  type: 'amber' | 'error';
  title: string;
  description: string;
  reference: string;
}

export interface ExtractionDocument {
  id: string;
  filename: string;
  runNumber: string;
  status: string;
  speedMultiplier: string;
  duration: string;
  tokenCount: string;
  tokensIn: string;
  tokensOut: string;
  model: string;
  fileSize: string;
  wordCount: string;
  syncRange: string;
  videoUrl: string;
  videoTitle: string;
  presenter: string;
  resolution: string;
  fps: string;
  previewImage: string;
  vadSpeechRegions: string;
  executiveSummary: string[];
  timestampSections: TimestampSection[];
  deepDiveInvariants: DeepDiveInvariants;
  bottlenecks: BottleneckAlert[];
  deploymentProfile: {
    tpDegree: string;
    blockSize: string;
    gpuMemUtil: string;
    prefixCache: string;
  };
  rawMarkdown: string;
  rawWhisperBaseline: string;
}

export interface ExtractionSettings {
  extractOCR: boolean;
  parseLatex: boolean;
  timestampNotes: boolean;
  filterFiller: boolean;
  granularity: GranularityLevel;
  systemPrompt: string;
}
