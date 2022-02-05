// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");
// const hre = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

const DURATION = 30 * 24 * 60 * 60;
const WAIT = 1 * 24 * 60 * 60;

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("DietChallenge contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let DietChallenge;
  let dietChallengeContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DietChallenge = await ethers.getContractFactory("DietChallenge");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.

    dietChallengeContract = await DietChallenge.deploy(DURATION, WAIT);

    // We can interact with the contract by calling `hardhatToken.method()`
    await dietChallengeContract.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Init values on start", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const [status, isLocked, isRoundOver] =
        await dietChallengeContract.getWorkflowStatus();
      expect(status).to.equal(0);
      expect(isLocked).to.equal(false);
      expect(isRoundOver).to.equal(false);
    });

    it("Should assign owner as the admin", async function () {
      expect(await dietChallengeContract.adminAddress()).to.equal(
        owner.address
      );
    });
  });

  //   Openzeppelin:https://github.com/ConsenSysMesh/openzeppelin-solidity/blob/master/test/crowdsale/Crowdsale.test.js
  describe("Deposit", function () {
    it("Should be able to make deposit to the contract address", async function () {
      expect(await dietChallengeContract.getTotalValueLocked()).to.equal(0);
      await dietChallengeContract.deposit("ipfs://", 5000, {
        value: 10000000000, // gwei
        // from: addr1,
      });

      expect(await dietChallengeContract.getTotalValueLocked()).to.equal(
        10000000000
      );

      expect(await dietChallengeContract.totalValueLocked()).to.equal(
        10000000000
      );
      expect(await dietChallengeContract.totalUsers()).to.equal(1);

      // Only 1 deposit per round is allowed
      await expect(
        dietChallengeContract.deposit("ipfs://", 5000, {
          value: 50,
        })
      ).to.revertedWith("You already made your deposits");
    });

    it("Should accept transfers from multiple users", async function () {
      await dietChallengeContract.deposit("ipfs://", 5000, {
        value: 10000000000, // gwei
      });

      await dietChallengeContract.connect(addr1).deposit("ipfs://", 5000, {
        value: 20000000000,
      });

      await dietChallengeContract.connect(addr2).deposit("ipfs://", 5000, {
        value: 30000000000,
      });

      expect(await dietChallengeContract.getTotalValueLocked()).to.equal(
        60000000000
      );
    });

    it("Should revert if no amount was deposited", async function () {
      await expect(
        dietChallengeContract.deposit("ipfs://", 5000)
      ).to.revertedWith("You must submit an amount");
    });

    it("Should lock funds after all the deposits are made", async function () {
      await dietChallengeContract.deposit("ipfs://", 5000, {
        value: 10000000000, // gwei
      });

      expect(await dietChallengeContract.isLocked()).to.equal(false);
      expect(await dietChallengeContract.isRoundOver()).to.equal(false);

      await dietChallengeContract.freezeFunds();

      const [status, isLocked, isRoundOver] =
        await dietChallengeContract.getWorkflowStatus();
      expect(status).to.equal(1);
      expect(isLocked).to.equal(true);
      expect(isRoundOver).to.equal(false);

      await expect(
        dietChallengeContract.connect(addr1).deposit("ipfs://", 5000, {
          value: 20000000000,
        })
      ).to.revertedWith("NOT_ELIGIBLE_TO_DEPOSIT");
    });
  });

  describe("Submit Result", function () {
    it("User must wait until the due date to submit a result", async function () {
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });
      await dietChallengeContract.freezeFunds();
      await expect(
        dietChallengeContract.submitResult("ipfs://after", 4900)
      ).to.revertedWith("You must wait until the due date to submit a result");
    });

    it("Once the due date is over, user can submit a result", async function () {
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });

      await dietChallengeContract.freezeFunds();

      const dueDate = await dietChallengeContract.dueDate(); // block timestamp + 30 days
      const latestBlock = await ethers.provider.getBlock("latest");
      const diff = dueDate - latestBlock.timestamp;
      await ethers.provider.send("evm_increaseTime", [diff + 1]); // fast forward

      await dietChallengeContract.submitResult("ipfs://after", 4900);
      const userInfo = await dietChallengeContract.tvlByUser(owner.address);
      expect(userInfo[0]).to.equal(owner.address);
      expect(userInfo[1][0]).to.equal(5000); // weight multiplied by 100 to account up to 2 decimal points
      expect(userInfo[1][1]).to.equal("ipfs://before");
      expect(userInfo[2][0]).to.equal(4900);
      expect(userInfo[2][1]).to.equal("ipfs://after");
      expect(userInfo[3]).to.equal(10000000000);
      expect(userInfo[4]).to.equal(true);
    });

    it("Should mark reached as false if user has not met the goal", async function () {
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });
      await dietChallengeContract.freezeFunds();
      const dueDate = await dietChallengeContract.dueDate(); // block timestamp + 30 days
      const latestBlock = await ethers.provider.getBlock("latest");
      const diff = dueDate - latestBlock.timestamp;
      await ethers.provider.send("evm_increaseTime", [diff + 1]); // fast forward

      await dietChallengeContract.submitResult("ipfs://after", 5001);
      const userInfo = await dietChallengeContract.tvlByUser(owner.address);
      expect(userInfo[0]).to.equal(owner.address);
      expect(userInfo[1][0]).to.equal(5000);
      expect(userInfo[1][1]).to.equal("ipfs://before");
      expect(userInfo[2][0]).to.equal(5001);
      expect(userInfo[2][1]).to.equal("ipfs://after");
      expect(userInfo[3]).to.equal(10000000000);
      expect(userInfo[4]).to.equal(false);
    });
  });
  describe("Withdraw", function () {
    beforeEach(async function () {
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });
      await dietChallengeContract.connect(addr1).deposit("ipfs://", 5000, {
        value: 20000000000,
      });
      await dietChallengeContract.connect(addr2).deposit("ipfs://", 5000, {
        value: 30000000000,
      });
      await dietChallengeContract.freezeFunds();
      const dueDate = await dietChallengeContract.dueDate(); // block timestamp + 30 days
      const latestBlock = await ethers.provider.getBlock("latest");
      const diff = dueDate - latestBlock.timestamp;
      await ethers.provider.send("evm_increaseTime", [diff]); // fast forward the block timestamp
      await ethers.provider.send("evm_mine", []); // force mine the next block
    });

    it("Admin must release funds for users to claim their winnings", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 4999); // success
      await dietChallengeContract
        .connect(addr1)
        .submitResult("ipfs://after", 6000); // fail
      await dietChallengeContract
        .connect(addr2)
        .submitResult("ipfs://after", 4600); // success
      await expect(dietChallengeContract.withdraw()).to.revertedWith(
        "NOT_ELIGITBLE_TO_WITHDRAW"
      );
      // Admin must wait for the wait period to release funds
      await ethers.provider.send("evm_increaseTime", [WAIT + 1]); // fast forward the block timestamp
      await dietChallengeContract.releaseFunds();
      await expect(dietChallengeContract.withdraw())
        .to.emit(dietChallengeContract, "WithdrawCreated")
        .withArgs(30000000000, 30000000000);
    });

    it("If 2 days (wait period) have passed since the end of the game, users can claim their winnings", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 4999); // success

      await ethers.provider.send("evm_increaseTime", [WAIT + 1]); // fast forward the block timestamp
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute

      // all the winnings claimed by 1 user who submitted the result
      expect(await dietChallengeContract.winningAmount()).to.equal(60000000000);
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.withdraw();
      expect(await dietChallengeContract.totalValueLocked()).to.equal(0); // Remaining after withdrawal

      await expect(
        dietChallengeContract.connect(addr1).withdraw()
      ).to.revertedWith("You are not eligible for withdraw");
    });

    it("When funds are released, DIET_CHALLENGE_ENDED event is emitted", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 4999); // success
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute
      await dietChallengeContract.withdraw();
      const [status, isLocked, isRoundOver] =
        await dietChallengeContract.getWorkflowStatus();
      expect(status).to.equal(2);
      expect(isLocked).to.equal(false);
      expect(isRoundOver).to.equal(true);
    });

    it("If no user has won, the funds are saved for the next round", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 5001); // fail
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute

      const tvl = await dietChallengeContract.totalValueLocked();
      expect(await dietChallengeContract.winningAmount()).to.equal(tvl);
      expect(await dietChallengeContract.totalWinners()).to.equal(0);
      expect(await dietChallengeContract.totalResultsSubmitted()).to.equal(1);
      expect(await dietChallengeContract.totalUsers()).to.equal(3);

      await dietChallengeContract.restart();
      expect(await dietChallengeContract.totalValueLocked()).to.equal(tvl);
    });

    it("Winner cannot withdraw more than once", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 4990); // pass
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute

      const tvl = await dietChallengeContract.totalValueLocked();
      expect(await dietChallengeContract.totalWinners()).to.equal(1);

      await dietChallengeContract.withdraw();
      await expect(dietChallengeContract.withdraw()).to.revertedWith(
        "You have already made your withdrawal"
      );
    });

    it("Admin can withdraw all the funds", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 5001); // fail
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute

      expect(await dietChallengeContract.totalValueLocked()).to.equal(
        60000000000
      );
      await dietChallengeContract.withdrawAll();
      expect(await dietChallengeContract.totalValueLocked()).to.equal(0);
    });

    it("If there is no more funds left, attempts to withdraw should return an error", async function () {
      await dietChallengeContract.submitResult("ipfs://after", 4999); // pass
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute
      await dietChallengeContract.withdrawAll();

      await expect(dietChallengeContract.withdraw()).to.revertedWith(
        "There is no funds left to claim"
      );
    });
  });

  describe("Restart", function () {
    it("Should reset user goals and addresses, but keep the total value locked leftover from the previous round", async function () {
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });
      await dietChallengeContract.connect(addr1).deposit("ipfs://", 5000, {
        value: 20000000000,
      });
      await dietChallengeContract.connect(addr2).deposit("ipfs://", 5000, {
        value: 30000000000,
      });
      await dietChallengeContract.freezeFunds();
      const dueDate = await dietChallengeContract.dueDate(); // block timestamp + 30 days
      const latestBlock = await ethers.provider.getBlock("latest");
      const diff = dueDate - latestBlock.timestamp;
      await ethers.provider.send("evm_increaseTime", [diff]); // fast forward the block timestamp
      await ethers.provider.send("evm_mine", []); // force mine the next block

      // submit results
      await dietChallengeContract.submitResult("ipfs://after", 5001); // fail
      await ethers.provider.send("evm_increaseTime", [WAIT]); // 2 days pass
      await dietChallengeContract.releaseFunds(); // This calculates assets to distribute

      // no one withdrew their winnings
      expect(await dietChallengeContract.totalValueLocked()).to.equal(
        60000000000
      );

      await dietChallengeContract.restart();
      expect(await dietChallengeContract.totalUsers()).to.equal(0);
      expect(await dietChallengeContract.totalResultsSubmitted()).to.equal(0);
      expect(await dietChallengeContract.totalWinners()).to.equal(0);
      expect(await dietChallengeContract.winningAmount()).to.equal(0);
      expect(await dietChallengeContract.dueDate()).to.equal(0);
      expect(await dietChallengeContract.totalValueLocked()).to.equal(
        60000000000
      );
      await dietChallengeContract.deposit("ipfs://before", 5000, {
        value: 10000000000, // gwei
      });

      const [status, isLocked, isRoundOver] =
        await dietChallengeContract.getWorkflowStatus();
      expect(status).to.equal(0);
      expect(isLocked).to.equal(false);
      expect(isRoundOver).to.equal(false);
    });
  });
});
