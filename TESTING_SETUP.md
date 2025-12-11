# Testing Setup - Complete Guide

Complete setup and configuration guide for FHEVM testing infrastructure.

---

## 🏗️ Project Structure for Testing

```
fhevm-examples/
├── contracts/
│   ├── Counter.sol                    # Smart contracts
│   ├── Auction.sol
│   └── ...
├── test/
│   ├── Counter.test.ts               # Test files
│   ├── Auction.test.ts
│   ├── helpers.ts                    # Test utilities
│   └── setup.ts
├── scripts/
│   ├── deploy.ts                     # Deployment scripts
│   └── verify.ts
├── artifacts/                        # Compiled contracts
├── typechain-types/                  # Generated types
├── hardhat.config.ts                 # Hardhat configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── .env.example                      # Environment template
└── [documentation files]
```

---

## ⚙️ Configuration Files

### hardhat.config.ts
```typescript
// Network configuration
networks: {
  hardhat: { /* local testing */ },
  localhost: { /* local node */ },
  sepolia: { /* testnet */ },
  mainnet: { /* production */ }
}

// Compiler settings
solidity: {
  version: "0.8.24",
  settings: { optimizer: { enabled: true, runs: 200 } }
}

// Test configuration
mocha: {
  timeout: 60000,      // FHEVM operations are slow
  slow: 30000
}
```

### tsconfig.json
```typescript
// TypeScript compilation settings
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "module": "commonjs",
    "esModuleInterop": true
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "test:watch": "hardhat test --watch",
    "deploy": "hardhat run scripts/deploy.ts",
    "clean": "hardhat clean"
  }
}
```

---

## 🧪 Running Tests

### Basic Test Run
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

### Watch Mode (Auto-run on changes)
```bash
npm run test:watch
```

### Verbose Output
```bash
npx hardhat test --verbose
```

### Parallel Execution
```bash
npx hardhat test --parallel
```

---

## 📊 Expected Test Output

### Successful Test Run
```
  Counter
    Deployment
      ✓ Should deploy Counter with initial value (150ms)
      ✓ Should initialize with correct value (100ms)
    Increment
      ✓ Should increment encrypted counter (200ms)
      ✓ Should increment multiple times (250ms)
    Add
      ✓ Should add encrypted value to counter (180ms)
      ✓ Should add zero (150ms)
    ...

  18 passing (5s)
```

### Coverage Report
```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|----------
Counter.sol        | 100     | 95       | 100     | 100
AccessControl.sol  | 98      | 90       | 100     | 98
...                |         |          |         |
All files          | 95.5    | 89.2     | 98.3    | 95.5
```

---

## 🔍 Test File Structure

### Basic Test Template
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";

describe("ContractName", function () {
  let instance: FhevmInstance;
  let contract: ContractName;
  let owner: any;

  // 1. Setup
  before(async function () {
    instance = await (ethers as any)
      .getEncryptionUtils()
      .getInstance();

    const factory = await ethers.getContractFactory("ContractName");
    contract = await factory.deploy();
    await contract.deployed();

    [owner] = await ethers.getSigners();
  });

  // 2. Test groups
  describe("Feature", function () {
    it("should do something", async function () {
      // Test implementation
    });
  });
});
```

---

## 🛠️ Testing Tools

### Chai Assertions
```typescript
expect(value).to.equal(expectedValue);
expect(value).to.be.greaterThan(0);
expect(value).to.be.lessThan(100);
expect(value).to.be.undefined;
expect(promise).to.be.rejectedWith("error message");
```

### Hardhat Matchers
```typescript
await expect(tx).to.emit(contract, "EventName");
await expect(tx).to.be.revertedWith("Error message");
await expect(tx).not.to.be.reverted;
```

### FHEVM Instance
```typescript
const encrypted = instance.encrypt32(value);
const decrypted = instance.decrypt(encrypted);
const encryptedZero = instance.encrypt32(0);
```

---

## 📈 Test Coverage Goals

### Coverage Targets
- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 90%
- **Lines**: > 85%

### Achieving High Coverage
1. Test happy path (success cases)
2. Test error cases (require statements)
3. Test edge cases (0, max, boundary values)
4. Test all code branches
5. Test all functions

### Check Coverage
```bash
npm run test:coverage
open coverage/index.html
```

---

## ⚡ Performance Considerations

### Test Timeouts
```typescript
describe("Slow Operation", function () {
  this.timeout(120000);  // 2 minutes for entire suite

  it("should complete", async function () {
    this.timeout(60000);  // 1 minute for this test
    // Long operation...
  });
});
```

### Expected Gas Costs
```
Counter increment: ~5,000 - 10,000 gas
FHE addition: ~5,000 - 8,000 gas
FHE multiplication: ~15,000 - 25,000 gas
Comparison: ~3,000 - 5,000 gas
```

### Optimization
1. Run only affected tests during development
2. Use test filtering to speed up
3. Batch similar tests
4. Avoid unnecessary delays

---

## 🔧 Troubleshooting Tests

### Test Won't Run
```bash
# Clean and rebuild
npm run clean
npm run compile
npm run test
```

### Timeout Error
```typescript
// Increase timeout
this.timeout(120000);  // 2 minutes
```

### Compilation Error
```bash
# Check TypeScript
npx tsc --noEmit

# Check Solidity
npx hardhat compile --verbose
```

### FHEVM Instance Error
```typescript
// Make sure using correct import
const instance = await (ethers as any)
  .getEncryptionUtils()
  .getInstance();
```

### Permission Denied
```bash
# Fix ownership
sudo chown -R $USER:$USER .
```

---

## 📚 Test Examples

### See Complete Examples
- [test/Counter.test.ts](./test/Counter.test.ts) - Full test file
- [TEST_EXAMPLES.md](./TEST_EXAMPLES.md) - Multiple test patterns
- [test/helpers.ts](./test/helpers.ts) - Helper functions

### Key Test Patterns
1. **Encryption/Decryption**: Basic crypto tests
2. **Arithmetic**: Add, sub, mul, div operations
3. **Comparison**: lt, gt, eq operations
4. **State Management**: Storage and updates
5. **Permission**: Access control tests
6. **Validation**: Input checking tests
7. **Error Handling**: Revert tests
8. **Gas Efficiency**: Performance tests

---

## 🚀 Continuous Integration

### GitHub Actions Setup
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run compile
      - run: npm run test
      - run: npm run test:coverage
```

---

## ✅ Testing Checklist

Before committing code:

- [ ] All tests pass: `npm run test`
- [ ] Coverage > 85%: `npm run test:coverage`
- [ ] No compilation warnings: `npm run compile`
- [ ] Code compiles: `npm run compile`
- [ ] Linting passes: `npm run lint`
- [ ] Tests run quickly (< 5 minutes for full suite)

---

## 📖 Documentation

### Testing Guides
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive guide
- [TEST_EXAMPLES.md](./TEST_EXAMPLES.md) - Code examples
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Best practices

### Related Files
- [hardhat.config.ts](./hardhat.config.ts) - Hardhat configuration
- [package.json](./package.json) - Dependencies and scripts
- [tsconfig.json](./tsconfig.json) - TypeScript configuration

---

## 🎯 Next Steps

1. **Setup**: Review hardhat.config.ts and package.json
2. **Write Tests**: Create test files in test/ directory
3. **Run Tests**: Execute `npm run test`
4. **Check Coverage**: Run `npm run test:coverage`
5. **Improve**: Aim for >85% coverage
6. **CI/CD**: Setup GitHub Actions or similar

---

**Last Updated**: December 31, 2025
**Version**: 1.0

For more information, see [TESTING_GUIDE.md](./TESTING_GUIDE.md) or [TEST_EXAMPLES.md](./TEST_EXAMPLES.md)
