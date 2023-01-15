import { isTest, isProduction } from "../env";
import type { MutableEnv } from "@src/utilities/types/process.types";

describe("When node is running in production mode", () => {
  let originalEnvironment: MutableEnv;

  beforeAll(() => {
    originalEnvironment = process.env;
    (process.env as MutableEnv).NODE_ENV = "production";
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isProduction", () => {
    it("should return true", () => {
      expect(isProduction()).toBeTruthy();
    });
  });

  describe("isTest", () => {
    it("should return false", () => {
      expect(isTest()).toBeFalsy();
    });
  });
});

describe("When node is running in test mode", () => {
  let originalEnvironment: typeof process.env;

  beforeAll(() => {
    originalEnvironment = process.env;
    (process.env as MutableEnv).NODE_ENV = "test";
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  describe("isProduction", () => {
    it("should return false", () => {
      expect(isProduction()).toBeFalsy();
    });
  });

  describe("isTest", () => {
    it("should return true", () => {
      expect(isTest()).toBeTruthy();
    });
  });
});
