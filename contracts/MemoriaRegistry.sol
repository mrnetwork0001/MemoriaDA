// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MemoriaRegistry
 * @notice On-chain registry mapping Agent IDs to their 0G Storage roots.
 *         Part of the Memoria DA — Decentralized Universal Agent Memory Protocol.
 * @dev Deploy on 0G Chain (Galileo testnet, chain ID 16600).
 */
contract MemoriaRegistry {
    struct Agent {
        address owner;
        string framework;
        bytes32 currentRoot;
        uint256 vectorCount;
        uint256 lastUpdated;
        bool exists;
    }

    mapping(string => Agent) private agents;
    string[] private agentIds;
    uint256 public agentCount;

    event AgentRegistered(
        string indexed agentId,
        address indexed owner,
        string framework
    );

    event MemoryUpdated(
        string indexed agentId,
        bytes32 rootHash,
        uint256 vectorCount,
        uint256 timestamp
    );

    modifier onlyAgentOwner(string calldata agentId) {
        require(agents[agentId].exists, "Agent not registered");
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        _;
    }

    /**
     * @notice Register a new agent in the protocol.
     * @param agentId Unique identifier for the agent (e.g., "agent_0xClaw_7f3a")
     * @param framework The agent framework name (e.g., "OpenClaw")
     */
    function registerAgent(
        string calldata agentId,
        string calldata framework
    ) external {
        require(!agents[agentId].exists, "Agent already registered");
        require(bytes(agentId).length > 0, "Agent ID cannot be empty");

        agents[agentId] = Agent({
            owner: msg.sender,
            framework: framework,
            currentRoot: bytes32(0),
            vectorCount: 0,
            lastUpdated: block.timestamp,
            exists: true
        });

        agentIds.push(agentId);
        agentCount++;

        emit AgentRegistered(agentId, msg.sender, framework);
    }

    /**
     * @notice Update the memory root for an agent after storing new vectors.
     * @param agentId The agent's unique identifier
     * @param rootHash The new 0G Storage root hash
     * @param vectorCount The updated total vector count
     */
    function updateMemoryRoot(
        string calldata agentId,
        bytes32 rootHash,
        uint256 vectorCount
    ) external onlyAgentOwner(agentId) {
        agents[agentId].currentRoot = rootHash;
        agents[agentId].vectorCount = vectorCount;
        agents[agentId].lastUpdated = block.timestamp;

        emit MemoryUpdated(agentId, rootHash, vectorCount, block.timestamp);
    }

    /**
     * @notice Get full agent details.
     */
    function getAgent(
        string calldata agentId
    ) external view returns (
        address owner,
        string memory framework,
        bytes32 currentRoot,
        uint256 vectorCount,
        uint256 lastUpdated
    ) {
        require(agents[agentId].exists, "Agent not found");
        Agent storage a = agents[agentId];
        return (a.owner, a.framework, a.currentRoot, a.vectorCount, a.lastUpdated);
    }

    /**
     * @notice Get just the storage root for an agent.
     */
    function getAgentRoot(
        string calldata agentId
    ) external view returns (bytes32) {
        require(agents[agentId].exists, "Agent not found");
        return agents[agentId].currentRoot;
    }

    /**
     * @notice Get total registered agent count.
     */
    function getAgentCount() external view returns (uint256) {
        return agentCount;
    }
}
