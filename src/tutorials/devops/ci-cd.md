---
title: "CI/CD Pipeline Basics"
description: "Understand how a pipeline validates and publishes a website."
date: 2026-10-22
category: "Devops"
categoryUrl: "/tutorials/devops/"
layout: layouts/tutorial.njk
permalink: /tutorials/devops/ci-cd/
tags: ["devops"]
---

## Typical pipeline stages

1. **Checkout:** fetch the version-controlled source.
2. **Install:** install dependencies using the lockfile.
3. **Validate:** run linting and automated tests.
4. **Build:** generate the static website.
5. **Publish:** deploy the build artifact to the hosting platform.

## Example commands

```bash
npm ci
npm run build
```

`npm ci` uses `package-lock.json` for a repeatable clean install. The build should fail if templates or dependencies are broken.

## Pipeline design tips

- Pin runtime versions deliberately and update them regularly.
- Cache package downloads, not generated output that could become stale.
- Keep deployment permissions minimal.
- Separate build and deployment jobs when that improves auditability.
- Verify the deployed URL after the workflow succeeds.

The included GitHub Actions workflow builds the Eleventy site and publishes `_site` through GitHub Pages. The workflow runs on pushes to `main` and can also be started manually.
