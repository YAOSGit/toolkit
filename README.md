<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/YAOSGit/.github/main/images/general.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/YAOSGit/.github/main/images/general-light.svg">
    <img src="https://raw.githubusercontent.com/YAOSGit/.github/main/images/general.svg" width="100%" alt="YAOS-git toolkit" />
  </picture>
</p>

<p align="center">
  <strong>Shared infrastructure and terminal UI components for the YAOS-git suite</strong>
</p>

<div align="center">

![Node Version](https://img.shields.io/badge/NODE-20+-16161D?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=%23666F76)
![TypeScript Version](https://img.shields.io/badge/TYPESCRIPT-5.9-16161D?style=for-the-badge&logo=typescript&logoColor=white&labelColor=%23666F76)
![React Version](https://img.shields.io/badge/REACT-19.2-16161D?style=for-the-badge&logo=react&logoColor=white&labelColor=%23666F76)

![Uses Ink](https://img.shields.io/badge/INK-16161D?style=for-the-badge&logo=react&logoColor=white&labelColor=%23666F76)
![Uses Vitest](https://img.shields.io/badge/VITEST-16161D?style=for-the-badge&logo=vitest&logoColor=white&labelColor=%23666F76)
![Uses Biome](https://img.shields.io/badge/BIOME-16161D?style=for-the-badge&logo=biome&logoColor=white&labelColor=%23666F76)

</div>

---

## Overview

**@yaos-git/toolkit** is the shared heart of the YAOS-git tool suite. It provides the foundational components, hooks, and utilities used to build high-performance, keyboard-driven terminal UIs (TUIs) and robust CLI tools.

By centralizing shared logic—from the React/Ink theme to heavy-duty CLI builders—we ensure a consistent look, feel, and performance profile across every tool in the suite.

## Key Modules

| Module | Description |
|--------|-------------|
| **`/theme`** | Shared design system (colors, borders, spacing) for consistent Ink TUI rendering |
| **`/tui`** | Reusable TUI components: `Overlay`, `ScrollArea`, `CommandBar`, and `TerminalLayout` |
| **`/cli`** | Standardized CLI building blocks: `Logger`, `ConfigLoader`, `FuzzySearch`, and `Watcher` |
| **`/types`** | Shared domain types and TypeScript utility helpers |
| **`/build`** | Shared esbuild configuration and custom plugins used across the suite |

## Shared Logic

- **Theme**: A centralized HSL-based color palette and common TUI visual tokens.
- **Commands**: A standardized keyboard command registry with support for overlays and text-input protection.
- **Process**: Utilities for spawning and managing child processes with SIGTERM/SIGKILL escalation.
- **Config**: Type-safe configuration loading with support for TypeScript (`jiti`), JSON, and YAML.

## Usage

This package is intended for internal use within the `@yaos-git` workspace.

```bash
npm install @yaos-git/toolkit
```

## Tech Stack

- **React 19** + **Ink 6**
- **TypeScript 5.9** (Strict Mode, ESM only)
- **Commander** + **Zod**
- **Chalk** + **Yaml**

---

### Author

Ygor de Paula

### License

ISC
