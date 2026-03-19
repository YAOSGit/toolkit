---
title: Bootstrap
teleport:
  file: src/cli/bootstrap.ts
  line: 5
---

# CLI Bootstrap

## Key functions

The `createCLI` function at line 5 is used by every YAOS-git CLI to set up a Commander program with a name, description, and version string. It enables `exitOverride()` so parse errors throw instead of calling `process.exit`, and registers `SIGINT`/`SIGTERM` handlers for graceful shutdown.

## How entry detection works

The `runIfMain` helper at line 34 compares `import.meta.url` with `process.argv[1]` to detect whether the current module is the entry point. If so, it calls the provided function. This enables dual-use modules that can be both imported as a library and run as a CLI.

## What to do

Press `o` to teleport to the bootstrap module.
