import { voidFn } from "../voids";

describe("when the voidFn function is used", () => {
  it("should return a null", () => {
    expect(voidFn()).toBeNull();
  });
});
