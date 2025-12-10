# Performance Optimization Guide

This guide provides strategies for optimizing FHEVM smart contract performance and gas efficiency.

---

## Performance Metrics

### Key Metrics

1. **Gas Usage** - On-chain transaction costs
2. **Execution Time** - Time to complete operations
3. **Memory Usage** - RAM during execution
4. **Throughput** - Operations per second

---

## Gas Optimization

### Understanding FHE Gas Costs

FHE operations are computationally expensive. Approximate costs:

| Operation | Gas Cost | Notes |
|-----------|----------|-------|
| FHE.asEuint32() | ~1,000 | Encryption, fast |
| FHE.add() | ~5,000 | Arithmetic |
| FHE.mul() | ~15,000 | Multiplication, expensive |
| FHE.lt() | ~5,000 | Comparison |
| FHE.select() | ~8,000 | Conditional |
| FHE.allowThis() | ~2,000 | Permission |
| FHE.allow() | ~2,000 | Permission |

### Optimization Strategies

#### 1. Minimize FHE Operations

**Problem:**
```solidity
// ❌ Inefficient: Multiple separate operations
for (uint i = 0; i < 100; i++) {
    value = FHE.add(value, amounts[i]);  // 100 operations!
}
```

**Solution:**
```solidity
// ✅ Efficient: Batch operations
euint32 sum = amounts[0];
for (uint i = 1; i < amounts.length; i++) {
    sum = FHE.add(sum, amounts[i]);  // Still necessary but optimized
}
```

#### 2. Cache Computed Values

**Problem:**
```solidity
// ❌ Recomputing constantly
function getTwiceValue(euint32 value) external returns (euint32) {
    return FHE.mul(value, FHE.asEuint32(2));
}

function getQuadrupleValue(euint32 value) external returns (euint32) {
    return FHE.mul(
        FHE.mul(value, FHE.asEuint32(2)),
        FHE.asEuint32(2)
    );  // Recomputes the multiplication!
}
```

**Solution:**
```solidity
// ✅ Cache intermediate results
function getValues(euint32 value) external returns (euint32, euint32) {
    euint32 doubled = FHE.mul(value, FHE.asEuint32(2));
    euint32 quadrupled = FHE.mul(doubled, FHE.asEuint32(2));
    return (doubled, quadrupled);
}
```

#### 3. Use Simpler Types When Possible

**Problem:**
```solidity
// ❌ Using large type when small suffices
euint64 age = FHE.asEuint64(30);  // Only need 0-150
```

**Solution:**
```solidity
// ✅ Use appropriate type
euint16 age = FHE.asEuint16(30);  // Sufficient and cheaper
```

#### 4. Avoid Unnecessary Permissions

**Problem:**
```solidity
// ❌ Setting permissions multiple times
for (uint i = 0; i < bids.length; i++) {
    FHE.allow(bids[i], msg.sender);  // Repetitive!
    FHE.allow(bids[i], admin);
}
```

**Solution:**
```solidity
// ✅ Set once
for (uint i = 0; i < bids.length; i++) {
    // Process bids
}
// Set permissions once after loop
FHE.allow(result, msg.sender);
```

#### 5. Batch Operations

**Problem:**
```solidity
// ❌ Individual transactions
function submitBid1() external { /* ... */ }
function submitBid2() external { /* ... */ }
function submitBid3() external { /* ... */ }
// Three separate transactions with overhead
```

**Solution:**
```solidity
// ✅ Batch submission
function submitMultipleBids(
    uint256[] calldata ids,
    euint64[] calldata amounts
) external {
    for (uint i = 0; i < ids.length; i++) {
        processBid(ids[i], amounts[i]);
    }
}
```

---

## Gas Profiling

### Using Hardhat Coverage

```bash
npm run coverage
```

This shows which functions use the most gas.

### Analyzing Gas Usage

```typescript
// Get gas estimate before execution
const gasEstimate = await contract.someFunction.estimateGas(params);
console.log("Estimated gas:", gasEstimate.toString());

// Get actual gas used
const tx = await contract.someFunction(params);
const receipt = await tx.wait();
console.log("Actual gas:", receipt.gasUsed.toString());
```

### Gas Budget

Set realistic gas limits:

```typescript
// Generous limit for complex operations
const tx = await contract.evaluateTender(
    {
        gasLimit: 1000000  // 1 million gas
    }
);
```

---

## Execution Optimization

### Parallel Decryption

**Instead of:**
```solidity
// ❌ Sequential decryption
for (uint i = 0; i < values.length; i++) {
    FHE.requestDecryption(values[i], callback);
    // Wait for response
}
```

**Use:**
```solidity
// ✅ Batch decryption
bytes32[] memory values = new bytes32[](count);
for (uint i = 0; i < count; i++) {
    values[i] = FHE.toBytes32(encryptedValues[i]);
}
FHE.requestDecryption(values, callback);
```

### Lazy Evaluation

**Problem:**
```solidity
// ❌ Evaluate everything immediately
function processAllBids() external {
    for (uint i = 0; i < bids.length; i++) {
        // Process and decrypt all bids
        // Even if we only need the winner
    }
}
```

**Solution:**
```solidity
// ✅ Only evaluate what's needed
function findWinner() external {
    // Only do encrypted comparisons
    // Decrypt only the winner
}
```

---

## Memory Optimization

### Stack Variables

**Efficient:**
```solidity
// ✅ Local variables (stack)
function compute(euint32 a, euint32 b) external {
    euint32 temp = FHE.add(a, b);  // Stack
    return temp;
}
```

**Inefficient:**
```solidity
// ❌ State variables (storage)
euint32 public tempResult;

function compute(euint32 a, euint32 b) external {
    tempResult = FHE.add(a, b);  // Storage - expensive!
}
```

### Array Sizing

**Efficient:**
```solidity
// ✅ Pre-allocate arrays
bytes32[] memory values = new bytes32[](count);
for (uint i = 0; i < count; i++) {
    values[i] = FHE.toBytes32(encrypted[i]);
}
```

**Inefficient:**
```solidity
// ❌ Dynamic array pushes
bytes32[] memory values;
for (uint i = 0; i < encrypted.length; i++) {
    values.push(FHE.toBytes32(encrypted[i]));  // Inefficient growth
}
```

---

## Network Optimization

### Minimizing Transactions

**Separate:**
```typescript
// ❌ Multiple transactions
await contract.submitBid(id, amount);
await contract.confirmBid(id);
await contract.submitProof(id, proof);
// Three transactions, three fees
```

**Combined:**
```typescript
// ✅ Single transaction
await contract.submitAndConfirmBid(id, amount, proof);
// One transaction, one fee
```

### Data Size Reduction

**Efficient:**
```solidity
// ✅ Compact data
struct CompactBid {
    euint64 amount;      // 8 bytes
    uint64 timestamp;    // 8 bytes
}
```

**Inefficient:**
```solidity
// ❌ Bloated data
struct BloatedBid {
    euint64 amount;
    uint256 timestamp;   // 32 bytes instead of 8
    string description;  // Much larger
}
```

---

## Example: Optimized Bidding

### Unoptimized Version

```solidity
contract SimpleBidding {
    mapping(uint => euint64[]) allBids;  // Stores all bids

    function submitBid(uint tenderId, euint64 bid) external {
        FHE.allowThis(bid);
        FHE.allow(bid, msg.sender);
        FHE.allow(bid, owner);
        allBids[tenderId].push(bid);  // Expensive push
    }

    function evaluateTender(uint tenderId) external {
        euint64 lowestBid = allBids[tenderId][0];

        for (uint i = 1; i < allBids[tenderId].length; i++) {
            ebool isLower = FHE.lt(allBids[tenderId][i], lowestBid);
            // FHE.select expensive with auction
        }
    }
}
```

**Gas Usage:** ~15,000 per bid + ~5,000 per comparison

### Optimized Version

```solidity
contract OptimizedBidding {
    struct Bid {
        euint64 amount;
        address bidder;
        uint256 timestamp;
    }

    mapping(uint => Bid[]) bids;  // Pre-allocated
    mapping(uint => euint64) lowestBid;  // Cache winner

    function submitBids(
        uint tenderId,
        euint64[] calldata amounts,
        bytes[] calldata proofs
    ) external {
        // Batch submission - single transaction
        for (uint i = 0; i < amounts.length; i++) {
            euint64 amount = FHE.fromExternal(amounts[i], proofs[i]);
            FHE.allowThis(amount);

            bids[tenderId].push(Bid({
                amount: amount,
                bidder: msg.sender,
                timestamp: block.timestamp
            }));
        }

        // Set permissions once
        FHE.allow(amount, owner);
    }

    function evaluateTender(uint tenderId) external {
        // Collect encrypted values for batch decryption
        bytes32[] memory values = new bytes32[](bids[tenderId].length);

        for (uint i = 0; i < bids[tenderId].length; i++) {
            values[i] = FHE.toBytes32(bids[tenderId][i].amount);
        }

        // Single batch decryption
        FHE.requestDecryption(values, this.processEvaluation.selector);
    }
}
```

**Gas Usage:** ~8,000 per bid + ~5,000 per batch (not per comparison)

**Savings:** ~40% reduction in gas

---

## Performance Testing

### Benchmarking

```typescript
describe("Performance", function() {
    it("Should evaluate 100 bids efficiently", async function() {
        const amounts = Array(100).fill(0).map(() =>
            Math.floor(Math.random() * 1000000)
        );

        const startGas = await contract.provider.getGasPrice();
        const tx = await contract.submitMultipleBids(amounts);
        const receipt = await tx.wait();

        console.log(`Gas used for 100 bids: ${receipt.gasUsed}`);
        console.log(`Gas per bid: ${receipt.gasUsed / 100}`);

        // Should be reasonable (adjust threshold as needed)
        expect(receipt.gasUsed).to.be.lessThan(500000);
    });
});
```

### Memory Usage

```typescript
it("Should not exceed memory limits", async function() {
    const initialMemory = process.memoryUsage().heapUsed;

    // Run expensive operation
    const result = await contract.expensiveOperation();

    const finalMemory = process.memoryUsage().heapUsed;
    const used = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`Memory used: ${used} MB`);
    expect(used).to.be.lessThan(100);  // Less than 100MB
});
```

---

## Monitoring Performance

### Log Important Metrics

```solidity
event BidSubmitted(address indexed bidder, uint256 indexed tenderId, uint256 gasCost);

function submitBid(uint256 tenderId, euint64 amount) external {
    uint256 startGas = gasleft();

    // Process bid
    // ...

    uint256 gasCost = startGas - gasleft();
    emit BidSubmitted(msg.sender, tenderId, gasCost);
}
```

### Track Over Time

Monitor gas usage trends:
- Are functions getting more expensive?
- Do new features impact performance?
- Is there a pattern in usage?

---

## Optimization Checklist

Before submission, verify:

- [ ] No redundant FHE operations
- [ ] No obvious gas waste
- [ ] Batch operations where possible
- [ ] Appropriate data types used
- [ ] Permissions set efficiently
- [ ] Memory usage is reasonable
- [ ] Tests pass with gas estimates
- [ ] No security sacrificed for performance

---

## Best Practices Summary

### DO
✅ Minimize FHE operations
✅ Use batch operations
✅ Cache intermediate results
✅ Use appropriate data types
✅ Pre-allocate arrays
✅ Test gas usage
✅ Monitor performance

### DON'T
❌ Repeat expensive operations
❌ Use oversized data types
❌ Dynamic array operations in loops
❌ Unnecessary permission calls
❌ Multiple transactions when one suffices
❌ Assume performance is optimal
❌ Sacrifice security for speed

---

## Resources

### Optimization Tools
- **Hardhat Gas Reporter** - npm package for gas analysis
- **Slither** - Static analysis for optimization suggestions
- **Profilers** - Built-in development tools

### Further Reading
- [Solidity Gas Optimization](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [FHEVM Performance Tips](https://docs.zama.ai/fhevm/performance)
- [Ethereum Gas Optimization](https://docs.soliditylang.org/en/latest/internals/optimizing_the_compiler.html)

---

## Conclusion

Performance optimization in FHEVM requires:

1. **Understanding costs** - Know which operations are expensive
2. **Strategic design** - Plan for efficiency from the start
3. **Profiling** - Measure before optimizing
4. **Testing** - Verify optimization works and maintains security

Focus on meaningful optimizations. Premature optimization is the root of all evil - optimize what matters and has demonstrable impact.

---

**Next:** Review [SECURITY.md](./SECURITY.md) to ensure optimizations don't compromise safety.
