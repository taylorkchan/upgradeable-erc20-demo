// We import Chai to use its asserting functions here.
const { expect } = require("chai");


chai.use(solidity);

describe("WIToken contract", function () {
  let totalSupply = '10000000000000000000000'; // 10000 * 1e18
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const WIToken = await ethers.getContractFactory("WIToken");
    console.log('Deploying Witoken...');
    const token = await upgrades.deployProxy(WIToken, ['WIToken', 'WIT', '100000000000000000000000']);
    await token.deployed();
    console.log("WIToken deployed to:", token.address);
    hardhatToken = token;
    console.log(await hardhatToken.totalSupply());
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      const totalSupply = await hardhatToken.totalSupply();
      console.log("ownerBalance", ownerBalance);
      console.log("totalSupply",totalSupply);
      expect(totalSupply.toString()).to.equal(ownerBalance.toString());
    });
  });

  describe("Transactions", function () {

    it("Should transfer tokens between accounts", async function () {
        const ownerBalance = await hardhatToken.balanceOf(owner.address);

        // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

  });
});