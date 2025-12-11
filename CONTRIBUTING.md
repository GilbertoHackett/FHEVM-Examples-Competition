# Contributing to FHEVM Examples

Thank you for your interest in contributing to the FHEVM Examples Competition submission! This document provides guidelines for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Creating Examples](#creating-examples)
- [Documentation Standards](#documentation-standards)
- [Testing Requirements](#testing-requirements)
- [Security Considerations](#security-considerations)
- [Submission Process](#submission-process)

---

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for details.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- Basic knowledge of Solidity and TypeScript
- Familiarity with FHEVM concepts (read [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md))

### Setup Development Environment

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/fhevm-examples.git
cd fhevm-examples

# 2. Install dependencies
npm install

# 3. Verify setup
npm run compile
npm run test

# 4. Create your feature branch
git checkout -b feature/your-feature-name
```

---

## Development Workflow

### 1. Before You Start

- Check existing examples in [EXAMPLES_CATALOG.md](./EXAMPLES_CATALOG.md)
- Review [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for patterns
- Read [SECURITY.md](./SECURITY.md) for security requirements
- Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for test patterns

### 2. Development Process

```bash
# Create feature branch
git checkout -b feature/my-contribution

# Make your changes
# (See sections below for specific guidelines)

# Compile and test
npm run compile
npm run test

# Verify no warnings
npm run lint

# Commit with clear message
git commit -m "feat: description of changes"

# Push to your fork
git push origin feature/my-contribution

# Create pull request on GitHub
```

### 3. Commit Message Format

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add test cases
refactor: reorganize code
perf: improve performance
security: address security issue
```

---

## Creating Examples

### Example Structure

New examples should follow the structure defined in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md):

```
contracts/
├── YourExample.sol          # Smart contract
├── SepoliaConfig.sol        # Network config (if needed)
└── ...

test/
├── YourExample.test.ts      # Comprehensive tests
└── ...

scripts/
├── deploy.ts               # Deployment script (if needed)
└── ...
```

### Example Template

Use the template from [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md):

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "@fhevm/contracts/FHEVMConfig.sol";
import "@fhevm/contracts/EncryptedERC20.sol";

/**
 * @title YourExample
 * @notice Description of what this example demonstrates
 * @dev Explain key concepts and patterns used
 */
contract YourExample is SepoliaConfig {
    // Implementation following security patterns from SECURITY.md
}
```

### Example Categories

Contributions should fit one of these categories:

- **Basic (0-50 lines)**: Fundamental FHEVM operations
- **Advanced (50-200 lines)**: Complex patterns and techniques
- **Domain (100-300 lines)**: Real-world applications
- **Integration (100-300 lines)**: Integration with protocols

Specify your example's category in its documentation.

---

## Documentation Standards

### Code Comments

Use JSDoc/TSDoc format for all code:

```solidity
/**
 * @notice Performs encrypted addition operation
 * @param a The first encrypted value
 * @param b The second encrypted value
 * @return The encrypted sum of a and b
 */
function add(euint32 a, euint32 b) external pure returns (euint32) {
    return FHE.add(a, b);
}
```

### Documentation Files

If adding documentation:

1. Follow markdown format used in existing files
2. Include code examples with syntax highlighting
3. Link to related documentation using relative paths
4. Add to [COMPETITION_INDEX.md](./COMPETITION_INDEX.md) navigation
5. Update [FILES_MANIFEST.md](./FILES_MANIFEST.md) if needed

### README for Examples

Each example should include a README.md in its directory:

```markdown
# Example Name

## Overview
Brief description of what this example demonstrates

## Key Concepts
- Concept 1
- Concept 2

## How It Works
Detailed explanation of the contract logic

## Usage
Code examples showing how to use this contract

## Security Considerations
Important security notes

## Learning Resources
Links to related documentation
```

---

## Testing Requirements

### Mandatory Test Coverage

All contributions must include tests covering:

- ✅ Success cases (normal operation)
- ✅ Edge cases (boundary conditions)
- ✅ Error cases (invalid inputs)
- ✅ Security scenarios (from [SECURITY.md](./SECURITY.md))

### Test Template

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";

describe("YourExample", function () {
  let instance: FhevmInstance;
  let contract: YourExample;

  before(async function () {
    instance = await getFhevmInstance();
    const factory = await ethers.getContractFactory("YourExample");
    contract = await factory.deploy();
  });

  it("should perform operation correctly", async function () {
    // Arrange - Setup test data
    const input = 42;
    const encryptedInput = instance.encrypt32(input);

    // Act - Execute function
    const result = await contract.yourFunction(encryptedInput);

    // Assert - Verify results
    const decrypted = instance.decrypt(result);
    expect(decrypted).to.equal(expectedValue);
  });

  it("should handle invalid input", async function () {
    // Test error cases
    await expect(contract.yourFunction(invalidInput)).to.be.revertedWith(
      "Error message"
    );
  });
});
```

### Test Command

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- test/YourExample.test.ts

# Generate coverage report
npm run test:coverage
```

**Minimum Coverage**: >80% code coverage required

---

## Security Considerations

### Before Submitting

All contributions must address security checklist from [SECURITY.md](./SECURITY.md):

- ✅ Input validation implemented
- ✅ FHE permissions correctly handled
- ✅ No hardcoded sensitive data
- ✅ Access control patterns applied
- ✅ Cryptographic operations reviewed
- ✅ State management secure

### Security Review Checklist

```markdown
- [ ] Validates all inputs
- [ ] Handles FHE permissions correctly
- [ ] Uses secure encryption patterns
- [ ] Implements proper access control
- [ ] No information leaks in logs
- [ ] Handles edge cases safely
- [ ] Uses gas-efficient operations
- [ ] Includes security tests
```

---

## Performance Considerations

Reference [PERFORMANCE.md](./PERFORMANCE.md) for optimization:

- Use appropriate encrypted types (euint8 vs euint64)
- Batch operations when possible
- Avoid unnecessary computations
- Monitor gas costs
- Test with realistic data sizes

Include gas benchmarks in your tests:

```typescript
it("should execute within gas limits", async function () {
  const tx = await contract.yourFunction(input);
  const receipt = await tx.wait();

  expect(receipt.gasUsed).to.be.lessThan(expectedGasLimit);
  console.log(`Gas used: ${receipt.gasUsed}`);
});
```

---

## Submission Process

### Step 1: Prepare Your Contribution

```bash
# Ensure code quality
npm run compile    # No errors
npm run test       # All tests pass
npm run lint       # Code style

# Verify documentation
# Review your code comments and docs
```

### Step 2: Create Pull Request

1. Push your feature branch to your fork
2. Create a pull request with:
   - Clear title: `feat: Add YourExample contract`
   - Description of changes
   - Reference related issues
   - Links to relevant documentation

### Step 3: PR Description Template

```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] New example
- [ ] Documentation update
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Security enhancement

## Related Documentation
- Links to relevant guides
- References to related examples

## Testing Done
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Coverage >80%

## Security Review
- [ ] Reviewed SECURITY.md
- [ ] Security considerations addressed
- [ ] No hardcoded values
- [ ] Access control verified

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added (complex logic)
- [ ] Documentation updated
- [ ] Tests written and passing
- [ ] No compiler warnings
```

### Step 4: Review Process

- Community members and maintainers will review
- Changes may be requested for:
  - Code quality
  - Security
  - Testing
  - Documentation
- Respond to feedback and update your PR
- Once approved, your contribution will be merged

---

## Style Guide

### Solidity Code Style

```solidity
// 1. Use explicit imports
import { FHEVMConfig } from "@fhevm/contracts/FHEVMConfig.sol";

// 2. Clear variable names
euint32 encryptedBalance;  // Good
euint32 eb;               // Poor

// 3. Consistent indentation (4 spaces)
function example() external {
    uint256 value = 100;
    return value;
}

// 4. Clear function organization
// 1. Constructor
// 2. External functions
// 3. Internal functions
// 4. Private functions
```

### TypeScript Code Style

```typescript
// 1. Use explicit types
const value: string = "example";

// 2. Use const/let, not var
const constant = 100;

// 3. Consistent naming
const contractFactory = await ethers.getContractFactory("Example");
const myContract: MyContract = await contractFactory.deploy();

// 4. Clear error messages
if (!isValid) {
  throw new Error("Input must be valid");
}
```

---

## Getting Help

If you need help:

1. **Questions**: Check [FAQ.md](./FAQ.md)
2. **Guides**: Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
3. **Examples**: Browse [EXAMPLES_CATALOG.md](./EXAMPLES_CATALOG.md)
4. **Issues**: Create an issue on GitHub
5. **Community**: Join [Zama's Discord](https://discord.com/invite/zama)

---

## License

By contributing to this project, you agree that your contributions will be licensed under the BSD-3-Clause-Clear License.

---

## Questions?

If you have questions about contributing:

1. Check [FAQ.md](./FAQ.md) for answers
2. Review relevant documentation files
3. Create a GitHub issue with your question
4. Ask in [Zama's Discord community](https://discord.com/invite/zama)

---

## Recognition

Contributors are recognized for:
- Code contributions
- Documentation improvements
- Bug reports and fixes
- Example creation
- Community support

Thank you for contributing to FHEVM Examples!

---

**Last Updated**: December 31, 2025

**Next**: Read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines
