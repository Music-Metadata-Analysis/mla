import ProfilePersistenceClient from "../profile.persistence.client.class";
import { mockPersistenceClient } from "@src/vendors/integrations/persistence/__mocks__/vendor.backend.mock";
import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { VendorProfileType } from "@src/vendors/integrations/auth/vendor.types";

jest.mock("@src/vendors/integrations/persistence/vendor.backend");

describe(ProfilePersistenceClient.name, () => {
  let instance: ProfilePersistenceClient;
  const mockPartitionName = "mockPartitionName";
  const mockEmail = "some.human.email@gmail.com";
  const mockProfile = {
    id: "123218372198379128739821",
    name: "Some Human",
    email: mockEmail,
    image: "http://path/to/profile",
    group: null,
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
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledTimes(1);
      expect(persistenceVendorBackend.PersistenceClient).toBeCalledWith(
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
          await instance.persistProfile({} as VendorProfileType);
        });

        it("should NOT call the underlying PersistenceClient", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(0);
        });
      });
    });
  });
});
