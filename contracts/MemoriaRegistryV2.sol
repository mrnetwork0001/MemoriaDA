// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MemoriaRegistryV2
 * @notice Decentralized Agent Memory Registry with ERC-721 Identity NFTs,
 *         micropayment fees, and on-chain memory verification.
 *         Part of the Memoria DA — Decentralized Universal Agent Memory Protocol.
 * @dev Deployed on 0G Chain. Minimal ERC-721 implementation (no OpenZeppelin).
 */
contract MemoriaRegistryV2 {

    // ═══════════════════════════════════════════════════════════
    //  ERC-721 Core Storage
    // ═══════════════════════════════════════════════════════════

    string public name = "Memoria Agent Identity";
    string public symbol = "MAID";

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // ═══════════════════════════════════════════════════════════
    //  Memoria Registry Storage
    // ═══════════════════════════════════════════════════════════

    struct Agent {
        address owner;
        string framework;
        bytes32 currentRoot;
        uint256 vectorCount;
        uint256 lastUpdated;
        uint256 tokenId;
        uint256 totalFeePaid;
        bool exists;
    }

    mapping(string => Agent) private agents;
    string[] private agentIds;
    uint256 public agentCount;
    uint256 public totalMemoryUpdates;

    // Micropayment
    uint256 public memoryFee = 0.001 ether;
    address public owner;
    uint256 public totalFeesCollected;

    // Token ID tracking
    uint256 private _nextTokenId = 1;
    mapping(uint256 => string) private _tokenIdToAgentId;

    // ═══════════════════════════════════════════════════════════
    //  Events
    // ═══════════════════════════════════════════════════════════

    event AgentRegistered(
        string indexed agentId,
        address indexed agentOwner,
        string framework,
        uint256 tokenId
    );

    event MemoryUpdated(
        string indexed agentId,
        bytes32 rootHash,
        uint256 vectorCount,
        uint256 timestamp
    );

    event FeeCollected(
        string indexed agentId,
        uint256 amount
    );

    event MemoryFeeUpdated(uint256 oldFee, uint256 newFee);

    // ═══════════════════════════════════════════════════════════
    //  Modifiers
    // ═══════════════════════════════════════════════════════════

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyAgentOwner(string calldata agentId) {
        require(agents[agentId].exists, "Agent not registered");
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ═══════════════════════════════════════════════════════════
    //  Agent Registration (Mints NFT)
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Register a new agent and mint an identity NFT.
     * @param agentId Unique identifier (e.g., "agent_0xClaw_7f3a")
     * @param framework The agent framework name (e.g., "OpenClaw")
     */
    function registerAgent(
        string calldata agentId,
        string calldata framework
    ) external {
        require(!agents[agentId].exists, "Agent already registered");
        require(bytes(agentId).length > 0, "Agent ID cannot be empty");

        uint256 tokenId = _nextTokenId++;

        // Mint NFT
        _mint(msg.sender, tokenId);

        // Store agent data
        agents[agentId] = Agent({
            owner: msg.sender,
            framework: framework,
            currentRoot: bytes32(0),
            vectorCount: 0,
            lastUpdated: block.timestamp,
            tokenId: tokenId,
            totalFeePaid: 0,
            exists: true
        });

        agentIds.push(agentId);
        agentCount++;
        _tokenIdToAgentId[tokenId] = agentId;

        emit AgentRegistered(agentId, msg.sender, framework, tokenId);
    }

    // ═══════════════════════════════════════════════════════════
    //  Memory Operations (Payable)
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Update memory root. Requires micropayment fee.
     * @param agentId The agent's unique identifier
     * @param rootHash The new 0G Storage root hash
     * @param vectorCount The updated total vector count
     */
    function updateMemoryRoot(
        string calldata agentId,
        bytes32 rootHash,
        uint256 vectorCount
    ) external payable onlyAgentOwner(agentId) {
        require(msg.value >= memoryFee, "Insufficient memory fee");

        agents[agentId].currentRoot = rootHash;
        agents[agentId].vectorCount = vectorCount;
        agents[agentId].lastUpdated = block.timestamp;
        agents[agentId].totalFeePaid += msg.value;

        totalFeesCollected += msg.value;
        totalMemoryUpdates++;

        emit MemoryUpdated(agentId, rootHash, vectorCount, block.timestamp);
        emit FeeCollected(agentId, msg.value);
    }

    // ═══════════════════════════════════════════════════════════
    //  Verification
    // ═══════════════════════════════════════════════════════════

    /**
     * @notice Verify if a given root hash matches the on-chain record.
     * @param agentId The agent to verify
     * @param rootHash The root hash to check
     * @return isValid True if the root matches
     * @return storedRoot The currently stored root hash
     * @return lastUpdated Timestamp of last update
     */
    function verifyMemoryRoot(
        string calldata agentId,
        bytes32 rootHash
    ) external view returns (bool isValid, bytes32 storedRoot, uint256 lastUpdated) {
        require(agents[agentId].exists, "Agent not found");
        Agent storage a = agents[agentId];
        return (a.currentRoot == rootHash, a.currentRoot, a.lastUpdated);
    }

    // ═══════════════════════════════════════════════════════════
    //  Read Functions
    // ═══════════════════════════════════════════════════════════

    function getAgent(
        string calldata agentId
    ) external view returns (
        address agentOwner,
        string memory framework,
        bytes32 currentRoot,
        uint256 vectorCount,
        uint256 lastUpdated
    ) {
        require(agents[agentId].exists, "Agent not found");
        Agent storage a = agents[agentId];
        return (a.owner, a.framework, a.currentRoot, a.vectorCount, a.lastUpdated);
    }

    function getAgentFull(
        string calldata agentId
    ) external view returns (
        address agentOwner,
        string memory framework,
        bytes32 currentRoot,
        uint256 vectorCount,
        uint256 lastUpdated,
        uint256 tokenId,
        uint256 totalFeePaid
    ) {
        require(agents[agentId].exists, "Agent not found");
        Agent storage a = agents[agentId];
        return (a.owner, a.framework, a.currentRoot, a.vectorCount, a.lastUpdated, a.tokenId, a.totalFeePaid);
    }

    function getAgentRoot(string calldata agentId) external view returns (bytes32) {
        require(agents[agentId].exists, "Agent not found");
        return agents[agentId].currentRoot;
    }

    function getAgentCount() external view returns (uint256) {
        return agentCount;
    }

    function getAgentIdByIndex(uint256 index) external view returns (string memory) {
        require(index < agentIds.length, "Index out of bounds");
        return agentIds[index];
    }

    function getAgentByTokenId(uint256 tokenId) external view returns (
        string memory agentId,
        address agentOwner,
        string memory framework,
        bytes32 currentRoot,
        uint256 vectorCount
    ) {
        string memory id = _tokenIdToAgentId[tokenId];
        require(agents[id].exists, "Token not linked to agent");
        Agent storage a = agents[id];
        return (id, a.owner, a.framework, a.currentRoot, a.vectorCount);
    }

    function getMemoryFee() external view returns (uint256) {
        return memoryFee;
    }

    // ═══════════════════════════════════════════════════════════
    //  Admin
    // ═══════════════════════════════════════════════════════════

    function setMemoryFee(uint256 newFee) external onlyOwner {
        emit MemoryFeeUpdated(memoryFee, newFee);
        memoryFee = newFee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    // ═══════════════════════════════════════════════════════════
    //  ERC-721 Implementation
    // ═══════════════════════════════════════════════════════════

    function balanceOf(address tokenOwner) external view returns (uint256) {
        require(tokenOwner != address(0), "Zero address");
        return _balances[tokenOwner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner || _operatorApprovals[tokenOwner][msg.sender], "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator) public view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) external {
        transferFrom(from, to, tokenId);
    }

    /**
     * @notice On-chain SVG metadata for the Agent Identity NFT.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        string memory agentId = _tokenIdToAgentId[tokenId];
        Agent storage a = agents[agentId];

        // Build on-chain SVG
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="#0a0a0f"/>',
            '<rect x="10" y="10" width="380" height="380" rx="8" fill="none" stroke="#00ff88" stroke-width="1"/>',
            '<text x="200" y="60" text-anchor="middle" fill="#00ff88" font-size="16" font-family="monospace">MEMORIA DA</text>',
            '<text x="200" y="90" text-anchor="middle" fill="#00d4ff" font-size="12" font-family="monospace">AGENT IDENTITY NFT</text>',
            '<line x1="30" y1="110" x2="370" y2="110" stroke="#2a2a3a"/>',
            '<text x="30" y="150" fill="#8894b0" font-size="11" font-family="monospace">AGENT_ID:</text>',
            '<text x="30" y="170" fill="#e0e0e0" font-size="13" font-family="monospace">', agentId, '</text>',
            '<text x="30" y="210" fill="#8894b0" font-size="11" font-family="monospace">FRAMEWORK:</text>',
            '<text x="30" y="230" fill="#a855f7" font-size="13" font-family="monospace">', a.framework, '</text>',
            '<text x="30" y="270" fill="#8894b0" font-size="11" font-family="monospace">VECTORS:</text>',
            '<text x="30" y="290" fill="#00ff88" font-size="18" font-family="monospace">', _toString(a.vectorCount), '</text>',
            '<text x="200" y="360" text-anchor="middle" fill="#4b5563" font-size="10" font-family="monospace">TOKEN #', _toString(tokenId), ' | 0G CHAIN</text>',
            '</svg>'
        ));

        // Base64 encode (simplified — just return raw SVG data URI)
        return string(abi.encodePacked("data:image/svg+xml;utf8,", svg));
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd  // ERC-721
            || interfaceId == 0x01ffc9a7; // ERC-165
    }

    // ═══════════════════════════════════════════════════════════
    //  Internal ERC-721 Helpers
    // ═══════════════════════════════════════════════════════════

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Mint to zero address");
        require(_owners[tokenId] == address(0), "Token already minted");
        _balances[to]++;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Not token owner");
        require(to != address(0), "Transfer to zero address");

        delete _tokenApprovals[tokenId];
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;

        // Transfer agent ownership along with the NFT
        string memory agentId = _tokenIdToAgentId[tokenId];
        if (agents[agentId].exists) {
            agents[agentId].owner = to;
        }

        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address tokenOwner = ownerOf(tokenId);
        return (spender == tokenOwner || getApproved(tokenId) == spender || isApprovedForAll(tokenOwner, spender));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }
}
