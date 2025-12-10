# Maintenance and Dependency Management Guide

This guide helps you maintain your submission when FHEVM and related dependencies are updated.

---

## Understanding Dependency Management

### Key Dependencies

```json
{
  "@fhevm/solidity": "Core encryption library - may have breaking changes",
  "@fhevm/hardhat-plugin": "Testing framework integration",
  "@zama-fhe/relayer-sdk": "Decryption request handling",
  "ethers": "Web3 interaction library",
  "hardhat": "Development environment",
  "typescript": "Type safety for scripts"
}
```

### Dependency Update Frequency

- **@fhevm/solidity**: Quarterly (major features/fixes)
- **@fhevm/hardhat-plugin**: With @fhevm/solidity updates
- **@zama-fhe/relayer-sdk**: As needed
- **ethers**: Regularly (new features)
- **hardhat**: Monthly updates available
- **typescript**: Annually

---

## Maintenance Workflow

### Step 1: Monitor for Updates

Set up notifications:

```bash
# Check for outdated packages
npm outdated

# Using Dependabot (GitHub)
# Enable in Settings > Code Security > Dependabot > Alerts
```

### Step 2: Evaluate Updates

Check the FHEVM changelog for:

- **Breaking Changes**
  - API changes in `FHE.*` functions
  - New encryption types
  - Permission model changes

- **New Features**
  - New operations available
  - Performance improvements
  - Bug fixes

- **Deprecations**
  - Deprecated functions
  - Recommended replacements

### Step 3: Update Base Template

```bash
cd fhevm-hardhat-template

# Update @fhevm/solidity specifically
npm install @fhevm/solidity@latest

# Update other critical deps
npm install @fhevm/hardhat-plugin@latest @zama-fhe/relayer-sdk@latest

# Verify compilation
npm run compile

# Verify tests pass
npm run test
```

### Step 4: Test All Examples

```bash
# Create test instances of key examples
npm run create-example counter ./test-output/counter
npm run create-example arithmetic ./test-output/arithmetic
npm run create-example access-control ./test-output/access-control

# Test each one
for dir in test-output/*; do
  cd "$dir"
  npm install
  npm run compile && npm run test
  if [ $? -ne 0 ]; then
    echo "❌ FAILED: $dir"
    exit 1
  fi
  cd ../..
done

echo "✅ All examples passed"
```

### Step 5: Update Contract Code (if needed)

#### Scenario: FHE API Changes

**Old Code:**
```solidity
euint32 result = FHE.add(a, b);
```

**New Code (if API changed):**
```solidity
euint32 result = FHE.operate(FHE.Operation.ADD, a, b);
```

**Update Process:**
1. Edit all affected contracts in `/contracts`
2. Update corresponding tests in `/test`
3. Regenerate documentation
4. Test all examples
5. Document the change

#### Scenario: New Features Available

**New Feature in Update:**
```solidity
// New: Batch operations for efficiency
euint32[] memory results = FHE.batchAdd(euint32[] calldata values);
```

**What to Do:**
1. Consider creating new example: `batch-operations`
2. Update advanced examples if applicable
3. Document in examples and docs

### Step 6: Regenerate Documentation

```bash
# Regenerate all documentation
npm run generate-docs --all

# Review for outdated references
grep -r "version" docs/ | grep -i "fhevm"

# Update version references in docs
# Edit docs/README.md, ARCHITECTURE.md, etc.
```

### Step 7: Update Automation Scripts

If the API changed, update scripts:

```typescript
// scripts/lib/config.ts
// Check if any example descriptions need updates

// scripts/create-fhevm-example.ts
// Verify template generation works

// scripts/generate-docs.ts
// Check if doc generation works
```

### Step 8: Document the Update

Create a `CHANGELOG.md` entry:

```markdown
## [Version] - [Date]

### Updated
- @fhevm/solidity from x.x.x to y.y.y
- @fhevm/hardhat-plugin from x.x.x to y.y.y

### Breaking Changes
- [Breaking change 1]
- [Migration path for each]

### New Features
- [New capability 1]
- [New capability 2]

### Examples Updated
- [Example 1]: [What changed]
- [Example 2]: [What changed]

### Migration Guide
See [MIGRATION_v1.0_to_v2.0.md](./MIGRATION_v1.0_to_v2.0.md) for detailed upgrade instructions.
```

---

## Common Update Scenarios

### Scenario 1: Minor Version Update (Low Risk)

**Example:** @fhevm/solidity 0.8.3 → 0.8.4

```bash
npm install @fhevm/solidity@0.8.4

# Quick test
npm run compile && npm run test

# If passes, you're done
git add -A && git commit -m "chore: update fhevm-solidity to 0.8.4"
```

### Scenario 2: Major Version Update (High Risk)

**Example:** @fhevm/solidity 0.8.x → 0.9.0

```bash
# Before updating
git checkout -b feat/fhevm-0.9-update

# Update
npm install @fhevm/solidity@0.9.0

# Check for breaking changes
npm run compile

# If compilation fails:
# 1. Review release notes carefully
# 2. Identify deprecated functions
# 3. Update contracts one by one
# 4. Test thoroughly

# Regenerate everything
npm run compile && npm run test
npm run generate-docs --all
npm run create-example counter ./test-update

# Comprehensive testing
cd test-update && npm install && npm test && cd ..

# Create migration guide
# Document what changed and how to migrate
```

### Scenario 3: New Encryption Type Added

**Example:** New `euint128` type available

```solidity
// Old contracts still use euint64
euint64 value = FHE.asEuint64(100);

// New code can leverage euint128
euint128 bigValue = FHE.asEuint128(1000000);

// Create new example
// contracts/advanced/LargeNumbers.sol
// Show when to use euint128 vs euint64
```

---

## Troubleshooting Update Issues

### Issue: Code Won't Compile After Update

```bash
# 1. Check the error message carefully
npm run compile

# 2. Review FHEVM changelog
# https://github.com/zama-ai/fhevm/releases

# 3. Check if a function was renamed
grep -r "FHE\." contracts/ | head -20

# 4. Review MIGRATION_GUIDE if available

# 5. Ask in community forum with:
# - Error message
# - Your code snippet
# - Which version you updated to
```

### Issue: Tests Fail After Update

```bash
# 1. Run tests with verbose output
npm run test -- --reporter spec

# 2. Check if test utilities changed
# Look for hardhat-fhevmjs compatibility

# 3. Review test-specific release notes

# 4. Regenerate tests if template changed
npm run generate-docs --all
```

### Issue: Permissions Behavior Changed

```bash
# Old permission model
FHE.allow(value, user);

# New permission model (hypothetical)
FHE.grantAccess(value, user, FHE.AccessLevel.DECRYPT);

# What to do:
# 1. Find all FHE.allow calls
grep -r "FHE\.allow" contracts/

# 2. Update each one
# 3. Test thoroughly
# 4. Document in CHANGELOG

# 5. Create example showing new pattern
# contracts/advanced/ModernPermissions.sol
```

---

## Automated Maintenance

### Create Update Script

```typescript
// scripts/check-updates.ts
import { execSync } from "child_process";
import fs from "fs";

async function checkForUpdates() {
    console.log("Checking for FHEVM updates...");

    try {
        const output = execSync("npm outdated --json").toString();
        const outdated = JSON.parse(output);

        const critical = ["@fhevm/solidity", "@fhevm/hardhat-plugin"];
        const criticalUpdates = Object.keys(outdated)
            .filter(pkg => critical.includes(pkg));

        if (criticalUpdates.length > 0) {
            console.log("⚠️  Critical updates available:");
            criticalUpdates.forEach(pkg => {
                const info = outdated[pkg];
                console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
            });

            // Create an issue or send notification
            fs.writeFileSync(
                "UPDATE_AVAILABLE.md",
                `# Updates Available\n\n${criticalUpdates.join("\n")}`
            );
        } else {
            console.log("✅ All critical dependencies are up to date");
        }
    } catch (error) {
        console.error("Error checking updates:", error.message);
    }
}

checkForUpdates();
```

### GitHub Actions Workflow

```yaml
# .github/workflows/check-updates.yml
name: Check for FHEVM Updates

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm run check-updates
```

---

## Version Management Best Practices

### Keep Track of Versions

```json
// package.json
{
  "fhevmVersion": "0.9.1",
  "supportedNetworks": ["sepolia", "mainnet"],
  "lastUpdated": "2025-12-10"
}
```

### Create Version Documentation

```markdown
# FHEVM Version Compatibility

| FHEVM Version | Status | Supported |
|---|---|---|
| 0.8.x | Deprecated | ❌ |
| 0.9.x | Current | ✅ |
| 1.0.x | Beta | ⚠️ |

## Migration Guides
- [0.8 → 0.9](./MIGRATION_0.8_to_0.9.md)
- [0.9 → 1.0](./MIGRATION_0.9_to_1.0.md)
```

---

## Testing Strategy After Updates

### Regression Testing

```bash
#!/bin/bash
# scripts/regression-test.sh

set -e

echo "🔍 Running regression tests..."

# 1. Compile all
echo "Compiling..."
npm run compile

# 2. Run unit tests
echo "Running unit tests..."
npm run test

# 3. Generate examples
echo "Testing example generation..."
npm run create-example counter ./test-regression-counter
npm run create-example arithmetic ./test-regression-arithmetic
npm run create-example access-control ./test-regression-access

# 4. Test generated examples
for dir in test-regression-*; do
  echo "Testing $dir..."
  cd "$dir"
  npm install > /dev/null 2>&1
  npm run compile > /dev/null 2>&1
  npm run test > /dev/null 2>&1
  cd ..
done

# 5. Cleanup
rm -rf test-regression-*

echo "✅ All regression tests passed!"
```

---

## Long-Term Maintenance

### Quarterly Review

1. Check for FHEVM updates
2. Review community discussions for issues
3. Update documentation if needed
4. Run full test suite
5. Update examples if new patterns emerge

### Annual Review

1. Major dependency audit
2. Performance benchmarking
3. Code quality assessment
4. Documentation refresh
5. Plan for next year's improvements

---

## Reporting Issues

If you encounter problems with updates:

1. **Document the issue**
   - Version numbers
   - Error messages
   - Steps to reproduce

2. **Check if it's documented**
   - FHEVM release notes
   - GitHub issues
   - Community forum

3. **Report appropriately**
   - FHEVM repo: https://github.com/zama-ai/fhevm
   - Zama forum: https://www.zama.ai/community
   - Discord: https://discord.com/invite/zama

---

## Maintenance Checklist

### Monthly
- [ ] Check for security updates
- [ ] Monitor GitHub issues
- [ ] Review community questions

### Quarterly
- [ ] Check for FHEVM updates
- [ ] Run full test suite
- [ ] Update dependencies
- [ ] Regenerate documentation

### Annually
- [ ] Major version audit
- [ ] Performance review
- [ ] Code quality assessment
- [ ] Documentation refresh

---

## Conclusion

Proper maintenance ensures:
- ✅ Examples stay current
- ✅ Security vulnerabilities are patched
- ✅ New features can be leveraged
- ✅ Code quality remains high
- ✅ Documentation stays accurate

Follow this guide to keep your submission valuable for the community!

---

**Questions?** See [FAQ.md](./FAQ.md) or ask in the community forum.
