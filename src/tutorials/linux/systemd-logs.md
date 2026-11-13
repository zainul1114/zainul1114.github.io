---
title: "Services and Logs with systemd"
description: "Use systemctl and journalctl to diagnose a Linux service."
date: 2026-10-24
category: "Linux"
categoryUrl: "/tutorials/linux/"
layout: layouts/tutorial.njk
permalink: /tutorials/linux/systemd-logs/
tags: ["linux"]
---

## Check service state

```bash
systemctl status sshd
systemctl is-enabled sshd
systemctl list-units --type=service --state=failed
```

`status` gives a quick summary, `is-enabled` checks startup configuration, and the failed-unit list surfaces service failures.

## Read logs around the failure

```bash
sudo journalctl -u sshd -b --no-pager -n 100
sudo journalctl -u sshd --since "today"
sudo journalctl -p warning..alert --since "1 hour ago"
```

## Safe operating pattern

1. Read the unit status and logs.
2. Validate configuration before reload/restart where the service supports it.
3. Apply the smallest necessary change.
4. Recheck status and test from a client.

For a custom service, inspect its unit file with `systemctl cat service-name`. Avoid posting logs publicly until secrets, tokens, and internal hostnames have been reviewed.
