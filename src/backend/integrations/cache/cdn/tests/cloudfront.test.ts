import ConcreteCloudFrontCdnClient, {
  mockCdnFolderName,
  mockObjectCreator,
} from "./implementations/concrete.cloudfront.cdn.client.class";
import CloudFrontCdnBaseClass from "../cloudfront";

describe(CloudFrontCdnBaseClass.name, () => {
  let consoleLogSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;
  let instance: CloudFrontCdnBaseClass<string>;
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
    consoleLogSpy.mockRestore();
    fetchSpy.mockRestore();
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
    (instance = new ConcreteCloudFrontCdnClient(
      mockPersistenceClient,
      mockCdnHostname
    ));

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
              `https://${mockCdnHostname}/${mockCdnFolderName}/${encodeURI(
                mockObjectName
              )}`
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
                "[CloudFront] hit rate: 100.00%"
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
              `https://${mockCdnHostname}/${mockCdnFolderName}/${encodeURI(
                mockObjectName
              )}`
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
                "[CloudFront] hit rate: 0.00%"
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
            `${instance["cacheFolderName"]}/${mockObjectName}`,
            `${mockObjectName}>Created>mockSerializedObject`,
            { ContentType: "text/plain" }
          );
        });

        it("should NOT increment the cache hit count", () => {
          expect(instance["cacheHitCount"]).toBe(0);
        });

        it("should increment the request count", () => {
          expect(instance["requestCount"]).toBe(1);
        });

        describe("logCacheHitRate", () => {
          beforeEach(() => {
            instance.logCacheHitRate();
          });

          it("should log the correct cache hit rate", () => {
            expect(consoleLogSpy).toBeCalledTimes(1);
            expect(consoleLogSpy).toBeCalledWith(
              "[CloudFront] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
