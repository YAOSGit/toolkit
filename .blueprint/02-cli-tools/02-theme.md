---
title: Theme
teleport:
  file: src/theme/tui.ts
  line: 38
---

# TUI Theme

## How it works

The `createTUITheme` function at line 38 builds a `TUITheme` object from a brand hex color. It sets `focus`, `shell`, and semantic colors (success, error, warning, info, muted) to consistent defaults while letting each project customize its brand color.

## How color fallback works

If no ANSI brand name is provided, `nearestAnsi` (line 24) maps the hex color to the closest ANSI color name by Euclidean distance in RGB space. This ensures the brand color degrades gracefully in terminals that only support 8 colors.

## What to do

Press `o` to teleport to the theme builder.
