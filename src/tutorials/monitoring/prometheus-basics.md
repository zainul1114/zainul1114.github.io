---
title: "Prometheus Metrics and Queries"
description: "Understand scrape targets, time series, labels, and basic PromQL."
date: 2026-10-11
category: "Monitoring"
categoryUrl: "/tutorials/monitoring/"
layout: layouts/tutorial.njk
permalink: /tutorials/monitoring/prometheus-basics/
tags: ["monitoring"]
---

## How Prometheus works

Prometheus scrapes metrics endpoints at configured intervals and stores samples as time series. A series is identified by a metric name and its label set.

## Example PromQL

```promql
up
```

Shows whether configured targets are currently reachable. Other useful examples:

```promql
rate(http_requests_total[5m])
```

```promql
sum by (status) (rate(http_requests_total[5m]))
```

These examples require an application that exposes the relevant metric. Counter rates are usually more useful than raw counter values for traffic trends.

## Troubleshooting targets

- Open the Prometheus Targets page and inspect target health.
- Confirm DNS, routing, port, and endpoint path.
- Check service discovery and scrape configuration.
- Inspect application logs and metrics endpoint output.
- Avoid high-cardinality labels such as user IDs or raw request paths.

Metric names in this article are illustrative; they may not exist in your environment.
