

```markdown
# ⚡ TermAI-Core

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-Active%20Development-blue)]()

**A lightning-fast, terminal-first AI coding assistant & TUI companion built for Neovim, tmux, and CLI power users.**  
*Zero bloat, minimal RAM footprint, and instant repo-wide understanding.*

</div>

---

## 🚀 Overview

**TermAI-Core** is designed for developers who live inside the terminal. Instead of heavy, electron-based IDEs that consume gigabytes of RAM, `termai-core` provides a lightweight, high-performance TUI (Terminal User Interface) powered by advanced AST parsing and local RAG capabilities. 

Whether you want to query your entire codebase using natural language or refactor code inline directly from your terminal, TermAI-Core keeps you in the flow state.

---

## ✨ Key Features

* **⚡ Ultra-Low RAM Footprint:** Written in high-performance compiled code (Rust/Go) without heavy runtimes.
* **🌳 AST-Powered Repo Understanding:** Uses **Tree-sitter** for lightning-fast syntax analysis, ensuring the AI truly understands your functions, classes, and file structures.
* **🔍 Local-First RAG:** Keeps your code secure with local vector search embeddings (LanceDB/DuckDB) combined with support for local models via Ollama (or cloud providers).
* **⌨️ Keyboard-Centric Workflow:** Designed seamlessly for terminal enthusiasts, integrating smoothly with Neovim, Tmux, and custom shell environments.
* **🛠️ Zero-Config Setup:** Initialize and run instantly inside any project repository with a single command.

---

## 🛠️ Tech Stack

* **Core Engine:** Rust / Go (for maximum performance and zero garbage collection overhead)
* **AST Parser:** Tree-sitter
* **TUI Interface:** Ratatui (Rust) / Bubbletea (Go)
* **AI & Context:** Local Vector Database & LLM integration (Ollama / OpenAI / Anthropic)

---

## 📦 Installation

*(Instructions will be updated as the MVP builds out)*

```bash
# Clone the repository
git clone [https://github.com/yourusername/termai-core.git](https://github.com/yourusername/termai-core.git)

# Navigate to the project directory
cd termai-core

# Build and install (Example for Rust/Cargo)
cargo install --path .

```

---

## 🚀 Quick Start

1. Initialize TermAI inside your project root:
```bash
termai init

```


2. Query your workspace right from your terminal:
```bash
termai "Where is the user authentication middleware defined?"

```



---

## 🗺️ Roadmap

* [ ] **v0.1:** Core CLI setup & Tree-sitter integration for AST parsing.
* [ ] **v0.2:** TUI interface implementation (Ratatui/Bubbletea).
* [ ] **v0.3:** Local vector embedding & RAG search for repo-wide context.
* [ ] **v0.4:** Inline code refactoring and multi-provider LLM support (Ollama & Cloud APIs).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/yourusername/termai-core/issues&utm_source=gemini).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```
* Anda bisa langsung menempelkan teks ini ke file `README.md` di GitHub menggunakan fitur *Edit file* atau lewat terminal lokal Anda.

```
