import ProfilePersistenceClient from "../profile.persistence.client.class";
import { mockPersistenceClient } from "@src/backend/integrations/persistence/__mocks__/vendor.mock";
import persistenceVendor from "@src/backend/integrations/persistence/vendor";

jest.mock("@src/backend/integrations/persistence/vendor");

describe(ProfilePersistenceClient.name, () => {
  let instance: ProfilePersistenceClient;
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
    instance = new ProfilePersistenceClient(mockPartitionName);
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should initialize the underlying PersistenceClient correctly", () => {
      expect(persistenceVendor.PersistenceClient).toBeCalledTimes(1);
      expect(persistenceVendor.PersistenceClient).toBeCalledWith(
        mockPartitionName
      );
    });

    describe("persistProfile", () => {
      describe("when called with a valid profile", () => {
        beforeEach(async () => {
          await instance.persistProfile(mockProfile);
        });

        it("should call the underlying PersistenceClient as expected", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(1);
          expect(mockPersistenceClient.write).toBeCalledWith(
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

        it("should NOT call the underlying PersistenceClient", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(0);
        });
      });
    });
  });
});