import React, { useState } from "react";
import { RepoFile, VimMode } from "../types";
import { Sparkles, Check, X, FileCode, Wand2, Copy } from "lucide-react";

interface EditorPaneProps {
  files: RepoFile[];
  activeFile: string;
  onSelectFile: (path: string) => void;
  onUpdateFileContent: (path: string, newContent: string) => void;
  mode: VimMode;
  setMode: (m: VimMode) => void;
  highlightLine?: number | null;
  onTriggerRefactor: (filePath: string, instruction: string, selection?: string) => Promise<void>;
  isProcessing: boolean;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  files,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  mode,
  setMode,
  highlightLine,
  onTriggerRefactor,
  isProcessing,
}) => {
  const currentFile = files.find((f) => f.path === activeFile) || files[0];
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [refactorPrompt, setRefactorPrompt] = useState("");
  const [showRefactorModal, setShowRefactorModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = currentFile ? currentFile.content.split("\n") : [];

  const handleLineClick = (lineNum: number) => {
    if (mode === "VISUAL") {
      if (!selectedRange) {
        setSelectedRange({ start: lineNum, end: lineNum });
      } else {
        const start = Math.min(selectedRange.start, lineNum);
        const end = Math.max(selectedRange.start, lineNum);
        setSelectedRange({ start, end });
      }
    } else {
      setSelectedRange({ start: lineNum, end: lineNum });
    }
  };

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyRefactor = async () => {
    if (!currentFile) return;
    const selection = selectedRange
      ? `Lines ${selectedRange.start} to ${selectedRange.end}`
      : "Entire file";
    await onTriggerRefactor(currentFile.path, refactorPrompt || "Optimize code & add checks", selection);
    setShowRefactorModal(false);
  };

  return (
    <div
      id="editor-pane"
      className="flex flex-col h-full bg-[#0a0c10] font-mono text-neutral-200 overflow-hidden"
    >
      {/* File Buffer Tabs (Neovim Bufferline) */}
      <div className="bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-2 overflow-x-auto text-xs">
        <div className="flex items-center space-x-1 py-1">
          {files.map((file) => {
            const isActive = file.path === activeFile;
            return (
              <button
                key={file.path}
                id={`file-tab-${file.name.replace(".", "-")}`}
                onClick={() => onSelectFile(file.path)}
                className={`px-2.5 py-1 rounded text-xs flex items-center space-x-1.5 transition whitespace-nowrap ${
                  isActive
                    ? "bg-neutral-800 text-emerald-400 font-semibold border-t-2 border-emerald-500"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action buttons: Mode switch & Inline Refactor */}
        <div className="flex items-center space-x-2 py-1">
          <button
            id="editor-copy-btn"
            onClick={handleCopyCode}
            className="text-neutral-400 hover:text-neutral-200 text-xs px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 flex items-center gap-1"
            title="Copy file content"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            id="editor-refactor-trigger"
            onClick={() => {
              if (!selectedRange) {
                // Default select lines 48-72 in jwt_service if on that file
                if (currentFile.path.includes("jwt_service")) {
                  setSelectedRange({ start: 48, end: 72 });
                } else {
                  setSelectedRange({ start: 1, end: Math.min(15, lines.length) });
                }
              }
              setShowRefactorModal(true);
            }}
            className="bg-amber-600/90 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-2.5 py-1 rounded transition flex items-center gap-1.5"
            title="Trigger Inline AI Refactoring on selection"
          >
            <Sparkles className="w-3 h-3" />
            <span>Inline Refactor</span>
          </button>
        </div>
      </div>

      {/* Floating / Inline Refactor Panel (TUI Overlay) */}
      {showRefactorModal && (
        <div className="bg-neutral-900 border-b border-amber-500/80 p-3 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-amber-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>TermAI Inline Refactoring Engine</span>
            </span>
            <button
              onClick={() => setShowRefactorModal(false)}
              className="text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-neutral-400 text-[11px]">
            Target: <span className="text-emerald-400 font-semibold">{currentFile.name}</span>{" "}
            {selectedRange && (
              <span>
                (Lines {selectedRange.start}–{selectedRange.end})
              </span>
            )}
          </p>

          <div className="flex items-center space-x-2">
            <input
              id="refactor-instruction-input"
              type="text"
              value={refactorPrompt}
              onChange={(e) => setRefactorPrompt(e.target.value)}
              placeholder='e.g., "Tambahkan pengecekan token blacklist di Redis" atau "Zero-alloc error handling"'
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-amber-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyRefactor();
              }}
            />
            <button
              id="apply-refactor-btn"
              onClick={handleApplyRefactor}
              disabled={isProcessing}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3 py-1.5 rounded text-xs transition flex items-center gap-1 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Generate Diff</span>
            </button>
          </div>
        </div>
      )}

      {/* Code Buffer Content with Line Numbers */}
      <div className="flex-1 overflow-y-auto overflow-x-auto text-xs font-mono p-2">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLine === lineNum;
              const isSelected =
                selectedRange &&
                lineNum >= selectedRange.start &&
                lineNum <= selectedRange.end;

              return (
                <tr
                  key={idx}
                  onClick={() => handleLineClick(lineNum)}
                  className={`cursor-pointer transition-colors group ${
                    isHighlighted
                      ? "bg-cyan-950/70 border-l-2 border-cyan-400"
                      : isSelected
                      ? "bg-amber-950/40 border-l-2 border-amber-400"
                      : "hover:bg-neutral-800/40"
                  }`}
                >
                  {/* Line Number */}
                  <td className="w-12 text-right pr-4 text-neutral-600 select-none font-mono text-[11px] group-hover:text-neutral-400">
                    {lineNum}
                  </td>

                  {/* Line Code */}
                  <td className="text-neutral-200 whitespace-pre py-0.5 leading-relaxed font-mono">
                    {/* Basic syntax coloring simulation */}
                    <span
                      className={
                        line.trim().startsWith("//") || line.trim().startsWith("#")
                          ? "text-neutral-500 italic"
                          : line.includes("func ") ||
                            line.includes("package ") ||
                            line.includes("pub fn ") ||
                            line.includes("struct ") ||
                            line.includes("type ")
                          ? "text-purple-400 font-semibold"
                          : line.includes("return ") ||
                            line.includes("if ") ||
                            line.includes("for ")
                          ? "text-amber-300"
                          : line.includes('"')
                          ? "text-emerald-300"
                          : "text-neutral-200"
                      }
                    >
                      {line}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
