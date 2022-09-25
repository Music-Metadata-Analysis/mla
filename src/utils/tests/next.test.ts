import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { isBuildTime } from "../next";
import type { MutableEnv } from "@src/types/process.types";

describe("When node is running at next build time", () => {
  const originalEnvironment = process.env;

  beforeAll(() => {
    (process.env as MutableEnv).NEXT_PHASE = PHASE_PRODUCTION_BUILD;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isBuildTime", () => {
    it("should return true", () => {
      expect(isBuildTime()).toBeTruthy();
    });
  });
});

describe("When node is running outside of next build time", () => {
  const originalEnvironment = process.env;

  beforeAll(() => {
    (process.env as MutableEnv).NEXT_PHASE = "NOT_BUILD_TIME";
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isBuildTime", () => {
    it("should return false", () => {
      expect(isBuildTime()).toBeFalsy();
    });
  });
});
