import VendorCdnBaseClient from "../vendor.cdn.base.client.class";

const mockObjectCreator = jest.fn((objectName: string) => {
  return Promise.resolve(`${objectName}>Created`);
});

class ConcreteVendorCdnClient extends VendorCdnBaseClient<string> {
  cacheTypeName = "mockCdnClient";

  protected createNewObject(objectName: string): Promise<string> {
    return mockObjectCreator(objectName);
  }
  protected deserializeObjectForJavascript(serializedObject: string): string {
    return `${serializedObject}>mockDeserializedObject`;
  }
  protected isCachedResponse(response: Response): boolean {
    return response.headers.get("mockHeader") == "Hit";
  }
  protected getKeyName(objectName: string): string {
    return `${objectName}>transformed`;
  }
  protected getOriginServerUrlFromObjectName(objectName: string): string {
    return `https://mockCacheServer/${objectName}`;
  }
  protected serializeObjectForStorage(deserializedObject: string): string {
    return `${deserializedObject}>mockSerializedObject`;
  }
}

describe(VendorCdnBaseClient.name, () => {
  const mockObjectName = "mockObjectName<>";
  const mockCdnHostname = "mockCdnHostname";
  const mockPersistanceClient = { write: jest.fn() };
  const mockHeaders = { get: jest.fn() };
  const originalConsoleLog = console.log;
  const mockConsoleLog = jest.fn();
  let instance: VendorCdnBaseClient<string>;
  let mockFetch: jest.SpyInstance;
  let mockResponse: {
    status: number;
    headers: { get: () => string | undefined };
    ok: boolean;
    text: () => Promise<string>;
  };

  beforeAll(() => (mockFetch = jest.spyOn(window, "fetch")));

  afterAll(() => mockFetch.mockRestore());

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: 0,
      headers: mockHeaders,
      ok: false,
      text: () => Promise.resolve("defaultValue"),
    };
    jest.mocked(window.fetch as jest.Mock).mockResolvedValue(mockResponse);
  });

  const arrange = () =>
    (instance = new ConcreteVendorCdnClient(
      mockPersistanceClient,
      mockCdnHostname
    ));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("logCacheHitRate", () => {
      beforeEach(() => {
        console.log = mockConsoleLog;

        instance.logCacheHitRate();
      });

      afterEach(() => (console.log = originalConsoleLog));

      it("should NOT log when called without requests", () => {
        expect(mockConsoleLog).toBeCalledTimes(0);
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
            expect(mockFetch).toBeCalledTimes(1);
            expect(mockFetch).toBeCalledWith(
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
            expect(mockPersistanceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              console.log = mockConsoleLog;

              instance.logCacheHitRate();
            });

            afterEach(() => (console.log = originalConsoleLog));

            it("should log the correct cache hit rate", () => {
              expect(mockConsoleLog).toBeCalledTimes(1);
              expect(mockConsoleLog).toBeCalledWith(
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
            expect(mockFetch).toBeCalledTimes(1);
            expect(mockFetch).toBeCalledWith(
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
            expect(mockPersistanceClient.write).toBeCalledTimes(0);
          });

          describe("logCacheHitRate", () => {
            beforeEach(() => {
              console.log = mockConsoleLog;

              instance.logCacheHitRate();
            });

            afterEach(() => (console.log = originalConsoleLog));

            it("should log the correct cache hit rate", () => {
              expect(mockConsoleLog).toBeCalledTimes(1);
              expect(mockConsoleLog).toBeCalledWith(
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
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockFetch).toBeCalledWith(
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
          expect(mockPersistanceClient.write).toBeCalledTimes(1);
          expect(mockPersistanceClient.write).toBeCalledWith(
            `${mockObjectName}>transformed`,
            `${mockObjectName}>Created>mockSerializedObject`,
            { ContentType: "text/plain" }
          );
        });

        describe("logCacheHitRate", () => {
          beforeEach(() => {
            console.log = mockConsoleLog;

            instance.logCacheHitRate();
          });

          afterEach(() => (console.log = originalConsoleLog));

          it("should log the correct cache hit rate", () => {
            expect(mockConsoleLog).toBeCalledTimes(1);
            expect(mockConsoleLog).toBeCalledWith(
              "[mockCdnClient] hit rate: 0.00%"
            );
          });
        });
      });
    });
  });
});
