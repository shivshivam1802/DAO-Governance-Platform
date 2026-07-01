// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
        uint256 lastClaimTime;
        bool active;
    }

    // lockDuration => multiplier (in basis points, e.g. 12000 = 1.2x)
    mapping(uint256 => uint256) public votingMultipliers;
    // lockDuration => APY (in basis points, e.g. 1000 = 10% APY)
    mapping(uint256 => uint256) public apys;

    mapping(address => Stake[]) public userStakes;

    event Staked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 lockDuration);
    event Withdrawn(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 penalty);
    event RewardClaimed(address indexed user, uint256 indexed stakeId, uint256 amount);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);

        // Standard multipliers (in bps, e.g., 10000 = 1.0x)
        votingMultipliers[0] = 10000;       // No lock
        votingMultipliers[30 days] = 12000; // 1.2x
        votingMultipliers[90 days] = 15000; // 1.5x
        votingMultipliers[180 days] = 20000;// 2.0x

        // Standard APYs (in bps, e.g., 500 = 5% APY)
        apys[0] = 500;
        apys[30 days] = 800;
        apys[90 days] = 1200;
        apys[180 days] = 2000;
    }

    function stake(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(votingMultipliers[lockDuration] > 0, "Invalid lock duration");

        stakingToken.transferFrom(msg.sender, address(this), amount);

        userStakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lockDuration: lockDuration,
            lastClaimTime: block.timestamp,
            active: true
        }));

        emit Staked(msg.sender, userStakes[msg.sender].length - 1, amount, lockDuration);
    }

    function claimReward(uint256 stakeId) public nonReentrant {
        require(stakeId < userStakes[msg.sender].length, "Stake does not exist");
        Stake storage userStake = userStakes[msg.sender][stakeId];
        require(userStake.active, "Stake is not active");

        uint256 reward = calculateReward(msg.sender, stakeId);
        if (reward > 0) {
            userStake.lastClaimTime = block.timestamp;
            stakingToken.transfer(msg.sender, reward);
            emit RewardClaimed(msg.sender, stakeId, reward);
        }
    }

    function withdraw(uint256 stakeId) external nonReentrant {
        require(stakeId < userStakes[msg.sender].length, "Stake does not exist");
        Stake storage userStake = userStakes[msg.sender][stakeId];
        require(userStake.active, "Stake already withdrawn");

        // Calculate and transfer outstanding reward first
        uint256 reward = calculateReward(msg.sender, stakeId);
        userStake.active = false;

        uint256 lockEndTime = userStake.startTime + userStake.lockDuration;
        uint256 amountToWithdraw = userStake.amount;
        uint256 penalty = 0;

        if (block.timestamp < lockEndTime) {
            // Early withdrawal penalty: 10% of staked amount
            penalty = (userStake.amount * 10) / 100;
            amountToWithdraw -= penalty;
        }

        if (reward > 0) {
            stakingToken.transfer(msg.sender, reward);
            emit RewardClaimed(msg.sender, stakeId, reward);
        }

        stakingToken.transfer(msg.sender, amountToWithdraw);
        if (penalty > 0) {
            // Send penalty back to owner/treasury or burn it
            stakingToken.transfer(owner(), penalty);
        }

        emit Withdrawn(msg.sender, stakeId, userStake.amount, penalty);
    }

    function calculateReward(address user, uint256 stakeId) public view returns (uint256) {
        Stake memory userStake = userStakes[user][stakeId];
        if (!userStake.active) return 0;

        uint256 duration = block.timestamp - userStake.lastClaimTime;
        uint256 apy = apys[userStake.lockDuration];

        // Reward = Amount * APY * duration / (365 days * 10000)
        return (userStake.amount * apy * duration) / (365 days * 10000);
    }

    function getVotingPower(address user) external view returns (uint256) {
        uint256 totalPower = 0;
        uint256 stakeCount = userStakes[user].length;

        for (uint256 i = 0; i < stakeCount; i++) {
            Stake memory userStake = userStakes[user][i];
            if (userStake.active) {
                uint256 multiplier = votingMultipliers[userStake.lockDuration];
                totalPower += (userStake.amount * multiplier) / 10000;
            }
        }
        return totalPower;
    }

    function getStakesCount(address user) external view returns (uint256) {
        return userStakes[user].length;
    }
}
