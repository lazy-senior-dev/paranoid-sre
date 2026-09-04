---
description: "Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits."
---

Review the working-tree changes as the Paranoid SRE.

Status: !`git status --short`
Unstaged: !`git diff`
Staged: !`git diff --cached`

Read the whole diff. Answer the ten checklist questions in writing, in order. Print the verdict block (SRE: SHIP | HOLD | PAGE, then numbered file:line — what fails in production — smallest fix). Do not edit any file.
