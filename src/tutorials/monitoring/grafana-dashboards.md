---
title: "Build a Useful Grafana Dashboard"
description: "Organize panels around operational questions instead of displaying every available metric."
date: 2026-10-10
category: "Monitoring"
categoryUrl: "/tutorials/monitoring/"
layout: layouts/tutorial.njk
permalink: /tutorials/monitoring/grafana-dashboards/
tags: ["monitoring"]
---

## Start with questions

A service dashboard should answer: Is it available? Is it fast? Is it failing? Is demand rising? Is the infrastructure under pressure?

## Suggested panels

- Request rate and error rate
- p50, p95, and p99 latency
- CPU and memory utilization
- Pod restarts and readiness
- Queue depth or active requests
- Dependency health

## Dashboard practices

1. Use clear titles, units, and descriptions.
2. Provide useful default time ranges and refresh intervals.
3. Keep related panels together and order them from symptoms to causes.
4. Use variables for cluster, namespace, service, or model when appropriate.
5. Link panels to runbooks or logs for the next troubleshooting step.

## Example query pattern

```promql
sum(rate(http_requests_total[5m]))
```

Adapt the metric and labels to your service. A dashboard should be tested against real traffic and reviewed whenever metric definitions change.
