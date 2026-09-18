import React from "react";
import { Terminal, Cpu, HardDrive, Sparkles, Layers, Activity } from "lucide-react";
import { TermAiConfig } from "../types";

interface TmuxHeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  config: TermAiConfig;
  ramUsageMb: number;
  hasGeminiKey: boolean;
  onToggleConfig: () => void;
}

export const TmuxHeader: React.FC<TmuxHeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  ramUsageMb,
  hasGeminiKey,
  onToggleConfig,
}) => {
  const tabs = [
    { id: 0, label: "1:termai", icon: Terminal, desc: "CLI Shell" },
    { id: 1, label: "2:editor", icon: Layers, desc: "Neovim Buffer" },
    { id: 2, label: "3:ast-tree", icon: Cpu, desc: "Tree-sitter AST" },
    { id: 3, label: "4:lancedb", icon: HardDrive, desc: "Local RAG" },
    { id: 4, label: "5:arch-spec", icon: Activity, desc: "4 Pillars Spec" },
  ];

  return (
    <header
      id="tmux-header"
      className="bg-neutral-900 border-b border-neutral-800 px-3 py-1.5 flex flex-wrap items-center justify-between text-xs select-none font-mono text-neutral-300"
    >
      {/* Left: Session name & Tmux tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <span className="bg-emerald-700 text-neutral-950 font-bold px-2 py-0.5 rounded-xs tracking-wider flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>[TermAI-Core]</span>
        </span>

        <nav aria-label="Tmux Window Tabs" className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tmux-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-0.5 rounded-xs flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? "bg-neutral-800 text-emerald-400 font-semibold border-b-2 border-emerald-500"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
                }`}
                title={tab.desc}
              >
                <span>{tab.label}</span>
                {isActive && <span className="text-emerald-400 text-[10px]">*</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Engine metrics & quick switcher */}
      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
        {/* RAM Footprint Badge */}
        <div
          id="ram-badge"
          className="flex items-center space-x-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800 text-neutral-300"
          title="Memory footprint of TermAI-Core engine"
        >
          <span className="text-[10px] text-neutral-400">RAM:</span>
          <span className="text-emerald-400 font-bold">{ramUsageMb.toFixed(1)} MB</span>
          <span className="text-[10px] text-neutral-500">(0.08%)</span>
        </div>

        {/* Engine Badge */}
        <button
          id="engine-badge-btn"
          onClick={onToggleConfig}
          className="flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700/80 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700 transition"
          title="Click to toggle engine settings (Rust/Go, Ratatui/Bubbletea)"
        >
          <span className="text-amber-400 uppercase font-semibold text-[10px]">
            {config.backend.toUpperCase()}
          </span>
          <span className="text-neutral-500">/</span>
          <span className="text-cyan-400 text-[10px]">{config.tuiEngine}</span>
        </button>

        {/* AI Provider Indicator */}
        <div
          id="ai-provider-badge"
          className="hidden md:flex items-center space-x-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] text-neutral-400">Model:</span>
          <span className="text-purple-300 font-semibold text-[10px]">
            {hasGeminiKey ? "Gemini 3.8 Flash" : "Local Tree-sitter RAG"}
          </span>
        </div>
      </div>
    </header>
  );
};
