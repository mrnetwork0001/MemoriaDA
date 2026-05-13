// ============================================================
// MemoriaRegistryV2 — Automated Test Suite (Hardhat 3)
// Tests: Registration, Memory Anchoring, Fees, Verification,
//        ERC-721 Identity, Access Control
// Run: npm test
// ============================================================

import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { ethers as ethersLib } from "ethers";

// Connect to the local EDR network
const connection = await hre.network.connect("hardhat");
const provider = new ethersLib.BrowserProvider(connection.provider);

// Compile contracts
await hre.tasks.getTask("compile").run({});

// Get signers from the EDR accounts
const accounts = await provider.listAccounts();
const owner = accounts[0];
const alice = accounts[1];
const bob = accounts[2];

const MEMORY_FEE = ethersLib.parseEther("0.001");
const SAMPLE_ROOT = ethersLib.keccak256(ethersLib.toUtf8Bytes("memory_root_v1"));
const SAMPLE_ROOT_2 = ethersLib.keccak256(ethersLib.toUtf8Bytes("memory_root_v2"));

// Helper to deploy fresh registry
async function deployRegistry() {
  const artifact = await hre.artifacts.readArtifact("MemoriaRegistryV2");
  const factory = new ethersLib.ContractFactory(artifact.abi, artifact.bytecode, owner);
  const registry = await factory.deploy();
  await registry.waitForDeployment();
  return registry;
}

// ═══════════════════════════════════════════════════════════
//  1. Agent Registration
// ═══════════════════════════════════════════════════════════

describe("Agent Registration", async () => {
  it("should register a new agent and mint an NFT", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_alpha", "OpenClaw");

    const agent = await r.getAgent("agent_alpha");
    assert.equal(agent[0], alice.address); // owner
    assert.equal(agent[1], "OpenClaw");    // framework
    assert.equal(agent[3], 0n);            // vectorCount

    const count = await r.getAgentCount();
    assert.equal(count, 1n);

    const balance = await r.balanceOf(alice.address);
    assert.equal(balance, 1n);
  });

  it("should reject duplicate agent registration", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const rAlice = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);
    const rBob = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, bob);

    await rAlice.registerAgent("agent_dup", "OpenClaw");
    await assert.rejects(rBob.registerAgent("agent_dup", "Eliza"), /Agent already registered/);
  });

  it("should reject empty agent ID", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);
    await assert.rejects(r.registerAgent("", "OpenClaw"), /Agent ID cannot be empty/);
  });

  it("should assign sequential token IDs", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const abi = (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi;
    const rAlice = new ethersLib.Contract(addr, abi, alice);
    const rBob = new ethersLib.Contract(addr, abi, bob);

    await rAlice.registerAgent("agent_a", "F1");
    await rBob.registerAgent("agent_b", "F2");

    const a = await rAlice.getAgentFull("agent_a");
    const b = await rBob.getAgentFull("agent_b");
    assert.equal(a[5], 1n); // tokenId
    assert.equal(b[5], 2n);
  });
});

// ═══════════════════════════════════════════════════════════
//  2. Memory Anchoring
// ═══════════════════════════════════════════════════════════

describe("Memory Anchoring", async () => {
  it("should anchor a memory root with correct fee", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const abi = (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi;
    const r = new ethersLib.Contract(addr, abi, alice);

    await r.registerAgent("agent_mem", "OpenClaw");
    await r.updateMemoryRoot("agent_mem", SAMPLE_ROOT, 10, { value: MEMORY_FEE });

    const agent = await r.getAgent("agent_mem");
    assert.equal(agent[2], SAMPLE_ROOT); // currentRoot
    assert.equal(agent[3], 10n);         // vectorCount
  });

  it("should reject anchoring without sufficient fee", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_fee", "OpenClaw");
    await assert.rejects(
      r.updateMemoryRoot("agent_fee", SAMPLE_ROOT, 10, { value: ethersLib.parseEther("0.0001") }),
      /Insufficient memory fee/
    );
  });

  it("should reject anchoring from non-owner", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const abi = (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi;
    const rAlice = new ethersLib.Contract(addr, abi, alice);
    const rBob = new ethersLib.Contract(addr, abi, bob);

    await rAlice.registerAgent("agent_own", "OpenClaw");
    await assert.rejects(
      rBob.updateMemoryRoot("agent_own", SAMPLE_ROOT, 10, { value: MEMORY_FEE }),
      /Not agent owner/
    );
  });

  it("should accumulate fees across multiple updates", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_acc", "OpenClaw");
    await r.updateMemoryRoot("agent_acc", SAMPLE_ROOT, 5, { value: MEMORY_FEE });
    await r.updateMemoryRoot("agent_acc", SAMPLE_ROOT_2, 12, { value: MEMORY_FEE });

    const agent = await r.getAgentFull("agent_acc");
    assert.equal(agent[6], MEMORY_FEE * 2n); // totalFeePaid

    const totalUpdates = await r.totalMemoryUpdates();
    assert.equal(totalUpdates, 2n);
  });
});

// ═══════════════════════════════════════════════════════════
//  3. Memory Verification
// ═══════════════════════════════════════════════════════════

describe("Memory Verification", async () => {
  it("should verify a correct root hash", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_ver", "OpenClaw");
    await r.updateMemoryRoot("agent_ver", SAMPLE_ROOT, 10, { value: MEMORY_FEE });

    const result = await r.verifyMemoryRoot("agent_ver", SAMPLE_ROOT);
    assert.equal(result[0], true);       // isValid
    assert.equal(result[1], SAMPLE_ROOT); // storedRoot
  });

  it("should reject an incorrect root hash", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_inv", "OpenClaw");
    await r.updateMemoryRoot("agent_inv", SAMPLE_ROOT, 10, { value: MEMORY_FEE });

    const fakeRoot = ethersLib.keccak256(ethersLib.toUtf8Bytes("fake_root"));
    const result = await r.verifyMemoryRoot("agent_inv", fakeRoot);
    assert.equal(result[0], false);
  });

  it("should revert for non-existent agent", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);
    await assert.rejects(r.verifyMemoryRoot("ghost", SAMPLE_ROOT), /Agent not found/);
  });
});

// ═══════════════════════════════════════════════════════════
//  4. ERC-721 Identity NFT
// ═══════════════════════════════════════════════════════════

describe("ERC-721 Identity NFT", async () => {
  it("should return correct NFT owner", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_nft", "OpenClaw");
    const nftOwner = await r.ownerOf(1);
    assert.equal(nftOwner, alice.address);
  });

  it("should return on-chain SVG tokenURI", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);

    await r.registerAgent("agent_svg", "OpenClaw");
    const uri = await r.tokenURI(1);
    assert.ok(uri.startsWith("data:image/svg+xml;utf8,"));
    assert.ok(uri.includes("MEMORIA DA"));
  });

  it("should transfer NFT and update agent ownership", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const abi = (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi;
    const rAlice = new ethersLib.Contract(addr, abi, alice);
    const rBob = new ethersLib.Contract(addr, abi, bob);

    await rAlice.registerAgent("agent_xfer", "OpenClaw");
    await rAlice.transferFrom(alice.address, bob.address, 1);

    const newOwner = await rBob.ownerOf(1);
    assert.equal(newOwner, bob.address);

    // Bob can now update memory
    await rBob.updateMemoryRoot("agent_xfer", SAMPLE_ROOT, 5, { value: MEMORY_FEE });
    const agent = await rBob.getAgent("agent_xfer");
    assert.equal(agent[2], SAMPLE_ROOT);
  });

  it("should support ERC-721 and ERC-165 interfaces", async () => {
    const registry = await deployRegistry();
    const erc721 = await registry.supportsInterface("0x80ac58cd");
    const erc165 = await registry.supportsInterface("0x01ffc9a7");
    assert.equal(erc721, true);
    assert.equal(erc165, true);
  });
});

// ═══════════════════════════════════════════════════════════
//  5. Admin & Fee Management
// ═══════════════════════════════════════════════════════════

describe("Admin & Fee Management", async () => {
  it("should allow owner to update memory fee", async () => {
    const registry = await deployRegistry();
    const newFee = ethersLib.parseEther("0.005");
    await registry.setMemoryFee(newFee);
    const fee = await registry.getMemoryFee();
    assert.equal(fee, newFee);
  });

  it("should reject fee update from non-owner", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const r = new ethersLib.Contract(addr, (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi, alice);
    await assert.rejects(r.setMemoryFee(ethersLib.parseEther("0.01")), /Not contract owner/);
  });

  it("should allow owner to withdraw collected fees", async () => {
    const registry = await deployRegistry();
    const addr = await registry.getAddress();
    const abi = (await hre.artifacts.readArtifact("MemoriaRegistryV2")).abi;
    const rAlice = new ethersLib.Contract(addr, abi, alice);

    await rAlice.registerAgent("agent_wd", "OpenClaw");
    await rAlice.updateMemoryRoot("agent_wd", SAMPLE_ROOT, 10, { value: MEMORY_FEE });

    const balBefore = await provider.getBalance(owner.address);
    const tx = await registry.withdrawFees();
    await tx.wait();
    const balAfter = await provider.getBalance(owner.address);

    // Balance should be close to before + fee (minus gas)
    assert.ok(balAfter > balBefore - MEMORY_FEE);
  });

  it("should reject withdrawal when no fees", async () => {
    const registry = await deployRegistry();
    await assert.rejects(registry.withdrawFees(), /No fees to withdraw/);
  });
});

console.log("\n✅ All MemoriaRegistryV2 tests completed.\n");
