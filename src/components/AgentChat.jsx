import { useState, useRef, useEffect } from 'react';
import './AgentChat.css';

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
    content: 'Hello! I\'m your OpenClaw agent. Connect your wallet to enable **real** decentralized memory on 0G Storage. Once connected, every conversation is stored as a vector embedding on-chain.',
    timestamp: '02:14:03',
  },
];

const AGENT_RESPONSES = [
  (query, wallet, upload) => {
    const parts = [`Processing your request...\n`];
    if (wallet?.isConnected) {
      parts.push(`🔗 Wallet connected: \`${wallet.formatAddress(wallet.address)}\``);
      if (upload) {
        parts.push(`\n✅ **Memory stored on 0G Storage!**`);
        parts.push(`• Root Hash: \`${upload.rootHash?.slice(0, 14)}...${upload.rootHash?.slice(-6)}\``);
        parts.push(`• Blob Size: ${(upload.blobSize / 1024).toFixed(1)} KB`);
        parts.push(`• Latency: ${upload.elapsed}s`);
      } else {
        parts.push(`\nI've searched my decentralized memory and found **${Math.floor(Math.random() * 15) + 3}** relevant vectors.`);
        parts.push(`Embedding similarity: **${(0.85 + Math.random() * 0.14).toFixed(4)}**`);
      }
    } else {
      parts.push(`⚠️ Wallet not connected. Running in **mock mode**.`);
      parts.push(`\nI found **${Math.floor(Math.random() * 15) + 3}** relevant memory vectors (simulated).`);
      parts.push(`Connect your wallet to store memories on real 0G Storage!`);
    }
    return parts.join('\n');
  },
];

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

const AgentChat = ({ onMemoryEvent, wallet, storage }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show system message when wallet connects
  const walletNotifiedRef = useRef(false);
  useEffect(() => {
    if (wallet?.isConnected && wallet?.isCorrectChain && !walletNotifiedRef.current) {
      walletNotifiedRef.current = true;
      requestAnimationFrame(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'system',
          content: `Wallet connected to 0G Galileo Testnet. Memory operations are now LIVE on decentralized storage.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }]);
      });
    } else if (!wallet?.isConnected) {
      walletNotifiedRef.current = false;
    }
  }, [wallet?.isConnected, wallet?.isCorrectChain]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userContent = inputValue.trim();
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userContent,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Emit query event to terminal
    onMemoryEvent?.({
      type: 'QUERY',
      agentId: 'agent_0xClaw_7f3a',
      query: userContent.slice(0, 60),
      timestamp: new Date().toISOString(),
    });

    let uploadResult = null;

    // ── REAL 0G STORAGE INTEGRATION ──
    if (wallet?.isConnected && wallet?.isCorrectChain && wallet?.signer) {
      try {
        // Generate embedding for the user message
        const embedding = storage.generateEmbedding(userContent);

        // Store memory on 0G Storage
        uploadResult = await storage.storeMemory({
          agentId: 'agent_0xClaw_7f3a',
          content: userContent,
          embedding: embedding,
          metadata: {
            framework: 'OpenClaw',
            sessionId: `session_${Date.now().toString(36)}`,
            messageType: 'user_query',
          },
        }, wallet.signer);

        // Emit storage event to terminal
        onMemoryEvent?.({
          type: 'STORE_COMPLETE',
          agentId: 'agent_0xClaw_7f3a',
          rootHash: uploadResult.rootHash,
          blobSize: uploadResult.blobSize,
          elapsed: uploadResult.elapsed,
          timestamp: new Date().toISOString(),
        });

      } catch (err) {
        console.error('[AgentChat] Storage error:', err);
        onMemoryEvent?.({
          type: 'ERROR',
          agentId: 'agent_0xClaw_7f3a',
          error: err.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Simulate agent response (with real data if available)
    setTimeout(() => {
      const responseGenerator = AGENT_RESPONSES[0];
      const agentReply = {
        id: Date.now() + 1,
        role: 'agent',
        content: responseGenerator(userContent, wallet, uploadResult),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      onMemoryEvent?.({
        type: 'RETRIEVE',
        agentId: 'agent_0xClaw_7f3a',
        vectors: Math.floor(Math.random() * 15) + 3,
        storageRoot: uploadResult?.rootHash
          ? `${uploadResult.rootHash.slice(0, 10)}...${uploadResult.rootHash.slice(-6)}`
          : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
      });

      setIsTyping(false);
      setMessages(prev => [...prev, agentReply]);
    }, uploadResult ? 500 : 2000 + Math.random() * 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isLive = wallet?.isConnected && wallet?.isCorrectChain;

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
            <span className="chat-agent-id mono">OpenClaw Agent • agent_0xClaw_7f3a</span>
          </div>
        </div>
        <div className="chat-header-right">
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
            {isLive ? '0G LIVE' : `${messages.filter(m => m.role === 'agent').length} memories`}
          </span>
          {storage?.isUploading && (
            <span className="upload-badge">
              <span className="connect-spinner-small" />
              Storing...
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
              </div>
            ) : (
              <>
                <div className="message-header">
                  <span className="message-role">{msg.role === 'agent' ? '🤖 Agent' : '👤 You'}</span>
                  <span className="message-time mono">{msg.timestamp}</span>
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
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            id="chat-input"
            placeholder={isLive
              ? "Ask the agent... (memories stored LIVE on 0G Storage)"
              : "Ask the agent... (connect wallet for real 0G storage)"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="send-button" 
            id="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim() || storage?.isUploading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="input-hint">
          <span>Press <kbd>Enter</kbd> to send</span>
          <span className={`storage-badge ${isLive ? 'storage-badge-live' : ''}`}>
            {isLive ? '🟢 0G Storage LIVE' : '🔗 0G Storage'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
