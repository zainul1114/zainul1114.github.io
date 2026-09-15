# azilehub.github.io
mywebsite


At the top, users interact with AI applications such as Chat, RAG, agents and enterprise APIs. These applications communicate through a secured AI gateway that provides TLS, authentication, authorization, rate limiting, WAF and load balancing. The gateway routes requests to workloads running on OpenShift.

OpenShift manages the vLLM deployment, networking, storage, secrets, security and scaling. Kubernetes schedules the vLLM pod onto a GPU-capable worker node. Inside the pod, vLLM handles tokenization, request scheduling, continuous batching, prefill, KV-cache management, PagedAttention and decoding.

The actual tensor computation is executed on NVIDIA GPUs such as H100, H200, A100 or L40S. The NVIDIA GPU Operator manages the Kubernetes GPU software stack, including drivers, Container Toolkit, GPU Device Plugin and GPU monitoring components.

In parallel, the MLOps lifecycle manages data, training or fine-tuning, experiment tracking, evaluation, model registry and model artifacts. CI/CD and GitOps then promote the approved model into the OpenShift environment and deploy it through vLLM.

Finally, observability monitors the application, Kubernetes, vLLM and GPU layers using metrics, logs and traces. Production operations use those signals for capacity planning, scaling, performance tuning, incident response, security, upgrades, rollback and disaster recovery.”

The key sentence to remember

User → Application → Gateway → OpenShift → vLLM → GPU → Response

while the supporting lifecycle is:

Data → MLOps → Model Registry → CI/CD/GitOps → vLLM

and the operational loop is:

Monitor → Analyze → Scale/Tune/Fix → Validate → Production.


MLOps Project Structure:


                enterprise-ai-platform/
                │
                ├── app/
                │   ├── main.py
                │   ├── rag.py
                │   ├── embeddings.py
                │   └── requirements.txt
                │
                ├── docker/
                │   └── Dockerfile
                │
                ├── k8s/
                │   ├── namespace.yaml
                │   ├── secrets.yaml
                │   ├── qdrant/
                │   │   ├── pvc.yaml
                │   │   ├── deployment.yaml
                │   │   └── service.yaml
                │   │
                │   ├── vllm/
                │   │   ├── deployment.yaml
                │   │   └── service.yaml
                │   │
                │   ├── rag-api/
                │   │   ├── deployment.yaml
                │   │   ├── service.yaml
                │   │   └── hpa.yaml
                │   │
                │   └── ingress.yaml
                │
                ├── monitoring/
                │   ├── servicemonitor.yaml
                │   └── dashboards/
                │
                ├── mlops/
                │   ├── mlflow.yaml
                │   └── minio.yaml
                │
                ├── argocd/
                │   └── application.yaml
                │
                └── .gitlab-ci.yml


MLOps Workflow:


                  MLOps
                    │
                    ▼
                 Dataset
                    │
                    ▼
              Data Processing
                    │
                    ▼
             Fine-tuning/Training
                    │
                    ▼
             Experiment Tracking
                    │
                    ▼
                  MLflow
                    │
                    ▼
              Model Evaluation
                    │
             ┌──────┴──────┐
             │             │
          FAIL            PASS
             │             │
             ▼             ▼
         Retrain       Model Registry
                            │
                            ▼
                       MinIO Artifact
                            │
                            ▼
                         CI/CD
                            │
                            ▼
                        GitOps
                            │
                            ▼
                       Kubernetes
                            │
                            ▼
                          vLLM



I would build an enterprise RAG platform on Kubernetes. Users access a Chat or enterprise application through a secured API Gateway providing TLS, authentication, authorization and rate limiting. The request reaches a FastAPI-based RAG service, which generates an embedding for the query, searches Qdrant for relevant document chunks, and constructs an augmented prompt.

The prompt is sent to a vLLM deployment running on a GPU-enabled Kubernetes worker. Kubernetes schedules the Pod based on the nvidia.com/gpu resource, while the NVIDIA GPU Operator manages the GPU drivers, container toolkit, device plugin and GPU monitoring stack. vLLM handles tokenization, scheduling, continuous batching, KV-cache management, PagedAttention, prefill and decode, with the actual model computation executed on the NVIDIA GPU.

For the MLOps lifecycle, I use Git, MLflow, MinIO, CI/CD and GitOps. Models and artifacts are tracked through MLflow and stored in object storage, while approved versions are promoted through CI/CD and deployed to Kubernetes using Argo CD.

For production operations, I monitor Kubernetes, the RAG application, Qdrant, vLLM and GPU infrastructure using Prometheus, Grafana and DCGM, with centralized logging and tracing. Autoscaling, alerting, capacity planning, security, rollback and disaster recovery complete the production lifecycle.


Tools at each stage:

| Layer       | Tool                 | description   |
| ----------- | -------------------- | --------------------------- |
| Code        | Git                  | Version control             |
| Build       | Docker               | Containerization            |
| Registry    | Harbor               | Image management            |
| Cluster     | Kubernetes/OpenShift | Orchestration               |
| GPU         | NVIDIA GPU Operator  | GPU lifecycle               |
| LLM         | Qwen3                | Generative model            |
| Serving     | vLLM                 | High-performance inference  |
| Embedding   | BGE-M3               | Semantic representation     |
| Vector DB   | Qdrant               | Similarity search           |
| RAG         | FastAPI              | Application orchestration   |
| Storage     | MinIO                | Object/model storage        |
| MLOps       | MLflow               | Experiments/model lifecycle |
| CI          | GitLab CI            | Automated testing/build     |
| CD          | Argo CD              | GitOps deployment           |
| Network     | Ingress/Route        | External access             |
| Security    | RBAC/Secrets         | Access control              |
| Scaling     | HPA/KEDA             | Autoscaling                 |
| Metrics     | Prometheus           | Metrics collection          |
| Dashboard   | Grafana              | Visualization               |
| GPU metrics | DCGM                 | GPU monitoring              |
| Logs        | Loki                 | Centralized logs            |
| Tracing     | OpenTelemetry        | Request tracing             |





The Complete runtime request:

          USER
           │
           ▼
          Chat UI
           │
           ▼
          Ingress / AI Gateway
           │
           ▼
          RAG API
           │
           ├───────────────┐
           │               │
           ▼               ▼
          BGE-M3          Question
           │
           ▼
          Embedding
           │
           ▼
          Qdrant
           │
           ▼
          Top-K Documents
           │
           └───────────────┐
                           │
                           ▼
                        Prompt
                           │
                           ▼
                          vLLM
                           │
                           ▼
                       vLLM Scheduler
                           │
                           ▼
                    Continuous Batching
                           │
                           ▼
                         Prefill
                           │
                           ▼
                       KV Cache
                           │
                           ▼
                    PagedAttention
                           │
                           ▼
                        NVIDIA GPU
                           │
                           ▼
                         Decode
                           │
                           ▼
                        Response
                           │
                           ▼
                       RAG API
                           │
                           ▼
                        User
                          

```mermaid

%%{init: {'theme':'base', 'themeVariables': { 'primaryColor': '#f4f4f4', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#ffffff'}}}%%
graph LR
    %% STAGE 1: USER
    subgraph Stage1 ["1. USER"]
        direction TB
        Users["👤 USERS"]
        EU(["End Users"])
        DS(["Data Scientists"])
        MLE(["ML Engineers"])
        Devs(["Developers"])
        Admins(["Administrators"])
        
        Users --- EU & DS & MLE & Devs & Admins
    end

    %% STAGE 2: APP
    subgraph Stage2 ["2. APP"]
        direction TB
        subgraph AIApps ["AI Applications"]
            direction TB
            ChatUI(["Chat UI"])
            RAG(["RAG"])
            Agents(["Agents"])
            EntAPIs(["Enterprise APIs"])
        end
        
        AIGateway["API / AI Gateway <br/> • Ingress / Route • TLS <br/> • AuthN/AuthZ • Rate Limiting <br/> • Load Balancing • WAF"]

        ChatUI & RAG & Agents & EntAPIs --> AIGateway
    end

    %% STAGE 3: MLOPS
    subgraph Stage3 ["3. MLOPS"]
        direction TB
        Data(["Data"])
        Training(["Training / Fine-tuning"])
        ExpTrack(["Experiment Tracking"])
        MLflow(["MLflow"])
        Eval(["Model Evaluation"])
        Registry(["Model Registry"])
        MinIO(["Model Artifacts / MinIO"])
        CICD(["CI/CD"])
        GitOps(["GitOps / Helm"])

        Data --> Training
        Training --> ExpTrack
        ExpTrack --> MLflow
        MLflow --> Eval
        Eval --> Registry
        Registry --> MinIO
        MinIO --> CICD
        CICD --> GitOps
    end

    %% STAGE 4: WORKLOAD K8S GPU
    subgraph Stage4 ["4. WORKLOAD K8S GPU"]
        direction TB
        subgraph K8s ["Kubernetes Workload"]
            direction TB
            Ingress(["Service / Route / Ingress"])
            
            subgraph vLLMPod ["vLLM Pod"]
                direction TB
                APIServer["API Server"] --> Tokenizer["Tokenizer"]
                Tokenizer --> Scheduler["vLLM Scheduler"]
                Scheduler --> CB["Continuous Batching"]
                CB --> PA["PagedAttention"]
                PA --> KVCache["KV Cache"]
                KVCache --> Prefill["Prefill"]
                Prefill --> Decode["Decode"]
                Decode --> Exec["Model Execution"]
            end
            
            HPA(["HPA / KEDA / Autoscaling"])
            Configs(["ConfigMaps / Secrets / PVC"])
        end

        subgraph GPUStack ["GPU Infrastructure"]
            direction TB
            GPUOp["NVIDIA GPU Operator <br/> Driver / Toolkit / DCGM"]
            Hardware["NVIDIA GPUs <br/> H100 • H200 • A100 • L40S"]
            GPUOp --> Hardware
        end
        
        K8s --> GPUStack
    end

    %% CROSS-STAGE WORKFLOW CONNECTIONS
    Stage1 == "Interacts with" ==> Stage2
    Stage2 == "Triggers / Feeds Data" ==> Stage3
    Stage3 == "Deploys Models to" ==> Stage4
    AIGateway -. "Direct API Inference Calls" .-> Ingress

    %% STYLING
    style Stage1 fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Stage2 fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Stage3 fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
    style Stage4 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style vLLMPod fill:#ffffff,stroke:#333,stroke-width:1px
    style GPUStack fill:#fff3e0,stroke:#ef6c00,stroke-width:1px

'''
