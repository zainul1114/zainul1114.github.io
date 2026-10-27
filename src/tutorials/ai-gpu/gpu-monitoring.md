---
title: "Monitor GPU Workloads"
description: "Identify the basic host and workload metrics needed for GPU operations."
date: 2026-10-12
category: "AI & GPU Infrastructure"
categoryUrl: "/tutorials/ai-gpu/"
layout: layouts/tutorial.njk
permalink: /tutorials/ai-gpu/gpu-monitoring/
tags: ["aiGpu"]
---

## Start with device visibility

```bash
nvidia-smi
nvidia-smi --query-gpu=name,utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw --format=csv
```

Available query fields can differ by GPU and driver version. Check `nvidia-smi --help-query-gpu` on the target host.

## Useful metrics

| Metric | What it helps answer |
|---|---|
| GPU utilization | Is the device actively processing work? |
| Memory used / total | Is capacity constraining model size or concurrency? |
| Temperature and power | Is the device operating within expected limits? |
| Request latency | How long do users wait for responses? |
| Queue depth / errors | Is demand exceeding serving capacity or failing? |

## Kubernetes note

In Kubernetes, the NVIDIA device plugin advertises GPU resources to the scheduler, typically as `nvidia.com/gpu`. GPU Operator can help manage components such as the device plugin and DCGM exporter, depending on platform configuration.

## Alerting practice

Set thresholds from measured baselines and workload requirements. Alert on sustained problems and user-visible impact rather than every short utilization spike. Include model, namespace, pod, node, and GPU labels where supported, while controlling metric cardinality.
