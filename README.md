# azilehub.github.io
mywebsite

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
