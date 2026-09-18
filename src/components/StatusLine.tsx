import React from "react";
import { VimMode } from "../types";
import { GitBranch, CheckCircle2, Cpu } from "lucide-react";

interface StatusLineProps {
  mode: VimMode;
  activeFile: string;
  cursorLine: number;
  cursorCol: number;
  totalLines: number;
  astNodesCount: number;
  ramUsageMb: number;
  isProcessing: boolean;
}

export const StatusLine: React.FC<StatusLineProps> = ({
  mode,
  activeFile,
  cursorLine,
  cursorCol,
  totalLines,
  astNodesCount,
  ramUsageMb,
  isProcessing,
}) => {
  const modeColor = {
    NORMAL: "bg-emerald-600 text-neutral-950 font-bold",
    INSERT: "bg-blue-600 text-neutral-50 font-bold",
    VISUAL: "bg-amber-500 text-neutral-950 font-bold",
  }[mode];

  return (
    <footer
      id="neovim-statusline"
      className="bg-neutral-900 border-t border-neutral-800 text-xs font-mono text-neutral-300 flex items-center justify-between px-2 py-1 select-none"
    >
      {/* Left section: Mode, Branch, File */}
      <div className="flex items-center space-x-2">
        <span
          id="vim-mode-badge"
          className={`px-2 py-0.5 text-[11px] uppercase tracking-wider rounded-xs transition-colors ${modeColor}`}
        >
          {mode}
        </span>

        <div className="flex items-center space-x-1 text-neutral-400 text-[11px]">
          <GitBranch className="w-3.5 h-3.5 text-neutral-400" />
          <span>main</span>
        </div>

        <span className="text-neutral-600">|</span>

        <span className="text-neutral-200 font-semibold text-[11px] truncate max-w-[200px] sm:max-w-none">
          {activeFile}
        </span>

        <span className="text-emerald-400 text-[10px] hidden sm:inline">[+] [utf-8]</span>
      </div>

      {/* Right section: AST status, line position, RAM */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-[11px]">
        {isProcessing && (
          <span className="text-amber-400 animate-pulse flex items-center gap-1 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>AST Querying...</span>
          </span>
        )}

        <div className="hidden md:flex items-center space-x-1 text-neutral-400">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>Tree-sitter:</span>
          <span className="text-cyan-300 font-medium">{astNodesCount} nodes</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        </div>

        <span className="text-neutral-600 hidden sm:inline">|</span>

        <div className="text-neutral-400">
          <span>
            {cursorLine}:{cursorCol}
          </span>
          <span className="text-neutral-600 ml-1">
            ({Math.round((cursorLine / Math.max(1, totalLines)) * 100)}%)
          </span>
        </div>

        <span className="text-neutral-600">|</span>

        <span className="text-emerald-400 font-semibold">
          {ramUsageMb.toFixed(1)}MB
        </span>
      </div>
    </footer>
  );
};
