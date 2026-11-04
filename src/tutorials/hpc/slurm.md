---
layout: layouts/tutorial.njk
title: "SLURM – HPC Workload Manager"
description: "Learn Slurm installation, configuration, scheduling, CPU/GPU jobs, troubleshooting and benchmarking."
category: HPC
categoryUrl: /tutorials/hpc/
date: 2026-11-06
permalink: /tutorials/hpc/slurm/
---


# NVIDIA Technical Support Engineer -- Slurm: Complete Interview Preparation Roadmap

## HPC / Slurm Interview Preparation -- Senior Engineer Level

Based on the NVIDIA Technical Support Engineer -- Slurm job description,
prepare as an **HPC Systems Engineer + Slurm Administrator + Production
Support Engineer**, rather than preparing only for Slurm installation.

NVIDIA is looking for someone who can:

1.  Install and configure Slurm from scratch.
2.  Understand Slurm architecture, daemons and internal communication.
3.  Troubleshoot complex scheduling and job execution issues.
4.  Administer Linux systems, authentication, networking and databases.
5.  Manage multi-user HPC clusters with CPU and GPU resources.
6.  Diagnose scheduler performance and accounting database issues.
7.  Integrate Slurm with containers and NVIDIA GPU infrastructure.
8.  Explain technical problems clearly to customers.

The preparation should revolve around building and operating a real HPC
cluster, reproducing failures, diagnosing them and explaining the
resolution.

------------------------------------------------------------------------

## 1. The preparation strategy

Divide preparation into six practical phases.

### Phase 1 -- Linux and HPC fundamentals

Rocky Linux 9, systemd, SSH, DNS, NTP, users, groups, networking,
filesystems and shared storage.

### Phase 2 -- Slurm installation and architecture

slurmctld, slurmd, slurmdbd, MariaDB, MUNGE, partitions, nodes and
configuration.

### Phase 3 -- Job scheduling and administration

sbatch, srun, salloc, queues, priorities, fair-share, QoS, reservations
and job accounting.

### Phase 4 -- Troubleshooting and failure analysis

Node failures, pending jobs, communication errors, scheduling problems,
database failures and performance.

### Phase 5 -- GPU and container integration

NVIDIA drivers, CUDA, GPU scheduling, GRES, Pyxis, Enroot and
Singularity/Apptainer.

### Phase 6 -- Benchmarking and production operations

Scheduler performance, job throughput, monitoring, logging, capacity
planning and incident handling.

Suggested preparation allocation:

-   40%: practical installation and troubleshooting.
-   30%: architecture and scheduling.
-   Remaining time: GPU integration, benchmarking and customer-facing
    scenarios.

------------------------------------------------------------------------

## 2. Build your own Slurm HPC lab

The most important preparation is deploying a three-node Slurm cluster
on Rocky Linux 9.

### 2.1 Lab architecture

  Hostname     Role                      Suggested resources
  ------------ ------------------------- ---------------------
  slurmctl     Controller / management   4 vCPU, 8 GB RAM
  slurm01      Compute node 1            8 vCPU, 16 GB RAM
  slurm02      Compute node 2            8 vCPU, 16 GB RAM
  slurmlogin   Login / submission        2 vCPU, 4 GB RAM

For the first lab, combine the login and controller roles to reduce
infrastructure requirements.

### 2.2 Software stack

  Component              Purpose
  ---------------------- -----------------------------------
  Rocky Linux 9          Operating system
  Slurm                  Workload manager
  MUNGE                  Authentication
  MariaDB                Accounting database
  slurmctld              Central scheduler
  slurmd                 Compute node daemon
  slurmdbd               Accounting database service
  Prometheus             Metrics collection
  Grafana                Monitoring dashboard
  NVIDIA Driver / CUDA   GPU compute environment (GPU lab)

------------------------------------------------------------------------

## 3. Understand every Slurm component

  -----------------------------------------------------------------------
  Component               Function                Runs on
  ----------------------- ----------------------- -----------------------
  slurmctld               Controls scheduling,    Controller
                          resources and job       
                          allocation              

  slurmd                  Executes and manages    Compute
                          jobs on compute nodes   

  slurmdbd                Stores and manages      Database node
                          accounting information  

  slurmrestd              Provides REST API       API node
                          access                  

  MUNGE                   Authenticates           All relevant nodes
                          communication between   
                          cluster components      

  slurmstepd              Manages job steps and   Compute
                          their processes         

  MariaDB                 Stores accounting       Database node
                          records                 
  -----------------------------------------------------------------------

### 3.1 Complete job execution workflow

1.  **User / Login Node:** Creates a job script and executes `sbatch`.
2.  **slurmctld:** Validates the request, checks resources and schedules
    the job.
3.  **Scheduling Engine:** Selects partition, nodes, CPUs, memory and
    GPUs.
4.  **slurmd -- Compute Node 1:** Launches allocated tasks.
5.  **slurmd -- Compute Node 2:** Launches allocated tasks when the job
    spans multiple nodes.
6.  **Job Execution and Accounting:** The job completes, resource usage
    is collected and records are stored through slurmdbd in MariaDB.

### 3.2 What happens internally when a user executes `sbatch train.sh`?

A strong answer should cover:

1.  The client submits a job request to slurmctld.
2.  The controller validates the job request.
3.  The scheduler evaluates available resources, priority and policy.
4.  The job enters PENDING if resources or policy prevent immediate
    execution.
5.  The controller allocates resources when the job becomes eligible.
6.  slurmd receives the job launch request.
7.  slurmstepd manages the job step and its processes.
8.  Job completion and resource usage are reported.
9.  Accounting information is recorded when accounting is configured.

Read the [Slurm documentation](https://slurm.schedmd.com/).

------------------------------------------------------------------------

## 4. Install Slurm on Rocky Linux 9 -- practical sequence

Use a consistent, supported Slurm release across all nodes. Build or
obtain appropriate RPM packages for the selected Rocky Linux version.
For production, use a supported packaging approach and avoid
independently compiling different binaries on each node.

### Step 1 -- Prepare all Linux nodes

Run on all nodes:

``` bash
hostnamectl
cat /etc/rocky-release

dnf update -y

dnf install -y \
  chrony \
  munge \
  munge-libs \
  munge-devel \
  gcc \
  make \
  wget \
  tar \
  mariadb \
  python3 \
  vim \
  git \
  net-tools \
  bind-utils

systemctl enable --now chronyd
```

Configure hostname resolution:

``` bash
cat >> /etc/hosts <<EOF
192.168.10.10 slurmctl
192.168.10.11 slurm01
192.168.10.12 slurm02
192.168.10.13 slurmlogin
EOF
```

Validate:

``` bash
hostname -f
getent hosts slurmctl
chronyc tracking
```

Ensure consistent user IDs, group IDs, clock synchronization and
authentication configuration across all nodes.

### Step 2 -- Configure MUNGE authentication

Generate the authentication key on the controller:

``` bash
create-munge-key
```

Copy the same key securely to the other nodes:

``` bash
scp /etc/munge/munge.key root@slurm01:/etc/munge/
scp /etc/munge/munge.key root@slurm02:/etc/munge/
```

Set permissions on all nodes:

``` bash
chown munge:munge /etc/munge/munge.key
chmod 400 /etc/munge/munge.key

systemctl enable --now munge
```

Test locally:

``` bash
munge -n | unmunge
```

Cross-node test:

``` bash
munge -n | ssh slurm01 unmunge
```

If this fails, investigate:

-   Clock synchronization.
-   MUNGE key mismatch.
-   File ownership and permissions.
-   DNS and hostname resolution.
-   Firewall connectivity.

### Step 3 -- Install Slurm

Install consistent packages on the appropriate hosts:

-   Slurm client utilities.
-   slurmctld.
-   slurmd.
-   slurmdbd, when accounting is enabled.

Do not mix Slurm versions or plugin libraries between nodes.

Official installation guidance: [SchedMD Slurm
documentation](https://slurm.schedmd.com/).

### Step 4 -- Create Slurm users and directories

Create the service account consistently:

``` bash
groupadd -g 991 slurm
useradd -u 991 \
  -g slurm \
  -M \
  -s /sbin/nologin slurm
```

Create directories on the appropriate hosts:

``` bash
mkdir -p /var/log/slurm
mkdir -p /var/lib/slurm/slurmctld
mkdir -p /var/lib/slurm/slurmd

chown -R slurm:slurm /var/log/slurm
chown -R slurm:slurm /var/lib/slurm
```

The compute node's slurmd spool directory needs appropriate permissions
for its daemon, which runs as root.

### Step 5 -- Configure slurm.conf

Create the configuration directory and file:

``` bash
mkdir -p /etc/slurm
vim /etc/slurm/slurm.conf
```

Example configuration for a two-node CPU lab:

``` ini
ClusterName=hpc-lab

SlurmctldHost=slurmctl

SlurmUser=slurm
SlurmdUser=root

AuthType=auth/munge
CryptoType=crypto/munge

StateSaveLocation=/var/lib/slurm/slurmctld
SlurmdSpoolDir=/var/lib/slurm/slurmd

SlurmctldLogFile=/var/log/slurm/slurmctld.log
SlurmdLogFile=/var/log/slurm/slurmd.log

SlurmctldPort=6817
SlurmdPort=6818

SwitchType=switch/none
MpiDefault=none

SchedulerType=sched/backfill

SelectType=select/cons_tres
SelectTypeParameters=CR_Core_Memory

ProctrackType=proctrack/cgroup

ReturnToService=2

NodeName=slurm01 CPUs=8 RealMemory=15000 State=UNKNOWN
NodeName=slurm02 CPUs=8 RealMemory=15000 State=UNKNOWN

PartitionName=compute \
 Nodes=slurm01,slurm02 \
 Default=YES \
 MaxTime=INFINITE \
 State=UP
```

Copy the same configuration to all nodes:

``` bash
scp /etc/slurm/slurm.conf root@slurm01:/etc/slurm/
scp /etc/slurm/slurm.conf root@slurm02:/etc/slurm/
```

This is a teaching configuration, not a complete production security or
performance configuration. Validate exact parameters and installed
plugin support against the selected Slurm release.

### Step 6 -- Start Slurm services

On the controller:

``` bash
systemctl enable --now slurmctld
systemctl status slurmctld
```

On compute nodes:

``` bash
systemctl enable --now slurmd
systemctl status slurmd
```

Check:

``` bash
sinfo
scontrol show nodes
scontrol ping
```

Expected result: both compute nodes should register and be available in
the `compute` partition.

------------------------------------------------------------------------

## 5. Configure Slurm accounting -- MariaDB + slurmdbd

Accounting is an important interview topic because the role mentions
accounting and database-backed services.

### 5.1 Architecture

-   `slurmctld` manages scheduling and job allocation.
-   `slurmdbd` provides the accounting database service interface.
-   MariaDB stores accounting data.
-   Slurm commands such as `sacct`, `sacctmgr` and `sreport` query
    accounting information.

### 5.2 Example database setup

``` sql
CREATE DATABASE slurm_acct_db;

CREATE USER 'slurm'@'localhost'
IDENTIFIED BY 'CHANGE_THIS_PASSWORD';

GRANT ALL PRIVILEGES
ON slurm_acct_db.*
TO 'slurm'@'localhost';

FLUSH PRIVILEGES;
```

Use a strong secret and restrict database access appropriately in a real
deployment.

### 5.3 Example `/etc/slurm/slurmdbd.conf`

``` ini
DbdHost=slurmctl
DbdPort=6819

SlurmUser=slurm

AuthType=auth/munge

StorageType=accounting_storage/mysql
StorageHost=localhost
StoragePort=3306
StorageUser=slurm
StoragePass=CHANGE_THIS_PASSWORD
StorageLoc=slurm_acct_db

LogFile=/var/log/slurm/slurmdbd.log
PidFile=/run/slurmdbd.pid
```

Secure the file:

``` bash
chown slurm:slurm /etc/slurm/slurmdbd.conf
chmod 600 /etc/slurm/slurmdbd.conf
```

### 5.4 Enable accounting in `slurm.conf`

``` ini
AccountingStorageType=accounting_storage/slurmdbd
AccountingStorageHost=slurmctl

JobAcctGatherType=jobacct_gather/cgroup
```

Start the service:

``` bash
systemctl enable --now slurmdbd
```

Register the cluster:

``` bash
sacctmgr add cluster hpc-lab
sacctmgr show cluster
```

Create an account and associate a user:

``` bash
sacctmgr add account research \
  Cluster=hpc-lab

sacctmgr add user testuser \
  Account=research
```

Validate:

``` bash
sacctmgr show account
sacctmgr show user
sacctmgr show association
```

Reference: [Slurm Accounting
Guide](https://slurm.schedmd.com/accounting.html).

------------------------------------------------------------------------

## 6. Test Slurm with real job submissions

An interviewer will expect you to demonstrate that the cluster works,
not just that services are running.

Create a workspace:

``` bash
mkdir -p ~/slurm-lab/jobs
cd ~/slurm-lab/jobs
```

### Test 1 -- Basic batch job

Create `hello.sh`:

``` bash
#!/bin/bash

#SBATCH --job-name=hello
#SBATCH --partition=compute
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --time=00:02:00
#SBATCH --output=hello-%j.out

echo "Hello from Slurm"

hostname
date

sleep 20

echo "Job completed"
```

Submit:

``` bash
sbatch hello.sh
```

Monitor:

``` bash
squeue
squeue -u "$USER"
scontrol show job <JOB_ID>
```

Check output:

``` bash
cat hello-<JOB_ID>.out
```

### Test 2 -- Interactive job

``` bash
srun \
  --partition=compute \
  --nodes=1 \
  --ntasks=1 \
  --cpus-per-task=2 \
  --pty bash
```

Inside the allocated session:

``` bash
hostname
nproc
```

Exit:

``` bash
exit
```

### Test 3 -- Multi-node job

``` bash
srun \
  --partition=compute \
  --nodes=2 \
  --ntasks=2 \
  hostname
```

Expected: output from both compute nodes.

### Test 4 -- Resource allocation

``` bash
srun \
  --partition=compute \
  --nodes=1 \
  --ntasks=1 \
  --cpus-per-task=4 \
  --mem=4G \
  hostname
```

Understand the difference between:

-   `--nodes`
-   `--ntasks`
-   `--cpus-per-task`
-   `--mem`
-   `--time`
-   `--gres`

### Test 5 -- Job arrays

Create `array.sh`:

``` bash
#!/bin/bash

#SBATCH --job-name=array-test
#SBATCH --array=1-20
#SBATCH --time=00:01:00
#SBATCH --output=array-%A_%a.out

echo "Array Job ID: $SLURM_ARRAY_JOB_ID"
echo "Task ID: $SLURM_ARRAY_TASK_ID"

hostname
sleep 5
```

Submit and observe:

``` bash
sbatch array.sh
squeue
sacct
```

### Test 6 -- Job accounting

``` bash
sacct -j <JOB_ID> \
  --format=JobID,JobName,Partition,State,Elapsed,AllocCPUS,MaxRSS,ExitCode
```

### Test 7 -- Scheduling visibility

``` bash
sinfo -Nel

squeue -o "%.18i %.12P %.15j %.10u %.2t %.10M %.6D %R"

sprio -j <JOB_ID>

scontrol show partition
```

These seven tests should become part of daily interview practice.

------------------------------------------------------------------------

## 7. Configure GPU scheduling -- NVIDIA-specific preparation

Go beyond basic Slurm administration and understand how Slurm allocates
NVIDIA GPUs to users and jobs.

### 7.1 GPU architecture

  Layer            Technology                  Responsibility
  ---------------- --------------------------- ------------------------------------
  Hardware         NVIDIA H100 / L40S / A100   GPU compute
  Driver           NVIDIA Driver               GPU device access
  Runtime          CUDA                        GPU programming
  Monitoring       NVML / `nvidia-smi`         GPU discovery and telemetry
  Slurm            GRES                        GPU resource allocation
  Compute daemon   slurmd                      Job execution
  Isolation        cgroups                     Resource and device access control
  Job              sbatch / srun               GPU workload submission

### Step 1 -- Validate GPU hardware

On a GPU compute node:

``` bash
nvidia-smi
nvidia-smi -L
nvidia-smi topo -m
lspci | grep -i nvidia
```

Check CUDA:

``` bash
nvcc --version
```

### Step 2 -- Configure GRES

Example GPU node configuration:

``` ini
NodeName=gpu01 CPUs=64 \
 RealMemory=250000 \
 Gres=gpu:4 \
 State=UNKNOWN

PartitionName=gpu \
 Nodes=gpu01 \
 Default=NO \
 MaxTime=INFINITE \
 State=UP
```

For NVIDIA GPU autodetection, the GRES configuration can use NVML.

Example `/etc/slurm/gres.conf`:

``` ini
AutoDetect=nvml
```

This requires a Slurm build with NVML support and the appropriate NVIDIA
driver libraries.

### Step 3 -- Submit GPU jobs

Create `gpu-test.sh`:

``` bash
#!/bin/bash

#SBATCH --job-name=gpu-test
#SBATCH --partition=gpu
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --gres=gpu:1
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=00:05:00
#SBATCH --output=gpu-%j.out

echo "GPU Job Started"

hostname

nvidia-smi

echo "GPU Job Completed"
```

Submit:

``` bash
sbatch gpu-test.sh
```

Monitor:

``` bash
squeue
scontrol show node gpu01
scontrol show job <JOB_ID>
nvidia-smi
```

### Step 4 -- Understand advanced GPU scheduling

  -----------------------------------------------------------------------
  Topic                               What to explain
  ----------------------------------- -----------------------------------
  GRES                                Generic resource scheduling

  TRES                                Trackable resources, including GPU,
                                      CPU and memory

  GPU binding                         Assigning GPUs to individual tasks

  GPU isolation                       Preventing jobs from accessing
                                      unallocated GPU devices

  MIG                                 Partitioning supported NVIDIA GPUs
                                      into instances

  NVML                                GPU discovery and monitoring

  GPU topology                        Understanding PCIe, NVLink and NUMA
                                      locality

  GPU sharing                         Configuring supported sharing and
                                      allocation policies
  -----------------------------------------------------------------------

For an H100 cluster, understand MIG, GPU affinity, NVLink and multi-GPU
communication.

**Important:** A Slurm allocation is not automatically a guarantee of
complete device isolation. Understand how GRES, task plugins and cgroup
device constraints work together.

------------------------------------------------------------------------

## 8. Benchmark Slurm performance

The NVIDIA job description explicitly mentions:

-   Scheduler performance.
-   Job throughput.
-   Controller load.
-   Database scaling.
-   Large-scale Slurm environments.

Do not restrict your benchmark to CPU or GPU computation. Benchmark the
scheduler itself.

### 8.1 Benchmark categories

  -----------------------------------------------------------------------
  Benchmark               What to measure         Commands / tools
  ----------------------- ----------------------- -----------------------
  Job submission          Submission latency      sbatch

  Job scheduling          Pending-to-running      squeue, scontrol
                          latency                 

  Job throughput          Completed jobs per hour sacct

  Job launch              Time to start tasks     srun

  Controller performance  CPU, memory, daemon     top, pidstat
                          activity                

  Database performance    Accounting query        sacct, sacctmgr
                          latency                 

  GPU performance         Utilization, memory,    nvidia-smi
                          compute                 

  Network performance     Node-to-node bandwidth  iperf3

  MPI performance         Communication latency   OSU Micro-Benchmarks
                          and bandwidth           
  -----------------------------------------------------------------------

### 8.2 Build a Slurm benchmark script

Create `benchmark.sh`:

``` bash
#!/bin/bash

#SBATCH --job-name=slurm-benchmark
#SBATCH --partition=compute
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --time=00:01:00
#SBATCH --output=benchmark-%j.out

START=$(date +%s.%N)

echo "Job ID: $SLURM_JOB_ID"
echo "Node: $(hostname)"
echo "Start: $(date -Is)"

for i in {1..100}; do
    echo "Iteration: $i"
done

sleep 2

END=$(date +%s.%N)

echo "End: $(date -Is)"

awk -v start="$START" -v end="$END" \
  'BEGIN { printf "Execution time: %.3f seconds\n", end-start }'
```

Submit:

``` bash
sbatch benchmark.sh
```

### 8.3 Benchmark scheduler throughput

Use a bounded job array:

``` bash
#!/bin/bash

#SBATCH --job-name=throughput
#SBATCH --partition=compute
#SBATCH --array=1-100%10
#SBATCH --ntasks=1
#SBATCH --time=00:01:00
#SBATCH --output=throughput-%A_%a.out

echo "Job $SLURM_ARRAY_TASK_ID"
date +%s.%N

sleep 2
```

Submit:

``` bash
sbatch throughput.sh
```

Collect results:

``` bash
sacct -X \
  --starttime today \
  --format=JobID,State,Submit,Eligible,Start,End,Elapsed
```

Record:

-   Number of jobs submitted.
-   Number of jobs completed.
-   Time taken for all jobs to finish.
-   Average submission-to-start delay.
-   Maximum simultaneous running jobs.
-   Controller CPU and memory consumption.

Calculate:

\[ Throughput = `\frac{Completed\ Jobs}{Total\ Benchmark\ Time}`{=tex}
\]

For example, if 100 jobs finish in 200 seconds:

\[ Throughput = `\frac{100}{200}`{=tex}=0.5 \]

That is 0.5 completed jobs per second, or 30 jobs per minute.

This is a simple lab measurement, not a universal scheduler performance
benchmark. Repeat it with different job sizes, concurrency limits and
workload mixes.

### 8.4 Monitor controller performance

Install:

``` bash
dnf install -y sysstat
```

Monitor:

``` bash
pidstat -p "$(pidof slurmctld)" 5

top -p "$(pidof slurmctld)"

free -h

vmstat 5

iostat -xz 5
```

For the database:

``` bash
mysqladmin status
mysqladmin processlist
```

### Interview question: Your Slurm controller is experiencing high CPU utilization. What do you investigate?

Answer:

1.  Number of submitted jobs and scheduling frequency.
2.  Job arrays and very short-running workloads.
3.  Scheduler configuration and backfill behavior.
4.  Number of nodes and resource complexity.
5.  Accounting database response times.
6.  Controller logs and scheduling cycles.
7.  Network delays and daemon communication.
8.  Slurm version and known defects.

Do not immediately conclude that the scheduler is defective. First
isolate the problem between Slurm configuration, workload
characteristics, infrastructure and database performance.

------------------------------------------------------------------------

## 9. Master Slurm troubleshooting

The job description emphasizes the ability to diagnose sophisticated
incidents independently.

Prepare these 15 scenarios:

  \#   Incident                       Investigation
  ---- ------------------------------ -------------------------------------
  1    Node in DOWN state             `sinfo`, `scontrol show node`
  2    Node in DRAIN state            `scontrol show node`, slurmd logs
  3    Jobs stuck in PENDING          `squeue -l`, job reason
  4    slurmctld not starting         `journalctl`, controller logs
  5    slurmd not starting            systemd, daemon logs
  6    MUNGE authentication failure   `munge`, key, time sync
  7    Job launch failure             slurmd and slurmstepd logs
  8    Out of memory                  cgroup memory and job accounting
  9    Job stuck in CG state          Node health and job cleanup
  10   Database unavailable           slurmdbd and MariaDB
  11   GPU not detected               `nvidia-smi`, GRES, NVML
  12   GPU not allocated              GRES and TRES configuration
  13   Scheduler slow                 Controller load and scheduling logs
  14   Jobs failing across nodes      DNS, networking and authentication
  15   Incorrect job accounting       slurmdbd, storage configuration

### 9.1 Commands you must know

**Node diagnostics**

``` bash
sinfo -Nel

scontrol show node slurm01

scontrol update NodeName=slurm01 State=RESUME
```

Only resume a node after identifying and resolving the reason for its
DOWN or DRAIN state.

**Job diagnostics**

``` bash
squeue -l

scontrol show job <JOB_ID>

sacct -j <JOB_ID>

sstat -j <JOB_ID>
```

**Service diagnostics**

``` bash
systemctl status slurmctld
systemctl status slurmd
systemctl status slurmdbd
systemctl status munge

journalctl -u slurmctld -n 100
journalctl -u slurmd -n 100
```

**Configuration validation**

``` bash
slurmd -C

slurmd -G

scontrol show config

scontrol reconfigure
```

### 9.2 Understand Slurm job states

  State   Meaning
  ------- ---------------
  PD      Pending
  R       Running
  CG      Completing
  CD      Completed
  F       Failed
  TO      Timeout
  CA      Cancelled
  NF      Node failure
  OOM     Out of memory

### 9.3 Troubleshooting exercise: Job remains PENDING for 30 minutes

Run:

``` bash
squeue -j <JOB_ID> -o "%.18i %.2t %R"

scontrol show job <JOB_ID>

sinfo -Nel
```

Look at the job's `Reason` field.

  Pending reason           What to investigate
  ------------------------ ----------------------------------
  Resources                Available CPU, memory and GPU
  Priority                 Job priority and fair-share
  QOSMaxJobsPerUserLimit   User QoS limits
  PartitionTimeLimit       Partition time constraints
  Dependency               Parent job completion
  ReqNodeNotAvail          Node availability or reservation

Interview answer:

"I first inspect the pending reason, then compare the requested
resources with the partition's available resources. I verify node
states, scheduling policy, priority, QoS and dependencies. Once I
isolate the constraint, I validate the resolution with a controlled test
job."

------------------------------------------------------------------------

## 10. Advanced topics: What separates a Slurm administrator from a senior Slurm engineer?

  Topic                 Concepts to master
  --------------------- --------------------------------------------
  Scheduling            Backfill, priority, multifactor scheduling
  Resource management   SelectType, cons_tres, CPU and memory
  Fair-share            Shares, usage, account hierarchy
  QoS                   Limits, priority, preemption
  Reservations          Maintenance and exclusive resources
  HA                    Primary and backup slurmctld
  Accounting            slurmdbd, TRES, sacct, sreport
  Cgroups               CPU, memory and device constraints
  Networking            Controller/compute communication, DNS
  MPI                   PMIx, MPI launch and interconnect
  Containers            Pyxis, Enroot, Apptainer
  GPU                   GRES, MIG, NVML, GPU topology
  Performance           Job throughput and controller scalability
  Customization         SPANK, Lua, job-submit plugins

Especially study these three areas:

### A. Scheduling

Understand how Slurm determines which job gets resources first.

### B. Fair-share

Understand how multiple research teams share expensive CPU/GPU
resources.

### C. High Throughput Computing (HTC)

Understand the impact of submitting thousands of short-running jobs on
the scheduler and controller.

Reference: [Slurm Administrator
Documentation](https://slurm.schedmd.com/).

------------------------------------------------------------------------

## 11. Container integration -- Pyxis, Enroot and Apptainer

The NVIDIA job description explicitly mentions Pyxis, Enroot, Apptainer
and Singularity.

Understand how containers work in HPC environments.

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Pyxis                               Slurm SPANK plugin for container
                                      integration

  Enroot                              Lightweight container runtime

  Apptainer                           Container runtime designed for HPC

  Singularity                         Original container technology, now
                                      associated with Apptainer

  NVIDIA Container Toolkit            NVIDIA GPU support in OCI container
                                      environments
  -----------------------------------------------------------------------

Prepare to explain:

1.  Why HPC clusters use containers.
2.  Docker versus Enroot versus Apptainer.
3.  How Pyxis integrates with Slurm.
4.  How users submit containerized jobs.
5.  How GPU resources are exposed to containers.
6.  How shared filesystems are mounted.
7.  How container images are managed.

Example command when Pyxis is installed:

``` bash
srun \
  --partition=gpu \
  --gres=gpu:1 \
  --container-image=nvcr.io/nvidia/pytorch:<tag> \
  nvidia-smi
```

This requires a correctly configured Pyxis/Enroot installation and
access to the image registry.

------------------------------------------------------------------------

## 12. Monitoring and observability

As a senior HPC engineer, be able to explain how you monitor a
production cluster.

  Component              Monitoring responsibility
  ---------------------- -------------------------------------
  Node Exporter          CPU, memory, filesystem and network
  DCGM Exporter          NVIDIA GPU metrics
  Prometheus             Metrics collection
  Grafana                Dashboards
  Slurm exporter         Slurm cluster and job metrics
  Loki / Elasticsearch   Centralized logs

Build these dashboards:

### Dashboard 1 -- Cluster health

-   Total nodes.
-   Available nodes.
-   Allocated nodes.
-   Down/drained nodes.
-   Partition availability.

### Dashboard 2 -- Scheduler

-   Pending jobs.
-   Running jobs.
-   Completed jobs.
-   Failed jobs.
-   Job throughput.
-   Scheduler CPU and memory.

### Dashboard 3 -- GPU

-   GPU utilization.
-   GPU memory utilization.
-   GPU temperature.
-   Power consumption.
-   GPU allocation per job.
-   GPU health.

### Dashboard 4 -- Accounting

-   Jobs by user.
-   Jobs by account.
-   CPU-hours consumed.
-   GPU-hours consumed.
-   Failed jobs.
-   Resource utilization.

This is an excellent demonstration project for the interview.

------------------------------------------------------------------------

## 13. NVIDIA interview questions you must prepare

Use these 25 questions as a mock interview question bank.

1.  **Explain Slurm architecture and its components.**\
    Explain slurmctld, slurmd, slurmstepd, slurmdbd, MUNGE and their
    communication.

2.  **What happens when a user submits sbatch?**\
    Explain validation, scheduling, allocation, launch, execution and
    accounting.

3.  **Difference between sbatch, srun and salloc?**\
    Batch submission, job-step execution and interactive resource
    allocation.

4.  **What is MUNGE?**\
    Authentication, shared key, UID/GID consistency and time
    synchronization.

5.  **What is the difference between slurmctld and slurmd?**\
    Controller scheduling versus compute-node job execution.

6.  **How does Slurm schedule jobs?**\
    Priority, resources, partitions, backfill and policy.

7.  **What is backfill scheduling?**\
    Allowing smaller eligible jobs to run without delaying
    higher-priority reservations.

8.  **What is fair-share scheduling?**\
    Balancing resource consumption across users and accounts.

9.  **What are QoS and TRES?**\
    Quality of Service and Trackable Resources.

10. **How do you configure GPU scheduling?**\
    GRES, gres.conf, NVML, TRES and cgroups.

11. **How do you configure MIG?**\
    GPU autodetection, MIG device discovery and resource configuration
    for the installed release.

12. **Why is a node in DRAIN state?**\
    Identify the reason, inspect logs and node health, repair and
    resume.

13. **How do you troubleshoot a pending job?**\
    Check job reason, resources, priority, partition, dependencies and
    QoS.

14. **What is slurmdbd?**\
    Database daemon responsible for accounting communication.

15. **How do you troubleshoot accounting failures?**\
    Check slurmdbd, MariaDB, authentication, permissions and database
    connectivity.

16. **How do you troubleshoot high controller CPU?**\
    Analyze job submission rate, scheduling, controller logs, database
    and workload mix.

17. **How do you troubleshoot a node communication issue?**\
    DNS, routing, firewall, ports, time synchronization and MUNGE.

18. **What are cgroups in Slurm?**\
    Enforcement of CPU, memory and device resource constraints.

19. **How do you configure HA?**\
    Primary and backup controllers, shared configuration, state recovery
    and failover.

20. **What is SPANK?**\
    Slurm Plugin Architecture for Node and job-step customization.

21. **What are Pyxis and Enroot?**\
    HPC container integration and lightweight container execution.

22. **How do you benchmark Slurm?**\
    Job throughput, latency, scheduling cycles, controller utilization
    and accounting performance.

23. **How do you troubleshoot GPU not detected?**\
    Driver, NVML, GRES configuration, device visibility and slurmd logs.

24. **How do you support thousands of nodes?**\
    Controller scalability, scheduling configuration, database capacity,
    networking and monitoring.

25. **How do you handle a critical customer incident?**\
    Impact assessment, evidence collection, isolation, mitigation,
    validation and RCA.

------------------------------------------------------------------------

## 14. Prepare for real customer incident scenarios

NVIDIA Technical Support is not simply an installation role. Demonstrate
a structured approach to resolving customer issues.

### Scenario A: Customer reports Slurm jobs are taking too long to start

Your investigation:

1.  Capture job ID, user, partition and submission time.
2.  Inspect the pending reason.
3.  Review node availability.
4.  Check scheduler priority and fair-share.
5.  Examine backfill scheduling.
6.  Check controller load and logs.
7.  Compare the issue with previous workload patterns.
8.  Implement a measured configuration or infrastructure correction.
9.  Validate using a controlled job-submission test.
10. Document the root cause and recommendation.

### Scenario B: Customer reports NVIDIA GPUs are unavailable in Slurm

Your investigation:

1.  Check `nvidia-smi`.
2.  Verify NVIDIA driver and NVML.
3.  Inspect `slurmd` status.
4.  Validate `gres.conf`.
5.  Run `slurmd -G`.
6.  Inspect `scontrol show node`.
7.  Check GRES/TRES configuration.
8.  Validate cgroup device access.
9.  Submit a controlled GPU job.
10. Verify GPU allocation and utilization.

### Scenario C: Customer reports accounting database failures

Your investigation:

1.  Check slurmdbd service.
2.  Check MariaDB service.
3.  Validate database connectivity.
4.  Verify credentials and permissions.
5.  Inspect `slurmdbd.conf`.
6.  Review `slurmdbd` logs.
7.  Check database connections and resource consumption.
8.  Validate accounting configuration.
9.  Run `sacct` and `sacctmgr` tests.
10. Confirm that new job records are being stored.

**Important interview technique:** Explain what evidence you collect
before making a configuration change. Demonstrate systematic
problem-solving, not random trial and error.

------------------------------------------------------------------------

## 15. Your 30-day NVIDIA Slurm preparation plan

### Week 1 -- Installation (Days 1--7)

Build a working Rocky Linux cluster.

-   [ ] Linux administration and networking
-   [ ] MUNGE authentication
-   [ ] Install Slurm
-   [ ] Configure slurm.conf
-   [ ] Start controller and compute daemons
-   [ ] Submit batch and interactive jobs
-   [ ] Understand Slurm architecture

### Week 2 -- Scheduling and accounting (Days 8--14)

-   [ ] Configure MariaDB and slurmdbd
-   [ ] Configure accounts and users
-   [ ] Learn partitions and reservations
-   [ ] Configure QoS and fair-share
-   [ ] Learn job priorities
-   [ ] Practise job arrays and MPI jobs
-   [ ] Understand resource allocation

### Week 3 -- GPU and performance (Days 15--21)

-   [ ] Configure NVIDIA GPU GRES
-   [ ] Learn GPU resource binding
-   [ ] Understand MIG
-   [ ] Learn Pyxis and Enroot
-   [ ] Benchmark scheduler throughput
-   [ ] Integrate Prometheus and Grafana
-   [ ] Practise MPI and network benchmarks

### Week 4 -- Senior engineer preparation (Days 22--30)

-   [ ] Troubleshoot 15 failure scenarios
-   [ ] Understand controller HA
-   [ ] Investigate database scaling
-   [ ] Practise large-cluster architecture
-   [ ] Understand Slurm plugins and source code
-   [ ] Prepare three customer incident RCAs
-   [ ] Complete mock technical interviews

------------------------------------------------------------------------

## 16. Build a portfolio project for the interview

Recommended project:

**Enterprise HPC Cluster -- Slurm on Rocky Linux 9**

``` text
slurm-hpc-platform/
│
├── ansible/
│   ├── inventory/
│   ├── group_vars/
│   ├── roles/
│   │   ├── common/
│   │   ├── munge/
│   │   ├── slurm-controller/
│   │   ├── slurm-compute/
│   │   ├── slurmdbd/
│   │   └── monitoring/
│   └── site.yml
│
├── config/
│   ├── slurm.conf
│   ├── slurmdbd.conf.example
│   └── gres.conf
│
├── jobs/
│   ├── cpu-job.sh
│   ├── gpu-job.sh
│   ├── mpi-job.sh
│   ├── array-job.sh
│   └── benchmark-job.sh
│
├── benchmarks/
│   ├── submission-test.sh
│   ├── throughput-test.sh
│   ├── mpi-benchmark.sh
│   └── report.sh
│
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│
├── troubleshooting/
│   ├── node-down.md
│   ├── pending-jobs.md
│   ├── database-failure.md
│   ├── gpu-not-detected.md
│   └── controller-performance.md
│
└── README.md
```

The final demonstration should show:

1.  Ansible deploying the cluster.
2.  Slurm controller and compute nodes becoming healthy.
3.  Users submitting CPU and GPU jobs.
4.  Accounting information stored in MariaDB.
5.  Monitoring dashboards showing cluster utilization.
6.  Benchmark reports showing job throughput.
7.  A simulated node failure and successful recovery.
8.  A troubleshooting report explaining the root cause.

------------------------------------------------------------------------

## 17. How to present your experience to NVIDIA

Connect your Linux, HPC, PBS Pro, NVIDIA GPU infrastructure, OpenShift
and MLOps experience to the Slurm role.

PBS Pro experience is transferable, but demonstrate that you understand
Slurm-specific architecture, configuration and troubleshooting
independently.

### Example interview introduction

> I have experience in Linux system administration, HPC workload
> management, GPU infrastructure and AI platform engineering.
>
> My work has involved deploying and administering HPC environments,
> working with PBS Pro, managing Linux-based compute infrastructure, and
> deploying GPU-accelerated AI workloads using NVIDIA GPUs.
>
> I have also worked with containerized AI platforms, Kubernetes,
> OpenShift, vLLM and GPU monitoring.
>
> I am particularly interested in Slurm because it is a critical
> component of modern HPC and AI infrastructure. My preparation focuses
> on understanding Slurm architecture, controller and compute daemons,
> scheduling policies, resource management, accounting, GPU scheduling,
> container integration and production troubleshooting.
>
> I approach infrastructure problems systematically: collect evidence,
> isolate the failure domain, identify the root cause, implement a
> controlled resolution and validate the result.

------------------------------------------------------------------------

## 18. Official documentation to study

Use the primary documentation and match it to the exact Slurm release
deployed in your lab.

  ---------------------------------------------------------------------------------------------
  Resource                                                  What to study
  --------------------------------------------------------- -----------------------------------
  [Slurm Administrator                                      Installation and configuration
  Guide](https://slurm.schedmd.com/quickstart_admin.html)   

  [Slurm Documentation](https://slurm.schedmd.com/)         Administration topics

  [Slurm Accounting                                         MariaDB and slurmdbd
  Guide](https://slurm.schedmd.com/accounting.html)         

  [Slurm Authentication                                     MUNGE and authentication
  Guide](https://slurm.schedmd.com/authentication.html)     

  [Slurm FAQ](https://slurm.schedmd.com/faq.html)           Operational issues
  ---------------------------------------------------------------------------------------------

The documentation site advertises version 26.05. Do not assume all
parameters and plugin behaviors are identical in older releases.

------------------------------------------------------------------------

## 19. Recommended instructor-led training sequence

### NVIDIA Slurm Engineer Training

  -----------------------------------------------------------------------
  Module                  Subject                 Practical outcome
  ----------------------- ----------------------- -----------------------
  Module 1                Linux + HPC             Understand Linux and
                          architecture            cluster fundamentals

  Module 2                Slurm installation      Deploy controller and
                                                  compute nodes

  Module 3                Scheduling and          Configure policies,
                          accounting              accounts and database

  Module 4                GPU and containers      Configure GRES and
                                                  understand container
                                                  integration

  Module 5                Benchmarking and        Measure throughput and
                          monitoring              monitor cluster health

  Module 6                Troubleshooting and RCA Diagnose failures and
                                                  prepare incident
                                                  reports
  -----------------------------------------------------------------------

### Final assessment

Design, deploy, benchmark and troubleshoot a production-style Slurm HPC
cluster, then defend your architecture and decisions in a mock NVIDIA
technical interview.

Connect your Slurm GPU lab to your NVIDIA GPU and AI infrastructure
experience. Be ready to explain the difference between traditional HPC
batch scheduling and Kubernetes-based AI workload orchestration, and
discuss where each approach fits.

------------------------------------------------------------------------

## 20. Final preparation priorities

Start by making a working cluster rather than memorizing interview
questions.

Recommended sequence:

1.  Build the Rocky Linux 9 Slurm cluster from scratch.
2.  Automate installation and configuration with Ansible.
3.  Configure MUNGE authentication and validate cross-node
    communication.
4.  Configure Slurm scheduling and submit CPU jobs.
5.  Integrate MariaDB and slurmdbd accounting.
6.  Configure NVIDIA GPU scheduling with GRES.
7.  Integrate containers using Pyxis and Enroot or Apptainer.
8.  Benchmark scheduler throughput and job latency.
9.  Integrate Prometheus, Grafana and GPU monitoring.
10. Reproduce node, scheduler, authentication and database failures.
11. Write root-cause analysis reports.
12. Complete mock technical interviews.

**The strongest interview preparation is a working cluster that you can
install, explain, benchmark and troubleshoot confidently.**
