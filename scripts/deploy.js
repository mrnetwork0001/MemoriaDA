const hre = require("hardhat");

async main() {
  console.log("Starting deployment of MemoriaRegistry to 0G Galileo...");

  const MemoriaRegistry = await hre.ethers.getContractFactory("MemoriaRegistry");
  const registry = await MemoriaRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("--------------------------------------------------");
  console.log("✅ MemoriaRegistry deployed to:", address);
  console.log("--------------------------------------------------");
  console.log("Update your src/config/network.js with this address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
