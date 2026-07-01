// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Treasury is Ownable, ERC721Holder, ReentrancyGuard {
    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed token, address indexed to, uint256 amount);
    event NFTWithdraw(address indexed nftContract, address indexed to, uint256 tokenId);
    event BudgetCreated(bytes32 indexed budgetId, address indexed manager, uint256 amount, uint256 interval);
    event BudgetSpent(bytes32 indexed budgetId, uint256 amount);

    struct Budget {
        address manager;
        uint256 totalAllocated;
        uint256 spent;
        uint256 interval;
        uint256 lastReset;
    }

    mapping(bytes32 => Budget) public budgets;

    constructor(address _governanceTimelock) Ownable(_governanceTimelock) {}

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawETH(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        to.transfer(amount);
        emit Withdraw(address(0), to, amount);
    }

    function withdrawERC20(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient token balance");
        require(IERC20(token).transfer(to, amount), "Transfer failed");
        emit Withdraw(token, to, amount);
    }

    function withdrawNFT(address nftContract, address to, uint256 tokenId) external onlyOwner nonReentrant {
        IERC721(nftContract).safeTransferFrom(address(this), to, tokenId);
        emit NFTWithdraw(nftContract, to, tokenId);
    }

    // Budget Management
    function createBudget(
        bytes32 budgetId,
        address manager,
        uint256 amount,
        uint256 interval
    ) external onlyOwner {
        budgets[budgetId] = Budget({
            manager: manager,
            totalAllocated: amount,
            spent: 0,
            interval: interval,
            lastReset: block.timestamp
        });
        emit BudgetCreated(budgetId, manager, amount, interval);
    }

    function executeBudgetSpend(bytes32 budgetId, address payable to, uint256 amount) external nonReentrant {
        Budget storage budget = budgets[budgetId];
        require(msg.sender == budget.manager, "Only budget manager can spend");
        
        if (block.timestamp >= budget.lastReset + budget.interval) {
            budget.spent = 0;
            budget.lastReset = block.timestamp;
        }

        require(budget.spent + amount <= budget.totalAllocated, "Budget allocation exceeded");
        require(address(this).balance >= amount, "Insufficient ETH in treasury");

        budget.spent += amount;
        to.transfer(amount);

        emit BudgetSpent(budgetId, amount);
    }
}
