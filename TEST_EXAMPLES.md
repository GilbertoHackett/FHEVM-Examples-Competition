# Test Examples - FHEVM Testing Patterns

Complete examples of FHEVM contract testing patterns.

---

## 📋 Test Structure Overview

### Basic Test Pattern
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";

describe("MyContract", function () {
  let instance: FhevmInstance;
  let contract: MyContract;
  let owner: any;

  before(async function () {
    // Setup: Get FHEVM instance
    instance = await (ethers as any).getEncryptionUtils().getInstance();

    // Deploy contract
    const factory = await ethers.getContractFactory("MyContract");
    contract = await factory.deploy();
    await contract.deployed();

    // Get signer
    [owner] = await ethers.getSigners();
  });

  describe("Feature Name", function () {
    it("should do something", async function () {
      // Arrange: Setup test data
      const testValue = 100;
      const encrypted = instance.encrypt32(testValue);

      // Act: Execute function
      await contract.myFunction(encrypted);

      // Assert: Verify results
      const result = instance.decrypt(contract.result());
      expect(result).to.equal(expectedValue);
    });
  });
});
```

---

## 🧪 Testing Patterns

### 1. Basic Encryption/Decryption Test

```typescript
describe("Encryption and Decryption", function () {
  it("should encrypt and decrypt value", async function () {
    const plainValue = 42;

    // Encrypt
    const encrypted = instance.encrypt32(plainValue);
    expect(encrypted).to.not.be.undefined;

    // Verify it's encrypted (has handle)
    expect(encrypted).to.have.property("handle");
  });

  it("should decrypt to original value", async function () {
    const plainValue = 42;
    const encrypted = instance.encrypt32(plainValue);

    // Decrypt and verify
    const decrypted = instance.decrypt(encrypted);
    expect(decrypted).to.equal(plainValue);
  });
});
```

### 2. Arithmetic Operations Test

```typescript
describe("Arithmetic Operations", function () {
  it("should add two encrypted values", async function () {
    const a = 100;
    const b = 50;

    const encryptedA = instance.encrypt32(a);
    const encryptedB = instance.encrypt32(b);

    // Perform addition
    await contract.add(encryptedA, encryptedB);

    // Verify result
    const result = instance.decrypt(contract.getResult());
    expect(result).to.equal(a + b);
  });

  it("should multiply encrypted values", async function () {
    const a = 10;
    const b = 5;

    const encryptedA = instance.encrypt32(a);
    const encryptedB = instance.encrypt32(b);

    // Perform multiplication
    await contract.multiply(encryptedA, encryptedB);

    // Verify result
    const result = instance.decrypt(contract.getResult());
    expect(result).to.equal(a * b);
  });

  it("should handle edge cases", async function () {
    // Zero
    const encryptedZero = instance.encrypt32(0);
    await contract.operation(encryptedZero);

    // Maximum value
    const maxValue = Math.pow(2, 32) - 1;
    const encryptedMax = instance.encrypt32(maxValue);
    await contract.operation(encryptedMax);

    // Large values
    const largeValue = Math.pow(2, 31);
    const encryptedLarge = instance.encrypt32(largeValue);
    await contract.operation(encryptedLarge);
  });
});
```

### 3. Comparison Operations Test

```typescript
describe("Comparison Operations", function () {
  it("should compare encrypted values", async function () {
    const a = 100;
    const b = 50;

    const encryptedA = instance.encrypt32(a);
    const encryptedB = instance.encrypt32(b);

    // Test greater than
    await contract.isGreaterThan(encryptedA, encryptedB);
    const result = instance.decrypt(contract.getComparisonResult());
    expect(result).to.equal(1); // true = 1
  });

  it("should handle equality checks", async function () {
    const a = 100;
    const b = 100;

    const encryptedA = instance.encrypt32(a);
    const encryptedB = instance.encrypt32(b);

    // Test equality
    await contract.isEqual(encryptedA, encryptedB);
    const result = instance.decrypt(contract.getComparisonResult());
    expect(result).to.equal(1); // true = 1
  });
});
```

### 4. State Management Test

```typescript
describe("State Management", function () {
  it("should update encrypted state", async function () {
    const initialValue = 100;
    const newValue = 200;

    const encryptedNew = instance.encrypt32(newValue);
    await contract.setState(encryptedNew);

    // Verify state update
    const state = instance.decrypt(contract.getState());
    expect(state).to.equal(newValue);
  });

  it("should preserve state across multiple calls", async function () {
    const values = [100, 200, 300, 400, 500];

    for (const value of values) {
      await contract.addToState(instance.encrypt32(value));
    }

    const finalState = instance.decrypt(contract.getState());
    // Verify final state based on operation (sum, product, etc.)
  });

  it("should handle state transitions", async function () {
    // Start state
    await contract.initialize(instance.encrypt32(0));

    // Transition 1
    await contract.transition(instance.encrypt32(100));

    // Transition 2
    await contract.transition(instance.encrypt32(50));

    // Verify final state
    const finalState = instance.decrypt(contract.getState());
    expect(finalState).to.be.greaterThan(0);
  });
});
```

### 5. Permission Management Test

```typescript
describe("Permission Management", function () {
  it("should allow only authorized decryption", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const value = 100;
    const encrypted = instance.encrypt32(value);

    // Store encrypted value
    await contract.connect(owner).storeValue(encrypted);

    // Only owner should be able to decrypt
    const decrypted = instance.decrypt(contract.getValue());
    expect(decrypted).to.equal(value);

    // addr1 should not have permission
    // (This would be verified through contract logic)
  });

  it("should grant specific permissions", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const encrypted = instance.encrypt32(100);
    await contract.connect(owner).storeValue(encrypted);

    // Grant permission to addr1
    await contract.connect(owner).grantPermission(addr1.address);

    // Now addr1 can access
    const result = await contract.connect(addr1).getValue();
    expect(result).to.not.be.undefined;
  });
});
```

### 6. Input Validation Test

```typescript
describe("Input Validation", function () {
  it("should reject zero input", async function () {
    const zeroValue = instance.encrypt32(0);

    await expect(
      contract.requirePositive(zeroValue)
    ).to.be.revertedWith("Value must be positive");
  });

  it("should reject invalid input", async function () {
    const invalidInput = ethers.constants.AddressZero;

    await expect(
      contract.someFunction(invalidInput)
    ).to.be.revertedWith("Invalid input");
  });

  it("should accept valid input", async function () {
    const validValue = instance.encrypt32(100);

    await expect(contract.requirePositive(validValue)).to.not.be.reverted;
  });
});
```

### 7. Error Handling Test

```typescript
describe("Error Handling", function () {
  it("should handle overflow gracefully", async function () {
    const maxValue = Math.pow(2, 32) - 1;
    const encrypted = instance.encrypt32(maxValue);

    // Adding to max might overflow
    const addOne = instance.encrypt32(1);

    // Depending on contract logic:
    await expect(
      contract.add(encrypted, addOne)
    ).to.be.revertedWith("Overflow");
    // OR
    const result = instance.decrypt(contract.getResult());
    // Result might wrap around or revert
  });

  it("should handle uninitialized values", async function () {
    // Uninitialized encrypted value
    const uninitialized = ethers.BigNumber.from("0x00");

    await expect(
      contract.operation(uninitialized)
    ).to.be.revertedWith("Value not initialized");
  });
});
```

### 8. Gas Efficiency Test

```typescript
describe("Gas Efficiency", function () {
  it("should use reasonable gas for encryption", async function () {
    const encrypted = instance.encrypt32(100);
    const tx = await contract.storeValue(encrypted);

    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;

    console.log("Gas used:", gasUsed.toString());

    // FHE operations are expensive, but should be < 1M gas per operation
    expect(gasUsed).to.be.lessThan(ethers.utils.parseUnits("1", "mwei"));
  });

  it("should batch operations efficiently", async function () {
    const values = [100, 200, 300].map((v) => instance.encrypt32(v));

    const tx = await contract.batchOperation(values);
    const receipt = await tx.wait();

    // Batching should be more efficient than individual calls
    const gasPerOperation = receipt.gasUsed.div(values.length);
    console.log("Gas per operation in batch:", gasPerOperation.toString());
  });
});
```

---

## 🛠️ Using Test Helpers

### Import and Setup

```typescript
import {
  setupTestEnvironment,
  deployContract,
  encryptValue,
  expectEncryptedEqual,
  getGasCost,
  measureTime,
} from "./helpers";

describe("Using Helpers", function () {
  let instance: FhevmInstance;
  let owner: any;
  let contract: any;

  before(async function () {
    const env = await setupTestEnvironment();
    instance = env.instance;
    owner = env.owner;
    contract = await deployContract("MyContract");
  });

  it("should use helper functions", async function () {
    // Encrypt
    const encrypted = await encryptValue(instance, 100, 32);

    // Call function
    const tx = await contract.myFunction(encrypted);

    // Get gas cost
    const gasCost = await getGasCost(tx);
    console.log("Gas cost:", gasCost);

    // Measure time
    const { duration, result } = await measureTime(() =>
      contract.anotherFunction(encrypted)
    );
    console.log("Execution time:", duration, "ms");

    // Assert encrypted equal
    await expectEncryptedEqual(instance, encrypted, 100, "Values don't match");
  });
});
```

---

## 📊 Running Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test File
```bash
npx hardhat test test/Counter.test.ts
```

### Run Specific Test
```bash
npx hardhat test test/Counter.test.ts --grep "should increment"
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run with Verbose Output
```bash
npx hardhat test --verbose
```

---

## 💡 Best Practices

### 1. Clear Test Names
```typescript
// Good
it("should increment encrypted counter by 1", async function () { })

// Bad
it("should work", async function () { })
```

### 2. Arrange-Act-Assert Pattern
```typescript
it("should work", async function () {
  // Arrange: Setup
  const testValue = 100;
  const encrypted = instance.encrypt32(testValue);

  // Act: Execute
  await contract.doSomething(encrypted);

  // Assert: Verify
  const result = instance.decrypt(contract.getResult());
  expect(result).to.equal(expected);
});
```

### 3. Test Both Happy Path and Error Cases
```typescript
describe("Operation", function () {
  it("should succeed with valid input", async function () { });
  it("should fail with invalid input", async function () { });
  it("should handle edge cases", async function () { });
});
```

### 4. Use Descriptive Error Messages
```typescript
expect(result).to.equal(expected,
  `Expected ${expected} but got ${result}`
);
```

### 5. Test Permissions Explicitly
```typescript
it("should respect permissions", async function () {
  const encrypted = instance.encrypt32(100);
  await contract.store(encrypted);

  // Should allow authorized decryption
  const authorized = instance.decrypt(contract.get());

  // Should prevent unauthorized (in contract logic)
  // verify through contract behavior, not direct call
});
```

---

## 📚 Additional Resources

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [Counter.test.ts](./test/Counter.test.ts) - Real test example
- [helpers.ts](./test/helpers.ts) - Test utility functions
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - General best practices

---

**Last Updated**: December 31, 2025
**Version**: 1.0

These patterns demonstrate how to properly test FHEVM contracts. Use them as templates for your own tests.
