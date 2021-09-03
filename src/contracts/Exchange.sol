// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract Exchange {
  address public feeAccount;
  uint256 public feePercent;
  mapping(address => mapping(address => uint256)) public tokens;
  address constant ETHER = address(0);

  event Deposit(address token, address user, uint256 amount, uint256 balance);
  event Withdraw(address token, address user, uint amount, uint balance);

  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  fallback() external {
    revert();
  }

  function depositEther() public payable {
    tokens[ETHER][msg.sender] += msg.value;
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  function withdrawEther(uint _amount) public {
    require(tokens[ETHER][msg.sender] >= _amount);
    tokens[ETHER][msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
    emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }

  function depositToken(address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] += _amount;
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
}