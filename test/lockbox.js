var Lockbox = artifacts.require('Lockbox');

contract('Lockbox', (accounts) => {

  it('has an owner', () => {
    return Lockbox.new().then((instance) => {
      return instance.owner.call().then((ownerAddress) => {
        assert.equal(ownerAddress, accounts[0]);
      });
    });
  });

  it('starts with a 0 balance', () => {
    return Lockbox.new().then((instance) => {
      return instance.balance.call().then((balance) => {
        assert.equal(balance, 0);
      });
    });
  });

  it('starts in the Unlocked state', () => {
    return Lockbox.new().then((instance) => {
      return instance.state.call().then((state) => {
        assert.equal(state.valueOf(), '0');
      });
    });
  });

  it('contract owner can lock the box', () => {
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.lock();
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '1');
    });
  });

  it('public cannot lock the box', () => {
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '0');
      return lockbox.lock({from: accounts[1]});
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '0');
    });
  });

  it('contract owner can unlock the box', () => {
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '0');
      return lockbox.lock()
      ;
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '1');
      return lockbox.unlock();
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '0');
    });
  });

  it('public cannot unlock the box', () => {
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '0');
      return lockbox.lock();
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '1');
      return lockbox.unlock({from: accounts[1]});
    }).then((tx) => {
      return lockbox.state.call();
    }).then((state) => {
      assert.equal(state.valueOf(), '1');
    });
  });

  it('is payable', () => {
    let lockbox;
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.send(web3.toWei(2.5, 'ether'));
    }).then((tx) => {
      return lockbox.balance.call().then((balance) => {
        assert.equal(web3.fromWei(balance, 'ether').valueOf(), '2.5');
      });
    });
  });

  it('sends balance when unlocked', () => {
    let lockbox;
    let initialAccountBalance;
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.send(web3.toWei(2.5, 'ether'));
    }).then((tx) => {
      return lockbox.balance.call();
    }).then((balance) => {
      assert.equal(web3.fromWei(balance, 'ether').valueOf(), '2.5');
      return web3.eth.getBalance(accounts[3]);
    }).then((accountBalance) => {
      initialAccountBalance = accountBalance;
      return lockbox.sendBalance(accounts[3]);
    }).then((tx) => {
      return lockbox.balance.call();
    }).then((contractBalance) => {
      assert.equal(web3.fromWei(contractBalance, 'ether').valueOf(), '0');
      return web3.eth.getBalance(accounts[3]);
    }).then((accountBalance) => {
      let expectedBalance = initialAccountBalance.plus(web3.toWei(2.5, 'ether'));
      assert.equal(accountBalance.valueOf(), expectedBalance.valueOf());
    });
  });

  it('does not send balance when locked', () => {
    let lockbox;
    let initialAccountBalance;
    return Lockbox.new().then((instance) => {
      lockbox = instance;
      return lockbox.send(web3.toWei(2.5, 'ether'));
    }).then((tx) => {
      return lockbox.balance.call();
    }).then((balance) => {
      assert.equal(web3.fromWei(balance, 'ether').valueOf(), '2.5');
      return web3.eth.getBalance(accounts[3]);
    }).then((accountBalance) => {
      initialAccountBalance = accountBalance;
      return lockbox.lock();
    }).then((tx) => {
      return lockbox.sendBalance(accounts[3]);
    }).then((tx) => {
      return lockbox.balance.call();
    }).then((contractBalance) => {
      assert.equal(web3.fromWei(contractBalance, 'ether').valueOf(), '2.5');
      return web3.eth.getBalance(accounts[3]);
    }).then((accountBalance) => {
      assert.equal(accountBalance.valueOf(), initialAccountBalance.valueOf());
    });
  });


});
