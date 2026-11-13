---
layout: layouts/tutorial.njk
title: "PBS Pro – HPC Workload Manager"
description: "Learn PBS architecture, installation, configuration, queues, job submission and monitoring."
category: HPC
categoryUrl: /tutorials/hpc/
tags: hpc
date: 2026-11-05
permalink: /tutorials/hpc/pbspro/
---

# PBS Professional on Rocky Linux 9 – Instructor Guide

## 1. Learning objectives

By the end of this lab, learners should be able to:

1.  Explain the PBS Server, Scheduler, Communication daemon and MoM.
2.  Describe batch and interactive job workflows.
3.  Identify queues, execution hosts, resources and job states.
4.  Submit, inspect, hold, release and delete jobs.
5.  Explain CPU, memory, walltime, GPU and MPI resource requests.
6.  Perform basic cluster validation and troubleshooting.

## 2. PBS architecture

``` mermaid
flowchart TB
  U[User / Login Node] -->|qsub, qstat, qdel| S[PBS Server: pbs_server]
  S <--> C[PBS Communication: pbs_comm]
  S <--> SCH[PBS Scheduler: pbs_sched]
  SCH -->|dispatch decision| S
  S --> M1[Compute Node 01: pbs_mom]
  S --> M2[Compute Node 02: pbs_mom]
  M1 --> J1[CPU / GPU workload]
  M2 --> J2[CPU / MPI workload]
  M1 -. metrics .-> P[Prometheus]
  M2 -. metrics .-> P
  P --> G[Grafana]
```

- **PBS Server (`pbs_server`)**: accepts submissions, stores job and
  queue state, and coordinates execution.
- **PBS Scheduler (`pbs_sched`)**: evaluates eligible jobs, resources,
  priorities and policies.
- **PBS Communication (`pbs_comm`)**: provides PBS communication
  infrastructure.
- **PBS MoM (`pbs_mom`)**: runs on execution hosts, launches and
  monitors jobs.
- **PBS commands**: `qsub`, `qstat`, `qdel`, `qmgr`, `pbsnodes`,
  `qhold`, `qrls`, `qalter`, `tracejob`.

The exact daemon layout and service management are release-dependent.
Consult the guide shipped with the installed PBS release.

## 3. Job lifecycle

``` mermaid
flowchart TD
  A[Write PBS job script] --> B[qsub submission]
  B --> C[PBS Server validates and records job]
  C --> D[Job enters queue]
  D --> E[Scheduler evaluates policy and resources]
  E -->|not eligible| D
  E -->|eligible| F[Server dispatches to execution host]
  F --> H[pbs_mom starts job]
  H --> I[Application runs]
  I --> J[MoM reports completion and usage]
  J --> K[Output and accounting available]
```

Typical states include `Q` queued, `R` running, `H` held, `W` waiting,
and `E` exiting. State display and finished-job visibility depend on PBS
version and configuration.

## 4. Lab topology

| Host         | Role                             |
|--------------|----------------------------------|
| `pbs-head`   | Server, Scheduler, Communication |
| `pbs-node01` | Execution host / MoM             |
| `pbs-node02` | Execution host / MoM             |
| `pbs-login`  | User command-line client         |

Use DNS or `/etc/hosts`, synchronized clocks, SSH, consistent user IDs,
and shared storage where workloads require common files.

## 5. Installation approach

PBS Professional is commercial software distributed by Altair. Obtain
the licensed installer and release-specific Installation & Upgrade
Guide. Confirm that the exact PBS release supports your Rocky Linux 9
minor release and architecture.

This repository’s Ansible project is an RPM-based starter framework. It
does not include binaries or license files. It assumes you place the
correct release-matched RPMs in `/opt/software/pbs/rpms` on each target
host. Some releases use a vendor installer bundle or different
package/service workflow; adjust the role to the vendor instructions
rather than guessing commands.

OpenPBS is a distinct open-source distribution. Use its own release
documentation and package/build process; do not mix its packages with
Altair PBS Professional.

### Host preparation

``` bash
sudo dnf install -y chrony openssh-server openssh-clients perl python3
sudo systemctl enable --now chronyd sshd
hostnamectl
getent hosts pbs-head pbs-node01 pbs-node02
```

Create consistent users across all nodes or integrate centralized
identity:

``` bash
sudo useradd -m hpcuser
id hpcuser
```

### PBS configuration concepts

An illustrative server `/etc/pbs.conf`:

``` ini
PBS_EXEC=/opt/pbs
PBS_HOME=/var/spool/pbs
PBS_SERVER=pbs-head
PBS_START_SERVER=1
PBS_START_SCHED=1
PBS_START_COMM=1
PBS_START_MOM=0
```

An illustrative execution-host configuration:

``` ini
PBS_EXEC=/opt/pbs
PBS_HOME=/var/spool/pbs
PBS_SERVER=pbs-head
PBS_START_SERVER=0
PBS_START_SCHED=0
PBS_START_COMM=0
PBS_START_MOM=1
```

These are role examples, not a universal configuration. Preserve
release-required settings and use the service management procedure
supplied with your installation.

## 6. Deploy with Ansible

See `README.md` for full commands. The short version:

``` bash
cd ansible
python3 -m venv .venv
source .venv/bin/activate
pip install ansible-core
ansible-galaxy collection install ansible.posix
```

Edit inventory and group variables, then:

``` bash
ansible-playbook playbooks/00-preflight.yml
ansible-playbook playbooks/10-install.yml
ansible-playbook playbooks/20-configure.yml
ansible-playbook playbooks/30-validate.yml
```

The install playbook is deliberately explicit about package media and
service assumptions. Review the playbook and vendor guide before
applying it.

## 7. First CPU job

Create `hello.pbs`:

``` bash
#!/bin/bash
#PBS -N hello-rocky
#PBS -q workq
#PBS -l select=1:ncpus=2:mem=2gb
#PBS -l walltime=00:05:00
#PBS -j oe

cd "${PBS_O_WORKDIR:-$HOME}"
echo "Hello from PBS"
echo "Job ID: ${PBS_JOBID}"
echo "Host: $(hostname)"
date
sleep 10
```

Submit and monitor:

``` bash
qsub hello.pbs
qstat
qstat -f JOBID
qstat -n
```

Output is normally staged to the submission directory unless output
paths or staging behavior are configured differently:

``` bash
ls -l
cat hello-rocky.oJOB_NUMBER
```

## 8. Interactive job

``` bash
qsub -I -q workq \
  -l select=1:ncpus=2:mem=2gb \
  -l walltime=00:30:00
```

Inside the allocated session:

``` bash
hostname
nproc
free -h
exit
```

## 9. GPU job

GPU scheduling requires more than an `ngpus` request. Administrators
must configure a resource definition/discovery method compatible with
their PBS release, report GPU resources on execution hosts, and
configure device visibility and isolation.

Example only, assuming the site exposes `ngpus`:

``` bash
#!/bin/bash
#PBS -N gpu-check
#PBS -q gpu
#PBS -l select=1:ncpus=4:mem=16gb:ngpus=1
#PBS -l walltime=00:10:00
#PBS -j oe

hostname
nvidia-smi
```

Submit:

``` bash
qsub gpu-check.pbs
```

Validate resource reporting:

``` bash
pbsnodes -av
```

Validate actual device visibility and isolation on the allocated
execution host. Do not assume resource requests alone provide isolation.

## 10. MPI / multi-node job

Example resource request:

``` bash
#PBS -l select=2:ncpus=4:mpiprocs=4
```

PBS typically provides an allocated-node file through `$PBS_NODEFILE`. A
site-tested MPI distribution and PBS integration are required. Validate
host allocation and process placement with a small MPI test before
running a real application.

## 11. Queues and administration

List queues:

``` bash
qstat -Q
qmgr -c "list queue"
```

Create a queue (administrator):

``` bash
qmgr -c "create queue gpu queue_type=Execution"
qmgr -c "set queue gpu enabled=true"
qmgr -c "set queue gpu started=true"
```

Enable scheduling:

``` bash
qmgr -c "set server scheduling=true"
```

Inspect server and nodes:

``` bash
qstat -B
qmgr -c "list server"
pbsnodes -av
```

## 12. Job control command reference

| Command           | Purpose                      |
|-------------------|------------------------------|
| `qsub script.pbs` | Submit                       |
| `qstat`           | List jobs                    |
| `qstat -u USER`   | List a user’s jobs           |
| `qstat -f JOBID`  | Detailed job                 |
| `qstat -Q`        | Queue status                 |
| `qdel JOBID`      | Delete/cancel                |
| `qhold JOBID`     | Hold                         |
| `qrls JOBID`      | Release hold                 |
| `qalter`          | Modify job attributes        |
| `pbsnodes -av`    | Node/resource status         |
| `qmgr`            | Server/queue configuration   |
| `tracejob JOBID`  | Job history, where available |

## 13. Monitoring architecture

- Node Exporter: host-level CPU, memory, disk and network metrics.
- NVIDIA DCGM Exporter: NVIDIA GPU metrics.
- Prometheus: scrape and store metrics.
- Grafana: dashboards.
- PBS exporter/accounting bridge: job/queue metrics, if a compatible
  exporter is selected and validated.

The Prometheus configuration and Grafana dashboard in this repository
are starter examples. They do not install exporters or create PBS job
metrics automatically. Add verified exporter targets and secure the
monitoring endpoints.

## 14. Troubleshooting

| Symptom                     | Initial checks                                                        |
|-----------------------------|-----------------------------------------------------------------------|
| Job stays queued            | `qstat -f JOBID`, queue limits, resource availability, scheduler logs |
| Execution node down/offline | `pbsnodes -av`, MoM service, DNS, network                             |
| Job cannot access files     | Shared filesystem mounts, UID/GID, permissions                        |
| GPU resource unavailable    | GPU resource definition, node resource reporting, GPU driver          |
| Job exits immediately       | stdout/stderr, environment modules, executable permissions            |
| Scheduler not dispatching   | server scheduling flag, scheduler logs, queue started/enabled         |

Common log locations under `PBS_HOME` include `server_logs`,
`sched_logs`, and `mom_logs`; exact paths vary by configuration.

## 15. Instructor exercises

1.  Submit a hello-world job and identify its Job ID.
2.  Submit a CPU job and inspect its resource request.
3.  Submit an interactive job and identify its execution host.
4.  Hold, release and delete jobs.
5.  Create a queue and submit a job to it.
6.  Make a job request more memory than the queue permits and explain
    the result.
7.  Inspect execution-host resources.
8.  Submit a GPU job after GPU resources are configured.
9.  Submit an MPI job after validating the MPI/PBS integration.
10. Use node and GPU metrics to correlate resource use with job
    execution.

## 16. Production readiness checklist

- [ ] Exact PBS release is supported on the selected Rocky Linux 9
  release.
- [ ] Licensed installer and license configuration are available.
- [ ] DNS, reverse DNS, time synchronization and network rules are
  validated.
- [ ] User identity and UID/GID are consistent across nodes.
- [ ] Shared storage and permissions are tested.
- [ ] Server, Scheduler, Communication and MoM services are healthy.
- [ ] Queues, limits, priorities and policies are reviewed.
- [ ] Accounting, logs, backups and retention are configured.
- [ ] GPU resources and device isolation are tested where applicable.
- [ ] MPI integration is validated with the selected MPI distribution.
- [ ] Monitoring is authenticated and access-restricted.
- [ ] HA/DR and recovery procedures are documented and tested.

## 17. Key teaching message

A user submits a **resource request**, not a command to select a
particular physical server. PBS evaluates that request against cluster
policy and available resources, schedules the job, dispatches it to an
execution host, and tracks its execution through MoM and server
accounting.
