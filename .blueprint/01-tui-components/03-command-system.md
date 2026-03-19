---
title: Command System
teleport:
  file: src/tui/commands/provider.tsx
  line: 16
---

# Command System

## How it works

The `createCommandsProvider` factory at line 16 is the heart of keyboard handling. It takes project-specific commands, merges them with shared commands (help, quit, scroll, cycle-focus), deduplicates by ID (project commands win), and returns a `CommandsProvider` component plus a `useCommands` hook.

## Key details

Inside the provider, `useInput` matches every keypress against the command list using `isKeyMatch`. Commands can require confirmation -- if so, a confirmation prompt is shown and the command only executes on `y`/`Enter`. Overlays suppress command matching so overlay-specific keys (like `q` to close help) don't conflict.

## What to do

Press `o` to teleport to `createCommandsProvider`.
