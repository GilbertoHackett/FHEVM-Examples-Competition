# Glossary - FHEVM Terms and Concepts

A comprehensive glossary of terms and concepts used throughout the FHEVM Examples project.

---

## A

### Access Control
Permission system that restricts function execution to authorized users or addresses. In FHEVM, combines with encryption permissions to control who can decrypt values.

**Related**: FHE.allow, FHE.allowThis, authorization, encryption permissions

### Async/Asynchronous
Programming model where operations don't block execution. In FHEVM testing, encryption/decryption operations are asynchronous.

**Related**: await, Promise, callbacks

### Arithmetic Operations
Mathematical operations on encrypted values: addition, subtraction, multiplication, division.

**Related**: FHE.add, FHE.sub, FHE.mul, FHE.div

---

## B

### Batch Operations
Processing multiple operations together for efficiency. Can reduce gas costs when operating on multiple encrypted values.

**Related**: optimization, gas efficiency, performance

### Binary Operations
Operations that work on two operands (compare, logical AND/OR/XOR).

**Related**: comparison, logical operations, binary logic

### Bit Length
Number of bits required to represent a value. FHEVM supports 8, 16, 32, and 64-bit encrypted integers.

**Related**: euint8, euint16, euint32, euint64, data types

---

## C

### Ciphertext
Encrypted data that appears random without the private key. In FHEVM, all encrypted values are ciphertexts.

**Related**: encryption, encryption key, plaintext, euintXX

### Comparison Operations
Operations that compare encrypted values: less than (<), greater than (>), equal (==), etc.

**Related**: FHE.lt, FHE.gt, FHE.eq, FHE.ne

### Confidential (Confidentiality)
Property of data being private and not accessible without proper permissions. Core goal of FHEVM applications.

**Related**: privacy, encryption, access control, FHE

### Cryptography / Cryptographic
Mathematical techniques for securing data. FHEVM uses advanced cryptographic methods for encrypted computation.

**Related**: encryption, decryption, homomorphic encryption, FHE

---

## D

### Decryption
Process of converting encrypted data back to plaintext using the decryption key.

**Related**: ciphertext, plaintext, FHE.decrypt, async

### Decryption Handle
Special handle returned when requesting decryption of an encrypted value. Must be used within the test framework.

**Related**: handle, decryption request, async decryption

### Decryption Key
Secret key used to decrypt ciphertexts. Held by the user, not accessible to smart contracts.

**Related**: private key, encryption key, security, plaintext

---

## E

### Encrypted Type
Data type that holds encrypted values. FHEVM provides: euint8, euint16, euint32, euint64.

**Related**: euint8, euint16, euint32, euint64, ciphertext, type system

### Encryption
Process of converting plaintext to ciphertext using an encryption key.

**Related**: plaintext, ciphertext, encryption key, homomorphic encryption

### Encryption Key
Public key used to encrypt plaintext values. Can be shared publicly in FHEVM.

**Related**: public key, decryption key, encryption, ciphertext

### euint8
Encrypted unsigned integer type for 8-bit values (0-255). Smallest encrypted type.

**Related**: euint16, euint32, euint64, encrypted type, bit length

### euint16
Encrypted unsigned integer type for 16-bit values (0-65,535).

**Related**: euint8, euint32, euint64, encrypted type, bit length

### euint32
Encrypted unsigned integer type for 32-bit values (0-4,294,967,295). Commonly used.

**Related**: euint8, euint16, euint64, encrypted type, bit length

### euint64
Encrypted unsigned integer type for 64-bit values (0-18,446,744,073,709,551,615). Largest encrypted type.

**Related**: euint8, euint16, euint32, encrypted type, bit length

---

## F

### FHE (Fully Homomorphic Encryption)
Cryptographic method enabling computation on encrypted data without decryption. Allows smart contracts to process private data.

**Related**: homomorphic encryption, FHEVM, encryption, computation

### FHE.add
Function to add two encrypted values: `result = FHE.add(a, b)`

**Related**: arithmetic operations, FHE.sub, FHE.mul, FHE.div

### FHE.allow
Function to authorize decryption for an encrypted value for a specific address: `FHE.allow(value, address)`

**Related**: decryption permission, FHE.allowThis, access control, authorization

### FHE.allowThis
Function to authorize decryption for the caller: `FHE.allowThis(value)`

**Related**: FHE.allow, decryption permission, msg.sender, access control

### FHE.decrypt (in tests)
Function in test environment to decrypt values: `plaintext = instance.decrypt(ciphertext)`

**Related**: decryption, plaintext, ciphertext, testing

### FHEVM
Fully Homomorphic Encryption Virtual Machine - blockchain platform for encrypted smart contracts. Built on Zama's technology.

**Related**: FHE, smart contracts, blockchain, privacy

### Function Visibility
Solidity visibility modifiers: external, public, internal, private.

**Related**: access control, function modifiers, contract design

---

## G

### Gas
Unit measuring computational cost on blockchain. FHEVM operations consume more gas than normal operations.

**Related**: transaction cost, gas limit, gas optimization, performance

### Gas Limit
Maximum gas allowed for a transaction. Important for FHEVM operations which are computationally expensive.

**Related**: gas, transaction, out of gas error, FHEVM operations

### Gas Optimization
Techniques to reduce computational cost of smart contracts. Critical for FHEVM applications.

**Related**: performance, gas, efficiency, optimization

### Governance
System for making decisions about project direction and rules. In FHEVM, can be implemented with encrypted voting.

**Related**: voting, democracy, decision-making, confidential voting

---

## H

### Handle
Reference to an operation result in FHEVM test environment. Used for encrypted values and decryption requests.

**Related**: decryption handle, encrypted value, testing, asynchronous

### Hardhat
Development environment for Ethereum smart contracts. Used for FHEVM contract development and testing.

**Related**: development, testing, compilation, Solidity

### Hash Function
Function that maps input to fixed-size output. Used for fingerprinting and verification.

**Related**: cryptography, verification, fingerprint

---

## I

### Input Proof
Cryptographic proof that an encrypted value was properly encrypted. Provides additional security assurance.

**Related**: encrypted input, verification, security, FHE

### Input Validation
Checking that function inputs are valid before processing. Critical security practice.

**Related**: security, validation, require statements, error handling

### Initialization
Setting up system or variable with initial values. FHEVM values must be initialized for use.

**Related**: setup, instantiation, FHE values

---

## K

### Key Generation
Creating cryptographic keys (encryption and decryption keys). In FHEVM, typically done by the system.

**Related**: encryption key, decryption key, cryptography

---

## L

### Logic Gates / Logical Operations
Operations implementing boolean logic: AND, OR, XOR, NOT.

**Related**: FHE.and, FHE.or, FHE.xor, boolean

---

## M

### Metadata
Information about data that's not the data itself. Important for organizing and finding documentation.

**Related**: information, documentation, organization, tagging

---

## N

### Node.js
JavaScript runtime enabling command-line execution. Required for FHEVM development tools.

**Related**: JavaScript, runtime, npm, development environment

### npm
Package manager for Node.js. Used to install FHEVM dependencies and tools.

**Related**: package management, Node.js, dependencies, installation

---

## O

### Operation
Action or computation performed by a smart contract or cryptographic function. FHEVM operations work on encrypted data.

**Related**: computation, function, FHE operation, smart contract

### Optimization
Improving efficiency, typically reducing gas costs or execution time.

**Related**: gas optimization, performance, improvement, efficiency

---

## P

### Permission / Permissions
Authorization system controlling who can perform actions. FHEVM permissions control who can decrypt values.

**Related**: access control, FHE.allow, FHE.allowThis, authorization

### Plaintext
Unencrypted, readable data. Opposite of ciphertext.

**Related**: ciphertext, encryption, decryption, unencrypted

### Privacy / Private (Data)
Keeping information confidential and not accessible to unauthorized parties. Core goal of FHEVM.

**Related**: confidentiality, encryption, FHEVM, security

### Privacy-Preserving
Techniques and systems that maintain privacy of data while enabling computation.

**Related**: FHE, FHEVM, encryption, privacy, confidential

### Private Function (Solidity)
Function with private visibility, only callable internally. Highest access restriction.

**Related**: function visibility, solidity modifiers, access control

### Public / Public Visibility
Function or variable accessible from anywhere. Lowest access restriction.

**Related**: function visibility, external, accessibility

---

## R

### Reentrancy
Vulnerability where function is called again before completion, potentially causing issues.

**Related**: security vulnerability, smart contracts, security patterns, pull-push pattern

### Require Statement
Solidity statement checking condition and reverting transaction if false. Common for validation.

**Related**: validation, error handling, revert, smart contract

---

## S

### Secure Computation
Processing that maintains data confidentiality while performing operations. FHEVM's primary capability.

**Related**: FHEVM, computation on encrypted data, privacy-preserving, cryptography

### Security Audit
Professional review of code for vulnerabilities. Recommended before mainnet deployment.

**Related**: code review, testing, vulnerability, professional review

### Sepolia
Ethereum test network. Primary network for FHEVM example deployment.

**Related**: testnet, Ethereum, testing, deployment

### Smart Contract
Self-executing code on blockchain with business logic. FHEVM contracts work on encrypted data.

**Related**: blockchain, Solidity, contract, decentralized application

### Solidity
Programming language for Ethereum smart contracts. FHEVM contracts written in Solidity.

**Related**: smart contract, programming language, Ethereum, code

### State
Current values of contract variables. FHEVM can maintain encrypted state.

**Related**: contract variables, data, storage, encrypted state

### State Management
Techniques for managing contract state and updates. Critical for FHEVM applications.

**Related**: state, storage, updates, FHEVM applications

---

## T

### Test / Testing
Verification that code works correctly. FHEVM requires specialized testing framework.

**Related**: hardhat-fhevmjs, unit test, integration test, quality assurance

### Threshold Cryptography
Cryptographic scheme requiring multiple parties to decrypt. Can be implemented with FHEVM.

**Related**: multi-party computation, distributed cryptography, security

### Token
Digital asset representation, often ERC-20 or similar standard.

**Related**: ERC-20, cryptocurrency, digital asset, smart contract

### Transparency
Property of systems being understandable and verifiable. Blockchain provides transparency.

**Related**: verification, understandable, auditable, blockchain

### TypeScript
Programming language extending JavaScript with types. Used for FHEVM test and script writing.

**Related**: JavaScript, type system, programming language, testing

---

## U

### Unit Test
Test of a single function or component. FHEVM testing uses unit tests extensively.

**Related**: testing, test case, verification, quality assurance

### Unencrypted
Data that is not encrypted; plaintext.

**Related**: plaintext, encrypted, ciphertext, unencrypted data

---

## V

### Validation
Checking that input or state is correct. Essential for security.

**Related**: security, input validation, error handling, verification

### Vulnerability
Security weakness that could be exploited. FHEVM applications must address both FHE and smart contract vulnerabilities.

**Related**: security, bug, exploit, attack surface

---

## W

### Wallet
Tool for managing cryptocurrency and private keys. Users use wallets to interact with FHEVM contracts.

**Related**: private key, cryptocurrency, blockchain, user

---

## X

### XOR (Exclusive OR)
Boolean operation returning true only when inputs differ. Available in FHEVM.

**Related**: logical operations, FHE.xor, boolean logic, bitwise operations

---

## Z

### Zama
Company developing FHEVM and FHE technology. Creators of this FHEVM examples project.

**Related**: FHEVM, FHE technology, homomorphic encryption, cryptography

### Zama fhevmjs
JavaScript library for FHEVM testing providing encryption and decryption functions.

**Related**: hardhat-fhevmjs, testing, JavaScript, FHEVM testing framework

---

## Cross-References by Category

### Data Types
- euint8, euint16, euint32, euint64
- Encrypted Type
- Plaintext, Ciphertext

### Operations
- Arithmetic Operations (add, sub, mul, div)
- Comparison Operations (lt, gt, eq, ne)
- Logical Operations (and, or, xor)
- Bitwise Operations (shl, shr, rotl, rotr)

### Security
- Access Control
- Encryption, Decryption
- Input Validation
- Vulnerability
- Security Audit

### FHE Functions
- FHE.add, FHE.sub, FHE.mul, FHE.div
- FHE.lt, FHE.gt, FHE.eq, FHE.ne
- FHE.and, FHE.or, FHE.xor
- FHE.allow, FHE.allowThis
- FHE.decrypt (testing)

### Tools & Environment
- Hardhat
- Node.js
- npm
- TypeScript
- Solidity

### Concepts
- FHE (Fully Homomorphic Encryption)
- FHEVM
- Privacy-Preserving
- Smart Contract
- Blockchain

### Blockchain-Specific
- Gas, Gas Limit, Gas Optimization
- Smart Contract
- State
- Transaction
- Wallet

---

## Abbreviations

| Abbreviation | Full Form |
|---|---|
| FHE | Fully Homomorphic Encryption |
| FHEVM | Fully Homomorphic Encryption Virtual Machine |
| ERC | Ethereum Request for Comments |
| VRF | Verifiable Random Function |
| ABI | Application Binary Interface |
| bytecode | Machine-readable contract code |
| truffle | Blockchain development framework |
| ethers.js | Ethereum JavaScript library |
| web3.js | Web3 JavaScript library |
| RPC | Remote Procedure Call |

---

## Related Documentation

For more detailed information on these concepts, see:
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [SECURITY.md](./SECURITY.md) - Security concepts and patterns
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide with examples
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design
- [FHEVM Documentation](https://docs.zama.ai/fhevm) - Official FHEVM docs

---

**Last Updated**: December 31, 2025
**Version**: 1.0

*This glossary is a living document. Terms will be added and updated as the project evolves.*
