---
title: "A Practical Git Workflow"
description: "Create a branch, commit a focused change, and push it for review."
date: 2026-10-23
category: "Devops"
categoryUrl: "/tutorials/devops/"
layout: layouts/tutorial.njk
permalink: /tutorials/devops/git-workflow/
tags: ["devops"]
---

## Start from a clean working tree

```bash
git status
git switch -c docs/add-linux-guide
```

Make a small change, inspect it, and stage only the intended files.

```bash
git diff
git add src/tutorials/linux/commands.md
git diff --cached
git commit -m "Add Linux command guide"
git push -u origin docs/add-linux-guide
```

## Useful habits

- Keep commits focused and messages descriptive.
- Never commit credentials, private keys, `.env` files, or generated build output.
- Pull/rebase according to your team's agreed workflow before opening a pull request.
- Use `.gitignore` for local dependencies such as `node_modules/`.

## Quick checks

```bash
git log --oneline -5
git remote -v
git status --short
```

If a push is rejected, inspect the remote history and reconcile it deliberately. Avoid force-pushing shared branches to make an error disappear.
