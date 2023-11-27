//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract SecondContract is ERC721Base {
	constructor(
		address _defaultAdmin,
		string memory _name,
		string memory _symbol,
		address _royaltyRecipient,
		uint128 _royaltyBps
	)
		ERC721Base(
			_defaultAdmin,
			_name,
			_symbol,
			_royaltyRecipient,
			_royaltyBps
		)
	{}
}
