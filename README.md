
<div align="center">

# ⚡ TermAI-Core

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-Active%20Development-blue.svg)]()

**A lightning-fast, terminal-first AI coding assistant & TUI companion built for Neovim, tmux, and CLI power users.**  
*Zero bloat, minimal RAM footprint, and instant repo-wide understanding.*

</div>

---

## 🚀 Overview

**TermAI-Core** is a high-performance, terminal-native AI development tool designed for developers who live inside the terminal. Instead of heavy, resource-intensive IDE extensions that consume gigabytes of RAM, `termai-core` provides a lightweight Terminal User Interface (TUI) powered by advanced Abstract Syntax Tree (AST) parsing and local RAG (Retrieval-Augmented Generation).

---

## ✨ Key Features

* **⚡ Ultra-Low RAM Footprint:** Built with compiled performance in mind, consuming a fraction of the memory used by electron-based tools.
* **🌳 AST-Powered Repo Understanding:** Integrates **Tree-sitter** for lightning-fast syntax analysis, enabling the AI to accurately comprehend your codebase structure, functions, and references.
* **🔍 Local-First RAG:** Secure your proprietary code with local vector embeddings combined with support for offline models via Ollama.
* **⌨️ Keyboard-Centric Workflow:** Designed seamlessly for terminal enthusiasts, integrating smoothly with Neovim, Tmux, and custom shell environments.
* **🛠️ Zero-Config Setup:** Initialize and run instantly inside any project repository with a single command.

---

## 🛠️ Tech Stack

* **Core Engine:** Rust / Go (for maximum concurrency and execution speed)
* **AST Parser:** Tree-sitter
* **TUI Interface:** Ratatui (Rust) / Bubbletea (Go)
* **AI & Context:** Local Vector Search & Multi-provider LLM support

---

## 📦 Installation

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/termai-core.git](https://github.com/YOUR_USERNAME/termai-core.git)

# Navigate to the project directory
cd termai-core

# Build and install (Rust example)
cargo install --path .

```

---

## 🚀 Quick Start

1. Initialize TermAI inside your project root:
```bash
termai init

```


2. Query your workspace directly from your command line:
```bash
termai "Where is the core authentication middleware implemented?"

```



---

## 🗺️ Roadmap

* [ ] **v0.1:** Core CLI setup & Tree-sitter integration for AST parsing.
* [ ] **v0.2:** TUI interface implementation (Ratatui/Bubbletea).
* [ ] **v0.3:** Local vector embedding & RAG search for repo-wide context.
* [ ] **v0.4:** Inline code refactoring and multi-provider LLM support.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/YOUR_USERNAME/termai-core/issues&utm_source=gemini).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```

```
