import { PHASE_PRODUCTION_BUILD } from "next/constants";
import isNextBuildTime from "../next";

describe("When node is running at next build time", () => {
  const originalEnvironment = process.env;

  beforeAll(() => {
    process.env.NEXT_PHASE = PHASE_PRODUCTION_BUILD;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isNextBuildTime", () => {
    it("should return true", () => {
      expect(isNextBuildTime()).toBeTruthy();
    });
  });
});

describe("When node is running outside of next build time", () => {
  const originalEnvironment = process.env;

  beforeAll(() => {
    process.env.NEXT_PHASE = "NOT_BUILD_TIME";
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isNextBuildTime", () => {
    it("should return false", () => {
      expect(isNextBuildTime()).toBeFalsy();
    });
  });
});
