import HttpApiClient from "../http.client.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import * as status from "@src/config/status";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";

describe("HttpApiClient", () => {
  let client: HttpApiClient;

  const remotesite = "https://remotesite.com/";
  type responseType = { success: boolean };
  const mockFetchParams = {
    credentials: "same-origin",
    mode: "cors",
    referrerPolicy: "same-origin",
  };

  beforeAll(() => {
    jest.spyOn(window, "fetch");
  });

  afterAll(() => jest.restoreAllMocks());

  afterEach(() => jest.clearAllMocks());

  const setupFetch = (
    {
      success,
      status,
    }: {
      success: boolean;
      status: number;
    },
    headers: [string, string][] = []
  ) => {
    (window.fetch as jest.Mock).mockResolvedValueOnce({
      status,
      headers,
      url: remotesite,
      ok: success,
      json: async () => ({ success }),
    });
  };

  const setupFetchWithNetworkError = () => {
    (window.fetch as jest.Mock).mockResolvedValueOnce(() => {
      throw Error("Mock Error!");
    });
  };

  describe("with no configured status codes", () => {
    beforeEach(() => (client = new HttpApiClient({})));

    describe("get", () => {
      const getParams = {
        ...mockFetchParams,
        cache: "default",
        method: "GET",
      };

      const arrange = () => {
        return client.request<responseType>(remotesite);
      };

      describe("when an 'ok' status is returned", () => {
        beforeEach(() => setupFetch({ success: true, status: 200 }));

        it("should call the underlying fetch function correctly", async () => {
          await arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should return a success message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: true,
            status: 200,
            headers: {},
            response: { success: true },
          });
        });
      });

      describe.each([[401], [404], [503]])(
        "when any failed status code is returned (%s)",
        (expectedStatus) => {
          beforeEach(() =>
            setupFetch({ success: false, status: expectedStatus })
          );

          it("should call the underlying fetch function correctly", () => {
            arrange().catch(() => null);
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(remotesite, getParams);
          });

          it("should throw the correct error message", async () => {
            const test = async () => arrange();
            expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
          });
        }
      );

      describe("when a network error occurs", () => {
        beforeEach(() => setupFetchWithNetworkError());

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => arrange();
          expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
        });
      });
    });

    describe("post", () => {
      const postParams = {
        ...mockFetchParams,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST" as HttpApiClientHttpMethodType,
        cache: "no-cache",
        body: JSON.stringify({ test: "post body" }),
      };

      const arrange = () => {
        return client.request<responseType>(remotesite, {
          method: postParams.method,
          cache: "no-cache",
          body: JSON.parse(postParams.body),
        });
      };

      describe("when an 'ok' status is returned", () => {
        beforeEach(() => setupFetch({ success: true, status: 200 }));

        it("should call the underlying fetch function correctly", async () => {
          await arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should return a success message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: true,
            status: 200,
            headers: {},
            response: { success: true },
          });
        });
      });

      describe.each([[401], [404], [503]])(
        "when any failed status is returned (%s)",
        (expectedStatus) => {
          beforeEach(() =>
            setupFetch({ success: false, status: expectedStatus })
          );

          it("should call the underlying fetch function correctly", () => {
            arrange().catch(() => null);
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(remotesite, postParams);
          });

          it("should throw the correct error message", async () => {
            const test = async () => arrange();
            expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
          });
        }
      );

      describe("when a network error occurs", () => {
        beforeEach(() => setupFetchWithNetworkError());

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => arrange();
          expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
        });
      });
    });
  });

  describe("with lastfm status codes configured", () => {
    beforeEach(
      () => (client = new HttpApiClient(proxyFailureStatusCodes.lastfm))
    );

    describe("get", () => {
      const getParams = {
        ...mockFetchParams,
        cache: "default",
        method: "GET",
      };

      const arrange = () => {
        return client.request<responseType>(remotesite);
      };

      describe("when an 'ok' status is returned", () => {
        beforeEach(() => setupFetch({ success: true, status: 200 }));

        it("should call the underlying fetch function correctly", async () => {
          await arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should return a success message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: true,
            status: 200,
            headers: {},
            response: { success: true },
          });
        });
      });

      describe.each(Object.entries(proxyFailureStatusCodes.lastfm))(
        "when any configured failed status code is returned (%s)",
        (expectedStatus, expectedStatusMessage) => {
          beforeEach(() =>
            setupFetch({ success: false, status: parseInt(expectedStatus) })
          );

          it("should call the underlying fetch function correctly", () => {
            arrange();
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(remotesite, getParams);
          });

          it("should return the correct error message", async () => {
            const response = await arrange();
            expect(response).toStrictEqual({
              ok: false,
              status: parseInt(expectedStatus),
              headers: {},
              response: expectedStatusMessage,
            });
          });
        }
      );

      describe("when a '503' status code is returned with a valid retry header", () => {
        beforeEach(() =>
          setupFetch({ success: false, status: 503 }, [["retry-after", "0"]])
        );

        it("should call the underlying fetch function correctly", () => {
          arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should return the correct error message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: false,
            status: 503,
            headers: { "retry-after": "0" },
            response: status.STATUS_503_MESSAGE,
          });
        });
      });

      describe("when a failed status is returned with an unrecognized status code", () => {
        beforeEach(() => setupFetch({ success: false, status: 400 }));

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => await arrange();
          expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
        });
      });

      describe("when a network error occurs", () => {
        beforeEach(() => setupFetchWithNetworkError());

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, getParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => arrange();
          expect(test).rejects.toThrow(`${getParams.method}: ${remotesite}`);
        });
      });
    });

    describe("post", () => {
      const postParams = {
        ...mockFetchParams,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST" as HttpApiClientHttpMethodType,
        cache: "no-cache",
        body: JSON.stringify({ test: "post body" }),
      };

      const arrange = () => {
        return client.request<responseType>(remotesite, {
          method: postParams.method,
          cache: "no-cache",
          body: JSON.parse(postParams.body),
        });
      };

      describe("when an 'ok' status is returned", () => {
        beforeEach(() => setupFetch({ success: true, status: 200 }));

        it("should call the underlying fetch function correctly", async () => {
          await arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should return a success message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: true,
            status: 200,
            headers: {},
            response: { success: true },
          });
        });
      });

      describe.each(Object.entries(proxyFailureStatusCodes.lastfm))(
        "when any configured failed status code is returned (%s)",
        (expectedStatus, expectedStatusMessage) => {
          beforeEach(() =>
            setupFetch({ success: false, status: parseInt(expectedStatus) })
          );

          it("should call the underlying fetch function correctly", () => {
            arrange();
            expect(fetch).toBeCalledTimes(1);
            expect(fetch).toBeCalledWith(remotesite, postParams);
          });

          it("should return the correct error message", async () => {
            const response = await arrange();
            expect(response).toStrictEqual({
              ok: false,
              status: parseInt(expectedStatus),
              headers: {},
              response: expectedStatusMessage,
            });
          });
        }
      );

      describe("when a '503' status code is returned", () => {
        beforeEach(() =>
          setupFetch({ success: false, status: 503 }, [["retry-after", "0"]])
        );

        it("should call the underlying fetch function correctly", () => {
          arrange();
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should return the correct error message", async () => {
          const response = await arrange();
          expect(response).toStrictEqual({
            ok: false,
            status: 503,
            headers: { "retry-after": "0" },
            response: status.STATUS_503_MESSAGE,
          });
        });
      });

      describe("when a 'not ok' status is returned with an unrecognized status code", () => {
        beforeEach(() => setupFetch({ success: false, status: 400 }));

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => await arrange();
          expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
        });
      });

      describe("when a network error occurs", () => {
        beforeEach(() => setupFetchWithNetworkError());

        it("should call the underlying fetch function correctly", () => {
          arrange().catch(() => null);
          expect(fetch).toBeCalledTimes(1);
          expect(fetch).toBeCalledWith(remotesite, postParams);
        });

        it("should throw the correct error message", async () => {
          const test = async () => arrange();
          expect(test).rejects.toThrow(`${postParams.method}: ${remotesite}`);
        });
      });
    });
  });
});
