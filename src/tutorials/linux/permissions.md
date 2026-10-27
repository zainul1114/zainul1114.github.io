---
title: "Linux Users and File Permissions"
description: "Understand ownership, permission bits, groups, and safe access troubleshooting."
date: 2026-10-25
category: "Linux"
categoryUrl: "/tutorials/linux/"
layout: layouts/tutorial.njk
permalink: /tutorials/linux/permissions/
tags: ["linux"]
---

## Read permission bits

```bash
ls -l app.sh
stat app.sh
```

A mode such as `-rwxr-x---` describes permissions for the owner, group, and everyone else. Directories also need execute permission to be traversed.

## Change ownership and mode

```bash
sudo chown appuser:appgroup app.sh
chmod 750 app.sh
```

`750` gives the owner read/write/execute, the group read/execute, and others no permissions. Prefer narrow permissions over broad `777` access.

## Troubleshooting checklist

- Check the current identity with `id`.
- Check every parent directory using `namei -l /path/to/file`.
- Confirm ACLs with `getfacl /path/to/file` when ACL tools are installed.
- Confirm SELinux labels with `ls -Z` on Rocky Linux.

## Practice

Create a temporary file in your home directory, set mode `640`, then use `ls -l` to verify it. Do not change permissions on system directories as a learning exercise.
