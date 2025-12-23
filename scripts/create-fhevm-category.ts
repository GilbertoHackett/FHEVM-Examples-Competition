#!/usr/bin/env ts-node

/**
 * create-fhevm-category - CLI tool to generate FHEVM projects with multiple examples from a category
 *
 * Usage: ts-node scripts/create-fhevm-category.ts <category> [output-dir]
 *
 * Example: ts-node scripts/create-fhevm-category.ts procurement ./output/procurement-examples
 */

import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
  Magenta = '\x1b[35m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

// Contract item interface
interface ContractItem {
  path: string;
  test: string;
  fixture?: string;
  additionalFiles?: string[];
}

// Category configuration interface
interface CategoryConfig {
  name: string;
  description: string;
  contracts: ContractItem[];
  additionalDeps?: Record<string, string>;
}

// Category definitions
const CATEGORIES: Record<string, CategoryConfig> = {
  procurement: {
    name: 'Privacy-Preserving Procurement Examples',
    description: 'Confidential procurement and bidding systems using FHEVM',
    contracts: [
      { path: 'contracts/PrivacyProcurement.sol', test: 'test/Counter.test.ts' },
      { path: 'contracts/Counter.sol', test: 'test/Counter.test.ts' },
    ],
  },
};

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function generateDeployScript(contractNames: string[]): string {
  return `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

${contractNames.map(name => `  // Deploy ${name}
  const ${name}Factory = await ethers.getContractFactory("${name}");
  const ${name.toLowerCase()}Contract = await ${name}Factory.deploy();
  await ${name.toLowerCase()}Contract.waitForDeployment();
  const ${name.toLowerCase()}Address = await ${name.toLowerCase()}Contract.getAddress();
  console.log("${name} deployed to:", ${name.toLowerCase()}Address);
`).join('\n')}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;
}

function generateReadme(category: string, contractNames: string[]): string {
  const categoryInfo = CATEGORIES[category];

  return `# FHEVM Examples: ${categoryInfo.name}

${categoryInfo.description}

## 📦 Included Examples

This project contains ${contractNames.length} example contract${contractNames.length > 1 ? 's' : ''}:

${contractNames.map((name, i) => `${i + 1}. **${name}**`).join('\n')}

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**

   \`\`\`bash
   cp .env.example .env
   # Edit .env with your settings
   \`\`\`

3. **Compile all contracts**

   \`\`\`bash
   npm run compile
   \`\`\`

4. **Run all tests**

   \`\`\`bash
   npm run test
   \`\`\`

## Contracts

${contractNames.map(name => `### ${name}

Located in \`contracts/${name}.sol\`

Run specific tests:
\`\`\`bash
npx hardhat test test/${name}.test.ts
\`\`\`
`).join('\n')}

## Deployment

### Local Network

\`\`\`bash
# Start local node
npx hardhat node

# Deploy all contracts
npm run deploy
\`\`\`

### Sepolia Testnet

\`\`\`bash
# Deploy all contracts
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contracts
${contractNames.map(name => `npx hardhat verify --network sepolia <${name.toUpperCase()}_ADDRESS>`).join('\n')}
\`\`\`

## Available Scripts

| Script | Description |
|--------|-------------|
| \`npm run compile\` | Compile all contracts |
| \`npm run test\` | Run all tests |
| \`npm run test:coverage\` | Generate coverage report |
| \`npm run deploy\` | Deploy contracts |
| \`npm run lint\` | Lint code |
| \`npm run clean\` | Clean build artifacts |

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Examples](https://docs.zama.org/protocol/examples)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

This project is licensed under the BSD-3-Clause-Clear License.

---

**Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
`;
}

function createCategoryProject(category: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');

  // Validate category
  if (!CATEGORIES[category]) {
    error(`Unknown category: ${category}\n\nAvailable categories:\n${Object.keys(CATEGORIES).map(k => `  - ${k}: ${CATEGORIES[k].name}`).join('\n')}`);
  }

  const categoryInfo = CATEGORIES[category];
  info(`Creating FHEVM project: ${categoryInfo.name}`);
  info(`Output directory: ${outputDir}`);

  // Check if output directory exists
  if (fs.existsSync(outputDir)) {
    error(`Output directory already exists: ${outputDir}`);
  }

  // Step 1: Create directory structure
  log('\n📋 Step 1: Creating project structure...', Color.Cyan);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'contracts'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'test'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'scripts'), { recursive: true });
  success('Project structure created');

  // Step 2: Copy all contracts and tests from category
  log('\n📄 Step 2: Copying contracts and tests...', Color.Cyan);
  const contractNames: string[] = [];

  categoryInfo.contracts.forEach(({ path: contractPath, test: testPath }) => {
    // Copy contract
    const fullContractPath = path.join(rootDir, contractPath);
    if (!fs.existsSync(fullContractPath)) {
      log(`Warning: Contract not found: ${contractPath}`, Color.Yellow);
      return;
    }

    const contractName = getContractName(fullContractPath);
    if (contractName) {
      contractNames.push(contractName);
      const destContractPath = path.join(outputDir, 'contracts', `${contractName}.sol`);
      fs.copyFileSync(fullContractPath, destContractPath);
      log(`  ✓ ${contractName}.sol`, Color.Green);
    }

    // Copy test
    const fullTestPath = path.join(rootDir, testPath);
    if (fs.existsSync(fullTestPath)) {
      const testFileName = path.basename(testPath);
      const destTestPath = path.join(outputDir, 'test', testFileName);
      if (!fs.existsSync(destTestPath)) {
        fs.copyFileSync(fullTestPath, destTestPath);
        log(`  ✓ ${testFileName}`, Color.Green);
      }
    }
  });

  // Copy test helpers if they exist
  const helpersPath = path.join(rootDir, 'test', 'helpers.ts');
  if (fs.existsSync(helpersPath)) {
    fs.copyFileSync(helpersPath, path.join(outputDir, 'test', 'helpers.ts'));
    log(`  ✓ helpers.ts`, Color.Green);
  }

  success(`Copied ${contractNames.length} contracts and their tests`);

  // Step 3: Copy configuration files
  log('\n⚙️  Step 3: Copying configuration files...', Color.Cyan);
  const configFiles = ['hardhat.config.ts', 'tsconfig.json', 'package.json', '.gitignore'];
  configFiles.forEach(file => {
    const sourcePath = path.join(rootDir, file);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(outputDir, file));
    }
  });
  success('Configuration files copied');

  // Step 4: Generate deployment script
  log('\n📦 Step 4: Generating deployment script...', Color.Cyan);
  const deployScript = generateDeployScript(contractNames);
  const deployPath = path.join(outputDir, 'scripts', 'deploy.ts');
  fs.writeFileSync(deployPath, deployScript);
  success('Deployment script generated');

  // Step 5: Update package.json
  log('\n📝 Step 5: Updating package.json...', Color.Cyan);
  const packageJsonPath = path.join(outputDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = `fhevm-examples-${category}`;
    packageJson.description = categoryInfo.description;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  success('package.json updated');

  // Step 6: Generate README
  log('\n📖 Step 6: Generating README...', Color.Cyan);
  const readme = generateReadme(category, contractNames);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Final summary
  log('\n' + '='.repeat(60), Color.Green);
  success(`FHEVM ${categoryInfo.name} project created successfully!`);
  log('='.repeat(60), Color.Green);

  log('\n📊 Project Summary:', Color.Magenta);
  log(`  Category: ${categoryInfo.name}`);
  log(`  Contracts: ${contractNames.length}`);
  log(`  Location: ${path.relative(process.cwd(), outputDir)}`);

  log('\n📦 Next steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');

  log('\n🎉 Happy coding with FHEVM!', Color.Cyan);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Category Project Generator', Color.Cyan);
    log('\nUsage: ts-node scripts/create-fhevm-category.ts <category> [output-dir]\n');
    log('Available categories:', Color.Yellow);
    Object.entries(CATEGORIES).forEach(([key, info]) => {
      log(`  ${key}`, Color.Green);
      log(`    ${info.name}`, Color.Cyan);
      log(`    ${info.description}`, Color.Reset);
      log(`    Contracts: ${info.contracts.length}`, Color.Blue);
    });
    log('\nExample:', Color.Yellow);
    log('  ts-node scripts/create-fhevm-category.ts procurement ./output/procurement-examples\n');
    process.exit(0);
  }

  const category = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', `fhevm-examples-${category}`);

  createCategoryProject(category, outputDir);
}

main();
