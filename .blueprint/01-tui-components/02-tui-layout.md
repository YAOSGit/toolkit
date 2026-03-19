---
title: TUILayout
teleport:
  file: src/tui/components/TUILayout.tsx
  line: 36
---

# TUILayout

## How it works

The `TUILayout` component at line 36 orchestrates the full TUI chrome: AppShell border, header slot, main content area, status bar, command footer, and overlay system. It is generic over `TDeps extends BaseDeps` so each project provides its own dependency type.

## Key details

Overlays are resolved by name -- `help` renders the built-in `HelpMenu`, while custom overlays are passed via the `overlays` prop as a record of render functions. The `CommandFooter` displays keybinding hints and project branding. The status bar is hidden during confirmation prompts.

## What to do

Press `o` to teleport to the TUILayout component.
