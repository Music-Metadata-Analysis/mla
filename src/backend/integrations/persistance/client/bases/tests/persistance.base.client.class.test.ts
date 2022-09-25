import PersistanceVendorBaseClass from "../persistance.base.client.class";
import type {
  PersistanceDataType,
  PersistanceClientHeaders,
} from "@src/types/integrations/persistance/vendor.types";

class MockConcretePersistanceVendor extends PersistanceVendorBaseClass {
  protected async writeImplementation(
    keyName: string,
    data: PersistanceDataType,
    headers: PersistanceClientHeaders
  ) {
    mockPersistanceClient(keyName, data, headers);
  }
}

const mockPersistanceClient = jest.fn();

describe(PersistanceVendorBaseClass.name, () => {
  let instance: PersistanceVendorBaseClass;
  const mockPartition = "mockPartition";
  const mockKeyName = "mockKeyName";
  const mockStringData = "mockStringData";
  const mockError = new Error("MockError");
  const mockConsoleError = jest.fn();
  const originalConsoleError = console.error;

  afterAll(() => (console.error = originalConsoleError));

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = mockConsoleError;
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
          expect(mockConsoleError).toBeCalledTimes(1);
          expect(mockConsoleError).toBeCalledWith(
            `ERROR: could not save object '${mockKeyName}'.`
          );
        });
      });
    });
  });
});
