---
title: "GPU Infrastructure: From Driver to Workload"
description: "Understand the major software layers required to run GPU workloads."
date: 2026-10-14
category: "AI & GPU Infrastructure"
categoryUrl: "/tutorials/ai-gpu/"
layout: layouts/tutorial.njk
permalink: /tutorials/ai-gpu/gpu-stack/
tags: ["aiGpu"]
---

## The main layers

1. **GPU hardware:** compute units and device memory execute parallel workloads.
2. **Host driver:** communicates with the device and exposes management interfaces.
3. **CUDA runtime and libraries:** provide APIs and optimized operations used by compatible software.
4. **Container integration:** exposes selected devices and libraries to containers.
5. **Workload framework:** PyTorch or another framework schedules operations on the GPU.
6. **Serving layer:** an inference server such as vLLM exposes model inference over an API.
7. **Monitoring:** collects utilization, memory, power, temperature, and application metrics.

## Host checks

On a system with NVIDIA drivers installed:

```bash
nvidia-smi
nvidia-smi -L
```

If these commands fail, check the driver installation, kernel module state, and whether the machine has supported NVIDIA hardware. A container cannot fix a broken host driver by itself.

## Container checks

With NVIDIA Container Toolkit configured, test a compatible CUDA container using your site's approved image. Confirm the GPU is visible inside the container before installing a large model.

## Production notes

Keep driver, CUDA, framework, and serving-server compatibility in view. Validate supported versions and test upgrades in a non-production environment.
