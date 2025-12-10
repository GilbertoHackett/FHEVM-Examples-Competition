# Security Considerations and Best Practices

This document outlines security best practices for FHEVM smart contract development and submission.

---

## Overview

Security in FHEVM applications requires careful attention to both traditional smart contract security and FHE-specific considerations.

---

## Smart Contract Security

### Input Validation

**✅ DO: Validate all inputs**

```solidity
function submitBid(
    uint256 tenderId,
    euint64 encryptedBid,
    bytes calldata inputProof
) external {
    // Validate plain inputs
    require(tenderId > 0, "Invalid tender ID");
    require(inputProof.length > 0, "Invalid proof");

    // Decrypt and validate
    euint64 bid = FHE.fromExternal(encryptedBid, inputProof);
    // Now bid is validated as part of decryption
}
```

**❌ DON'T: Skip validation**

```solidity
// ❌ No validation - dangerous!
function submitBid(euint64 encryptedBid) external {
    // Use encryptedBid without checking anything
}
```

### Access Control

**✅ DO: Implement proper access control**

```solidity
contract SecureContract {
    address public owner;
    mapping(address => bool) public authorized;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    function restrictedFunction() external onlyAuthorized {
        // Only authorized addresses can call
    }
}
```

**❌ DON'T: Make everything public**

```solidity
// ❌ No access control
contract InsecureContract {
    euint64 private secret;

    function revealSecret() external returns (euint64) {
        return secret;  // Anyone can call!
    }
}
```

### State Validation

**✅ DO: Validate state transitions**

```solidity
enum Status { Open, Closed, Evaluated }
Status public status;

function closeTender() external onlyOwner {
    require(status == Status.Open, "Already closed");
    status = Status.Closed;
}

function evaluate() external onlyOwner {
    require(status == Status.Closed, "Not ready");
    status = Status.Evaluated;
}
```

**❌ DON'T: Allow invalid state transitions**

```solidity
// ❌ No state validation
function evaluate() external {
    status = Status.Evaluated;  // Any state is fine?
}
```

### Reentrancy Prevention

**✅ DO: Use checks-effects-interactions pattern**

```solidity
function processBid(uint256 amount) external {
    // Checks
    require(amount > 0, "Invalid amount");

    // Effects
    bids[msg.sender] = amount;
    totalBids += amount;

    // Interactions (last!)
    // Any external calls here
}
```

**❌ DON'T: Interact before updating state**

```solidity
// ❌ Vulnerable to reentrancy
function withdraw(uint256 amount) external {
    // Interaction first!
    (bool success, ) = msg.sender.call{value: amount}("");

    // Effects after (too late!)
    balances[msg.sender] -= amount;
}
```

---

## FHE-Specific Security

### Permission Management

**✅ DO: Always set permissions**

```solidity
function submitEncrypted(euint32 value) external {
    // Process the value
    euint32 result = FHE.add(value, FHE.asEuint32(100));

    // Set permissions for contract
    FHE.allowThis(result);

    // Set permissions for user
    FHE.allow(result, msg.sender);

    // Only now is it safe to use
    bids[msg.sender] = result;
}
```

**❌ DON'T: Forget permissions**

```solidity
// ❌ Missing allowThis!
function submitEncrypted(euint32 value) external {
    euint32 result = FHE.add(value, FHE.asEuint32(100));
    // Forgot allowThis - result unusable!
    bids[msg.sender] = result;
}

// ❌ Missing user permission!
function submitEncrypted(euint32 value) external {
    euint32 result = FHE.add(value, FHE.asEuint32(100));
    FHE.allowThis(result);
    // User can't decrypt!
}
```

### Input Proof Validation

**✅ DO: Require valid input proofs**

```solidity
function submitValue(
    externalEuint32 encryptedValue,
    bytes calldata inputProof
) external {
    // Proof is required and will be validated
    require(inputProof.length > 0, "Proof required");

    // Decrypt with proof
    euint32 value = FHE.fromExternal(encryptedValue, inputProof);

    // Use value safely
    process(value);
}
```

**❌ DON'T: Accept empty proofs**

```solidity
// ❌ Empty proof accepted
function submitValue(externalEuint32 value) external {
    euint32 decrypted = FHE.fromExternal(value, bytes(""));
    // Unsafe!
}
```

### Signer Matching

**✅ DO: Ensure signer matches encryption**

```solidity
// Frontend
const encrypted = await fhevm.createEncryptedInput(
    contractAddress,
    alice.address  // This matters!
).add32(value).encrypt();

// Contract
function submitFromAlice(euint32 value) external {
    require(msg.sender == alice, "Wrong sender");
    // value was encrypted for alice, msg.sender is alice
    // Everything matches!
}
```

**❌ DON'T: Mix signers**

```solidity
// ❌ Signer mismatch
// Frontend: encrypted for alice.address
const encrypted = fhevm.createEncryptedInput(
    contract,
    alice.address
).add32(value).encrypt();

// Contract: called by bob
function submit(euint32 value) external {
    // msg.sender is bob, but value encrypted for alice
    // This will fail!
}
```

---

## Sensitive Data Handling

### What Should Be Encrypted

**Encrypt these:**
- Bid amounts
- Prices and costs
- Personal information
- Qualification scores
- Voting choices
- Trading amounts
- Any competitive information

```solidity
euint64 bidAmount;           // ✅ Encrypt
uint256 tenderId;            // Plain (public)
euint8 qualificationScore;   // ✅ Encrypt
address bidder;              // Plain (public)
```

### What Can Be Plain

**Keep these public:**
- Tender/auction IDs
- Timestamps
- Status (open/closed/awarded)
- Bidder addresses (though consider anonymity)
- Winner information (after evaluation)

### Privacy Preservation

**✅ DO: Minimize exposure**

```solidity
// Evaluate without exposing all bids
function evaluateTender(uint256 tenderId) external {
    // Encrypted comparison happens on-chain
    // Only winner is revealed
}
```

**❌ DON'T: Decrypt unnecessarily**

```solidity
// ❌ Unnecessary decryption
function getAllBids() external returns (uint256[] memory) {
    // Decrypts all bids to return them
    // Privacy lost!
}
```

---

## Common Vulnerabilities

### 1. Integer Overflow/Underflow

**Vulnerable Code:**
```solidity
euint32 sum = FHE.add(value1, value2);  // Could overflow!
```

**Safe Code:**
```solidity
// Check before addition if ranges are known
require(value1 <= type(uint32).max - value2, "Overflow");
euint32 sum = FHE.add(value1, value2);
```

### 2. Division by Zero

**Vulnerable Code:**
```solidity
euint32 result = FHE.div(numerator, denominator);  // Could be zero!
```

**Safe Code:**
```solidity
require(denominator != 0, "Division by zero");
euint32 result = FHE.div(numerator, denominator);
```

### 3. Missing Bounds Checks

**Vulnerable Code:**
```solidity
function setBid(uint256 amount) external {
    bids[msg.sender] = FHE.asEuint64(amount);
    // amount could be anything!
}
```

**Safe Code:**
```solidity
function setBid(uint256 amount) external {
    require(amount > 0, "Amount must be positive");
    require(amount <= MAX_BID, "Amount exceeds maximum");
    bids[msg.sender] = FHE.asEuint64(amount);
}
```

### 4. Uninitialized Variables

**Vulnerable Code:**
```solidity
euint32 counter;  // Uninitialized

function increment(euint32 amount) external {
    counter = FHE.add(counter, amount);  // counter undefined!
}
```

**Safe Code:**
```solidity
euint32 counter;

constructor() {
    counter = FHE.asEuint32(0);  // Initialize
}
```

---

## Testing for Security

### Unit Tests

```typescript
describe("Security Tests", function() {
    it("Should reject unauthorized access", async function() {
        await expect(
            contract.connect(attacker).restrictedFunction()
        ).to.be.revertedWith("Not authorized");
    });

    it("Should validate input ranges", async function() {
        await expect(
            contract.submitBid(0)  // Invalid
        ).to.be.revertedWith("Amount must be positive");
    });

    it("Should prevent reentrancy", async function() {
        // Test that state is updated before external calls
        // Verify contract can't be re-entered
    });
});
```

### Security Checklist

- [ ] All inputs validated
- [ ] Access control implemented
- [ ] State transitions validated
- [ ] Permissions always set for encrypted values
- [ ] No hardcoded values in contracts
- [ ] No uninitialized variables
- [ ] Error messages are descriptive
- [ ] No obvious logic flaws
- [ ] Follows principle of least privilege
- [ ] Dependencies are secure

---

## Code Review Checklist

### Before Submission

- [ ] **Solidity Security**
  - [ ] No overflow/underflow vulnerabilities
  - [ ] No division by zero
  - [ ] No uninitialized variables
  - [ ] Proper error handling

- [ ] **FHE Security**
  - [ ] All FHE operations have proper permissions
  - [ ] Input proofs are validated
  - [ ] Encryption/decryption is correct
  - [ ] Signers match between frontend and contract

- [ ] **Access Control**
  - [ ] Functions have appropriate access modifiers
  - [ ] Admin functions are protected
  - [ ] Users can only access their own data
  - [ ] No privilege escalation paths

- [ ] **Data Handling**
  - [ ] Sensitive data is encrypted
  - [ ] No unnecessary data exposure
  - [ ] State changes are atomic
  - [ ] Privacy is maintained

- [ ] **Testing**
  - [ ] All test cases pass
  - [ ] Edge cases are covered
  - [ ] Error cases are tested
  - [ ] Security scenarios are tested

---

## Secure Coding Patterns

### Pattern 1: Secure Bidding

```solidity
contract SecureBidding {
    struct Bid {
        euint64 amount;
        euint8 score;
        bool submitted;
    }

    mapping(address => Bid) bids;

    function submitBid(
        euint64 encryptedAmount,
        euint8 encryptedScore,
        bytes calldata proof
    ) external {
        // Validate caller
        require(msg.sender != address(0), "Invalid sender");

        // Decrypt and validate
        euint64 amount = FHE.fromExternal(encryptedAmount, proof);

        // Permissions
        FHE.allowThis(amount);
        FHE.allow(amount, msg.sender);

        // Store
        bids[msg.sender] = Bid({
            amount: amount,
            score: encryptedScore,
            submitted: true
        });
    }
}
```

### Pattern 2: Secure Evaluation

```solidity
function evaluateTender(uint256 tenderId) external onlyOwner {
    // Ensure tender exists and is ready
    require(tenderExists[tenderId], "Tender not found");
    require(block.timestamp > deadline[tenderId], "Not ready");

    // Compare encrypted values
    address winner = address(0);
    euint64 lowestBid;

    for (uint i = 0; i < bidders.length; i++) {
        if (i == 0) {
            lowestBid = bids[bidders[i]].amount;
            winner = bidders[i];
        } else {
            ebool isLower = FHE.lt(
                bids[bidders[i]].amount,
                lowestBid
            );
            // Use result to update winner
        }
    }

    // Record winner (after evaluation)
    tenderWinner[tenderId] = winner;
}
```

---

## Dependency Security

### Secure Dependencies

```json
{
  "@fhevm/solidity": "0.9.1",
  "@fhevm/hardhat-plugin": "0.3.0",
  "ethers": "6.7.1",
  "hardhat": "2.19.2"
}
```

### Checking for Vulnerabilities

```bash
# Check for known vulnerabilities
npm audit

# Update to safe versions
npm audit fix

# Check specific package
npm audit @fhevm/solidity
```

### License Compliance

- Use compatible licenses
- Document all dependencies
- Include license files
- Respect open source terms

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** publicly disclose the issue
2. **DO** report to the FHEVM team:
   - Email: security@zama.ai
   - Or through GitHub security advisory
3. **DO** provide:
   - Detailed description
   - Steps to reproduce
   - Impact assessment
   - Suggested fix (if known)

---

## Security Resources

### Official Security Docs
- [FHEVM Security](https://docs.zama.ai/fhevm/security)
- [Solidity Security](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [OpenZeppelin Audits](https://docs.openzeppelin.com/contracts/4.x/security)

### Tools
- **Slither** - Static analysis for Solidity
- **Mythril** - Security analysis tool
- **Hardhat Coverage** - Test coverage measurement
- **npm audit** - Dependency vulnerability scanning

### Learning
- OWASP Smart Contract Top 10
- Secureum RACE series
- Trail of Bits blog
- Consensys Smart Contract Security

---

## Conclusion

Security in FHEVM development requires:

1. **Understanding FHEVM specifics**
   - Permission model
   - Input proofs
   - Encryption/decryption

2. **Following smart contract best practices**
   - Input validation
   - Access control
   - Careful state management

3. **Comprehensive testing**
   - Unit tests
   - Integration tests
   - Security scenarios

4. **Code review**
   - Self-review
   - Peer review
   - Automated tools

Prioritize security in your submission. Write secure code that the community can learn from and trust.

---

**Next:** Review [API_REFERENCE.md](./API_REFERENCE.md) for secure usage patterns of FHE functions.
