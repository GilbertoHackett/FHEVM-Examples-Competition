import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Counter contract...");

  const CounterFactory = await ethers.getContractFactory("Counter");
  const counter = await CounterFactory.deploy(0);

  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log("Counter deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
