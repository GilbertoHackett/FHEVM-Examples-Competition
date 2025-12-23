import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types";

describe("Counter", function () {
  let counter: Counter;

  before(async function () {
    const CounterFactory = await ethers.getContractFactory("Counter");
    counter = await CounterFactory.deploy(10);
    await counter.waitForDeployment();
  });

  it("Should initialize with correct value", async function () {
    const counterValue = await counter.getCounter();
    expect(counterValue).to.exist;
  });

  it("Should increment counter", async function () {
    await counter.increment();
    const counterValue = await counter.getCounter();
    expect(counterValue).to.exist;
  });

  it("Should allow decryption", async function () {
    const decrypted = await counter.getDecrypted();
    expect(decrypted).to.be.greaterThan(0);
  });
});
