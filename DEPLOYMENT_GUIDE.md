# Deployment Guide

Complete guide for deploying FHEVM smart contracts to different networks.

---

## Overview

This guide covers:
- Local development deployment
- Sepolia testnet deployment
- Contract verification
- Deployment best practices
- Troubleshooting

---

## Prerequisites

### Required

- Node.js 20+
- npm or yarn
- MetaMask or compatible wallet
- FHEVM-compatible network RPC URL

### Optional

- Etherscan account for verification
- Infura or Alchemy account for RPC

---

## Environment Setup

### Create .env File

```bash
# .env (never commit this!)
INFURA_API_KEY=your_infura_key_here
ALCHEMY_API_KEY=your_alchemy_key_here
MNEMONIC=your_wallet_mnemonic_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

### Load Environment Variables

```typescript
// hardhat.config.ts
import * as dotenv from "dotenv";

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
```

### Set Hardhat Variables

```bash
# Interactive setup
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set MNEMONIC
npx hardhat vars set ETHERSCAN_API_KEY
```

---

## Local Development

### Start Local Network

```bash
# In one terminal - start Hardhat network
npx hardhat node
```

### Deploy to Local Network

```bash
# In another terminal
npx hardhat deploy --network localhost
```

### Interact with Deployed Contract

```typescript
// scripts/interact.ts
import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0x...";  // From deployment output
    const Contract = await ethers.getContractFactory("YourContract");
    const contract = Contract.attach(contractAddress);

    // Call functions
    const result = await contract.someFunction();
    console.log("Result:", result);
}

main().catch(console.error);
```

Run interaction script:
```bash
npx hardhat run scripts/interact.ts --network localhost
```

---

## Sepolia Testnet Deployment

### 1. Get Testnet Funds

Get Sepolia ETH from:
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

Verify funds:
```bash
# Check balance
npx hardhat run scripts/check-balance.ts --network sepolia
```

### 2. Configure Sepolia Network

```typescript
// hardhat.config.ts
const config: HardhatUserConfig = {
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: MNEMONIC ? [MNEMONIC] : [],
            chainId: 11155111,
        },
    },
};
```

### 3. Deploy Contract

```bash
# Deploy to Sepolia
npx hardhat deploy --network sepolia
```

**Output:**
```
Deploying YourContract...
✅ YourContract deployed to: 0x1234567890123456789012345678901234567890
```

### 4. Save Contract Address

```typescript
// .deployments.json (not committed)
{
    "sepolia": {
        "YourContract": "0x1234567890123456789012345678901234567890"
    }
}
```

---

## Deployment Scripts

### Basic Deployment Script

```typescript
// deploy/00-deploy.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployYourContract: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log("Deploying YourContract with account:", deployer);

    const deployment = await deploy("YourContract", {
        from: deployer,
        args: [],  // Constructor arguments if any
        log: true,
        autoMine: true,
    });

    console.log("YourContract deployed to:", deployment.address);

    return deployment.address;
};

deployYourContract.tags = ["YourContract"];
export default deployYourContract;
```

### Advanced Deployment Script

```typescript
// deploy/01-deploy-with-verification.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, ethers, network } = hre;
    const { deploy, save } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log(`Deploying to ${network.name}...`);

    // Deploy
    const result = await deploy("YourContract", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.name === "sepolia" ? 2 : 1,
    });

    console.log(`✅ YourContract deployed to: ${result.address}`);

    // Verify on Etherscan
    if (network.name === "sepolia" && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract on Etherscan...");
        try {
            await hre.run("verify:verify", {
                address: result.address,
                constructorArguments: [],
            });
            console.log("✅ Contract verified!");
        } catch (error) {
            console.log("Verification failed:", error);
        }
    }

    return result.address;
};

deploy.tags = ["YourContract"];
export default deploy;
```

---

## Contract Verification

### Automatic Verification

```typescript
// Included in deployment script above
if (network.name === "sepolia") {
    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
    });
}
```

### Manual Verification

```bash
# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Example
npx hardhat verify --network sepolia 0x1234567890123456789012345678901234567890
```

### Verify Complex Arguments

```bash
# Create args file
npx hardhat verify --network sepolia 0x123... --constructor-args-file args.js
```

Where `args.js` contains:
```javascript
module.exports = [
    "0xaddress",
    123,
    "string argument",
];
```

---

## Testing Before Deployment

### Pre-Deployment Checklist

```bash
# Compile
npm run compile

# Check for warnings
npm run lint

# Run tests
npm run test

# Check gas usage
npm run coverage

# Verify on local network first
npx hardhat deploy --network localhost
```

### Deployment Simulation

```bash
# Test deployment without actually deploying
npx hardhat deploy --network sepolia --tags YourContract --dry-run
```

---

## Post-Deployment

### Verify Deployment

```typescript
// scripts/verify-deployment.ts
import { ethers } from "hardhat";

async function main() {
    const contractAddress = process.argv[2];
    if (!contractAddress) {
        console.error("Usage: npx hardhat run scripts/verify-deployment.ts --network sepolia <ADDRESS>");
        process.exit(1);
    }

    const Contract = await ethers.getContractFactory("YourContract");
    const contract = Contract.attach(contractAddress);

    console.log("✅ Contract is accessible at:", contractAddress);
    console.log("Network:", (await ethers.provider.getNetwork()).name);

    // Call view functions to verify
    try {
        const result = await contract.someViewFunction();
        console.log("✅ Contract is operational");
        console.log("Result:", result);
    } catch (error) {
        console.error("❌ Contract may not be operational:", error.message);
    }
}

main().catch(console.error);
```

Run:
```bash
npx hardhat run scripts/verify-deployment.ts --network sepolia 0x123...
```

### Save Deployment Information

```typescript
// Create deployment record
const deploymentInfo = {
    contract: "YourContract",
    network: "sepolia",
    address: "0x123...",
    deployer: "0xabc...",
    deploymentTx: "0xdef...",
    blockNumber: 12345,
    timestamp: new Date().toISOString(),
    verificationUrl: "https://sepolia.etherscan.io/address/0x123...",
};

// Save to file
fs.writeFileSync(
    `deployments/sepolia-YourContract.json`,
    JSON.stringify(deploymentInfo, null, 2)
);
```

---

## Upgrade Patterns

### Using Proxy Pattern (Optional)

```typescript
// deploy with UUPS proxy
const deployment = await deploy("YourContractProxy", {
    from: deployer,
    args: [],
    log: true,
    proxy: {
        proxyContract: "UUPS",
        execute: {
            init: {
                methodName: "initialize",
                args: [],
            },
        },
    },
});
```

---

## Common Issues

### Issue: "Insufficient Funds"

**Solution:**
1. Verify account has ETH
2. Check correct network
3. Get testnet ETH from faucet

```bash
npx hardhat run scripts/check-balance.ts --network sepolia
```

### Issue: "Transaction Failed"

**Possible Causes:**
- Out of gas
- Contract revert
- Network congestion
- Invalid parameters

**Solution:**
```bash
# Check gas estimate
npx hardhat run scripts/estimate-gas.ts --network localhost

# Look at revert reason in logs
npx hardhat run scripts/deploy.ts --network sepolia --verbose
```

### Issue: "Contract Verification Failed"

**Solution:**
1. Wait 10+ blocks before verifying
2. Ensure exact constructor arguments
3. Use correct Solidity version
4. Check Etherscan API key

```bash
# Try manual verification
npx hardhat verify --network sepolia <ADDRESS>
```

### Issue: "Network RPC Not Responding"

**Solution:**
1. Check RPC URL is correct
2. Try different RPC provider
3. Check network status

```typescript
// Test RPC connection
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const blockNumber = await provider.getBlockNumber();
console.log("Latest block:", blockNumber);
```

---

## Gas Optimization for Deployment

### Check Deployment Gas Usage

```typescript
const deployment = await deploy("YourContract", {
    from: deployer,
    args: [],
    log: true,
});

const receipt = await ethers.provider.getTransactionReceipt(deployment.transactionHash);
console.log("Deployment gas used:", receipt.gasUsed.toString());
```

### Optimize Constructor

```solidity
// ❌ Inefficient
contract Bad {
    uint256[] public items;

    constructor() {
        for (uint i = 0; i < 1000; i++) {
            items.push(i);  // Expensive!
        }
    }
}

// ✅ Efficient
contract Good {
    uint256[] public items;

    constructor() {}

    function initialize() external {
        // Initialize later if needed
    }
}
```

---

## Monitoring Deployment

### Track Deployment Status

```typescript
// scripts/monitor-deployment.ts
import { ethers } from "hardhat";

async function monitorDeployment(txHash: string) {
    const provider = ethers.provider;

    // Wait for confirmation
    const receipt = await provider.waitForTransaction(txHash, 2);  // 2 confirmations

    if (receipt?.status === 1) {
        console.log("✅ Deployment successful!");
        console.log("Contract address:", receipt.contractAddress);
        console.log("Gas used:", receipt.gasUsed.toString());
    } else {
        console.log("❌ Deployment failed!");
    }

    return receipt;
}
```

---

## Deployment Checklist

Before deploying to mainnet:

- [ ] Code is thoroughly tested
- [ ] All tests pass
- [ ] Security audit completed
- [ ] Contracts are verified on testnet
- [ ] Gas usage is optimized
- [ ] Constructor arguments are correct
- [ ] Permissions are properly configured
- [ ] Deployment script is tested
- [ ] Rollback plan exists
- [ ] Emergency pause mechanisms in place

---

## Best Practices

### DO ✅
- ✅ Deploy to local first
- ✅ Test on testnet thoroughly
- ✅ Verify contracts on block explorer
- ✅ Keep deployment records
- ✅ Use deployment scripts
- ✅ Wait for confirmations
- ✅ Test with actual network
- ✅ Save deployment info
- ✅ Monitor transactions
- ✅ Have upgrade plan

### DON'T ❌
- ❌ Deploy unverified code
- ❌ Use test accounts for production
- ❌ Hardcode values
- ❌ Skip testnet
- ❌ Deploy during network congestion
- ❌ Use high gas prices unnecessarily
- ❌ Deploy from untested contracts
- ❌ Forget to verify
- ❌ Store sensitive keys in code
- ❌ Deploy without backups

---

## Resources

- [Hardhat Deployment Documentation](https://hardhat.org/hardhat-runner/docs/guides/deploying)
- [Etherscan API Docs](https://docs.etherscan.io/)
- [FHEVM Deployment Guide](https://docs.zama.ai/fhevm/deployment)

---

## Next Steps

After successful deployment:
1. Monitor contract interactions
2. Keep track of upgrades
3. Monitor gas usage over time
4. Engage with users
5. Plan for maintenance

---

**Next:** See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing before deployment.
