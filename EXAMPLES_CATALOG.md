# Complete Examples Catalog

A comprehensive catalog of all available examples in the FHEVM Examples project, organized by category and difficulty level.

---

## Quick Navigation

- [Basic Examples](#basic-examples) - Foundation concepts
- [Advanced Examples](#advanced-examples) - Complex patterns
- [Domain Examples](#domain-examples) - Real-world applications
- [Integration Examples](#integration-examples) - Protocol integrations
- [By Difficulty](#by-difficulty-level)
- [By Learning Time](#by-learning-time)

---

## Basic Examples

Foundation-level examples covering essential FHEVM concepts.

### 1. FHE Counter

**Name:** `fhe-counter`

**What You'll Learn:**
- Encrypting values with FHE
- Performing FHE operations (addition, subtraction)
- Setting permissions correctly
- Basic contract structure

**Concepts:**
- `FHE.asEuint32()` - Encryption
- `FHE.add()` - Encrypted addition
- `FHE.allowThis()` - Contract permissions
- `FHE.allow()` - User permissions

**Difficulty:** Beginner

**Time to Learn:** 15-20 minutes

**Example Use Case:**
```solidity
// Increment an encrypted counter
function increment(euint32 amount) external {
    counter = FHE.add(counter, amount);
    FHE.allowThis(counter);
    FHE.allow(counter, msg.sender);
}
```

**Key Patterns:**
- ✅ Always set FHE.allowThis() after operations
- ✅ Grant user permissions for decryption
- ❌ Don't forget permissions
- ❌ Don't modify encrypted values without permissions

**Generate Standalone Repository:**
```bash
npm run create-example fhe-counter ./my-counter
cd my-counter && npm install && npm run test
```

---

### 2. Arithmetic Operations

**Name:** `fhe-arithmetic`

**What You'll Learn:**
- All FHE arithmetic operations (add, subtract, multiply)
- When to use each operation
- Gas costs and optimization
- Error handling

**Concepts:**
- `FHE.add()` - Addition
- `FHE.sub()` - Subtraction
- `FHE.mul()` - Multiplication
- `FHE.div()` - Division (encrypted/plain)

**Difficulty:** Beginner

**Time to Learn:** 20-25 minutes

**Example Use Cases:**
```solidity
// Complex calculation on encrypted data
function calculateTax(euint32 amount) external returns (euint32) {
    // Tax = amount * 0.1
    euint32 tax = FHE.mul(amount, FHE.asEuint32(10));
    tax = FHE.div(tax, 100);
    return tax;
}
```

**Operations Covered:**
- Addition: `a + b`
- Subtraction: `a - b`
- Multiplication: `a * b`
- Division: `a / b` (note: divisor must be plaintext)

**Performance Notes:**
- Addition: ~5,000 gas
- Subtraction: ~5,000 gas
- Multiplication: ~15,000 gas (most expensive)
- Division: ~7,000 gas

---

### 3. Comparison Operations

**Name:** `fhe-comparison`

**What You'll Learn:**
- Encrypted comparisons (==, <, >, etc.)
- Boolean results from encrypted data
- Using comparisons in conditionals
- Common pitfalls with encrypted booleans

**Concepts:**
- `FHE.eq()` - Equality
- `FHE.lt()` - Less than
- `FHE.lte()` - Less than or equal
- `FHE.gt()` - Greater than
- `FHE.gte()` - Greater than or equal
- `ebool` - Encrypted boolean result

**Difficulty:** Beginner

**Time to Learn:** 20-25 minutes

**Example Use Cases:**
```solidity
// Find the smaller of two encrypted values
function findSmaller(euint32 a, euint32 b) external returns (euint32) {
    ebool aIsSmaller = FHE.lt(a, b);
    return FHE.select(aIsSmaller, a, b);
}
```

**All Comparison Operations:**
- `FHE.eq(a, b)` - a == b?
- `FHE.ne(a, b)` - a != b?
- `FHE.lt(a, b)` - a < b?
- `FHE.lte(a, b)` - a <= b?
- `FHE.gt(a, b)` - a > b?
- `FHE.gte(a, b)` - a >= b?

---

### 4. Encryption Patterns

**Name:** `fhe-encryption`

**What You'll Learn:**
- Encrypting single values
- Encrypting multiple values in one call
- Input proof validation
- External encryption from frontend

**Concepts:**
- `FHE.asEuint*()` - Encrypt plain values
- `FHE.fromExternal()` - Decrypt external inputs with proof
- Input proofs
- Type conversions

**Difficulty:** Beginner

**Time to Learn:** 25-30 minutes

**Example Use Cases:**
```solidity
// Encrypt and store user data
function storePrivateData(
    euint32 socialScore,
    euint64 bankBalance,
    bytes calldata proof
) external {
    // Validate and decrypt
    euint32 validated = FHE.fromExternal(socialScore, proof);

    // Store encrypted
    userProfiles[msg.sender].score = validated;
    userProfiles[msg.sender].balance = bankBalance;
}
```

**Key Topics:**
- Single value encryption
- Multiple value encryption
- Frontend encryption flow
- Proof validation

---

### 5. Decryption Patterns

**Name:** `fhe-decryption`

**What You'll Learn:**
- User decryption (from frontend)
- Public decryption (from contract)
- Async decryption requests
- Handling decrypted values

**Concepts:**
- User-side decryption
- Asynchronous decryption requests
- `FHE.requestDecryption()`
- Decryption callbacks

**Difficulty:** Beginner

**Time to Learn:** 25-30 minutes

**Example Use Cases:**
```solidity
// Request decryption of results
function requestResults(uint256 tenderId) external {
    bytes32[] memory values = new bytes32[](2);
    values[0] = FHE.toBytes32(winningBid[tenderId]);
    values[1] = FHE.toBytes32(winnerScore[tenderId]);

    FHE.requestDecryption(values, this.processResults.selector);
}

function processResults(uint256[] memory decrypted) external {
    uint256 winBid = decrypted[0];
    uint256 winScore = decrypted[1];
}
```

---

## Advanced Examples

Intermediate-to-advanced patterns and real-world scenarios.

### 6. Access Control Patterns

**Name:** `fhe-access-control`

**What You'll Learn:**
- FHE permission model
- `FHE.allow()` and `FHE.allowThis()`
- `FHE.allowTransient()` for temporary access
- Multi-party access control
- Permission delegation

**Concepts:**
- Contract self-permissions
- User-specific permissions
- Transient permissions
- Permission granularity

**Difficulty:** Intermediate

**Time to Learn:** 30-40 minutes

**Example Use Cases:**
```solidity
// Fine-grained access control
function grantAccess(euint32 value, address user, bool isAdmin) external {
    FHE.allowThis(value);           // Contract access
    FHE.allow(value, user);         // User access

    if (isAdmin) {
        FHE.allow(value, adminAddress);
    }
}
```

**Topics Covered:**
- Basic permission model
- Multi-recipient permissions
- Revocation challenges
- Best practices for permissions

---

### 7. Input Proof Validation

**Name:** `fhe-input-proof`

**What You'll Learn:**
- What are input proofs
- Why they're necessary
- Validating input proofs
- Zero-knowledge proof concepts (simplified)
- Common validation mistakes

**Concepts:**
- Input proof structure
- Signer binding
- Proof validation
- Security implications

**Difficulty:** Intermediate

**Time to Learn:** 30-40 minutes

**Example Use Cases:**
```solidity
// Properly validate input proofs
function submitWithProof(
    externalEuint32 value,
    bytes calldata proof
) external {
    require(proof.length > 0, "Proof required");
    require(msg.sender == expectedSigner, "Signer mismatch");

    euint32 validated = FHE.fromExternal(value, proof);
    // Now it's safe to use
}
```

---

### 8. Handle Management

**Name:** `fhe-handles`

**What You'll Learn:**
- What are encrypted handles
- How handles are generated
- Handle lifecycle
- Symbolic execution
- Handle security implications

**Concepts:**
- Encrypted value handles
- Handle generation
- Storage and retrieval
- Handle expiration

**Difficulty:** Intermediate

**Time to Learn:** 35-45 minutes

---

### 9. Anti-Patterns (What NOT to Do)

**Name:** `fhe-anti-patterns`

**What You'll Learn:**
- Common FHE mistakes
- Why they fail
- How to fix them
- Security implications
- Performance pitfalls

**Concepts:**
- Forgetting `FHE.allowThis()`
- Signer mismatches
- Invalid state transitions
- Unnecessary operations
- Data exposure

**Difficulty:** Intermediate

**Time to Learn:** 40-50 minutes

**Anti-Patterns Covered:**
```solidity
// ❌ MISTAKE 1: Forgetting allowThis
function badExample1(euint32 value) external {
    euint32 result = FHE.add(value, FHE.asEuint32(100));
    return result;  // Missing FHE.allowThis!
}

// ❌ MISTAKE 2: Signer mismatch
function badExample2(euint32 value) external {
    // Value encrypted for alice, but msg.sender is bob
    FHE.allow(value, bob);  // Doesn't help
}

// ❌ MISTAKE 3: View function with encrypted
function badExample3() external view returns (euint32) {
    return secretValue;  // Can't return encrypted in view!
}

// ❌ MISTAKE 4: Unnecessary FHE operations
function badExample4(euint32 a, euint32 b) external {
    for (uint i = 0; i < 100; i++) {
        euint32 temp = FHE.mul(a, b);  // Redundant multiplications
    }
}
```

---

### 10. State Management

**Name:** `fhe-state-management`

**What You'll Learn:**
- Managing encrypted state
- State transitions
- Consistency checking
- State recovery
- Storage optimization

**Concepts:**
- State storage strategies
- Encrypted state persistence
- State validation
- Update patterns

**Difficulty:** Intermediate

**Time to Learn:** 35-45 minutes

---

## Domain Examples

Real-world application examples.

### 11. Blind Auction

**Name:** `blind-auction`

**What You'll Learn:**
- Implementing sealed-bid auctions
- Privacy preservation in auctions
- Multi-stage auction logic
- Bid evaluation
- Winner selection

**Concepts:**
- Encrypted bid amounts
- Public bid submission
- Private evaluation
- Winner announcement

**Difficulty:** Advanced

**Time to Learn:** 60-90 minutes

**Example Use Case:**
```solidity
contract BlindAuction {
    mapping(uint => euint64[]) bidAmounts;

    function submitBid(uint auctionId, euint64 bid) external {
        bidAmounts[auctionId].push(bid);
        FHE.allowThis(bid);
        FHE.allow(bid, owner);
    }

    function selectWinner(uint auctionId) external onlyOwner {
        // Encrypted comparison finds winner
        // Only winner is revealed
    }
}
```

**Key Features:**
- Privacy during bidding phase
- Fair winner selection
- Sealed bid security
- Privacy preservation after auction

---

### 12. Dutch Auction

**Name:** `dutch-auction`

**What You'll Learn:**
- Descending price auction mechanism
- Time-based price updates
- Encrypted vs public prices
- Comparative analysis with blind auction

**Concepts:**
- Descending prices
- Encrypted pricing
- Time sensitivity
- Competitive dynamics

**Difficulty:** Advanced

**Time to Learn:** 50-70 minutes

---

### 13. Confidential Token

**Name:** `confidential-token`

**What You'll Learn:**
- Token balances in encrypted form
- Transfer operations on encrypted amounts
- Balance checking without exposure
- Token economics with privacy

**Concepts:**
- Encrypted balances
- Private transfers
- Anonymous trading
- Zero-knowledge proofs of ownership

**Difficulty:** Advanced

**Time to Learn:** 70-90 minutes

---

### 14. Private Voting

**Name:** `private-voting`

**What You'll Learn:**
- Anonymous voting systems
- Encrypted vote counting
- Vote verification
- Result computation
- Voter privacy

**Concepts:**
- Encrypted votes
- Anonymous submission
- Vote aggregation
- Privacy guarantees

**Difficulty:** Advanced

**Time to Learn:** 75-100 minutes

---

## Integration Examples

Integration with external protocols and standards.

### 15. ERC-7984 Token

**Name:** `erc7984-token`

**What You'll Learn:**
- OpenZeppelin confidential token standard
- Standard interface compliance
- Integration patterns
- Upgrading from ERC20

**Concepts:**
- ERC-7984 interface
- Confidential token transfers
- Approval mechanisms
- Standard compliance

**Difficulty:** Advanced

**Time to Learn:** 80-120 minutes

**Generated From:** OpenZeppelin confidential contracts

---

### 16. Token Wrapper

**Name:** `token-wrapper`

**What You'll Learn:**
- Wrapping ERC20 tokens
- Confidential wrapper contracts
- Deposit and withdrawal mechanisms
- Exchange mechanics

**Concepts:**
- ERC20 integration
- Wrapped tokens
- Liquidity management
- Conversion rates

**Difficulty:** Advanced

**Time to Learn:** 60-90 minutes

---

### 17. Token Swap

**Name:** `token-swap`

**What You'll Learn:**
- Swapping between confidential tokens
- ERC-7984 to ERC-7984 swaps
- Encrypted exchange rates
- Liquidity provision

**Concepts:**
- Token exchange
- Confidential swaps
- Price discovery
- Liquidity mechanisms

**Difficulty:** Advanced

**Time to Learn:** 90-120 minutes

---

### 18. Vesting Wallet

**Name:** `vesting-wallet`

**What You'll Learn:**
- Token vesting with privacy
- Time-locked releases
- Beneficiary privacy
- Encrypted vesting schedules

**Concepts:**
- Vesting schedules
- Time-based releases
- Cliff periods
- Beneficiary management

**Difficulty:** Intermediate

**Time to Learn:** 50-70 minutes

---

## By Difficulty Level

### Beginner (5 examples)
For developers new to FHE:

1. **fhe-counter** (15-20 min)
2. **fhe-arithmetic** (20-25 min)
3. **fhe-comparison** (20-25 min)
4. **fhe-encryption** (25-30 min)
5. **fhe-decryption** (25-30 min)

**Total Learning Time:** ~2 hours

### Intermediate (5 examples)
For developers comfortable with basics:

6. **fhe-access-control** (30-40 min)
7. **fhe-input-proof** (30-40 min)
8. **fhe-handles** (35-45 min)
9. **fhe-anti-patterns** (40-50 min)
10. **fhe-state-management** (35-45 min)

**Total Learning Time:** ~3-4 hours

### Advanced (8 examples)
For experienced smart contract developers:

11. **blind-auction** (60-90 min)
12. **dutch-auction** (50-70 min)
13. **confidential-token** (70-90 min)
14. **private-voting** (75-100 min)
15. **erc7984-token** (80-120 min)
16. **token-wrapper** (60-90 min)
17. **token-swap** (90-120 min)
18. **vesting-wallet** (50-70 min)

**Total Learning Time:** ~9-13 hours

---

## By Learning Time

### Quick Examples (< 30 min)
- fhe-counter
- fhe-arithmetic
- fhe-comparison

### Medium Examples (30-60 min)
- fhe-encryption
- fhe-decryption
- fhe-access-control
- fhe-input-proof
- fhe-anti-patterns
- dutch-auction
- vesting-wallet

### Comprehensive Examples (> 60 min)
- fhe-handles
- fhe-state-management
- blind-auction
- confidential-token
- private-voting
- erc7984-token
- token-wrapper
- token-swap

---

## By Use Case

### Financial Applications
- Blind Auction (bidding privacy)
- Confidential Token (balance privacy)
- ERC-7984 Token (standard token)
- Token Wrapper (legacy integration)
- Token Swap (exchange privacy)

### Governance
- Private Voting (voter privacy)
- Vesting Wallet (private beneficiaries)

### Technical Foundations
- FHE Counter (basics)
- Arithmetic Operations (calculations)
- Comparison Operations (conditions)
- Encryption/Decryption (I/O)
- Access Control (permissions)
- Input Proof Validation (security)
- Handle Management (internals)
- Anti-Patterns (mistakes to avoid)
- State Management (persistence)

---

## Learning Recommendations

### Path 1: Foundations (3-4 hours)
1. Start with **fhe-counter**
2. Learn **fhe-arithmetic**
3. Study **fhe-comparison**
4. Understand **fhe-encryption**
5. Master **fhe-decryption**

### Path 2: Intermediate (6-8 hours)
Start with Path 1, then add:
6. Explore **fhe-access-control**
7. Validate with **fhe-input-proof**
8. Review **fhe-anti-patterns**

### Path 3: Applications (15-20 hours)
Start with Paths 1 & 2, then choose:
- **Finance Path**: Blind Auction → Token Wrapper → Token Swap
- **Governance Path**: Private Voting → Vesting Wallet
- **Standards Path**: ERC-7984 → Token Wrapper

### Path 4: Mastery (25-30 hours)
Complete all examples in recommended order.

---

## Quick Reference

### Total Examples: 18

- **Basic:** 5
- **Advanced:** 5
- **Domain:** 4
- **Integration:** 4

### Total Learning Time
- Beginner: ~2 hours
- Intermediate: ~3-4 hours
- Advanced: ~9-13 hours
- **Total: ~18-25 hours for all examples**

### Skills Covered
- ✅ FHE Encryption/Decryption
- ✅ All FHE Operations
- ✅ Permission Management
- ✅ Access Control
- ✅ Smart Contract Patterns
- ✅ Real-World Applications
- ✅ Standard Integration
- ✅ Security Best Practices

---

## Getting Started

### Generate Individual Example
```bash
npm run create-example fhe-counter ./my-example
cd my-example && npm install && npm run test
```

### Generate Category
```bash
npm run create-category basic ./basic-examples
cd basic-examples && npm install && npm run test
```

### View Documentation
```bash
npm run generate-docs
```

---

## Adding New Examples

To add your own examples to this catalog:

1. Create contract in `/contracts/[category]/`
2. Create test in `/test/[category]/`
3. Register in `EXAMPLES_MAP` in `scripts/lib/config.ts`
4. Update this catalog with entry
5. Run `npm run generate-docs`

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed instructions.

---

## Questions About Examples?

- **How do I understand X concept?** → Check relevant example
- **How do I get started?** → Start with Path 1 above
- **What should I learn next?** → Check recommendations
- **Need more detail?** → See full documentation in [COMPETITION_INDEX.md](./COMPETITION_INDEX.md)

---

**Last Updated:** December 31, 2025

For the latest examples and updates, check the [CHANGELOG.md](./CHANGELOG.md).
