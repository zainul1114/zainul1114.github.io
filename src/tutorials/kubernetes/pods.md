---
title: "Kubernetes Pods: The Basics"
description: "Understand Pods, inspect status, read logs, and debug common startup issues."
date: 2026-10-20
category: "Kubernetes"
categoryUrl: "/tutorials/kubernetes/"
layout: layouts/tutorial.njk
permalink: /tutorials/kubernetes/pods/
tags: ["kubernetes"]
---

## What is a Pod?

A Pod is the smallest deployable unit in Kubernetes. It groups one or more containers that share network identity and can share mounted volumes. Most application Pods are created and replaced by a controller such as a Deployment.

## Inspect Pods

```bash
kubectl get pods -A
kubectl get pods -n default -o wide
kubectl describe pod POD_NAME -n NAMESPACE
kubectl logs POD_NAME -n NAMESPACE --all-containers=true
```

Replace `POD_NAME` and `NAMESPACE` with real values from your cluster.

## Common states

| State | What to inspect |
|---|---|
| `Pending` | Scheduling events, requests, node capacity, PVC binding |
| `ImagePullBackOff` | Image name, tag, registry reachability, pull secrets |
| `CrashLoopBackOff` | Previous logs, command, config, probes, dependencies |
| `Running` but not ready | Readiness probe, application port, startup logs |

## A useful debug sequence

```bash
kubectl get events -n NAMESPACE --sort-by=.lastTimestamp
kubectl logs POD_NAME -n NAMESPACE --previous
kubectl get pod POD_NAME -n NAMESPACE -o yaml
```

Use read-only inspection first. Avoid deleting a production Pod before understanding its owner and impact.
