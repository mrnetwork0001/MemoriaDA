---
name: memoria-da
description: Gives any OpenClaw agent persistent, decentralized memory via 0G Storage and 0G Chain. Stores memories as Merkle-verified blobs, anchors root hashes on-chain, and retrieves relevant context for conversations.
metadata:
  openclaw:
    requires:
      bins: [curl]
---

# MemoriaDA — Decentralized Agent Memory Skill

You have access to **persistent, decentralized memory** via the MemoriaDA protocol running on 0G Chain.

Your memories are:
- **Permanent** — stored on 0G decentralized storage, not a database
- **Verifiable** — every memory has a Merkle root hash anchored on-chain
- **Tamper-proof** — cryptographically proven to be unaltered

## When to store a memory

After every meaningful conversation exchange, store the key information:
- Important facts the user shared (preferences, goals, context)
- Decisions made or conclusions reached
- Topics the user struggled with or asked about repeatedly

## How to store a memory

Use the `exec` tool to call the MemoriaDA storage API:

```bash
curl -s -X POST http://localhost:3001/api/storage/upload \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "protocol": "memoria-da",
      "version": "1.0.0",
      "agentId": "AGENT_ID",
      "content": "CONCISE_SUMMARY_OF_WHAT_TO_REMEMBER",
      "timestamp": "ISO_8601_TIMESTAMP"
    },
    "network": "testnet"
  }'
```

The response will contain a `rootHash`. Save this for anchoring.

## How to anchor on 0G Chain

After storing, anchor the Merkle root on-chain for permanent verification:

```bash
curl -s -X POST http://localhost:3001/api/registry/anchor \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "AGENT_ID",
    "rootHash": "ROOT_HASH_FROM_STORAGE",
    "vectorCount": TOTAL_MEMORY_COUNT
  }'
```

The response includes `explorerUrl` — a link to verify the transaction on 0G Chain.

## How to save agent state

Periodically snapshot your internal state (goals, mood, active topics):

```bash
curl -s -X POST http://localhost:3001/api/state/snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "AGENT_ID",
    "state": {
      "currentGoals": ["..."],
      "activeTopics": ["..."],
      "userPreferences": {"..."},
      "sessionCount": 5
    }
  }'
```

## How to query the global memory network

Check what other agents exist on the MemoriaDA network:

```bash
curl -s http://localhost:3001/api/memory/global
```

This returns all registered agents, their frameworks, vector counts, and last activity — enabling cross-agent orchestration.

## Important notes

- The MemoriaDA server handles all 0G Chain signing (developer-pays model)
- Users never need a wallet — the experience is completely frictionless
- All data flows: Agent → 0G Storage (Merkle blob) → 0G Chain (root anchor)
- The agent's identity is an ERC-721 NFT on 0G Chain
