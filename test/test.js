const { expect } = require("chai");
const { ethers } = require("hardhat");

let Concord;
let concord;
let discordBot;
let bob;
let alice;
let francis;

beforeEach(async function () {
  [discordBot, bob, alice, francis] = await ethers.getSigners();
});

describe("Deployment", function () {

  it("Should deploy Concord.sol", async function () {
    Concord = await ethers.getContractFactory("Concord");
    concord = await Concord.deploy(discordBot.address, bob.address, {value: ethers.utils.parseEther("1")});
    expect(await concord.owner()).to.equal(discordBot.address);
  });

});

describe("Interactions", function () {

  it("Alice gives 1 ETH to the contract", async function () {
    const giveCall = await concord.connect(alice).give({value: ethers.utils.parseEther("1")});
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("2"));
  });

  it("Concord executes Bob's proposal", async function () {
    const call = await concord.executeProposal(bob.address, ethers.utils.parseEther("0.01"), "Pay my lawyer");
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("1.99"));
  });

  it("Concord registers Alice as a new member", async function () {
    const call = await concord.connect(discordBot).register(alice.address);
    expect(await concord.balanceOf(concord.address)).to.equal(ethers.utils.parseEther("400"));
  });

  it("Bob withdraws his tokens", async function () {
    const call = await concord.connect(discordBot).withdraw(0, ethers.utils.parseEther("200"));
    expect(await concord.balanceOf(bob.address)).to.equal(ethers.utils.parseEther("200"));
  });

  it("Alice sends 10 units to Bob ", async function () {
    const call = await concord.connect(discordBot).tip(1, 0, ethers.utils.parseEther("20"));
    const aliceBal = await concord.users(1);
    const aliceBalFormatted = aliceBal.bal.toString();
    expect(aliceBalFormatted).to.equal(ethers.utils.parseEther("180"));
  });

  it("Alice claims 300 units", async function () {
    const call = await concord.claim(alice.address, ethers.utils.parseEther("300"), "1 week of community management");
    expect(await concord.balanceOf(alice.address)).to.equal(ethers.utils.parseEther("301"));
  });

  it("Francis sends 100 MATIC to the DAO and topups his account", async function () {
    const give = await concord.connect(francis).give({value: ethers.utils.parseEther("100")});
    const topup = await concord.topup(2, francis.address, ethers.utils.parseEther("1"));
    const francisBal = await concord.users(2);
    const francisBalFormatted = francisBal.bal.toString();
    expect(francisBalFormatted).to.equal(ethers.utils.parseEther("1"));
  });


});
