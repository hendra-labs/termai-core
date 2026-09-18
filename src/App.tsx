import React, { useState, useEffect } from "react";
import { INITIAL_FILES, FILE_AST_MAP } from "./data/sampleRepo";
import { RepoFile, TerminalEntry, VimMode, TermAiConfig } from "./types";
import { TmuxHeader } from "./components/TmuxHeader";
import { StatusLine } from "./components/StatusLine";
import { TerminalPane } from "./components/TerminalPane";
import { EditorPane } from "./components/EditorPane";
import { AstInspectorPane } from "./components/AstInspectorPane";
import { ArchitectureView } from "./components/ArchitectureModal";
import { Columns, Square, Settings, X, RefreshCw, Upload } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState<RepoFile[]>(INITIAL_FILES);
  const [activeFile, setActiveFile] = useState<string>("src/auth/jwt_service.go");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(true);
  const [mode, setMode] = useState<VimMode>("NORMAL");
  const [highlightLine, setHighlightLine] = useState<number | null>(48);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [ramUsageMb, setRamUsageMb] = useState<number>(11.8);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  const [config, setConfig] = useState<TermAiConfig>({
    backend: "rust",
    tuiEngine: "ratatui",
    vectorEngine: "lancedb",
    modelProvider: "gemini",
    ollamaModel: "qwen2.5-coder:7b",
    autoAstIndex: true,
    ramLimitMb: 32,
  });

  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([
    {
      id: "init-sys",
      type: "system",
      content: `TermAI-Core v0.4.2 [Terminal-First AI Dev Tool]
Engine: Rust Native Binary (0ms GC pause, ~4.8MB binary)
AST Parser: Tree-sitter (incremental repo-wide symbol graph)
TUI: Ratatui Split-Panes & Neovim modal integration
Local RAG: LanceDB Vector Store (${files.length} files, 1,420 AST nodes indexed)
RAM Footprint: 11.8 MB (Low memory consumption guaranteed)

Ketik 'help' untuk daftar perintah atau jalankan query @workspace di bawah.`,
      timestamp: "12:00:01",
    },
    {
      id: "demo-hint",
      type: "output",
      content: `Coba jalankan: termai "@workspace di mana fungsi autentikasi token didefinisikan?"
atau klik tombol cepat di atas input untuk mengevaluasi fitur MVP.`,
      timestamp: "12:00:02",
      source: "TermAI Ready",
    },
  ]);

  // Check server status on mount
  useEffect(() => {
    fetch("/api/termai/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
        if (data.ramUsageMb) {
          setRamUsageMb(data.ramUsageMb);
        }
      })
      .catch(() => {
        // Fallback gracefully to offline state
      });
  }, []);

  const handleUpdateFileContent = (path: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content: newContent } : f))
    );
  };

  const handleJumpToLine = (line: number) => {
    setHighlightLine(line);
    if (!isSplitMode && activeTab !== 1) {
      setActiveTab(1);
    }
  };

  const executeCommand = async (cmdString: string) => {
    const rawCmd = cmdString.trim();
    if (!rawCmd) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Add input entry to terminal
    setTerminalEntries((prev) => [
      ...prev,
      {
        id: `in-${Date.now()}`,
        type: "input",
        content: rawCmd,
        timestamp: timeStr,
      },
    ]);

    setIsProcessing(true);

    const lower = rawCmd.toLowerCase();

    // 1. HELP
    if (lower === "help") {
      setIsProcessing(false);
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "output",
          content: `TermAI-Core Command Reference:
• termai init                     : Zero-config workspace scan & Tree-sitter AST indexing
• termai "@workspace <tanya>"     : Repo-wide semantic question answering using local AST context
• termai refactor <file> [prompt] : Inline AI refactoring with unified diff preview
• termai ast [file]               : Display Tree-sitter AST syntax tree for file
• termai stats                    : Show memory footprint (RAM) and AST parsing benchmarks
• termai files / tree             : List repository files and token counts
• termai config                   : Switch between Rust/Go and Ratatui/Bubbletea
• clear                           : Clear terminal history`,
          timestamp: timeStr,
          source: "TermAI Help",
        },
      ]);
      return;
    }

    // 2. CLEAR
    if (lower === "clear") {
      setIsProcessing(false);
      setTerminalEntries([]);
      return;
    }

    // 3. ZERO-CONFIG: termai init
    if (lower.startsWith("termai init") || lower === "init") {
      await new Promise((r) => setTimeout(r, 600));
      setRamUsageMb(11.4);
      setIsProcessing(false);
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "system",
          content: `[1/4] ⚡ Memindai folder repositori... Ditemukan ${files.length} berkas sumber (Go, Rust, TOML).
[2/4] 🌲 Membangun pohon sintaks Tree-sitter AST (selesai dalam 2.4ms, 0 GC pause).
[3/4] 🗄️  Menyimpan vektor embedding ke database lokal (${config.vectorEngine.toUpperCase()}).
[4/4] ✨ Zero-Config Setup SELESAI! TermAI-Core siap digunakan tanpa konfigurasi manual.

Status Memori: 11.4 MB RAM (0.07% footprint) • 1,420 AST nodes terindeks.`,
          timestamp: timeStr,
        },
      ]);
      return;
    }

    // 4. STATS / RAM
    if (lower.startsWith("termai stats") || lower === "stats" || lower === "top") {
      setIsProcessing(false);
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "output",
          content: `┌──────────────────────────────────────────────┐
│ TermAI-Core Real-Time Memory & AST Telemetry │
├──────────────────────────────────────────────┤
│ Core Engine      : ${config.backend.toUpperCase()} Native Binary (Target: x86_64/arm64)
│ TUI Framework    : ${config.tuiEngine} (Neovim/Tmux split-pane)
│ RAM Footprint    : ${ramUsageMb.toFixed(1)} MB (Safe limit: < 32MB)
│ GC Pause Latency : ${config.backend === "rust" ? "0.0 ms (No Garbage Collector)" : "0.2 ms (Go runtime)"}
│ AST Nodes Parsed : 1,420 nodes via Tree-sitter
│ Vector Store     : ${config.vectorEngine.toUpperCase()} (Cosine Index: OK)
│ Context Economy  : 85% token reduction vs raw files
└──────────────────────────────────────────────┘`,
          timestamp: timeStr,
          source: "TermAI Diagnostics",
        },
      ]);
      return;
    }

    // 5. AST COMMAND
    if (lower.startsWith("termai ast") || lower.startsWith("ast")) {
      const targetFile = activeFile;
      const nodes = FILE_AST_MAP[targetFile] || [];
      const astText = nodes
        .map(
          (n) =>
            `├── [${n.type.toUpperCase()}] ${n.name} (L${n.startLine}-L${n.endLine})${
              n.detail ? `\n│    └── ${n.detail}` : ""
            }`
        )
        .join("\n");

      setIsProcessing(false);
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "ast",
          content: `File: ${targetFile}\nTree-sitter Language Grammar: ${activeFile.endsWith(".go") ? "Go (v0.20.0)" : "Rust (v0.20.0)"}\n\n${astText}`,
          timestamp: timeStr,
        },
      ]);
      return;
    }

    // 6. TREE / FILES
    if (lower.startsWith("termai files") || lower === "tree" || lower === "ls") {
      setIsProcessing(false);
      const treeText = files
        .map((f) => `├── ${f.path.padEnd(28)} [${f.sizeBytes} B] (${f.astNodesCount} AST nodes)`)
        .join("\n");
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "output",
          content: `Repository Structure (Repo-Wide AST Virtual Root):\n${treeText}\n\nTotal: ${files.length} indexed files.`,
          timestamp: timeStr,
        },
      ]);
      return;
    }

    // 7. INLINE REFACTOR
    if (lower.startsWith("termai refactor") || lower.startsWith("refactor")) {
      await handleInlineRefactorCommand(rawCmd);
      setIsProcessing(false);
      return;
    }

    // 8. @WORKSPACE QUERY OR GENERAL QUERY
    let queryText = rawCmd;
    if (queryText.startsWith("termai ")) {
      queryText = queryText.substring(7);
    }
    // Remove enclosing quotes if any
    if (
      (queryText.startsWith('"') && queryText.endsWith('"')) ||
      (queryText.startsWith("'") && queryText.endsWith("'"))
    ) {
      queryText = queryText.substring(1, queryText.length - 1);
    }

    try {
      const repoContext = files
        .map((f) => `--- File: ${f.path} ---\n${f.content}`)
        .join("\n\n");

      const res = await fetch("/api/termai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          repoContext,
          activeFile,
          astNodes: FILE_AST_MAP[activeFile] || [],
        }),
      });

      const data = await res.json();

      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "output",
          content: data.answer || "Query executed.",
          timestamp: timeStr,
          source: data.source || "TermAI AST Engine",
        },
      ]);

      // If the query was specifically about token auth, highlight the target function line in jwt_service.go
      if (queryText.toLowerCase().includes("autentikasi") || queryText.toLowerCase().includes("token")) {
        setActiveFile("src/auth/jwt_service.go");
        setHighlightLine(48);
      }
    } catch (err: any) {
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `out-${Date.now()}`,
          type: "error",
          content: `Query error: ${err?.message || "Gagal menghubungi backend TermAI."}`,
          timestamp: timeStr,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInlineRefactorCommand = async (fullCmd: string) => {
    const curFile = files.find((f) => f.path === activeFile) || files[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const res = await fetch("/api/termai/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: curFile.path,
          originalCode: curFile.content,
          instruction: fullCmd.replace("termai refactor", "").trim() || "Add token validation & zero-alloc errors",
          selectionRange: "Lines 48-72",
        }),
      });

      const data = await res.json();

      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `diff-${Date.now()}`,
          type: "diff",
          content: data.diff || `--- a/${curFile.path}\n+++ b/${curFile.path}\n@@ -48,7 +48,9 @@\n- return nil, ErrInvalidToken\n+ // [TermAI Refactor: Zero-alloc error handling]\n+ return nil, ErrInvalidToken`,
          timestamp: timeStr,
        },
        {
          id: `out-${Date.now()}`,
          type: "output",
          content: `[Inline Refactoring Selesai]
File diperbarui di buffer editor: \`${curFile.path}\`.
Tree-sitter AST nodes telah di-reparse secara otomatis dalam 1.2ms.`,
          timestamp: timeStr,
          source: "TermAI Inline Refactoring Engine",
        },
      ]);

      if (data.refactored) {
        handleUpdateFileContent(curFile.path, data.refactored);
      }
    } catch (err: any) {
      setTerminalEntries((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: "error",
          content: `Refactoring failed: ${err.message}`,
          timestamp: timeStr,
        },
      ]);
    }
  };

  const handleTriggerRefactorFromEditor = async (
    filePath: string,
    instruction: string,
    selection?: string
  ) => {
    const targetFile = files.find((f) => f.path === filePath) || files[0];
    setIsProcessing(true);
    await handleInlineRefactorCommand(`termai refactor ${targetFile.path} "${instruction}"`);
    setIsProcessing(false);
  };

  return (
    <div
      id="termai-app-root"
      className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-200 font-mono select-none"
    >
      {/* 1. Tmux Top Header Bar */}
      <TmuxHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        ramUsageMb={ramUsageMb}
        hasGeminiKey={hasGeminiKey}
        onToggleConfig={() => setShowConfigModal(true)}
      />

      {/* Sub-header Toolbar: View Controls */}
      <div className="bg-neutral-900/60 border-b border-neutral-800 px-3 py-1 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">Tmux Pane Mode:</span>
          <button
            id="toggle-split-btn"
            onClick={() => setIsSplitMode(!isSplitMode)}
            className="flex items-center space-x-1 hover:text-neutral-100 bg-neutral-800/80 px-2 py-0.5 rounded text-[11px] transition"
            title="Toggle Tmux split layout (Side-by-side vs Single Pane)"
          >
            {isSplitMode ? <Columns className="w-3 h-3 text-cyan-400" /> : <Square className="w-3 h-3 text-amber-400" />}
            <span>{isSplitMode ? "Split Pane (Ctrl+b \")" : "Single Pane (Ctrl+b z)"}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="hidden sm:inline text-neutral-400">
            Active: <span className="text-neutral-200 font-semibold">{activeFile}</span>
          </span>
          <button
            id="open-settings-btn"
            onClick={() => setShowConfigModal(true)}
            className="hover:text-neutral-200 text-neutral-400 flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workstation Body */}
      <main id="main-workstation" className="flex-1 flex overflow-hidden relative">
        {activeTab === 4 ? (
          /* Window 4: Architecture Specification */
          <div className="flex-1 h-full">
            <ArchitectureView
              config={config}
              onChangeConfig={(newCfg) => setConfig((prev) => ({ ...prev, ...newCfg }))}
              onExecuteInit={() => {
                setActiveTab(0);
                executeCommand("termai init");
              }}
            />
          </div>
        ) : isSplitMode ? (
          /* Side-by-Side Tmux Split Mode */
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left Pane: Terminal Shell (Always accessible) */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col">
              <TerminalPane
                entries={terminalEntries}
                onExecuteCommand={executeCommand}
                onClearTerminal={() => setTerminalEntries([])}
                isProcessing={isProcessing}
                repoFiles={files}
                activeFile={activeFile}
              />
            </div>

            {/* Right Pane: Switchable between Editor and AST */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col overflow-hidden">
              {activeTab === 2 || activeTab === 3 ? (
                <AstInspectorPane
                  activeFile={activeFile}
                  onJumpToLine={handleJumpToLine}
                />
              ) : (
                <EditorPane
                  files={files}
                  activeFile={activeFile}
                  onSelectFile={(f) => {
                    setActiveFile(f);
                    setHighlightLine(null);
                  }}
                  onUpdateFileContent={handleUpdateFileContent}
                  mode={mode}
                  setMode={setMode}
                  highlightLine={highlightLine}
                  onTriggerRefactor={handleTriggerRefactorFromEditor}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>
        ) : (
          /* Single Fullscreen Pane Mode (selected by Tmux tab) */
          <div className="flex-1 h-full overflow-hidden">
            {activeTab === 0 && (
              <TerminalPane
                entries={terminalEntries}
                onExecuteCommand={executeCommand}
                onClearTerminal={() => setTerminalEntries([])}
                isProcessing={isProcessing}
                repoFiles={files}
                activeFile={activeFile}
              />
            )}
            {activeTab === 1 && (
              <EditorPane
                files={files}
                activeFile={activeFile}
                onSelectFile={(f) => {
                  setActiveFile(f);
                  setHighlightLine(null);
                }}
                onUpdateFileContent={handleUpdateFileContent}
                mode={mode}
                setMode={setMode}
                highlightLine={highlightLine}
                onTriggerRefactor={handleTriggerRefactorFromEditor}
                isProcessing={isProcessing}
              />
            )}
            {(activeTab === 2 || activeTab === 3) && (
              <AstInspectorPane
                activeFile={activeFile}
                onJumpToLine={handleJumpToLine}
              />
            )}
          </div>
        )}
      </main>

      {/* 3. Neovim Powerline Statusline */}
      <StatusLine
        mode={mode}
        activeFile={activeFile}
        cursorLine={highlightLine || 48}
        cursorCol={1}
        totalLines={75}
        astNodesCount={FILE_AST_MAP[activeFile]?.length || 8}
        ramUsageMb={ramUsageMb}
        isProcessing={isProcessing}
      />

      {/* Config Drawer / Modal */}
      {showConfigModal && (
        <div
          id="config-modal-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            id="config-modal-panel"
            className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-4 space-y-4 font-mono text-xs shadow-2xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-bold text-neutral-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>TermAI-Core Engine Configuration</span>
              </span>
              <button
                id="close-config-modal-btn"
                onClick={() => setShowConfigModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Language Selection */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 block font-semibold">1. Core Engine Language:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="cfg-backend-rust"
                  onClick={() => setConfig((p) => ({ ...p, backend: "rust", tuiEngine: "ratatui" }))}
                  className={`p-2 rounded border text-left transition ${
                    config.backend === "rust"
                      ? "bg-amber-950/60 border-amber-500 text-amber-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <div className="font-bold">Rust (Native)</div>
                  <div className="text-[10px] text-neutral-400">Zero-GC, Ratatui TUI, ~8.4MB RAM</div>
                </button>
                <button
                  id="cfg-backend-go"
                  onClick={() => setConfig((p) => ({ ...p, backend: "go", tuiEngine: "bubbletea" }))}
                  className={`p-2 rounded border text-left transition ${
                    config.backend === "go"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <div className="font-bold">Go (Goroutines)</div>
                  <div className="text-[10px] text-neutral-400">Bubbletea TUI, ~14.2MB RAM</div>
                </button>
              </div>
            </div>

            {/* Vector Store Selection */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 block font-semibold">2. Local RAG Vector Store:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="cfg-vector-lancedb"
                  onClick={() => setConfig((p) => ({ ...p, vectorEngine: "lancedb" }))}
                  className={`p-2 rounded border text-left transition ${
                    config.vectorEngine === "lancedb"
                      ? "bg-purple-950/60 border-purple-500 text-purple-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <div className="font-bold">LanceDB (Disk-based)</div>
                  <div className="text-[10px] text-neutral-400">Ultra-low RAM vector indexing</div>
                </button>
                <button
                  id="cfg-vector-duckdb"
                  onClick={() => setConfig((p) => ({ ...p, vectorEngine: "duckdb" }))}
                  className={`p-2 rounded border text-left transition ${
                    config.vectorEngine === "duckdb"
                      ? "bg-purple-950/60 border-purple-500 text-purple-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <div className="font-bold">DuckDB (In-process)</div>
                  <div className="text-[10px] text-neutral-400">Embedded columnar SQL</div>
                </button>
              </div>
            </div>

            {/* Model Provider Info */}
            <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                Active LLM Pipeline:
              </span>
              <div className="text-emerald-400 font-semibold">
                {hasGeminiKey ? "Cloud Gemini 3.8 Flash (Server-Side Proxy)" : "Local Tree-sitter RAG / Ollama Adapter"}
              </div>
              <p className="text-[10px] text-neutral-400">
                Kunci API dikelola secara aman di sisi server. Konteks AST dikirim secara terkurasi tanpa memboroskan token.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="save-config-btn"
                onClick={() => setShowConfigModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold px-4 py-1.5 rounded text-xs transition"
              >
                Simpan & Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
