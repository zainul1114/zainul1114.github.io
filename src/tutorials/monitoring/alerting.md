---
title: "Alerting and Incident Triage"
description: "Create actionable alerts with context, ownership, and a clear next step."
date: 2026-10-09
category: "Monitoring"
categoryUrl: "/tutorials/monitoring/"
layout: layouts/tutorial.njk
permalink: /tutorials/monitoring/alerting/
tags: ["monitoring"]
---

## What makes an alert useful?

A good alert signals a condition that needs attention, includes enough context to diagnose it, and points to an owner or runbook. Avoid alerting on every transient spike.

## Example alert rule shape

```yaml
groups:
  - name: demo-service
    rules:
      - alert: DemoServiceUnavailable
        expr: up{job="demo-service"} == 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Demo service target is unavailable"
          description: "Check target health, service discovery, and application logs."
```

This is a teaching example. Replace the job label and severity policy to match your monitoring setup.

## Incident triage

1. Confirm the alert is still firing and identify affected scope.
2. Check recent deployments and dependency health.
3. Compare application metrics with node and platform metrics.
4. Follow the runbook and communicate impact.
5. Record the cause and improve the alert or documentation afterward.

Use alert grouping, inhibition, and routing carefully so a single outage does not create hundreds of redundant notifications.
