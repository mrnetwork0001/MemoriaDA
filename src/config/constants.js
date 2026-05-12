// ============================================================
// Memoria DA — Protocol Constants
// ============================================================

// Vector embedding dimensions
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL = 'text-embedding-3-small';

// Protocol version
export const PROTOCOL_VERSION = 'v0.2.0';

// Agent defaults
export const DEFAULT_AGENT_FRAMEWORK = 'OpenClaw';
export const DEFAULT_TOP_K = 10;
export const ACTIVE_AGENT_ID = 'agent_0xClaw_7f3e';

// Memory fee (must match contract: 0.001 ether)
export const MEMORY_FEE = '0.001';

// Storage
export const UPLOAD_OPTIONS = {
  taskSize: 1,
  expectedReplica: 1,
  finalityRequired: false,
  tags: '0x',
  skipTx: false,
};

// MemoriaRegistryV2 ABI — ERC-721 + Micropayments + Verification
export const MEMORIA_REGISTRY_ABI = [
  // Agent Management
  'function registerAgent(string agentId, string framework) external',
  'function updateMemoryRoot(string agentId, bytes32 rootHash, uint256 vectorCount) external payable',
  
  // Read Functions
  'function getAgent(string agentId) external view returns (address agentOwner, string framework, bytes32 currentRoot, uint256 vectorCount, uint256 lastUpdated)',
  'function getAgentFull(string agentId) external view returns (address agentOwner, string framework, bytes32 currentRoot, uint256 vectorCount, uint256 lastUpdated, uint256 tokenId, uint256 totalFeePaid)',
  'function getAgentRoot(string agentId) external view returns (bytes32)',
  'function getAgentCount() external view returns (uint256)',
  'function getAgentIdByIndex(uint256 index) external view returns (string)',
  'function getAgentByTokenId(uint256 tokenId) external view returns (string agentId, address agentOwner, string framework, bytes32 currentRoot, uint256 vectorCount)',
  
  // Verification
  'function verifyMemoryRoot(string agentId, bytes32 rootHash) external view returns (bool isValid, bytes32 storedRoot, uint256 lastUpdated)',
  
  // Micropayment
  'function getMemoryFee() external view returns (uint256)',
  'function memoryFee() external view returns (uint256)',
  'function totalFeesCollected() external view returns (uint256)',
  'function totalMemoryUpdates() external view returns (uint256)',
  
  // ERC-721
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  
  // Events
  'event AgentRegistered(string indexed agentId, address indexed agentOwner, string framework, uint256 tokenId)',
  'event MemoryUpdated(string indexed agentId, bytes32 rootHash, uint256 vectorCount, uint256 timestamp)',
  'event FeeCollected(string indexed agentId, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

export default {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  PROTOCOL_VERSION,
  DEFAULT_AGENT_FRAMEWORK,
  DEFAULT_TOP_K,
  MEMORY_FEE,
  UPLOAD_OPTIONS,
  MEMORIA_REGISTRY_ABI,
};
