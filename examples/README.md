# FHEVM Examples Documentation

This directory contains auto-generated GitBook-compatible documentation for all FHEVM examples in this repository.

## Overview

Each example is documented with:
- Complete contract source code
- Comprehensive test suite
- Usage instructions
- Best practices

## Examples

### Procurement

- **Privacy-Preserving Procurement** - Confidential bidding and vendor selection system

### Basic

- **FHE Counter** - Simple encrypted counter demonstrating basic FHE operations

## Generating Documentation

To generate documentation for all examples:

```bash
npm run generate-docs --all
```

To generate documentation for a specific example:

```bash
npm run generate-docs privacy-procurement
```

## GitBook Integration

This documentation is structured to be compatible with GitBook. The `SUMMARY.md` file defines the table of contents.

## Documentation Structure

```
examples/
├── SUMMARY.md                  # Table of contents for GitBook
├── README.md                   # This file
├── privacy-procurement.md      # Privacy procurement documentation
└── counter.md                  # Counter example documentation
```

## Contributing

When adding new examples, ensure documentation is generated using:

```bash
npm run generate-docs <example-name>
```

This will automatically update SUMMARY.md and create the documentation file.

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [GitBook Documentation](https://docs.gitbook.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
