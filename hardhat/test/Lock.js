const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");
const ethers = require("ethers");

describe("CreateEvent", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Betting = await hre.ethers.getContractFactory("BettingDapp");
    const betting = await Betting.deploy();
    console.log("inhere ");
 
    const count = await betting.getEvents();
    // const eventsTx = await betting.eventIDToEvent(count);

    console.log(count);
    // const createEvent2 = await betting.createEvent(
    //   "af bibw",
    //   "rtjibinikbrc",
    //   ["rg"],
    //   "evnibbtt",
    //   "4vibbywv",
    //   "vibibey"
    // );

    // const count2 = await betting.getEvents();
    // const eventsTx2 = await betting.eventIDToEvent(count);

    // console.log(eventsTx2);
  });
});
