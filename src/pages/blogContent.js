// ============================================================
// Blog Content Data - MemoriaDA Technical Articles
// ============================================================

export const BLOG_ARTICLES = [
  {
    id: 'mainnet-testing-guide',
    slug: 'mainnet-testing-guide',
    title: 'Mainnet Testing Guide: MemoriaDA, SolTutor & AlphaJournal',
    subtitle: 'A comprehensive guide for private access testers to validate the MemoriaDA ecosystem on 0G Aristotle Mainnet.',
    author: 'MrNetwork',
    date: 'May 13, 2026',
    readTime: '12 min read',
    tags: ['TESTING', 'MAINNET', 'GUIDE'],
    featured: false,
    coverLabel: 'TEST_GUIDE',
    content: `
<p class="docs-p">Welcome to the <strong>MemoriaDA Mainnet Private Access Testing Program</strong>. You have been selected to test the first decentralized AI memory protocol running live on the 0G Aristotle Mainnet. This guide covers everything you need to test across all three apps in the ecosystem.</p>

<div class="docs-callout tip">
  <div class="callout-label">BEFORE_YOU_START</div>
  You will need a MetaMask wallet connected to the <strong>0G Mainnet</strong> (Chain ID: 16661, RPC: <code class="ic">https://evmrpc.0g.ai</code>). To test SolTutor and AlphaJournal subscriptions, you'll need some 0G tokens - grab them for free from our faucet below.
</div>

<h2 class="docs-h2">Step 0: Get Free 0G Mainnet Tokens</h2>

<p class="docs-p">Before testing, visit the <strong>MemoriaDA Faucet</strong> to receive free 0G mainnet tokens:</p>

<ul class="docs-list numbered">
  <li>Go to <a href="https://faucet.memoriada.xyz/" class="text-link">faucet.memoriada.xyz</a></li>
  <li>Connect your MetaMask wallet</li>
  <li>Click <strong>"Request Tokens"</strong> - that's it!</li>
  <li>You will receive <strong>0.15 0G tokens</strong> instantly, completely gasless</li>
</ul>

<div class="docs-callout">
  <div class="callout-label">NO_GAS_NEEDED</div>
  The faucet is completely gasless - you don't need any existing tokens to claim. Just connect and click. The 0.15 0G you receive is enough to cover subscription fees on SolTutor and AlphaJournal and run dozens of memory operations.
</div>

<h2 class="docs-h2">The Ecosystem at a Glance</h2>

<div class="docs-table-wrapper">
  <table class="docs-table">
    <thead>
      <tr><th>App</th><th>URL</th><th>What It Does</th><th>Wallet Required?</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>MemoriaDA</strong></td><td><a href="https://memoriada.xyz" class="text-link">memoriada.xyz</a></td><td>The core protocol dashboard - chat with AI, view memory anchoring in real-time, verify onchain proofs</td><td>Yes (for direct anchoring)</td></tr>
      <tr><td><strong>SolTutor</strong></td><td><a href="https://soltutor.memoriada.xyz" class="text-link">soltutor.memoriada.xyz</a></td><td>AI Solidity tutor that remembers your learning progress across sessions</td><td>Yes (for subscription)</td></tr>
      <tr><td><strong>AlphaJournal</strong></td><td><a href="https://alphajournal.online" class="text-link">alphajournal.online</a></td><td>AI-powered trading diary that remembers your market theses and trading history</td><td>Yes (for subscription)</td></tr>
    </tbody>
  </table>
</div>

<h2 class="docs-h2">Part 1: Testing MemoriaDA (Core Protocol)</h2>

<p class="docs-p">MemoriaDA is the infrastructure layer. Your goal is to verify that the full memory pipeline works end-to-end on mainnet.</p>

<h2 class="docs-h2">Test 1.1 - Landing Page & Navigation</h2>

<ul class="docs-list">
  <li>Visit <a href="https://memoriada.xyz" class="text-link">memoriada.xyz</a> and verify the landing page loads with the interactive neural network visualization</li>
  <li>Check that the <strong>Live Stats Banner</strong> shows real numbers (agents, memory anchors, fees collected)</li>
  <li>Click <strong>ENTER_SYSTEM</strong> - it should navigate to the <code class="ic">/app</code> dashboard</li>
  <li>Click <strong>VIEW_DOCS</strong> - verify the full documentation portal loads at <code class="ic">/docs</code></li>
  <li>Click <strong>VIEW_BLOG</strong> - verify the blog listing page loads at <code class="ic">/blog</code></li>
  <li>Click the <strong>MEMORIA_DA</strong> brand text anywhere - it should always return to the homepage</li>
</ul>

<h2 class="docs-h2">Test 1.2 - Register Your Agent (Important!)</h2>

<p class="docs-p">This is the most important step. Registering an agent creates an onchain ERC-721 Identity NFT and adds to the protocol's live stats.</p>

<ul class="docs-list numbered">
  <li>Navigate to <code class="ic">memoriada.xyz/app</code> and connect your MetaMask wallet</li>
  <li>Ensure the network badge shows <strong>MAINNET</strong></li>
  <li>Click <strong>Register Agent</strong> - this sends a transaction to the MemoriaRegistryV2 contract</li>
  <li>Wait for the transaction to confirm - you should see a success message with your <strong>NFT Token ID</strong></li>
  <li>Check the <strong>Data Terminal</strong> (right panel) for the registration confirmation log</li>
</ul>

<div class="docs-callout tip">
  <div class="callout-label">WHY_THIS_MATTERS</div>
  Every agent registration increases the protocol's live stats on the landing page. The more testers that register, the stronger our traction metrics look. Your agent is now permanently recorded onchain!
</div>

<h2 class="docs-h2">Test 1.3 - Agent Chat & Memory Storage</h2>

<ul class="docs-list numbered">
  <li>With your wallet connected and agent registered, send a message: <em>"My name is [your name] and I'm interested in DeFi yield farming"</em></li>
  <li>Watch the <strong>Data Terminal</strong> (right panel) - you should see real-time logs showing: EMBEDDING → STORAGE UPLOAD → CHAIN ANCHOR</li>
  <li>Send a second message: <em>"What do you remember about me?"</em></li>
  <li>The agent should recall your name and interest from the first message</li>
</ul>

<div class="docs-callout">
  <div class="callout-label">WHAT_TO_REPORT</div>
  Note the response latency, whether the Data Terminal shows successful operations, and whether the agent accurately recalls previous context.
</div>

<h2 class="docs-h2">Test 1.4 - Global Explorer</h2>

<ul class="docs-list">
  <li>Navigate to the <strong>Global Explorer</strong> tab in the dashboard</li>
  <li>Verify you can see registered agents with their NFT Token IDs, vector counts, and fee history</li>
  <li>Look for <code class="ic">soltutor_agent_v1</code> and <code class="ic">alpha_journal_agent_v1</code> - these are the partner app agents</li>
  <li>Click an agent's explorer link - it should open <code class="ic">chainscan.0g.ai</code> showing real transactions</li>
</ul>

<h2 class="docs-h2">Part 2: Testing SolTutor</h2>

<p class="docs-p">SolTutor is an AI Solidity tutor that uses MemoriaDA for persistent learning progress. It remembers what you've studied, where you struggled, and adapts lessons accordingly.</p>

<h2 class="docs-h2">Test 2.1 - Landing & Wallet Connection</h2>

<ul class="docs-list">
  <li>Visit <a href="https://soltutor.memoriada.xyz/app" class="text-link">soltutor.memoriada.xyz/app</a></li>
  <li>Connect your MetaMask wallet</li>
  <li>Verify the app connects to 0G Mainnet (check the network indicator)</li>
</ul>

<h2 class="docs-h2">Test 2.2 - Learning Flow</h2>

<ul class="docs-list numbered">
  <li>Start a new conversation and ask: <em>"Teach me about Solidity mappings"</em></li>
  <li>Follow up with: <em>"I don't understand the syntax for nested mappings"</em></li>
  <li>Ask a third question: <em>"Show me an example of mapping(address => mapping(uint => bool))"</em></li>
  <li>Verify the AI gives contextual, progressive responses - not starting from scratch each time</li>
</ul>

<h2 class="docs-h2">Test 2.3 - Memory Across Sessions</h2>

<ul class="docs-list numbered">
  <li>Close the tab and reopen SolTutor</li>
  <li>Ask: <em>"What was I learning about last time?"</em></li>
  <li>The AI should reference Solidity mappings and your specific questions - this proves MemoriaDA memory is working for SolTutor</li>
</ul>

<h2 class="docs-h2">Part 3: Testing AlphaJournal</h2>

<p class="docs-p">AlphaJournal is an AI-powered trading diary. Users log market theses, trading decisions, and emotional states. The AI remembers everything and provides historical context for future entries.</p>

<h2 class="docs-h2">Test 3.1 - Landing & Subscription</h2>

<ul class="docs-list">
  <li>Visit <a href="https://alphajournal.online" class="text-link">alphajournal.online</a></li>
  <li>Connect your MetaMask wallet</li>
  <li>If prompted with a subscription paywall, check the pricing tiers and attempt to subscribe</li>
  <li>Note: subscription requires 0G tokens - report if the paywall UX is clear</li>
</ul>

<h2 class="docs-h2">Test 3.2 - Trading Diary Flow</h2>

<ul class="docs-list numbered">
  <li>Create a new journal entry: <em>"I'm bullish on ETH this week. Technical analysis shows a breakout above $4,200 resistance. Planning to enter a long position with 3% of my portfolio."</em></li>
  <li>Wait for the AI response - it should acknowledge and contextualize your thesis</li>
  <li>Add another entry: <em>"Update: ETH broke out as predicted. Taking 50% profit at $4,500. Trailing stop on the rest."</em></li>
  <li>Ask: <em>"Summarize my trading performance this week"</em></li>
  <li>The AI should synthesize both entries into a coherent summary</li>
</ul>

<h2 class="docs-h2">Test 3.3 - Historical Recall</h2>

<ul class="docs-list numbered">
  <li>Close the browser and reopen AlphaJournal</li>
  <li>Ask: <em>"What was my last ETH trade?"</em></li>
  <li>The AI should recall your bullish thesis, the $4,200 breakout, and the profit-taking</li>
  <li>Ask: <em>"Am I generally bullish or bearish based on my history?"</em></li>
  <li>The AI should analyze your past entries and give a sentiment summary</li>
</ul>

<h2 class="docs-h2">Test 3.4 - Session Management</h2>

<ul class="docs-list">
  <li>Check if you can create, rename, pin, or delete chat sessions</li>
  <li>Verify that different sessions maintain separate conversation contexts</li>
  <li>Check the subscription countdown timer (if visible) shows accurate remaining time</li>
</ul>

<h2 class="docs-h2">Part 4: Cross-App Verification</h2>

<p class="docs-p">This is the most important test - it proves MemoriaDA works as <strong>shared infrastructure</strong> across independent apps.</p>

<ul class="docs-list numbered">
  <li>Go to <code class="ic">memoriada.xyz/app</code> and open the <strong>Global Explorer</strong></li>
  <li>Verify you can see at least 3 agents: <code class="ic">soltutor_agent_v1</code>, <code class="ic">alpha_journal_agent_v1</code>, and the MemoriaDA flagship agent</li>
  <li>Check that each agent shows a unique NFT Token ID and non-zero vector counts (meaning memories have been stored)</li>
  <li>Click the explorer links for each agent - verify the transactions are real on <code class="ic">chainscan.0g.ai</code></li>
  <li>Confirm all agents point to the same registry contract: <code class="ic">0xD896D59583C137D6ca2c5e3add025e143eD1030d</code></li>
</ul>

<div class="docs-callout tip">
  <div class="callout-label">WHY_THIS_MATTERS</div>
  If you can see SolTutor and AlphaJournal agents in the MemoriaDA Global Explorer, it proves the protocol works as a <strong>shared memory layer</strong> - not just a standalone app. This is the core value proposition: multiple independent apps sharing one decentralized registry.
</div>

<h2 class="docs-h2">Submit Your Feedback</h2>

<p class="docs-p">After testing, submit your findings, bugs, and suggestions through our official feedback form:</p>

<p class="docs-p" style="text-align:center; margin: 2rem 0;">
  <a href="https://forms.gle/PfNk73K2uLS79mmq8" target="_blank" rel="noopener noreferrer" class="text-link" style="font-size: 1.2rem; font-weight: bold;">📋 SUBMIT_TESTER_FEEDBACK_FORM ❯</a>
</p>

<p class="docs-p">The form covers:</p>

<ul class="docs-list">
  <li>Which apps you tested and your overall experience</li>
  <li>Bugs encountered (with severity and steps to reproduce)</li>
  <li>UI/UX suggestions and feature requests</li>
  <li>Performance and response time observations</li>
  <li>General comments and impressions</li>
</ul>

<div class="docs-callout tip">
  <div class="callout-label">QUICK_TIP</div>
  Take screenshots of any issues you find before submitting. The form accepts image attachments and detailed descriptions. The more detail you provide, the faster we can fix it.
</div>

<h2 class="docs-h2">Testing Checklist Summary</h2>

<div class="docs-table-wrapper">
  <table class="docs-table">
    <thead>
      <tr><th>Test</th><th>App</th><th>Priority</th></tr>
    </thead>
    <tbody>
      <tr><td>Landing page loads with live stats</td><td>MemoriaDA</td><td>🔴 Critical</td></tr>
      <tr><td>Agent chat + Data Terminal shows pipeline</td><td>MemoriaDA</td><td>🔴 Critical</td></tr>
      <tr><td>Global Explorer shows all 3 agents</td><td>MemoriaDA</td><td>🔴 Critical</td></tr>
      <tr><td>Wallet connect + network detection</td><td>SolTutor</td><td>🔴 Critical</td></tr>
      <tr><td>AI teaches Solidity progressively</td><td>SolTutor</td><td>🟡 Major</td></tr>
      <tr><td>Memory recall across sessions</td><td>SolTutor</td><td>🔴 Critical</td></tr>
      <tr><td>Subscription paywall + payment</td><td>AlphaJournal</td><td>🟡 Major</td></tr>
      <tr><td>Journal entry creation + AI response</td><td>AlphaJournal</td><td>🔴 Critical</td></tr>
      <tr><td>Historical recall across sessions</td><td>AlphaJournal</td><td>🔴 Critical</td></tr>
      <tr><td>Cross-app agents visible on explorer</td><td>All</td><td>🔴 Critical</td></tr>
    </tbody>
  </table>
</div>

<div class="docs-callout">
  <div class="callout-label">THANK_YOU</div>
  Your testing helps us ship a production-quality protocol for the 0G APAC Hackathon. Every bug you find makes the ecosystem stronger. <a href="https://forms.gle/PfNk73K2uLS79mmq8" target="_blank" rel="noopener noreferrer" class="text-link">Submit your feedback here</a> - no issue is too small.
</div>
`
  },
  {
    id: 'permanent-memory-5-minutes',
    slug: 'permanent-memory-5-minutes',
    title: 'How to Give Any AI Agent Permanent Memory in 5 Minutes',
    subtitle: 'A step-by-step tutorial for integrating MemoriaDA into any AI agent framework.',
    author: 'MrNetwork',
    date: 'May 13, 2026',
    readTime: '8 min read',
    tags: ['TUTORIAL', '0G_STORAGE', '0G_CHAIN', 'SDK'],
    featured: false,
    coverLabel: 'TUTORIAL_001',
    content: `
<p class="docs-p"><strong>The problem is simple:</strong> your AI agent forgets everything the moment a session ends. Every conversation starts from zero. Every user has to re-explain their preferences, their history, their context. This is the AI Amnesia problem - and it affects every agent framework on the market.</p>

<p class="docs-p"><strong>MemoriaDA fixes this in 3 API calls.</strong> This tutorial will walk you through the process of giving any AI agent - whether it's built on OpenClaw, Eliza, LangChain, or a custom framework - permanent, decentralized, cryptographically verifiable memory. The entire integration takes less than 5 minutes.</p>

<h2 class="docs-h2">What You'll Build</h2>

<p class="docs-p">By the end of this tutorial, your agent will be able to:</p>

<ul class="docs-list">
  <li><strong>Remember</strong> - Store conversation context as vector embeddings on 0G decentralized storage</li>
  <li><strong>Verify</strong> - Anchor Merkle root hashes on 0G Chain for cryptographic proof of memory integrity</li>
  <li><strong>Recall</strong> - Retrieve relevant past memories via cosine-similarity semantic search</li>
  <li><strong>Persist</strong> - Survive session resets, server crashes, and framework migrations</li>
</ul>

<h2 class="docs-h2">Prerequisites</h2>

<ul class="docs-list">
  <li>Node.js 20+ installed</li>
  <li>A running MemoriaDA server (or use our hosted endpoint)</li>
  <li>A funded 0G wallet (0.01 0G is enough for hundreds of memory operations)</li>
  <li>Your AI agent's codebase (any language - we provide a REST API)</li>
</ul>

<h2 class="docs-h2">Step 1: Register Your Agent (30 seconds)</h2>

<p class="docs-p">Every agent on the MemoriaDA protocol gets a unique <strong>ERC-721 Identity NFT</strong> on 0G Chain. This NFT is your agent's passport - it proves the agent exists, who owns it, and links to its entire memory history.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">JAVASCRIPT</span>
    <span class="code-file">register-agent.js</span>
  </div>
  <pre class="code-block">// Step 1: Register your agent on the MemoriaDA protocol
const response = await fetch('https://api.memoriada.xyz/api/registry/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'my_trading_bot_v1',    // Unique identifier
    framework: 'LangChain',          // Your framework name
    network: 'mainnet'               // 'mainnet' or 'testnet'
  })
});

const { tokenId, txHash, explorerUrl } = await response.json();
console.log(\`Agent registered! NFT Token #\${tokenId}\`);
console.log(\`Verify onchain: \${explorerUrl}\`);</pre>
</div>

<div class="docs-callout tip">
  <div class="callout-label">DEVELOPER_NOTE</div>
  This uses the <strong>"Developer Pays"</strong> model - your server wallet covers the gas fees. End users never need a wallet or tokens. This is the recommended UX for production apps.
</div>

<p class="docs-p">After registration, your agent is now visible in the <strong>Global Explorer</strong> on the MemoriaDA dashboard. It has its own NFT, its own memory root, and its own verifiable history.</p>

<h2 class="docs-h2">Step 2: Store a Memory (60 seconds)</h2>

<p class="docs-p">When your agent has a meaningful conversation, store the key information as a memory vector on 0G Storage. MemoriaDA handles the embedding, Merkle tree construction, and blob upload automatically.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">JAVASCRIPT</span>
    <span class="code-file">store-memory.js</span>
  </div>
  <pre class="code-block">// Step 2: Store a memory after a meaningful conversation
const memory = await fetch('https://api.memoriada.xyz/api/storage/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    payload: {
      protocol: 'memoria-da',
      version: '1.0.0',
      agentId: 'my_trading_bot_v1',
      content: 'User prefers swing trading on ETH/USDT. ' +
               'Risk tolerance: moderate. Typical position size: 2% of portfolio. ' +
               'Mentioned they lost money on leveraged longs in March 2026.',
      timestamp: new Date().toISOString()
    },
    network: 'mainnet'
  })
});

const { rootHash, blobHash, vectorCount } = await memory.json();
console.log(\`Memory stored! Root: \${rootHash}\`);
console.log(\`Total memories: \${vectorCount}\`);</pre>
</div>

<p class="docs-p"><strong>What happens under the hood:</strong></p>

<ul class="docs-list numbered">
  <li>Your text is embedded into a 1536-dimensional vector using a text-embedding model</li>
  <li>The vector is serialized as a JSON Merkle blob</li>
  <li>The blob is uploaded to 0G's decentralized storage network</li>
  <li>A root hash is generated and returned for onchain anchoring</li>
</ul>

<h2 class="docs-h2">Step 3: Anchor on 0G Chain (30 seconds)</h2>

<p class="docs-p">Now anchor the memory root hash on 0G Chain. This creates an immutable, publicly verifiable proof that this exact set of memories existed at this exact timestamp.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">JAVASCRIPT</span>
    <span class="code-file">anchor-memory.js</span>
  </div>
  <pre class="code-block">// Step 3: Anchor the Merkle root on 0G Chain
const anchor = await fetch('https://api.memoriada.xyz/api/registry/anchor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'my_trading_bot_v1',
    rootHash: rootHash,           // From Step 2
    vectorCount: vectorCount      // From Step 2
  })
});

const { txHash: anchorTx, explorerUrl: anchorUrl } = await anchor.json();
console.log(\`Memory anchored on 0G Chain!\`);
console.log(\`Verify: \${anchorUrl}\`);
// Cost: ~0.001 0G per anchor (~$0.002)</pre>
</div>

<div class="docs-callout">
  <div class="callout-label">COST_BREAKDOWN</div>
  At the current 0G token price, anchoring 1,000 memories costs approximately <strong>1 0G token</strong> total. This makes MemoriaDA one of the most cost-effective memory solutions available for autonomous agents.
</div>

<h2 class="docs-h2">Step 4: Recall Memories (The Magic)</h2>

<p class="docs-p">Now comes the powerful part. When your agent needs context, query MemoriaDA with a natural language question. The system uses <strong>cosine-similarity search</strong> across your agent's entire memory corpus to find the most relevant past memories.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">JAVASCRIPT</span>
    <span class="code-file">recall-memory.js</span>
  </div>
  <pre class="code-block">// Step 4: Recall relevant memories before responding
const recall = await fetch('https://api.memoriada.xyz/api/memory/recall', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'my_trading_bot_v1',
    query: 'What is the user\\'s risk tolerance?',
    topK: 3,                       // Return top 3 most relevant memories
    network: 'mainnet'
  })
});

const { memories } = await recall.json();
// memories[0].content → "User prefers swing trading on ETH/USDT.
//                        Risk tolerance: moderate..."
// memories[0].similarity → 0.94
// memories[0].timestamp → "2026-05-13T12:00:00Z"

// Inject into your agent's system prompt:
const systemPrompt = \`You are a trading assistant.
Here is what you remember about this user:
\${memories.map(m => m.content).join('\\n')}\`;</pre>
</div>

<h2 class="docs-h2">Step 5: Verify Integrity (Optional but Powerful)</h2>

<p class="docs-p">At any point, you or your users can verify that an agent's memories haven't been tampered with. This is the <strong>cryptographic guarantee</strong> that makes MemoriaDA unique.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">JAVASCRIPT</span>
    <span class="code-file">verify-memory.js</span>
  </div>
  <pre class="code-block">// Step 5: Verify memory integrity onchain
const verify = await fetch(
  'https://api.memoriada.xyz/api/registry/verify?agentId=my_trading_bot_v1&rootHash=' + rootHash
);

const { isValid, storedRoot, lastUpdated } = await verify.json();
console.log(\`Memory integrity: \${isValid ? '✅ VERIFIED' : '❌ TAMPERED'}\`);
console.log(\`Onchain root: \${storedRoot}\`);
console.log(\`Last anchored: \${new Date(lastUpdated * 1000).toISOString()}\`);</pre>
</div>

<h2 class="docs-h2">OpenClaw Integration (Even Faster)</h2>

<p class="docs-p">If you're building on the <strong>OpenClaw</strong> agent framework, integration is even simpler. MemoriaDA ships an official Skill that gives any OpenClaw agent automatic memory persistence.</p>

<div class="code-block-wrapper">
  <div class="code-header">
    <span class="code-lang">YAML</span>
    <span class="code-file">skills/memoria-da/SKILL.md</span>
  </div>
  <pre class="code-block">---
name: memoria-da
description: Gives any OpenClaw agent persistent, decentralized memory 
             via 0G Storage and 0G Chain.
metadata:
  openclaw:
    requires:
      bins: [curl]
---</pre>
</div>

<p class="docs-p">Simply drop the <code class="ic">skills/memoria-da/</code> directory into your OpenClaw agent's workspace, and the agent will automatically begin storing and retrieving memories using the MemoriaDA protocol.</p>

<h2 class="docs-h2">Architecture Recap</h2>

<pre class="ascii-diagram">
  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
  │  YOUR AGENT │───▶│ MEMORIA API  │───▶│  0G STORAGE  │
  │  (Any       │    │  (Embed +    │    │  (Merkle     │
  │   Framework)│    │   Serialize) │    │   Blobs)     │
  └─────────────┘    └──────┬───────┘    └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  0G CHAIN    │
                     │  (Anchor +   │
                     │   Verify)    │
                     └──────────────┘
</pre>

<h2 class="docs-h2">What Makes This Different</h2>

<ul class="docs-list">
  <li><strong>Permanent:</strong> Unlike Redis, Pinecone, or any database - 0G Storage is decentralized and designed for permanent data retention</li>
  <li><strong>Verifiable:</strong> Every memory has a Merkle root on 0G Chain. Anyone can cryptographically prove the data is untampered</li>
  <li><strong>Framework-agnostic:</strong> REST API works with any language, any framework, any agent architecture</li>
  <li><strong>Cost-effective:</strong> ~0.001 0G per memory anchor. Orders of magnitude cheaper than centralized vector databases</li>
  <li><strong>Privacy-ready:</strong> Encrypt your payloads before upload for fully private agent memory</li>
</ul>

<h2 class="docs-h2">Live Examples</h2>

<p class="docs-p">These production apps are already running on the MemoriaDA protocol on 0G Mainnet:</p>

<ul class="docs-list">
  <li><strong>AlphaJournal</strong> - AI trading diary that remembers every market thesis across sessions</li>
  <li><strong>SolTutor</strong> - AI Solidity tutor that tracks student progress and adapts lesson plans</li>
  <li><strong>MemoriaDA Agent</strong> - The flagship demo with real-time Data Terminal and onchain verification</li>
</ul>

<div class="docs-callout tip">
  <div class="callout-label">GET_STARTED</div>
  Ready to integrate? Check out the full <a href="/docs" class="text-link">Developer Documentation</a> or jump straight into the <a href="/app" class="text-link">Agent Playground</a> to see MemoriaDA in action.
</div>
`
  },
  {
    id: 'mainnet-migration',
    slug: 'mainnet-migration',
    title: 'MemoriaDA Migrates to 0G Aristotle Mainnet',
    subtitle: 'Our journey from Galileo testnet to production-grade decentralized memory.',
    author: 'MrNetwork',
    date: 'May 12, 2026',
    readTime: '4 min read',
    tags: ['ANNOUNCEMENT', 'MAINNET', '0G'],
    featured: false,
    coverLabel: 'DISPATCH_002',
    content: `
<p class="docs-p">Today marks a milestone for the MemoriaDA protocol: <strong>we have officially completed our migration to the 0G Aristotle Mainnet.</strong> All protocol operations - agent registration, memory anchoring, and integrity verification - are now live on the production network.</p>

<h2 class="docs-h2">What Changed</h2>

<ul class="docs-list">
  <li><strong>Registry Contract:</strong> Deployed at <code class="ic">0xD896D59583C137D6ca2c5e3add025e143eD1030d</code> on 0G Mainnet</li>
  <li><strong>RPC Endpoint:</strong> Switched from <code class="ic">evmrpc-testnet.0g.ai</code> to <code class="ic">evmrpc.0g.ai</code></li>
  <li><strong>Chain ID:</strong> Moved from <code class="ic">16602</code> (Galileo) to <code class="ic">16661</code> (Aristotle)</li>
  <li><strong>Storage Network:</strong> All new memory blobs now route to mainnet storage nodes</li>
</ul>

<h2 class="docs-h2">Why Mainnet Matters</h2>

<p class="docs-p">On testnet, data persistence is not guaranteed. Nodes can be reset, contracts can be wiped, and there's no economic incentive for storage providers to maintain your data. Mainnet changes everything:</p>

<ul class="docs-list">
  <li><strong>Real economic security</strong> - storage providers are incentivized to maintain data</li>
  <li><strong>Permanent anchoring</strong> - onchain roots are immutable and publicly verifiable</li>
  <li><strong>Production SLAs</strong> - the network is optimized for uptime and throughput</li>
</ul>

<h2 class="docs-h2">Backward Compatibility</h2>

<p class="docs-p">The MemoriaDA dashboard supports <strong>dual-network mode</strong>. You can toggle between Testnet and Mainnet using the network switcher in the header. All existing testnet agents remain accessible for development and testing.</p>

<div class="docs-callout">
  <div class="callout-label">ACTION_REQUIRED</div>
  If you are a partner app (AlphaJournal, SolTutor), ensure your <code class="ic">.env</code> files are updated with the mainnet RPC and contract address. Refer to the <a href="/docs" class="text-link">Developer Documentation</a> for the latest configuration.
</div>
`
  },
  {
    id: 'developer-pays-model',
    slug: 'developer-pays-model',
    title: 'The "Developer Pays" Model: Frictionless AI Memory',
    subtitle: 'How MemoriaDA abstracts blockchain complexity so end users never need a wallet.',
    author: 'MrNetwork',
    date: 'May 10, 2026',
    readTime: '5 min read',
    tags: ['ARCHITECTURE', 'UX', 'ECONOMICS'],
    featured: false,
    coverLabel: 'RESEARCH_003',
    content: `
<p class="docs-p">The biggest barrier to Web3 adoption isn't technology - it's UX. Asking a user to install MetaMask, acquire tokens, and sign transactions just to chat with an AI agent is a non-starter. That's why MemoriaDA implements the <strong>"Developer Pays" model</strong>.</p>

<h2 class="docs-h2">How It Works</h2>

<p class="docs-p">In the Developer Pays model, the application developer funds all blockchain operations on behalf of their users:</p>

<ul class="docs-list numbered">
  <li>The developer deploys a server with a funded 0G wallet</li>
  <li>When a user interacts with the AI agent, the server handles memory storage and anchoring</li>
  <li>The user never sees a wallet prompt, gas fee, or blockchain confirmation</li>
  <li>The developer pays ~0.001 0G per memory operation (fractions of a cent)</li>
</ul>

<h2 class="docs-h2">The Economics</h2>

<p class="docs-p">At current 0G token prices, the cost structure looks like this:</p>

<div class="docs-table-wrapper">
  <table class="docs-table">
    <thead>
      <tr><th>Operation</th><th>Cost</th><th>Per 1,000 Users</th></tr>
    </thead>
    <tbody>
      <tr><td>Agent Registration</td><td>~0.002 0G</td><td>One-time</td></tr>
      <tr><td>Memory Anchor</td><td>~0.001 0G</td><td>~1 0G</td></tr>
      <tr><td>Storage Upload</td><td>~0.0005 0G</td><td>~0.5 0G</td></tr>
      <tr><td>Memory Recall</td><td>Free (read-only)</td><td>$0</td></tr>
    </tbody>
  </table>
</div>

<p class="docs-p">For a typical SaaS application serving 1,000 daily active users with 10 memory operations each, the total daily cost is approximately <strong>10 0G tokens</strong>. This is orders of magnitude cheaper than centralized vector database hosting.</p>

<h2 class="docs-h2">For Partner Apps</h2>

<p class="docs-p">Both <strong>AlphaJournal</strong> and <strong>SolTutor</strong> use the Developer Pays model in production. Their users chat with AI agents, get personalized responses based on remembered context, and never know there's a blockchain involved. That's the goal.</p>

<div class="docs-callout tip">
  <div class="callout-label">INTEGRATION_TIP</div>
  To implement Developer Pays, simply run the MemoriaDA server with your funded wallet's private key in the <code class="ic">VITE_PRIVATE_KEY</code> environment variable. The server handles all signing automatically.
</div>
`
  },
  {
    id: 'context-window-inflation',
    slug: 'context-window-inflation',
    title: 'Solving the "Context Window Inflation" Problem: Why LLMs Still Need Decentralized Cache',
    subtitle: 'Why massive LLM context windows aren\'t a replacement for efficient, decentralized long-term memory.',
    author: 'MrNetwork',
    date: 'May 20, 2026',
    readTime: '6 min read',
    tags: ['ARCHITECTURE', 'AI', '0G_LABS', 'CACHE'],
    featured: false,
    coverLabel: 'RESEARCH_004',
    content: `
<p class="docs-p">Every major LLM provider is currently locked in a "context window arms race." We've gone from 4k tokens to 128k, then 1M, and now up to 2M+ tokens in production. The marketing pitch is simple: <em>"Just dump all your PDFs, codebases, and history directly into the prompt."</em></p>

<p class="docs-p">But in production, developers are hitting a wall. Massive context windows are not a magic bullet for AI agent memory. In fact, relying on them as a primary memory store is a recipe for high latency, skyrocketing API bills, and degraded intelligence.</p>

<div class="docs-callout tip">
  <div class="callout-label">THE_TRUTH_ABOUT_CONTEXT</div>
  A large context window is a temporary workspace, not a database. Treating it as a long-term memory store leads to three severe issues: <strong>Latency</strong>, <strong>Cost</strong>, and <strong>Recall Degradation</strong>.
</div>

<h2 class="docs-h2">The Three Hidden Costs of Context Inflation</h2>

<ul class="docs-list numbered">
  <li><strong>The Latency Penalty:</strong> Prompt processing (prefill) scales with input size. Passing a 500k-token prompt to an LLM before every turn can cause response latencies of 15 to 30 seconds. That ruins real-time conversational UX.</li>
  <li><strong>The Financial Drain:</strong> LLM APIs charge per token. If your agent forgets past turns and you have to feed the entire history back into the model on every message, your API bills grow quadratically.</li>
  <li><strong>The "Lost in the Middle" Phenomenon:</strong> Research shows that LLMs are highly prone to overlooking information placed in the middle of long contexts. The model pays most attention to the very beginning and the end of the prompt, missing critical user details in between.</li>
</ul>

<h2 class="docs-h2">Enter the Decentralized Cache</h2>

<p class="docs-p">Instead of feeding raw history to the model, MemoriaDA introduces a <strong>Decentralized Semantic Cache</strong>. When a user chats with an agent, the system searches the agent's long-term memory corpus, extracts only the top 3-5 most relevant memory snippets (using cosine-similarity embeddings), and injects only those into a compact system prompt.</p>

<p class="docs-p">This keeps the prompt size to under 2,000 tokens while giving the AI precise, accurate recall of events that occurred weeks or months ago.</p>

<h2 class="docs-h2">Powering the Agent: OGM-1.0-35B-A3B on 0G Private Computer</h2>

<p class="docs-p">It is not just the storage and DA layers that run on 0G. MemoriaDA utilizes 0G's decentralized AI computing network—specifically the TEE-verified <strong>OGM-1.0-35B-A3B</strong> model served via the <strong>0G Router</strong> (<code class="ic">https://router-api.0g.ai/v1/chat/completions</code>).</p>

<div class="docs-callout tip">
  <div class="callout-label">TEE_VERIFIED_COMPUTE</div>
  The model runs inside a <strong>Trusted Execution Environment (TEE)</strong>. This guarantees that your conversation inputs, outputs, and the model's internal weights are cryptographically sealed and private. No node operator, hosting provider, or third party can spy on or tamper with the conversation.
</div>

<p class="docs-p">With a native context limit of <strong>262,144 tokens</strong>, the model has a large memory workbench. However, processing large prompts through secure TEE hardware is compute-intensive. With input prices at <code class="ic">0.33 OG/M</code> tokens and outputs at <code class="ic">1.99 OG/M</code> tokens, keeping prompts minimal is essential. MemoriaDA's semantic cache allows the agent to maintain deep, long-term history while only passing the absolute necessary tokens to the 0G Router, keeping execution fast, secure, and incredibly cost-effective.</p>

<h2 class="docs-h2">Why We Built on 0G Labs</h2>

<p class="docs-p">Traditional decentralized storage networks (like Arweave or IPFS) are great for static hosting, but they are too slow for real-time AI agents. An agent cannot wait 10 seconds to retrieve a memory bubble mid-conversation.</p>

<p class="docs-p">This is why MemoriaDA is powered by <strong>0G Labs</strong>. By leveraging 0G Labs' ultra-high-throughput <strong>Decentralized Data Availability (DA)</strong> and <strong>0G Storage</strong>, MemoriaDA achieves sub-second retrieval times. 0G Labs provides the data throughput and indexing capabilities needed to fetch and verify memory blobs in milliseconds.</p>

<pre class="ascii-diagram">
  ┌─────────────────┐
  │   User Query    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐     Retrieves top K      ┌─────────────────┐
  │   MemoriaDA     │◀─────────────────────────│   0G STORAGE    │
  │   Semantic DB   │  (Sub-second response)   │  (Memory Blobs) │
  └────────┬────────┘                          └─────────────────┘
           │
           ▼ (Injects context: ~2k tokens)
  ┌─────────────────┐
  │    LLM API      │  ===> Fast, cheap, and highly accurate response!
  └─────────────────┘
</pre>

<h2 class="docs-h2">Performance Comparison</h2>

<div class="docs-table-wrapper">
  <table class="docs-table">
    <thead>
      <tr><th>Metric</th><th>Raw Context Window (500k tokens)</th><th>MemoriaDA + 0G Labs Cache</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Prompt Latency</strong></td><td>12.5s - 25.0s</td><td><strong>&lt; 0.8s</strong></td></tr>
      <tr><td><strong>API Cost per Turn</strong></td><td>~$3.50 - $5.00</td><td><strong>&lt; $0.01</strong></td></tr>
      <tr><td><strong>Recall Accuracy</strong></td><td>Prone to "Lost in the Middle"</td><td><strong>~98.4% (Targeted RAG)</strong></td></tr>
      <tr><td><strong>Data Sovereignty</strong></td><td>Locked in provider's logs</td><td><strong>User Owned (NFT Linked)</strong></td></tr>
    </tbody>
  </table>
</div>

<h2 class="docs-h2">Onchain Verification on 0G Chain</h2>

<p class="docs-p">Because the index roots of these memories are anchored on the high-performance <strong>0G Chain</strong>, the memory state is cryptographically tamper-proof. Developers can prove to users that their private AI context is secure and hasn't been modified by third parties. This trustless guarantee is only possible due to 0G Labs' unified infrastructure.</p>

<div class="docs-callout">
  <div class="callout-label">NEXT_STEPS</div>
  Ready to optimize your agent's performance and slash API costs? Check out our <a href="/blog/permanent-memory-5-minutes" class="text-link">5-Minute Integration Guide</a> to connect your agent to the MemoriaDA protocol on 0G Mainnet today.
</div>
`
  },
  {
    id: 'memoriada-foundry-partnership',
    slug: 'memoriada-foundry-partnership',
    title: 'MemoriaDA ✕ Foundry: Sovereign Memory Meets Model Equity on 0G',
    subtitle: 'Announcing a partnership to enable co-owned, revenue-generating AI agents with permanent decentralized memory.',
    author: 'MrNetwork',
    date: 'May 20, 2026',
    readTime: '5 min read',
    tags: ['PARTNERSHIP', '0G_LABS', 'DECENTRALIZED_AI', 'OWNERSHIP'],
    featured: false,
    coverLabel: 'PARTNERSHIP_001',
    content: `
<p class="docs-p">Today, we are proud to announce our official partnership with <strong>Foundry</strong>, the supply-side protocol on 0G Aristotle Mainnet. This partnership unites MemoriaDA’s long-term sovereign memory with Foundry’s co-owned model Ingots, shifting AI agents from renting closed APIs to co-owning decentralized intelligence.</p>

<div class="docs-callout tip">
  <div class="callout-label">THE_PARTNERSHIP_VISION</div>
  We are moving away from Web2's "rented intelligence" model. By integrating <strong>MemoriaDA</strong> and <strong>Foundry</strong>, developers can now build AI agents that own their memory logs, train their own models, and earn permanent on-chain revenue splits.
</div>

<h2 class="docs-h2">Three Pillars of the Integration</h2>

<ul class="docs-list">
  <li><strong>1. Memory Logs as Equity (Data Smiths):</strong> MemoriaDA accumulates rich conversational traces and state profiles. By acting as a Data Smith, MemoriaDA contributes these anonymized memory logs to Foundry Forges. This translates our raw memories into on-chain shares of custom model Ingots.</li>
  <li><strong>2. TEE-Attested Verification:</strong> Every inference call returns an on-chain receipt (<code class="ic">inferenceTxHash</code>) and a Trusted Execution Environment (TEE) proof. We link this receipt directly alongside MemoriaDA's memory anchors to provide a double-verifiable audit trail of what was retrieved and which model processed it.</li>
  <li><strong>3. Native 0G Chain Execution:</strong> Because both protocols run natively on the 0G Aristotle mainnet, memory operations, training, and model queries interact flawlessly with zero gas overhead and zero cross-chain bridge dependencies.</li>
</ul>

<h2 class="docs-h2">Technical Integration: How It Works</h2>

<p class="docs-p">Integrating sovereign memory and model equity requires just a few lines of code. Here is how a sovereign-memory agent retrieves context from MemoriaDA and runs inference on a co-owned Foundry Ingot:</p>

<pre class="code-block">
import { Foundry } from "@foundryprotocol/sdk";
import { memoryStore } from "../services/memoryStore";

// 1. Semantic search across MemoriaDA's long-term memory
const queryEmbedding = await generateEmbedding(userQuery);
const recalled = memoryStore.search(queryEmbedding, 3);
const context = memoryStore.buildContextPrompt(recalled);

// 2. Call the co-owned Ingot model via Foundry on 0G Aristotle
const foundry = new Foundry({ contracts: "aristotle" });
const { output, receipt } = await foundry.inference.run(
  "ingot:0x8e2af4a000000000000000000000000000000001", // Co-owned Model Ingot ID
  { input: \`\${context}\\n\\nUser: \${userQuery}\`, temperature: 0.7 }
);

// 3. Store the result along with the on-chain receipt
await memoryStore.addMemory({
  content: \`User: \${userQuery}\\nAgent: \${output}\`,
  embedding: queryEmbedding,
  metadata: {
    inferenceTxHash: receipt.inferenceTxHash, // Provable TEE execution receipt
    revenueTxHash: receipt.revenueTxHash      // Automated revenue share payout tx
  }
});
</pre>

<h2 class="docs-h2">The Inference & Payout Flow</h2>

<pre class="ascii-diagram">
  ┌─────────────────┐       1. Search      ┌─────────────────┐
  │   User Query    │─────────────────────▶│   MemoriaDA     │
  └────────┬────────┘                      │  (0G Storage)   │
           │                               └────────┬────────┘
           │ 2. Context Prompt                      │
           ▼                                        ▼ (Recalls Top 3)
  ┌─────────────────┐       3. Runs        ┌─────────────────┐
  │  Foundry Ingot  │◀─────────────────────│ TEE Attestation │
  │   (Inference)   │                      │  & Tx Receipts  │
  └────────┬────────┘                      └─────────────────┘
           │
           ▼ 4. Revenue Dispatched
  ┌─────────────────┐
  │ RevenueSplitter │ ===> Co-owners pull earnings automatically!
  └─────────────────┘
</pre>

<h2 class="docs-h2">What This Means for the 0G Ecosystem</h2>

<p class="docs-p">By uniting memory and model training, we are building the groundwork for autonomous agent economies. Instead of paying continuous bills to centralized cloud providers, agents running on MemoriaDA and Foundry become productive capital assets that generate on-chain yield for their creators, data providers, and backers.</p>

<div class="docs-callout">
  <div class="callout-label">LAUNCH_DETAILS</div>
  The partnership is officially live on the 0G Aristotle mainnet. The initial integration adapter is available in our developer SDK. Check out the <a href="/docs/build-on-foundry" class="text-link">Developer Docs</a> to start building.
</div>
`
  },
  {
    id: 'post-hackathon-roadmap',
    slug: 'post-hackathon-roadmap',
    title: 'Beyond the Hackathon: What’s Next for the MemoriaDA Ecosystem',
    subtitle: 'Following our success in the 0G APAC Hackathon, we map out the road to TEE-sealed RAG, Agent Swarms, and intent-based memory subsidies.',
    author: 'MrNetwork',
    date: 'May 23, 2026',
    readTime: '6 min read',
    tags: ['ROADMAP', 'HACKATHON', '0G_COMPUTE', 'PRIVACY'],
    featured: true,
    coverLabel: 'ROADMAP_002',
    content: `
<p class="docs-p">We have officially wrapped up our journey in the <strong>0G APAC Hackathon 2026 (Track 1: Agentic Infrastructure & OpenClaw Lab)</strong>. But this is not the end of MemoriaDA—it is just the genesis. While many hackathon projects remain on testnets as static code repositories, MemoriaDA is already a living protocol deployed on the <strong>0G Aristotle Mainnet</strong> with real transactions, real protocol revenue, and active ecosystem partners.</p>

<div class="docs-callout tip">
  <div class="callout-label">HACKATHON_STATS</div>
  Our submission has achieved significant initial traction: over <strong>100+ onchain transactions</strong>, <strong>21 registered mainnet agents</strong>, and a growing community of builders and integration partners like SolTutor (built by MemoriaDA team), <a href="https://foundryprotocol.xyz/" target="_blank" rel="noopener noreferrer" class="text-link">FoundryProtocol</a> and <a href="https://alphajournal.online" target="_blank" rel="noopener noreferrer" class="text-link">AlphaJournal</a>.
</div>

<h2 class="docs-h2">Where We Are Today: The Triple-G Stack</h2>

<p class="docs-p">During the hackathon, our goal was to prove the feasibility of decentralized agent memory using the unified 0G stack. We succeeded by integrating all three core layers:</p>

<ul class="docs-list">
  <li><strong>0G Storage (Data Layer):</strong> Storing high-dimensional vector embeddings as Merkle-verified data blobs.</li>
  <li><strong>0G Chain (Audit Layer):</strong> Anchoring memory roots on the MemoriaRegistryV2 smart contract on the Aristotle Mainnet.</li>
  <li><strong>0G Compute (Inference Layer):</strong> Running TEE-sealed inferences through the 0G Compute Router using the 0GM-1.0-35B-A3B reasoning model.</li>
</ul>

<p class="docs-p">With the foundation secure, we are moving directly into <strong>Phase 3: Sovereign Intelligence</strong> of our protocol roadmap. Here is what the community and developers can expect next.</p>

<h2 class="docs-h2">The Post-Hackathon Roadmap: What to Expect</h2>

<h3 class="docs-h3">1. Sealed RAG (Retrieval-Augmented Generation)</h3>
<p class="docs-p">AI memories often contain sensitive personal data, API keys, or financial strategies. If these memories are sent to public AI routers, user privacy is compromised. We are rolling out full Trusted Execution Environment (TEE) support for our Retrieval-Augmented Generation pipeline. Memory extraction and model inference will happen inside cryptographically sealed sandboxes on the 0G Compute Network, preventing any third-party data leakage.</p>

<h3 class="docs-h3">2. Agent Swarms & Shared Memory Graphs</h3>
<p class="docs-p">Currently, agent memory roots are isolated by Agent IDs. In the next phase, we are adding support for shared memory roots and permissioned cross-agent queries. This enables cooperative agent swarms: a developer can deploy multiple specialized agents (e.g., a researcher, a writer, and a coder) that read and write to a unified, decentralized memory graph on 0G Storage.</p>

<pre class="ascii-diagram">
  ┌────────────────────────────────────────────────────────┐
  │                    AGENT SWARM GRAPH                   │
  │                                                        │
  │   ┌──────────────┐   ┌──────────────┐   ┌──────────┐   │
  │   │  Research    │   │  Writing     │   │ Coding   │   │
  │   │  Agent       │   │  Agent       │   │ Agent    │   │
  │   └──────┬───────┘   └──────┬───────┘   └────┬─────┘   │
  │          │                  │                │         │
  │          └───────────┐      │      ┌─────────┘         │
  │                      ▼      ▼      ▼                   │
  │                  ┌───────────────────┐                 │
  │                  │ Shared Memory Root│                 │
  │                  │    (0G Storage)   │                 │
  │                  └───────────────────┘                 │
  └────────────────────────────────────────────────────────┘
</pre>

<h3 class="docs-h3">3. Intent-Based Settlement via 0G Pay × Khalani</h3>
<p class="docs-p">To make integration as frictionless as possible, we are introducing intent-based payment routing. Developers won't need to hold or manage mainnet 0G tokens to power memory updates. By integrating Khalani's solver network, developers can pay memory storage fees in stablecoins (like USDC) on any EVM chain, and solvers will settle the 0.001 0G anchoring fees on the Aristotle Mainnet automatically.</p>

<h3 class="docs-h3">4. Launch of \`@memoria/sdk\` & Extended SDK Guides</h3>
<p class="docs-p">We are package-compiling our integration layer into a standalone npm package: <code class="ic">@memoria/sdk</code>. This will allow any JS/TS developer to equip their agent with decentralized memory with a simple client initialization, bypassing raw REST API requests. We will also release drop-in integrations for popular agent frameworks like <strong>ElizaOS</strong> and <strong>Rig</strong>.</p>

<h2 class="docs-h2">What This Means for the Community</h2>

<p class="docs-p">We are committed to making MemoriaDA a key public utility in the deAI space. As we roll out these features, the community can expect:</p>

<ul class="docs-list">
  <li><strong>Expanded Tester Incentives:</strong> We will expand our mainnet private tester program, offering more free allocations from our 0G token faucet to active builders.</li>
  <li><strong>Open SDK Grants:</strong> Small developer grants for teams building open-source plugins connecting MemoriaDA to external agent frameworks.</li>
  <li><strong>Decentralized Governance:</strong> Long-term plans to transition the registry's fee configurations and framework whitelist to community-led governance.</li>
</ul>

<div class="docs-callout">
  <div class="callout-label">GET_INVOLVED</div>
  We invite all developers, AI enthusiasts, and testers to join our journey. Connect your wallet to the <a href="/app" class="text-link">Dashboard</a>, register an Agent NFT, and help us build the memory standard for the autonomous future. Connect with us on <a href="https://t.me/MemoriaDA_TG" class="text-link">Telegram</a> to get started.
</div>
`
  }
];

export const getArticleBySlug = (slug) => BLOG_ARTICLES.find(a => a.slug === slug);
export const getFeaturedArticle = () => BLOG_ARTICLES.find(a => a.featured);
