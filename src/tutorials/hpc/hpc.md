---
layout: layouts/tutorial.njk
title: "What is HPC"
description: "Understand HPC architecture, parallel computing, CPU, GPU, networking, storage and benchmarking."
category: HPC
categoryUrl: /tutorials/hpc/
tags: hpc
date: 2026-11-04
permalink: /tutorials/hpc/hpc/
---

# High-Performance Computing (HPC) – Complete Guide

## 1. What is HPC?

**High-Performance Computing (HPC)** is the use of powerful computing
systems, multiple processors, GPUs, high-speed networks, and parallel
processing techniques to solve complex computational problems at high
speed.

In simple terms, instead of asking one computer to process a very large
problem, HPC distributes the work across multiple interconnected
computers. Each computer processes part of the problem, and the results
are combined.

HPC is designed around three core ideas:

1.  **Performance:** Process large amounts of data and calculations
    quickly.
2.  **Scalability:** Increase capacity by adding CPUs, GPUs, memory, and
    compute nodes.
3.  **Parallelism:** Execute multiple calculations simultaneously rather
    than sequentially.

HPC is used in scientific research, engineering, weather forecasting,
artificial intelligence, healthcare, financial modeling, and industrial
simulations.

## 2. Why do we need HPC?

Traditional computing systems can be insufficient for problems that
require enormous computational power.

| Use case            | Why HPC is needed                                      |
|:--------------------|:-------------------------------------------------------|
| Weather forecasting | Process large atmospheric and climate datasets         |
| AI/ML               | Train large machine-learning and deep-learning models  |
| Scientific research | Perform complex mathematical simulations               |
| Healthcare          | Analyze medical and biological datasets                |
| Automotive          | Run crash simulations and computational fluid dynamics |
| Aerospace           | Simulate aircraft aerodynamics and spacecraft systems  |
| Oil and gas         | Perform seismic processing and reservoir simulation    |
| Financial services  | Execute complex financial risk models                  |

### Example: AI model training

Training a large AI model requires millions or billions of mathematical
operations. HPC can combine multiple GPUs across multiple servers to
distribute calculations and reduce training time.

## 3. How does HPC work?

HPC works by dividing a large computational problem into smaller tasks
and distributing them across multiple compute resources.

### 3.1 Traditional computing (serial processing)

A single processor executes tasks sequentially:

``` text
Large computational problem
          |
          v
      Single CPU
          |
          +--> Task 1
          +--> Task 2
          +--> Task 3
          +--> Task 4
          |
          v
      Final result
```

### 3.2 HPC (parallel processing)

A large problem is divided into smaller tasks. Multiple processors or
compute nodes execute those tasks at the same time.

``` text
             Large computational problem
                         |
                         v
                  HPC Scheduler
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
          Node 1      Node 2      Node 3
          Task 1      Task 2      Task 3
             |           |           |
             +-----------+-----------+
                         |
                         v
                Combine the results
                         |
                         v
                    Final result
```

This is parallel computing. Some HPC applications use **massively
parallel processing**, where hundreds or thousands of processing
elements work together.

Not every task can be parallelized perfectly. Communication overhead,
dependencies between tasks, and storage performance can affect the
speedup.

## 4. HPC architecture and components

An HPC environment consists of interconnected hardware and software
layers.

``` text
                    USERS / APPLICATION TEAMS
                              |
                           SSH / CLI
                              |
                       LOGIN NODE(S)
                              |
                   JOB SUBMISSION / QUEUES
                              |
                  HPC SCHEDULER / CONTROLLER
                       Slurm / PBS Pro
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        COMPUTE NODE 1   COMPUTE NODE 2   COMPUTE NODE 3
        CPU / GPU        CPU / GPU        CPU / GPU
        RAM              RAM              RAM
             |                |                |
             +----------------+----------------+
                              |
                HIGH-SPEED INTERCONNECT
                  InfiniBand / RoCE / RDMA
                              |
                    SHARED PARALLEL STORAGE
                    Lustre / BeeGFS / NFS
                              |
                 MONITORING AND OPERATIONS
                 Prometheus / Grafana / DCGM
```

### 4.1 Main infrastructure components

| Component          | Purpose                                         | Examples                     |
|:-------------------|:------------------------------------------------|:-----------------------------|
| Login node         | User access and job submission                  | SSH, Linux                   |
| Management node    | Cluster administration and scheduler services   | Slurm controller, PBS server |
| Compute nodes      | Execute computational workloads                 | CPU and GPU servers          |
| CPU                | General-purpose calculations                    | Intel Xeon, AMD EPYC         |
| GPU                | Parallel mathematical computations              | NVIDIA H100, L40S, GB10      |
| High-speed network | Low-latency communication between nodes         | InfiniBand, RoCE             |
| Storage            | Store datasets, models, and results             | NFS, Lustre, BeeGFS          |
| Job scheduler      | Allocate resources and manage queues            | Slurm, PBS Pro, LSF          |
| MPI                | Communication between parallel processes        | Open MPI, Intel MPI          |
| Monitoring         | Monitor infrastructure and workload performance | Prometheus, Grafana          |

### 4.2 Compute layer

The compute layer performs the actual processing.

- **CPU workloads:** General-purpose computing, simulations, and
  numerical calculations.
- **GPU workloads:** Deep learning, AI training, and GPU-accelerated
  simulations.
- **Hybrid workloads:** CPU and GPU resources work together.

### 4.3 Network layer

HPC applications may exchange data frequently between compute nodes.
High bandwidth and low latency are important.

Key technologies include:

- InfiniBand
- RoCE (RDMA over Converged Ethernet)
- RDMA (Remote Direct Memory Access)
- NVIDIA ConnectX network adapters
- High-speed InfiniBand switches

RDMA enables data transfer between systems while reducing CPU
involvement compared with conventional networking paths.

### 4.4 Storage layer

HPC workloads often read and write large datasets concurrently.

| Storage technology   | Purpose                                           |
|:---------------------|:--------------------------------------------------|
| NFS                  | Shared network file storage                       |
| Lustre               | Parallel distributed file system                  |
| BeeGFS               | Parallel file system for HPC                      |
| IBM Storage Scale    | Enterprise-scale parallel file and object storage |
| Azure Managed Lustre | Managed parallel file system for Azure HPC        |

Storage throughput, metadata performance, capacity, and concurrent
access all affect application performance.

### 4.5 Scheduling and resource management

A scheduler manages job submission, queues, priorities, resource
allocation, and job execution.

Popular workload managers include:

- Slurm
- Altair PBS Professional
- IBM Spectrum LSF
- HTCondor

### 4.6 Parallel programming layer

**MPI (Message Passing Interface)** is a standard used by parallel
processes to communicate and coordinate, including processes running on
different compute nodes.

**OpenMP** is commonly used for shared-memory parallelism within a node.
CUDA is used to program NVIDIA GPUs.

## 5. HPC workload execution workflow

A typical HPC job follows this sequence:

1.  **Connect to a login node:** The user connects to the cluster using
    SSH.
2.  **Prepare the application and dataset:** Compile or load the
    application and prepare input files.
3.  **Create a job script:** Specify resources such as nodes, tasks,
    CPUs, GPUs, memory, and wall-clock time.
4.  **Submit the job:** Submit the script to Slurm or PBS Pro.
5.  **Scheduler evaluates the request:** The scheduler checks resource
    availability, queue policies, priority, and limits.
6.  **Resources are allocated:** The scheduler assigns suitable compute
    nodes when resources become available.
7.  **Workload executes:** The application uses CPU, GPU, memory,
    storage, and possibly MPI communication.
8.  **Output is stored:** Results, logs, and checkpoints are written to
    storage.
9.  **Job completes:** The scheduler records job status and releases
    allocated resources.

### Example: Slurm job submission

Create `job.sh`:

``` bash
#!/bin/bash
#SBATCH --job-name=hpc-demo
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=8
#SBATCH --time=00:30:00
#SBATCH --output=hpc-%j.out

module load openmpi

srun ./mpi_application
```

Submit the job:

``` bash
sbatch job.sh
```

Check queued and running jobs:

``` bash
squeue -u "$USER"
```

Inspect accounting information:

``` bash
sacct
```

The application and MPI installation must be configured for the cluster.
The example assumes `mpi_application` has already been built and is
available in the job’s working directory.

## 6. HPC versus AI/ML infrastructure

HPC and AI infrastructure share many components, but their workload
characteristics and performance measures can differ.

| Feature             | Traditional HPC                        | AI/ML infrastructure                            |
|:--------------------|:---------------------------------------|:------------------------------------------------|
| Primary objective   | Scientific and engineering computation | Model training and inference                    |
| Processing          | CPU and GPU parallelism                | Often accelerator-intensive                     |
| Programming         | MPI, OpenMP, CUDA                      | PyTorch, TensorFlow, CUDA                       |
| Network             | InfiniBand, RoCE, Ethernet             | InfiniBand, RoCE, Ethernet                      |
| Storage             | Parallel file systems and datasets     | Datasets, model checkpoints, object storage     |
| Scheduling          | Slurm, PBS Pro, LSF                    | Slurm, Kubernetes, cloud schedulers             |
| Workloads           | CFD, molecular dynamics, simulations   | LLM training, fine-tuning, inference            |
| Performance metrics | FLOPS, bandwidth, latency              | Tokens/sec, throughput, accelerator utilization |

HPC is not limited to traditional scientific simulations. Modern HPC
systems also support AI training, deep learning, large-scale inference,
and data analytics.

## 7. On-premises HPC versus cloud HPC

| Feature            | On-premises HPC                                | Cloud HPC                                       |
|:-------------------|:-----------------------------------------------|:------------------------------------------------|
| Infrastructure     | Physical servers in a data center              | Cloud virtual machines and services             |
| Hardware ownership | Organization owns or operates hardware         | Cloud provider operates physical infrastructure |
| Scaling            | Often requires additional hardware procurement | Resources can be provisioned dynamically        |
| Initial investment | Usually substantial                            | Lower upfront infrastructure investment         |
| Maintenance        | Organization manages hardware and software     | Shared responsibility                           |
| Storage            | Local or shared parallel storage               | Managed cloud storage and parallel file systems |
| Networking         | Dedicated InfiniBand/RoCE fabrics              | Cloud-supported high-performance networking     |
| Cost               | Hardware, power, cooling, support              | Consumption-based and reservation options       |

### 7.1 Deployment models

- **On-premises HPC:** The organization owns and operates the cluster in
  its data center.
- **Cloud HPC:** Compute, storage, and networking resources are
  provisioned from a cloud provider.
- **Hybrid HPC / cloud bursting:** An on-premises cluster uses cloud
  resources when additional capacity is needed.

Cloud bursting requires compatible software, networking, identity, data
movement, and scheduler integration. It is not automatically seamless.

## 8. Microsoft Azure HPC architecture and services

Azure provides compute, storage, networking, and cluster-management
services for HPC workloads.

| Layer              | Azure service / technology      | Purpose                                     |
|:-------------------|:--------------------------------|:--------------------------------------------|
| Compute            | Azure HPC virtual machines      | CPU-intensive workloads                     |
| GPU compute        | Azure N-series virtual machines | GPU-accelerated workloads                   |
| Storage            | Azure Managed Lustre            | High-performance parallel storage           |
| Storage            | Azure NetApp Files              | Enterprise file storage                     |
| Networking         | RDMA-capable VM networking      | High-performance node communication         |
| Connectivity       | ExpressRoute / VPN              | Connect on-premises infrastructure to Azure |
| Cluster management | Azure CycleCloud                | Deploy and manage HPC clusters              |
| Batch execution    | Azure Batch                     | Managed batch job execution                 |
| Monitoring         | Azure Monitor / Grafana         | Infrastructure and workload monitoring      |
| Containers         | Azure Kubernetes Service (AKS)  | Container orchestration                     |

Available VM families, networking features, regions, and service
capabilities change over time. Validate the current Azure documentation
before designing a production cluster.

### 8.1 Azure Batch versus Azure CycleCloud

| Feature        | Azure Batch                         | Azure CycleCloud                               |
|:---------------|:------------------------------------|:-----------------------------------------------|
| Type           | Managed batch computing service     | HPC cluster orchestration platform             |
| Scheduling     | Azure Batch scheduling              | Supports schedulers such as Slurm and PBS Pro  |
| Infrastructure | Managed compute pools               | Deploys and manages HPC cluster infrastructure |
| Scaling        | Scales compute pools                | Can scale cluster nodes based on workload      |
| Workloads      | Batch processing and parallel tasks | Traditional HPC and MPI workloads              |
| Target users   | Developers and application teams    | HPC administrators and engineers               |

**Azure Batch** is useful when an application needs managed execution of
many batch tasks without operating a traditional HPC scheduler.

**Azure CycleCloud** is useful when an organization needs a traditional
HPC cluster experience and wants to manage schedulers such as Slurm or
PBS Pro in Azure.

## 9. Relationship between HPC, Slurm, PBS Pro, and Kubernetes

These technologies solve different infrastructure problems.

| Technology | Primary responsibility                          |
|:-----------|:------------------------------------------------|
| HPC        | Computing infrastructure and parallel workloads |
| Slurm      | HPC job scheduling and resource management      |
| PBS Pro    | HPC job and resource management                 |
| LSF        | Distributed workload management                 |
| Kubernetes | Container orchestration                         |
| OpenShift  | Enterprise Kubernetes platform                  |
| MPI        | Communication between parallel processes        |
| CUDA       | NVIDIA GPU programming platform                 |

A simplified architecture:

``` text
                 HPC INFRASTRUCTURE
        CPU | GPU | Memory | Network | Storage
                          |
             +------------+------------+
             |                         |
             v                         v
      HPC WORKLOAD MANAGERS      CONTAINER ORCHESTRATION
       Slurm / PBS Pro / LSF      Kubernetes / OpenShift
             |                         |
             +------------+------------+
                          |
                          v
                 APPLICATION WORKLOADS
             MPI | CUDA | AI/ML | LLM | CFD
```

Kubernetes and Slurm can coexist in an HPC environment, but they have
different scheduling models. Their integration requires appropriate
resource and workload coordination.

## 10. HPC performance benchmarking

HPC administrators should measure infrastructure and application
performance.

| Benchmark category | What to measure                               | Example tools                   |
|:-------------------|:----------------------------------------------|:--------------------------------|
| CPU                | Floating-point performance and CPU throughput | HPL, sysbench                   |
| GPU                | GPU compute throughput                        | NVIDIA HPL, CUDA samples        |
| Memory             | Memory bandwidth                              | STREAM                          |
| Network            | Bandwidth and latency                         | OSU Micro-Benchmarks, iperf3    |
| MPI                | Inter-process communication                   | OSU MPI Benchmarks              |
| Storage            | Read/write throughput and IOPS                | IOR, fio                        |
| Application        | Execution time and scalability                | Application-specific benchmarks |

### 10.1 Important HPC performance metrics

- **FLOPS:** Floating-point operations per second.
- **TFLOPS:** Trillions of floating-point operations per second.
- **PFLOPS:** Quadrillions of floating-point operations per second.
- **Bandwidth:** Amount of data transferred per second.
- **Latency:** Time required for communication.
- **Scalability:** How application performance changes as resources are
  added.
- **GPU utilization:** How actively a GPU is being used.
- **Parallel efficiency:** How effectively additional processing
  resources contribute to performance.

### 10.2 Example: Calculate speedup

Suppose an application takes 60 minutes on one node and 18 minutes on
four nodes.

``` text
Speedup = Serial execution time / Parallel execution time

Speedup = 60 / 18
        = 3.33
```

The application achieves a speedup of approximately 3.33 times.

Parallel efficiency for four nodes:

``` text
Efficiency = Speedup / Number of nodes

Efficiency = 3.33 / 4
           = 0.8325
           = 83.25%
```

This is a simplified calculation. Use equivalent workloads and
consistent measurement conditions when comparing results.

## 11. HPC implementation checklist

A practical HPC deployment can be organized into these phases.

| Phase | Implementation activity          | Validation                            |
|:------|----------------------------------|:--------------------------------------|
| 1     | Understand workload requirements | CPU/GPU, memory, storage requirements |
| 2     | Design cluster architecture      | Architecture review                   |
| 3     | Provision compute nodes          | Hardware validation                   |
| 4     | Install Linux operating system   | OS and kernel checks                  |
| 5     | Configure networking             | Connectivity, bandwidth, and latency  |
| 6     | Configure shared storage         | Mount and I/O tests                   |
| 7     | Install CPU/GPU drivers          | Hardware detection                    |
| 8     | Install MPI libraries            | MPI validation                        |
| 9     | Install Slurm/PBS Pro            | Scheduler validation                  |
| 10    | Configure users and queues       | Job submission and execution          |
| 11    | Configure monitoring             | Prometheus/Grafana dashboards         |
| 12    | Benchmark workloads              | Performance and scalability reports   |

### 11.1 Suggested technologies for a practical HPC lab

| Layer              | Suggested technologies             |
|:-------------------|:-----------------------------------|
| Operating system   | Rocky Linux 9                      |
| Compute            | Intel/AMD CPU and NVIDIA GPU       |
| Networking         | ConnectX, InfiniBand, RoCE         |
| Storage            | NFS, Lustre, BeeGFS                |
| Scheduler          | Slurm or PBS Professional          |
| Parallel computing | Open MPI, OpenMP, CUDA             |
| Monitoring         | Prometheus, Grafana, DCGM Exporter |

## 12. Recommended HPC learning roadmap

For an infrastructure engineer, learn these areas in sequence:

1.  **HPC fundamentals:** Understand parallel computing, cluster
    architecture, nodes, and workloads.
2.  **Linux administration:** Learn OS installation, package management,
    kernel configuration, users, SSH, and system services.
3.  **Compute resources:** Understand CPU, GPU, memory, NUMA, and
    accelerator configuration.
4.  **High-speed networking:** Learn InfiniBand, RoCE, RDMA, ConnectX,
    bandwidth, and latency testing.
5.  **Shared storage:** Learn NFS, Lustre, BeeGFS, parallel I/O, and
    storage performance.
6.  **Job schedulers:** Install, configure, and administer Slurm and PBS
    Pro.
7.  **Parallel programming:** Understand MPI, OpenMP, and CUDA
    workloads.
8.  **Monitoring:** Configure Prometheus, Grafana, and GPU monitoring.
9.  **Benchmarking:** Run CPU, GPU, memory, network, MPI, storage, and
    application benchmarks.
10. **Cloud HPC:** Understand Azure compute, Batch, CycleCloud, storage,
    and hybrid cloud bursting.

## 13. Final consolidated understanding

The two references complement one another:

| Topic          | IBM perspective                              | Microsoft perspective                              |
|:---------------|:---------------------------------------------|:---------------------------------------------------|
| HPC definition | Parallel computing using powerful processors | Large-scale CPU/GPU computing                      |
| Architecture   | Clusters, nodes, and centralized scheduling  | Compute, storage, and networking                   |
| Processing     | Massively parallel computing                 | CPU/GPU-based computing                            |
| Communication  | MPI and high-performance networking          | MPI and RDMA-capable networking                    |
| Storage        | High-throughput, low-latency storage         | Lustre, NetApp Files, and other services           |
| Deployment     | On-premises and cloud HPC                    | Azure cloud, hybrid, and cloud bursting            |
| Management     | Cluster workload scheduling                  | Azure Batch and CycleCloud                         |
| Applications   | AI, genomics, finance, and simulations       | AI, engineering, weather, and scientific workloads |

### Key takeaway

**HPC combines compute power, parallel processing, high-speed
networking, shared storage, and workload scheduling to execute
computationally intensive applications efficiently.**

For an HPC infrastructure engineer, the most important practical skills
are Linux administration, cluster networking, shared storage, Slurm/PBS
Pro, MPI, GPU administration, monitoring, and performance benchmarking.

## 14. References

1.  IBM – [What is High-Performance Computing
    (HPC)?](https://www.ibm.com/think/topics/hpc)
2.  Microsoft – [High-Performance Computing (HPC) on
    Azure](https://learn.microsoft.com/en-us/azure/architecture/guide/compute/high-performance-computing)

This guide consolidates the concepts from both references and adds
practical infrastructure examples to connect the theory with HPC
administration.
