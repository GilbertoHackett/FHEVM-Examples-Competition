# FHEVM API Reference for Submission

Complete reference for the FHEVM API used in competition examples.

---

## Overview

The `@fhevm/solidity` library provides functions and types for working with encrypted values in smart contracts. This reference covers the essential APIs for competition submissions.

---

## Encrypted Types

### Integer Types

```solidity
euint8      // 8-bit encrypted unsigned integer (0-255)
euint16     // 16-bit encrypted unsigned integer (0-65,535)
euint32     // 32-bit encrypted unsigned integer (0-4,294,967,295)
euint64     // 64-bit encrypted unsigned integer (very large)
```

### Boolean Type

```solidity
ebool       // Encrypted boolean (true/false)
```

### Declaration

```solidity
import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";

contract MyContract {
    euint32 private encryptedValue;
    euint64 private largeValue;
    ebool private encryptedBool;
}
```

---

## FHE Operations

### Encryption

#### `FHE.asEuint[Type](value)`

Converts a plain integer to its encrypted equivalent.

```solidity
euint32 encrypted = FHE.asEuint32(100);
euint64 big = FHE.asEuint64(1000000);

// From external input (requires proof)
euint32 external = FHE.fromExternal(externalEuint32, inputProof);
```

### Arithmetic Operations

#### Addition: `FHE.add(a, b)`

```solidity
euint32 sum = FHE.add(encrypted1, encrypted2);
euint32 sumMixed = FHE.add(encrypted, FHE.asEuint32(50));  // Mix encrypted and plain
```

#### Subtraction: `FHE.sub(a, b)`

```solidity
euint32 difference = FHE.sub(encrypted1, encrypted2);

// Note: Underflow behavior depends on FHEVM version
// Check documentation for your version
```

#### Multiplication: `FHE.mul(a, b)`

```solidity
euint32 product = FHE.mul(encrypted1, encrypted2);
euint32 scaled = FHE.mul(encrypted, FHE.asEuint32(2));
```

#### Division: `FHE.div(a, b)`

```solidity
// Divide encrypted by plain (not encrypted by encrypted)
euint32 quotient = FHE.div(encrypted, 10);  // ✅ Divide by plaintext

// ❌ DON'T do this:
// FHE.div(encrypted1, encrypted2);  // Not supported
```

### Comparison Operations

#### Equality: `FHE.eq(a, b)`

```solidity
ebool isEqual = FHE.eq(encrypted1, encrypted2);  // Are they equal?
ebool matches = FHE.eq(encrypted, FHE.asEuint32(100));  // Does it equal 100?
```

#### Less Than: `FHE.lt(a, b)`

```solidity
ebool isSmaller = FHE.lt(encrypted1, encrypted2);  // a < b?
ebool isBelowThreshold = FHE.lt(encrypted, FHE.asEuint32(1000));  // Below 1000?
```

#### Less Than or Equal: `FHE.lte(a, b)`

```solidity
ebool isSmallOrEqual = FHE.lte(encrypted, FHE.asEuint32(100));
```

#### Greater Than: `FHE.gt(a, b)`

```solidity
ebool isLarger = FHE.gt(encrypted1, encrypted2);  // a > b?
```

#### Greater Than or Equal: `FHE.gte(a, b)`

```solidity
ebool isLargeOrEqual = FHE.gte(encrypted, FHE.asEuint32(100));
```

### Logical Operations

#### AND: `FHE.and(a, b)`

```solidity
ebool result = FHE.and(condition1, condition2);  // Both true?
```

#### OR: `FHE.or(a, b)`

```solidity
ebool result = FHE.or(condition1, condition2);  // At least one true?
```

#### NOT: `FHE.not(a)`

```solidity
ebool inverted = FHE.not(condition);  // Flip the boolean
```

#### XOR: `FHE.xor(a, b)`

```solidity
ebool result = FHE.xor(condition1, condition2);  // Exactly one true?
```

### Conditional Operations

#### If-Then-Else: `FHE.select(condition, valueIfTrue, valueIfFalse)`

```solidity
// Select between two values based on encrypted condition
euint32 result = FHE.select(isGreater, bigValue, smallValue);

// Practical example: Find minimum
euint32 minimum = FHE.select(
    FHE.lt(a, b),  // Is a < b?
    a,              // Yes: use a
    b               // No: use b
);
```

---

## Permission Management

### `FHE.allowThis(value)`

Grants the contract itself permission to access the encrypted value.

```solidity
function processEncrypted(euint32 input) external {
    euint32 result = FHE.add(input, FHE.asEuint32(100));

    // Contract needs permission to use the result
    FHE.allowThis(result);  // Contract can now access result
}
```

**When to use:**
- After creating encrypted values
- Before using encrypted values in contract logic
- After FHE operations

### `FHE.allow(value, recipient)`

Grants a specific address permission to decrypt the value.

```solidity
function submitEncrypted(euint32 bidAmount) external {
    // Store the bid
    bids[msg.sender] = bidAmount;

    // Bidder can decrypt their own bid
    FHE.allow(bidAmount, msg.sender);

    // Admin can decrypt for evaluation
    FHE.allow(bidAmount, admin);
}
```

**Parameters:**
- `value`: The encrypted value
- `recipient`: Address that should be able to decrypt

### `FHE.allowTransient(value)`

Allows the contract to access the value transiently (temporary access).

```solidity
function temporaryAccess(euint32 value) external {
    FHE.allowTransient(value);  // Use for temporary operations

    // Do something with value
    euint32 result = FHE.add(value, FHE.asEuint32(10));

    // Access expires after this transaction
}
```

---

## Decryption

### Request Decryption: `FHE.requestDecryption(...)`

Asynchronously request decryption of encrypted values.

```solidity
function evaluateWinner(uint256 tenderIds) external {
    // Collect values to decrypt
    bytes32[] memory cts = new bytes32[](2);
    cts[0] = FHE.toBytes32(lowestBid);
    cts[1] = FHE.toBytes32(winnerScore);

    // Request asynchronous decryption
    FHE.requestDecryption(
        cts,
        this.processDecryption.selector  // Callback function
    );
}

function processDecryption(uint256[] memory decrypted) external {
    // Called with decrypted values
    uint256 winningBid = decrypted[0];
    uint256 winnerScore = decrypted[1];
}
```

### Manual Decryption (Client-Side)

```typescript
// In frontend JavaScript using ethers.js
const decrypted = await decrypt(encryptedValue);
```

---

## Data Type Conversions

### To Bytes32 (for storage/transmission)

```solidity
bytes32 encrypted = FHE.toBytes32(encryptedValue);
```

### From Bytes32 (from storage)

```solidity
euint32 decrypted = FHE.fromBytes32(encryptedBytes);
```

---

## Configuration Imports

### For Sepolia Testnet

```solidity
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is SepoliaConfig {
    // Contract code
}
```

### For Other Networks

```solidity
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
// Or appropriate config for your network
```

---

## Common Patterns

### Pattern 1: Encrypt, Compare, Store

```solidity
function submitValue(euint32 newValue, bytes calldata inputProof) external {
    // 1. Decrypt and validate input
    euint32 decrypted = FHE.fromExternal(newValue, inputProof);

    // 2. Compare with threshold
    ebool isValid = FHE.gte(decrypted, FHE.asEuint32(100));

    // 3. Set permissions
    FHE.allowThis(decrypted);
    FHE.allow(decrypted, msg.sender);

    // 4. Store if valid
    if (isValidated) {
        storedValue = decrypted;
    }
}
```

### Pattern 2: Batch Operations

```solidity
function processBatch(euint32[] calldata values) external {
    euint32 sum = values[0];

    // Add all values
    for (uint256 i = 1; i < values.length; i++) {
        sum = FHE.add(sum, values[i]);
    }

    // Grant access
    FHE.allowThis(sum);
    FHE.allow(sum, msg.sender);

    // Use result
    return sum;
}
```

### Pattern 3: Conditional Logic

```solidity
function selectBest(
    euint32 valueA,
    euint32 scoreA,
    euint32 valueB,
    euint32 scoreB
) external returns (euint32) {
    // Compare values
    ebool aBetter = FHE.lt(valueA, valueB);

    // If equal value, compare scores
    ebool equal = FHE.eq(valueA, valueB);
    ebool aBetterScore = FHE.gt(scoreA, scoreB);

    // Combined logic: A is better if:
    // - Lower value OR
    // - Same value AND better score
    ebool aIsWinner = FHE.or(
        aBetter,
        FHE.and(equal, aBetterScore)
    );

    // Select result
    euint32 winner = FHE.select(aIsWinner, valueA, valueB);

    FHE.allowThis(winner);
    return winner;
}
```

---

## Error Cases

### ❌ Common Mistakes

**Mistake 1: Forgetting allowThis**
```solidity
// ❌ DON'T
function add(euint32 a, euint32 b) external returns (euint32) {
    euint32 result = FHE.add(a, b);
    return result;  // Forgot allowThis!
}

// ✅ DO
function add(euint32 a, euint32 b) external returns (euint32) {
    euint32 result = FHE.add(a, b);
    FHE.allowThis(result);
    return result;
}
```

**Mistake 2: Using encrypted in view functions**
```solidity
// ❌ DON'T
function getValue() external view returns (euint32) {
    return encryptedValue;  // View functions can't return encrypted!
}

// ✅ DO
function requestValue() external {
    FHE.requestDecryption(...);  // Request async decryption
}
```

**Mistake 3: Missing input proofs**
```solidity
// ❌ DON'T
function process(externalEuint32 value) external {
    euint32 decrypted = FHE.fromExternal(value, bytes(""));  // Empty proof!
}

// ✅ DO
function process(externalEuint32 value, bytes calldata proof) external {
    euint32 decrypted = FHE.fromExternal(value, proof);  // Valid proof!
}
```

**Mistake 4: Comparing encrypted values**
```solidity
// ❌ DON'T
require(encryptedA > encryptedB);  // Can't use > on encrypted!

// ✅ DO
ebool isGreater = FHE.gt(encryptedA, encryptedB);
```

---

## Type Compatibility

### What Can Be Mixed

```solidity
// ✅ Allowed
FHE.add(euint32, euint32)           // Encrypted + Encrypted
FHE.add(euint32, uint32)            // Encrypted + Plain
FHE.eq(euint32, euint32)            // Compare encrypted values
FHE.eq(euint32, uint32)             // Compare with plain values

// ❌ Not Allowed
uint32 + euint32                    // Direct operator use
comparison operators on encrypted  // >, <, etc. don't work
ebool in require statements         // Need explicit checks
```

---

## Gas Considerations

### Operation Costs (Approximate)

| Operation | Cost |
|-----------|------|
| FHE.asEuint32 | Low (~1,000) |
| FHE.add | Medium (~5,000) |
| FHE.mul | Higher (~10,000) |
| FHE.lt | Medium (~5,000) |
| FHE.select | Medium (~8,000) |
| FHE.allowThis | Low (~2,000) |

### Optimization Tips

1. **Batch operations** when possible
2. **Minimize FHE operations** in loops
3. **Use simpler types** (euint32 cheaper than euint64)
4. **Cache results** to avoid recomputation

---

## Version Compatibility

### Version 0.9.x (Current)

All APIs in this reference are compatible with v0.9.x.

### Upcoming v1.0

Check [MIGRATION_GUIDE.md](./MAINTENANCE_GUIDE.md) for future changes.

---

## Additional Resources

- **Official Docs**: https://docs.zama.ai/fhevm
- **GitHub Repository**: https://github.com/zama-ai/fhevm
- **Discord Community**: https://discord.com/invite/zama
- **Forum**: https://www.zama.ai/community

---

## Quick Reference Card

```solidity
// Encryption
euint32 e = FHE.asEuint32(value);
euint32 f = FHE.fromExternal(value, proof);

// Arithmetic
result = FHE.add(a, b);
result = FHE.sub(a, b);
result = FHE.mul(a, b);

// Comparison
ebool isEqual = FHE.eq(a, b);
ebool isLess = FHE.lt(a, b);
ebool isGreater = FHE.gt(a, b);

// Logic
ebool yes = FHE.and(a, b);
ebool maybe = FHE.or(a, b);
ebool inverted = FHE.not(a);

// Selection
euint32 chosen = FHE.select(condition, ifTrue, ifFalse);

// Permissions
FHE.allowThis(value);
FHE.allow(value, recipient);

// Decryption
FHE.requestDecryption(values, callbackSelector);
```

---

**Questions?** Review the [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for examples of each API.
