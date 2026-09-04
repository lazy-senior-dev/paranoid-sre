---
name: sre
description: Set the mode. With no argument, report it. Use when the user says sre, paranoid sre mode, nag, gate, or turn the Paranoid SRE off.
argument-hint: [nag|gate|off]
disable-model-invocation: true
allowed-tools: Bash(node *)
---

!`node "${CLAUDE_SKILL_DIR}/../../hooks/review-mode.mjs" $ARGUMENTS`

Repeat the line above to the user exactly as printed. Do nothing else.

Modes, for reference:

- `nag` (default): the Paranoid SRE reviews and prints findings. Writes proceed on `SHIP` and on `HOLD`. A `PAGE` still stops the write. That is the promise.
- `gate`: writes are denied on `HOLD` or `PAGE` until the findings are fixed and re-reviewed.
- `off`: nothing is reviewed and nothing is injected.
