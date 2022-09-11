import { readFlag } from "../flag";
import type { useFlags } from "flagsmith/react";

describe("readFlag", () => {
  let flagName: string | undefined | null;
  let flagState: ReturnType<typeof useFlags>;
  let flagEnabled: boolean;

  describe("when the flag has a name", () => {
    beforeEach(() => (flagName = "testFlag"));

    describe("when the flag is ENABLED", () => {
      beforeEach(() => (flagEnabled = true));

      describe("when the flag is in configuration", () => {
        beforeEach(
          () =>
            (flagState = {
              testFlag: {
                enabled: flagEnabled,
                value: "",
              } as { enabled: boolean; value: string } & true,
            })
        );

        it("should return the true", () => {
          expect(readFlag(flagName, flagState)).toBe(true);
        });
      });

      describe("when the flag is NOT in configuration", () => {
        beforeEach(() => (flagState = {}));

        it("should return the false", () => {
          expect(readFlag(flagName, flagState)).toBe(false);
        });
      });
    });

    describe("when the flag is DISABLED", () => {
      beforeEach(() => (flagEnabled = false));

      describe("when the flag is in configuration", () => {
        beforeEach(
          () =>
            (flagState = {
              testFlag: {
                enabled: flagEnabled,
                value: "",
              } as { enabled: boolean; value: string } & true,
            })
        );

        it("should return the false", () => {
          expect(readFlag(flagName, flagState)).toBe(false);
        });
      });

      describe("when the flag is NOT in configuration", () => {
        beforeEach(() => (flagState = {}));

        it("should return the false", () => {
          expect(readFlag(flagName, flagState)).toBe(false);
        });
      });
    });
  });

  describe("when the flag has no name", () => {
    beforeEach(() => (flagName = null));

    describe("when the flag is NOT in configuration", () => {
      beforeEach(() => (flagState = {}));

      it("should return the false", () => {
        expect(readFlag(flagName, flagState)).toBe(false);
      });
    });
  });
});
