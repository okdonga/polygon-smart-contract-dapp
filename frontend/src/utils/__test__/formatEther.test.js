import { expect } from "chai";
import {
  weiToEther,
  etherToWei,
  weiToUnit,
  weiToEtherAtFixedDecimal,
} from "../formatEther";

describe("Function weiToEther", () => {
  it("formats wei to ether", () => {
    expect(weiToEther("18000000000000000000")).equal("18.0");
    expect(weiToEther("18123000000000000000")).equal("18.123");
    expect(weiToEther("18123456789999999999")).equal("18.123456789999999999");
    expect(weiToEther("18000000000")).equal("0.000000018");
  });
});

describe("Function etherToWei", () => {
  it("formats ether to wei", () => {
    expect(etherToWei("18.0").toString()).equal("18000000000000000000");
    expect(etherToWei("18.123").toString()).equal("18123000000000000000");
    expect(etherToWei("18.123456789999999999").toString()).equal(
      "18123456789999999999"
    );
    expect(etherToWei("0.000000018").toString()).equal("18000000000");

    // if more than 18 decimals
    try {
      etherToWei("0.00000000000000000000000000000018");
    } catch (err) {
      expect(err.reason).equal("fractional component exceeds decimals");
    }
  });
});

describe("Function weiToUnit", () => {
  it("formats wei to custom units", () => {
    expect(weiToUnit("18000000000000000000", 6)).equal("18000000000000.0");
    expect(weiToUnit("18000000000000000000", 10)).equal("1800000000.0");
    expect(weiToUnit("18000000000000000000", 15)).equal("18000.0");
    expect(weiToUnit("18000000000000000000", 18)).equal("18.0");
    expect(weiToUnit("18000000000000000000", 19)).equal("1.8");
    expect(weiToUnit("18000000000000000000", "gwei")).equal(
      weiToUnit("18000000000000000000", 9)
    );
  });
});

describe("Function weiToEtherAtFixedDecimal", () => {
  it("fff", () => {
    expect(weiToEtherAtFixedDecimal("18000000000000000000", 4)).equal(
      "18.0000"
    );
    expect(weiToEtherAtFixedDecimal("18123000000000000000", 2)).equal("18.12");
    expect(weiToEtherAtFixedDecimal("18123456789999999999", 1)).equal("18.1");
    expect(weiToEtherAtFixedDecimal("18000000000", 0)).equal("0");
  });
});
