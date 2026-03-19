---
title: What Is Toolkit
teleport:
  file: package.json
  line: 1
---

# What Is Toolkit

## What it provides

`@yaos-git/toolkit` is the shared infrastructure package consumed by every project in the YAOS-git suite. It provides CLI bootstrap helpers, TUI components (AppShell, TUILayout, SplitPane), a command system, theme/color utilities, build tooling, and type definitions.

## How consumers use it

The package uses subpath exports so consumers import only what they need (e.g. `@yaos-git/toolkit/cli`, `@yaos-git/toolkit/tui/components`). It has peer dependencies on Ink, React, esbuild, and Vitest -- all optional -- so it stays lightweight for CLI-only consumers.

## What to do

Press `o` to teleport to `package.json` and see the project metadata.
