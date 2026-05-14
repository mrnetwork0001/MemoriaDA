# Memoria DA - Decentralized Universal Agent Memory Protocol

**AI agents lose memory between sessions. MemoriaDA fixes this - giving any AI agent permanent, verifiable, decentralized memory using 0G Storage, Chain, and Compute.**

## Now Live on 0G Aristotle Mainnet

<img width="1896" height="876" alt="14 05 2026_08 14 12_REC" src="https://github.com/user-attachments/assets/0bd138a4-46b3-4e0b-a0ed-1558799081c8" />


> [!IMPORTANT]
> **Memoria DA is live on 0G Aristotle Mainnet** with real users, real transactions, and real protocol revenue. All operations are verifiable onchain.

### Live URLs

| App | URL | Description |
|-----|-----|-------------|
| **MemoriaDA** (Core Protocol) | [memoriada.xyz](https://memoriada.xyz) | Landing page, dashboard, Global Explorer, docs, blog |
| **SolTutor** (Built by MemoriaDA team) | [soltutor.memoriada.xyz](https://soltutor.memoriada.xyz) | AI Solidity tutor - proves the infra works as a shared memory layer |
| **AlphaJournal** (Integration Partner) | [alphajournal.online](https://alphajournal.online) | AI trading diary - independent app using MemoriaDA protocol |
| **0G Token Faucet** | [faucet.memoriada.xyz](https://faucet.memoriada.xyz) | Gasless mainnet faucet for testers |
| **Blog & Testing Guide** | [memoriada.xyz/blog](https://memoriada.xyz/blog) | Architecture deep-dives, integration guide, tester instructions |

### Demo Video

> **[Watch the demo →](TODO_ADD_DEMO_VIDEO_LINK)** (3 min walkthrough showing the full pipeline end-to-end)

> **[Watch the pitch →](TODO_ADD_DEMO_VIDEO_LINK)** (3 min walkthrough showing the full pipeline end-to-end)

### 0G Stack Components Used

- **0G Storage** - Memory vector blobs stored as Merkle-verified data
- **0G Chain** - Agent Identity NFTs (ERC-721) + memory root anchoring via smart contract
- **0G Compute** - Sealed TEE inference (Qwen 2.5 7B) for AI responses

---

## What It Does

Memoria DA is a full-stack decentralized memory protocol for AI agents. It solves the problem of **AI amnesia** - agents losing context between sessions because memory is centralized, unverifiable, and siloed.

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

| 0G Component   | How It's Used                                                                                              | Code Reference                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **0G Storage** | Direct blob upload/download via `@0gfoundation/0g-ts-sdk`. Memory vectors serialized as JSON Merkle blobs. | [`storageService.js`](./src/services/storageService.js)      |
| **0G Chain**   | `MemoriaRegistryV2.sol` - ERC-721 Agent Identity NFTs, micropayment fees, onchain memory verification.    | [`MemoriaRegistryV2.sol`](./contracts/MemoriaRegistryV2.sol) |
| **0G Compute** | Backend broker via `@0glabs/0g-serving-broker` for TEE-verified sealed inference. Qwen 2.5 7B model.       | [`computeService.js`](./server/computeService.js)            |

### Deployed Contracts

| Network                    | Contract Address                             | Explorer                                                                                               |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **0G Mainnet (Aristotle)** | `0xD896D59583C137D6ca2c5e3add025e143eD1030d` | [View on Explorer](https://chainscan.0g.ai/address/0xD896D59583C137D6ca2c5e3add025e143eD1030d)         |
| **0G Testnet (Galileo)**   | `0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3` | [View on Explorer](https://chainscan-galileo.0g.ai/address/0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3) |

### Live Traction (0G Mainnet)

| Metric | Value | Proof |
|--------|-------|-------|
| **Onchain Transactions** | 23+ | [View on ChainScan](https://chainscan.0g.ai/address/0xD896D59583C137D6ca2c5e3add025e143eD1030d) |
| **Registered Agents** | 3 (mainnet) | Each minted as ERC-721 NFT |
| **Memory Anchors Committed** | 19+ `updateMemoryRoot` calls | Verifiable onchain |
| **Protocol Revenue** | 0.019 0G collected | Contract balance on ChainScan |
| **External Integration Partners** | 2 (AlphaJournal, SolTutor) | Both live on custom domains |
| **Live Deployed Apps** | 4 (Protocol + SolTutor + AlphaJournal + Faucet) | All on custom domains |
| **Automated Test Coverage** | 19 tests across 5 categories | `npm test` |
| **Private Testers Onboarded** | Active testing phase in progress | Feedback form live |

> **All traction is verifiable onchain** at [chainscan.0g.ai/address/0xD896D...](https://chainscan.0g.ai/address/0xD896D59583C137D6ca2c5e3add025e143eD1030d). Every number above can be independently confirmed - no fabricated claims.

---

## Ecosystem - Built by the Team + Integration Partners

MemoriaDA is not just a standalone app - it's **infrastructure**. To prove this, **the MemoriaDA team built SolTutor as a second full application** that runs entirely on the MemoriaDA protocol. If the infrastructure wasn't real, SolTutor couldn't exist.

| App | Agent ID | Built By | Live URL | Description |
|-----|----------|----------|----------|-------------|
| **MemoriaDA Agent** | `agent_0xClaw_7f3a` | MemoriaDA Team | [memoriada.xyz/app](https://memoriada.xyz/app) | Flagship demo - full RAG pipeline with Data Terminal and onchain verification |
| **SolTutor** | `soltutor_agent_v1` | MemoriaDA Team | [soltutor.memoriada.xyz](https://soltutor.memoriada.xyz) | AI Solidity tutor - built by the team to demonstrate the infra works as a shared memory layer |
| **AlphaJournal** | `alpha_journal_agent_v1` | Integration Partner | [alphajournal.online](https://alphajournal.online) | AI trading diary - independent app using MemoriaDA as its persistence layer |

> **All 3 agents are visible on the [Global Explorer](https://memoriada.xyz/app)** - each with their own NFT ID, vector count, fee history, and Merkle root. This proves MemoriaDA works as a shared infrastructure layer, not just a single demo.

### Developer Integration (3 API Calls)

```javascript
// 1. Store memory on 0G Storage
const { rootHash } = await uploadMemoryBlob(JSON.stringify(memoryPayload));

// 2. Register agent onchain (mints ERC-721 NFT — one time only)
await registry.registerAgent("my_agent_id", "MyFramework");

// 3. Anchor memory root onchain
await registry.updateMemoryRoot("my_agent_id", rootHash, vectorCount, {
  value: ethers.parseEther("0.001"), // micropayment fee
});
```

### OpenClaw Skill (Native Agent Integration)

MemoriaDA ships an official **OpenClaw Skill** (`skills/memoria-da/SKILL.md`). Any OpenClaw agent that loads this skill gets persistent, decentralized memory automatically.

```
~/.openclaw/workspace/skills/
└── memoria-da/
    └── SKILL.md   ← Drop this file into any OpenClaw agent
```

The skill teaches the agent to:

- **Store memories** via `POST /api/storage/upload`
- **Anchor roots onchain** via `POST /api/registry/anchor`
- **Snapshot state** via `POST /api/state/snapshot`
- **Query the global network** via `GET /api/memory/global`

### Server API Endpoints

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| `POST` | `/api/storage/upload`  | Upload memory blob to 0G Storage  |
| `POST` | `/api/registry/anchor` | Anchor Merkle root on 0G Chain    |
| `POST` | `/api/state/snapshot`  | Save full agent state snapshot    |
| `GET`  | `/api/memory/global`   | Query all agents on the registry  |
| `POST` | `/api/compute/chat`    | AI inference via 0G Compute       |
| `POST` | `/api/compute/embed`   | Generate deterministic embeddings |

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
- **0G tokens** - Testnet: [faucet.0g.ai](https://faucet.0g.ai) | Mainnet: real 0G tokens required

### Step 1: Clone & Install

```bash
git clone https://github.com/mrnetwork0001/MemoriaDA.git
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
npm run dev      # Frontend (Vite) - http://localhost:5173
npm run server   # Backend (0G Compute) - http://localhost:3001
```

### Step 4: Test the App

1. Open the app in your browser
2. Click **"ENTER_SYSTEM\_\_❯"** on the landing page to go to the dashboard
3. Click **"Connect Wallet"** — MetaMask will prompt to add 0G network
4. Type a message in the agent chat
5. Watch the Data Terminal for live logs:
   - `QUERY` → your message
   - `VECTOR` → embedding generated
   - `UPLOAD` → storing on 0G Storage
   - `MERKLE` → root hash computed
   - `CONFIRM` → blob committed
   - `CHAIN` → root anchored onchain

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
│   ├── MemoriaRegistry.sol       # V1 - Simple Agent → Root mapping
│   └── MemoriaRegistryV2.sol     # V2 - ERC-721 NFTs + Micropayments + Verification
├── scripts/
│   ├── deploy.js                 # Deploy to Galileo testnet
│   └── deploy-mainnet.js         # Deploy to 0G Mainnet
├── server/
│   ├── index.js                  # Express backend (0G Compute bridge)
│   ├── computeService.js         # 0G Compute Broker + TEE verification
│   └── storageUpload.js          # Server-side 0G Storage (bypasses CORS)
├── src/
│   ├── components/
│   │   ├── AgentChat.jsx         # AI chat with full RAG pipeline
│   │   ├── DataTerminal.jsx      # Real-time log/memory HUD
│   │   ├── DeveloperSDK.jsx      # Integration docs + partner showcase
│   │   ├── MemoryExplorer.jsx    # Global Registry browser
│   │   ├── MerkleVerifier.jsx    # onchain verification + proof export
│   │   ├── Header.jsx            # Navigation + live block stats
│   │   ├── WalletConnector.jsx   # MetaMask connect/disconnect
│   │   └── NetworkSwitcher.jsx   # Testnet ↔ Mainnet toggle
│   ├── config/
│   │   ├── constants.js          # ABI, dimensions, upload config
│   │   └── network.js            # Multi-network config (testnet + mainnet)
│   ├── hooks/
│   │   ├── useWallet.js          # Reactive wallet state
│   │   ├── useStorage.js         # 0G Storage operations
│   │   ├── useRegistry.js        # onchain registry operations
│   │   └── useNetwork.js         # Network selection state
│   ├── services/
│   │   ├── storageService.js     # 0G SDK upload/download
│   │   ├── registryService.js    # Smart contract interactions
│   │   ├── walletService.js      # MetaMask service layer
│   │   ├── computeClient.js      # Frontend → backend bridge
│   │   └── memoryStore.js        # Local cosine-similarity search
│   └── pages/
│       ├── Landing.jsx           # Marketing landing page + live stats
│       └── Dashboard.jsx         # Main app dashboard
├── hardhat.config.js             # Solidity compiler + networks
├── vite.config.js                # Vite + polyfills config
└── vercel.json                   # SPA deployment config
```

---

## Tech Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| Frontend       | React 19, Vite 8, React Router 7                  |
| Styling        | Vanilla CSS (Cyberpunk design system)             |
| Smart Contract | Solidity 0.8.20, Hardhat 3                        |
| Storage        | 0G Storage SDK (`@0gfoundation/0g-ts-sdk`)        |
| Compute        | 0G Compute Broker (`@0glabs/0g-serving-broker`)   |
| AI Model       | Qwen 2.5 7B (sealed TEE inference via 0G Compute) |
| Wallet         | MetaMask (ethers.js v6)                           |
| Embeddings     | 1536-dim deterministic hash vectors               |

---

## Key Features

- **Decentralized Memory Storage** - Every agent conversation stored as a Merkle-verified blob on 0G Storage
- **onchain Audit Trail** - Root hashes anchored to 0G Chain via `MemoriaRegistryV2` smart contract
- **Agent Identity NFTs (ERC-721)** - Every registered agent receives a unique, fully onchain SVG identity NFT
- **Micropayment Economy** - Each memory write charges a 0.001 0G fee, creating a self-sustaining protocol revenue model
- **Cryptographic Verifier** - onchain verification tool to prove agent memory has not been tampered with
- **Memory Proof Export** - Download portable `.json` proof files containing Merkle roots, chain data, and verification status
- **Semantic Memory Retrieval** - Cosine-similarity search across stored embeddings for context-aware AI
- **Sealed AI Inference** - TEE-verified chat completions via 0G Compute Network
- **Multi-Network Support** - Seamless switching between 0G Testnet and Mainnet
- **Global Memory Explorer** - Etherscan-style registry browser showing all agents, NFTs, roots, and fees
- **Integration Partners** - Alpha Journal & SolTutor live on MemoriaDA infrastructure, proving it works as a shared protocol
- **Developer SDK** - Real integration examples with "Developer Pays" (zero wallet friction) model
- **OpenClaw Skill** - Official SKILL.md that gives any OpenClaw agent persistent memory with zero code changes
- **Agent State Snapshotting** - Save full agent state (goals, topics, mood) to 0G Storage + anchor onchain
- **Cross-Agent Memory Queries** - Any agent can discover and query other agents on the Global Registry, enabling orchestration

---

## Business Model & Vision

### The Problem

AI agents today suffer from **amnesia**. Every restart wipes their context. Memory is locked inside centralized providers (OpenAI, Anthropic) - it's not portable, not verifiable, and not owned by the user. As autonomous agents become the backbone of Web3, this is a critical infrastructure gap.

### The Solution

Memoria DA is a **universal memory standard** that gives any AI agent permanent, verifiable, decentralized memory - regardless of the framework it runs on.

### Business Model Canvas

| Dimension             | Memoria DA                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Target Users**      | AI agent developers (OpenClaw, ElizaOS, AutoGPT), enterprises running autonomous agent fleets                                                   |
| **Pain Point**        | Agents lose context between sessions; memory is centralized, unverifiable, not user-owned                                                       |
| **Value Proposition** | "Give any AI agent permanent, verifiable, decentralized memory with 3 API calls"                                                                |
| **Revenue Model**     | **Micropayments** - every `updateMemoryRoot()` charges 0.001 0G. At scale: 1M agents × 100 writes/day = 100,000 0G/day in protocol revenue      |
| **Distribution**      | npm SDK (`@memoria/sdk`), framework plugin marketplaces, developer documentation                                                                |
| **Retention / Moat**  | Once an agent's lifetime memory is anchored onchain, switching protocols means losing all historical context - **strong data gravity lock-in** |
| **Key Partners**      | 0G (infrastructure provider), OpenClaw, ElizaOS, AutoGPT (framework integrations)                                                               |
| **Network Effects**   | More agents using the registry → more valuable the shared memory graph becomes                                                                  |

### Protocol Roadmap

```
Phase 1 (Hackathon):  Architect the protocol and prove feasibility on 0G Testnet ✅
Phase 2 (Partners):   Build SolTutor + onboard AlphaJournal as integration partner ✅
Phase 3 (Mainnet):    Transition to 0G Aristotle Mainnet with live registry anchoring ✅
Phase 4 (Faucet):     Deploy gasless 0G token faucet for tester onboarding ✅
Phase 5 (SDK):        Release @memoria/sdk for standalone framework developers 🔄
Phase 6 (Expansion):  Enable cross-agent memory discovery and decentralized governance 🚀
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
