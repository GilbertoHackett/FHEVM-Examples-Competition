# Confidential Smart Contract Development Competition

## Overview

Build a comprehensive suite of standalone, production-ready FHEVM (Fully Homomorphic Encryption Virtual Machine) example repositories and automation tools. This competition aims to create reusable templates and guidance for developers building privacy-preserving applications.

**Prize Pool:** $10,000
**Start Date:** December 1, 2025
**Submission Deadline:** December 31, 2025 (23:59 UTC)

---

## Competition Objectives

Participants will create a complete ecosystem for FHEVM development including:

1. **Automation Scripts** - TypeScript-based CLI tools for scaffolding projects
2. **Example Contracts** - Well-documented Solidity smart contracts
3. **Test Suites** - Comprehensive testing patterns and edge cases
4. **Documentation Generator** - Automated documentation creation
5. **Base Template** - Reusable Hardhat-based project template

---

## Technical Requirements

### 1. Project Structure & Organization

- Use **Hardhat exclusively** for all development and testing
- Create **one independent repository per example** (no monorepos)
- Maintain a **shared base template** for consistency
- Follow this minimal structure:

```
project-root/
├── contracts/          # Smart contract source files
├── test/               # Test suites
├── deploy/             # Deployment scripts
├── hardhat.config.ts   # Configuration
└── package.json        # Dependencies
```

### 2. Automation & Scaffolding

Create TypeScript-based CLI tools that:

- Clone and customize the base Hardhat template
- Insert Solidity contracts into the `/contracts` directory
- Generate matching test files automatically
- Extract and generate documentation from code annotations
- Create standalone, immediately runnable repositories

**Key Script Names:**
- `create-fhevm-example` - Generate single example repository
- `create-fhevm-category` - Generate category-based project
- `generate-docs` - Create GitBook-compatible documentation

### 3. Example Categories to Include

#### Basic Examples (Required)
- Simple encrypted counter
- Arithmetic operations (FHE.add, FHE.sub, FHE.mul)
- Comparison operations (FHE.eq, FHE.lt, FHE.gt)
- Single value encryption and decryption
- Multiple value encryption and decryption

#### Advanced Examples (Required)
- Access control (FHE.allow, FHE.allowThis patterns)
- Input proof validation
- Anti-patterns and common mistakes
- Handle lifecycle and symbolic execution
- Confidential state management

#### Domain-Specific Examples (Bonus)
- Blind auctions with sealed bids
- Confidential token transfers
- Private voting mechanisms
- Confidential trading systems
- Privacy-preserving scoring systems

#### Integration Examples (Bonus)
- OpenZeppelin ERC-7984 token standard
- Token wrappers and conversions
- Vesting mechanisms
- Cross-contract communication with encryption

### 4. Documentation Standards

All examples must include:

- **JSDoc/TSDoc comments** in test files explaining concepts
- **Inline Solidity comments** explaining FHE mechanics
- **Auto-generated README** per repository describing the example
- **GitBook-compatible markdown** with proper formatting
- **Concept tags** (e.g., "chapter: access-control") for organization

Documentation should cover:
- What problem the example solves
- Key FHE concepts demonstrated
- Correct usage patterns (✅)
- Common mistakes to avoid (❌)
- Complete code walkthroughs

---

## Deliverables Checklist

Your submission must include:

### Core Deliverables

- [ ] **Base Template** - Complete Hardhat template with `@fhevm/solidity`
- [ ] **Automation Scripts** - TypeScript CLI tools in `/scripts`
- [ ] **Example Repositories** - Minimum 5 complete working examples
- [ ] **Test Suite** - Tests for each example with edge cases
- [ ] **Documentation** - Auto-generated and manually curated

### Supporting Materials

- [ ] **Developer Guide** - Instructions for adding new examples
- [ ] **Dependency Update Guide** - How to maintain when FHEVM updates
- [ ] **Architecture Documentation** - System design and patterns
- [ ] **Video Demonstration** - Showcasing setup and automation (MANDATORY)

### Code Quality Requirements

- All code must be production-ready
- Contracts must compile without warnings
- Tests must pass 100%
- Documentation must be accurate and complete
- Code must follow Solidity style guidelines

---

## Example Submission Structure

Your final submission should resemble:

```
submission/
├── fhevm-hardhat-template/        # Base template
│   ├── contracts/
│   ├── test/
│   ├── deploy/
│   ├── hardhat.config.ts
│   ├── package.json
│   └── README.md
│
├── scripts/                        # Automation tools
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   ├── generate-docs.ts
│   └── README.md
│
├── contracts/                      # Source contracts
│   ├── basic/
│   │   ├── Counter.sol
│   │   ├── Arithmetic.sol
│   │   └── ...
│   ├── advanced/
│   │   ├── AccessControl.sol
│   │   └── ...
│   └── domains/
│       └── ...
│
├── test/                           # Test files
│   ├── basic/
│   ├── advanced/
│   └── domains/
│
├── docs/                           # Generated documentation
│   ├── SUMMARY.md
│   ├── basic/
│   └── ...
│
├── ARCHITECTURE.md                 # Design document
├── DEVELOPER_GUIDE.md              # Adding new examples
├── MAINTENANCE_GUIDE.md            # Dependency management
└── README.md                       # Main documentation
```

---

## Evaluation Criteria

Submissions will be judged on:

### Code Quality (25%)
- Clean, readable, well-commented code
- Consistent style and structure
- Proper error handling
- Security best practices

### Automation Completeness (25%)
- Robust scaffolding scripts
- Error handling and validation
- Extensible design for future examples
- Complete automation of repetitive tasks

### Example Quality (20%)
- Demonstrates core FHEVM concepts
- Real-world applicability
- Breadth of examples covered
- Clarity and educational value

### Documentation (15%)
- Comprehensive and accurate
- Well-organized and searchable
- Helpful for beginners
- Complete API documentation

### Innovation & Bonus Features (15%)
- Additional examples beyond requirements
- Advanced patterns demonstrated
- Unique implementation approaches
- Excellent developer experience

### Mandatory Video Demonstration
- Must showcase project setup
- Demonstrate automation in action
- Show example execution and tests
- Explain key architectural decisions

---

## Technical Specifications

### Required Dependencies

```json
{
  "@fhevm/solidity": "^0.9.0",
  "@fhevm/hardhat-plugin": "^0.3.0",
  "hardhat": "^2.19.0",
  "typescript": "^5.0.0",
  "ethers": "^6.0.0"
}
```

### Network Support

- Primary: Ethereum Sepolia Testnet
- Forks: Supported for testing
- Local: Hardhat network with FHEVM support

### Solidity Version

```solidity
pragma solidity ^0.8.24;
```

---

## Submission Guidelines

### How to Submit

1. Create a public GitHub repository with your complete submission
2. Ensure all code compiles and tests pass
3. Create a detailed README with setup instructions
4. Record and attach a demonstration video
5. Submit via the official competition platform with:
   - Repository URL
   - Video URL
   - Brief description of your approach
   - List of included examples

### Repository Requirements

- Must be publicly accessible
- Include comprehensive README
- Have all CI/CD tests passing
- Include deployment instructions
- License: BSD-3-Clause-Clear

---

## Bonus Point Opportunities

Earn additional consideration for:

### Creative Examples (+20 points)
- Examples beyond the specified list
- Innovative use cases
- Real-world applications

### Advanced Patterns (+15 points)
- Complex FHE implementations
- Multi-step encrypted workflows
- Novel programming patterns

### Exceptional Documentation (+15 points)
- Video tutorials per example
- Interactive documentation
- Architecture diagrams
- Performance benchmarks

### Maintenance Excellence (+10 points)
- Automated dependency checking
- Version compatibility tools
- Migration guides

### Code Elegance (+10 points)
- Particularly clean implementation
- Reusable abstractions
- Efficient FHE patterns

---

## Resources & References

### Official Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org)
- [Protocol Examples](https://docs.zama.org/protocol/examples)

### Reference Implementations
- [Base Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Live dApps Examples](https://github.com/zama-ai/dapps)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
- [Example Bounty Project](https://github.com/poppyseedDev/zama-bounty-11-example-project)

### Community Support
- [Zama Discord Server](https://discord.com/invite/zama)
- [Developer Forum](https://www.zama.ai/community)
- [X/Twitter](https://twitter.com/zama_fhe)
- [Telegram Channel](https://t.me/zama_on_telegram)

---

## Competition Rewards

### Prize Distribution

- **🥇 1st Place:** $5,000
- **🥈 2nd Place:** $3,000
- **🥉 3rd Place:** $2,000

### Special Recognition

- Winning submissions featured in official documentation
- Opportunities for future collaboration
- Recognition in Zama community announcements

---

## Important Notes

### Code Ownership
- You retain ownership of your submitted code
- Submissions may be featured as examples with attribution
- Original license (BSD-3-Clause-Clear) required

### Eligibility
- Open to developers worldwide
- Teams welcome - please clearly identify all contributors
- One submission per person/team

### Support
- Questions should be posted in the official community forum
- Technical issues can be discussed in the Discord channel
- Direct inquiries to the program administrators

---

## Good Luck! 🚀

This competition is an opportunity to shape how developers learn FHE development. Create examples that educate, inspire, and empower the next generation of privacy-preserving application builders.

**Happy Building!**

---

*Confidential Smart Contract Development Competition*
*Powered by Zama FHEVM and the Zama Developer Program*
