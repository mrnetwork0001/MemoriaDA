import './DeveloperSDK.css';

function DeveloperSDK() {
  const openClawExample = `import { Agent } from "openclaw";
import { MemoriaDA } from "@memoria/sdk";

// 1. Initialize Memoria DA with your 0G Private Key
const memory = new MemoriaDA({
  privateKey: process.env.ZG_PRIVATE_KEY,
  network: "testnet" // or "mainnet"
});

// 2. Wrap your agent
const agent = new Agent({
  id: "agent_0xClaw_7f3a",
  model: "qwen/qwen-2.5-7b-instruct",
  memory: memory.getStore() // Inject 0G Memory Store
});

// 3. Start chatting! Every interaction is automatically 
// vectorized, stored on 0G Storage, and anchored to 0G Chain.
await agent.chat("Initialize mission protocol.");`;

  const elizaExample = `import { Eliza } from "@elizaos/core";
import { MemoriaProvider } from "@memoria/sdk/eliza";

const eliza = new Eliza({
  name: "eliza_99b1",
  plugins: [
    new MemoriaProvider({
      privateKey: process.env.ZG_PRIVATE_KEY,
      syncInterval: 5000 // Sync to 0G Chain every 5s
    })
  ]
});

eliza.start();`;

  return (
    <div className="developer-sdk">
      <div className="sdk-header">
        <h2 className="heading-font">DEVELOPER SDK</h2>
        <p className="sdk-subtitle terminal-font">Integrate Decentralized Memory in 3 lines of code</p>
      </div>

      <div className="sdk-content">
        <div className="sdk-section">
          <h3>OpenClaw Integration</h3>
          <p>Memoria DA provides a native memory store for the OpenClaw framework. It automatically handles vector embeddings, 0G Storage uploads, and 0G Chain registry anchoring.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">typescript</span>
              <span className="code-file">agent.ts</span>
            </div>
            <pre className="code-block">
              <code>{openClawExample}</code>
            </pre>
          </div>
        </div>

        <div className="sdk-section">
          <h3>ElizaOS Integration</h3>
          <p>For ElizaOS, use the MemoriaProvider plugin to instantly upgrade your character with decentralized persistent memory.</p>
          <div className="code-block-wrapper">
            <div className="code-header">
              <span className="code-lang">typescript</span>
              <span className="code-file">character.ts</span>
            </div>
            <pre className="code-block">
              <code>{elizaExample}</code>
            </pre>
          </div>
        </div>

        <div className="sdk-cta">
          <p>View the full documentation on <a href="#" className="text-gradient-cyan">GitHub</a> or install via npm:</p>
          <div className="npm-install mono">
            <span className="prompt">$</span> npm install @memoria/sdk
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperSDK;
