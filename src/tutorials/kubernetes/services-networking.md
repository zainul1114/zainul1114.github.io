---
title: "Kubernetes Services and Networking"
description: "Expose a Deployment inside the cluster and test service discovery."
date: 2026-10-18
category: "Kubernetes"
categoryUrl: "/tutorials/kubernetes/"
layout: layouts/tutorial.njk
permalink: /tutorials/kubernetes/services-networking/
tags: ["kubernetes"]
---

## Create a ClusterIP Service

Save as `web-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-demo
spec:
  type: ClusterIP
  selector:
    app: web-demo
  ports:
    - name: http
      port: 80
      targetPort: http
```

```bash
kubectl apply -f web-service.yaml
kubectl get service web-demo
kubectl get endpointslice -l kubernetes.io/service-name=web-demo
```

The selector connects the Service to matching Pod labels. The named target port `http` matches the container port name in the Deployment example.

## Test from your workstation

```bash
kubectl port-forward service/web-demo 8080:80
```

Open `http://localhost:8080` while the port-forward command is running.

## If the Service has no endpoints

- Check the Service selector and Pod labels.
- Check that the Pods are ready.
- Verify the target port and container listener.
- Inspect NetworkPolicy rules if connectivity still fails.

ClusterIP is internal-only. Use Ingress, Gateway API, or an appropriate service type when external access is required.
