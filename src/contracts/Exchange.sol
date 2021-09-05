// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";
import "./Ownable.sol";

contract Exchange is Ownable {
  address public feeAccount;
  uint public feePercent;
  uint public ordersCount = 0;
  address constant ETHER = address(0);
  mapping(address => mapping(address => uint)) public tokens;
  mapping(uint => _Order) public orders;
  mapping(uint => bool) public orderCancelled;
  mapping(uint => bool) public orderFilled;

  event Deposit(address token, address user, uint amount, uint balance);
  event Withdraw(address token, address user, uint amount, uint balance);
  event Order(
    address user,
    address tokenGet,
    address tokenGive,
    uint id,
    uint amountGet,
    uint amountGive,
    uint timestamp
  );
  event Cancel(
    address user,
    address tokenGet,
    address tokenGive,
    uint id,
    uint amountGet,
    uint amountGive,
    uint timestamp
  );
  event Trade(
    address user,
    address tokenGet,
    address tokenGive,
    address userFill,
    uint id,
    uint amountGet,
    uint amountGive,
    uint timestamp
  );
  
  struct _Order {
    address user;
    address tokenGet;
    address tokenGive;
    uint id;
    uint amountGet;
    uint amountGive;
    uint timestamp;
  }

  constructor(address _feeAccount, uint _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  fallback() external {
    revert();
  }

  function kill() public onlyOwner {
    selfdestruct(owner());
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

  function depositToken(address _token, uint _amount) public {
    require(_token != ETHER);
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] += _amount;
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function withdrawToken(address _token, uint _amount) public {
    require(_token != ETHER);
    require(tokens[_token][msg.sender] >= _amount);
    require(Token(_token).transfer(msg.sender, _amount));
    tokens[_token][msg.sender] -= _amount;
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function balanceOf(address _token, address _user) public view returns(uint) {
    return tokens[_token][_user];
  }

  function makeOrder(address _tokenGet, uint _amountGet, address _tokenGive, uint _amountGive) public {
    ordersCount++;
    orders[ordersCount] = _Order(msg.sender, _tokenGet, _tokenGive, ordersCount, _amountGet, _amountGive, block.timestamp);
    emit Order(msg.sender, _tokenGet, _tokenGive, ordersCount, _amountGet, _amountGive, block.timestamp);
  }

  function cancelOrder(uint _id) public {
    _Order storage _order = orders[_id];
    require(msg.sender == address(_order.user));
    require(_order.id == _id);
    orderCancelled[_id] = true;
    emit Cancel(msg.sender, _order.tokenGet, _order.tokenGive, _order.id, _order.amountGet, _order.amountGive, block.timestamp);
  }

  function fillOrder(uint _id) public {
    require(_id > 0 && _id <= ordersCount);
    require(!orderCancelled[_id]);
    require(!orderFilled[_id]);
    _Order storage _order = orders[_id];
    _trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
    orderFilled[_id] = true;
  }

  function _trade(uint _orderId, address _user, address _tokenGet, uint _amountGet, address _tokenGive, uint _amountGive) internal {
    uint _feeAmount = _amountGive * feePercent / 100;

    tokens[_tokenGet][msg.sender] -= _amountGet + _feeAmount;
    tokens[_tokenGet][_user] += _amountGet;
    tokens[_tokenGet][feeAccount] += _feeAmount;
    tokens[_tokenGive][_user] -= _amountGive;
    tokens[_tokenGive][msg.sender] += _amountGive;

    emit Trade(_user, _tokenGet, _tokenGive, msg.sender, _orderId, _amountGet, _amountGive, block.timestamp);
  }
}