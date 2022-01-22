import {
  weiToEther,
  etherToWei,
  weiToUnit,
  weiToEtherAtFixedDecimal,
} from "../";

describe("Function weiToEther", () => {
  it("formats wei to ether", () => {
    expect(weiToEther("18000000000000000000")).toEqual("18.0");
    expect(weiToEther("18123000000000000000")).toEqual("18.123");
    expect(weiToEther("18123456789999999999")).toEqual("18.123456789999999999");
    expect(weiToEther("18000000000")).toEqual("0.000000018");
  });
});

describe("Function etherToWei", () => {
  it("formats ether to wei", () => {
    expect(etherToWei("18.0").toString()).toEqual("18000000000000000000");
    expect(etherToWei("18.123").toString()).toEqual("18123000000000000000");
    expect(etherToWei("18.123456789999999999").toString()).toEqual(
      "18123456789999999999"
    );
    expect(etherToWei("0.000000018").toString()).toEqual("18000000000");
  });
});

describe("Function weiToUnit", () => {
  it("formats wei to custom units", () => {
    expect(weiToUnit("18000000000000000000", 6)).toEqual("18000000000000.0");
    expect(weiToUnit("18000000000000000000", 10)).toEqual("1800000000.0");
    expect(weiToUnit("18000000000000000000", 15)).toEqual("18000.0");
    expect(weiToUnit("18000000000000000000", 18)).toEqual("18.0");
    expect(weiToUnit("18000000000000000000", 19)).toEqual("1.8");
    expect(weiToUnit("18000000000000000000", "gwei")).toEqual(
      weiToUnit("18000000000000000000", 9)
    );
  });
});

describe("Function weiToEtherAtFixedDecimal", () => {
  expect(weiToEtherAtFixedDecimal("18000000000000000000", 4)).toEqual(
    "18.0000"
  );
  expect(weiToEtherAtFixedDecimal("18123000000000000000", 2)).toEqual("18.12");
  expect(weiToEtherAtFixedDecimal("18123456789999999999", 1)).toEqual("18.1");
  expect(weiToEtherAtFixedDecimal("18000000000", 0)).toEqual("0");
});
