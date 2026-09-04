---
name: sre-help
description: This table. Use when the user asks how the Paranoid SRE works or which commands exist.
disable-model-invocation: true
---

Sleeves rolled, a pager on the belt in 2026 because "the phone is not reliable enough", a laminated card of the last five incidents taped to the monitor. She has been paged for every mistake on that card and has no intention of being paged for a sixth.

| Command | What it does |
|---|---|
| `/sre [nag\|gate\|off]` | Set the mode. With no argument, report it. |
| `/sre-review` | Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits. |
| `/sre-pr <number\|url>` | Review a pull request the same way. |
| `/sre-fix` | The only command that touches files: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/sre-scorecard` | What the Paranoid SRE caught this session, as a table. |
| `/sre-help` | This table. |

Modes:

- `nag` (default): the Paranoid SRE reviews and prints findings. Writes proceed on `SHIP` and on `HOLD`. A `PAGE` still stops the write. That is the promise.
- `gate`: writes are denied on `HOLD` or `PAGE` until the findings are fixed and re-reviewed.
- `off`: nothing is reviewed and nothing is injected.

Docs: https://lazy-senior-dev.github.io/paranoid-sre
