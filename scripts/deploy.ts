import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Counter contract...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy Counter contract
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy(100);

  await counter.deployed();
  console.log("Counter deployed to:", counter.address);

  // Verify deployment
  const counterAddress = counter.address;
  console.log("✓ Counter contract deployed successfully");
  console.log("✓ Contract address:", counterAddress);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    counter: counterAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
