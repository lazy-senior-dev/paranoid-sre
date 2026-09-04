# Changelog

All notable changes to paranoid-sre. The format follows Keep a Changelog; versions follow semver.

## [0.1.0] - 2026-09-04

First release. Licensed under Apache-2.0.

### Added

- `rules/paranoid-sre.md`: the character, the ten-question checklist, the fixed verdict block (`SRE: SHIP | HOLD | PAGE`), the non-negotiables, and the three modes.
- Claude Code plugin with a `UserPromptSubmit` hook that injects the reviewer and a `PreToolUse` gate that reads the agent's own verdict.
- Slash commands: `/sre`, `/sre-review`, `/sre-pr`, `/sre-fix`, `/sre-scorecard`, `/sre-help`.
- Generated adapters for Codex, GitHub Copilot CLI, IBM Bob, Gemini CLI, Antigravity, OpenCode, Cursor, Windsurf, Cline, Kiro, OpenClaw, Devin, Qoder, and a plain `AGENTS.md`.
- `sre` CLI: `review`, `pr`, `install <host>`, `uninstall <host>`.
- GitHub Action that posts one review with inline findings.
- Benchmark corpus, resumable runner, tested scorer, and report generator.
