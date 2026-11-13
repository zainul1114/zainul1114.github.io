---
title: "Essential Linux Commands"
description: "A practical starter reference for inspecting files, processes, disk space, and services."
date: 2026-10-26
category: "Linux"
categoryUrl: "/tutorials/linux/"
layout: layouts/tutorial.njk
permalink: /tutorials/linux/commands/
tags: ["linux"]
---

## 1. Inspect the system

```bash
hostnamectl
uname -r
uptime
whoami
```

Use these commands first when you connect to an unfamiliar server. They help establish the host, kernel, uptime, and current account.

## 2. Files and disk usage

| Goal | Command | Notes |
|---|---|---|
| List files | `ls -lah` | Include hidden files and readable sizes |
| Find current path | `pwd` | Print working directory |
| Check filesystems | `df -hT` | Capacity and filesystem type |
| Find large directories | `du -sh /var/log/*` | Run with suitable permissions |

## 3. Processes and services

```bash
ps aux --sort=-%mem | head
systemctl status sshd
journalctl -u sshd --since "30 minutes ago"
```

## 4. A safe troubleshooting sequence

1. Confirm the symptom and timestamp.
2. Check service status and recent logs.
3. Check disk, memory, and process pressure.
4. Make one change at a time and verify the result.

> Lab note: commands such as `systemctl restart` change service state. Check impact before running them on shared systems.
