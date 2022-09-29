import ProfilePersistanceClient from "../profile.persistance.client.class";
import { mockPersistanceClient } from "@src/backend/integrations/persistance/__mocks__/vendor.mock";
import persistanceVendor from "@src/backend/integrations/persistance/vendor";

jest.mock("@src/backend/integrations/persistance/vendor");

describe(ProfilePersistanceClient.name, () => {
  let instance: ProfilePersistanceClient;
  const mockPartitionName = "mockPartitionName";
  const mockEmail = "some.human.email@gmail.com";
  const mockProfile = {
    id: "123218372198379128739821",
    name: "Some Human",
    email: mockEmail,
    image: "http://path/to/profile",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    instance = new ProfilePersistanceClient(mockPartitionName);
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should initialize the underlying PersistanceClient correctly", () => {
      expect(persistanceVendor.PersistanceClient).toBeCalledTimes(1);
      expect(persistanceVendor.PersistanceClient).toBeCalledWith(
        mockPartitionName
      );
    });

    describe("persistProfile", () => {
      describe("when called with a valid profile", () => {
        beforeEach(async () => {
          await instance.persistProfile(mockProfile);
        });

        it("should call the underlying PersistanceClient as expected", () => {
          expect(mockPersistanceClient.write).toBeCalledTimes(1);
          expect(mockPersistanceClient.write).toBeCalledWith(
            mockProfile.email,
            mockProfile,
            { ContentType: "application/json" }
          );
        });
      });

      describe("when called with an invalid profile", () => {
        beforeEach(async () => {
          await instance.persistProfile({});
        });

        it("should NOT call the underlying PersistanceClient", () => {
          expect(mockPersistanceClient.write).toBeCalledTimes(0);
        });
      });
    });
  });
});