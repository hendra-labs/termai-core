import React, { useState } from "react";
import { AstNode, VectorChunk } from "../types";
import { FILE_AST_MAP } from "../data/sampleRepo";
import { Cpu, ChevronRight, ChevronDown, Hash, Search, Database, CheckCircle } from "lucide-react";

interface AstInspectorPaneProps {
  activeFile: string;
  onJumpToLine: (line: number) => void;
  vectorChunks?: VectorChunk[];
}

export const AstInspectorPane: React.FC<AstInspectorPaneProps> = ({
  activeFile,
  onJumpToLine,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "func-2": true,
    "rs-impl": true,
  });

  const astNodes: AstNode[] = FILE_AST_MAP[activeFile] || [
    {
      id: "gen-1",
      type: "source_file",
      name: `AST for ${activeFile}`,
      startLine: 1,
      endLine: 20,
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sample vector RAG embeddings in LanceDB
  const sampleLanceChunks = [
    {
      symbol: "ValidateToken(tokenStr string) (*Claims, error)",
      file: "src/auth/jwt_service.go",
      lines: "48-72",
      score: 0.968,
      astType: "function_declaration",
      tokens: 142,
    },
    {
      symbol: "JWTAuthMiddleware() echo.MiddlewareFunc",
      file: "src/middleware/auth.go",
      lines: "12-42",
      score: 0.892,
      astType: "function_declaration",
      tokens: 118,
    },
    {
      symbol: "GenerateToken(userID, email, roles)",
      file: "src/auth/jwt_service.go",
      lines: "26-45",
      score: 0.841,
      astType: "function_declaration",
      tokens: 96,
    },
    {
      symbol: "RegisterRoutes(e *echo.Echo)",
      file: "src/api/router.go",
      lines: "9-23",
      score: 0.774,
      astType: "function_declaration",
      tokens: 88,
    },
  ];

  return (
    <div
      id="ast-inspector-pane"
      className="flex flex-col h-full bg-[#0a0c10] font-mono text-neutral-200 overflow-y-auto p-3 space-y-4"
    >
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-xs text-neutral-100">
              Tree-sitter AST Parser Engine
            </span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
            Repo-Wide Index: Active
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
          Membangun <span className="text-cyan-300">Abstract Syntax Tree (AST)</span> dari kode sumber
          tanpa membaca teks mentah secara sembarangan. Memahami relasi fungsi, struktur data, dan
          konteks presisi untuk LLM.
        </p>
      </div>

      {/* AST Hierarchy for Active File */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded p-3 space-y-2">
        <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-1.5">
          <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>Syntax Nodes in {activeFile}</span>
          </span>
          <span className="text-[10px] text-neutral-500">
            {astNodes.length} top-level symbols
          </span>
        </div>

        <div className="space-y-1.5">
          {astNodes.map((node) => {
            const hasChildren = Boolean(node.children && node.children.length > 0);
            const isExpanded = expandedNodes[node.id];

            return (
              <div key={node.id} className="border border-neutral-800/80 rounded bg-neutral-950/60 p-2">
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => {
                    if (hasChildren) toggleExpand(node.id);
                    onJumpToLine(node.startLine);
                  }}
                >
                  <div className="flex items-center space-x-1.5 overflow-hidden">
                    {hasChildren ? (
                      isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      )
                    ) : (
                      <span className="w-3.5 h-3.5 inline-block text-cyan-500 text-center font-bold">
                        •
                      </span>
                    )}

                    <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 bg-cyan-950/60 rounded">
                      {node.type}
                    </span>

                    <span className="text-xs text-neutral-200 group-hover:text-emerald-400 transition font-medium truncate">
                      {node.name}
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 font-mono whitespace-nowrap ml-2">
                    L{node.startLine}-{node.endLine}
                  </span>
                </div>

                {node.detail && (
                  <div className="text-[10px] text-neutral-400 mt-1 pl-5">
                    {node.detail}
                  </div>
                )}

                {/* Sub-children */}
                {hasChildren && isExpanded && (
                  <div className="mt-2 pl-4 border-l border-neutral-800 space-y-1">
                    {node.children!.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => onJumpToLine(child.startLine)}
                        className="flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 p-1 rounded"
                      >
                        <span className="text-[11px] text-neutral-300 hover:text-emerald-300">
                          {child.name}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          L{child.startLine}-{child.endLine}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LanceDB Local Vector RAG Context Viewer */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded p-3 space-y-2">
        <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-1.5">
          <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>LanceDB Vector Index (Local RAG)</span>
          </span>
          <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded">
            Cosine Sim
          </span>
        </div>

        <p className="text-[10px] text-neutral-400">
          Setiap simbol AST di-embed secara lokal ke LanceDB/DuckDB tanpa mengirim seluruh codebase ke LLM:
        </p>

        <div className="space-y-1.5">
          {sampleLanceChunks.map((chunk, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 border border-neutral-800/80 rounded p-2 text-xs flex flex-col space-y-1 hover:border-purple-500/50 transition cursor-pointer"
              onClick={() => onJumpToLine(parseInt(chunk.lines.split("-")[0]))}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-200 truncate">
                  {chunk.symbol}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  {(chunk.score * 100).toFixed(1)}% match
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>{chunk.file}:{chunk.lines}</span>
                <span className="text-neutral-500">{chunk.tokens} tokens</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
