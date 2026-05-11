import { useState, useRef, useEffect } from 'react';
import { DEFAULT_AGENT_FRAMEWORK } from '../config/constants';
import { NETWORK_CONFIG } from '../config/network';
import computeClient from '../services/computeClient';
import memoryStore from '../services/memoryStore';
import './AgentChat.css';

const AGENT_ID = 'agent_0xClaw_7f3a';

const SYSTEM_PROMPT = `You are an AI agent named Claw, part of the Memoria DA protocol — a decentralized universal agent memory system built on 0G. You are running on the 0G Compute Network using sealed inference (TEE-verified).

Your capabilities:
- Every conversation is stored as a vector embedding on 0G decentralized storage
- Your memory roots are anchored on 0G Chain (verifiable, immutable)
- You can recall previous conversations through similarity search on stored vectors
- Your responses are generated via 0G Compute's sealed inference (cryptographically verifiable)

Be helpful, concise, and technical. When you recall a memory, mention it naturally. Sign off as "Claw" when appropriate.`;

const MOCK_MESSAGES = [
  {
    id: 1,
    role: 'system',
    content: 'Memoria DA Protocol initialized. Connect your wallet to enable decentralized memory storage on 0G.',
    timestamp: '02:14:01',
  },
  {
    id: 2,
    role: 'agent',
    content: "Hello! I'm your OpenClaw agent. Connect your wallet to enable **real** decentralized memory on 0G Storage. Once connected, every conversation is stored as a vector embedding on-chain.",
    timestamp: '02:14:03',
  },
];

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

const AgentChat = ({ onMemoryEvent, wallet, storage, registry }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [statusLabel, setStatusLabel] = useState(null);
  const [computeReady, setComputeReady] = useState(false);
  const [retrievedMemories, setRetrievedMemories] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check compute backend on mount
  useEffect(() => {
    computeClient.getStatus().then(status => {
      setComputeReady(status.isReady);
      if (status.isReady) {
        console.log('[AgentChat] 0G Compute backend READY');
      } else {
        console.warn('[AgentChat] 0G Compute not available:', status.error);
      }
    });
  }, []);

  // Show system message when wallet connects
  const walletNotifiedRef = useRef(false);
  useEffect(() => {
    if (wallet?.isConnected && wallet?.isCorrectChain && !walletNotifiedRef.current) {
      walletNotifiedRef.current = true;
      const memCount = memoryStore.count;
      requestAnimationFrame(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'system',
          content: `Wallet connected to 0G. Memory operations are now LIVE on decentralized storage.${memCount > 0 ? ` Found ${memCount} memories from previous sessions.` : ''}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }]);
      });
    } else if (!wallet?.isConnected) {
      walletNotifiedRef.current = false;
    }
  }, [wallet?.isConnected, wallet?.isCorrectChain]);

  const addSystemMsg = (content, link = null) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      role: 'system',
      content,
      link,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }]);
  };

  const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userContent = inputValue.trim();
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userContent,
      timestamp: now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setRetrievedMemories([]);

    onMemoryEvent?.({
      type: 'QUERY',
      agentId: AGENT_ID,
      query: userContent.slice(0, 60),
      timestamp: new Date().toISOString(),
    });

    let uploadResult = null;
    let registryReceipt = null;
    let agentResponse = '';

    try {
      // ── STEP 1: Generate embedding for the query ──────────
      setStatusLabel('Embedding query…');
      let queryEmbedding = null;

      if (computeReady) {
        queryEmbedding = await computeClient.generateEmbedding(userContent);
      }
      // Fallback to local if backend embedding failed
      if (!queryEmbedding) {
        queryEmbedding = storage.generateEmbedding(userContent);
      }

      // ── STEP 2: Search local memory for relevant context ──
      setStatusLabel('Searching memory…');
      const recalled = memoryStore.search(queryEmbedding, 5);
      const relevantMemories = recalled.filter(m => m.similarity > 0.3);
      setRetrievedMemories(relevantMemories);

      if (relevantMemories.length > 0) {
        onMemoryEvent?.({
          type: 'MEMORY_SEARCH',
          agentId: AGENT_ID,
          results: relevantMemories.length,
          topSimilarity: relevantMemories[0]?.similarity?.toFixed(4),
          timestamp: new Date().toISOString(),
        });
      }

      // ── STEP 3: Build messages array with memory context ──
      const contextPrompt = memoryStore.buildContextPrompt(relevantMemories);
      const llmMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];
      if (contextPrompt) {
        llmMessages.push({ role: 'system', content: contextPrompt });
      }
      // Add recent conversation for context (last 10 messages)
      const recentMsgs = messages
        .filter(m => m.role === 'user' || m.role === 'agent')
        .slice(-10)
        .map(m => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.content,
        }));
      llmMessages.push(...recentMsgs);
      llmMessages.push({ role: 'user', content: userContent });

      // ── STEP 4: Get LLM response via 0G Compute ──────────
      setStatusLabel('0G Compute inference…');

      if (computeReady) {
        try {
          const result = await computeClient.chatWithAgent(llmMessages);
          agentResponse = result.content;
          onMemoryEvent?.({
            type: 'COMPUTE_INFERENCE',
            agentId: AGENT_ID,
            model: result.model,
            chatId: result.chatId,
            verified: result.verified,
            timestamp: new Date().toISOString(),
          });
        } catch (err) {
          console.error('[AgentChat] 0G Compute failed, using fallback:', err.message);
          agentResponse = buildFallbackReply(userContent, relevantMemories);
          addSystemMsg(`⚠️ 0G Compute error: ${err.message}. Using local fallback.`);
        }
      } else {
        agentResponse = buildFallbackReply(userContent, relevantMemories);
      }

      // ── STEP 5: Show agent response immediately ────────────
      // Don't wait for storage/registry — show reply right away
      setStatusLabel(null);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'agent',
        content: agentResponse,
        timestamp: now(),
        memories: relevantMemories.length > 0 ? relevantMemories.length : undefined,
      }]);

      // ── STEP 6: Save to local memory index immediately ─────
      memoryStore.addMemory({
        rootHash: `local_${Date.now().toString(36)}`,
        content: `User: ${userContent}\nAgent: ${agentResponse}`,
        embedding: queryEmbedding,
        agentId: AGENT_ID,
        metadata: { onChain: false },
      });

      // ── STEP 7: Storage + Registry run in background ───────
      // MetaMask popup appears while user is already reading the response
      if (wallet?.isConnected && wallet?.isCorrectChain && wallet?.signer) {
        (async () => {
          try {
            const uploadResult = await storage.storeMemory({
              agentId: AGENT_ID,
              content: `User: ${userContent}\nAgent: ${agentResponse}`,
              embedding: queryEmbedding,
              metadata: {
                framework: DEFAULT_AGENT_FRAMEWORK,
                sessionId: `session_${Date.now().toString(36)}`,
                messageType: 'conversation',
                memoryCount: memoryStore.count,
              },
            }, wallet.signer);

            onMemoryEvent?.({
              type: 'STORE_COMPLETE',
              agentId: AGENT_ID,
              rootHash: uploadResult.rootHash,
              blobSize: uploadResult.blobSize,
              elapsed: uploadResult.elapsed,
              timestamp: new Date().toISOString(),
            });

            if (registry?.isDeployed) {
              const registered = await registry.ensureAgentRegistered(
                AGENT_ID, DEFAULT_AGENT_FRAMEWORK, wallet.signer
              );
              if (registered) {
                const registryReceipt = await registry.commitMemoryRoot(
                  AGENT_ID, uploadResult.rootHash, memoryStore.count, wallet.signer
                );
                if (registryReceipt) {
                  const txHash = registryReceipt.transactionHash || registryReceipt.hash;
                  const explorerUrl = txHash ? `${NETWORK_CONFIG.txExplorer}${txHash}` : null;
                  const blockLabel = registryReceipt.blockNumber
                    ? `Block #${registryReceipt.blockNumber}`
                    : 'TX Confirmed';
                  addSystemMsg(
                    `✓ Memory anchored on 0G Chain — ${blockLabel} — Fee: 0.001 0G`,
                    explorerUrl ? { href: explorerUrl, label: 'View in Explorer ↗' } : null
                  );
                  onMemoryEvent?.({
                    type: 'CHAIN_COMMIT',
                    agentId: AGENT_ID,
                    rootHash: uploadResult.rootHash,
                    blockNumber: registryReceipt.blockNumber,
                    timestamp: new Date().toISOString(),
                  });
                } else {
                  const regErr = registry.error || 'Registry call failed — check Data Terminal';
                  addSystemMsg(`⚠️ Chain anchor skipped: ${regErr.slice(0, 100)}`);
                }
              }
            }
          } catch (err) {
            console.log('[AgentChat] Background storage error:', err.message);
            const shortMsg = err.message?.includes('coalesce')
              ? 'RPC returned invalid params. Memory saved locally.'
              : err.message?.length > 80 ? err.message.slice(0, 80) + '...' : err.message;
            addSystemMsg(`⚠️ Storage: ${shortMsg}`);
          }
        })();
      }

    } catch (err) {
      console.error('[AgentChat] Pipeline error:', err);
      addSystemMsg(`⚠️ Error: ${err.message}`);
      setStatusLabel(null);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'agent',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: now(),
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isLive = wallet?.isConnected && wallet?.isCorrectChain;
  const isBusy = isTyping || storage?.isUploading || registry?.isRegistering || registry?.isUpdating;
  const liveLabel = registry?.isDeployed ? '0G LIVE + CHAIN' : '0G LIVE';

  return (
    <div className="agent-chat glass-panel-strong" id="agent-chat-panel">
      {/* Panel Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="agent-avatar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="9" r="1.5" fill="currentColor" />
              <circle cx="12" cy="9" r="1.5" fill="currentColor" />
              <path d="M7 13c0 0 1.5 2 3 2s3-2 3-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="chat-title">Agent Chat</h2>
            <span className="chat-agent-id mono">OpenClaw Agent • {AGENT_ID}</span>
          </div>
        </div>
        <div className="chat-header-right">
          {computeReady && (
            <span className="compute-badge">
              <span className="compute-dot" />
              0G Compute
            </span>
          )}
          <span className={`memory-count ${isLive ? 'memory-count-live' : ''}`}>
            {isLive ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
            {isLive ? liveLabel : `${memoryStore.count} memories`}
          </span>
          {statusLabel && (
            <span className="upload-badge">
              <span className="connect-spinner-small" />
              {statusLabel}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            {msg.role === 'system' ? (
              <div className="system-message">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
                  <path d="M7 4v3.5M7 9.5v0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span>{msg.content}</span>
                {msg.link && (
                  <a
                    href={msg.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="system-message-link"
                  >
                    {msg.link.label}
                  </a>
                )}
              </div>
            ) : (
              <>
                <div className="message-header">
                  <span className="message-role">{msg.role === 'agent' ? '🤖 Agent' : '👤 You'}</span>
                  <span className="message-time mono">{msg.timestamp}</span>
                  {msg.memories && (
                    <span className="memory-recall-badge terminal-font">
                      🧠 {msg.memories} memories recalled
                    </span>
                  )}
                </div>
                <div className="message-content">
                  {msg.content.split('\n').map((line, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/•/g, '<span class="bullet">•</span>')
                    }} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message message-agent">
            <div className="message-header">
              <span className="message-role">🤖 Agent</span>
            </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="chat-input-wrapper">
          <div className="input-prefix terminal-font">❯</div>
          <input
            type="text"
            className="chat-input terminal-font"
            placeholder="COMM_LINK_ESTABLISHED: ENTER COMMAND..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
          />
          <button
            type="submit"
            className="chat-send-btn cyber-chamfer"
            disabled={isBusy || !inputValue.trim()}
          >
            {isBusy ? '...' : 'SEND'}
          </button>
        </form>
        <div className="input-hint">
          <span>Press <kbd>Enter</kbd> to send</span>
          <span className={`storage-badge ${isLive ? 'storage-badge-live' : ''}`}>
            {isLive
              ? (registry?.isDeployed ? '🟢 0G Storage + Chain' : '🟡 0G Storage LIVE')
              : '🔗 0G Storage'}
            {computeReady ? ' • 0G Compute' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Fallback reply when 0G Compute is unavailable ─────────
function buildFallbackReply(query, retrievedMemories) {
  const parts = ['Processing your request locally (0G Compute offline)...\n'];

  if (retrievedMemories && retrievedMemories.length > 0) {
    parts.push(`🧠 I found **${retrievedMemories.length}** relevant memories from past conversations:`);
    retrievedMemories.slice(0, 3).forEach((m, i) => {
      const sim = (m.similarity * 100).toFixed(1);
      const preview = m.content.slice(0, 80).replace(/\n/g, ' ');
      parts.push(`  ${i + 1}. [${sim}% match] "${preview}..."`);
    });
    parts.push(`\nThese memories are stored on 0G decentralized storage with verifiable Merkle roots.`);
  } else {
    parts.push(`No relevant memories found yet. Keep chatting to build my memory!`);
  }

  return parts.join('\n');
}

export default AgentChat;
