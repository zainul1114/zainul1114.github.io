---
title: "Deployments and Rolling Updates"
description: "Deploy a sample web application and check rollout health."
date: 2026-10-19
category: "Kubernetes"
categoryUrl: "/tutorials/kubernetes/"
layout: layouts/tutorial.njk
permalink: /tutorials/kubernetes/deployments/
tags: ["kubernetes"]
---

## Create a small Deployment

Save as `web-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-demo
  template:
    metadata:
      labels:
        app: web-demo
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - name: http
              containerPort: 80
          resources:
            requests:
              cpu: 100m
              memory: 64Mi
            limits:
              cpu: 500m
              memory: 128Mi
```

Apply and inspect:

```bash
kubectl apply -f web-deployment.yaml
kubectl rollout status deployment/web-demo
kubectl get deployment,replicaset,pods -l app=web-demo
```

## Update and rollback

```bash
kubectl set image deployment/web-demo web=nginx:1.27-alpine
kubectl rollout status deployment/web-demo
kubectl rollout history deployment/web-demo
```

For a real application, use a tested, approved image tag and review the change before applying it. A rollback is not a substitute for understanding why a rollout failed.
