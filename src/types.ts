export interface RepoFile {
  path: string;
  name: string;
  language: "go" | "rust" | "yaml" | "json";
  content: string;
  sizeBytes: number;
  astNodesCount: number;
}

export interface AstNode {
  id: string;
  type: string;
  name: string;
  startLine: number;
  endLine: number;
  detail?: string;
  children?: AstNode[];
}

export interface VectorChunk {
  id: string;
  filePath: string;
  symbol: string;
  lineStart: number;
  lineEnd: number;
  snippet: string;
  score: number;
}

export interface TerminalEntry {
  id: string;
  type: "input" | "output" | "error" | "system" | "ast" | "diff";
  content: string;
  timestamp: string;
  source?: string;
  meta?: Record<string, any>;
}

export type VimMode = "NORMAL" | "INSERT" | "VISUAL";

export type CoreBackend = "rust" | "go";
export type TuiEngine = "ratatui" | "bubbletea";
export type VectorEngine = "lancedb" | "duckdb";
export type ModelProvider = "gemini" | "ollama";

export interface TermAiConfig {
  backend: CoreBackend;
  tuiEngine: TuiEngine;
  vectorEngine: VectorEngine;
  modelProvider: ModelProvider;
  ollamaModel: string;
  autoAstIndex: boolean;
  ramLimitMb: number;
}
