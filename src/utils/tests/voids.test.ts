import { voidFn } from "../voids";

describe("voidFn", () => {
  it("should return a null", () => {
    expect(voidFn()).toBeNull();
  });
});
