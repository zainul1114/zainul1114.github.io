---
title: "Experiment Tracking with MLflow"
description: "Track parameters, metrics, and artifacts to make ML experiments easier to compare."
date: 2026-10-17
category: "MLOps"
categoryUrl: "/tutorials/mlops/"
layout: layouts/tutorial.njk
permalink: /tutorials/mlops/mlflow-tracking/
tags: ["mlops"]
---

## Why track experiments?

Training code changes frequently. Tracking records the parameters and metrics associated with a run so you can compare experiments and understand how a model was produced.

## Minimal Python example

Install MLflow in a virtual environment, then save as `train_demo.py`:

```python
import mlflow

with mlflow.start_run():
    mlflow.log_param("model_type", "baseline")
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_metric("validation_accuracy", 0.91)
    mlflow.log_text("Demo artifact for a tutorial", "notes.txt")
```

Run the script with `python train_demo.py`, then start the UI with `mlflow ui` and open the local URL it prints (commonly port 5000).

## Production considerations

- Use a shared tracking server and a durable artifact store for team workflows.
- Restrict access to the tracking UI and storage.
- Record dataset versions, code revisions, and evaluation details.
- Treat model artifacts as versioned build outputs and validate them before deployment.

The values above are dummy demonstration metrics, not a claim about a trained model.
