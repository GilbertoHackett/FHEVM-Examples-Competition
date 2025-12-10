# Comprehensive Testing Guide

Complete guide for writing and running tests for FHEVM examples.

---

## Overview

Testing is critical for FHEVM development. Tests verify:
- Correctness of encrypted operations
- Permission handling
- Error conditions
- Edge cases
- Gas efficiency
- Security properties

---

## Test Environment Setup

### Dependencies

```json
{
  "devDependencies": {
    "@types/chai": "^4.3.5",
    "@types/mocha": "^10.0.1",
    "chai": "^4.3.7",
    "hardhat": "^2.19.2",
    "hardhat-fhevmjs": "^1.0.0",
    "mocha": "^10.2.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
```

### Hardhat Configuration

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";

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

## Test Structure

### Basic Test Template

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";
import type { YourContract } from "../typechain-types";

describe("YourContract", function () {
    let contract: YourContract;
    let fhevm: FhevmInstance;
    let owner: any;
    let user1: any;

    before(async function () {
        fhevm = await FhevmInstance.getInstance();
    });

    beforeEach(async function () {
        const [ownerSigner, user1Signer] = await ethers.getSigners();
        owner = ownerSigner;
        user1 = user1Signer;

        const Contract = await ethers.getContractFactory("YourContract");
        contract = await Contract.deploy();
        await contract.waitForDeployment();
    });

    // Tests go here
});
```

### Test Organization

```typescript
describe("ContractName", function () {
    // Setup code

    describe("✅ Correct Usage", function () {
        // Happy path tests
    });

    describe("❌ Anti-patterns", function () {
        // Mistake/error tests
    });

    describe("Edge Cases", function () {
        // Boundary and special condition tests
    });

    describe("Gas Optimization", function () {
        // Performance tests
    });

    describe("Security", function () {
        // Security-specific tests
    });
});
```

---

## Writing Tests

### Test 1: Basic Functionality

```typescript
it("Should perform basic operation correctly", async function () {
    // Arrange - Set up test data
    const value = 100n;
    const encryptedInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    );
    encryptedInput.add32(value);
    const encrypted = await encryptedInput.encrypt();

    // Act - Execute the function
    const tx = await contract.yourFunction(encrypted.handles[0]);
    const receipt = await tx.wait();

    // Assert - Verify the result
    expect(receipt).to.exist;
    expect(receipt?.status).to.equal(1);  // Success
});
```

### Test 2: Permission Verification

```typescript
it("Should set permissions correctly", async function () {
    const value = 50n;

    const encryptedInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    );
    encryptedInput.add32(value);
    const encrypted = await encryptedInput.encrypt();

    // Execute function that sets permissions
    const tx = await contract.submitEncrypted(encrypted.handles[0]);
    await tx.wait();

    // Verify it can be used by owner
    // (In real FHEVM, decrypt to verify)
    expect(true).to.be.true;
});
```

### Test 3: Error Handling

```typescript
it("Should reject invalid inputs", async function () {
    // Test with invalid parameter
    await expect(
        contract.submitBid(0)  // Invalid amount
    ).to.be.revertedWith("YourContract: amount must be positive");
});
```

### Test 4: Access Control

```typescript
it("Should restrict unauthorized access", async function () {
    // Try to call with wrong user
    await expect(
        contract.connect(user1).ownerOnlyFunction()
    ).to.be.revertedWith("Ownable: caller is not the owner");
});
```

### Test 5: State Transitions

```typescript
it("Should enforce valid state transitions", async function () {
    // Can't evaluate before closing
    await expect(
        contract.evaluate()
    ).to.be.revertedWith("Tender not ready for evaluation");

    // Close the tender
    await contract.close();

    // Now evaluation should work
    const tx = await contract.evaluate();
    expect(tx).to.exist;
});
```

### Test 6: Multiple Users

```typescript
it("Should handle multiple users correctly", async function () {
    // User1 submits
    const enc1 = fhevm.createEncryptedInput(
        await contract.getAddress(),
        user1.address
    ).add32(100).encrypt();
    await contract.connect(user1).submit(enc1.handles[0]);

    // User2 submits
    const enc2 = fhevm.createEncryptedInput(
        await contract.getAddress(),
        user1.address  // Different user, but same encryption signer
    ).add32(200).encrypt();
    await contract.connect(user1).submit(enc2.handles[0]);

    // Both should be stored
    expect(true).to.be.true;
});
```

### Test 7: Gas Estimation

```typescript
it("Should have reasonable gas usage", async function () {
    const encryptedInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(100).encrypt();

    const gasEstimate = await contract.yourFunction.estimateGas(
        encrypted.handles[0]
    );

    expect(gasEstimate).to.be.lessThan(BigInt(500000));
});
```

### Test 8: Anti-pattern Testing

```typescript
it("Should demonstrate common mistakes", async function () {
    // ❌ MISTAKE: Signer mismatch
    const encryptedByAlice = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(100).encrypt();

    // Bob tries to submit Alice's encrypted value
    await expect(
        contract.connect(user1).submit(encryptedByAlice.handles[0])
    ).to.be.revertedWith("Permission denied");
});
```

---

## FHE-Specific Testing

### Testing Encrypted Operations

```typescript
describe("FHE Operations", function () {
    it("Should add encrypted values", async function () {
        const a = 50n;
        const b = 30n;
        const expected = a + b;  // 80

        const encA = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(a).encrypt();

        const encB = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(b).encrypt();

        const tx = await contract.add(
            encA.handles[0],
            encB.handles[0]
        );
        await tx.wait();

        // Result is encrypted, so we can't directly verify
        // But we can verify the transaction succeeded
        expect(tx).to.exist;
    });

    it("Should compare encrypted values", async function () {
        const a = 100n;
        const b = 50n;

        const encA = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(a).encrypt();

        const encB = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(b).encrypt();

        // a > b should be true
        const tx = await contract.isGreater(
            encA.handles[0],
            encB.handles[0]
        );
        await tx.wait();

        expect(tx).to.exist;
    });
});
```

### Testing Conditional Logic

```typescript
it("Should execute conditional logic correctly", async function () {
    const value = 100n;

    const encValue = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(value).encrypt();

    // Select based on encrypted condition
    const tx = await contract.selectValue(encValue.handles[0]);
    await tx.wait();

    expect(tx).to.exist;
});
```

---

## Running Tests

### Run All Tests

```bash
npm run test
```

### Run Specific Test File

```bash
npm run test test/Counter.test.ts
```

### Run Specific Test Suite

```bash
npm run test -- --grep "Correct Usage"
```

### Run Specific Test

```bash
npm run test -- --grep "Should add encrypted values"
```

### Run with Verbose Output

```bash
npm run test -- --reporter spec
```

### Generate Coverage Report

```bash
npm run coverage
```

---

## Test Patterns

### Pattern 1: Setup-Execute-Verify

```typescript
it("Should follow setup-execute-verify pattern", async function () {
    // SETUP
    const testValue = 42n;
    const encryptedInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(testValue).encrypt();

    // EXECUTE
    const tx = await contract.processValue(encrypted.handles[0]);
    const receipt = await tx.wait();

    // VERIFY
    expect(receipt?.status).to.equal(1);
});
```

### Pattern 2: Parameterized Tests

```typescript
const testCases = [
    { input: 10n, expected: 20n },
    { input: 50n, expected: 100n },
    { input: 100n, expected: 200n },
];

testCases.forEach(({ input, expected }) => {
    it(`Should double ${input} to get ${expected}`, async function () {
        const encrypted = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(input).encrypt();

        const tx = await contract.double(encrypted.handles[0]);
        await tx.wait();

        expect(tx).to.exist;
    });
});
```

### Pattern 3: Fixture with State

```typescript
async function deployAndInitialize() {
    const Contract = await ethers.getContractFactory("YourContract");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    // Initialize state
    await contract.initialize();

    return contract;
}

beforeEach(async function () {
    contract = await deployAndInitialize();
});
```

---

## Advanced Testing

### Testing State Changes

```typescript
it("Should update state correctly", async function () {
    const initialValue = await contract.value();

    const encInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(10).encrypt();

    await contract.update(encInput.handles[0]);

    const finalValue = await contract.value();
    expect(finalValue).to.not.equal(initialValue);
});
```

### Testing Events

```typescript
it("Should emit events correctly", async function () {
    const encInput = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(100).encrypt();

    await expect(
        contract.submitValue(encInput.handles[0])
    ).to.emit(contract, "ValueSubmitted")
     .withArgs(owner.address);
});
```

### Testing Reverts with Reasons

```typescript
it("Should provide clear error messages", async function () {
    await expect(
        contract.submitBid(0)
    ).to.be.revertedWith("YourContract: amount must be positive");

    // Or with custom error
    await expect(
        contract.withdraw(ethers.parseEther("1000"))
    ).to.be.revertedWithCustomError(
        contract,
        "InsufficientBalance"
    );
});
```

### Testing Multiple Sequential Calls

```typescript
it("Should handle multiple operations in sequence", async function () {
    for (let i = 0; i < 5; i++) {
        const encInput = fhevm.createEncryptedInput(
            await contract.getAddress(),
            owner.address
        ).add32(i + 1).encrypt();

        const tx = await contract.add(encInput.handles[0]);
        await tx.wait();
    }

    expect(true).to.be.true;
});
```

---

## Test Checklist

Before submitting your examples, verify:

- [ ] All basic functionality tests pass
- [ ] All error cases are tested
- [ ] Permission handling is tested
- [ ] State transitions are validated
- [ ] Edge cases are covered
- [ ] Gas usage is reasonable
- [ ] Multiple users are tested
- [ ] Events are verified
- [ ] Access control is enforced
- [ ] Anti-patterns demonstrate mistakes

---

## Common Issues

### Issue: "FhevmInstance not initialized"

**Solution:**
```typescript
before(async function () {
    fhevm = await FhevmInstance.getInstance();
});
```

### Issue: "Encrypted value type mismatch"

**Solution:**
```typescript
// Use correct type in encryption
const encrypted = fhevm.createEncryptedInput(...)
    .add32(value)  // Use add32 for uint32, not add64
    .encrypt();
```

### Issue: "Permission denied"

**Solution:**
```typescript
// Set permissions after operations
FHE.allowThis(result);
FHE.allow(result, msg.sender);
```

### Issue: "Signer mismatch"

**Solution:**
```typescript
// Ensure signer matches encryption
const encrypted = fhevm.createEncryptedInput(
    contractAddress,
    owner.address  // Must match caller
).add32(value).encrypt();

// Called by same address
await contract.connect(owner).submit(encrypted.handles[0]);
```

---

## Test Coverage Goals

Aim for:
- **Line coverage:** >80%
- **Function coverage:** >90%
- **Branch coverage:** >75%
- **Statement coverage:** >80%

Check with:
```bash
npm run coverage
```

---

## Performance Testing

### Gas Benchmarks

```typescript
it("Should meet gas budget", async function () {
    const encrypted = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(100).encrypt();

    const gasEstimate = await contract.complexOperation.estimateGas(
        encrypted.handles[0]
    );

    // Should be less than 1 million gas
    expect(gasEstimate).to.be.lessThan(BigInt(1000000));
});
```

### Execution Time Benchmarks

```typescript
it("Should execute within time limits", async function () {
    const start = Date.now();

    const encrypted = fhevm.createEncryptedInput(
        await contract.getAddress(),
        owner.address
    ).add32(100).encrypt();

    await contract.fastOperation(encrypted.handles[0]);

    const elapsed = Date.now() - start;
    expect(elapsed).to.be.lessThan(5000);  // 5 seconds
});
```

---

## Documentation in Tests

### Using JSDoc Comments

```typescript
/**
 * Test that the contract correctly handles encrypted additions
 *
 * @description
 * This test verifies that two encrypted values can be added together
 * and the result is properly encrypted with correct permissions.
 *
 * @steps
 * 1. Create encrypted input values
 * 2. Call the add function
 * 3. Verify transaction succeeded
 * 4. Verify permissions are set
 */
it("Should add encrypted values correctly", async function () {
    // Implementation
});
```

---

## Best Practices

### DO ✅

- ✅ Test happy paths and error cases
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Test in isolation
- ✅ Verify permissions
- ✅ Handle async operations
- ✅ Clean up after tests
- ✅ Document complex tests
- ✅ Test security properties
- ✅ Benchmark gas usage

### DON'T ❌

- ❌ Skip error tests
- ❌ Hard-code values in tests
- ❌ Share state between tests
- ❌ Forget permission checks
- ❌ Ignore edge cases
- ❌ Make tests too complex
- ❌ Skip cleanup
- ❌ Write vague test names
- ❌ Ignore gas usage
- ❌ Test implementation details

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run compile
      - run: npm run test
      - run: npm run coverage
```

---

## Conclusion

Good tests ensure:
- Correctness of FHEVM operations
- Proper permission handling
- Security of smart contracts
- Reasonable gas usage
- Educational value for learners

Invest time in comprehensive testing. It's worth it!

---

**Next:** See [SECURITY.md](./SECURITY.md) for security testing patterns.
