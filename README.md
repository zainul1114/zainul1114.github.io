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
