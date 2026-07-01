import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking and MultiSig Wallet", function () {
  it("Should test MultiSig Wallet lifecycle", async function () {
    const [owner1, owner2, owner3, recipient] = await ethers.getSigners();

    // Deploy MultiSig
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const wallet = await MultiSigWallet.deploy([owner1.address, owner2.address, owner3.address], 2); // 2 of 3 confirmations

    // Deposit some ETH
    await owner1.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.parseEther("5"),
    });

    expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("5"));

    // Submit transaction to send 2 ETH to recipient
    const submitTx = await wallet.submitTransaction(recipient.address, ethers.parseEther("2"), "0x");
    await submitTx.wait();

    // Verify transaction exists
    const txCount = await wallet.getTransactionCount();
    expect(txCount).to.equal(1);

    const txInfo = await wallet.getTransaction(0);
    expect(txInfo.to).to.equal(recipient.address);
    expect(txInfo.value).to.equal(ethers.parseEther("2"));
    expect(txInfo.executed).to.equal(false);
    expect(txInfo.numConfirmations).to.equal(0);

    // Confirm transaction by owner 1
    await wallet.connect(owner1).confirmTransaction(0);
    expect((await wallet.getTransaction(0)).numConfirmations).to.equal(1);

    // Confirm transaction by owner 2
    await wallet.connect(owner2).confirmTransaction(0);
    expect((await wallet.getTransaction(0)).numConfirmations).to.equal(2);

    // Execute transaction
    const balanceBefore = await ethers.provider.getBalance(recipient.address);
    await wallet.connect(owner1).executeTransaction(0);
    const balanceAfter = await ethers.provider.getBalance(recipient.address);

    expect((await wallet.getTransaction(0)).executed).to.equal(true);
    expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("2"));
  });

  it("Should test Staking with dynamic rewards and voting multipliers", async function () {
    const [owner, staker] = await ethers.getSigners();

    // Deploy Mock/Governance Token first
    const Token = await ethers.getContractFactory("GovernanceToken");
    const token = await Token.deploy("StakingToken", "STK", ethers.parseEther("1000000"), owner.address);

    // Deploy Staking
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(await token.getAddress());

    // Give some tokens to staker and approve Staking contract
    await token.transfer(staker.address, ethers.parseEther("10000"));
    await token.connect(staker).approve(await staking.getAddress(), ethers.parseEther("10000"));

    // Stake 1000 tokens with no lock (0 lockDuration)
    await staking.connect(staker).stake(ethers.parseEther("1000"), 0);

    expect(await staking.getStakesCount(staker.address)).to.equal(1);
    expect(await staking.getVotingPower(staker.address)).to.equal(ethers.parseEther("1000")); // Multiplier is 1.0x

    // Stake 1000 tokens with 180 days lock (multiplier 2.0x)
    await staking.connect(staker).stake(ethers.parseEther("1000"), 180 * 24 * 3600); // 180 days

    expect(await staking.getStakesCount(staker.address)).to.equal(2);
    // Total voting power = 1000 + 2000 = 3000
    expect(await staking.getVotingPower(staker.address)).to.equal(ethers.parseEther("3000"));
  });
});
