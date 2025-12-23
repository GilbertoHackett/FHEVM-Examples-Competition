# Developer Workflow Guide

This guide walks you through the complete development workflow for creating and testing FHEVM examples.

## Table of Contents

1. [Setup](#setup)
2. [Creating Examples](#creating-examples)
3. [Testing](#testing)
4. [Documentation](#documentation)
5. [Deployment](#deployment)
6. [Automation Scripts](#automation-scripts)

---

## Setup

### Initial Setup

```bash
# 1. Clone/download the repository
git clone https://github.com/yourusername/fhevm-examples.git
cd fhevm-examples

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your settings (optional for local testing)

# 4. Verify everything works
npm run compile
npm run test
```

### Project Structure

```
fhevm-examples/
├── contracts/                 # Smart contracts
├── test/                      # Test files
├── scripts/                   # Automation tools
├── base-template/             # Template for new projects
├── examples/                  # Generated documentation
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
└── README.md                  # Project documentation
```

---

## Creating Examples

### Step 1: Create Your Smart Contract

Create a new contract file in `contracts/` directory:

**File: `contracts/MyExample.sol`**

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "@fhevm/contracts/FHEVMConfig.sol";

/**
 * @title MyExample
 * @notice Brief description of your contract
 * @dev More detailed description and implementation notes
 */
contract MyExample is SepoliaConfig {
    // Your implementation here
}
```

**Key Points:**

- Use BSD-3-Clause-Clear license
- Include JSDoc comments with @title, @notice, @dev
- Inherit from appropriate FHEVM config
- Add @param and @return documentation

### Step 2: Create Comprehensive Tests

Create a test file in `test/` directory:

**File: `test/MyExample.test.ts`**

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyExample } from "../typechain-types";

describe("MyExample", function () {
  let contract: MyExample;
  let owner: any;

  before(async function () {
    [owner] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("MyExample");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await contract.getAddress();
      expect(address).to.exist;
    });
  });

  describe("Functionality", function () {
    it("Should perform expected operations", async function () {
      // Your test implementation
    });
  });

  describe("Edge Cases", function () {
    it("Should handle edge cases correctly", async function () {
      // Edge case testing
    });
  });
});
```

**Test Best Practices:**

- ✅ Test successful operations
- ✅ Test error conditions
- ✅ Test permission checks
- ✅ Include setup and teardown
- ✅ Use descriptive test names
- ✅ Add comments explaining complex tests

### Step 3: Update Automation Script Configurations

Update `scripts/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  // ...existing examples...
  'my-example': {
    contract: 'contracts/MyExample.sol',
    test: 'test/MyExample.test.ts',
    description: 'Brief description of your example',
  },
};
```

Update `scripts/generate-docs.ts`:

```typescript
const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
  // ...existing examples...
  'my-example': {
    title: 'My Example',
    description: 'Detailed description of what this example demonstrates',
    contract: 'contracts/MyExample.sol',
    test: 'test/MyExample.test.ts',
    output: 'examples/my-example.md',
    category: 'Your Category',
  },
};
```

---

## Testing

### Run All Tests

```bash
npm run test
```

### Run Specific Test File

```bash
npx hardhat test test/MyExample.test.ts
```

### Run Tests with Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Compile Contracts

```bash
npm run compile
```

### Check for Issues

```bash
npm run lint
npm run lint:fix
```

---

## Documentation

### Auto-Generate Documentation

```bash
# For your new example
npm run generate-docs my-example

# For all examples
npm run generate-docs --all
```

This will:
- Extract contract and test code
- Generate GitBook-formatted markdown
- Create tabbed code sections
- Update SUMMARY.md

### Documentation Structure

Generated docs include:

1. **Description** - What the example demonstrates
2. **Hint Block** - Setup instructions
3. **Tabs** - Contract code and tests side-by-side

### Example Output

```markdown
# My Example

Description of the example...

{% hint style="info" %}
To run this example correctly, make sure the files are placed in the following directories:
...
{% endhint %}

{% tabs %}

{% tab title="MyExample.sol" %}
\`\`\`solidity
...contract code...
\`\`\`
{% endtab %}

{% tab title="MyExample.test.ts" %}
\`\`\`typescript
...test code...
\`\`\`
{% endtab %}

{% endtabs %}
```

---

## Deployment

### Local Development

```bash
# 1. Start local Hardhat node
npx hardhat node

# 2. In another terminal, deploy
npm run deploy

# 3. View deployment output
# Shows contract address for testing
```

### Sepolia Testnet

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with:
# - SEPOLIA_RPC_URL (get from Infura)
# - PRIVATE_KEY (your testnet key)

# 2. Deploy
npx hardhat run scripts/deploy.ts --network sepolia

# 3. Verify contract (optional)
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Mainnet (Production)

```bash
# Same as Sepolia but use --network mainnet
npx hardhat run scripts/deploy.ts --network mainnet
```

---

## Automation Scripts

### Generate Standalone Example Repository

```bash
npm run create-example my-example ./output/my-example
```

This creates a complete, self-contained project that:
- Can be cloned and used independently
- Has all necessary configuration
- Includes the contract and tests
- Has auto-generated README

### Generate Category Project

```bash
npm run create-category procurement ./output/procurement-examples
```

This creates a project with multiple examples from one category.

### Validate All Examples

```bash
npm run validate-examples
```

Ensures:
- All contracts compile
- All tests pass
- Project is in good state

---

## Complete Workflow Example

Here's a complete example of adding a new "VendorBidding" contract:

### 1. Create Contract

```bash
# File: contracts/VendorBidding.sol
# Write the contract code with JSDoc comments
```

### 2. Create Tests

```bash
# File: test/VendorBidding.test.ts
# Write comprehensive tests
```

### 3. Test Locally

```bash
npm run compile
npm run test
npm run lint:fix
```

### 4. Update Scripts

```typescript
// In scripts/create-fhevm-example.ts
'vendor-bidding': {
  contract: 'contracts/VendorBidding.sol',
  test: 'test/VendorBidding.test.ts',
  description: 'Sealed-bid vendor selection system',
}

// In scripts/generate-docs.ts
'vendor-bidding': {
  title: 'Vendor Bidding System',
  description: 'Demonstrates confidential vendor selection...',
  contract: 'contracts/VendorBidding.sol',
  test: 'test/VendorBidding.test.ts',
  output: 'examples/vendor-bidding.md',
  category: 'Procurement',
}
```

### 5. Generate Documentation

```bash
npm run generate-docs vendor-bidding
```

### 6. Create Standalone Example

```bash
npm run create-example vendor-bidding ./output/vendor-bidding
cd ./output/vendor-bidding
npm install
npm run test
```

### 7. Validate

```bash
npm run validate-examples
```

### 8. Commit Changes

```bash
git add .
git commit -m "Add vendor bidding example"
git push
```

---

## Best Practices

### Code Quality

- ✅ Use TypeScript for all scripts and tests
- ✅ Add JSDoc comments to all functions
- ✅ Follow Solidity style guide
- ✅ Use consistent naming conventions
- ✅ Keep contracts focused and minimal

### Testing

- ✅ Write tests before or alongside code
- ✅ Test happy paths and error cases
- ✅ Test permission checks
- ✅ Aim for >80% code coverage
- ✅ Use descriptive test names

### Documentation

- ✅ Add comments to complex logic
- ✅ Use @param and @return JSDoc
- ✅ Auto-generate docs from code
- ✅ Keep README.md updated
- ✅ Include usage examples

### Security

- ✅ Review FHEVM best practices
- ✅ Check access control patterns
- ✅ Validate inputs
- ✅ Test edge cases
- ✅ Follow security audit checklist

### Maintenance

- ✅ Keep dependencies updated
- ✅ Run validation regularly
- ✅ Update docs when changing code
- ✅ Maintain backward compatibility
- ✅ Document breaking changes

---

## Troubleshooting

### Compilation Errors

```bash
# Clean and recompile
npm run clean
npm run compile
```

### Test Failures

```bash
# Run specific test for debugging
npx hardhat test test/MyExample.test.ts --grep "should..."

# Check contract compiles
npm run compile

# Verify test syntax
npm run lint
```

### Script Issues

```bash
# Get help for any script
ts-node scripts/script-name.ts --help

# Run with debugging
DEBUG=true ts-node scripts/script-name.ts
```

### Environment Issues

```bash
# Verify Node.js version
node --version  # Should be >= 20.0.0

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Resources

### Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Community

- [FHEVM Community Forum](https://www.zama.ai/community)
- [Zama Discord](https://discord.com/invite/zama)
- [GitHub Issues](https://github.com/yourusername/fhevm-examples/issues)

### Tools

- [Hardhat](https://hardhat.org)
- [Ethers.js](https://docs.ethers.org)
- [Chai Testing](https://www.chaijs.com)
- [TypeScript](https://www.typescriptlang.org)

---

## Contributing

When contributing new examples:

1. Follow this workflow exactly
2. Ensure all tests pass
3. Update documentation
4. Create clear commit messages
5. Submit pull request with description

---

**Happy Developing!**

For questions or issues, please refer to the main [README.md](README.md) or contact the community.
