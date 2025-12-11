# Examples Quick Reference

Quick lookup guide for all 18 FHEVM examples with key information at a glance.

---

## 📋 All 18 Examples Overview

| # | Name | Category | Difficulty | Key Concepts | Lines |
|---|---|---|---|---|---|
| 1 | Counter | Basic | ⭐ | Encrypted state, increment | ~50 |
| 2 | Arithmetic | Basic | ⭐ | Operations on encrypted values | ~60 |
| 3 | Comparison | Basic | ⭐ | Compare encrypted values | ~55 |
| 4 | Encryption | Basic | ⭐ | Input encryption | ~40 |
| 5 | Decryption | Basic | ⭐ | Async decryption | ~50 |
| 6 | Access Control | Advanced | ⭐⭐ | Role-based permissions | ~100 |
| 7 | Input Proof | Advanced | ⭐⭐ | Input validation | ~80 |
| 8 | Handles | Advanced | ⭐⭐ | Handle lifecycle | ~90 |
| 9 | Anti-patterns | Advanced | ⭐⭐ | Common mistakes | ~110 |
| 10 | State Management | Advanced | ⭐⭐ | Encrypted state | ~120 |
| 11 | Blind Auction | Domain | ⭐⭐⭐ | Privacy in auctions | ~150 |
| 12 | Dutch Auction | Domain | ⭐⭐⭐ | Descending price auction | ~160 |
| 13 | Confidential Token | Domain | ⭐⭐⭐ | Private transfers | ~140 |
| 14 | Private Voting | Domain | ⭐⭐⭐ | Anonymous voting | ~155 |
| 15 | ERC-7984 | Integration | ⭐⭐⭐ | Token standard | ~170 |
| 16 | Token Wrapper | Integration | ⭐⭐⭐ | Token conversion | ~150 |
| 17 | Token Swap | Integration | ⭐⭐⭐ | DEX integration | ~180 |
| 18 | Vesting Wallet | Integration | ⭐⭐⭐ | Scheduled transfers | ~165 |

---

## 🎯 By Learning Objective

### "I want to understand encrypted operations"
→ Start with: **Counter**, **Arithmetic**, **Comparison**

### "I want to learn secure patterns"
→ Study: **Access Control**, **Input Proof**, **Anti-patterns**

### "I want to see real-world applications"
→ Explore: **Blind Auction**, **Confidential Token**, **Private Voting**

### "I want to integrate with other systems"
→ Review: **Token Wrapper**, **Token Swap**, **Vesting Wallet**

---

## 🔍 By Use Case

### Financial Applications
- **Confidential Token** - Private token transfers
- **Token Swap** - Privacy-preserving DEX
- **Vesting Wallet** - Scheduled private transfers
- **Dutch Auction** - Price-sensitive auction

### Governance & Voting
- **Private Voting** - Anonymous voting system
- **Access Control** - Role-based governance
- **Anti-patterns** - Common voting mistakes

### Security & Best Practices
- **Input Proof** - Secure input validation
- **Anti-patterns** - What NOT to do
- **State Management** - Secure state handling
- **Handles** - Lifecycle management

### Educational
- **Counter** - Simplest encrypted state
- **Arithmetic** - Basic operations
- **Comparison** - Comparing encrypted values
- **Encryption/Decryption** - Crypto fundamentals

---

## 📚 Learning Progression

### Week 1: Fundamentals (5 examples)
```
Day 1-2: Counter
Day 3-4: Arithmetic & Comparison
Day 5: Encryption/Decryption
↓ (Estimated: 4-6 hours)
```

### Week 2: Patterns (5 examples)
```
Day 6-7: Access Control
Day 8: Input Proof
Day 9: Handles
Day 10: Anti-patterns & State Management
↓ (Estimated: 6-8 hours)
```

### Week 3: Real-World (4 examples)
```
Day 11-12: Blind Auction & Dutch Auction
Day 13-14: Confidential Token & Private Voting
↓ (Estimated: 6-8 hours)
```

### Week 4: Integration (4 examples)
```
Day 15-16: Token Wrapper & Token Swap
Day 17-18: ERC-7984 & Vesting Wallet
↓ (Estimated: 6-8 hours)
```

**Total Learning Time**: ~18-25 hours to complete mastery

---

## ✨ Quick Reference by Example

### 1️⃣ Counter (Basic)
- **What**: Store and increment encrypted number
- **Learns**: Encrypted state, basic operations
- **Key Code**: `encryptedValue = FHE.add(encryptedValue, 1)`
- **Time**: 20 min
- **Related**: Arithmetic, State Management

### 2️⃣ Arithmetic (Basic)
- **What**: Perform arithmetic on encrypted values
- **Learns**: add, sub, mul, div operations
- **Key Code**: `result = FHE.add(a, b); result = FHE.mul(x, y);`
- **Time**: 25 min
- **Related**: Counter, Comparison

### 3️⃣ Comparison (Basic)
- **What**: Compare encrypted values
- **Learns**: lt, gt, eq, ne operations
- **Key Code**: `isGreater = FHE.gt(a, b)`
- **Time**: 20 min
- **Related**: Arithmetic, Blind Auction

### 4️⃣ Encryption (Basic)
- **What**: Encrypt user input
- **Learns**: Input handling, encryption flow
- **Key Code**: `encryptedInput = instance.encrypt32(plainInput)`
- **Time**: 15 min
- **Related**: Decryption, Input Proof

### 5️⃣ Decryption (Basic)
- **What**: Async decryption request
- **Learns**: Handle lifecycle, async operations
- **Key Code**: `await FHE.requestDecryption(encryptedValue)`
- **Time**: 20 min
- **Related**: Encryption, Handles

### 6️⃣ Access Control (Advanced)
- **What**: Role-based access patterns
- **Learns**: Permission management, roles
- **Key Code**: `require(hasRole(msg.sender, ADMIN_ROLE))`
- **Time**: 30 min
- **Related**: Input Proof, Anti-patterns

### 7️⃣ Input Proof (Advanced)
- **What**: Validate encrypted input
- **Learns**: Input validation, security
- **Key Code**: `require(FHE.isProofValid(input, proof))`
- **Time**: 30 min
- **Related**: Access Control, Anti-patterns

### 8️⃣ Handles (Advanced)
- **What**: Manage encrypted handles
- **Learns**: Handle lifecycle, memory
- **Key Code**: `handle = FHE.getHandle(encryptedValue)`
- **Time**: 30 min
- **Related**: Decryption, State Management

### 9️⃣ Anti-patterns (Advanced)
- **What**: Common mistakes to avoid
- **Learns**: What NOT to do
- **Key Code**: Shows ❌ bad patterns and ✅ good alternatives
- **Time**: 35 min
- **Related**: All patterns, Security

### 🔟 State Management (Advanced)
- **What**: Managing encrypted state
- **Learns**: State updates, persistence
- **Key Code**: `encryptedState.value = FHE.add(...)`
- **Time**: 35 min
- **Related**: Counter, Access Control, Anti-patterns

### 1️⃣1️⃣ Blind Auction (Domain)
- **What**: Private bidding auction
- **Learns**: Real-world application, privacy
- **Key Concepts**: Encrypted bids, winner determination, blind auction pattern
- **Time**: 40 min
- **Related**: Comparison, State Management, Private Voting

### 1️⃣2️⃣ Dutch Auction (Domain)
- **What**: Descending price auction
- **Learns**: Time-based logic, price discovery
- **Key Concepts**: Price decay, bid acceptance, timing
- **Time**: 40 min
- **Related**: Comparison, Blind Auction, Vesting

### 1️⃣3️⃣ Confidential Token (Domain)
- **What**: Private token transfers
- **Learns**: Token standard adaptation, privacy
- **Key Concepts**: ERC-20 interface, encrypted balances, transfers
- **Time**: 45 min
- **Related**: Arithmetic, State Management, Token Wrapper

### 1️⃣4️⃣ Private Voting (Domain)
- **What**: Anonymous voting system
- **Learns**: Governance application, anonymity
- **Key Concepts**: Vote casting, tally, privacy, access
- **Time**: 45 min
- **Related**: Access Control, Comparison, Blind Auction

### 1️⃣5️⃣ ERC-7984 (Integration)
- **What**: Token standard implementation
- **Learns**: Standard compliance, interoperability
- **Key Concepts**: Standard interface, compatibility, encrypted state
- **Time**: 45 min
- **Related**: Confidential Token, Token Wrapper, Token Swap

### 1️⃣6️⃣ Token Wrapper (Integration)
- **What**: Wrap existing tokens with privacy
- **Learns**: Token conversion, wrapping pattern
- **Key Concepts**: 1:1 conversion, deposit/withdraw, security
- **Time**: 40 min
- **Related**: Confidential Token, ERC-7984, Vesting

### 1️⃣7️⃣ Token Swap (Integration)
- **What**: DEX-like token exchange
- **Learns**: Liquidity provision, swapping
- **Key Concepts**: Pools, exchange rates, slippage, atomic swaps
- **Time**: 45 min
- **Related**: Arithmetic, Token Wrapper, Confidential Token

### 1️⃣8️⃣ Vesting Wallet (Integration)
- **What**: Scheduled token release
- **Learns**: Time-based logic, vesting schedules
- **Key Concepts**: Vesting schedule, cliff, release timing
- **Time**: 40 min
- **Related**: State Management, Token Wrapper, Dutch Auction

---

## 🔗 Dependency Map

```
Counter ─────┬─→ Arithmetic ─┬─→ Comparison ─→ Blind Auction
             │               │
             └─→ State Mgmt ──┤
                              │
Encryption ──┬─→ Decryption──→ Handles ──→ Anti-patterns
             │
Input Proof ─┤
             │
Access Ctrl ─┘

Confidential Token ─→ Token Wrapper ─→ Token Swap
                                      ↓
                              ERC-7984, Vesting

Private Voting ─→ Dutch Auction
```

---

## 🎯 Cheat Sheet

### By Difficulty Level

**Beginner** (⭐) - 1-2 hours each
- Counter
- Arithmetic
- Comparison
- Encryption
- Decryption

**Intermediate** (⭐⭐) - 2-3 hours each
- Access Control
- Input Proof
- Handles
- Anti-patterns
- State Management

**Advanced** (⭐⭐⭐) - 3-4 hours each
- Blind Auction
- Dutch Auction
- Confidential Token
- Private Voting
- ERC-7984
- Token Wrapper
- Token Swap
- Vesting Wallet

### By Concept

**Encryption/Decryption**: Encryption, Decryption, Input Proof

**Operations**: Counter, Arithmetic, Comparison

**Access**: Access Control, Input Proof, Anti-patterns

**State**: Counter, State Management, Confidential Token

**Real-World**: Blind Auction, Private Voting, Token-based

**Interop**: Token Wrapper, Token Swap, ERC-7984

---

## 📖 Study Strategies

### Strategy 1: Linear (Recommended for beginners)
Follow examples 1→18 in order

### Strategy 2: By Concept
- Learn all encryption/decryption examples
- Learn all operation examples
- Learn security/access examples
- Learn real-world applications
- Learn integration examples

### Strategy 3: Problem-Based
1. Identify a use case (voting, auctions, tokens)
2. Find related examples
3. Study those examples in depth
4. Build your own application

### Strategy 4: Deep-Dive
1. Pick ONE example
2. Read all code thoroughly
3. Study ALL tests
4. Modify and extend it
5. Move to next example

---

## 🔍 Quick Lookup by Feature

### Who uses FHE.add?
Counter, Arithmetic, Confidential Token, Token Swap

### Who uses FHE.lt?
Comparison, Blind Auction, Dutch Auction, Private Voting

### Who has access control?
Access Control, Blind Auction, Private Voting, Token Wrapper

### Who is async?
Decryption, Handles, Vesting

### Who's most complex?
Token Swap, ERC-7984, Blind Auction

### Who's best for testing?
Counter, Arithmetic, Comparison

---

## 📊 Quick Stats

- **Total Examples**: 18
- **Total Code Lines**: ~1,800
- **Basic Examples**: 5
- **Advanced Examples**: 5
- **Domain Examples**: 4
- **Integration Examples**: 4
- **Total Test Cases**: 100+
- **Average Learning Time**: ~20 hours
- **Time per Example**: 20-45 minutes

---

## 🚀 Getting Started

### For Complete Beginners
1. Read [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)
2. Study examples 1-5 (Counter through Decryption)
3. Try modifying Counter example
4. Progress to examples 6-10

### For Experienced Developers
1. Skim examples 1-5
2. Study examples 6-10 carefully
3. Review real-world examples 11-14
4. Deep-dive into integration 15-18

### For Specific Use Cases
- **Voting**: Study examples 14, 6, 9
- **Auctions**: Study examples 11, 12, 3
- **Tokens**: Study examples 13, 15, 16, 17, 18
- **Security**: Study examples 6, 7, 8, 9, 10

---

## 📚 Full Documentation

For complete details on each example, see:
- [EXAMPLES_CATALOG.md](./EXAMPLES_CATALOG.md) - Full documentation
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - How to create examples
- [API_REFERENCE.md](./API_REFERENCE.md) - API details
- [TUTORIAL.md](./TUTORIAL.md) - Real-world walkthrough

---

**Last Updated**: December 31, 2025
**Version**: 1.0

For the complete guide, see **[EXAMPLES_CATALOG.md](./EXAMPLES_CATALOG.md)**
