# Submission Guidelines

Follow these steps to submit your FHEVM examples repository to the competition.

---

## Pre-Submission Checklist

Before submitting, verify all items:

### Code Quality

- [ ] All contracts compile without warnings
  ```bash
  npm run compile
  ```

- [ ] All tests pass
  ```bash
  npm run test
  ```

- [ ] Code follows Solidity style guide
  ```bash
  npm run lint
  ```

- [ ] No hardcoded values or test data in production code

- [ ] Security best practices followed (see below)

### Documentation

- [ ] README.md is comprehensive and clear
- [ ] All examples have detailed comments
- [ ] API reference is complete
- [ ] Developer guide is clear and helpful
- [ ] Architecture document explains design decisions
- [ ] Every contract has JSDoc comments

### Examples

- [ ] Minimum 5 working examples
- [ ] Each example demonstrates one clear concept
- [ ] Each example includes:
  - [ ] Well-commented Solidity contract
  - [ ] Comprehensive test suite
  - [ ] Auto-generated documentation

### Automation

- [ ] create-fhevm-example works correctly
- [ ] create-fhevm-category works correctly
- [ ] generate-docs works correctly
- [ ] All scripts have error handling
- [ ] Scripts are well-commented

### Testing

- [ ] npm run create-example counter ./test-temp works
- [ ] cd test-temp && npm install works
- [ ] cd test-temp && npm run compile works
- [ ] cd test-temp && npm run test works
- [ ] Remove test-temp directory

### Repository

- [ ] GitHub repository is public
- [ ] .gitignore is proper (no node_modules, .env, etc.)
- [ ] LICENSE file is present (BSD-3-Clause-Clear)
- [ ] No sensitive keys or passwords in any files
- [ ] Clear git history with meaningful commits

### Video

- [ ] Demonstration video is recorded (3-5 minutes)
- [ ] Video shows:
  - [ ] Project setup process
  - [ ] Running automation scripts
  - [ ] Compiling examples
  - [ ] Running tests
  - [ ] Viewing generated documentation
- [ ] Audio is clear and understandable
- [ ] Video is in common format (MP4, WebM)
- [ ] Video is uploaded to YouTube or similar
- [ ] Video link is included in submission

---

## Security Checklist

Verify security best practices:

### Smart Contracts

- [ ] All user inputs validated
- [ ] Proper access control implemented
- [ ] No unprotected external calls
- [ ] Reentrancy guard if needed
- [ ] No division by zero vulnerabilities
- [ ] Integer overflow/underflow handled
- [ ] Private values truly private (no indexing)

### Permissions

- [ ] FHE.allowThis() always called when needed
- [ ] FHE.allow() grants access to intended recipients
- [ ] No overly permissive permissions
- [ ] Permissions documented

### Solidity Version

- [ ] Using ^0.8.24 or appropriate version
- [ ] No deprecated functions
- [ ] Compiler warnings resolved

### Dependencies

- [ ] All dependencies pinned to specific versions
- [ ] No known vulnerabilities in dependencies
  ```bash
  npm audit
  ```
- [ ] Dependencies are from official sources
- [ ] package-lock.json is committed

---

## GitHub Repository Structure

Ensure your repository follows the proper structure:

```
your-repo/
├── fhevm-hardhat-template/
├── contracts/
├── test/
├── scripts/
├── docs/
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── DEVELOPER_GUIDE.md
├── MAINTENANCE_GUIDE.md
├── COMPETITION_BRIEF.md
├── QUICKSTART_GUIDE.md
├── PROJECT_STRUCTURE.md
├── CHANGELOG.md
├── package.json
├── tsconfig.json
├── .gitignore
├── .eslintrc.json
├── LICENSE
└── README.md
```

---

## Creating Your GitHub Repository

### Step 1: Initialize Local Repository

```bash
git init
git add .
git commit -m "Initial commit: FHEVM examples for competition"
```

### Step 2: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `fhevm-examples` (or similar)
   - **Description:** "Comprehensive FHEVM examples for Zama Developer Program"
   - **Visibility:** Public
   - **License:** BSD-3-Clause-Clear
3. Do NOT initialize with README, .gitignore, or license
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/yourusername/fhevm-examples.git
git push -u origin main
```

### Step 4: Add GitHub Topics

1. Go to Settings → About
2. Add topics:
   - `fhevm`
   - `fully-homomorphic-encryption`
   - `smart-contracts`
   - `zama`
   - `ethereum`

---

## Recording Your Demonstration Video

### Video Requirements

- **Duration:** 3-5 minutes
- **Format:** MP4, WebM, or similar
- **Resolution:** 1080p or higher
- **Audio:** Clear and understandable
- **Screen Recording Tool:** OBS, ScreenFlow, or Camtasia

### Video Content

1. **Introduction (30 seconds)**
   - Your name/username
   - Project title
   - Brief description of what you're showing

2. **Setup (1 minute)**
   - Clone repository
   - Show directory structure
   - npm install and dependencies

3. **Automation in Action (1.5 minutes)**
   ```bash
   npm run create-example counter ./demo-counter
   cd demo-counter
   npm install
   npm run compile
   npm run test
   ```

4. **Documentation (1 minute)**
   ```bash
   npm run generate-docs
   npm run generate-all-docs
   ```
   - Show generated documentation
   - Explain key structure

5. **Conclusion (30 seconds)**
   - Recap of key features
   - How to use for future development

### Tips for Good Video

- Use clear, zoomed-in terminal
- Speak clearly and at normal pace
- Pause occasionally to explain
- Show error handling
- Don't rush through code
- Include captions if possible
- Test audio levels before recording

### Uploading Video

1. Upload to YouTube, Vimeo, or similar
2. Make it unlisted or public
3. Keep link for submission
4. Consider keeping backup copy locally

---

## Preparing the Submission

### Create Submission Document

Create a `SUBMISSION.md` file:

```markdown
# Submission: FHEVM Examples

## Project Information

**Title:** [Your Project Title]
**Author(s):** [Your Name(s)]
**GitHub Repository:** https://github.com/yourusername/your-repo

## Overview

[1-2 paragraph description of your project]

## Key Features

- [Feature 1]
- [Feature 2]
- [Feature 3]
- [etc.]

## Examples Included

1. **[Example Name]** - [Brief description]
2. **[Example Name]** - [Brief description]
3. [etc.]

## Running the Project

```bash
git clone https://github.com/yourusername/your-repo
cd your-repo
npm install
npm run compile
npm run test
npm run create-example counter ./test-counter
```

## Demonstration Video

**Video Link:** [YouTube/Vimeo link]

## Technology Stack

- Solidity ^0.8.24
- Hardhat 2.19+
- @fhevm/solidity 0.9.x
- TypeScript 5.x
- Ethers.js 6.x

## Innovation Highlights

- [Innovation 1]
- [Innovation 2]
- [etc.]

## Additional Notes

[Any other important information]

---

**Submitted on:** [Date]
```

---

## Final Submission Steps

### 1. GitHub Repository Verification

```bash
# Test fresh clone
rm -rf /tmp/test-clone
git clone https://github.com/yourusername/your-repo /tmp/test-clone
cd /tmp/test-clone

# Run through complete workflow
npm install
npm run compile
npm run test
npm run create-example counter ./test-counter

# Cleanup
cd /tmp/test-clone/test-counter
npm install
npm run compile
npm run test

echo "✅ Fresh clone test passed!"
```

### 2. Documentation Verification

- [ ] README.md is complete and clear
- [ ] All links work
- [ ] Code examples are correct
- [ ] Directories referenced exist
- [ ] No typos or grammar errors

### 3. Video Verification

- [ ] Video is accessible at provided link
- [ ] Video quality is good
- [ ] Audio is clear
- [ ] All key points are covered
- [ ] Video duration is appropriate

### 4. Repository Verification

- [ ] README at root is excellent
- [ ] LICENSE file is present
- [ ] .gitignore is proper
- [ ] No secrets in repository
- [ ] Important directories are organized

---

## Submission Platforms

### Official Submission Method

1. **Zama Guild Platform**
   - Go to https://guild.xyz/zama/developer-program
   - Connect your wallet
   - Fill out submission form
   - Attach GitHub link
   - Attach video link

### Submission Form Fields

- **Project Title**
- **GitHub Repository URL**
- **Demonstration Video URL**
- **Brief Description (500 characters max)**
- **List of Examples** (comma-separated)
- **Innovation Summary**
- **Contact Email**
- **Twitter/Social Handle** (optional)

---

## After Submission

### What Happens Next

1. **Submission Confirmation** - You'll receive acknowledgment
2. **Initial Review** - Team checks completion
3. **Technical Evaluation** - Code is tested and reviewed
4. **Judging** - Evaluated against criteria
5. **Announcement** - Winners announced on [Date]

### Timeline

- **Submission Deadline:** December 31, 2025
- **Judging Period:** January 1-15, 2026
- **Winner Announcement:** January 16, 2026
- **Prize Distribution:** Within 30 days

### Stay Updated

- Monitor email for updates
- Join Discord for announcements
- Check Zama website for results

---

## Common Submission Issues

### Issue: Repository Link is Private

**Solution:** Make repository public
```bash
# GitHub Settings > Visibility
# Change from Private to Public
```

### Issue: Video Link Doesn't Work

**Solution:** Verify video sharing settings
- YouTube: Set to "Public" or "Unlisted"
- Vimeo: Disable password protection
- Test link in incognito window

### Issue: Examples Don't Compile

**Solution:** Debug before submission
```bash
npm run compile 2>&1 | head -20
# Fix reported errors
npm run compile
```

### Issue: Tests Fail

**Solution:** Ensure tests pass locally
```bash
npm run test
# Fix failing tests
npm run test
```

---

## Disqualification Criteria

Your submission may be disqualified if:

- [ ] Repository is private or inaccessible
- [ ] Code doesn't compile
- [ ] Tests don't pass
- [ ] Fewer than 5 examples
- [ ] Missing demonstration video
- [ ] Plagiarized code detected
- [ ] Security vulnerabilities present
- [ ] No proper documentation
- [ ] Violates competition rules

---

## Support During Submission

If you encounter issues:

1. **Check FAQ** - Many questions are answered in [FAQ.md](./FAQ.md)
2. **Review Documentation** - See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
3. **Ask in Forum** - https://www.zama.ai/community
4. **Join Discord** - https://discord.com/invite/zama
5. **GitHub Issues** - Ask in FHEVM repo if library issue

---

## Final Reminders

✅ **DO:**
- Submit before deadline
- Test everything locally
- Record clear video
- Write good documentation
- Follow all guidelines
- Keep code clean and organized

❌ **DON'T:**
- Submit at last minute
- Skip the video requirement
- Include sensitive data
- Copy other projects
- Neglect testing
- Use obscure code

---

## Submission Confirmation Template

After submitting, you can use this template to confirm:

```
Submission Confirmed ✅

Project: [Title]
Repository: [Link]
Video: [Link]
Examples: [Count]
Submitted: [Date/Time]

Key Innovations:
- [Innovation 1]
- [Innovation 2]

Status: Ready for evaluation
```

---

## Questions About Submission?

Refer to the appropriate guide:
- **Setup Issues:** See [QUICKSTART_GUIDE.md](./QUICKSTART_GUIDE.md)
- **Development Questions:** See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **API Questions:** See [API_REFERENCE.md](./API_REFERENCE.md)
- **General Questions:** See [FAQ.md](./FAQ.md)

---

**Good Luck with Your Submission! 🎉**

You're building something that will help the entire FHEVM developer community. We're excited to see what you create!

---

**Deadline:** December 31, 2025, 23:59 UTC
**Prize Pool:** $10,000

Don't miss this opportunity! 🚀
