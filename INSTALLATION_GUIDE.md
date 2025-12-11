# Detailed Installation Guide

Complete step-by-step installation instructions for FHEVM Examples.

---

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB+ available
- **Internet Connection**: Required for npm packages

### Software Requirements
- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher
- **Git**: Latest version (for version control)
- **Text Editor**: VS Code (recommended) or similar

---

## ✅ Step 1: Verify Prerequisites

### Check Node.js Version
```bash
node --version
```

**Expected Output**: `v20.10.0` or higher

If you don't have Node.js or need to upgrade:
1. Visit [nodejs.org](https://nodejs.org)
2. Download Node.js 20 LTS or higher
3. Follow installation instructions for your OS
4. Verify: `node --version`

### Check npm Version
```bash
npm --version
```

**Expected Output**: `10.2.0` or higher

npm is installed automatically with Node.js. To upgrade:
```bash
npm install -g npm@latest
```

### Check Git (Optional)
```bash
git --version
```

Git is optional but recommended for version control.

---

## 📥 Step 2: Clone or Download Repository

### Option A: Clone with Git (Recommended)
```bash
git clone https://github.com/yourusername/fhevm-examples.git
cd fhevm-examples
```

### Option B: Download ZIP
1. Visit GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract ZIP file
4. Open terminal in extracted folder

### Option C: Create from Scratch
```bash
# Create new directory
mkdir fhevm-examples
cd fhevm-examples

# Initialize git (optional)
git init

# Copy files from submission
# (paste README.md, package.json, hardhat.config.ts, etc.)
```

---

## 🔧 Step 3: Install Dependencies

### Install All Packages
```bash
npm install
```

**What happens**:
- Downloads all dependencies from npm registry
- Creates `node_modules/` folder
- Creates `package-lock.json` file
- Takes 2-5 minutes depending on connection

### If Installation Fails

**Problem**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
npm install --legacy-peer-deps
```

**Problem**: `npm ERR! EACCES`

**Solution**:
```bash
sudo npm install
# Or fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Problem**: Network timeout

**Solution**:
```bash
npm install --registry https://registry.npmjs.org/
```

---

## ✔️ Step 4: Verify Installation

### Compile Contracts
```bash
npm run compile
```

**Expected Output**:
```
> fhevm-examples@1.0.0 compile
> hardhat compile

Compiled 18 contracts successfully
```

### Run Tests
```bash
npm run test
```

**Expected Output**:
```
> fhevm-examples@1.0.0 test
> hardhat test

  18 passing (5s)
```

### Check Version
```bash
npx hardhat --version
```

**Expected Output**: Shows Hardhat version (2.19.0+)

---

## 🎯 Step 5: Post-Installation Setup

### Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```bash
# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Wallet Private Key (for deployment - NEVER commit)
PRIVATE_KEY=0x...

# Explorer API Keys (for contract verification)
ETHERSCAN_API_KEY=your_key_here
```

### Initial Setup Check
```bash
npm run check
```

This runs:
- ✅ Compilation (`npm run compile`)
- ✅ Linting (`npm run lint`)
- ✅ Tests (`npm run test`)
- ✅ Coverage (`npm run test:coverage`)

---

## 🚀 Step 6: Create Your First Example

### Using the Generator
```bash
npm run create-example counter ./my-counter
```

This creates a new example at `./my-counter/`

### Setup Example
```bash
cd my-counter
npm install
npm run compile
npm run test
cd ..
```

---

## 🆘 Troubleshooting Installation

### Problem: "npm: command not found"

**Cause**: Node.js/npm not installed or PATH not set

**Solution**:
1. Reinstall Node.js from [nodejs.org](https://nodejs.org)
2. Restart terminal/IDE
3. Verify: `node --version`

### Problem: "Module not found"

**Cause**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Permission denied

**Cause**: Directory permissions

**Solution**:
```bash
# macOS/Linux
sudo chown -R $USER:$USER .

# Or install to user directory
npm config set prefix ~/.npm-global
```

### Problem: Disk space error

**Cause**: Not enough space for node_modules

**Solution**:
- Free up disk space (need 500MB+)
- Or install on different drive
- Check: `npm config set prefer-offline true`

### Problem: Hardhat compilation fails

**Cause**: Solidity compiler issue

**Solution**:
```bash
npm run clean
npm run compile
```

### Problem: Tests timeout

**Cause**: FHEVM operations are slow

**Solution**:
```bash
npm run test -- --timeout 60000
```

---

## ✅ Installation Verification Checklist

After installation, verify:

- [ ] Node.js version 20+: `node --version`
- [ ] npm version 10+: `npm --version`
- [ ] Hardhat installed: `npx hardhat --version`
- [ ] Compilation works: `npm run compile`
- [ ] Tests pass: `npm run test`
- [ ] No errors in console
- [ ] .env file created (optional)
- [ ] Can create example: `npm run create-example counter ./test`

---

## 📂 Directory Structure After Installation

```
fhevm-examples/
├── node_modules/              (npm packages)
├── contracts/                 (smart contracts)
│   ├── Counter.sol
│   ├── AccessControl.sol
│   └── ...
├── test/                      (test files)
│   ├── Counter.test.ts
│   ├── AccessControl.test.ts
│   └── ...
├── scripts/                   (automation scripts)
│   ├── deploy.ts
│   ├── create-fhevm-example.ts
│   └── ...
├── docs/                      (generated docs)
├── .github/                   (GitHub templates)
├── package.json              (npm configuration)
├── package-lock.json         (locked versions)
├── tsconfig.json             (TypeScript config)
├── hardhat.config.ts         (Hardhat config)
├── .env                      (environment variables)
├── .gitignore               (git ignore)
├── README.md                (main readme)
├── LICENSE                  (BSD-3-Clause-Clear)
└── [documentation files]    (guides and references)
```

---

## 🔄 Updating Installation

### Update All Dependencies
```bash
npm update
```

### Update Specific Package
```bash
npm install --save-exact @fhevm/solidity@0.9.0
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

## 🌐 Network Configuration

### For Sepolia Testnet
```bash
# In hardhat.config.ts
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### Get Test ETH (Faucets)
- [Sepolia Faucet 1](https://www.sepoliafaucet.com)
- [Sepolia Faucet 2](https://faucet.quicknode.com/ethereum/sepolia)

---

## ✨ Next Steps After Installation

1. **Read Documentation**
   - Start: [README.md](./README.md)
   - Quick Start: [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)

2. **Try First Example**
   ```bash
   npm run create-example counter ./my-counter
   cd my-counter && npm run test
   ```

3. **Explore Examples**
   - See [EXAMPLES_CATALOG.md](./EXAMPLES_CATALOG.md)
   - Study code and tests

4. **Create Your Own**
   - Follow [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
   - Reference [API_REFERENCE.md](./API_REFERENCE.md)

5. **Deploy (Optional)**
   - See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📞 Getting Help

### Installation Issues
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Check [FAQ.md](./FAQ.md)

### After Setup Issues
- [SUPPORT.md](./SUPPORT.md) - Support channels
- [GETTING_HELP.md](./GETTING_HELP.md) - Find answers

### Still Need Help?
- Join [Zama Discord](https://discord.com/invite/zama)
- Create [GitHub issue](https://github.com/yourusername/fhevm-examples/issues)

---

## ✅ Installation Complete!

You're now ready to develop FHEVM examples. Start with:

```bash
npm run create-example counter ./my-first-example
cd my-first-example
npm run test
```

Happy developing! 🚀

---

**Last Updated**: December 31, 2025
**Version**: 1.0

For quick reference, see [QUICK_START_COMMANDS.md](./QUICK_START_COMMANDS.md)
