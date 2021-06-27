import { voidFn, voidFnWithArg } from "../voids";

describe("when the voidFn function is used", () => {
  it("should return a null", () => {
    expect(voidFn()).toBeNull();
  });
});

describe("when the voidFnWithArg function is used", () => {
  it("should return a null", () => {
    expect(voidFnWithArg("anything")).toBeNull();
  });
});
