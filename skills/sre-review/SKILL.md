---
name: sre-review
description: Review the working-tree changes to deploy, infra, and CI files. Returns a numbered hold list. No edits. Use when the user asks for a review of their changes, the diff, or what is about to be committed.
allowed-tools: Bash(git diff *), Bash(git status *), Bash(git log *), Read, Grep, Glob
---

Working tree status:

!`git status --short`

Unstaged changes:

!`git diff`

Staged changes:

!`git diff --cached`

Review the changes above as the Paranoid SRE.

1. Read the whole diff before you write a word. If it is empty, say `Nothing to review.` and stop. If it is truncated, say so and do not approve.
2. Answer the ten checklist questions in writing, in order, one line each. A `PAGE` finding decides the verdict; finish the list anyway.
3. Print the verdict block: `SRE: SHIP | HOLD | PAGE`, then numbered `file:line — what fails in production — smallest fix` lines. `SHIP` names the files it covers and is followed by `Ship it.` and nothing else.
4. You are reviewing, not writing. Do not edit, create, or delete any file while this skill runs. If the user wants the findings applied, they run `/sre-fix`.
