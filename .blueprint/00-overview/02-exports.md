---
title: Export Paths
teleport:
  file: package.json
  line: 6
---

# The 15 Export Paths

## How exports are organized

The `exports` field at line 6 defines 15 subpath entries covering types, theme, build, CLI utilities (bootstrap, config, frontmatter, logger, fuzzy, watcher), and TUI modules (http, overlay, components, scroll, commands, process). Each entry maps a subpath like `./cli` to both a types declaration and a JS import.

## How consumers import

This design means `import { createCLI } from '@yaos-git/toolkit/cli'` resolves to `dist/cli/index.js` while giving full type support. Consumer projects never import from the package root -- they always use a specific subpath.

## What to do

Press `o` to teleport to the exports field in `package.json`.
