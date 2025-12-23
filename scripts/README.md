# Automation Scripts

This directory contains automation tools for generating FHEVM example repositories and documentation.

## Available Scripts

### 1. create-fhevm-example.ts

Generate standalone FHEVM example repositories from this project.

**Usage:**

```bash
# Using npm script (recommended)
npm run create-example <example-name> [output-dir]

# Direct execution
ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]
```

**Examples:**

```bash
# Generate Privacy Procurement example
npm run create-example privacy-procurement ./output/my-procurement

# Generate Counter example
npm run create-example counter ./output/my-counter
```

**What it does:**

1. Creates a complete Hardhat project structure
2. Copies the selected contract and its tests
3. Generates appropriate configuration files
4. Creates a custom README.md
5. Sets up deployment scripts

**Available Examples:**

- `privacy-procurement` - Privacy-preserving procurement system
- `counter` - Basic FHE counter example

---

### 2. create-fhevm-category.ts

Generate projects containing multiple examples from a category.

**Usage:**

```bash
# Using npm script (recommended)
npm run create-category <category> [output-dir]

# Direct execution
ts-node scripts/create-fhevm-category.ts <category> [output-dir]
```

**Examples:**

```bash
# Generate procurement category project
npm run create-category procurement ./output/procurement-examples
```

**What it does:**

1. Creates a project with all contracts from a category
2. Includes all related tests and fixtures
3. Generates unified deployment script
4. Creates comprehensive README
5. Perfect for learning multiple related concepts

**Available Categories:**

- `procurement` - Privacy-preserving procurement examples (2 contracts)

---

### 3. generate-docs.ts

Auto-generate GitBook-formatted documentation from contracts and tests.

**Usage:**

```bash
# Generate docs for specific example
npm run generate-docs <example-name>

# Generate docs for all examples
npm run generate-docs --all

# Direct execution
ts-node scripts/generate-docs.ts <example-name>
ts-node scripts/generate-docs.ts --all
```

**Examples:**

```bash
# Generate documentation for Privacy Procurement
npm run generate-docs privacy-procurement

# Generate documentation for all examples
npm run generate-docs --all
```

**What it does:**

1. Extracts contract and test code
2. Generates GitBook-formatted markdown
3. Creates tabbed code blocks for easy reading
4. Updates SUMMARY.md for GitBook navigation
5. Organizes by category

**Output:**

Documentation files are generated in the `examples/` directory.

---

### 4. validate-examples.ts

Validate that all examples compile and tests pass.

**Usage:**

```bash
# Using npm script (recommended)
npm run validate-examples

# Direct execution
ts-node scripts/validate-examples.ts
```

**What it does:**

1. Compiles all contracts
2. Runs all tests
3. Reports any failures
4. Ensures project integrity

**Use this before:**

- Submitting pull requests
- Creating releases
- Generating examples

---

### 5. deploy.ts

Deploy contracts to networks.

**Usage:**

```bash
# Deploy to local network
npm run deploy

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Direct execution
ts-node scripts/deploy.ts
```

---

## Workflow Examples

### Adding a New Example

1. **Create your contract** in `contracts/YourExample.sol`

2. **Create tests** in `test/YourExample.test.ts`

3. **Update script configurations:**

   Edit `scripts/create-fhevm-example.ts`:
   ```typescript
   const EXAMPLES_MAP: Record<string, ExampleConfig> = {
     // ...existing examples
     'your-example': {
       contract: 'contracts/YourExample.sol',
       test: 'test/YourExample.test.ts',
       description: 'Description of your example',
     },
   };
   ```

   Edit `scripts/generate-docs.ts`:
   ```typescript
   const EXAMPLES_CONFIG: Record<string, DocsConfig> = {
     // ...existing examples
     'your-example': {
       title: 'Your Example',
       description: 'Detailed description...',
       contract: 'contracts/YourExample.sol',
       test: 'test/YourExample.test.ts',
       output: 'examples/your-example.md',
       category: 'Your Category',
     },
   };
   ```

4. **Generate standalone example:**
   ```bash
   npm run create-example your-example ./test-output
   ```

5. **Test the generated example:**
   ```bash
   cd test-output
   npm install
   npm run compile
   npm run test
   ```

6. **Generate documentation:**
   ```bash
   npm run generate-docs your-example
   ```

7. **Validate everything:**
   ```bash
   npm run validate-examples
   ```

### Updating Dependencies

When FHEVM or Hardhat versions change:

1. Update `base-template/package.json`
2. Update root `package.json`
3. Regenerate a few examples to test
4. Run validation

```bash
cd base-template
npm install @fhevm/solidity@latest
cd ..
npm run validate-examples
```

### Bulk Operations

```bash
# Generate all documentation
npm run generate-docs --all

# Test multiple examples
for example in privacy-procurement counter; do
  npm run create-example $example ./output/$example
  cd ./output/$example
  npm install && npm test
  cd ../..
done
```

## Script Architecture

### Color Output

All scripts use colored terminal output for better readability:

- 🟢 Green: Success messages
- 🔵 Blue: Information
- 🟡 Yellow: Warnings
- 🔴 Red: Errors
- 🔵 Cyan: Section headers

### Error Handling

All scripts:
- Validate inputs before execution
- Provide helpful error messages
- Exit with appropriate codes (0 = success, 1 = error)
- Show available options with `--help`

### File Operations

Scripts safely:
- Check if output directories exist before creating
- Preserve important files
- Skip unnecessary directories (node_modules, etc.)
- Handle both absolute and relative paths

## Configuration Files

Scripts read configurations from:

- `EXAMPLES_MAP` in `create-fhevm-example.ts` - Example definitions
- `CATEGORIES` in `create-fhevm-category.ts` - Category groupings
- `EXAMPLES_CONFIG` in `generate-docs.ts` - Documentation settings

## TypeScript Support

All scripts are written in TypeScript with:

- Full type safety
- Modern ES2020 features
- Async/await patterns
- Proper error handling

## Dependencies

Scripts require:

- Node.js >= 20.0.0
- TypeScript
- ts-node (for execution)
- fs, path (built-in Node modules)

## Help & Documentation

Get help for any script:

```bash
ts-node scripts/<script-name>.ts --help
ts-node scripts/<script-name>.ts -h
```

## Contributing

When adding new automation:

1. Follow existing patterns
2. Add color-coded output
3. Include `--help` option
4. Update this README
5. Test thoroughly

## Support

For questions or issues with scripts:

1. Check script output messages
2. Use `--help` flag
3. Review this documentation
4. Check main project README.md

---

**Built for the FHEVM Examples Competition**

*Making FHEVM development easier through automation*
