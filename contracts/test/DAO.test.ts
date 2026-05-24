import { expect } from "chai";
import { ethers } from "hardhat";
import { mine, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DAO Governance Platform Integration", function () {
  it("Should deploy DAO and execute a proposal through Governor and Timelock", async function () {
    const [owner, proposer, voter, treasuryRecipient] = await ethers.getSigners();

    // 1. Deploy Factory
    const DAOFactory = await ethers.getContractFactory("DAOFactory");
    const factory = await DAOFactory.deploy();

    // 2. Deploy DAO from factory
    const tx = await factory.deployDAO(
      "MyDAO",
      "MyToken",
      "MTK",
      ethers.parseEther("1000000"),
      3600, // minDelay = 1 hour
      1, // votingDelay = 1 block
      10, // votingPeriod = 10 blocks
      ethers.parseEther("1000"), // threshold = 1000 tokens
      4 // quorum = 4%
    );
    const receipt = await tx.wait();
    
    // Parse DAODeployed event
    const event = receipt?.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((e) => e && e.name === "DAODeployed");

    expect(event).to.not.be.undefined;
    const { tokenAddress, timelockAddress, governorAddress, treasuryAddress } = event!.args;

    // 3. Connect to instances
    const token = await ethers.getContractAt("GovernanceToken", tokenAddress);
    const governor = await ethers.getContractAt("GovernorContract", governorAddress);
    const timelock = await ethers.getContractAt("Timelock", timelockAddress);
    const treasury = await ethers.getContractAt("Treasury", treasuryAddress);

    // 4. Delegate to self to activate voting power
    await token.delegate(owner.address);
    const initialPower = await token.getVotes(owner.address);
    expect(initialPower).to.equal(ethers.parseEther("1000000"));

    // Send some ETH to Treasury to test withdraw proposal
    await owner.sendTransaction({
      to: treasuryAddress,
      value: ethers.parseEther("10"),
    });
    expect(await ethers.provider.getBalance(treasuryAddress)).to.equal(ethers.parseEther("10"));

    // 5. Create a proposal to withdraw 2 ETH from Treasury to recipient
    const calldata = treasury.interface.encodeFunctionData("withdrawETH", [
      treasuryRecipient.address,
      ethers.parseEther("2"),
    ]);

    const proposalDescription = "Proposal #1: Withdraw 2 ETH for project funding";
    const descriptionHash = ethers.id(proposalDescription);

    const proposeTx = await governor.propose(
      [treasuryAddress],
      [0],
      [calldata],
      proposalDescription
    );
    const proposeReceipt = await proposeTx.wait();
    
    const proposeEvent = proposeReceipt?.logs
      .map((log) => {
        try {
          return governor.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((e) => e && e.name === "ProposalCreated");

    expect(proposeEvent).to.not.be.undefined;
    const proposalId = proposeEvent!.args.proposalId;

    // Wait voting delay (1 block) + 1 extra block to exceed snapshot
    await mine(2);

    // Verify Proposal State: 1 = Active
    expect(await governor.state(proposalId)).to.equal(1);

    // 6. Cast Vote: 1 = For, 0 = Against, 2 = Abstain
    await governor.castVote(proposalId, 1);

    // Wait voting period (10 blocks) to finish voting
    await mine(10);

    // Verify Proposal State: 4 = Succeeded
    expect(await governor.state(proposalId)).to.equal(4);

    // 7. Queue Proposal (since there is a Timelock)
    await governor.queue([treasuryAddress], [0], [calldata], descriptionHash);

    // Verify State: 5 = Queued
    expect(await governor.state(proposalId)).to.equal(5);

    // Advance time by 1 hour + mine block to satisfy Timelock delay
    await time.increase(3600);
    await mine(1);

    // 8. Execute Proposal
    const balanceBefore = await ethers.provider.getBalance(treasuryRecipient.address);
    
    await governor.execute([treasuryAddress], [0], [calldata], descriptionHash);

    // Verify State: 7 = Executed
    expect(await governor.state(proposalId)).to.equal(7);

    // Verify Treasury Balance changes
    expect(await ethers.provider.getBalance(treasuryAddress)).to.equal(ethers.parseEther("8"));
    const balanceAfter = await ethers.provider.getBalance(treasuryRecipient.address);
    expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("2"));
  });
});
