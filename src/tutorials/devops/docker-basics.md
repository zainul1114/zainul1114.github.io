---
title: "Container Image and Runtime Basics"
description: "Build and run a small container while understanding the image lifecycle."
date: 2026-10-21
category: "Devops"
categoryUrl: "/tutorials/devops/"
layout: layouts/tutorial.njk
permalink: /tutorials/devops/docker-basics/
tags: ["devops"]
---

## Build and run

Assuming Docker Engine is installed and your account is permitted to use it:

```bash
docker build -t demo-web:0.1 .
docker image ls
docker run --rm --name demo-web -p 8080:80 demo-web:0.1
```

The Dockerfile and application are project-specific; these commands illustrate the workflow rather than a complete image definition.

## Inspect a running container

```bash
docker ps
docker logs demo-web
docker inspect demo-web
```

## Operational checklist

- Use a small trusted base image and update it regularly.
- Avoid embedding secrets in image layers.
- Define health checks where appropriate.
- Use explicit image tags instead of relying only on `latest`.
- Scan images and test the container as a non-root user where possible.

Containers package processes and their dependencies; they do not replace host patching, access controls, monitoring, or backups.
