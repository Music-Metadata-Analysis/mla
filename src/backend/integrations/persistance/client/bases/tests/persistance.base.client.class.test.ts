import MockConcretePersistanceVendor, {
  mockPersistanceClient,
} from "./implementations/concrete.persistance.client.class";
import PersistanceVendorBaseClass from "../persistance.base.client.class";

describe(PersistanceVendorBaseClass.name, () => {
  let consoleErrorSpy: jest.SpyInstance;
  let instance: PersistanceVendorBaseClass;

  const mockPartition = "mockPartition";
  const mockKeyName = "mockKeyName";
  const mockStringData = "mockStringData";
  const mockError = new Error("MockError");

  beforeAll(() => {
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => null);
  });

  afterAll(() => consoleErrorSpy.mockReset());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () =>
    (instance = new MockConcretePersistanceVendor(mockPartition));

  describe("when initialized with a concrete implementation", () => {
    beforeEach(() => arrange());

    describe("write", () => {
      describe("when NO error is thrown", () => {
        beforeEach(() =>
          instance.write(mockKeyName, mockStringData, {
            ContentType: "application/json",
          })
        );

        it("should call the mockPersistanceClient client with the correct arguments", () => {
          expect(mockPersistanceClient).toBeCalledTimes(1);
          expect(mockPersistanceClient).toBeCalledWith(
            mockKeyName,
            mockStringData,
            {
              ContentType: "application/json",
            }
          );
        });
      });

      describe("when an error is thrown", () => {
        let thrown: Error;

        beforeEach(async () => {
          mockPersistanceClient.mockImplementationOnce(() => {
            throw mockError;
          });
          try {
            await instance.write(mockKeyName, mockStringData, {
              ContentType: "application/json",
            });
          } catch (err) {
            thrown = err as Error;
          }
        });

        it("should call the mockPersistanceClient client with the correct arguments", () => {
          expect(mockPersistanceClient).toBeCalledTimes(1);
          expect(mockPersistanceClient).toBeCalledWith(
            mockKeyName,
            mockStringData,
            {
              ContentType: "application/json",
            }
          );
        });

        it("should return the correct result", async () => {
          expect(thrown).toBe(mockError);
        });

        it("should log the error as expected", async () => {
          expect(consoleErrorSpy).toBeCalledTimes(1);
          expect(consoleErrorSpy).toBeCalledWith(
            `ERROR: could not save object '${mockKeyName}'.`
          );
        });
      });
    });
  });
});
