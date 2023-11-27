//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract YourContract is ERC20Base {
	// event ReputationAdded(address indexed user, uint256 amount);

	mapping(address => uint256) public reputation;
	mapping(address => uint256) private balances;

	constructor(
		address _defaultAdmin,
		string memory _name,
		string memory _symbol
	) ERC20Base(_defaultAdmin, _name, _symbol) {}

	// Write functions do not return values for testing
	function addReputation(address _user, uint256 _amount) external {
		// require(msg.sender == owner(), "Not authorized");
		// require(_canMint(), "Not authorized to mint.");

		reputation[_user] += _amount;
		// emit ReputationAdded(_user, _amount);
	}

	receive() external payable {}
}
