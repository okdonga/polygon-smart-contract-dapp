import { decimalCount } from "../";

describe("Function weiToEther", () => {
  it("formats wei to ether", () => {
    expect(decimalCount(0.18)).toEqual(2);
    expect(decimalCount(0.00018)).toEqual(5);
    expect(decimalCount(parseFloat("0.00018000"))).toEqual(5);
    expect(decimalCount(parseFloat("0.000000"))).toEqual(0);
    expect(decimalCount(0)).toEqual(0);
    expect(decimalCount(1)).toEqual(0);
  });
});
