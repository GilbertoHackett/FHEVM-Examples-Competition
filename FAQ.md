# Frequently Asked Questions (FAQ)

Quick answers to common questions about the FHEVM examples competition.

---

## Getting Started

### Q: Do I need cryptography knowledge to participate?

**A:** No! The competition is designed for developers with smart contract experience, not cryptography experts. The tutorial and examples explain all necessary FHE concepts.

### Q: What if I've never used FHEVM before?

**A:** Perfect! Follow the [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md) which walks you through everything step-by-step. Start with simple examples and build up complexity.

### Q: How much Solidity knowledge do I need?

**A:** You should be comfortable writing and deploying basic smart contracts. Understanding contracts, functions, and state variables is essential. FHE-specific concepts are taught in the examples.

### Q: Do I need to use the provided base template?

**A:** Yes, all examples must use the provided Hardhat-based template. This ensures consistency and allows for automated scaffolding.

---

## Project Structure

### Q: Can I use a monorepo structure?

**A:** No. Each example should be a separate, standalone repository generated from the base template. Monorepos don't work well for the scaffolding requirements.

### Q: What if I want to add examples in categories not listed?

**A:** You can create additional categories beyond the required ones! This actually earns bonus points. Just ensure you update the automation scripts to include them.

### Q: How many examples should I include?

**A:** Minimum of 5 complete examples required. More is better and increases your chances:
- 5-7 examples: Meets requirements
- 8-12 examples: Shows comprehensive coverage
- 13+ examples: Demonstrates exceptional effort

### Q: Do all examples need tests?

**A:** Yes, every example must have comprehensive tests. Tests should include:
- Success cases
- Failure cases
- Edge cases
- Error handling

---

## Writing Examples

### Q: How long should each example be?

**A:** Keep contracts focused and educational:
- **Basic examples:** 50-150 lines of code
- **Advanced examples:** 150-300 lines of code
- **Domain examples:** 300-500 lines of code

More lines ≠ better. Clarity and education are priorities.

### Q: What FHE operations should I demonstrate?

**A:** Required:
- Encryption (FHE.asEuint\*)
- Basic arithmetic (add, sub, mul)
- Comparisons (eq, lt, gt)
- Permissions (FHE.allow\*)

Bonus points for:
- Conditional logic (FHE.select)
- Complex patterns
- Practical applications

### Q: How do I show anti-patterns?

**A:** Include both ✅ correct patterns and ❌ common mistakes:

```solidity
// ✅ DO: Set permissions correctly
FHE.allowThis(result);
FHE.allow(result, msg.sender);

// ❌ DON'T: Forget allowThis
FHE.allow(result, msg.sender);  // Will fail!
```

### Q: Can I reference OpenZeppelin's confidential contracts?

**A:** Yes! In fact, examples using ERC-7984 or other OpenZeppelin standards are encouraged. Include them as advanced or integration examples.

---

## Automation Scripts

### Q: What language should automation scripts be in?

**A:** TypeScript is required. All scripts should be in `scripts/` and executable via npm scripts.

### Q: Does every script need error handling?

**A:** Yes. Scripts should gracefully handle:
- Missing directories
- Invalid parameters
- File I/O errors
- Compilation failures

### Q: Should I support all operating systems?

**A:** Yes. Scripts should work on Windows, macOS, and Linux. Use cross-platform libraries where needed.

---

## Documentation

### Q: How detailed should documentation be?

**A:** Each example needs:
1. **Title and one-sentence summary** - What is this?
2. **Overview** - Why would you use this?
3. **Key concepts** - What FHE concepts are demonstrated?
4. **Code walkthrough** - Explaining important parts
5. **Test explanation** - What the tests verify
6. **Common mistakes** - Anti-patterns to avoid
7. **Next steps** - Related examples or concepts

### Q: Can I auto-generate all documentation?

**A:** You should auto-generate where possible and manually enhance:
- **Auto-generate:** Markdown from code structure, file listings
- **Manually write:** Explanations, conceptual discussions, pedagogical content

### Q: What documentation format is required?

**A:** GitBook-compatible Markdown with this structure:
- SUMMARY.md (navigation index)
- category/index.md (category overview)
- category/example-name.md (individual examples)

---

## Testing

### Q: How comprehensive should tests be?

**A:** Tests should cover:
- Normal operation (happy path)
- Input validation (should reject invalid inputs)
- Edge cases (boundary conditions)
- Error conditions (revert messages)
- Permission scenarios (who can do what)

Aim for >80% code coverage.

### Q: Do tests need to actually decrypt values?

**A:** No. In the local testing environment (hardhat-fhevmjs), you verify that:
- Transactions succeed/fail appropriately
- Permissions are set correctly
- Functions can be called in the right order

Full decryption is tested on Sepolia testnet.

### Q: What testing framework should I use?

**A:** Use Hardhat's built-in Chai testing framework with `ethers.js`. This matches the ecosystem.

---

## Deployment

### Q: Do I need to deploy on Sepolia?

**A:** Not required for submission, but recommended for validation. If you deploy:
1. Test that fresh examples can be deployed
2. Include deployment script examples
3. Document the process

### Q: What's the difference between local and Sepolia testing?

**A:**
- **Local (hardhat-fhevmjs):** Fast, for development
- **Sepolia:** Real FHEVM network, slower but production-like

Both should work for your submission.

---

## Video Demonstration

### Q: How long should my video be?

**A:** 3-5 minutes is ideal:
- Under 3 minutes: Too rushed
- Over 5 minutes: Too long
- 3-5 minutes: Perfect pace

### Q: What should the video show?

**A:** Must include:
1. Project setup (git clone, npm install)
2. Running automation scripts
3. Example generation in action
4. Compilation and testing
5. Documentation generation

### Q: Do I need to appear in the video?

**A:** No, but a brief intro is nice. Screen recording is sufficient.

### Q: Can I share a video link to YouTube?

**A:** Yes. Any publicly accessible video link works:
- YouTube (public or unlisted)
- Vimeo
- Your own hosting
- GitHub releases

---

## Submission

### Q: When is the deadline?

**A:** December 31, 2025, 23:59 UTC (Anywhere On Earth)

Don't submit at the last minute in case of technical issues!

### Q: How do I submit?

**A:**
1. Push your GitHub repository (must be public)
2. Upload demonstration video
3. Go to https://guild.xyz/zama/developer-program
4. Fill out submission form with:
   - GitHub repository URL
   - Video URL
   - Brief project description
   - List of examples

### Q: Can I submit updates after the deadline?

**A:** No. The deadline is firm. Submit with whatever you have complete by the deadline.

### Q: Can I work with a team?

**A:** Yes! Teams are welcome. Clearly identify all contributors in your README and submission.

### Q: What if I discover a bug after submitting?

**A:** You cannot update your submission, but you can:
1. Inform the judges in Discord
2. Commit fixes to your GitHub repo with clear notes
3. Judges may consider your follow-up work

---

## Evaluation

### Q: What are the judging criteria?

**A:** Judging is based on:
1. **Code quality** (25%) - Clean, documented, secure
2. **Automation completeness** (25%) - Scripts work well
3. **Example quality** (20%) - Educational and useful
4. **Documentation** (15%) - Clear and comprehensive
5. **Innovation** (15%) - Unique approaches, bonus features

### Q: Will judges test my examples?

**A:** Yes. Judges will:
1. Clone your repository
2. Run npm install
3. Run npm run compile
4. Run npm run test
5. Test the scaffolding scripts
6. Generate examples and verify they work

### Q: What happens if tests don't pass?

**A:** Your submission may be disqualified or score lower. Test everything locally before submitting!

### Q: How are winners selected?

**A:** Top submissions scoring highest across all criteria:
- 1st place: $5,000
- 2nd place: $3,000
- 3rd place: $2,000

---

## Technical Issues

### Q: I'm getting compiler errors

**A:** Common solutions:
1. Ensure Solidity version is ^0.8.24
2. Check imports are from @fhevm/solidity
3. Verify @fhevm/solidity is installed: `npm install`
4. Check TypeScript version: `npm list typescript`

### Q: Tests are failing

**A:** Debug steps:
1. Run one test at a time: `npx hardhat test --grep "test name"`
2. Add console.log statements for debugging
3. Check test prerequisites (FhevmInstance, signers)
4. Verify contract functions match test expectations

### Q: Automation script won't work

**A:** Common fixes:
1. Check file paths are correct
2. Ensure input parameters are valid
3. Verify template exists and is accessible
4. Run with error output: `ts-node script.ts 2>&1`

### Q: Can't connect to network

**A:** For Sepolia:
1. Set INFURA_API_KEY: `npx hardhat vars set INFURA_API_KEY`
2. Check you have testnet funds
3. Verify network configuration in hardhat.config.ts

---

## Getting Help

### Q: Where can I ask questions?

**A:**
- **Documentation:** Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Forum:** https://www.zama.ai/community
- **Discord:** https://discord.com/invite/zama
- **GitHub Issues:** https://github.com/zama-ai/fhevm/issues

### Q: Can I look at example projects?

**A:** Yes, references:
- [Official example project](https://github.com/poppyseedDev/zama-bounty-11-example-project)
- [Base template](https://github.com/zama-ai/fhevm-hardhat-template)
- [Live dApps](https://github.com/zama-ai/dapps)

### Q: Is there a Discord community for help?

**A:** Yes! Join [Zama's Discord](https://discord.com/invite/zama) for:
- Real-time help from developers
- Community support
- Latest announcements
- Networking with other participants

---

## Intellectual Property

### Q: Will my code be used elsewhere?

**A:**
- You retain all rights to your code
- Winning submissions may be featured as examples with attribution
- You choose the license (BSD-3-Clause-Clear required)

### Q: Can I reuse code from existing projects?

**A:** Yes, if:
1. You have proper licenses
2. You cite the original source
3. You attribute the work
4. You modify/improve on it

Copying without attribution is disqualifying.

---

## Miscellaneous

### Q: What if FHEVM gets updated during competition?

**A:** Use the version available at competition start (0.9.x). If critical updates happen, judges will allow submissions with updated versions.

### Q: Can I use other testing frameworks?

**A:** No. Must use Hardhat with Chai framework for consistency.

### Q: Is there a template I should use?

**A:** Yes, use the official [fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template) as your base.

### Q: Can I participate if I'm a Zama employee?

**A:** No, Zama employees are not eligible. Open only to community developers.

### Q: What's the best way to prepare?

**A:**
1. Read through all documentation
2. Work through QUICKSTART_GUIDE
3. Build a simple example
4. Gradually build more complex examples
5. Focus on clarity and education
6. Test thoroughly

---

## Still Have Questions?

Check these in order:
1. **[QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)** - Getting started
2. **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Writing examples
3. **[API_REFERENCE.md](./API_REFERENCE.md)** - FHEVM API details
4. **[SUBMISSION_GUIDE.md](./SUBMISSION_GUIDE.md)** - Submitting
5. **Community Forum** - Ask other developers
6. **Discord** - Real-time help

---

## Good Luck! 🚀

You've got this! The FHEVM community is excited to see what you build.

Remember:
- ✅ Start simple
- ✅ Test everything
- ✅ Document well
- ✅ Focus on education
- ✅ Submit before deadline

**Happy building!**

---

*Frequently Asked Questions for FHEVM Examples Competition*
*Last updated: December 2025*
