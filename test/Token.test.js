import { EVM_REVERT, tokens } from './helers';

const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', ([deployer, receiver, exchange]) => {
  const name = "Berry Token";
  const symbol = "BERRY";
  const decimals = '18';
  const totalSupply = tokens(1000000).toString();
  let token;
 
  beforeEach(async () => {
    token = await Token.new();
  })

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name();
      result.should.equal(name);
    })

    it('tracks the symbol', async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    })
    
    it('tracks the decimals', async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    })
    
    it('tracks the total supply', async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply);
    })

    it('assigns total supply to the deployer', async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply);
    })
  })

  describe('sending tokens', () => {
    describe('success', () => {
      let result;
      let amount;
      let deployerBalance;
      let receiverBalance;

      beforeEach(async () => {
        deployerBalance = await token.balanceOf(deployer);
        receiverBalance = await token.balanceOf(receiver);
        amount = tokens(10);
        result = await token.transfer(receiver, amount, { from: deployer });
      })

      it('able to transfer tokens', async () => {
        const deployerBalanceAfterTransfer = await token.balanceOf(deployer);
        const receiverBalanceAfterTransfer = await token.balanceOf(receiver);
  
        deployerBalanceAfterTransfer.toString().should.equal(deployerBalance.sub(amount).toString());
        receiverBalanceAfterTransfer.toString().should.equal(receiverBalance.add(amount).toString());
      })
  
      it('emits a transfer event', async () => {
        const log = result.logs[0];
        const event = log.args;
        log.event.should.equal('Transfer');
        event._from.toString().should.equal(deployer, 'from is correct');
        event._to.toString().should.equal(receiver, 'to is correct');
        event._value.toString().should.equal(amount.toString(), 'value is correct');
      })
    })

    describe('failure', () => {
      it('rejects insufficient balances', async () => {
        let invalidAmount;
        invalidAmount = tokens(100000000);
        await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
        invalidAmount = tokens(10);
        await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
      })

      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, tokens(10), { from: deployer }).should.be.rejected
      })
    })
  })

  describe('approving tokens', () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokens(100);
      result = await token.approve(exchange, amount, { from: deployer });
    })

    describe('success', () => {
      it('allocates an allowance for delegated token spending on exchange', async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal(amount.toString());
      })

      it('emits an approval event', async () => {
        const log = result.logs[0];
        const event = log.args;
        log.event.should.equal('Approval');
        event._owner.toString().should.equal(deployer, 'owner is correct');
        event._spender.toString().should.equal(exchange, 'spender is correct');
        event._value.toString().should.equal(amount.toString(), 'value is correct');
      })
    })

    describe('failure', () => {
      it('rejects invalid spender', async () => {
        await token.approve(0x0, amount, { from: deployer }).should.be.rejected
      })
    })
  })

  describe('sending tokens from', () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokens(100);
      await token.approve(exchange, amount, { from: deployer });
    })

    describe('success', () => {
      let deployerBalance;
      let receiverBalance;

      beforeEach(async () => {
        deployerBalance = await token.balanceOf(deployer);
        receiverBalance = await token.balanceOf(receiver);
        result = await token.transferFrom(deployer, receiver, amount, { from: exchange });
      })

      it('able to transfer tokens', async () => {
        const deployerBalanceAfterTransfer = await token.balanceOf(deployer);
        const receiverBalanceAfterTransfer = await token.balanceOf(receiver);
  
        deployerBalanceAfterTransfer.toString().should.equal(deployerBalance.sub(amount).toString());
        receiverBalanceAfterTransfer.toString().should.equal(receiverBalance.add(amount).toString());
      })
  
      it('emits a transfer event', async () => {
        const log = result.logs[0];
        const event = log.args;
        log.event.should.equal('Transfer');
        event._from.toString().should.equal(deployer, 'from is correct');
        event._to.toString().should.equal(receiver, 'to is correct');
        event._value.toString().should.equal(amount.toString(), 'value is correct');
      })
    })

    describe('failure', () => {
      it('rejects insufficient amounts', async () => {
        const invalidAmount = tokens(100000000);
        await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT);
      })

      it('rejects invalid recipients', async () => {
        await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
      })
    })
  })
})
