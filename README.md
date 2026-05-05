# Memoria DA — Decentralized Universal Agent Memory Protocol

<p align="center">
  <img src="./MemoriaDA_Banner.png" alt="Memoria DA Banner" width="100%" />
</p>

> **One-Sentence Description (≤30 words):**  
> Memoria DA stores AI agent memories as vector embeddings on 0G Storage, anchors Merkle roots on 0G Chain, and runs inference through 0G Compute's sealed TEE.

---

## What It Does

Memoria DA is a full-stack decentralized memory protocol for AI agents. It solves the problem of **AI amnesia** — agents losing context between sessions because memory is centralized, unverifiable, and siloed.

**How it works:**
1. User chats with an AI agent → conversation is embedded as a 1536-dim vector
2. The vector blob is uploaded to **0G Storage** with Merkle-tree verification
3. The root hash is anchored on **0G Chain** via the `MemoriaRegistry` smart contract
4. On future queries, the agent retrieves relevant memories via cosine-similarity search
5. AI inference runs through **0G Compute** with sealed TEE verification (Qwen 2.5 7B)

**Problem solved:** Agents get permanent, verifiable, decentralized memory that survives across sessions, frameworks, and ecosystems.

**0G Components used:** 0G Storage, 0G Chain, 0G Compute (all three core components integrated).

---

## 0G Integration Proof

| 0G Component | How It's Used | Code Reference |
|---|---|---|
| **0G Storage** | Direct blob upload/download via `@0gfoundation/0g-ts-sdk`. Memory vectors serialized as JSON Merkle blobs. | [`storageService.js`](./src/services/storageService.js) |
| **0G Chain** | `MemoriaRegistryV2.sol` — ERC-721 Agent Identity NFTs, micropayment fees, on-chain memory verification. | [`MemoriaRegistryV2.sol`](./contracts/MemoriaRegistryV2.sol) |
| **0G Compute** | Backend broker via `@0glabs/0g-serving-broker` for TEE-verified sealed inference. Qwen 2.5 7B model. | [`computeService.js`](./server/computeService.js) |

### Deployed Contracts

| Network | Contract Address | Explorer |
|---|---|---|
| **0G Testnet (Galileo)** | `0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3` | [View on Explorer](https://chainscan-galileo.0g.ai/address/0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3) |
| **0G Mainnet** | *(deploy with `npm run deploy:mainnet`)* | *(pending deployment)* |

> **Note:** Update this section with the mainnet contract address after running `npm run deploy:mainnet`.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 19 + Vite 8)             │
│                                                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │  Agent Chat   │  │ Data Terminal │  │ Wallet + Network │   │
│  │  (LLM + RAG) │  │ (Live HUD)    │  │ (MetaMask)       │   │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘   │
│         │                  │                    │             │
│  ┌──────▼──────────────────▼────────────────────▼──────────┐  │
│  │              Service Layer (Hooks + Services)            │  │
│  │  useWallet · useStorage · useRegistry · useNetwork       │  │
│  └──────┬──────────┬────────────────┬──────────────────────┘  │
└─────────┼──────────┼────────────────┼────────────────────────┘
          │          │                │
   ┌──────▼────┐  ┌──▼─────────┐  ┌──▼───────────┐
   │ 0G Compute │  │ 0G Storage │  │  0G Chain    │
   │ (Sealed    │  │ (Merkle    │  │ (Registry    │
   │  Inference)│  │  Blobs)    │  │  Contract)   │
   │            │  │            │  │              │
   │ TEE-verified│ │ @0g-ts-sdk │  │ Solidity     │
   │ Qwen 2.5 7B│ │ Upload/DL  │  │ 0.8.20       │
   └────────────┘  └────────────┘  └──────────────┘
```

### Data Flow

```
User Message
    │
    ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Embed as   │────▶│  Search Local │────▶│  Build RAG   │
│  1536-dim   │     │  Memory Index │     │  Context     │
│  Vector     │     │  (cosine sim) │     │  Prompt      │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                                                ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Anchor on  │◀────│  Upload to   │◀────│  0G Compute  │
│  0G Chain   │     │  0G Storage  │     │  Inference   │
│  (Registry) │     │  (Merkle)    │     │  (Sealed)    │
└─────────────┘     └──────────────┘     └──────────────┘
```

---

## Local Deployment / Reproduction Steps

### Prerequisites

- **Node.js** 18+ and npm
- **MetaMask** browser extension
- **0G tokens** — Testnet: [faucet.0g.ai](https://faucet.0g.ai) | Mainnet: real 0G tokens required

### Step 1: Clone & Install

```bash
git clone https://github.com/your-username/memoria-app.git
cd memoria-app
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your wallet private key:

```env
VITE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# 0G Compute Backend
ZG_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ZG_NETWORK=testnet
ZG_CHAT_PROVIDER=0xa48f01287233509FD694a22Bf840225062E67836
ZG_CHAT_MODEL=qwen/qwen-2.5-7b-instruct
PORT=3001
```

### Step 3: Run the Application

```bash
# Run frontend + backend together
npm run dev:all

# Or run separately:
npm run dev      # Frontend (Vite) — http://localhost:5173
npm run server   # Backend (0G Compute) — http://localhost:3001
```

### Step 4: Test the App

1. Open the app in your browser
2. Click **"ENTER_SYSTEM__❯"** on the landing page to go to the dashboard
3. Click **"Connect Wallet"** — MetaMask will prompt to add 0G network
4. Type a message in the agent chat
5. Watch the Data Terminal for live logs:
   - `QUERY` → your message
   - `VECTOR` → embedding generated
   - `UPLOAD` → storing on 0G Storage
   - `MERKLE` → root hash computed
   - `CONFIRM` → blob committed
   - `CHAIN` → root anchored on-chain

### Step 5: Smart Contract Deployment

```bash
# Compile
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet (requires real 0G tokens)
npm run deploy:mainnet
```

After mainnet deployment, update `src/config/network.js` → `mainnet.registryAddress` with the new address.

### Test Account Notes

- Use the 0G Galileo testnet faucet at [faucet.0g.ai](https://faucet.0g.ai) for free test tokens
- The app works in **demo mode** without a wallet (local memory only, no 0G Storage)
- With wallet connected, all operations go through 0G Storage and 0G Chain
- 0G Compute requires the backend server to be running (`npm run server`)

---

## Project Structure

```
memoria-app/
├── contracts/
│   ├── MemoriaRegistry.sol       # V1 — Simple Agent → Root mapping
│   └── MemoriaRegistryV2.sol     # V2 — ERC-721 NFTs + Micropayments + Verification
├── scripts/
│   ├── deploy.js                 # Deploy to Galileo testnet
│   └── deploy-mainnet.js         # Deploy to 0G Mainnet
├── server/
│   ├── index.js                  # Express backend (0G Compute bridge)
│   └── computeService.js         # 0G Compute Broker + TEE verification
├── src/
│   ├── components/
│   │   ├── AgentChat.jsx         # AI chat with full RAG pipeline
│   │   ├── DataTerminal.jsx      # Real-time log/memory HUD
│   │   ├── Header.jsx            # Navigation + live block stats
│   │   ├── WalletConnector.jsx   # MetaMask connect/disconnect
│   │   ├── NetworkSwitcher.jsx   # Testnet ↔ Mainnet toggle
│   │   ├── LandingHero.jsx       # Animated hero section
│   │   ├── LandingFeatures.jsx   # Feature grid
│   │   └── LandingArchitecture.jsx # Architecture diagram
│   ├── config/
│   │   ├── constants.js          # ABI, dimensions, upload config
│   │   └── network.js            # Multi-network config (testnet + mainnet)
│   ├── hooks/
│   │   ├── useWallet.js          # Reactive wallet state
│   │   ├── useStorage.js         # 0G Storage operations
│   │   ├── useRegistry.js        # On-chain registry operations
│   │   └── useNetwork.js         # Network selection state
│   ├── services/
│   │   ├── storageService.js     # 0G SDK upload/download
│   │   ├── registryService.js    # Smart contract interactions
│   │   ├── walletService.js      # MetaMask service layer
│   │   ├── computeClient.js      # Frontend → backend bridge
│   │   └── memoryStore.js        # Local cosine-similarity search
│   └── pages/
│       ├── Landing.jsx           # Marketing landing page
│       └── Dashboard.jsx         # Main app dashboard
├── hardhat.config.js             # Solidity compiler + networks
├── vite.config.js                # Vite + polyfills config
└── vercel.json                   # SPA deployment config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Vanilla CSS (Cyberpunk design system) |
| Smart Contract | Solidity 0.8.20, Hardhat 3 |
| Storage | 0G Storage SDK (`@0gfoundation/0g-ts-sdk`) |
| Compute | 0G Compute Broker (`@0glabs/0g-serving-broker`) |
| AI Model | Qwen 2.5 7B (sealed TEE inference via 0G Compute) |
| Wallet | MetaMask (ethers.js v6) |
| Embeddings | 1536-dim deterministic hash vectors |

---

## Key Features

- **🧠 Decentralized Memory Storage** — Every agent conversation stored as a Merkle-verified blob on 0G Storage
- **⛓️ On-Chain Audit Trail** — Root hashes anchored to 0G Chain via `MemoriaRegistryV2` smart contract
- **🎨 Agent Identity NFTs (ERC-721)** — Every registered agent receives a unique, fully on-chain SVG identity NFT
- **💰 Micropayment Economy** — Each memory write charges a 0.001 0G fee, creating a self-sustaining protocol revenue model
- **🔐 Cryptographic Verifier** — On-chain verification tool to prove agent memory has not been tampered with
- **🔍 Semantic Memory Retrieval** — Cosine-similarity search across stored embeddings for context-aware AI
- **🔒 Sealed AI Inference** — TEE-verified chat completions via 0G Compute Network
- **🌐 Multi-Network Support** — Seamless switching between 0G Testnet and Mainnet
- **📊 Global Memory Explorer** — Etherscan-style registry browser showing all agents, NFTs, roots, and fees
- **🔌 Developer SDK Vision** — Framework-agnostic integration for OpenClaw, ElizaOS, AutoGPT, and beyond

---

## 💼 Business Model & Vision

### The Problem

AI agents today suffer from **amnesia**. Every restart wipes their context. Memory is locked inside centralized providers (OpenAI, Anthropic) — it's not portable, not verifiable, and not owned by the user. As autonomous agents become the backbone of Web3, this is a critical infrastructure gap.

### The Solution

Memoria DA is a **universal memory standard** that gives any AI agent permanent, verifiable, decentralized memory — regardless of the framework it runs on.

### Business Model Canvas

| Dimension | Memoria DA |
|---|---|
| **Target Users** | AI agent developers (OpenClaw, ElizaOS, AutoGPT), enterprises running autonomous agent fleets |
| **Pain Point** | Agents lose context between sessions; memory is centralized, unverifiable, not user-owned |
| **Value Proposition** | "Give any AI agent permanent, verifiable, decentralized memory with 3 lines of code" |
| **Revenue Model** | **Micropayments** — every `updateMemoryRoot()` charges 0.001 0G. At scale: 1M agents × 100 writes/day = 100,000 0G/day in protocol revenue |
| **Distribution** | npm SDK (`@memoria/sdk`), framework plugin marketplaces, developer documentation |
| **Retention / Moat** | Once an agent's lifetime memory is anchored on-chain, switching protocols means losing all historical context — **strong data gravity lock-in** |
| **Key Partners** | 0G (infrastructure provider), OpenClaw, ElizaOS, AutoGPT (framework integrations) |
| **Network Effects** | More agents using the registry → more valuable the shared memory graph becomes |

### Revenue Projections

```
Phase 1 (Hackathon):  Prove the technology works on 0G Testnet + Mainnet ✅
Phase 2 (SDK):        Publish @memoria/sdk on npm, onboard 100 agent developers
Phase 3 (Growth):     1,000+ registered agents, each writing ~50 memories/day
                      → 50,000 micropayments/day × 0.001 0G = 50 0G/day protocol revenue
Phase 4 (Scale):      1M+ agents, enterprise partnerships, premium tiers
                      → Self-sustaining protocol economy with governance token
```

### Why 0G?

Memoria DA **could not exist** without 0G's modular infrastructure:

- **0G Storage** provides the high-throughput DA layer needed to store millions of memory vectors at low cost
- **0G Chain** provides the settlement layer for anchoring tamper-proof Merkle roots
- **0G Compute** provides sealed TEE inference, ensuring agent responses are cryptographically verifiable
- No other L1/L2 offers all three components in a single, composable stack

---

## 📜 License

MIT License — © 2026 MRNETWORK

