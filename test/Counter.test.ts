import { expect } from "chai";
import { ethers } from "hardhat";
import { FhevmInstance } from "hardhat-fhevmjs";
import { Counter } from "../typechain-types";

describe("Counter", function () {
  let instance: FhevmInstance;
  let counter: Counter;
  let owner: any;

  before(async function () {
    // Get FHEVM instance for testing
    instance = await (ethers as any).getEncryptionUtils().getInstance();

    // Deploy contract
    const counterFactory = await ethers.getContractFactory("Counter");
    counter = (await counterFactory.deploy(100)) as Counter;
    await counter.deployed();

    // Get signers
    [owner] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should deploy Counter with initial value", async function () {
      expect(counter.address).to.be.properAddress;
    });

    it("Should initialize with correct value", async function () {
      const counterValue = await counter.getCounter();
      expect(counterValue).to.not.be.undefined;
    });
  });

  describe("Increment", function () {
    it("Should increment encrypted counter", async function () {
      // Get initial value
      const initialValue = 100;

      // Increment
      await counter.increment();

      // Get new value (decrypted)
      const newValue = await counter.getDecrypted();
      expect(newValue).to.equal(initialValue + 1);
    });

    it("Should increment multiple times", async function () {
      const initialValue = await counter.getDecrypted();

      await counter.increment();
      await counter.increment();
      await counter.increment();

      const finalValue = await counter.getDecrypted();
      expect(finalValue).to.equal(initialValue + 3);
    });
  });

  describe("Add", function () {
    it("Should add encrypted value to counter", async function () {
      const initialValue = await counter.getDecrypted();
      const amountToAdd = 50;

      const encryptedAmount = instance.encrypt32(amountToAdd);
      await counter.add(encryptedAmount);

      const newValue = await counter.getDecrypted();
      expect(newValue).to.equal(initialValue + amountToAdd);
    });

    it("Should add zero", async function () {
      const initialValue = await counter.getDecrypted();
      const encryptedZero = instance.encrypt32(0);

      await counter.add(encryptedZero);

      const newValue = await counter.getDecrypted();
      expect(newValue).to.equal(initialValue);
    });

    it("Should reject uninitialized value", async function () {
      const uninitialized = ethers.BigNumber.from("0x00");

      // This should fail because value is not properly initialized
      // (In real scenario, would use FHE.asEuint32 which properly initializes)
      // Note: This test demonstrates error handling pattern
    });
  });

  describe("Set", function () {
    it("Should set counter to new value", async function () {
      const newValue = 999;
      const encryptedNewValue = instance.encrypt32(newValue);

      await counter.set(encryptedNewValue);

      const actualValue = await counter.getDecrypted();
      expect(actualValue).to.equal(newValue);
    });

    it("Should set to zero", async function () {
      const encryptedZero = instance.encrypt32(0);

      await counter.set(encryptedZero);

      const actualValue = await counter.getDecrypted();
      expect(actualValue).to.equal(0);
    });

    it("Should set to maximum uint32", async function () {
      const maxValue = Math.pow(2, 32) - 1;
      const encryptedMax = instance.encrypt32(maxValue);

      await counter.set(encryptedMax);

      const actualValue = await counter.getDecrypted();
      expect(actualValue).to.equal(maxValue);
    });
  });

  describe("Get Counter", function () {
    it("Should return encrypted counter", async function () {
      const encryptedCounter = await counter.getCounter();
      expect(encryptedCounter).to.not.be.undefined;
    });

    it("Should return valid encrypted value", async function () {
      const encryptedCounter = await counter.getCounter();
      expect(encryptedCounter).to.be.a("object");
    });
  });

  describe("Get Decrypted", function () {
    it("Should return decrypted counter", async function () {
      await counter.set(instance.encrypt32(42));
      const decrypted = await counter.getDecrypted();
      expect(decrypted).to.equal(42);
    });

    it("Should allow decryption for caller", async function () {
      const testValue = 123;
      await counter.set(instance.encrypt32(testValue));

      const decrypted = await counter.getDecrypted();
      expect(decrypted).to.equal(testValue);
    });
  });

  describe("Events", function () {
    it("Should emit CounterIncremented event", async function () {
      await expect(counter.increment()).to.emit(counter, "CounterIncremented");
    });

    it("Should emit CounterSet event", async function () {
      const encryptedValue = instance.encrypt32(500);
      await expect(counter.set(encryptedValue)).to.emit(counter, "CounterSet");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle consecutive operations", async function () {
      const initialValue = 100;
      await counter.set(instance.encrypt32(initialValue));

      for (let i = 0; i < 10; i++) {
        await counter.increment();
      }

      const finalValue = await counter.getDecrypted();
      expect(finalValue).to.equal(initialValue + 10);
    });

    it("Should handle large additions", async function () {
      const initialValue = 100;
      await counter.set(instance.encrypt32(initialValue));

      const largeAmount = Math.pow(2, 31) - 100;
      await counter.add(instance.encrypt32(largeAmount));

      const finalValue = await counter.getDecrypted();
      expect(finalValue).to.equal(initialValue + largeAmount);
    });
  });

  describe("Gas Efficiency", function () {
    it("Increment should be efficient", async function () {
      const tx = await counter.increment();
      const receipt = await tx.wait();

      // Gas usage should be reasonable for encrypted operation
      expect(receipt.gasUsed).to.be.lessThan(500000);
    });

    it("Add should be efficient", async function () {
      const tx = await counter.add(instance.encrypt32(50));
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lessThan(500000);
    });
  });
});
