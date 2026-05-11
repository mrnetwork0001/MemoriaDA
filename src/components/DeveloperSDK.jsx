import { IconBolt, IconGlobe, IconBox, IconAgent, IconChain } from './TerminalIcons';
import './DeveloperSDK.css';

function DeveloperSDK() {
  const quickStartCode = `// 1. Install
npm install @0gfoundation/0g-ts-sdk ethers

// 2. Store a memory on 0G Storage
import { Blob as ZgBlob, Indexer } from "@0gfoundation/0g-ts-sdk";
import { ethers } from "ethers";

const memory = { agentId: "my_agent", content: "User likes Solidity", embedding: [...] };
const blob = new ZgBlob(new Blob([JSON.stringify(memory)]));
const [tree] = await blob.merkleTree();
const rootHash = tree.rootHash();

const indexer = new Indexer("https://indexer-storage-testnet-turbo.0g.ai");
await indexer.upload(blob, "https://evmrpc-testnet.0g.ai", signer, {});

// 3. Anchor on 0G Chain via MemoriaDA Registry
const registry = new ethers.Contract(REGISTRY_ADDRESS, ABI, signer);
await registry.updateMemoryRoot("my_agent", rootHash, vectorCount, {
  value: ethers.parseEther("0.001") // micropayment fee
});`;

  const serverSideCode = `// server/memoria.js — Zero wallet friction for end users
import { uploadMemoryBlob } from "./storageUpload.js";
import { anchorMemoryRoot } from "./registryAnchor.js";

export async function storeAndAnchor(content, agentId) {
  // 1. Upload to 0G Storage (server-side, no CORS issues)
  const { rootHash } = await uploadMemoryBlob(JSON.stringify({
    protocol: "memoria-da",
    agentId,
    content,
    timestamp: new Date().toISOString(),
  }));

  // 2. Anchor onchain (developer's wallet pays the 0.001 0G fee)
  const { explorerUrl } = await anchorMemoryRoot(agentId, rootHash, count);
  return { rootHash, explorerUrl };
}`;

  const registryABI = `// MemoriaRegistryV2 — Key Functions
const MEMORIA_REGISTRY_ABI = [
  // Register agent (mints ERC-721 NFT)
  "function registerAgent(string agentId, string framework) external",

  // Anchor memory root (requires 0.001 0G fee)
  "function updateMemoryRoot(string agentId, bytes32 rootHash, uint256 vectorCount) external payable",

  // Verify memory integrity
  "function verifyMemoryRoot(string agentId, bytes32 rootHash) external view returns (bool isValid, bytes32 storedRoot, uint256 lastUpdated)",

  // Read agent state
  "function getAgent(string agentId) external view returns (address owner, string framework, bytes32 root, uint256 vectors, uint256 updated)",
];

// Contract: 0x85d31A4a95035708972Ffbe1Be6f1c31a350b7f3
// Network:  0G Galileo Testnet (Chain ID: 16602)`;

  const partners = [
    {
      name: 'Alpha Journal',
      framework: 'AlphaJournal',
      desc: 'AI-powered decentralized trading diary. Stores market theses and trading decisions with verifiable memory.',
      agentId: 'alpha_journal_agent_v1',
    },
    {
      name: 'SolTutor',
      framework: 'SolidityTutor',
      desc: 'AI Solidity tutor that remembers your learning progress across sessions. Picks up exactly where you left off.',
      agentId: 'soltutor_agent_v1',
    },
  ];

  return (
    <div className="developer-sdk">
      <div className="sdk-header">
        <h2 className="heading-font">DEVELOPER SDK</h2>
        <p className="sdk-subtitle terminal-font">Give any AI agent permanent, decentralized memory in minutes</p>
      </div>

      <div className="sdk-content">
        {/* Quick Start */}
        <div className="sdk-section">
          <h3><IconBolt size={13} className="icon-accent" style={{marginRight:6}}/> Quick Start — 3 Steps</h3>
          <p>Store a memory vector on 0G Storage and anchor its Merkle root on 0G Chain. That's it.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">javascript</span>
              <span className="code-file">quickstart.js</span>
            </div>
            <pre className="code-block">
              <code>{quickStartCode}</code>
            </pre>
          </div>
        </div>

        {/* Server-Side (Developer Pays) */}
        <div className="sdk-section">
          <h3><IconBox size={13} className="icon-accent" style={{marginRight:6}}/> Server-Side Integration (Zero Wallet UX)</h3>
          <p>Use the "Developer Pays" model to give your users a seamless Web2 experience — no MetaMask, no wallet popups. The developer's server wallet handles all blockchain operations.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">javascript</span>
              <span className="code-file">server/memoria.js</span>
            </div>
            <pre className="code-block">
              <code>{serverSideCode}</code>
            </pre>
          </div>
        </div>

        {/* Contract ABI */}
        <div className="sdk-section">
          <h3><IconChain size={13} className="icon-accent" style={{marginRight:6}}/> MemoriaRegistryV2 — Contract ABI</h3>
          <p>The onchain registry that stores agent identities as ERC-721 NFTs and anchors memory Merkle roots with micropayment fees.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">solidity</span>
              <span className="code-file">MemoriaRegistryV2.sol</span>
            </div>
            <pre className="code-block">
              <code>{registryABI}</code>
            </pre>
          </div>
        </div>

        {/* Live Integration Partners */}
        <div className="sdk-section">
          <h3><IconAgent size={13} className="icon-accent" style={{marginRight:6}}/> Live Integration Partners</h3>
          <p>These apps are live on MemoriaDA infrastructure right now — visible on the Global Explorer.</p>
          <div className="partners-grid">
            {partners.map(p => (
              <div key={p.agentId} className="partner-card">
                <div className="partner-name heading-font">{p.name}</div>
                <div className="partner-framework terminal-font">{p.framework}</div>
                <p className="partner-desc">{p.desc}</p>
                <div className="partner-agent mono">Agent: {p.agentId}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="sdk-section">
          <h3><IconAgent size={13} className="icon-accent" style={{marginRight:6}}/> OpenClaw Skill (Native Integration)</h3>
          <p>MemoriaDA ships an official OpenClaw Skill. Drop the SKILL.md into your workspace and any OpenClaw agent gets persistent, verifiable memory automatically.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">markdown</span>
              <span className="code-file">skills/memoria-da/SKILL.md</span>
            </div>
            <pre className="code-block">
              <code>{`---
name: memoria-da
description: Persistent decentralized memory via 0G
---

# MemoriaDA Skill

## Store a memory
Use exec to call: POST /api/storage/upload
  → payload: { agentId, content, timestamp }

## Anchor onchain
POST /api/registry/anchor
  → { agentId, rootHash, vectorCount }

## Save agent state
POST /api/state/snapshot
  → { agentId, state: { goals, topics, ... } }

## Query global network
GET /api/memory/global
  → Returns all agents on the registry`}</code>
            </pre>
          </div>
        </div>

        <div className="sdk-section">
          <h3><IconGlobe size={13} className="icon-accent" style={{marginRight:6}}/> Cross-Agent Memory Query</h3>
          <p>Any agent on the MemoriaDA network can discover and query other agents — enabling a decentralized "Global Brain" for orchestration.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">javascript</span>
              <span className="code-file">crossAgentQuery.js</span>
            </div>
            <pre className="code-block">
              <code>{`// Query the MemoriaDA Global Registry
const res = await fetch("https://api.memoriada.xyz/api/memory/global");
const { agents, totalAgents } = await res.json();

console.log(\`\${totalAgents} agents on the network:\`);
agents.forEach(a => {
  console.log(\`  \${a.id} (\${a.framework}) — \${a.vectorCount} memories\`);
});

// Output:
// 3 agents on the network:
//   agent_0xClaw_7f3a (OpenClaw) — 24 memories
//   alpha_journal_agent_v1 (AlphaJournal) — 12 memories
//   soltutor_agent_v1 (SolidityTutor) — 8 memories`}</code>
            </pre>
          </div>
        </div>

        <div className="sdk-cta">
          <p>View the full source code and integration guides on <a href="https://github.com/mrnetwork0001/MemoriaDA" target="_blank" rel="noopener noreferrer" className="text-gradient-cyan">GitHub</a></p>
          <div className="npm-install mono">
            <span className="prompt">$</span> npm install @0gfoundation/0g-ts-sdk ethers
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperSDK;
