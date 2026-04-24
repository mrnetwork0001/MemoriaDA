// ============================================================
// Memoria DA — Protocol Constants
// ============================================================

// Vector embedding dimensions
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL = 'text-embedding-3-small';

// Protocol version
export const PROTOCOL_VERSION = 'v0.1.0-α';

// Agent defaults
export const DEFAULT_AGENT_FRAMEWORK = 'OpenClaw';
export const DEFAULT_TOP_K = 10;

// Storage
export const UPLOAD_OPTIONS = {
  taskSize: 1,
  expectedReplica: 1,
  finalityRequired: false,
  tags: '0x',
  skipTx: false,
};

// MemoriaRegistry ABI (for the on-chain Agent → StorageRoot mapping)
export const MEMORIA_REGISTRY_ABI = [
  'function registerAgent(string agentId, string framework) external',
  'function updateMemoryRoot(string agentId, bytes32 rootHash, uint256 vectorCount) external',
  'function getAgent(string agentId) external view returns (address owner, string framework, bytes32 currentRoot, uint256 vectorCount, uint256 lastUpdated)',
  'function getAgentRoot(string agentId) external view returns (bytes32)',
  'function getAgentCount() external view returns (uint256)',
  'event AgentRegistered(string indexed agentId, address indexed owner, string framework)',
  'event MemoryUpdated(string indexed agentId, bytes32 rootHash, uint256 vectorCount, uint256 timestamp)',
];

export default {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  PROTOCOL_VERSION,
  DEFAULT_AGENT_FRAMEWORK,
  DEFAULT_TOP_K,
  UPLOAD_OPTIONS,
  MEMORIA_REGISTRY_ABI,
};
