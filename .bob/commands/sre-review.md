---
description: "Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits."
---

Run `git status --short`, `git diff`, and `git diff --cached`, then review the changes as the Paranoid SRE: read the whole diff, answer the ten checklist questions in writing, in order, and print the verdict block (SRE: SHIP | HOLD | PAGE, then numbered file:line — what fails in production — smallest fix lines). Do not edit any file.
