import ConcreteCdnClient, {
  mockObjectCreator,
} from "./implementations/concrete.cdn.client.class";
import CacheVendorCdnBaseClient from "../cdn.base.client.class";

describe(CacheVendorCdnBaseClient.name, () => {
  let consoleLogSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;
  let instance: CacheVendorCdnBaseClient<string>;
  let mockResponse: Response & { ok: boolean; status: number };

  const mockObjectName = "mockObjectName<>";
  const mockCdnHostname = "mockCdnHostname";
  const mockPersistenceClient = { write: jest.fn() };
  const mockHeaders = { get: jest.fn() };

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => null);
    fetchSpy = jest.spyOn(window, "fetch");
  });

  afterAll(() => {
    fetchSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: 0,
      headers: mockHeaders,
      ok: false,
      text: () => Promise.resolve("defaultValue"),
    } as unknown as Response;
    jest.mocked(window.fetch).mockResolvedValue(mockResponse);
  });

  const arrange = () =>
    (instance = new ConcreteCdnClient(mockPersistenceClient, mockCdnHostname));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("logCacheHitRate", () => {
      beforeEach(() => {
        instance.logCacheHitRate();
      });

      it("should NOT log when called without requests", () => {
        expect(consoleLogSpy).toBeCalledTimes(0);
      });
    });

    describe("query", () => {
      let result: string;

      describe("when the fetch response is 200", () => {
        beforeEach(() => {
          mockResponse.status = 200;
          mockResponse.ok = true;
        });

        describe("when the result is cached", () => {
          const response = "CachedResponse";

          beforeEach(async () => {
            mockHeaders.get.mockReturnValueOnce("Hit");
            mockResponse.text = () => Promise.resolve(response);

            result = await instance.query(mockObjectName);
          });

          it("should call fetch with the expected arguments", () => {
            expect(fetchSpy).toBeCalledTimes(1);
            expect(fetchSpy).toBeCalledWith(
              `https://mockCacheServer/${mockObjectName}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}>mockDeserializedObject`);
          });

          it("should NOT create a new object", () => {
            expect(mockObjectCreator).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toBeCalledTimes(1);
              expect(consoleLogSpy).toBeCalledWith(
                "[mockCdnClient] hit rate: 100.00%"
              );
            });
          });
        });

        describe("when the result is NOT cached", () => {
          const response = "CachedResponse";

          beforeEach(async () => {
            mockHeaders.get.mockReturnValueOnce(undefined);
            mockResponse.text = () => Promise.resolve(response);

            result = await instance.query(mockObjectName);
          });

          it("should call fetch with the expected arguments", () => {
            expect(fetchSpy).toBeCalledTimes(1);
            expect(fetchSpy).toBeCalledWith(
              `https://mockCacheServer/${mockObjectName}`
            );
          });

          it("should return the deserialized cached response", () => {
            expect(result).toBe(`${response}>mockDeserializedObject`);
          });

          it("should NOT create a new object", () => {
            expect(mockObjectCreator).toBeCalledTimes(0);
          });

          it("should NOT use the originServerClient", () => {
            expect(mockPersistenceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              instance.logCacheHitRate();
            });

            it("should log the correct cache hit rate", () => {
              expect(consoleLogSpy).toBeCalledTimes(1);
              expect(consoleLogSpy).toBeCalledWith(
                "[mockCdnClient] hit rate: 0.00%"
              );
            });
          });
        });
      });

      describe("when the fetch response is 404", () => {
        beforeEach(async () => {
          mockResponse.status = 404;
          mockResponse.ok = false;

          result = await instance.query(mockObjectName);
        });

        it("should call fetch with the expected arguments", () => {
          expect(fetchSpy).toBeCalledTimes(1);
          expect(fetchSpy).toBeCalledWith(
            `https://mockCacheServer/${mockObjectName}`
          );
        });

        it("should return the deserialized cached response", () => {
          expect(result).toBe(`${mockObjectName}>Created`);
        });

        it("should create a new object", () => {
          expect(mockObjectCreator).toBeCalledTimes(1);
          expect(mockObjectCreator).toBeCalledWith(mockObjectName);
        });

        it("should use the originServerClient", () => {
          expect(mockPersistenceClient.write).toBeCalledTimes(1);
          expect(mockPersistenceClient.write).toBeCalledWith(
            `${mockObjectName}>transformed`,
            `${mockObjectName}>Created>mockSerializedObject`,
            { ContentType: "text/plain" }
          );
        });

        describe("logCacheHitRate", () => {
          beforeEach(() => {
            instance.logCacheHitRate();
          });

          it("should log the correct cache hit rate", () => {
            expect(consoleLogSpy).toBeCalledTimes(1);
            expect(consoleLogSpy).toBeCalledWith(
              "[mockCdnClient] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
