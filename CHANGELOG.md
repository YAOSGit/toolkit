# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.0.26-3-19a] - 2026-03-19

### Added

- `AppShell` header prop — renders inside border but above padded content for full-width headers
- `HelpMenu` `brandColor` prop — each project's help menu automatically uses its brand color
- `TUILayout` auto-passes `theme.brand` to HelpMenu
- Platform utilities: `modKey()`, `modKeyBindings()`, `MOD_KEY`, `IS_MAC` — dual-binding support for macOS Option key (composed character + Esc+ mode)
- Exported `AppShellProps` and `HelpMenuProps` types from barrel

### Changed

- `displayKey.ts` uses shared `MOD_KEY` from platform module instead of inline constant
