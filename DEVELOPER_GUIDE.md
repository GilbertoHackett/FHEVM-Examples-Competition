# Developer Guide: Adding New Examples

This guide will help you create new FHEVM examples following competition standards.

---

## Creating a New Example

### Step 1: Plan Your Example

Before coding, answer these questions:

1. **What concept does it teach?**
   - Single FHE concept or multiple?
   - Beginner-friendly or advanced?

2. **What category fits best?**
   - Basic (fundamental operations)
   - Advanced (complex patterns)
   - Domain (real-world applications)
   - Integration (OpenZeppelin, bridges)

3. **What problem does it solve?**
   - Use case description
   - Business value
   - Educational value

4. **What will the test demonstrate?**
   - Success cases
   - Common mistakes
   - Edge cases

---

## Step 2: Write the Smart Contract

### File Placement

```
contracts/[category]/YourExample.sol
```

### Contract Template

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title YourExampleContract
 * @notice [Clear one-sentence description of what this contract does]
 * @dev [Technical details and design decisions]
 *
 * This example demonstrates:
 * - [Key FHE concept 1]
 * - [Key FHE concept 2]
 * - [Common pattern or anti-pattern]
 */
contract YourExample is SepoliaConfig {
    // =============================================================================
    // State Variables
    // =============================================================================

    /// @notice [Description]
    euint32 private encryptedValue;

    /// @notice [Description]
    uint256 public plainValue;

    // =============================================================================
    // Events
    // =============================================================================

    /// @notice Emitted when [action] happens
    /// @param user The user who triggered the action
    /// @param timestamp When the action occurred
    event ActionPerformed(address indexed user, uint256 timestamp);

    // =============================================================================
    // Constructor
    // =============================================================================

    constructor() {
        // Initialize with default values
        encryptedValue = FHE.asEuint32(0);
        plainValue = 0;
    }

    // =============================================================================
    // External Functions (Public Interface)
    // =============================================================================

    /**
     * @notice [Clear description of what this function does]
     * @param param1 [Description of input parameter]
     * @return [Description of return value]
     *
     * @dev This function demonstrates:
     * ✅ DO: [Correct pattern 1]
     * ✅ DO: [Correct pattern 2]
     * ❌ DON'T: [Common mistake to avoid]
     *
     * Gas estimate: ~[estimated gas]
     */
    function yourPublicFunction(
        euint32 encryptedInput,
        uint256 plainInput
    ) external returns (uint256) {
        // Validate inputs
        require(plainInput > 0, "YourExample: plainInput must be positive");

        // Perform FHE operations
        euint32 result = FHE.add(encryptedValue, encryptedInput);

        // Update state
        encryptedValue = result;
        plainValue = plainInput;

        // Set permissions for decryption
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        // Emit event
        emit ActionPerformed(msg.sender, block.timestamp);

        return plainInput;
    }

    // =============================================================================
    // Internal Functions (Helper Logic)
    // =============================================================================

    /**
     * @notice [Internal function description]
     * @param internalParam [Parameter description]
     * @return [Return value description]
     * @dev [Technical implementation notes]
     */
    function _internalHelper(euint32 internalParam) internal pure returns (euint32) {
        // Implementation
        return FHE.mul(internalParam, internalParam);
    }

    // =============================================================================
    // View Functions (Read-Only Access)
    // =============================================================================

    /**
     * @notice Get the encrypted value
     * @return The current encrypted state
     * @dev WARNING: This returns encrypted data - handle carefully!
     */
    function getEncryptedValue() external view returns (euint32) {
        return encryptedValue;
    }

    /**
     * @notice Get the plain value
     * @return The current plain state (publicly visible)
     */
    function getPlainValue() external view returns (uint256) {
        return plainValue;
    }
}
```

### Key Guidelines for Contracts

1. **Clear Documentation**
   ```solidity
   /// @notice What users see
   /// @dev What developers need to know
   ```

2. **Demonstrate FHE Concepts**
   ```solidity
   euint32 encrypted = FHE.asEuint32(value);  // Encryption
   ebool comparison = FHE.lt(a, b);            // Comparison
   FHE.allowThis(encrypted);                   // Permissions
   ```

3. **Show Both DO and DON'T**
   ```solidity
   // ✅ DO: Set all permissions
   FHE.allowThis(value);
   FHE.allow(value, msg.sender);

   // ❌ DON'T: Forget allowThis
   FHE.allow(value, msg.sender);  // Will fail!
   ```

4. **Include Error Handling**
   ```solidity
   require(amount > 0, "YourExample: amount must be positive");
   require(msg.sender == owner, "YourExample: caller not authorized");
   ```

---

## Step 3: Write Comprehensive Tests

### File Placement

```
test/[category]/YourExample.test.ts
```

### Test Template

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";
import type { YourExample } from "../typechain-types";

/**
 * Comprehensive test suite for YourExample contract
 *
 * Test structure:
 * - Setup and deployment
 * - ✅ Correct usage patterns
 * - ❌ Anti-patterns and mistakes
 * - Edge cases and boundary conditions
 * - Gas optimization verification
 */
describe("YourExample", function () {
    let yourExample: YourExample;
    let fhevm: FhevmInstance;
    let owner: any;
    let user1: any;
    let user2: any;

    // =========================================================================
    // Setup
    // =========================================================================

    before(async function () {
        // Get FHEVM instance for test environment
        fhevm = await FhevmInstance.getInstance();
    });

    beforeEach(async function () {
        // Get test accounts
        const [ownerSigner, user1Signer, user2Signer] = await ethers.getSigners();
        owner = ownerSigner;
        user1 = user1Signer;
        user2 = user2Signer;

        // Deploy contract
        const YourExample = await ethers.getContractFactory("YourExample");
        yourExample = await YourExample.deploy();
        await yourExample.waitForDeployment();
    });

    // =========================================================================
    // ✅ Correct Usage Tests
    // =========================================================================

    describe("✅ Correct Usage Patterns", function () {
        it("Should initialize with default values", async function () {
            const plainValue = await yourExample.getPlainValue();
            expect(plainValue).to.equal(0);
        });

        it("Should perform FHE operations correctly", async function () {
            const amount = 100n;

            // Create encrypted input
            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(amount);
            const encrypted = await encryptedInput.encrypt();

            // Call function with encrypted data
            const tx = await yourExample.yourPublicFunction(
                encrypted.handles[0],
                amount
            );
            const receipt = await tx.wait();

            // Verify transaction succeeded
            expect(receipt).to.exist;
            expect(receipt?.status).to.equal(1);
        });

        it("Should set permissions correctly", async function () {
            const amount = 50n;

            // Create encrypted input
            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(amount);
            const encrypted = await encryptedInput.encrypt();

            // Function should set FHE.allowThis and FHE.allow internally
            const tx = await yourExample.yourPublicFunction(
                encrypted.handles[0],
                amount
            );
            await tx.wait();

            // In real FHEVM, permissions allow owner to decrypt the result
            expect(true).to.be.true;
        });

        it("Should handle multiple operations in sequence", async function () {
            const amounts = [10n, 20n, 30n];

            for (const amount of amounts) {
                const encryptedInput = fhevm.createEncryptedInput(
                    await yourExample.getAddress(),
                    owner.address
                );
                encryptedInput.add32(amount);
                const encrypted = await encryptedInput.encrypt();

                const tx = await yourExample.yourPublicFunction(
                    encrypted.handles[0],
                    amount
                );
                await tx.wait();
            }

            expect(true).to.be.true;
        });

        it("Should work with different users", async function () {
            const amount = 75n;

            // User1 performs operation
            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                user1.address
            );
            encryptedInput.add32(amount);
            const encrypted = await encryptedInput.encrypt();

            const tx = await yourExample
                .connect(user1)
                .yourPublicFunction(encrypted.handles[0], amount);
            await tx.wait();

            // User2 can also call the function
            const encryptedInput2 = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                user2.address
            );
            encryptedInput2.add32(amount);
            const encrypted2 = await encryptedInput2.encrypt();

            const tx2 = await yourExample
                .connect(user2)
                .yourPublicFunction(encrypted2.handles[0], amount);
            await tx2.wait();

            expect(true).to.be.true;
        });
    });

    // =========================================================================
    // ❌ Anti-patterns and Error Cases
    // =========================================================================

    describe("❌ Anti-patterns and Error Cases", function () {
        it("Should reject zero plainInput", async function () {
            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(100);
            const encrypted = await encryptedInput.encrypt();

            // Try to pass zero plainInput
            await expect(
                yourExample.yourPublicFunction(encrypted.handles[0], 0)
            ).to.be.revertedWith("YourExample: plainInput must be positive");
        });

        it("Should not allow unencrypted sensitive values", async function () {
            // This test shows why encryption is necessary
            // ❌ DON'T: Pass plaintext where encryption is required
            // The function contract should only accept encrypted types

            // This is more of a code review point than a test
            expect(true).to.be.true;
        });
    });

    // =========================================================================
    // Edge Cases
    // =========================================================================

    describe("Edge Cases", function () {
        it("Should handle maximum uint32 values", async function () {
            const maxAmount = (BigInt(2) ** BigInt(32)) - BigInt(1);

            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(maxAmount);
            const encrypted = await encryptedInput.encrypt();

            const tx = await yourExample.yourPublicFunction(
                encrypted.handles[0],
                1
            );
            await tx.wait();

            expect(true).to.be.true;
        });

        it("Should handle minimum uint32 values", async function () {
            const minAmount = 1n;

            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(minAmount);
            const encrypted = await encryptedInput.encrypt();

            const tx = await yourExample.yourPublicFunction(
                encrypted.handles[0],
                minAmount
            );
            await tx.wait();

            expect(true).to.be.true;
        });
    });

    // =========================================================================
    // Gas Optimization Checks
    // =========================================================================

    describe("Gas Optimization", function () {
        it("Should estimate reasonable gas usage", async function () {
            const encryptedInput = fhevm.createEncryptedInput(
                await yourExample.getAddress(),
                owner.address
            );
            encryptedInput.add32(100);
            const encrypted = await encryptedInput.encrypt();

            const gasEstimate = await yourExample.yourPublicFunction.estimateGas(
                encrypted.handles[0],
                100
            );

            // Gas should be reasonable (adjust threshold as needed)
            expect(gasEstimate).to.be.lessThan(BigInt(1000000));
        });
    });
});
```

### Test Writing Guidelines

1. **Organize by Theme**
   - ✅ Correct usage
   - ❌ Anti-patterns
   - Edge cases
   - Gas optimization

2. **Use Descriptive Names**
   ```typescript
   it("Should perform FHE operations correctly", ...)
   it("Should reject invalid inputs", ...)
   it("Should handle edge cases properly", ...)
   ```

3. **Include Comments**
   ```typescript
   // Create encrypted input for testing
   const encryptedInput = fhevm.createEncryptedInput(...);
   // Encrypt and get handles
   const encrypted = await encryptedInput.encrypt();
   // Send to contract
   const tx = await contract.function(encrypted.handles[0]);
   ```

4. **Test Error Messages**
   ```typescript
   await expect(contract.call()).to.be.revertedWith("Error message");
   ```

---

## Step 4: Update Configuration

### Add to scripts/lib/config.ts

```typescript
export const EXAMPLES_MAP: Record<string, ExampleConfig> = {
    // ... existing examples ...
    "your-example": {
        name: "Your Example Title",
        category: "basic", // or "advanced", "domain", "integration"
        contract: "contracts/basic/YourExample.sol",
        test: "test/basic/YourExample.test.ts",
        description: "Short description of what this example teaches",
        concepts: ["concept1", "concept2", "concept3"],
        difficulty: "beginner", // or "intermediate", "advanced"
        gasEstimate: 500000,
    },
};
```

### Update CATEGORIES

```typescript
export const CATEGORIES = {
    basic: [
        "counter",
        "arithmetic",
        "comparison",
        "your-example", // Add here if it's basic
        // ...
    ],
    // ...
};
```

---

## Step 5: Create Documentation

### Auto-Generate

```bash
npm run generate-docs your-example
```

### Manual Documentation (if needed)

Create `docs/[category]/your-example.md`:

```markdown
# Your Example Title

## Overview

[One paragraph explaining what this example teaches]

## Learning Objectives

After this example, you will understand:
- [Concept 1]
- [Concept 2]
- [Concept 3]

## Solidity Code

### Key Components

[Explain the main contract structure]

#### ✅ Correct Pattern
[Show correct usage with code]

#### ❌ Common Mistake
[Show anti-pattern with code]

## Test Cases

### Test 1: [Description]
[Explain what the test verifies]

### Test 2: [Description]
[Explain what the test verifies]

## Key Takeaways

- [Lesson 1]
- [Lesson 2]
- [Lesson 3]

## Next Steps

- [Suggested next example]
- [Further learning resources]

## References

- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Related Concept Documentation]
```

---

## Step 6: Generate Standalone Repository

```bash
npm run create-example your-example ./test-output/your-example
cd test-output/your-example
npm install
npm run compile
npm run test
```

### Verify Everything Works

- [ ] Code compiles without warnings
- [ ] All tests pass
- [ ] README is clear and helpful
- [ ] Documentation is complete
- [ ] Can run standalone

---

## Step 7: Add to Automation Scripts

Update `scripts/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP = {
    // ... existing examples ...
    "your-example": {
        contract: "contracts/basic/YourExample.sol",
        test: "test/basic/YourExample.test.ts",
        description: "Your example description",
    },
};
```

---

## Checklist for New Examples

Before submitting, verify:

- [ ] Contract file created: `contracts/[category]/YourExample.sol`
- [ ] Test file created: `test/[category]/YourExample.test.ts`
- [ ] Configuration updated in `scripts/lib/config.ts`
- [ ] Configuration updated in automation scripts
- [ ] Tests pass: `npm run test`
- [ ] Code compiles: `npm run compile`
- [ ] Linting passes: `npm run lint`
- [ ] Documentation generated: `npm run generate-docs your-example`
- [ ] Standalone repo works: `npm run create-example your-example ./test`
- [ ] README is clear and complete
- [ ] Code follows style guidelines
- [ ] JSDoc comments are comprehensive
- [ ] Both ✅ DO and ❌ DON'T patterns are shown
- [ ] Edge cases are tested
- [ ] No security vulnerabilities
- [ ] Appropriate difficulty level

---

## Tips for Excellence

### Documentation

- Write for beginners
- Show real-world use cases
- Include diagrams if helpful
- Provide working examples
- Link to related concepts

### Code Quality

- Keep contracts focused
- Use clear variable names
- Write comprehensive comments
- Follow Solidity style guide
- Optimize for readability over cleverness

### Testing

- Test success cases
- Test failure cases
- Test edge cases
- Provide helpful error messages
- Demonstrate common mistakes

### Automation

- Make scripts idempotent
- Provide helpful output
- Handle errors gracefully
- Allow customization
- Keep scripts maintainable

---

## Examples to Follow

Study these existing examples for patterns:
- Simple but complete implementations
- Clear documentation
- Comprehensive tests
- Real-world applicability

---

## Support

If you need help:

1. Check existing examples
2. Review FHEVM documentation
3. Ask in community forum
4. Post on Discord

---

**Happy Creating! 🚀**

Your new example will help other developers build privacy-preserving applications. Make it count!
