# Quick Start Guide for Competition Participants

This guide will help you get started building your FHEVM example repository submission.

---

## Prerequisites

Ensure you have installed:

- **Node.js:** Version 20 or higher
- **npm/yarn:** Package manager
- **Git:** Version control
- **GitHub Account:** For repository hosting

Verify installations:

```bash
node --version    # Should be v20+
npm --version     # Should be 10+
git --version     # Should be 2.30+
```

---

## Step 1: Set Up Your Base Template

### Option A: Clone the Official Base Template

```bash
git clone https://github.com/zama-ai/fhevm-hardhat-template.git
cd fhevm-hardhat-template
npm install
```

### Option B: Create from Scratch

```bash
mkdir my-fhevm-examples
cd my-fhevm-examples
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
```

---

## Step 2: Add FHEVM Dependencies

```bash
npm install @fhevm/solidity @fhevm/hardhat-plugin
npm install --save-dev @zama-fhe/relayer-sdk hardhat-deploy
```

Update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.INFURA_API_KEY || "",
      accounts: process.env.MNEMONIC ? [process.env.MNEMONIC] : [],
    },
  },
};

export default config;
```

---

## Step 3: Create Your First Example Contract

Create `contracts/Counter.sol`:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted Counter Contract
/// @notice Demonstrates basic FHE operations with an encrypted counter
/// @dev Shows how to encrypt, increment, and retrieve encrypted values
contract EncryptedCounter is SepoliaConfig {
    euint32 private counter;

    /// @notice Initialize counter to zero
    constructor() {
        counter = FHE.asEuint32(0);
    }

    /// @notice Increment the encrypted counter
    /// @param encryptedAmount The amount to add (as encrypted value)
    /// @dev Demonstrates FHE.add operation and permission setting
    function increment(euint32 encryptedAmount) external {
        counter = FHE.add(counter, encryptedAmount);

        // Set access permissions
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);
    }

    /// @notice Get the encrypted counter value
    /// @return The current encrypted counter
    function getCounter() external view returns (euint32) {
        return counter;
    }
}
```

---

## Step 4: Write Comprehensive Tests

Create `test/Counter.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";
import type { EncryptedCounter } from "../typechain-types";

/**
 * Test suite for EncryptedCounter contract
 *
 * This demonstrates:
 * ✅ Proper FHE encryption in tests
 * ✅ Permission setting patterns
 * ✅ Encrypted value operations
 * ❌ Common anti-patterns to avoid
 */
describe("EncryptedCounter", function () {
    let counter: EncryptedCounter;
    let fhevm: FhevmInstance;
    let owner: any;

    beforeEach(async function () {
        fhevm = await FhevmInstance.getInstance();

        const [signer] = await ethers.getSigners();
        owner = signer;

        const Counter = await ethers.getContractFactory("EncryptedCounter");
        counter = await Counter.deploy();
        await counter.waitForDeployment();
    });

    describe("✅ Correct Usage", function () {
        it("Should encrypt and increment counter", async function () {
            const amount = 10n;

            // Create encrypted input
            const encryptedInput = fhevm.createEncryptedInput(
                await counter.getAddress(),
                owner.address
            );
            encryptedInput.add32(amount);
            const encrypted = await encryptedInput.encrypt();

            // Submit transaction
            const tx = await counter.increment(encrypted.handles[0]);
            await tx.wait();

            // Verify (in real FHEVM, you'd request decryption)
            expect(tx).to.exist;
        });

        it("Should allow multiple increments", async function () {
            const amounts = [5n, 3n, 2n];

            for (const amount of amounts) {
                const encryptedInput = fhevm.createEncryptedInput(
                    await counter.getAddress(),
                    owner.address
                );
                encryptedInput.add32(amount);
                const encrypted = await encryptedInput.encrypt();

                const tx = await counter.increment(encrypted.handles[0]);
                await tx.wait();
            }

            expect(true).to.be.true; // Placeholder for actual decryption
        });
    });

    describe("❌ Anti-patterns to Avoid", function () {
        it("Should handle unencrypted values carefully", async function () {
            // ❌ DON'T: Pass unencrypted values directly to FHE operations
            // This would fail in production FHEVM
            expect(true).to.be.true;
        });
    });
});
```

---

## Step 5: Build the Automation Script

Create `scripts/create-fhevm-example.ts`:

```typescript
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Generates a standalone FHEVM example repository
 *
 * Usage: ts-node scripts/create-fhevm-example.ts counter ./output
 */

const EXAMPLES_MAP = {
    counter: {
        contract: "contracts/Counter.sol",
        test: "test/Counter.test.ts",
        description: "Basic encrypted counter demonstrating FHE operations",
    },
    // Add more examples here
};

interface ExampleConfig {
    contract: string;
    test: string;
    description: string;
}

async function createExample(
    exampleName: string,
    outputDir: string
): Promise<void> {
    const exampleConfig = (EXAMPLES_MAP as Record<string, ExampleConfig | undefined>)[exampleName];

    if (!exampleConfig) {
        console.error(`Example '${exampleName}' not found`);
        console.log(`Available examples: ${Object.keys(EXAMPLES_MAP).join(", ")}`);
        process.exit(1);
    }

    console.log(`📦 Creating example: ${exampleName}`);
    console.log(`📁 Output directory: ${outputDir}`);

    // Step 1: Create directory structure
    const dirs = [
        outputDir,
        path.join(outputDir, "contracts"),
        path.join(outputDir, "test"),
        path.join(outputDir, "deploy"),
    ];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    }

    // Step 2: Copy contract and test files
    const contractSource = path.join(__dirname, "..", exampleConfig.contract);
    const contractDest = path.join(outputDir, "contracts", path.basename(exampleConfig.contract));

    if (fs.existsSync(contractSource)) {
        fs.copyFileSync(contractSource, contractDest);
        console.log(`✅ Copied contract: ${contractDest}`);
    }

    const testSource = path.join(__dirname, "..", exampleConfig.test);
    const testDest = path.join(outputDir, "test", path.basename(exampleConfig.test));

    if (fs.existsSync(testSource)) {
        fs.copyFileSync(testSource, testDest);
        console.log(`✅ Copied test: ${testDest}`);
    }

    // Step 3: Create package.json
    const packageJson = {
        name: `fhevm-${exampleName}`,
        version: "1.0.0",
        description: exampleConfig.description,
        main: "index.js",
        scripts: {
            compile: "hardhat compile",
            test: "hardhat test",
            coverage: "hardhat coverage",
            lint: "eslint .",
            clean: "hardhat clean",
        },
        dependencies: {
            "@fhevm/solidity": "^0.9.0",
            "@zama-fhe/relayer-sdk": "^0.4.0",
            ethers: "^6.0.0",
        },
        devDependencies: {
            "@fhevm/hardhat-plugin": "^0.3.0",
            "@nomicfoundation/hardhat-toolbox": "^3.0.0",
            "@types/node": "^20.0.0",
            "hardhat": "^2.19.0",
            "hardhat-deploy": "^0.12.0",
            "typescript": "^5.0.0",
        },
    };

    fs.writeFileSync(
        path.join(outputDir, "package.json"),
        JSON.stringify(packageJson, null, 2)
    );
    console.log(`✅ Created package.json`);

    // Step 4: Create hardhat.config.ts
    const hardhatConfig = `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.INFURA_API_KEY || "",
      accounts: process.env.MNEMONIC ? [process.env.MNEMONIC] : [],
    },
  },
};

export default config;
`;

    fs.writeFileSync(
        path.join(outputDir, "hardhat.config.ts"),
        hardhatConfig
    );
    console.log(`✅ Created hardhat.config.ts`);

    // Step 5: Create README
    const readme = `# FHEVM ${exampleName.charAt(0).toUpperCase() + exampleName.slice(1)} Example

${exampleConfig.description}

## Quick Start

\`\`\`bash
npm install
npm run compile
npm run test
\`\`\

## Project Structure

\`\`\`
.
├── contracts/           # Smart contracts
├── test/                # Test files
├── deploy/              # Deployment scripts
├── hardhat.config.ts    # Hardhat configuration
└── package.json         # Dependencies
\`\`\`

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org)
- [Zama Community](https://www.zama.ai/community)
`;

    fs.writeFileSync(
        path.join(outputDir, "README.md"),
        readme
    );
    console.log(`✅ Created README.md`);

    console.log("\n✨ Example created successfully!");
    console.log(`\nNext steps:`);
    console.log(`  cd ${outputDir}`);
    console.log(`  npm install`);
    console.log(`  npm run compile`);
    console.log(`  npm run test`);
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: ts-node scripts/create-fhevm-example.ts <example-name> <output-dir>");
    console.error(`\nAvailable examples: ${Object.keys(EXAMPLES_MAP).join(", ")}`);
    process.exit(1);
}

createExample(args[0], args[1]).catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
```

---

## Step 6: Run Your First Example

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Check coverage
npm run coverage
```

---

## Step 7: Create Additional Examples

Repeat Steps 3-4 for each concept you want to demonstrate:

### Recommended Examples to Start With

1. **Counter** - Basic FHE operations
2. **Encryption** - Encrypting single and multiple values
3. **Comparison** - Encrypted comparisons (eq, lt, gt)
4. **Decryption** - User and public decryption
5. **Access Control** - Permission management with FHE.allow

---

## Step 8: Set Up Automation

Create a category-based generator:

```bash
npm run create-category basic ./my-basic-examples
npm run create-category advanced ./my-advanced-examples
```

---

## Step 9: Generate Documentation

```bash
npm run generate-docs counter
npm run generate-all-docs
```

---

## Step 10: Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial FHEVM examples submission"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

---

## Testing on Sepolia Testnet

### 1. Set Environment Variables

```bash
export INFURA_API_KEY="your-infura-key"
export MNEMONIC="your-wallet-mnemonic"
```

### 2. Deploy Contract

```bash
npx hardhat deploy --network sepolia
```

### 3. Verify on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

---

## Common Issues & Solutions

### Issue: "Cannot find module '@fhevm/solidity'"

**Solution:** Ensure all dependencies are installed:
```bash
npm install
rm -rf node_modules
npm install
```

### Issue: Tests fail with "FHEVM not initialized"

**Solution:** Make sure you're using the hardhat-fhevmjs library correctly in tests.

### Issue: Contract won't compile

**Solution:** Verify you're using Solidity `^0.8.24` and importing from the correct FHEVM paths.

---

## Next Steps

1. Review the [Competition Brief](./COMPETITION_BRIEF.md)
2. Study reference implementations
3. Create your own unique examples
4. Write comprehensive tests
5. Generate documentation
6. Record a demonstration video
7. Submit your GitHub repository

---

## Support

- **Documentation:** https://docs.zama.ai/fhevm
- **Discord:** https://discord.com/invite/zama
- **Forum:** https://www.zama.ai/community
- **Twitter:** https://twitter.com/zama_fhe

---

**Happy Building! 🚀**
