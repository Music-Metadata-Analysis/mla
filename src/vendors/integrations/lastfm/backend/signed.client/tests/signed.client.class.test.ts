import LastFMSignedClient from "../signed.client.class";
import config from "@src/config/lastfm";

describe(LastFMSignedClient.name, () => {
  let instance: LastFMSignedClient;
  let fetchSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  const mockSigningKey = "mockSigningKey";

  const mockLastFmApiKey = "mockLastFmApiKey";
  const mockLastFmSharedSecret = "mockLastFmSharedSecret";
  const mockLastFmResponse = { mock: "response" };

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => null);
    fetchSpy = jest.spyOn(window, "fetch");
    jest.clearAllMocks();
  });

  const arrange = () =>
    (instance = new LastFMSignedClient(
      mockLastFmApiKey,
      mockLastFmSharedSecret
    ));

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("signedRequest", () => {
      let result: Response | undefined;
      let method: "auth.getSession" | "user.getInfo";
      let params: [string, string][];
      let sk: string | undefined;
      let expectedSignature: string;

      const callMethod = async () => {
        result = undefined;
        result = await instance.signedRequest({
          method,
          params,
          sk,
        });
      };

      const expectedError = () =>
        `(${LastFMSignedClient.name}) Unable to call last.fm api method: '${method}' !`;

      const expectedUrl = () => {
        const searchParams = new URLSearchParams();
        params
          .sort(([ak], [bk]) => {
            if (ak < bk) {
              return -1;
            } else if (ak > bk) {
              return 1;
            }
            return 0;
          })
          .forEach(([k, v]) => {
            searchParams.append(k, v);
          });
        let searchParamsString = searchParams.toString();
        let signingKey = "";
        if (searchParamsString) {
          searchParamsString = "&" + searchParamsString;
        }
        if (sk) {
          signingKey = `&sk=${sk}`;
        }
        return `${config.apiRoot}?method=${method}&api_key=${mockLastFmApiKey}${searchParamsString}${signingKey}&api_sig=${expectedSignature}&format=json`;
      };

      describe("with a valid lastfm response", () => {
        beforeEach(() => {
          fetchSpy.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockLastFmResponse),
          });
        });

        describe("with a valid test Method", () => {
          beforeEach(() => (method = "auth.getSession"));

          describe("with a set of params", () => {
            beforeEach(
              () =>
                (params = [
                  ["c", "value1"],
                  ["a", "value2"],
                  ["a", "value3"],
                  ["b", "value13"],
                ])
            );

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "02ea7ee674be195e3a3bab065421b70c";

                await callMethod();
              });

              it("should return a result", () => {
                expect(result).toBeDefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should return the expected response", async () => {
                expect(await result?.json()).toBe(mockLastFmResponse);
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "4674b14b2dad47bde5bd8b21fb15700c";

                await callMethod();
              });

              it("should return a result", () => {
                expect(result).toBeDefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should return the expected response", async () => {
                expect(await result?.json()).toBe(mockLastFmResponse);
              });
            });
          });

          describe("without a set of params", () => {
            beforeEach(() => (params = []));

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "ae800b9112c19b4b3d6ae5f64b4f6d3c";

                await callMethod();
              });

              it("should return a result", () => {
                expect(result).toBeDefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should return the expected response", async () => {
                expect(await result?.json()).toBe(mockLastFmResponse);
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "cc4a3fb9e5c6c68cd19086e4161321ff";

                await callMethod();
              });

              it("should return a result", () => {
                expect(result).toBeDefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should return the expected response", async () => {
                expect(await result?.json()).toBe(mockLastFmResponse);
              });
            });
          });
        });
      });

      describe("with an invalid lastfm response", () => {
        let thrownError: Error;

        beforeEach(() => {
          fetchSpy.mockResolvedValue({
            ok: false,
            json: () => Promise.resolve(mockLastFmResponse),
          });
        });

        describe("with a valid test Method", () => {
          beforeEach(() => (method = "auth.getSession"));

          describe("with a set of params", () => {
            beforeEach(
              () =>
                (params = [
                  ["c", "value1"],
                  ["a", "value2"],
                  ["a", "value3"],
                  ["b", "value13"],
                ])
            );

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "02ea7ee674be195e3a3bab065421b70c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "4674b14b2dad47bde5bd8b21fb15700c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });
          });

          describe("without a set of params", () => {
            beforeEach(() => (params = []));

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "ae800b9112c19b4b3d6ae5f64b4f6d3c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "cc4a3fb9e5c6c68cd19086e4161321ff";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should NOT log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(0);
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });
          });
        });
      });

      describe("with a network error during the lastfm response", () => {
        let thrownError: Error;

        const getNetworkError = () =>
          `(${LastFMSignedClient.name}) Network error calling last.fm api method: '${method}' !`;

        beforeEach(() => {
          fetchSpy.mockRejectedValue({});
        });

        describe("with a valid test Method", () => {
          beforeEach(() => (method = "auth.getSession"));

          describe("with a set of params", () => {
            beforeEach(
              () =>
                (params = [
                  ["c", "value1"],
                  ["a", "value2"],
                  ["a", "value3"],
                  ["b", "value13"],
                ])
            );

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "02ea7ee674be195e3a3bab065421b70c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(1);
                expect(errorSpy).toHaveBeenCalledWith(getNetworkError());
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "4674b14b2dad47bde5bd8b21fb15700c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(1);
                expect(errorSpy).toHaveBeenCalledWith(getNetworkError());
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });
          });

          describe("without a set of params", () => {
            beforeEach(() => (params = []));

            describe("with a signing key", () => {
              beforeEach(async () => {
                sk = mockSigningKey;
                expectedSignature = "ae800b9112c19b4b3d6ae5f64b4f6d3c";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(1);
                expect(errorSpy).toHaveBeenCalledWith(getNetworkError());
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });

            describe("without a signing key", () => {
              beforeEach(async () => {
                sk = undefined;
                expectedSignature = "cc4a3fb9e5c6c68cd19086e4161321ff";

                try {
                  await callMethod();
                } catch (err) {
                  thrownError = err as Error;
                }
              });

              it("should NOT return a result", () => {
                expect(result).toBeUndefined();
              });

              it("should log an error", () => {
                expect(errorSpy).toHaveBeenCalledTimes(1);
                expect(errorSpy).toHaveBeenCalledWith(getNetworkError());
              });

              it("should call fetch with the expected params", () => {
                expect(fetchSpy).toHaveBeenCalledTimes(1);
                expect(fetchSpy).toHaveBeenCalledWith(expectedUrl());
              });

              it("should throw the expected error", async () => {
                expect(thrownError.message).toBe(expectedError());
              });
            });
          });
        });
      });
    });
  });
});
