---
title: "Serving an LLM with vLLM: Concepts"
description: "Learn the basic components behind an OpenAI-compatible LLM inference endpoint."
date: 2026-10-13
category: "AI & GPU Infrastructure"
categoryUrl: "/tutorials/ai-gpu/"
layout: layouts/tutorial.njk
permalink: /tutorials/ai-gpu/vllm-serving/
tags: ["aiGpu"]
---

## Request path

```text
Client → API endpoint → tokenizer / scheduler → model execution → generated tokens → client
```

An inference server loads model weights into available memory, schedules incoming requests, runs model computation, and streams or returns generated tokens. Performance depends on model size, precision, context length, batching, and hardware.

## Example launch shape

A typical vLLM container launch specifies a model path, API port, and resource visibility. Exact flags vary by vLLM release and model format; use the documentation for the pinned version before running a command.

```bash
# Illustrative only: MODEL_PATH must exist in the container
vllm serve "$MODEL_PATH" --host 0.0.0.0 --port 8000
```

## Validate an endpoint

```bash
curl http://localhost:8000/v1/models
```

A chat request generally uses the `/v1/chat/completions` endpoint with a JSON body naming a model and messages. Keep credentials and private model paths out of public examples.

## Performance dimensions

- Time to first token (TTFT)
- Inter-token latency and output tokens per second
- Request throughput and concurrency
- GPU utilization and memory use
- Error rate and queue depth

Always benchmark with representative prompts and concurrency, not just one short request.
