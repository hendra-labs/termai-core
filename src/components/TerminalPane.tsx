import React, { useState, useRef, useEffect } from "react";
import { TerminalEntry, RepoFile } from "../types";
import { CornerDownLeft, Sparkles, Terminal as TerminalIcon, Play, Trash2 } from "lucide-react";

interface TerminalPaneProps {
  entries: TerminalEntry[];
  onExecuteCommand: (cmd: string) => Promise<void>;
  onClearTerminal: () => void;
  isProcessing: boolean;
  repoFiles: RepoFile[];
  activeFile: string;
}

export const TerminalPane: React.FC<TerminalPaneProps> = ({
  entries,
  onExecuteCommand,
  onClearTerminal,
  isProcessing,
  activeFile,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([
    'termai "@workspace di mana fungsi autentikasi token didefinisikan?"',
    "termai init",
    "termai ast src/auth/jwt_service.go",
    "termai stats",
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, isProcessing]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cmd = inputVal.trim();
      if (!cmd) return;

      setCmdHistory((prev) => [...prev, cmd]);
      setHistoryIndex(null);
      setInputVal("");
      await onExecuteCommand(cmd);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex =
        historyIndex === null ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(cmdHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(null);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    }
  };

  const quickPrompts = [
    {
      label: '1. @workspace "di mana fungsi autentikasi token didefinisikan?"',
      cmd: 'termai "@workspace di mana fungsi autentikasi token didefinisikan?"',
      desc: "Repo-wide Tree-sitter query",
    },
    {
      label: "2. Zero-Config: termai init",
      cmd: "termai init",
      desc: "Scan repo & build AST index",
    },
    {
      label: "3. Inline Refactor: ValidateToken",
      cmd: "termai refactor src/auth/jwt_service.go:48 'Tambahkan token blacklist check'",
      desc: "Inline AI refactoring",
    },
    {
      label: "4. AST Tree: jwt_service.go",
      cmd: "termai ast src/auth/jwt_service.go",
      desc: "Inspect Tree-sitter syntax tree",
    },
    {
      label: "5. Memory & RAM Stats",
      cmd: "termai stats",
      desc: "RAM footprint < 15MB",
    },
  ];

  return (
    <div
      id="terminal-pane"
      className="flex flex-col h-full bg-[#0c0e12] font-mono text-neutral-200 overflow-hidden border-r border-neutral-800"
    >
      {/* Terminal Title Bar */}
      <div className="bg-neutral-900/90 border-b border-neutral-800/80 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-neutral-400 font-semibold text-[11px] flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>termai-cli ❯ bash / tmux-pane-0</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="clear-terminal-btn"
            onClick={onClearTerminal}
            className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 p-1 rounded transition text-[11px] flex items-center gap-1"
            title="Clear terminal history"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts (MVP Requirements Shortcut) */}
      <div className="bg-neutral-900/40 border-b border-neutral-800/60 p-2 text-xs">
        <div className="flex items-center justify-between mb-1.5 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>QUICK MVP WORKFLOWS (Click to run):</span>
          </span>
          <span className="text-neutral-500">Zero-Config • Repo-Wide • AST-First</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              id={`quick-cmd-${idx}`}
              onClick={() => {
                setInputVal(qp.cmd);
                onExecuteCommand(qp.cmd);
              }}
              disabled={isProcessing}
              className="bg-neutral-800/90 hover:bg-neutral-700/80 active:bg-neutral-600/80 text-neutral-300 hover:text-white px-2 py-1 rounded text-[11px] border border-neutral-700/60 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs leading-relaxed select-text">
        {entries.map((entry) => (
          <div key={entry.id} className="animate-fadeIn">
            {entry.type === "input" && (
              <div className="flex items-start space-x-2 text-neutral-300">
                <span className="text-emerald-400 font-bold select-none">termai ❯</span>
                <span className="font-semibold text-emerald-200">{entry.content}</span>
                <span className="text-[10px] text-neutral-500 ml-auto select-none">
                  {entry.timestamp}
                </span>
              </div>
            )}

            {entry.type === "system" && (
              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded p-2.5 text-neutral-300 space-y-1">
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                  <span>[TermAI System]</span>
                </div>
                <div className="whitespace-pre-wrap font-mono text-[11px]">{entry.content}</div>
              </div>
            )}

            {entry.type === "output" && (
              <div className="bg-neutral-900/40 border-l-2 border-emerald-500 pl-3 py-1 text-neutral-200">
                {entry.source && (
                  <div className="text-[10px] text-neutral-400 mb-1 flex items-center gap-1">
                    <span className="text-purple-400">⚡ Engine:</span>
                    <span>{entry.source}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap font-mono text-xs">{entry.content}</div>
              </div>
            )}

            {entry.type === "ast" && (
              <div className="bg-neutral-950/80 border border-cyan-900/50 rounded p-2.5 text-cyan-200 font-mono text-[11px]">
                <div className="text-cyan-400 font-bold mb-1.5 flex items-center justify-between">
                  <span>Tree-sitter Syntax Tree (AST)</span>
                  <span className="text-[10px] text-neutral-400">0 GC • 0.8ms parse</span>
                </div>
                <pre className="overflow-x-auto text-[11px] text-cyan-300">{entry.content}</pre>
              </div>
            )}

            {entry.type === "diff" && (
              <div className="bg-neutral-950 border border-amber-900/40 rounded p-2 text-xs font-mono">
                <div className="text-amber-400 font-bold text-[11px] mb-1">
                  Unified AST Diff Preview
                </div>
                <pre className="overflow-x-auto text-[11px]">
                  {entry.content.split("\n").map((line, lIdx) => {
                    const isAdd = line.startsWith("+");
                    const isDel = line.startsWith("-");
                    const isHdr = line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++");
                    return (
                      <div
                        key={lIdx}
                        className={
                          isAdd
                            ? "bg-emerald-950/60 text-emerald-300 px-1"
                            : isDel
                            ? "bg-rose-950/60 text-rose-300 px-1"
                            : isHdr
                            ? "text-cyan-400 font-bold"
                            : "text-neutral-400"
                        }
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            )}

            {entry.type === "error" && (
              <div className="bg-red-950/40 border-l-2 border-red-500 pl-3 py-1 text-red-300 text-xs">
                {entry.content}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-emerald-400 animate-pulse text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TermAI AST engine scanning repo & computing local LanceDB vectors...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* CLI Prompt Input Line */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-2.5 flex items-center space-x-2">
        <span className="text-emerald-400 font-bold select-none text-xs">termai ❯</span>
        <input
          ref={inputRef}
          id="terminal-input-field"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder='Ketik "@workspace <pertanyaan>", "termai init", "termai refactor", atau "help"...'
          className="flex-1 bg-transparent text-neutral-100 text-xs outline-none placeholder:text-neutral-500 focus:ring-0 font-mono"
          autoFocus
        />
        <button
          id="terminal-send-btn"
          onClick={() => {
            if (inputVal.trim()) {
              onExecuteCommand(inputVal.trim());
              setCmdHistory((p) => [...p, inputVal.trim()]);
              setInputVal("");
            }
          }}
          disabled={isProcessing || !inputVal.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-neutral-950 font-bold px-2.5 py-1 rounded text-xs transition flex items-center gap-1"
        >
          <span>Run</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
