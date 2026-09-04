---
description: "This table."
---

Print this table and nothing else:

| Command | What it does |
|---|---|
| `/sre [nag|gate|off]` | Set the mode. With no argument, report it. |
| `/sre-review` | Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits. |
| `/sre-pr <number|url>` | Review a pull request the same way. |
| `/sre-fix` | The only command that touches files: apply the findings from the last review, each as a separate minimal edit, then review again. |
| `/sre-scorecard` | What the Paranoid SRE caught this session, as a table. |
| `/sre-help` | This table. |
