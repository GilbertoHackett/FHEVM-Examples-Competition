# Troubleshooting Guide

## Quick Diagnosis

If you're experiencing issues, start here:

**Problem Category**:
1. [Installation Issues](#installation-issues)
2. [Setup Problems](#setup-problems)
3. [Compilation Errors](#compilation-errors)
4. [Test Failures](#test-failures)
5. [Runtime Errors](#runtime-errors)
6. [Deployment Issues](#deployment-issues)
7. [Performance Problems](#performance-problems)

---

## Installation Issues

### npm install fails

**Symptom**: `npm install` command fails with errors

**Solutions**:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**
   ```bash
   node --version  # Should be 20.0.0 or higher
   npm --version   # Should be 10.0.0 or higher
   ```

   If versions are old, update Node.js from https://nodejs.org/

3. **Check disk space**
   - Ensure you have 500MB+ free disk space
   - Some systems have disk quota limits

4. **Check network connection**
   - npm needs internet access to download packages
   - Try with a different network or disable VPN

5. **Try alternative registry**
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

### Missing @fhevm dependencies

**Symptom**: `Cannot find module '@fhevm/contracts'`

**Solution**:
```bash
npm install --save-exact @fhevm/solidity@0.9.0
npm install --save-dev hardhat-fhevmjs
```

---

## Setup Problems

### Hardhat not found

**Symptom**: `hardhat: command not found` or similar

**Solution 1**: Use npx
```bash
npx hardhat --version
npx hardhat compile
npx hardhat test
```

**Solution 2**: Install locally
```bash
npm install --save-dev hardhat
npm run compile
npm run test
```

**Solution 3**: Add to PATH
```bash
# On Windows
set PATH=%PATH%;.\node_modules\.bin

# On macOS/Linux
export PATH=$PATH:./node_modules/.bin
```

### TypeScript configuration issues

**Symptom**: `TypeScript errors` or `Cannot find type definitions`

**Solution**:
```bash
npm install --save-dev typescript ts-node @types/node
npx tsc --init  # Create tsconfig.json if missing
```

### Solidity compiler issues

**Symptom**: `solc: command not found` or version errors

**Solution**:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
# Hardhat will manage Solidity compilation
```

---

## Compilation Errors

### Contract won't compile

**Symptom**: `Error: HH600` or similar compilation error

**Diagnosis**:
1. Check Solidity version matches (^0.8.24)
2. Check imports are correct
3. Check for syntax errors

**Solution**:
```bash
# Clean and rebuild
npm run clean
npm run compile

# If still fails, check each file:
npx hardhat compile --verbose
```

### "Cannot find contract" errors

**Symptom**: `source file not found` or `contract not found`

**Common Causes**:
1. **Wrong file path**
   - Check file location matches import path
   - Use relative paths from contracts/ directory

2. **Missing imports**
   ```solidity
   // Correct
   import "@fhevm/contracts/FHEVMConfig.sol";

   // Incorrect
   import "FHEVMConfig.sol";  // Missing path
   ```

3. **FHEVM imports not available**
   ```bash
   npm install --save-exact @fhevm/solidity
   ```

### Type mismatch errors

**Symptom**: `Type euint32 is not implicitly convertible to type uint256`

**Explanation**:
- Encrypted types (euint32, euint64, etc.) cannot be directly converted
- They require FHEVM operations

**Solution**:
```solidity
// Wrong
uint256 value = encryptedValue;  // Cannot convert

// Correct
function getValue(euint32 encrypted) internal view returns (euint32) {
    return encrypted;  // Keep as encrypted type
}
```

---

## Test Failures

### Tests won't run

**Symptom**: `Error: Could not find hardhat.config` or test file issues

**Solution**:
```bash
# Verify hardhat.config.ts exists
ls hardhat.config.ts

# Verify test directory exists
ls test/

# Run specific test file
npx hardhat test test/Example.test.ts
```

### FHEVM test issues

**Symptom**: `FhevmInstance not available` or encryption errors

**Solution**:
```typescript
import { FhevmInstance } from "hardhat-fhevmjs";

// Correct setup
before(async function () {
    instance = await getFhevmInstance();
    // Now you can use instance.encrypt32(), etc.
});
```

### Test times out

**Symptom**: `Test timeout exceeded`

**Cause**: FHEVM operations are slow

**Solution**:
```typescript
// Increase timeout
it("should complete FHEVM operation", async function () {
    this.timeout(60000);  // 60 seconds

    const encrypted = instance.encrypt32(100);
    const result = await contract.operation(encrypted);
    // ...
});
```

### Assertion failures

**Symptom**: `AssertionError: expected X to equal Y`

**Debug steps**:
1. Add console.log for values
2. Check expected vs actual
3. Print intermediate values

```typescript
it("should work correctly", async function () {
    const input = 42;
    const encrypted = instance.encrypt32(input);
    const result = await contract.process(encrypted);
    const decrypted = instance.decrypt(result);

    console.log("Input:", input);
    console.log("Decrypted result:", decrypted);

    expect(decrypted).to.equal(expected);
});
```

---

## Runtime Errors

### Contract revert errors

**Symptom**: `Error: VM Exception while processing transaction: reverted with reason string`

**Diagnosis**:
1. Check the revert message
2. Understand why it reverted
3. Fix the issue or adjust test

**Common causes**:
```solidity
// Missing permission
require(FHE.isInitialized(encryptedValue), "Not initialized");

// Invalid input
require(amount > 0, "Amount must be positive");

// Access denied
require(msg.sender == owner, "Only owner");
```

### "Initialization error" for FHE values

**Symptom**: `FHE value not initialized` or similar

**Solution**:
```typescript
// Must initialize before use
const encrypted = instance.encrypt32(100);

// Then use in contract
await contract.function(encrypted);
```

### Permission errors in tests

**Symptom**: `Permission denied` or `FHE.allow failed`

**Solution**:
```typescript
// Encrypt with proper permissions
const encrypted = instance.encrypt32(value);

// In contract, allow decryption for caller
FHE.allow(result, msg.sender);
```

---

## Deployment Issues

### Network connection errors

**Symptom**: `Error: could not detect network` or connection timeout

**Solution**:
```bash
# Check network configuration in hardhat.config.ts
npx hardhat run scripts/deploy.ts --network sepolia

# For local testing
npx hardhat run scripts/deploy.ts --network localhost
```

### Insufficient gas

**Symptom**: `Error: insufficient funds for gas`

**Solution**:
1. Check wallet has balance
2. Check gas price not too high
3. Increase gas limit:

```typescript
const tx = await contract.method(arg, {
    gasLimit: 500000  // Increase if needed
});
```

### nonce errors

**Symptom**: `Error: nonce too high` or `nonce too low`

**Solution**:
```bash
# Clear transactions and restart
npx hardhat clean
npx hardhat node
```

---

## Performance Problems

### Compilation takes too long

**Symptom**: `npm run compile` takes minutes

**Solution**:
```bash
# Clean and rebuild
npm run clean
npm run compile

# Use cache
npx hardhat compile --force  # Force recompile if needed
```

### Tests run slowly

**Symptom**: Test suite takes >1 minute

**Optimization**:
1. Run specific tests instead of all
2. Increase timeout in slowest tests
3. Profile to find bottlenecks

```bash
# Run specific test file
npx hardhat test test/Example.test.ts

# Run specific test
npx hardhat test test/Example.test.ts --grep "specific test"
```

### High gas costs

**Symptom**: Gas usage much higher than expected

**See**: [PERFORMANCE.md](./PERFORMANCE.md) for optimization strategies

---

## Common Mistakes

### Encrypted type mismatches

**Wrong**:
```solidity
function add(euint32 a, uint256 b) external {
    return FHE.add(a, euint32(b));  // Can't cast like this
}
```

**Correct**:
```solidity
function add(euint32 a, euint32 b) external {
    return FHE.add(a, b);  // Both encrypted
}
```

### Forgetting FHE.allow

**Wrong**:
```solidity
function getValue() external view returns (euint32) {
    return encryptedValue;  // Caller can't decrypt
}
```

**Correct**:
```solidity
function getValue() external view returns (euint32) {
    euint32 result = encryptedValue;
    FHE.allow(result, msg.sender);  // Allow decryption
    return result;
}
```

### Wrong import paths

**Wrong**:
```solidity
import "FHEVMConfig.sol";  // File not found
```

**Correct**:
```solidity
import "@fhevm/contracts/FHEVMConfig.sol";  // Full path
```

### Missing async/await

**Wrong**:
```typescript
const result = contract.asyncFunction();  // Promise not awaited
console.log(result);  // undefined
```

**Correct**:
```typescript
const result = await contract.asyncFunction();
console.log(result);  // Actual value
```

---

## Getting Help

### Debug Steps

Before asking for help:
1. Try solutions above
2. Check documentation: [FAQ.md](./FAQ.md)
3. Search GitHub issues
4. Check error message carefully

### Where to Get Help

1. **Quick Questions**: Check [FAQ.md](./FAQ.md)
2. **Setup Issues**: See [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)
3. **Development Help**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
4. **API Reference**: See [API_REFERENCE.md](./API_REFERENCE.md)
5. **GitHub Issues**: Search existing or create new
6. **Zama Discord**: [Community](https://discord.com/invite/zama)

### Providing Good Bug Reports

Include:
- Your environment (OS, Node.js version, npm version)
- Exact error message
- Steps to reproduce
- Expected behavior
- What you already tried

See [.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md) for template.

---

## Additional Resources

### Documentation
- [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md) - Setup guide
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development help
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [FAQ.md](./FAQ.md) - Common questions
- [SECURITY.md](./SECURITY.md) - Security guidance

### External Resources
- [Hardhat Documentation](https://hardhat.org/docs)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Zama Blog](https://www.zama.ai/blog)

---

## Reporting New Issues

If you find an issue not covered here:

1. Check this guide thoroughly
2. Search GitHub issues
3. Create detailed bug report:
   - Title: Clear, specific
   - Description: Detailed steps to reproduce
   - Environment: OS, versions
   - Error: Full error message
   - Expected: What should happen
   - Actual: What actually happens

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

**Last Updated**: December 31, 2025

Need more help? See [GETTING_HELP.md](./GETTING_HELP.md) or [FAQ.md](./FAQ.md)
