import React from "react";
import { Cpu, Terminal, Database, Sparkles, CheckCircle2, Zap, Shield, ArrowRight } from "lucide-react";
import { TermAiConfig } from "../types";

interface ArchitectureViewProps {
  config: TermAiConfig;
  onChangeConfig: (newConfig: Partial<TermAiConfig>) => void;
  onExecuteInit: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  config,
  onChangeConfig,
  onExecuteInit,
}) => {
  return (
    <div
      id="architecture-spec-view"
      className="h-full overflow-y-auto bg-[#0a0c10] font-mono text-neutral-200 p-4 sm:p-6 space-y-6 max-w-5xl mx-auto"
    >
      {/* Title & Philosophy Banner */}
      <div className="border border-neutral-800 bg-neutral-900/90 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div>
            <h1 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <span className="text-emerald-400">TermAI-Core</span>
              <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                v0.4.2 Spec
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Alat bantu pengembangan berbasis terminal (Terminal-First) yang sangat ringan dan
              digerakkan oleh AI untuk efisiensi ekosistem keyboard (Neovim / Tmux).
            </p>
          </div>

          <button
            id="arch-run-init-btn"
            onClick={onExecuteInit}
            className="bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test `termai init`</span>
          </button>
        </div>

        {/* Live Active Stack Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
          <div className="bg-neutral-950 border border-neutral-800 p-2 rounded">
            <span className="text-[10px] text-neutral-500 uppercase">Core Language</span>
            <div className="font-bold text-amber-400 capitalize">{config.backend} (Native binary)</div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-2 rounded">
            <span className="text-[10px] text-neutral-500 uppercase">Parser</span>
            <div className="font-bold text-cyan-400">Tree-sitter AST</div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-2 rounded">
            <span className="text-[10px] text-neutral-500 uppercase">TUI Framework</span>
            <div className="font-bold text-emerald-400 capitalize">{config.tuiEngine}</div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-2 rounded">
            <span className="text-[10px] text-neutral-500 uppercase">Local Vector DB</span>
            <div className="font-bold text-purple-400 uppercase">{config.vectorEngine}</div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Core Engine & Performa */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold text-neutral-200">
                1. Core Engine & Performa (Rust / Go)
              </h2>
            </div>
            <div className="flex space-x-1">
              <button
                id="select-rust-btn"
                onClick={() => onChangeConfig({ backend: "rust", tuiEngine: "ratatui" })}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  config.backend === "rust"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400"
                }`}
              >
                Rust (Zero GC)
              </button>
              <button
                id="select-go-btn"
                onClick={() => onChangeConfig({ backend: "go", tuiEngine: "bubbletea" })}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  config.backend === "go"
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400"
                }`}
              >
                Go (Goroutines)
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Menghasilkan <span className="text-neutral-200 font-semibold">binary kecil (&lt;10MB)</span> dan
            konsumsi RAM yang sangat rendah (&lt;15MB) dibandingkan runtime Node.js/Python (150MB+).
          </p>

          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Binary Size:</span>
              <span className="text-emerald-400 font-semibold">~4.8 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Idle Memory Footprint:</span>
              <span className="text-emerald-400 font-semibold">
                {config.backend === "rust" ? "8.4 MB (No GC)" : "14.2 MB (Go Runtime)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Startup Latency:</span>
              <span className="text-emerald-400 font-semibold">3.2 ms</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Analisis Kode & AST Parser */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-neutral-200">
              2. Analisis Kode & AST (Tree-sitter)
            </h2>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Alih-alih membaca teks mentah secara sembarangan, <span className="text-cyan-300">Tree-sitter</span>{" "}
            membangun <span className="text-neutral-200 font-semibold">Abstract Syntax Tree (AST)</span> dari kode
            sumber secara instan.
          </p>

          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Memahami fungsi, variabel, struct, dan relasi file</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Mengurangi token prompt LLM hingga 85%</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Incremental re-parsing saat mengetik di editor</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Antarmuka Pengguna (TUI) */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-neutral-200">
              3. Antarmuka TUI (Ratatui / Bubbletea)
            </h2>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Antarmuka terminal interaktif penuh warna dengan tata letak jendela (*split panes*) elegan,
            navigasi keyboard Neovim (`h, j, k, l`), dan integrasi Tmux.
          </p>

          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Framework:</span>
              <span className="text-cyan-400">
                {config.tuiEngine === "ratatui" ? "Ratatui (Rust TUI)" : "Bubbletea (Go Charm)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Modal Editing:</span>
              <span className="text-neutral-300">NORMAL, INSERT, VISUAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Window Multiplexer:</span>
              <span className="text-neutral-300">Tmux split & buffer integration</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Integrasi AI & RAG Lokal */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold text-neutral-200">
                4. RAG Lokal & AI (LanceDB / DuckDB)
              </h2>
            </div>
            <div className="flex space-x-1">
              <button
                id="select-lancedb-btn"
                onClick={() => onChangeConfig({ vectorEngine: "lancedb" })}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  config.vectorEngine === "lancedb"
                    ? "bg-purple-500/20 border-purple-500 text-purple-300 font-bold"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400"
                }`}
              >
                LanceDB
              </button>
              <button
                id="select-duckdb-btn"
                onClick={() => onChangeConfig({ vectorEngine: "duckdb" })}
                className={`text-[10px] px-2 py-0.5 rounded border transition ${
                  config.vectorEngine === "duckdb"
                    ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400"
                }`}
              >
                DuckDB
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Menyimpan embedding potongan kode secara lokal. Saat pengguna bertanya, hanya potongan kode
            terkait yang dikirim ke LLM (Ollama lokal / Gemini).
          </p>

          <div className="bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Embedding Engine:</span>
              <span className="text-purple-300 font-semibold">Local Fast-BGE / LanceDB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Supported LLMs:</span>
              <span className="text-emerald-400">Gemini 3.8 Flash, Ollama (Llama 3 / Qwen)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Privacy:</span>
              <span className="text-neutral-300">Zero telemetry, local indexation</span>
            </div>
          </div>
        </div>
      </div>

      {/* MVP Feature Status Matrix */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Status Rencana Fitur Utama untuk MVP di GitHub</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-neutral-950 border border-emerald-900/50 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">1. @workspace Query</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                READY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Ketik perintah cepat di CLI untuk bertanya tentang seluruh isi kode proyek:
            </p>
            <code className="text-[10px] text-neutral-300 bg-neutral-900 p-1 rounded block truncate">
              termai &quot;di mana fungsi autentikasi token didefinisikan?&quot;
            </code>
          </div>

          <div className="bg-neutral-950 border border-emerald-900/50 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">2. Inline Refactoring</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                READY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Pilih baris kode di terminal dan minta AI memperbaiki atau mengoptimalkannya secara real-time.
            </p>
            <code className="text-[10px] text-neutral-300 bg-neutral-900 p-1 rounded block truncate">
              termai refactor src/auth/jwt_service.go:48
            </code>
          </div>

          <div className="bg-neutral-950 border border-emerald-900/50 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">3. Zero-Config Setup</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                READY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Satu perintah inisialisasi di dalam folder proyek, langsung siap digunakan tanpa setup manual.
            </p>
            <code className="text-[10px] text-neutral-300 bg-neutral-900 p-1 rounded block truncate">
              termai init
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
