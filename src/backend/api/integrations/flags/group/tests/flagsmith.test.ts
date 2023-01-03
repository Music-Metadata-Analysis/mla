import FlagSmithGroup from "../flagsmith";

describe(FlagSmithGroup.name, () => {
  let instance: FlagSmithGroup;
  let identifier: string | undefined;
  let result: string | null;
  const mockGroupHash = {
    identifier1: "group1",
  };

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new FlagSmithGroup(mockGroupHash));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("with a valid identifier", () => {
      beforeEach(() => (identifier = "identifier1"));

      describe("getFromIdentifier", () => {
        beforeEach(() => (result = instance.getFromIdentifier(identifier)));

        it("should return the group", () => {
          expect(result).toBe("group1");
        });
      });
    });

    describe("with an invalid identifier", () => {
      beforeEach(() => (identifier = "identifier2"));

      describe("getFromIdentifier", () => {
        beforeEach(() => (result = instance.getFromIdentifier(identifier)));

        it("should return null", () => {
          expect(result).toBeNull();
        });
      });
    });

    describe("with no identifier", () => {
      beforeEach(() => (identifier = undefined));

      describe("getFromIdentifier", () => {
        beforeEach(() => (result = instance.getFromIdentifier(identifier)));

        it("should return null", () => {
          expect(result).toBeNull();
        });
      });
    });
  });
});
