---
title: "Reproducible ML Pipelines"
description: "Break a machine-learning workflow into repeatable, observable stages."
date: 2026-10-15
category: "MLOps"
categoryUrl: "/tutorials/mlops/"
layout: layouts/tutorial.njk
permalink: /tutorials/mlops/pipeline-basics/
tags: ["mlops"]
---

## Common pipeline stages

```text
Validate data → Prepare features → Train → Evaluate → Register candidate
```

Each stage should have clear inputs, outputs, and failure conditions. For example, evaluation should stop promotion if a required metric falls below the agreed threshold.

## Design principles

- Version datasets, code, dependencies, and model artifacts.
- Make stages idempotent where practical.
- Store logs and outputs so failed runs can be diagnosed.
- Separate training from approval and production deployment.
- Use explicit resource requests for CPU, memory, and GPU workloads.

## Example acceptance gate

A pipeline might require a validation score above a team-defined threshold and verify that the model artifact can be loaded. The threshold should come from the problem's evaluation plan; it should not be chosen arbitrarily from a tutorial example.

## Operational metrics

Track run duration, success rate, queued time, data validation failures, model quality, and artifact storage growth. These metrics help teams distinguish model-quality problems from platform problems.
