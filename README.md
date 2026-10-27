# Azilehub Academy — deployable starter

A complete Markdown-first technical tutorial website built with Eleventy 3, Nunjucks, and GitHub Pages. Includes reusable layouts and sample content across Linux, DevOps, Kubernetes, MLOps, AI/GPU infrastructure, and Monitoring.

## Requirements

- Rocky Linux 9 (or another Linux/macOS/Windows environment)
- Node.js 20 or newer and npm
- Git

## 1. Run locally on Rocky Linux 9

Install tools:

```bash
sudo dnf install -y git curl tar gzip unzip
# Install Node.js 22 LTS from NodeSource (recommended for a new install)
curl -fsSL https://rpm.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo dnf install -y nodejs
node --version
npm --version
git --version
```

Extract the ZIP and enter the project directory:

```bash
unzip azilehub-academy-deployment.zip
cd azilehub-academy
npm install
npm run build
npm run start
```

Eleventy listens on port 8080 and binds to `0.0.0.0` so other machines on your lab network can reach it. Open `http://ROCKY_SERVER_IP:8080`. If firewalld is enabled and the host should be reachable from your LAN, allow the port only on the appropriate trusted zone:

```bash
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --zone=trusted --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

Choose the correct zone for your environment; do not expose a development server directly to the public internet. For a local-only preview, use an SSH tunnel instead:

```bash
ssh -L 8080:127.0.0.1:8080 your_user@ROCKY_SERVER_IP
```

Then open `http://localhost:8080` on your workstation.

## 2. Build static files

```bash
npm run build
```

The production site is generated into `_site/`. Do not edit `_site`; edit the files in `src/`.

## 3. Add a tutorial

Create a Markdown file under the appropriate folder, for example `src/tutorials/kubernetes/my-guide.md`:

```yaml
---
title: "My Kubernetes Guide"
description: "A short summary of this guide."
date: 2026-10-27
category: "Kubernetes"
categoryUrl: "/tutorials/kubernetes/"
layout: layouts/tutorial.njk
permalink: /tutorials/kubernetes/my-guide/
tags: ["kubernetes"]
---

## What you will learn

Write the guide in Markdown. Add code fences for commands and YAML.
```

The `tags` value must match the topic collection: `linux`, `devops`, `kubernetes`, `mlops`, `aiGpu`, or `monitoring`. Use the corresponding `categoryUrl` and a unique permalink.

## 4. Publish to GitHub Pages

1. Create or use the repository `azilehub/azilehub.github.io`.
2. Back up the existing repository/site before replacing any files.
3. Copy the project files into the repository working tree. Keep any existing content you still need.
4. Install dependencies and optionally commit the generated lockfile for reproducible installs:

   ```bash
   npm install
   git status
   git add package.json package-lock.json .eleventy.js .github src README.md .gitignore
   git commit -m "Add Azilehub Academy Eleventy site"
   git push origin main
   ```

5. In GitHub, open **Settings → Pages → Build and deployment** and select **GitHub Actions**.
6. Open the **Actions** tab and confirm the build and deploy workflow succeeds.
7. Visit `https://azilehub.github.io/`.

If your repository already has commits, use its existing Git history and remote. Do not run `git push --force` to resolve a rejected push.

## Directory layout

```text
azilehub-academy/
├── .github/workflows/deploy.yml
├── .eleventy.js
├── package.json
├── package-lock.json
├── src/
│   ├── _data/                 # site metadata and navigation
│   ├── _includes/             # shared Nunjucks layouts/components
│   ├── assets/css/main.css    # shared responsive styling
│   ├── index.njk              # home page
│   ├── about.njk
│   └── tutorials/             # topic pages and Markdown guides
└── _site/                     # generated output; do not edit
```

## Notes

- This starter contains dummy educational content and sample commands. Validate commands in a lab before using them on production systems.
- Google Fonts are loaded from an external service; the site still uses fallback fonts if unavailable.
- Contact form submission, search, comments, and authentication are not implemented in this static starter.
