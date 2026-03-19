---
title: AppShell
teleport:
  file: src/tui/components/AppShell.tsx
  line: 13
---

# AppShell

## How it works

The `AppShell` component at line 13 is the outermost TUI wrapper. It renders a rounded-border `Box` that fills the entire terminal, listens for resize events via `useStdout`, and re-renders with updated dimensions.

## Key details

It accepts an optional `header` slot rendered inside the border but before the padded content area. The border color comes from `theme.shell`. All YAOS-git TUI apps are wrapped in AppShell (usually indirectly through TUILayout).

## What to do

Press `o` to teleport to the AppShell component.
