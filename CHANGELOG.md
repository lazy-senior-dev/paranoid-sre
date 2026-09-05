# Changelog

All notable changes to paranoid-sre. The format follows Keep a Changelog; versions follow semver.

## [0.1.0] - 2026-09-05

First release. Licensed under Apache-2.0.

### Added

- Model Context Protocol server (`mcp/server.mjs`, `sre mcp`), with a tool that needs no API key because the calling client's own model does the review, and a verdict parser with a declared output schema.
- House rules: a repository commits `.grumpy/policy.md` and every entry point reads it.
- A blocking gate on Cursor, and a skill for GitHub Copilot code review.
- Author tier in the benchmark: the agent writes the change itself, with and without the Paranoid SRE, and with the gate refusing the write until the findings are fixed.
- Supply chain: a signed container image with a bill of materials and provenance, and registry and npm publishing from CI through OIDC.

- `rules/paranoid-sre.md`: the character, the ten-question checklist, the fixed verdict block (`SRE: SHIP | HOLD | PAGE`), the non-negotiables, and the three modes.
- Claude Code plugin with a `UserPromptSubmit` hook that injects the reviewer and a `PreToolUse` gate that reads the agent's own verdict.
- Slash commands: `/sre`, `/sre-review`, `/sre-pr`, `/sre-fix`, `/sre-scorecard`, `/sre-help`.
- Generated adapters for Codex, GitHub Copilot CLI, IBM Bob, Gemini CLI, Antigravity, OpenCode, Cursor, Windsurf, Cline, Kiro, OpenClaw, Devin, Qoder, and a plain `AGENTS.md`.
- `sre` CLI: `review`, `pr`, `install <host>`, `uninstall <host>`.
- GitHub Action that posts one review with inline findings.
- Benchmark corpus, resumable runner, tested scorer, and report generator.
