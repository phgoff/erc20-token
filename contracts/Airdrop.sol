//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";

contract Airdrop is Ownable {
  using SafeMath for uint256;

  event EtherTransfer(address beneficiary, uint256 amount);

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function dropTokens(
    address _tokenAddr,
    address[] memory _recipients,
    uint256[] memory _amount
  ) public onlyOwner returns (bool) {
    for (uint256 i = 0; i < _recipients.length; i++) {
      require(_recipients[i] != address(0));
      require(
        IERC20(_tokenAddr).transferFrom(msg.sender, _recipients[i], _amount[i])
      );
    }

    return true;
  }

  function dropEther(address[] memory _recipients, uint256[] memory _amount)
    public
    payable
    onlyOwner
    returns (bool)
  {
    require(_recipients.length == _amount.length);

    for (uint256 i = 0; i < _recipients.length; i++) {
      require(_recipients[i] != address(0));
      require(_amount[i] <= msg.value);
      (bool success, ) = payable(_recipients[i]).call{ value: _amount[i] }("");
      require(success, "Failed to send Ether");

      emit EtherTransfer(_recipients[i], _amount[i]);
    }

    return true;
  }

  function withdrawEther(address payable beneficiary) public onlyOwner {
    (bool success, ) = beneficiary.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }
}
