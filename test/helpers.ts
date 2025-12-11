import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";

/**
 * Get FHEVM Instance for Testing
 * @returns FhevmInstance configured for testing
 */
export async function getFhevmInstance(): Promise<FhevmInstance> {
  return await (ethers as any).getEncryptionUtils().getInstance();
}

/**
 * Deploy contract with proper error handling
 * @param contractName Name of contract to deploy
 * @param args Constructor arguments
 * @returns Deployed contract instance
 */
export async function deployContract(
  contractName: string,
  args: any[] = []
) {
  console.log(`Deploying ${contractName}...`);

  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(...args);
  await contract.deployed();

  console.log(`✓ ${contractName} deployed to:`, contract.address);
  return contract;
}

/**
 * Get signer with index
 * @param index Signer index
 * @returns Signer
 */
export async function getSigner(index: number = 0) {
  const signers = await ethers.getSigners();
  if (index >= signers.length) {
    throw new Error(`Signer at index ${index} not found`);
  }
  return signers[index];
}

/**
 * Encrypt value for testing
 * @param instance FHEVM instance
 * @param value Value to encrypt
 * @param type Type of encryption (8, 16, 32, 64)
 * @returns Encrypted value
 */
export async function encryptValue(
  instance: FhevmInstance,
  value: number,
  type: 8 | 16 | 32 | 64 = 32
) {
  if (type === 8) return instance.encrypt8(value);
  if (type === 16) return instance.encrypt16(value);
  if (type === 32) return instance.encrypt32(value);
  if (type === 64) return instance.encrypt64(value);
  throw new Error(`Unknown encryption type: ${type}`);
}

/**
 * Decrypt value for testing
 * @param instance FHEVM instance
 * @param encrypted Encrypted value
 * @returns Decrypted value
 */
export async function decryptValue(instance: FhevmInstance, encrypted: any) {
  return instance.decrypt(encrypted);
}

/**
 * Wait for transaction
 * @param tx Transaction to wait for
 * @returns Transaction receipt
 */
export async function waitForTx(tx: any) {
  return await tx.wait();
}

/**
 * Get contract balance
 * @param contract Contract instance
 * @returns Balance in ETH
 */
export async function getBalance(contract: any) {
  const balance = await ethers.provider.getBalance(contract.address);
  return ethers.utils.formatEther(balance);
}

/**
 * Get gas cost of transaction
 * @param tx Transaction
 * @returns Gas cost in ETH and gwei
 */
export async function getGasCost(tx: any) {
  const receipt = await tx.wait();
  const gasUsed = receipt.gasUsed;
  const gasPrice = tx.gasPrice || receipt.effectiveGasPrice;
  const totalGas = gasUsed.mul(gasPrice);

  return {
    gasUsed: gasUsed.toNumber(),
    gasPrice: gasPrice.toString(),
    totalGas: ethers.utils.formatEther(totalGas),
  };
}

/**
 * Measure operation time
 * @param fn Function to measure
 * @returns Time in milliseconds and result
 */
export async function measureTime(fn: () => Promise<any>) {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { duration, result };
}

/**
 * Assert encrypted value equals expected (after decryption)
 * @param instance FHEVM instance
 * @param encrypted Encrypted value
 * @param expected Expected decrypted value
 * @param message Optional error message
 */
export async function expectEncryptedEqual(
  instance: FhevmInstance,
  encrypted: any,
  expected: number,
  message?: string
) {
  const decrypted = await decryptValue(instance, encrypted);
  if (decrypted !== expected) {
    throw new Error(
      message || `Expected ${expected}, got ${decrypted}`
    );
  }
}

/**
 * Create test data set
 * @returns Object with common test values
 */
export function getTestData() {
  return {
    zero: 0,
    one: 1,
    ten: 10,
    hundred: 100,
    thousand: 1000,
    max8: 255,
    max16: 65535,
    max32: 4294967295,
    negative: -1, // Will be converted to uint on chain
  };
}

/**
 * Setup test environment
 * @returns Object with instance and signers
 */
export async function setupTestEnvironment() {
  const instance = await getFhevmInstance();
  const [owner, addr1, addr2] = await ethers.getSigners();

  return {
    instance,
    owner,
    addr1,
    addr2,
    testData: getTestData(),
  };
}

export default {
  getFhevmInstance,
  deployContract,
  getSigner,
  encryptValue,
  decryptValue,
  waitForTx,
  getBalance,
  getGasCost,
  measureTime,
  expectEncryptedEqual,
  getTestData,
  setupTestEnvironment,
};
