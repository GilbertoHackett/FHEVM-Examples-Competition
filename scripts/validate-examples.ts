#!/usr/bin/env ts-node

/**
 * validate-examples - Validates that all examples compile and tests pass
 *
 * Usage: ts-node scripts/validate-examples.ts
 */

import { execSync } from 'child_process';
import * as path from 'path';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function error(message: string): void {
  log(`❌ ${message}`, Color.Red);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

function runCommand(command: string, description: string): boolean {
  try {
    info(`${description}...`);
    execSync(command, { stdio: 'pipe', cwd: process.cwd() });
    success(`${description} - PASSED`);
    return true;
  } catch (err) {
    error(`${description} - FAILED`);
    return false;
  }
}

function main(): void {
  log('\n' + '='.repeat(60), Color.Cyan);
  log('FHEVM Examples Validation', Color.Cyan);
  log('='.repeat(60) + '\n', Color.Cyan);

  const results: { name: string; passed: boolean }[] = [];

  // Check if project compiles
  results.push({
    name: 'Compilation',
    passed: runCommand('npx hardhat compile', 'Compiling contracts'),
  });

  // Check if tests pass
  results.push({
    name: 'Tests',
    passed: runCommand('npx hardhat test', 'Running tests'),
  });

  // Summary
  log('\n' + '='.repeat(60), Color.Cyan);
  log('Validation Summary', Color.Cyan);
  log('='.repeat(60) + '\n', Color.Cyan);

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    const color = result.passed ? Color.Green : Color.Red;
    log(`${result.name}: ${status}`, color);
  });

  log('\n' + '='.repeat(60), Color.Cyan);
  log(`Total: ${passed}/${total} checks passed`, passed === total ? Color.Green : Color.Red);
  log('='.repeat(60) + '\n', Color.Cyan);

  if (passed < total) {
    log('Some validations failed. Please fix the issues above.', Color.Red);
    process.exit(1);
  } else {
    log('All validations passed! 🎉', Color.Green);
    process.exit(0);
  }
}

main();
