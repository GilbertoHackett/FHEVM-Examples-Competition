# Quick Start Commands

Common commands and workflows for FHEVM Examples development.

---

## 🚀 Getting Started (First Time)

### Complete Setup (5 minutes)
```bash
# 1. Install dependencies
npm install

# 2. Verify installation
npm run compile

# 3. Run tests
npm run test

# 4. Create your first example
npm run create-example fhe-counter ./my-counter
cd my-counter
npm install
npm run test
```

---

## 📦 Installation & Setup

### Install All Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

### Update Specific Package
```bash
npm install --save-exact @fhevm/solidity@0.9.0
```

### Clean Install (Delete node_modules)
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Node.js Version
```bash
node --version  # Should be 20.0.0+
npm --version   # Should be 10.0.0+
```

---

## 🔨 Building & Compilation

### Compile All Contracts
```bash
npm run compile
```

### Compile with Verbose Output
```bash
npx hardhat compile --verbose
```

### Clean Build (Remove Artifacts)
```bash
npm run clean
npm run compile
```

### Full Clean (Remove everything and rebuild)
```bash
npm run clean
rm -rf node_modules
npm install
npm run compile
```

---

## 🧪 Testing

### Run All Tests
```bash
npm run test
```

### Run Specific Test File
```bash
npx hardhat test test/Counter.test.ts
```

### Run Tests Matching Pattern
```bash
npx hardhat test test/Example.test.ts --grep "should increment"
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests with Verbose Output
```bash
npx hardhat test --verbose
```

### Run Single Test
```bash
npx hardhat test test/Example.test.ts --grep "exact test name"
```

### Debug Test (with logging)
```bash
npx hardhat test test/Example.test.ts --grep "test name" --logs
```

### Run Tests in Watch Mode
```bash
npx hardhat test --watch
```

---

## 📝 Development

### Create New Example
```bash
npm run create-example counter ./my-counter
```

### Create Category of Examples
```bash
npm run create-fhevm-category voting ./voting-examples
```

### Generate Documentation
```bash
npm run generate-docs
```

### Generate Docs for Specific Examples
```bash
npm run generate-docs --examples counter,voting
```

### Lint Code
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

### Format Code (Prettier)
```bash
npm run format
```

---

## 🚀 Deployment

### Deploy to Local Network
```bash
npm run deploy -- --network localhost
```

### Deploy to Sepolia Testnet
```bash
npm run deploy -- --network sepolia
```

### Verify Contract on Block Explorer
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "constructor args"
```

### Get Deployment Status
```bash
npm run check-deployment -- --network sepolia
```

---

## 🔍 Debugging & Inspection

### Run Local Hardhat Node
```bash
npx hardhat node
```

### Interact with Deployed Contract
```bash
npx hardhat console --network sepolia
```

### Get Contract ABIs
```bash
npx hardhat artifacts
```

### View Contract Bytecode
```bash
npx hardhat bytecode MyContract
```

### Inspect Transaction
```bash
npx hardhat inspect <tx-hash> --network sepolia
```

---

## 📊 Code Quality

### Run All Checks
```bash
npm run check
```

Includes:
- Compilation
- Linting
- Tests
- Coverage

### Check Code Style
```bash
npm run lint
```

### Fix Code Style
```bash
npm run lint:fix
```

### Type Check (TypeScript)
```bash
npx tsc --noEmit
```

### Security Audit (npm packages)
```bash
npm audit
```

### Fix Security Issues
```bash
npm audit fix
```

---

## 🎯 Development Workflows

### Complete Development Cycle
```bash
# 1. Make changes to contract
# 2. Compile
npm run compile

# 3. Run tests
npm run test

# 4. Fix any issues
npm run lint:fix

# 5. Check coverage
npm run test:coverage

# 6. Deploy
npm run deploy -- --network sepolia
```

### Testing a Single Feature
```bash
# 1. Write test
# 2. Run the test
npx hardhat test test/MyFeature.test.ts

# 3. Iterate until passes
# 4. Run full suite to ensure no breakage
npm run test
```

### Adding New Example
```bash
# 1. Create example
npm run create-example my-example ./my-example
cd my-example

# 2. Edit contract
# 3. Write tests
# 4. Compile and test
npm run compile
npm run test

# 5. Generate docs
npm run generate-docs

# 6. Return to main dir and test everything
cd ..
npm run test
```

### Debugging a Test
```bash
# Add console.log to test
# Run with verbose output
npx hardhat test test/Debug.test.ts --verbose

# Or use hardhat console
npx hardhat console
> const Counter = await ethers.getContractFactory("Counter")
> const counter = await Counter.deploy()
> // Now you can interact with contract
```

---

## 🌐 Network Configuration

### Check Current Network
```bash
npx hardhat network --show
```

### List Available Networks
```bash
npx hardhat networks
```

### Switch Networks (in .env)
```bash
# Set in .env
NETWORK=sepolia
```

### Set Network RPC URL
```bash
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### Set Private Key (for deployment)
```bash
export PRIVATE_KEY=0x...
```

---

## 📚 Documentation

### Generate All Documentation
```bash
npm run generate-docs --all
```

### Generate Specific Guide
```bash
npm run generate-docs --guide=security
```

### View Generated Docs
```bash
# Docs are in docs/ folder
open docs/index.html  # macOS
start docs/index.html # Windows
```

### Build API Documentation
```bash
npm run docs:api
```

---

## 🐛 Troubleshooting

### Clear Cache
```bash
npm cache clean --force
```

### Rebuild Native Modules
```bash
npm rebuild
```

### Check for Issues
```bash
npm doctor
```

### Update npm
```bash
npm install -g npm@latest
```

### Verify Hardhat Installation
```bash
npx hardhat --version
```

### Check Solidity Version
```bash
npx hardhat solc --version
```

### Test Basic Compilation
```bash
npx hardhat compile --dry-run
```

---

## 📊 Performance Profiling

### Benchmark Gas Usage
```bash
npm run benchmark
```

### Profile Tests
```bash
npx hardhat test --profile
```

### Memory Usage
```bash
npx hardhat test --memory
```

---

## 📦 Package Management

### List Installed Packages
```bash
npm list
```

### List Outdated Packages
```bash
npm outdated
```

### Update All Packages
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## 🔧 Advanced Commands

### Run Custom Script
```bash
npx hardhat run scripts/custom.ts
```

### Run Script on Network
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Access Hardhat Console on Network
```bash
npx hardhat console --network sepolia
```

### Extract Contract ABI
```bash
npx hardhat extract-abi MyContract
```

### Flatten Contract (for Etherscan)
```bash
npx hardhat flatten contracts/MyContract.sol > flattened.sol
```

---

## 📋 Common Issues & Solutions

### "Cannot find module"
```bash
npm install
npm run compile
```

### "Compilation failed"
```bash
npm run clean
npm run compile
```

### "Tests failing"
```bash
npm run test -- --grep "specific test"  # Run one test
npm run test:coverage  # Check coverage
```

### "Out of gas"
```bash
# Increase gas limit in test or deployment
{ gasLimit: 500000 }
```

### "Nonce error"
```bash
# Reset local hardhat
npx hardhat clean
npx hardhat node
```

---

## ⚡ Pro Tips

### Speed Up Tests
```bash
# Run tests in parallel
npx hardhat test --parallel
```

### Only Run Changed Files
```bash
# Set up git hooks with husky
npm install husky
husky install
```

### Watch for Changes
```bash
# Auto-run tests on file change
npx hardhat test --watch
```

### Color Output
```bash
# Force colored output
FORCE_COLOR=1 npm run test
```

### Quiet Output
```bash
# Minimal output
npm run test --silent
```

---

## 📞 Getting Help

### Hardhat Help
```bash
npx hardhat --help
```

### Help for Specific Task
```bash
npx hardhat test --help
npx hardhat compile --help
npx hardhat run --help
```

### List All Available Tasks
```bash
npx hardhat
```

### FHEVM Documentation
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Hardhat Docs](https://hardhat.org/docs)

---

## 🎯 Quick Command Reference

| Task | Command |
|------|---------|
| Install | `npm install` |
| Compile | `npm run compile` |
| Test | `npm run test` |
| Coverage | `npm run test:coverage` |
| Lint | `npm run lint` |
| Fix Lint | `npm run lint:fix` |
| Format | `npm run format` |
| Clean | `npm run clean` |
| Deploy | `npm run deploy -- --network sepolia` |
| Console | `npx hardhat console` |
| Node | `npx hardhat node` |
| Create Example | `npm run create-example counter ./my-counter` |
| Generate Docs | `npm run generate-docs` |
| Check All | `npm run check` |

---

## 🚀 Workflow Examples

### Complete Development (10 minutes)
```bash
# Start
npm install
npm run compile

# Develop
npx hardhat test

# Optimize
npm run lint:fix
npm run test:coverage

# Deploy
npm run deploy -- --network sepolia
```

### Fix a Bug (5 minutes)
```bash
# Find issue
npm run test -- --grep "failing test"

# Fix code
# Test fix
npm run test -- --grep "fixed test"

# Verify no breakage
npm run test
```

### Add New Example (15 minutes)
```bash
npm run create-example my-example ./my-example
cd my-example
npm install
npm run compile
npm run test
cd ..
npm run test
```

---

**Last Updated**: December 31, 2025
**Version**: 1.0

For more details, see [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md) or [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
