import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;

  let yourContract: YourContract;
  before(async () => {
    [owner, alice] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(owner.address, "Token", "TKN")) as YourContract;
    await yourContract.deployed();
  });

  describe("addReputation", () => {
    it("Should add reputation to the specified address", async function () {
      const tx = await yourContract.addReputation(alice.address, 100);

      await expect(tx).to.emit(yourContract, "ReputationAdded").withArgs(alice.address, 100);

      // await inside when requires comparing returned value
      expect(await yourContract.reputation(alice.address)).to.equal(100);
    });

    // await outside when expecting write to fail
    it("Should not add reputation to the owner's address", async function () {
      await expect(yourContract.connect(alice).addReputation(owner.address, 100)).to.be.revertedWith("Not authorized");
    });
  });
});
