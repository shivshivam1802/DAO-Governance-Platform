// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GovernanceToken.sol";
import "./Timelock.sol";
import "./Governor.sol";
import "./Treasury.sol";

contract DAOFactory {
    event DAODeployed(
        string daoName,
        address indexed tokenAddress,
        address indexed timelockAddress,
        address indexed governorAddress,
        address treasuryAddress,
        address creator
    );

    address[] public deployedDAOs;

    function deployDAO(
        string memory daoName,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply,
        uint256 minDelay,
        uint48 votingDelay,
        uint32 votingPeriod,
        uint256 proposalThreshold,
        uint256 quorumFraction
    ) external returns (address, address, address, address) {
        // 1. Deploy Governance Token
        GovernanceToken token = new GovernanceToken(tokenName, tokenSymbol, initialSupply, msg.sender);

        // 2. Deploy Timelock
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);
        Timelock timelock = new Timelock(minDelay, proposers, executors, address(this));

        // 3. Deploy Governor
        GovernorContract governor = new GovernorContract(
            token,
            timelock,
            daoName,
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumFraction
        );

        // 4. Deploy Treasury owned by Timelock
        Treasury treasury = new Treasury(address(timelock));

        // 5. Setup Roles
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        // Governor is the proposer
        timelock.grantRole(proposerRole, address(governor));
        // Anyone can execute (standard OZ Governor setup)
        timelock.grantRole(executorRole, address(0));
        // Grant admin to the timelock itself
        timelock.grantRole(adminRole, address(timelock));
        // Revoke deployer's admin role
        timelock.revokeRole(adminRole, address(this));

        emit DAODeployed(
            daoName,
            address(token),
            address(timelock),
            address(governor),
            address(treasury),
            msg.sender
        );

        return (address(token), address(timelock), address(governor), address(treasury));
    }
}
