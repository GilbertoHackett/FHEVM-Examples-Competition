# Project Structure and Organization Guide

This document describes the recommended structure for FHEVM example repositories and automation systems.

---

## Core Directory Organization

### Recommended Structure

```
your-submission/
├── fhevm-hardhat-template/          # Base template for all projects
│   ├── contracts/
│   │   └── Counter.sol              # Example contract
│   ├── test/
│   │   └── Counter.test.ts          # Example test
│   ├── deploy/
│   │   ├── 00-deploy.ts             # Deployment script
│   │   └── 01-verify.ts             # Verification script
│   ├── tasks/                       # Custom Hardhat tasks
│   ├── hardhat.config.ts            # Hardhat configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Dependencies
│   ├── LICENSE                      # BSD-3-Clause-Clear
│   └── README.md                    # Template documentation
│
├── contracts/                        # Master contract collection
│   ├── basic/
│   │   ├── Counter.sol              # Simple encrypted counter
│   │   ├── Arithmetic.sol           # Add, subtract operations
│   │   ├── Comparison.sol           # Equality, less than, greater than
│   │   ├── Encryption.sol           # Encryption patterns
│   │   └── Decryption.sol           # Decryption mechanisms
│   ├── advanced/
│   │   ├── AccessControl.sol        # FHE.allow patterns
│   │   ├── InputProof.sol           # Input proof validation
│   │   ├── Handles.sol              # Handle lifecycle
│   │   ├── AntiPatterns.sol         # Common mistakes
│   │   └── StateManagement.sol      # Encrypted state management
│   ├── domains/
│   │   ├── auction/
│   │   │   ├── BlindAuction.sol     # Sealed-bid auction
│   │   │   └── DutchAuction.sol     # Dutch auction
│   │   ├── tokens/
│   │   │   ├── ConfidentialToken.sol
│   │   │   ├── Wrapper.sol
│   │   │   └── Swap.sol
│   │   └── voting/
│   │       ├── PrivateVoting.sol
│   │       └── WeightedVoting.sol
│   └── integration/
│       ├── ERC7984.sol              # OpenZeppelin standard
│       ├── VestingWallet.sol        # Vesting with privacy
│       └── MultiChain.sol           # Cross-chain patterns
│
├── test/                             # Master test collection
│   ├── basic/
│   │   ├── Counter.test.ts
│   │   ├── Arithmetic.test.ts
│   │   ├── Comparison.test.ts
│   │   ├── Encryption.test.ts
│   │   └── Decryption.test.ts
│   ├── advanced/
│   │   ├── AccessControl.test.ts
│   │   ├── InputProof.test.ts
│   │   ├── Handles.test.ts
│   │   ├── AntiPatterns.test.ts
│   │   └── StateManagement.test.ts
│   └── [mirrors contract structure]
│
├── scripts/                          # Automation tools
│   ├── create-fhevm-example.ts      # Single example generator
│   ├── create-fhevm-category.ts     # Category project generator
│   ├── generate-docs.ts             # Documentation generator
│   ├── validate-examples.ts         # Validation script
│   ├── update-dependencies.ts       # Dependency updater
│   ├── README.md                    # Script documentation
│   └── lib/
│       ├── templates.ts             # Template management
│       ├── validators.ts            # Validation utilities
│       └── config.ts                # Configuration constants
│
├── docs/                             # Generated documentation
│   ├── SUMMARY.md                   # GitBook index
│   ├── basic/
│   │   ├── counter.md
│   │   ├── arithmetic.md
│   │   ├── comparison.md
│   │   ├── encryption.md
│   │   └── decryption.md
│   ├── advanced/
│   │   ├── access-control.md
│   │   ├── input-proof.md
│   │   ├── handles.md
│   │   ├── anti-patterns.md
│   │   └── state-management.md
│   ├── domains/
│   │   ├── auctions.md
│   │   ├── tokens.md
│   │   └── voting.md
│   └── integration/
│       ├── erc7984.md
│       ├── vesting.md
│       └── multi-chain.md
│
├── examples/                         # Generated standalone repos (test output)
│   ├── counter/
│   ├── arithmetic/
│   └── [test generation targets]
│
├── ARCHITECTURE.md                   # System design document
├── DEVELOPER_GUIDE.md                # Guide for adding examples
├── MAINTENANCE_GUIDE.md              # Dependency management
├── SECURITY.md                       # Security considerations
├── PERFORMANCE.md                    # Gas optimization guide
├── API_REFERENCE.md                  # Complete API documentation
├── package.json                      # Root package configuration
├── tsconfig.json                     # Root TypeScript config
├── .gitignore                        # Git ignore rules
├── .eslintrc.json                    # ESLint configuration
├── LICENSE                           # BSD-3-Clause-Clear
└── README.md                         # Main documentation
```

---

## Detailed Directory Descriptions

### `/fhevm-hardhat-template/`

The base template that gets cloned and customized for each example.

```
fhevm-hardhat-template/
├── contracts/
│   └── Counter.sol                  # Template contract
├── test/
│   └── Counter.test.ts              # Template test
├── deploy/
│   ├── 00-deploy.ts                 # Deployment logic
│   └── README.md                    # Deployment guide
├── tasks/                           # Custom Hardhat tasks
├── hardhat.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── .eslintrc.json
├── LICENSE
└── README.md
```

**Key Characteristics:**
- Minimal and clean
- Ready to customize
- All dependencies pre-configured
- Hardhat scripts work out of box

### `/contracts/`

Master collection of all contract examples organized by category.

#### Basic Examples (`/contracts/basic/`)
- Counter contracts
- Arithmetic operations
- Comparison operations
- Encryption/decryption patterns

#### Advanced Examples (`/contracts/advanced/`)
- Access control patterns
- Input proof validation
- Handle management
- Anti-pattern demonstrations
- State management techniques

#### Domain Examples (`/contracts/domains/`)
- **Auction:** Blind auction, Dutch auction
- **Tokens:** ERC-7984, wrappers, swaps
- **Voting:** Private voting, weighted voting

#### Integration Examples (`/contracts/integration/`)
- OpenZeppelin standards
- Vesting mechanisms
- Cross-chain patterns

### `/test/`

Mirrors the `/contracts/` structure with comprehensive test suites.

**Test File Naming Convention:**
- Match contract name: `Counter.sol` → `Counter.test.ts`
- Include category prefix: `auction/BlindAuction.test.ts`
- Clear test descriptions

**Test Structure:**
```typescript
describe("ContractName", function () {
    describe("✅ Correct Usage", function () {
        // Success cases
    });

    describe("❌ Anti-patterns", function () {
        // Common mistakes
    });

    describe("Edge Cases", function () {
        // Boundary conditions
    });
});
```

### `/scripts/`

Automation tools written in TypeScript.

#### Core Scripts

**`create-fhevm-example.ts`**
- Generates single example repository
- Clones base template
- Customizes for specific example
- Creates README

**`create-fhevm-category.ts`**
- Groups related examples
- Creates category-based project
- Includes all tests and docs

**`generate-docs.ts`**
- Extracts code and comments
- Generates markdown documentation
- Creates GitBook SUMMARY.md
- Auto-updates index

**`validate-examples.ts`**
- Verifies all examples compile
- Runs all tests
- Checks documentation completeness
- Validates dependencies

**`update-dependencies.ts`**
- Updates FHEVM version
- Regenerates examples
- Runs validation
- Reports breaking changes

### `/docs/`

Generated GitBook-compatible documentation.

**Structure:**
```
docs/
├── SUMMARY.md                       # Navigation index
├── README.md                        # Introduction
├── basic/
│   ├── index.md                     # Category overview
│   ├── counter.md                   # Individual example
│   ├── arithmetic.md
│   ├── comparison.md
│   ├── encryption.md
│   └── decryption.md
├── advanced/
├── domains/
└── integration/
```

**SUMMARY.md Format:**
```markdown
# Summary

- [Introduction](README.md)
- [Basic Examples](basic/index.md)
  - [Counter](basic/counter.md)
  - [Arithmetic](basic/arithmetic.md)
  - [Comparison](basic/comparison.md)
  - ...
- [Advanced Examples](advanced/index.md)
  - ...
```

---

## File Naming Conventions

### Solidity Contracts

```
PascalCase.sol

Examples:
- Counter.sol
- EncryptedAuction.sol
- ConfidentialToken.sol
```

### TypeScript Files

```
camelCase.ts or PascalCase.ts (for classes)

Examples:
- create-fhevm-example.ts
- Counter.test.ts
- ContractFactory.ts
```

### Markdown Documentation

```
kebab-case.md

Examples:
- quick-start.md
- access-control.md
- anti-patterns.md
```

---

## Configuration Files

### package.json Structure

```json
{
  "name": "fhevm-examples",
  "version": "1.0.0",
  "description": "FHEVM example repositories and automation tools",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "coverage": "hardhat coverage",
    "lint": "eslint .",
    "create-example": "ts-node scripts/create-fhevm-example.ts",
    "create-category": "ts-node scripts/create-fhevm-category.ts",
    "generate-docs": "ts-node scripts/generate-docs.ts",
    "validate": "ts-node scripts/validate-examples.ts",
    "update-deps": "ts-node scripts/update-dependencies.ts"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

### hardhat.config.ts Structure

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.INFURA_API_KEY || "",
      accounts: process.env.MNEMONIC ? [process.env.MNEMONIC] : [],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

---

## Examples Configuration

### EXAMPLES_MAP Format

Create `scripts/lib/config.ts`:

```typescript
export interface ExampleConfig {
  name: string;
  category: "basic" | "advanced" | "domain" | "integration";
  contract: string;
  test: string;
  description: string;
  concepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  gasEstimate?: number;
}

export const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  counter: {
    name: "FHE Counter",
    category: "basic",
    contract: "contracts/basic/Counter.sol",
    test: "test/basic/Counter.test.ts",
    description: "Simple encrypted counter demonstrating FHE basics",
    concepts: ["encryption", "FHE.add", "permissions"],
    difficulty: "beginner",
  },
  // More examples...
};

export const CATEGORIES = {
  basic: ["counter", "arithmetic", "comparison", ...],
  advanced: ["access-control", "input-proof", ...],
  domain: ["blind-auction", "erc7984", ...],
  integration: ["vesting", "multi-chain", ...],
};
```

---

## Git Repository Structure

### .gitignore

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build artifacts
artifacts/
cache/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test output
coverage/
test-output/
```

### Git Workflow

```bash
# Feature branch for new example
git checkout -b feat/add-auction-example

# Commit structure
git commit -m "feat: add blind auction example

- Implement BlindAuction.sol contract
- Add comprehensive test suite
- Generate documentation
- Update automation scripts"

# Merge with PR
git checkout main
git merge feat/add-auction-example
```

---

## Documentation Organization

### README.md Hierarchy

**Root README.md**
- Project overview
- Quick start
- Feature highlights
- Resource links

**Category README.md** (e.g., `/docs/basic/README.md`)
- Category introduction
- Prerequisite knowledge
- Learning path
- Links to examples

**Example README.md** (e.g., `/docs/basic/counter.md`)
- What the example teaches
- Code explanation
- Common pitfalls
- Test cases

---

## Best Practices

### Organization Tips

1. **Keep Examples Small** - Each should demonstrate one concept
2. **Mirror Structures** - `/contracts/X` mirrors `/test/X` mirrors `/docs/X`
3. **Consistent Naming** - Use clear, descriptive names throughout
4. **Clear Documentation** - Every file should have a clear purpose
5. **Modular Scripts** - Automation scripts should be composable

### Maintenance Guidelines

1. **Regular Updates** - Keep dependencies current
2. **Test Coverage** - Every example needs comprehensive tests
3. **Documentation Sync** - Keep docs updated with code changes
4. **Version Control** - Tag releases clearly
5. **Changelog** - Document significant changes

---

## Scaling the Project

### For 5-10 Examples
- Single `/contracts/` directory
- Subdirectories by category

### For 10+ Examples
- Separate directories by domain
- Each domain has its own structure
- Central automation scripts

### For Future Extensions
- Plugin system for new examples
- Template inheritance
- Automated migration scripts

---

## Quality Assurance

### Checks Before Submission

```bash
# Verify structure
npm run validate

# Compile all contracts
npm run compile

# Run all tests
npm run test

# Generate docs
npm run generate-docs

# Test example generation
npm run create-example counter ./test-out
cd test-out && npm install && npm test && cd ..

# Cleanup
rm -rf test-out
```

---

## Conclusion

This structure provides:
- **Clarity** - Clear organization and purpose
- **Scalability** - Easy to add new examples
- **Maintainability** - Easy to update dependencies
- **Automation** - Scripts handle repetitive tasks
- **Documentation** - Comprehensive and organized

Follow these guidelines for a professional, well-organized submission.

---

**Next Steps:** Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) to learn how to add new examples.
