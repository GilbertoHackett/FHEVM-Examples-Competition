# Best Practices - FHEVM Development

Comprehensive guide to best practices for developing FHEVM applications.

---

## 🏗️ Architecture & Design

### 1. Contract Organization

**Do**:
```solidity
contract MyExample {
    // 1. State variables
    euint32 private encryptedValue;

    // 2. Events
    event ValueUpdated(address indexed user);

    // 3. Constructor
    constructor() {}

    // 4. External functions
    function setValue(euint32 value) external {}

    // 5. Internal functions
    function _validateInput(euint32 value) internal {}

    // 6. Private functions
    function _processValue(euint32 value) private {}
}
```

**Don't**:
```solidity
contract MyExample {
    // Unorganized, hard to navigate
    function doSomething() {}
    euint32 private value;
    event Updated();
    function doSomethingElse() {}
}
```

### 2. State Management

**Do**:
```solidity
// Clear state tracking
contract Auction {
    enum State { OPEN, CLOSED, FINALIZED }
    State public auctionState;
    euint32 public highestBid;

    function placeBid(euint32 amount) external {
        require(auctionState == State.OPEN, "Auction closed");
        // ...
    }
}
```

**Don't**:
```solidity
// Implicit state
contract Auction {
    euint32 public highestBid;
    bool public closed;  // Multiple ways to track state
    bool public finalized;
    // Confusing - what if both are true?
}
```

---

## 🔒 Security Best Practices

### 1. Input Validation

**Do**:
```solidity
function deposit(euint32 amount) external {
    // Validate before processing
    require(FHE.isInitialized(amount), "Amount not initialized");
    // Additional checks...

    // Then process
    balances[msg.sender] = FHE.add(balances[msg.sender], amount);
}
```

**Don't**:
```solidity
function deposit(euint32 amount) external {
    // Process without validation
    balances[msg.sender] = FHE.add(balances[msg.sender], amount);
}
```

### 2. Permission Management

**Do**:
```solidity
function revealBid(euint32 encryptedBid) external returns (uint32) {
    // Only caller can see their own bid
    euint32 bid = decryptedBids[msg.sender];

    // Allow only sender to decrypt
    FHE.allow(bid, msg.sender);

    return FHE.decrypt(bid);
}
```

**Don't**:
```solidity
function revealBid() external returns (uint32) {
    // Anyone can decrypt anyone's bid
    return FHE.decrypt(decryptedBids[msg.sender]);
}
```

### 3. Access Control

**Do**:
```solidity
mapping(address => bool) private admins;

modifier onlyAdmin() {
    require(admins[msg.sender], "Only admin");
    _;
}

function updateSettings(euint32 newValue) external onlyAdmin {
    // Only admins can call
    settings = newValue;
}
```

**Don't**:
```solidity
function updateSettings(euint32 newValue) external {
    // Anyone can call - security vulnerability!
    settings = newValue;
}
```

### 4. Overflow/Underflow Protection

**Do**:
```solidity
// Solidity 0.8.0+ has automatic overflow/underflow protection
// euint32 has range 0 to 2^32-1
function increment(euint32 value) external pure returns (euint32) {
    // This will revert if value would exceed euint32 range
    return FHE.add(value, 1);
}
```

**Don't**:
```solidity
// Don't ignore edge cases
function unsafeIncrement(euint32 value) external pure returns (euint32) {
    // What if value is already at maximum?
    return FHE.add(value, euint32(2));  // Might overflow
}
```

---

## ⚡ Performance Optimization

### 1. Gas Efficiency

**Do**:
```solidity
// Batch operations
function batchUpdate(euint32[] calldata values) external {
    for (uint i = 0; i < values.length; i++) {
        // Process multiple at once
        // More efficient than separate calls
        encryptedBalances[i] = FHE.add(encryptedBalances[i], values[i]);
    }
}

// Use appropriate types
function storeSmallValue(uint8 value) external {
    // Use euint8 for small values, not euint32
    euint8 encrypted = FHE.asEuint8(value);
    smallValue = encrypted;
}
```

**Don't**:
```solidity
// Inefficient - single operation per call
function update(euint32 value) external {
    encryptedValue = FHE.add(encryptedValue, value);
}

// Wrong type selection
function storeSmallValue(uint8 value) external {
    // Using euint32 for small value wastes gas
    euint32 encrypted = FHE.asEuint32(value);
}
```

### 2. Caching & Storage

**Do**:
```solidity
// Cache frequently accessed values
function complexCalculation(euint32 input) external {
    euint32 cached = encryptedValue;  // Cache storage read

    // Use cached value multiple times
    euint32 result1 = FHE.add(cached, input);
    euint32 result2 = FHE.mul(cached, 2);

    // Avoid re-reading from storage
}
```

**Don't**:
```solidity
// Re-read from storage repeatedly
function complexCalculation(euint32 input) external {
    euint32 result1 = FHE.add(encryptedValue, input);      // Read 1
    euint32 result2 = FHE.mul(encryptedValue, 2);           // Read 2
    euint32 result3 = FHE.sub(encryptedValue, input);       // Read 3
    // Multiple storage reads - inefficient
}
```

### 3. Operation Ordering

**Do**:
```solidity
// Optimized operation order
function optimized(euint32 a, euint32 b, euint32 c) external {
    // Cheaper operations first
    euint32 sum = FHE.add(a, b);      // ~5k gas
    euint32 result = FHE.mul(sum, c); // ~15k gas
}
```

**Don't**:
```solidity
// Expensive operations first
function inefficient(euint32 a, euint32 b, euint32 c) external {
    // Expensive operation first
    euint32 mult = FHE.mul(a, b);  // ~15k gas (may fail if result unused)
    euint32 result = FHE.add(mult, c);
}
```

---

## 🧪 Testing Best Practices

### 1. Test Structure

**Do**:
```typescript
describe("Counter", function () {
    let instance: FhevmInstance;
    let counter: Counter;

    before(async function () {
        instance = await getFhevmInstance();
        const factory = await ethers.getContractFactory("Counter");
        counter = await factory.deploy();
    });

    describe("Increment", function () {
        it("should increment encrypted value", async function () {
            // Arrange
            const initialValue = 100;
            const encrypted = instance.encrypt32(initialValue);

            // Act
            await counter.increment(encrypted);

            // Assert
            const result = instance.decrypt(counter.value());
            expect(result).to.equal(initialValue + 1);
        });

        it("should handle boundary values", async function () {
            // Edge case testing
        });

        it("should reject invalid input", async function () {
            // Error case testing
        });
    });
});
```

**Don't**:
```typescript
// Unstructured, hard to maintain
describe("Counter", function () {
    it("test", async function () {
        // No setup, no clear assertions
        const result = await counter.doSomething();
    });
});
```

### 2. Coverage Goals

**Do**:
```bash
# Aim for >80% coverage
npm run test:coverage

# Review coverage report
open coverage/index.html

# Identify uncovered lines
# Write tests to cover them
```

**Don't**:
```bash
# Don't assume tests pass without checking coverage
npm run test

# Don't ignore uncovered lines
# Missing coverage = potential bugs
```

---

## 📝 Code Quality

### 1. Comments & Documentation

**Do**:
```solidity
/**
 * @notice Encrypts and stores a user's bid
 * @param bidAmount The amount to bid (in wei)
 * @dev Only stores encrypted value, bidder identity is hidden
 * @return encryptedBid The encrypted bid amount
 */
function placeBid(uint256 bidAmount) external returns (euint32) {
    require(bidAmount > 0, "Bid must be positive");

    euint32 encrypted = FHE.asEuint32(bidAmount);
    encryptedBids[msg.sender] = encrypted;

    return encrypted;
}
```

**Don't**:
```solidity
// Unclear code with no documentation
function pb(uint256 a) external returns (euint32) {
    euint32 e = FHE.asEuint32(a);
    b[msg.sender] = e;
    return e;
}
```

### 2. Naming Conventions

**Do**:
```solidity
// Clear, descriptive names
euint32 private encryptedHighestBid;
uint256 private auctionEndTime;
mapping(address => euint32) private bidderBalances;

function updateEncryptedValue(euint32 newValue) external { }
function validateBidAmount(euint32 amount) external view returns (bool) { }
```

**Don't**:
```solidity
// Unclear abbreviations
euint32 private hb;
uint256 private et;
mapping(address => euint32) private bb;

function upd(euint32 v) external { }
function val(euint32 a) external view returns (bool) { }
```

---

## 🔄 Development Workflow

### 1. Development Cycle

**Do**:
1. Write test first (TDD)
2. Write minimal code to pass test
3. Run all tests
4. Check coverage
5. Refactor if needed
6. Repeat

```bash
npm run test              # Run tests
npm run test:coverage    # Check coverage
npm run lint:fix         # Fix style issues
npm run compile          # Verify compilation
```

**Don't**:
1. Write code without tests
2. Assume it works
3. Test only happy path
4. Ignore code quality

### 2. Deployment Process

**Do**:
1. Test on local network
2. Test on testnet
3. Final security review
4. Deploy to mainnet
5. Monitor behavior

```bash
# 1. Local
npm run deploy -- --network localhost

# 2. Testnet
npm run deploy -- --network sepolia

# 3. Verify
npx hardhat verify --network sepolia ADDRESS

# 4. Monitor
```

**Don't**:
1. Deploy directly to mainnet without testing
2. Skip testnet testing
3. Deploy unaudited code to mainnet
4. Ignore monitoring

---

## 🔐 Security Checklist

Before deployment, verify:

- [ ] All inputs validated
- [ ] Permissions correctly managed
- [ ] No hardcoded sensitive data
- [ ] Access control implemented
- [ ] Error handling complete
- [ ] Tests cover >80%
- [ ] No obvious vulnerabilities
- [ ] Code reviewed by peers
- [ ] Security audit completed (for mainnet)
- [ ] Emergency pause mechanism (for mainnet)

---

## 📊 Performance Checklist

Before deployment, verify:

- [ ] Gas costs benchmarked
- [ ] Expensive operations minimized
- [ ] Storage access optimized
- [ ] Batch operations used where applicable
- [ ] Appropriate data types selected
- [ ] No unnecessary loops
- [ ] Test performance under load
- [ ] Optimization goals met

---

## 📚 Additional Resources

- [SECURITY.md](./SECURITY.md) - Security patterns
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing strategies
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API

---

**Last Updated**: December 31, 2025
**Version**: 1.0

*Follow these best practices to build secure, efficient, and maintainable FHEVM applications.*
