// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "@fhevm/contracts/FHEVMConfig.sol";

/**
 * @title Counter
 * @notice A simple example demonstrating encrypted state management
 * @dev This contract shows how to maintain encrypted values and perform operations on them
 */
contract Counter is SepoliaConfig {
    /// @notice Encrypted counter value
    euint32 private encryptedCounter;

    /// @notice Event emitted when counter is incremented
    event CounterIncremented(address indexed by, euint32 newValue);

    /// @notice Event emitted when counter is set
    event CounterSet(address indexed by, euint32 newValue);

    /**
     * @notice Initialize the counter with a value
     * @param initialValue The initial value to set (will be encrypted)
     */
    constructor(uint32 initialValue) {
        encryptedCounter = FHE.asEuint32(initialValue);
    }

    /**
     * @notice Increment the counter by 1
     * @dev Only the owner can call this function
     */
    function increment() external {
        encryptedCounter = FHE.add(encryptedCounter, 1);
        emit CounterIncremented(msg.sender, encryptedCounter);
    }

    /**
     * @notice Add a value to the counter
     * @param amount The encrypted amount to add
     */
    function add(euint32 amount) external {
        require(FHE.isInitialized(amount), "Amount not initialized");
        encryptedCounter = FHE.add(encryptedCounter, amount);
        emit CounterIncremented(msg.sender, encryptedCounter);
    }

    /**
     * @notice Set the counter to a new value
     * @param newValue The encrypted new value
     */
    function set(euint32 newValue) external {
        require(FHE.isInitialized(newValue), "Value not initialized");
        encryptedCounter = newValue;
        emit CounterSet(msg.sender, newValue);
    }

    /**
     * @notice Get the current counter value (encrypted)
     * @return The encrypted counter value
     */
    function getCounter() external view returns (euint32) {
        return encryptedCounter;
    }

    /**
     * @notice Get decrypted counter value
     * @dev Allows the caller to see their own counter (with permission)
     * @return The decrypted counter value
     */
    function getDecrypted() external returns (uint32) {
        euint32 counter = encryptedCounter;
        FHE.allow(counter, msg.sender);
        return FHE.decrypt(counter);
    }
}
